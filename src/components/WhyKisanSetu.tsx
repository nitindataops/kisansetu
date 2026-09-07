import React from 'react';
import { CheckCircle, Info } from 'lucide-react';
import { TranslationDictionary } from '../types';

interface WhyKisanSetuProps {
  translations: TranslationDictionary;
}

export const WhyKisanSetu: React.FC<WhyKisanSetuProps> = ({ translations: t }) => {
  return (
    <section 
      id="why-kisansetu-section"
      className="py-16 sm:py-24 bg-[#EEF3E8]/50 backdrop-blur-xs border-b border-[#D8E4D1]/60 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FBFAF4] border border-[#D5E3CE] text-[#245C3A] text-xs font-bold shadow-2xs">
            <span>The KisanSetu Advantage</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#26332B] tracking-tight">
            {t.whyAgrohub.sectionTitle}
          </h2>
          <p className="text-base sm:text-lg text-[#68736B] leading-relaxed">
            {t.whyAgrohub.sectionSubtitle}
          </p>
        </div>

        {/* 4 Statistics Metrics Display */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {t.whyAgrohub.stats.map((stat, idx) => {
            const numColors = [
              'text-[#245C3A]',
              'text-[#D6A63A]',
              'text-[#245C3A]',
              'text-[#B86F4B]',
            ];
            return (
              <div
                key={idx}
                className="bg-white/85 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-[#D8E3D2]/80 text-center shadow-xs hover:border-[#D6A63A]/60 hover:bg-white/95 hover:shadow-md transition-all duration-300"
              >
                <div className={`text-3xl sm:text-4xl font-extrabold ${numColors[idx % 4]} tracking-tight mb-1`}>
                  {stat.value}
                </div>
                <div className="text-base font-bold text-[#26332B] mb-1">
                  {stat.label}
                </div>
                <div className="text-xs text-[#68736B] font-normal">
                  {stat.subtext}
                </div>
              </div>
            );
          })}
        </div>

        {/* Demo / Sample Metrics Disclaimer Notice */}
        <div className="flex items-center justify-center gap-2 text-xs text-[#68736B] mb-14 px-4 text-center">
          <Info className="w-3.5 h-3.5 text-[#5F8F45] shrink-0" />
          <span>{t.whyAgrohub.statsNotice}</span>
        </div>

        {/* 3 Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {t.whyAgrohub.pillars.map((pillar, idx) => {
            const checkColors = [
              'bg-[#EEF3E8] text-[#245C3A] border-[#D5E3CE]',
              'bg-[#FBF3E2] text-[#D6A63A] border-[#EADBBD]',
              'bg-[#FBF0EB] text-[#B86F4B] border-[#E8CEBF]',
            ];
            return (
              <div
                key={idx}
                className="bg-white/85 backdrop-blur-md rounded-2xl p-6 sm:p-7 border border-[#D8E3D2]/80 shadow-xs space-y-3.5 hover:shadow-md hover:bg-white/95 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg border ${checkColors[idx % 3]} flex items-center justify-center shrink-0`}>
                    <CheckCircle className="w-4.5 h-4.5" />
                  </div>
                  <h3 className="text-lg font-bold text-[#26332B]">
                    {pillar.title}
                  </h3>
                </div>
                <p className="text-sm text-[#68736B] leading-relaxed pl-11">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
