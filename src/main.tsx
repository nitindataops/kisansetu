import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register PWA service worker immediately for offline caching and install prompts
if ('serviceWorker' in navigator) {
  try {
    registerSW({
      immediate: true,
      onRegisterError(err) {
        // Graceful handling if service worker registration is restricted in iframe
        console.debug('PWA registration notice:', err);
      },
    });
  } catch (_e) {
    // Service worker not supported or blocked in current frame
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

