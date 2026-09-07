import React from 'react';
import { UserPlus, Search, TrendingUp, ArrowRight } from 'lucide-react';
import { TranslationDictionary } from '../types';

interface HowItWorksProps {
  translations: TranslationDictionary;
  onGetStarted: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ translations: t, onGetStarted }) => {
  const getStepIcon = (index: number) => {
    switch (index) {
      case 0:
        return <UserPlus className="w-6 h-6 text-[#2D5A27]" />;
      case 1:
        return <Search className="w-6 h-6 text-[#2D5A27]" />;
      case 2:
        return <TrendingUp className="w-6 h-6 text-[#2D5A27]" />;
      default:
        return <UserPlus className="w-6 h-6 text-[#2D5A27]" />;
    }
  };

  return (
    <section 
      id="how-it-works-section"
      className="py-16 sm:py-24 bg-[#FBFAF4]/50 backdrop-blur-xs border-b border-[#ECE6D8]/60 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EEF3E8] border border-[#D5E3CE] text-[#245C3A] text-xs font-bold">
            <span>Simple Workflow</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#26332B] tracking-tight">
            {t.howItWorks.sectionTitle}
          </h2>
          <p className="text-base sm:text-lg text-[#68736B] leading-relaxed">
            {t.howItWorks.sectionSubtitle}
          </p>
        </div>

        {/* 3 Step Cards with Subtle Connecting Line */}
        <div className="relative">
          {/* Subtle Horizontal Connecting Line for Desktop */}
          <div 
            className="hidden md:block absolute top-1/2 left-[12%] right-[12%] h-0.5 border-t-2 border-dashed border-[#D6A63A]/40 -translate-y-8 z-0 pointer-events-none" 
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {t.howItWorks.steps.map((step, idx) => {
              const stepBadgeColors = [
                'bg-[#245C3A] text-white',
                'bg-[#D6A63A] text-white',
                'bg-[#B86F4B] text-white',
              ];
              const tagColors = [
                'text-[#245C3A] bg-[#EEF3E8] border border-[#D5E3CE]',
                'text-[#9E7318] bg-[#FBF3E2] border border-[#EADBBD]',
                'text-[#8F4E2D] bg-[#FBF0EB] border border-[#E8CEBF]',
              ];

              return (
                <div
                  key={idx}
                  id={`how-it-works-step-${step.stepNumber}`}
                  className="bg-white/85 backdrop-blur-md rounded-2xl p-7 sm:p-8 border border-[#EAE3D3]/80 shadow-xs hover:shadow-md hover:bg-white/95 hover:border-[#D6A63A]/50 transition-all flex flex-col items-center text-center space-y-4 group"
                >
                  {/* Step Number & Icon Badge */}
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-[#EEF3E8] border border-[#D8E4D2] flex items-center justify-center group-hover:scale-105 transition-transform">
                      {getStepIcon(idx)}
                    </div>
                    <span className={`absolute -top-2 -right-2 w-7 h-7 rounded-full ${stepBadgeColors[idx % 3]} text-xs font-extrabold flex items-center justify-center shadow-xs`}>
                      {step.stepNumber}
                    </span>
                  </div>

                  {/* Step Badge */}
                  <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${tagColors[idx % 3]}`}>
                    {step.badge}
                  </span>

                  {/* Step Title & Description */}
                  <h3 className="text-xl font-bold text-[#26332B] group-hover:text-[#245C3A] transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#68736B] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Quick Action Note */}
        <div className="mt-12 text-center">
          <button
            id="how-it-works-start-btn"
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#245C3A] hover:text-[#1A472C] bg-[#EEF3E8] hover:bg-[#E2EBD9] border border-[#245C3A]/25 px-5 py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer"
          >
            <span>Start Your Registration</span>
            <ArrowRight className="w-4 h-4 text-[#D6A63A]" />
          </button>
        </div>

      </div>
    </section>
  );
};
