import React from 'react';
import { ArrowRight, CheckCircle2, HeartHandshake } from 'lucide-react';
import { TranslationDictionary } from '../types';

interface AboutPreviewProps {
  translations: TranslationDictionary;
  onOpenAboutModal: () => void;
}

export const AboutPreview: React.FC<AboutPreviewProps> = ({
  translations: t,
  onOpenAboutModal,
}) => {
  return (
    <section 
      id="about-preview-section"
      className="py-16 sm:py-24 bg-[#FBFAF4]/50 backdrop-blur-xs border-b border-[#ECE6D8]/60 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-white/90 via-[#F8F7EF]/85 to-[#EEF3E8]/85 backdrop-blur-md rounded-3xl border border-[#E4DCCB]/80 p-8 sm:p-12 lg:p-14 shadow-xs relative overflow-hidden">
          
          {/* Subtle wheat watermark background */}
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-12 translate-y-12">
            <svg width="320" height="320" viewBox="0 0 200 200" fill="none" stroke="#245C3A" strokeWidth="2">
              <path d="M100 180 Q98 100 100 20 M100 60 Q70 50 60 20 M100 90 Q130 80 140 50 M100 120 Q60 110 50 80" />
            </svg>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Info Column */}
            <div className="lg:col-span-8 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EEF3E8] border border-[#D5E3CE] text-[#245C3A] text-xs font-bold">
                <HeartHandshake className="w-4 h-4 text-[#D6A63A]" />
                <span>Our Agricultural Mission</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#26332B] tracking-tight leading-snug">
                {t.aboutPreview.heading}
              </h2>

              <p className="text-base sm:text-lg text-[#68736B] leading-relaxed max-w-3xl">
                {t.aboutPreview.description}
              </p>

              {/* 3 Core Commitments */}
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center gap-2.5 text-sm text-[#26332B] font-semibold">
                  <CheckCircle2 className="w-4.5 h-4.5 text-[#5F8F45] shrink-0" />
                  <span>{t.aboutPreview.commitment1}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-[#26332B] font-semibold">
                  <CheckCircle2 className="w-4.5 h-4.5 text-[#D6A63A] shrink-0" />
                  <span>{t.aboutPreview.commitment2}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-[#26332B] font-semibold">
                  <CheckCircle2 className="w-4.5 h-4.5 text-[#B86F4B] shrink-0" />
                  <span>{t.aboutPreview.commitment3}</span>
                </div>
              </div>
            </div>

            {/* Right Action Button Column */}
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-center gap-4">
              <button
                id="about-preview-learn-more-btn"
                onClick={onOpenAboutModal}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl text-base font-bold text-white bg-[#245C3A] hover:bg-[#1A472C] shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>{t.aboutPreview.learnMoreButton}</span>
                <ArrowRight className="w-4 h-4 text-[#D6A63A]" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
