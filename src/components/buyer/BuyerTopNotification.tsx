import React from 'react';
import { Sparkles, X, ChevronRight } from 'lucide-react';
import { LanguageCode } from '../../types';
import { buyerTranslations } from '../../data/buyerTranslations';

interface BuyerTopNotificationProps {
  currentLanguage: LanguageCode;
  onAction?: () => void;
  onDismiss?: () => void;
}

export const BuyerTopNotification: React.FC<BuyerTopNotificationProps> = ({
  currentLanguage,
  onAction,
  onDismiss,
}) => {
  const t = buyerTranslations[currentLanguage] || buyerTranslations.en;

  return (
    <div 
      id="buyer-top-notification"
      className="bg-[#245C3A] text-[#FAF6ED] px-3 py-2 text-xs border-b border-[#1C4B2E] transition-all"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="shrink-0 text-sm">🌾</span>
          <span className="font-medium truncate text-[11px] sm:text-xs">
            {t.topNotification.text}
          </span>
          {onAction && (
            <button
              onClick={onAction}
              className="hidden sm:inline-flex items-center gap-1 font-bold text-[#E2ECD9] hover:text-white underline underline-offset-2 ml-1 cursor-pointer shrink-0"
            >
              <span>{t.topNotification.learnMore}</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-[#FAF6ED]/70 hover:text-white p-1 rounded-md transition-colors cursor-pointer shrink-0"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
