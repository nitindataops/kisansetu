import React from 'react';
import { LanguageCode } from '../../types';
import { buyerTranslations } from '../../data/buyerTranslations';

interface BuyerCategoryNavProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  currentLanguage: LanguageCode;
}

export const BuyerCategoryNav: React.FC<BuyerCategoryNavProps> = ({
  selectedCategory,
  onSelectCategory,
  currentLanguage,
}) => {
  const t = buyerTranslations[currentLanguage] || buyerTranslations.en;
  const isHi = currentLanguage === 'hi';

  // Authoritative wholesale produce categories for approved crops (Wheat, Rice, Maize, Pulses/Chana)
  const categories = [
    { id: 'all', label: isHi ? 'सभी फसलें' : 'All Produce', icon: '🌿' },
    { id: 'Grains', label: isHi ? 'अनाज व खाद्यान्न' : 'Grains & Cereals', icon: '🌾' },
    { id: 'Pulses', label: isHi ? 'दालें व दलहन' : 'Pulses & Legumes', icon: '🥣' },
  ];

  return (
    <div className="bg-[#FAF7F0] border-b border-[#E3DCB] py-3">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer shadow-2xs shrink-0 ${
                  isSelected
                    ? 'bg-[#245C3A] text-white shadow-xs'
                    : 'bg-white text-[#38433C] hover:bg-[#EEF3E8] border border-[#D5DDD2] hover:border-[#5F8F45]'
                }`}
              >
                <span className="text-base leading-none">{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
