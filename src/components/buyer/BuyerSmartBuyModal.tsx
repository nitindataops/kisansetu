import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  TrendingDown, 
  TrendingUp, 
  Bell, 
  CheckCircle2, 
  Info,
  ShieldCheck,
  ArrowRight,
  Plus
} from 'lucide-react';
import { MarketplaceProduct, PriceWatchItem } from '../../types/buyer';
import { LanguageCode } from '../../types';
import { buyerTranslations } from '../../data/buyerTranslations';

interface BuyerSmartBuyModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: MarketplaceProduct;
  currentLanguage: LanguageCode;
  priceWatches: PriceWatchItem[];
  onAddPriceWatch: (item: Omit<PriceWatchItem, 'id' | 'createdAt'>) => void;
}

export const BuyerSmartBuyModal: React.FC<BuyerSmartBuyModalProps> = ({
  isOpen,
  onClose,
  product,
  currentLanguage,
  priceWatches,
  onAddPriceWatch,
}) => {
  if (!isOpen) return null;

  const t = buyerTranslations[currentLanguage] || buyerTranslations.en;

  const crop = product?.crop || 'Wheat';
  const variety = product?.variety || 'Sharbati MP-306';
  const currentPrice = product?.pricePerKg || 28;
  const recentAvg = (currentPrice * 1.07).toFixed(1);
  const score = product?.purchaseOpportunityScore || 92;

  const [targetRate, setTargetRate] = useState<number>(Math.round(currentPrice * 0.95));
  const [watchSaved, setWatchSaved] = useState(false);

  const existingWatch = priceWatches.find(
    (w) => w.crop === crop && w.variety === variety
  );

  const handleSaveWatch = (e: React.FormEvent) => {
    e.preventDefault();
    onAddPriceWatch({
      crop,
      variety,
      currentPrice,
      targetPrice: targetRate,
      alertActive: true,
      nearestMandi: `${product?.location?.split(',')[0] || 'Local'} APMC Mandi`,
    });
    setWatchSaved(true);
    setTimeout(() => setWatchSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl border border-[#E3DCB] shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-[#245C3A] text-white p-5 sm:p-6 relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-xl">
              🧠
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black tracking-tight text-white">
                {t.smartBuy.title}
              </h3>
              <p className="text-xs text-[#D8E4D1] font-medium">
                {crop} • {variety}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* 1. Best Time to Buy Recommendation Card */}
          <div className="p-4 rounded-2xl bg-[#EEF3E8] border border-[#5F8F45]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5F8F45]">
                {t.smartBuy.bestTimeToBuy}
              </span>
              <span className="text-lg font-black text-[#245C3A] mt-0.5">
                {t.smartBuy.states.consider}
              </span>
              <p className="text-xs text-[#48534C] mt-1 font-medium">
                Current farm-gate rate is 7% below 30-day peak. Recommended buying window.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-white px-4 py-2.5 rounded-xl border border-[#D5DDD2] shrink-0">
              <div className="text-center">
                <span className="text-[10px] text-[#68736B] block">{t.smartBuy.currentRate}</span>
                <strong className="text-sm font-black text-[#245C3A]">₹{currentPrice}/kg</strong>
              </div>
              <div className="w-px h-8 bg-[#E3DCB]" />
              <div className="text-center">
                <span className="text-[10px] text-[#68736B] block">{t.smartBuy.recentAvg}</span>
                <strong className="text-sm font-bold text-[#68736B]">₹{recentAvg}/kg</strong>
              </div>
            </div>
          </div>

          {/* 2. Purchase Opportunity Score & Confidence */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Purchase Opportunity Score */}
            <div className="p-4 rounded-2xl bg-white border border-[#E3DCB] shadow-2xs">
              <span className="text-xs font-bold text-[#68736B] block">
                {t.smartBuy.purchaseOpportunityScore}
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-black text-[#245C3A]">{score}</span>
                <span className="text-sm font-bold text-[#8D9B91]">/ 100</span>
                <span className="ml-auto text-[11px] font-bold text-[#245C3A] bg-[#EEF3E8] px-2 py-0.5 rounded-full border border-[#5F8F45]/30">
                  High Value
                </span>
              </div>
              <p className="text-[11px] text-[#738378] mt-2 leading-relaxed">
                Calculated using spot mandi arrivals, crop harvest seasonality and regional transport freight index.
              </p>
            </div>

            {/* Estimated 5-Day Trend & Confidence */}
            <div className="p-4 rounded-2xl bg-white border border-[#E3DCB] shadow-2xs">
              <span className="text-xs font-bold text-[#68736B] block">
                {t.smartBuy.fiveDayTrend}
              </span>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 text-emerald-600 text-lg font-black">
                  <TrendingDown className="w-5 h-5" />
                  <span>↓ 3–5% Stable</span>
                </div>
                <span className="ml-auto text-xs font-bold text-[#9E6D14] bg-[#F7EFE0] px-2 py-0.5 rounded-md border border-[#EADBBD]">
                  {t.smartBuy.confidence}: 78%
                </span>
              </div>
              <p className="text-[11px] text-[#738378] mt-2 leading-relaxed">
                Predicted to remain within ₹{Math.floor(currentPrice * 0.96)} - ₹{Math.ceil(currentPrice * 1.03)} band over next 5 trading days.
              </p>
            </div>

          </div>

          {/* 3. Price Watch Tracker Section */}
          <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E3DCB]">
            <div className="flex items-center gap-2 mb-3">
              <Bell className="w-4 h-4 text-[#D6A63A]" />
              <h4 className="text-sm font-black text-[#26332B]">
                {t.smartBuy.priceWatchTitle}
              </h4>
            </div>

            <form onSubmit={handleSaveWatch} className="flex flex-col sm:flex-row items-center gap-3">
              <div className="w-full sm:flex-1">
                <label className="text-[11px] font-bold text-[#48534C] block mb-1">
                  {t.smartBuy.targetPriceLabel}
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  value={targetRate}
                  onChange={(e) => setTargetRate(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#D5DDD2] rounded-xl focus:border-[#245C3A] focus:ring-1 focus:ring-[#245C3A]"
                  required
                />
              </div>

              <div className="w-full sm:w-auto self-end">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#245C3A] hover:bg-[#1C4B2E] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>{watchSaved || existingWatch ? t.smartBuy.trackingActive : t.smartBuy.trackPriceBtn}</span>
                </button>
              </div>
            </form>

            {(watchSaved || existingWatch) && (
              <p className="text-[11px] text-[#245C3A] font-semibold mt-2 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#245C3A]" />
                <span>Price alert set for ₹{existingWatch ? existingWatch.targetPrice : targetRate}/kg. You will receive notifications when farm lots drop to this rate.</span>
              </p>
            )}
          </div>

          {/* Disclaimer (Prompt Requirement) */}
          <div className="p-3 rounded-xl bg-[#F4EFE6] border border-[#E7E0D0] text-[10px] text-[#68736B] leading-relaxed flex items-start gap-2">
            <Info className="w-4 h-4 text-[#8D9B91] shrink-0 mt-0.5" />
            <span>{t.smartBuy.disclaimer}</span>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-[#FAF7F0] px-6 py-4 border-t border-[#E3DCB] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#245C3A] hover:bg-[#1C4B2E] text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
