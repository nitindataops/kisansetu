import React from 'react';
import { Sparkles, TrendingDown, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { MarketplaceProduct } from '../../types/buyer';
import { LanguageCode } from '../../types';
import { buyerTranslations } from '../../data/buyerTranslations';

interface BuyerSmartBuyWidgetProps {
  featuredProduct?: MarketplaceProduct;
  currentLanguage: LanguageCode;
  onOpenSmartBuyDetails: (product?: MarketplaceProduct) => void;
}

export const BuyerSmartBuyWidget: React.FC<BuyerSmartBuyWidgetProps> = ({
  featuredProduct,
  currentLanguage,
  onOpenSmartBuyDetails,
}) => {
  const t = buyerTranslations[currentLanguage] || buyerTranslations.en;

  const crop = featuredProduct?.crop || 'Wheat';
  const variety = featuredProduct?.variety || 'Sharbati MP-306';
  const currentPrice = featuredProduct?.pricePerKg || 28;
  const signal = featuredProduct?.smartBuySignal || 'Favorable';
  const recommendation = featuredProduct?.smartBuyRecommendation || 'Consider buying now. Spot wholesale rates are steady with tightening mandi arrivals.';

  return (
    <div className="bg-[#EEF3E8] rounded-2xl border border-[#5F8F45]/30 p-4 shadow-2xs hover:border-[#245C3A] transition-all">
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#D8E4D1]">
        <div className="flex items-center gap-1.5 text-xs font-black text-[#245C3A] uppercase tracking-wide">
          <span className="text-base">🧠</span>
          <span>{t.sections.smartBuyWidgetTitle}</span>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-[#245C3A] text-white text-[10px] font-bold">
          {signal}
        </span>
      </div>

      <div className="mt-3 flex flex-col gap-2">
        <div className="flex items-baseline justify-between">
          <div>
            <h4 className="text-sm font-extrabold text-[#26332B]">{crop}</h4>
            <p className="text-[11px] text-[#68736B]">{variety}</p>
          </div>
          <div className="text-right">
            <span className="text-sm font-black text-[#245C3A]">₹{currentPrice}/kg</span>
          </div>
        </div>

        <div className="p-2 rounded-xl bg-white/80 border border-[#D5DDD2] text-[11px] text-[#48534C] leading-snug">
          <p className="font-medium">{recommendation}</p>
          <span className="text-[9.5px] text-[#8D9B91] block mt-1">
            * Model-generated APMC signal estimate
          </span>
        </div>

        <button
          onClick={() => onOpenSmartBuyDetails(featuredProduct)}
          className="mt-1 w-full py-1.5 px-3 rounded-lg bg-[#245C3A] hover:bg-[#1C4B2E] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <span>View Smart Buy Analysis</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
