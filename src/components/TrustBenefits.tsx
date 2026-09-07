import React from 'react';
import { Wheat, Handshake, PackageCheck, LineChart } from 'lucide-react';
import { TranslationDictionary } from '../types';

interface TrustBenefitsProps {
  translations: TranslationDictionary;
}

export const TrustBenefits: React.FC<TrustBenefitsProps> = ({ translations: t }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'wheat':
        return <Wheat className="w-6 h-6 text-[#2D5A27]" />;
      case 'handshake':
        return <Handshake className="w-6 h-6 text-[#2D5A27]" />;
      case 'package':
        return <PackageCheck className="w-6 h-6 text-[#2D5A27]" />;
      case 'chart':
        return <LineChart className="w-6 h-6 text-[#2D5A27]" />;
      default:
        return <Wheat className="w-6 h-6 text-[#2D5A27]" />;
    }
  };

  return (
    <section 
      id="features-section"
      className="py-16 sm:py-24 bg-[#FBFAF4]/50 backdrop-blur-xs border-b border-[#ECE6D8]/60 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EEF3E8] border border-[#D5E3CE] text-[#245C3A] text-xs font-bold tracking-wide">
            <span>Essential Benefits</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#26332B] tracking-tight">
            {t.benefits.sectionTitle}
          </h2>
          <p className="text-base sm:text-lg text-[#68736B] leading-relaxed">
            {t.benefits.sectionSubtitle}
          </p>
        </div>

        {/* 4 Clean Spacious Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.benefits.items.map((item) => (
            <div
              key={item.id}
              id={`benefit-card-${item.id}`}
              className="bg-white/85 backdrop-blur-md rounded-2xl p-6 sm:p-7 border border-[#E9E3D3]/80 shadow-xs hover:shadow-md hover:border-[#D6A63A]/60 hover:bg-white/95 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Icon Container with Soft Sage background */}
                <div className="w-12 h-12 rounded-xl bg-[#EEF3E8] border border-[#D8E5D2] flex items-center justify-center group-hover:bg-[#245C3A] transition-colors">
                  <div className="group-hover:brightness-200 transition-all">
                    {getIcon(item.iconName)}
                  </div>
                </div>

                {/* Card Title & Description */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-[#26332B] group-hover:text-[#245C3A] transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-sm text-[#68736B] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Bottom Tag */}
              <div className="pt-6 mt-4 border-t border-[#ECE5D6] flex items-center">
                <span className="text-xs font-bold text-[#245C3A] group-hover:text-[#D6A63A] transition-colors">
                  {item.tag} →
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
