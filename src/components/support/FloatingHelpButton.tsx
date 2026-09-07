import React from 'react';
import { Bot, Sparkles } from 'lucide-react';
import { LanguageCode } from '../../types';

interface FloatingHelpButtonProps {
  currentLanguage: LanguageCode;
  onClick: () => void;
}

export const FloatingHelpButton: React.FC<FloatingHelpButtonProps> = ({
  currentLanguage,
  onClick,
}) => {
  const isHi = currentLanguage === 'hi';

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-3 sm:right-6 z-30 flex items-center gap-2 group">
      {/* Tooltip hint on desktop */}
      <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#26332B] text-white text-xs font-medium shadow-xl opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 pointer-events-none">
        <Sparkles className="w-3.5 h-3.5 text-[#D6A63A]" />
        <span>{isHi ? 'KisanSetu रियल AI सहायता' : 'KisanSetu Real AI Support'}</span>
      </div>

      {/* Floating 🤖 Help button */}
      <button
        id="floating-ai-help-btn"
        onClick={onClick}
        aria-label="Open KisanSetu AI Support Assistant"
        className="relative inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-5 sm:py-3.5 rounded-full bg-[#245C3A] hover:bg-[#1A472C] text-white font-bold shadow-2xl hover:shadow-[#245C3A]/50 hover:scale-105 active:scale-95 transition-all cursor-pointer ring-4 ring-[#EEF3E8] border border-[#3E7D56]"
      >
        <span className="text-lg sm:text-xl">🤖</span>
        <span className="text-xs sm:text-sm font-extrabold tracking-wide">{isHi ? 'सहायता' : 'Help'}</span>
        
        {/* Active status pulsating indicator */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D6A63A] opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#D6A63A] border-2 border-white" />
        </span>
      </button>
    </div>
  );
};
