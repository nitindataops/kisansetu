import React, { useState } from 'react';
import { Download, Share2, PlusSquare, X, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { LanguageCode, TranslationDictionary } from '../../types';
import { translations as allTranslations } from '../../data/translations';

interface PWAInstallButtonProps {
  currentLanguage?: LanguageCode;
  translations?: TranslationDictionary;
  variant?: 'navbar' | 'floating' | 'banner' | 'card' | 'compact' | 'home-cta';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  currentLanguage = 'hi',
  translations,
  variant = 'navbar',
  className = '',
}) => {
  const { isInstallable, isInstalled, isIOS, isSupported, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showBrowserGuide, setShowBrowserGuide] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // If already installed and running inside standalone mode, do not show CTA
  if (isInstalled) {
    return null;
  }

  // If installation is definitely not supported by platform/browser, do not render navbar/banner items
  if (!isSupported && !isInstallable && !isIOS && variant !== 'home-cta') {
    return null;
  }

  const t = translations?.installApp || allTranslations[currentLanguage]?.installApp || allTranslations.hi.installApp;

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }

    if (isInstallable) {
      setIsInstalling(true);
      try {
        const result = await install();
        if (result === 'unsupported') {
          setShowBrowserGuide(true);
        }
      } finally {
        setIsInstalling(false);
      }
    } else {
      // Browser supports PWA or mobile add-to-homescreen, guide user through browser menu
      setShowBrowserGuide(true);
    }
  };

  return (
    <>
      {/* 1. HOME CTA VARIANT: Clean, professional farmer-friendly card under Hero Main CTA */}
      {variant === 'home-cta' ? (
        <div
          id="home-install-app-card"
          className={`w-full max-w-xl p-3.5 sm:p-4 rounded-2xl bg-white/95 backdrop-blur-xs border border-[#D5E3CE] shadow-xs text-left transition-all hover:border-[#245C3A]/30 ${className}`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#245C3A]/10 text-[#245C3A] flex items-center justify-center shrink-0 border border-[#245C3A]/20">
                <Smartphone className="w-5 h-5 text-[#245C3A]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm sm:text-base font-bold text-[#26332B] leading-tight">
                    {t.title}
                  </h4>
                  <span className="text-[10px] font-semibold text-[#245C3A] bg-[#EEF3E8] px-2 py-0.5 rounded-full border border-[#D5E3CE] shrink-0">
                    {t.badge}
                  </span>
                </div>
                <p className="text-xs text-[#5D6B60] leading-snug mt-0.5">
                  {t.subtitle}
                </p>
              </div>
            </div>

            <div className="shrink-0">
              <button
                id="home-install-pwa-btn"
                onClick={handleInstallClick}
                disabled={isInstalling}
                className="w-full sm:w-auto min-h-[44px] px-4 py-2.5 rounded-xl bg-[#245C3A] hover:bg-[#1B432B] active:scale-98 text-white text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                aria-label={t.buttonText}
              >
                <Download className="w-4 h-4 text-[#D6A63A] shrink-0" />
                <span className="whitespace-nowrap">{t.buttonText}</span>
              </button>
            </div>
          </div>
        </div>
      ) : variant === 'banner' ? (
        <div
          id="banner-install-app-card"
          className={`p-3 sm:p-4 rounded-2xl bg-linear-to-r from-[#245C3A] to-[#1B432B] text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${className}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
              <Smartphone className="w-5 h-5 text-[#D6A63A]" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold leading-tight">
                {t.title}
              </h4>
              <p className="text-[11px] sm:text-xs text-[#EAF3E7]/80 leading-tight mt-0.5">
                {t.subtitle}
              </p>
            </div>
          </div>
          <button
            id="banner-install-pwa-btn"
            onClick={handleInstallClick}
            disabled={isInstalling}
            className="w-full sm:w-auto min-h-[40px] px-4 py-2 rounded-xl bg-[#D6A63A] hover:bg-[#C29329] text-[#1B432B] text-xs font-bold transition-all shadow-xs active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <Download className="w-4 h-4 text-[#1B432B]" />
            <span>{t.buttonText}</span>
          </button>
        </div>
      ) : variant === 'compact' ? (
        <button
          id="compact-install-pwa-btn"
          onClick={handleInstallClick}
          disabled={isInstalling}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#D6A63A]/15 text-[#8C6212] border border-[#D6A63A]/30 hover:bg-[#D6A63A]/25 transition-all cursor-pointer min-h-[36px] ${className}`}
          title={t.buttonText}
          aria-label={t.buttonText}
        >
          <Download className="w-3.5 h-3.5" />
          <span>{t.buttonText}</span>
        </button>
      ) : variant === 'card' ? (
        <div
          id="card-install-app-box"
          className={`p-4 rounded-2xl bg-white border border-[#EEF3E8] shadow-xs text-left ${className}`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#245C3A] flex items-center justify-center text-white">
              <Smartphone className="w-5 h-5 text-[#D6A63A]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#26332B]">{t.title}</h4>
              <p className="text-xs text-[#68736B]">{t.subtitle}</p>
            </div>
          </div>
          <button
            id="card-install-pwa-btn"
            onClick={handleInstallClick}
            disabled={isInstalling}
            className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-[#245C3A] hover:bg-[#1B432B] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#D6A63A]" />
            <span>{t.buttonText}</span>
          </button>
        </div>
      ) : (
        /* default: navbar */
        <button
          id="nav-install-pwa-btn"
          onClick={handleInstallClick}
          disabled={isInstalling}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#D6A63A] hover:bg-[#C29329] text-[#1B432B] shadow-xs hover:shadow-sm transition-all active:scale-95 cursor-pointer ${className}`}
          title={t.title}
          aria-label={t.buttonText}
        >
          <Download className="w-3.5 h-3.5 text-[#1B432B]" />
          <span>{t.buttonText}</span>
        </button>
      )}

      {/* iOS Safari Guided Install Sheet / Modal */}
      {showIOSGuide && (
        <div
          id="ios-install-guide-modal"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in"
        >
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl border border-[#EEF3E8] text-[#26332B] relative">
            <button
              id="ios-guide-close-btn"
              onClick={() => setShowIOSGuide(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-[#68736B] hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label={t.iosClose}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-[#245C3A]/10 text-[#245C3A] flex items-center justify-center mb-3">
              <Smartphone className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-[#26332B]">
              {t.title}
            </h3>

            {/* Prominent iOS Instruction summary */}
            <div className="mt-2 mb-3 px-3 py-2 rounded-xl bg-[#EEF3E8] border border-[#D5E3CE] text-xs font-semibold text-[#245C3A]">
              {t.iosInstructionStep}
            </div>

            <p className="text-xs text-[#68736B] mb-3 font-medium">
              {t.iosInstructionTitle}:
            </p>

            <div className="space-y-2.5 bg-[#FBFAF4] p-3.5 rounded-2xl border border-[#EEF3E8] text-xs">
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-[#245C3A] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  1
                </div>
                <div className="leading-snug">
                  <p className="font-semibold text-[#26332B]">
                    {t.iosStep1}
                  </p>
                  <div className="inline-flex items-center gap-1 mt-1 text-[#245C3A] font-bold">
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share ↗</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-[#245C3A] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  2
                </div>
                <div className="leading-snug">
                  <p className="font-semibold text-[#26332B]">
                    {t.iosStep2}
                  </p>
                  <div className="inline-flex items-center gap-1 mt-1 text-[#245C3A] font-bold">
                    <PlusSquare className="w-3.5 h-3.5" />
                    <span>Add to Home Screen</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-[#245C3A] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  3
                </div>
                <div className="leading-snug">
                  <p className="font-semibold text-[#26332B]">
                    {t.iosStep3}
                  </p>
                </div>
              </div>
            </div>

            <button
              id="ios-guide-confirm-btn"
              onClick={() => setShowIOSGuide(false)}
              className="mt-4 w-full min-h-[44px] py-2.5 rounded-xl bg-[#245C3A] text-white text-xs font-bold hover:bg-[#1B432B] transition-colors cursor-pointer"
            >
              {t.iosClose}
            </button>
          </div>
        </div>
      )}

      {/* Browser Menu Fallback Guide Modal */}
      {showBrowserGuide && (
        <div
          id="browser-install-guide-modal"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in"
        >
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl border border-[#EEF3E8] text-[#26332B] relative">
            <button
              id="browser-guide-close-btn"
              onClick={() => setShowBrowserGuide(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-[#68736B] hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label={t.iosClose}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-[#245C3A]/10 text-[#245C3A] flex items-center justify-center mb-3">
              <Smartphone className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-[#26332B]">
              {t.title}
            </h3>
            <p className="text-xs text-[#68736B] mt-1 mb-4">
              {t.subtitle}
            </p>

            <div className="bg-[#FBFAF4] p-3.5 rounded-2xl border border-[#EEF3E8] text-xs leading-relaxed text-[#26332B]">
              <p className="font-semibold mb-2">{t.browserMenuHint}</p>
              <p className="text-[#68736B]">
                Chrome / Edge: URL बार के दाईं ओर इंस्टॉल आइकन (⊕) या ब्राउज़र मेनू (⋮) → "Install KisanSetu" पर टैप करें।
              </p>
            </div>

            <button
              id="browser-guide-confirm-btn"
              onClick={() => setShowBrowserGuide(false)}
              className="mt-4 w-full min-h-[44px] py-2.5 rounded-xl bg-[#245C3A] text-white text-xs font-bold hover:bg-[#1B432B] transition-colors cursor-pointer"
            >
              {t.iosClose}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

