import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { LanguageCode } from '../../types';
import { buyerTranslations } from '../../data/buyerTranslations';

interface BuyerHeroBannerProps {
  currentLanguage: LanguageCode;
  onBrowseProduce: () => void;
  onPostRequirement: () => void;
}

export const BuyerHeroBanner: React.FC<BuyerHeroBannerProps> = ({
  currentLanguage,
  onBrowseProduce,
  onPostRequirement,
}) => {
  const t = buyerTranslations[currentLanguage] || buyerTranslations.en;

  return (
    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#1C4B2E] via-[#245C3A] to-[#2E6B47] text-white shadow-md mb-6">
      {/* Decorative Background Image Overlay */}
      <div className="absolute inset-0 opacity-25 mix-blend-overlay pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1600&auto=format&fit=crop&q=80"
          alt="Golden Agricultural Field"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 px-5 py-6 sm:px-8 sm:py-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left Content */}
        <div className="max-w-xl flex flex-col items-start text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 border border-white/20 text-[11px] font-bold text-[#E2ECD9] mb-3 backdrop-blur-xs">
            <Sparkles className="w-3 h-3 text-[#D6A63A]" />
            <span>{t.heroBanner.badge}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
            {t.heroBanner.title}
          </h2>

          <p className="text-xs sm:text-sm text-[#D8E4D1] mt-2 font-medium leading-relaxed">
            {t.heroBanner.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              onClick={onBrowseProduce}
              className="px-5 py-2.5 rounded-xl bg-[#D6A63A] hover:bg-[#C2932B] text-[#26332B] font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-sm hover:shadow-md active:scale-98 cursor-pointer"
            >
              <span>{t.heroBanner.cta}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onPostRequirement}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm transition-colors border border-white/25 cursor-pointer"
            >
              <span>{t.heroBanner.secondaryCta}</span>
            </button>
          </div>
        </div>

        {/* Right Agricultural Highlights Badge Cluster */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <div className="flex flex-col gap-2.5 p-3.5 bg-black/20 backdrop-blur-md rounded-xl border border-white/15 text-xs text-[#EAF3E7]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#D6A63A]" />
              <span className="font-semibold">Direct Farm-Gate Procurement</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#D6A63A]" />
              <span className="font-semibold">Mandi Escrow Safe Settlement</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">🌾</span>
              <span className="font-semibold">Traceable AI Quality Grading</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
