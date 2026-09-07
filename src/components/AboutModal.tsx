import React from 'react';
import { X, Sprout, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { TranslationDictionary } from '../types';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  translations: TranslationDictionary;
}

export const AboutModal: React.FC<AboutModalProps> = ({
  isOpen,
  onClose,
  translations: t,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-modal-title"
    >
      <div 
        className="relative w-full max-w-2xl bg-[#FBFAF4] rounded-3xl border border-[#DFD7C4] shadow-2xl p-6 sm:p-10 space-y-6 text-left overflow-y-auto max-h-[90vh]"
      >
        {/* Close Button */}
        <button
          id="close-about-modal-btn"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#68736B] hover:text-[#26332B] hover:bg-[#EEF3E8] rounded-lg transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#245C3A] text-white flex items-center justify-center shadow-xs relative">
            <Sprout className="w-6 h-6 text-[#EAF3E7]" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#D6A63A] border-2 border-[#FBFAF4]" />
          </div>
          <div>
            <h3 id="about-modal-title" className="text-2xl font-extrabold text-[#26332B] tracking-tight">
              {t.aboutPreview.aboutModalTitle}
            </h3>
            <p className="text-xs text-[#5F8F45] font-semibold">
              KisanSetu • Indian Agriculture Platform
            </p>
          </div>
        </div>

        {/* Content Paragraphs */}
        <div className="space-y-4 text-sm sm:text-base text-[#68736B] leading-relaxed">
          {t.aboutPreview.aboutModalContent.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#E5DECD]">
          <div className="bg-[#EEF3E8] p-4 rounded-xl space-y-1.5 border border-[#D5E3CE]">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#245C3A]">
              <Heart className="w-4 h-4 text-[#B86F4B]" />
              <span>Farmer First</span>
            </div>
            <p className="text-xs text-[#56655A]">
              Empowering growers with direct bargaining power and fair price benchmarks.
            </p>
          </div>

          <div className="bg-[#FBFAF4] p-4 rounded-xl space-y-1.5 border border-[#E3DCCB]">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#245C3A]">
              <ShieldCheck className="w-4 h-4 text-[#5F8F45]" />
              <span>100% Verified</span>
            </div>
            <p className="text-xs text-[#56655A]">
              Connecting only verified institutional buyers, traders, and mills.
            </p>
          </div>

          <div className="bg-[#FBF3E2] p-4 rounded-xl space-y-1.5 border border-[#EADBBD]">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#9E7318]">
              <Sparkles className="w-4 h-4 text-[#D6A63A]" />
              <span>Pan-India Reach</span>
            </div>
            <p className="text-xs text-[#56655A]">
              Bridging local mandis to national supply chains seamlessly.
            </p>
          </div>
        </div>

        {/* Close CTA */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#245C3A] hover:bg-[#1A472C] transition-colors shadow-xs cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
