import React from 'react';
import { UserCheck, LogIn, Sparkles, Shield } from 'lucide-react';
import { TranslationDictionary } from '../types';

interface CTASectionProps {
  translations: TranslationDictionary;
  onGetStarted: () => void;
  onLogin?: () => void;
  onFarmerSignUp?: () => void;
  onBuyerSignUp?: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({
  translations: t,
  onGetStarted,
  onLogin,
  onFarmerSignUp,
  onBuyerSignUp,
}) => {
  const handlePrimaryAction = onGetStarted || onFarmerSignUp || onBuyerSignUp;
  return (
    <section 
      id="cta-section"
      className="py-16 sm:py-24 bg-transparent relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="bg-[#245C3A]/95 backdrop-blur-md rounded-3xl p-8 sm:p-14 lg:p-16 text-center text-white shadow-xl relative overflow-hidden border border-[#1A472C]/80">
          
          {/* Subtle Organic Background Vector Waves */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true">
            <svg width="100%" height="100%" viewBox="0 0 1000 400" preserveAspectRatio="none" fill="none">
              <path d="M0 300 C300 200 600 400 1000 250 L1000 400 L0 400 Z" fill="#ffffff" />
              <path d="M0 250 C400 350 700 150 1000 300 L1000 400 L0 400 Z" fill="#ffffff" opacity="0.5" />
            </svg>
          </div>

          <div className="max-w-3xl mx-auto space-y-6 relative z-10">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/20 text-[#EEF3E8] text-xs font-bold backdrop-blur-xs">
              <Sparkles className="w-4 h-4 text-[#D6A63A]" />
              <span>{t.cta.badge}</span>
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {t.cta.heading}
            </h2>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-[#E2ECE0] leading-relaxed max-w-2xl mx-auto font-normal">
              {t.cta.description}
            </p>

            {/* Action Buttons: Unified Get Started and Sign In */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                id="cta-get-started-btn"
                onClick={handlePrimaryAction}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-[#245C3A] bg-[#FBFAF4] hover:bg-white shadow-md hover:shadow-lg hover:ring-2 hover:ring-[#D6A63A]/60 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <UserCheck className="w-5 h-5 text-[#245C3A]" />
                <span>{t.nav.signUp}</span>
              </button>

              {onLogin && (
                <button
                  id="cta-login-btn"
                  onClick={onLogin}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-white bg-[#5F8F45] hover:bg-[#4E7836] border border-white/25 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <LogIn className="w-5 h-5 text-[#E6F3DF]" />
                  <span>{t.nav.login}</span>
                </button>
              )}
            </div>

            {/* Guarantee Note */}
            <div className="pt-4 flex items-center justify-center gap-2 text-xs text-[#CFE2CC]">
              <Shield className="w-4 h-4 text-[#D6A63A]" />
              <span>{t.cta.guaranteeText}</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
