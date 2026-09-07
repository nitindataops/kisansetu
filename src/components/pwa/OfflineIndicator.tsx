import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';
import { LanguageCode } from '../../types';

interface OfflineIndicatorProps {
  currentLanguage?: LanguageCode;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ currentLanguage = 'hi' }) => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  const isHi = currentLanguage === 'hi';

  return (
    <div className="fixed top-2 inset-x-4 z-50 flex items-center justify-center pointer-events-none">
      <div className="flex items-center gap-2 rounded-xl bg-amber-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-lg pointer-events-auto border border-amber-400/40">
        <WifiOff className="w-4 h-4 animate-pulse" />
        <span>
          {isHi
            ? 'ऑफ़लाइन मोड — कैश्ड डेटा लोड किया जा रहा है'
            : 'Offline Mode — Using cached data'}
        </span>
      </div>
    </div>
  );
};
