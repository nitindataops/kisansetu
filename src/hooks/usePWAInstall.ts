import { useEffect, useState } from 'react';

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

// Module-level global store to capture early browser events before React hooks mount
let globalDeferredPrompt: BeforeInstallPromptEvent | null = null;
let globalAppInstalled = false;

if (typeof window !== 'undefined') {
  // Capture early beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    globalDeferredPrompt = e as BeforeInstallPromptEvent;
    window.dispatchEvent(new CustomEvent('kisansetu:pwa-prompt-ready'));
  });

  // Capture early appinstalled event
  window.addEventListener('appinstalled', () => {
    globalAppInstalled = true;
    globalDeferredPrompt = null;
    try {
      localStorage.setItem('kisansetu_pwa_installed', 'true');
    } catch {
      // Ignore storage errors
    }
    window.dispatchEvent(new CustomEvent('kisansetu:pwa-installed'));
  });
}

// Helper to accurately detect if currently running inside an installed PWA window/standalone mode
export function isRunningStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    window.matchMedia('(display-mode: minimal-ui)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(() => globalDeferredPrompt);
  const [isInstalled, setIsInstalled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return isRunningStandalone() || globalAppInstalled;
  });

  const [isIOS, setIsIOS] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent) && !(window as any).MSStream;
  });

  const [isSupported, setIsSupported] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua) && !(window as any).MSStream;
    const isChromium = !!(window as any).chrome || ua.includes('chrome') || ua.includes('crios') || ua.includes('edg') || ua.includes('android');
    // If Firefox on desktop, PWA installation is not supported
    const isDesktopFirefox = ua.includes('firefox') && !ua.includes('mobile') && !ua.includes('android');
    return !isDesktopFirefox && (isIosDevice || isChromium || !!globalDeferredPrompt);
  });

  useEffect(() => {
    // Detect standalone mode (already installed or running in PWA window)
    const checkInstalled = () => {
      const isStandalone = isRunningStandalone();
      setIsInstalled(isStandalone || globalAppInstalled);
    };
    checkInstalled();

    // Detect iOS devices
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    const isDesktopFirefox = userAgent.includes('firefox') && !userAgent.includes('mobile') && !userAgent.includes('android');
    const isChromium = !!(window as any).chrome || userAgent.includes('chrome') || userAgent.includes('crios') || userAgent.includes('edg') || userAgent.includes('android');
    setIsSupported(!isDesktopFirefox && (isIOSDevice || isChromium || !!globalDeferredPrompt));

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      globalDeferredPrompt = e as BeforeInstallPromptEvent;
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      globalAppInstalled = true;
      globalDeferredPrompt = null;
      setIsInstalled(true);
      setDeferredPrompt(null);
      try {
        localStorage.setItem('kisansetu_pwa_installed', 'true');
      } catch {
        // Ignore
      }
    };

    const handlePromptReady = () => {
      if (globalDeferredPrompt) {
        setDeferredPrompt(globalDeferredPrompt);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('kisansetu:pwa-prompt-ready', handlePromptReady);
    window.addEventListener('kisansetu:pwa-installed', handleAppInstalled);

    // Watch for display-mode changes (e.g. user installs and window opens)
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsInstalled(true);
      }
    };
    mediaQuery.addEventListener('change', handleDisplayChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('kisansetu:pwa-prompt-ready', handlePromptReady);
      window.removeEventListener('kisansetu:pwa-installed', handleAppInstalled);
      mediaQuery.removeEventListener('change', handleDisplayChange);
    };
  }, []);

  const install = async (): Promise<'accepted' | 'dismissed' | 'unsupported'> => {
    const promptEvent = deferredPrompt || globalDeferredPrompt;
    if (!promptEvent) {
      return 'unsupported';
    }

    try {
      await promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        globalAppInstalled = true;
        globalDeferredPrompt = null;
        setDeferredPrompt(null);
        try {
          localStorage.setItem('kisansetu_pwa_installed', 'true');
        } catch {
          // Ignore
        }
        return 'accepted';
      }
      return 'dismissed';
    } catch {
      return 'unsupported';
    }
  };

  return {
    isInstallable: !!deferredPrompt || !!globalDeferredPrompt,
    hasPrompt: !!deferredPrompt || !!globalDeferredPrompt,
    isInstalled,
    isIOS,
    isSupported,
    install,
  };
}
