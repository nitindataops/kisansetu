import React from 'react';
import { MapPin, CheckCircle2 } from 'lucide-react';
import { BuyerProfile, BuyerTab } from '../../types/buyer';
import { LanguageCode } from '../../types';
import { buyerTranslations } from '../../data/buyerTranslations';

export interface BuyerWelcomeBarProps {
  buyerProfile: BuyerProfile;
  currentLanguage: LanguageCode;
  onSelectTab?: (tab: BuyerTab) => void;
  onOpenPostRequirementModal?: () => void;
  onOpenSmartBuyModal?: () => void;
}

export const BuyerWelcomeBar: React.FC<BuyerWelcomeBarProps> = ({
  buyerProfile,
  currentLanguage,
}) => {
  const t = buyerTranslations[currentLanguage] || buyerTranslations.en;
  const isHi = currentLanguage === 'hi';

  return (
    <div className="bg-[#FAF7F0] pt-4 pb-1">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Compact B2B Buyer Identity Card */}
        <div className="bg-white rounded-2xl border border-[#D5DDD2] p-4 sm:p-5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-black text-[#26332B] tracking-tight">
                  {t.welcome.greeting}, <span className="text-[#245C3A]">{buyerProfile?.name || ''}</span> 👋
                </h1>
                {buyerProfile?.id && (
                  <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#FAF7F0] border border-[#D5DDD2] text-[#48534C]">
                    ID: {buyerProfile.id}
                  </span>
                )}
              </div>
              {buyerProfile?.businessName && (
                <p className="text-xs sm:text-sm font-bold text-[#38433C] leading-snug">
                  {buyerProfile.businessName}
                  {buyerProfile?.businessType && (
                    <span className="text-xs font-normal text-[#68736B] ml-2">
                      ({buyerProfile.businessType})
                    </span>
                  )}
                </p>
              )}
              {buyerProfile?.location && (
                <div className="flex items-center gap-1.5 text-xs text-[#526056] pt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#245C3A] shrink-0" />
                  <span>{buyerProfile.location}</span>
                </div>
              )}
            </div>

            {buyerProfile?.verified && (
              <div className="self-start sm:self-center flex items-center gap-1.5 text-xs font-extrabold text-[#245C3A] bg-[#EEF3E8] px-3 py-1.5 rounded-full border border-[#5F8F45]/30 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#245C3A]" />
                <span>{isHi ? '✓ सत्यापित खरीदार' : '✓ Verified Buyer'}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
