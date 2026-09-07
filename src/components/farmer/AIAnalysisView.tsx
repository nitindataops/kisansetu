import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Warehouse,
  Factory,
  Scale,
  DollarSign,
  AlertCircle,
  HelpCircle,
  Clock,
  Truck,
  Sprout,
} from 'lucide-react';
import { CropListing, ValueDecision, FarmerDashboardTab } from '../../types/farmer';
import { LanguageCode } from '../../types';
import { getFarmerTranslations } from '../../data/farmerTranslations';
import { resolveCropImage, handleCropImageError } from '../../data/imageAssets';

interface AIAnalysisViewProps {
  crops: CropListing[];
  onSelectTab: (tab: FarmerDashboardTab) => void;
  onOpenSellModal: () => void;
  currentLanguage: LanguageCode;
}

export const AIAnalysisView: React.FC<AIAnalysisViewProps> = ({
  crops,
  onSelectTab,
  onOpenSellModal,
  currentLanguage,
}) => {
  const t = getFarmerTranslations(currentLanguage);
  const aiT = t.aiAnalysisView;

  // Selected crop for analysis
  const [selectedCropId, setSelectedCropId] = useState<string>(crops[0]?.id || 'crop-1');
  const selectedCrop = crops.find((c) => c.id === selectedCropId) || crops[0];

  // Dynamic calculation model based on selected crop
  const getDynamicDecision = (crop: CropListing): ValueDecision => {
    const qty = crop.quantityKg;
    const currentRate = crop.currentMandiPrice;
    const expectedRate = crop.expectedPrice;
    
    // Sell now logic
    const sellNowGross = qty * (currentRate + 2); // Premium direct buyer
    const transportSellNow = Math.round(qty * 0.9);
    const sellNowNet = sellNowGross - transportSellNow - 200;

    // Storage logic
    const storageProjectedRate = Math.round(currentRate * 1.22);
    const storageGross = qty * storageProjectedRate;
    const storageFee = Math.round((qty / 100) * 35); // ₹35/quintal
    const storageTransport = Math.round(qty * 1.5);
    const storageNet = storageGross - storageFee - storageTransport;

    // Processing logic
    const processingGross = Math.round(qty * currentRate * 1.32);
    const processFee = Math.round(qty * 2.0);
    const processTransport = Math.round(qty * 1.4);
    const processNet = processingGross - processFee - processTransport;

    // Decide recommendation
    let recommended: 'sell_now' | 'store' | 'process' = 'sell_now';
    let reason = '';

    if (crop.category === 'Pulses' || crop.name.toLowerCase().includes('maize')) {
      recommended = 'sell_now';
      reason =
        currentLanguage === 'hi'
          ? 'वर्तमान में मक्का और दलहन का भाव मजबूत चल रहा है। अभी बेचने पर बिना किसी वजन हानि और भंडारण खर्च के तत्काल पूरा भुगतान सुरक्षित हो जाएगा।'
          : 'Maize spot rates are currently 14% above seasonal baseline. Selling now guarantees zero post-harvest weight loss with instant 100% verified buyer payment.';
    } else if (crop.category === 'Grain' || crop.name.toLowerCase().includes('wheat')) {
      recommended = 'store';
      reason =
        currentLanguage === 'hi'
          ? 'आगामी त्योहारी सीजन के चलते ३० दिनों में गेहूं के भाव में ₹२.५० से ₹३.५० प्रति किलो उछाल का मजबूत अनुमान है। कोल्ड स्टोरेज में रखने पर ₹' +
            storageNet.toLocaleString('en-IN') +
            ' का अधिक मुनाफा मिल सकता है।'
          : 'High procurement demand from mills is projected to lift wheat prices by ₹2.50–₹3.50/kg over the next 30 days. Storing in warehouse yields highest net profit of ₹' +
            storageNet.toLocaleString('en-IN') +
            '.';
    } else {
      recommended = 'process';
      reason =
        currentLanguage === 'hi'
          ? 'इस उत्पाद को स्थानीय मिल में प्रोसेस करवाकर वैल्यू-एड करने से शेल्फ लाइफ ६ महीने बढ़ जाएगी और ३२% अधिक मार्जिन मिलेगा।'
          : 'Processing this crop at a nearby partner mill extends shelf life by 6+ months and realizes 32% higher gross value realization.';
    }

    return {
      cropName: `${crop.name} (${crop.quantityKg.toLocaleString('en-IN')} kg Lot)`,
      quantityKg: qty,
      sellNow: {
        title: currentLanguage === 'hi' ? 'विकल्प A: अभी बेचें (सीधा खरीदार)' : 'Option A: Direct Sale to Verified Buyer',
        grossRevenue: sellNowGross,
        transportCost: transportSellNow,
        otherCosts: 200,
        netValue: sellNowNet,
        timeline: currentLanguage === 'hi' ? 'तत्काल (२ से ४ दिन में बैंक में भुगतान)' : 'Immediate (2-4 Days Payout)',
        riskLevel: 'Low',
      },
      storeAndSellLater: {
        title: currentLanguage === 'hi' ? 'विकल्प B: कोल्ड स्टोरेज में रखें (३० दिन)' : 'Option B: Store & Sell in 30 Days',
        projectedGross: storageGross,
        storageCostMonth: storageFee,
        transportCost: storageTransport,
        netValue: storageNet,
        timeline: currentLanguage === 'hi' ? '३० से ४५ दिन' : '30-45 Days',
        riskLevel: 'Medium',
        expectedAppreciation: `+₹${(storageProjectedRate - currentRate).toFixed(1)}/kg projected rise`,
      },
      processAndSell: {
        title: currentLanguage === 'hi' ? 'विकल्प C: मिल में प्रोसेस कराएं' : 'Option C: Partner Mill Processing',
        processedGross: processingGross,
        processingFee: processFee,
        packagingTransport: processTransport,
        netValue: processNet,
        timeline: currentLanguage === 'hi' ? '१५ से २५ दिन' : '15-25 Days',
        riskLevel: 'Medium',
        valueAdd: currentLanguage === 'hi' ? 'मूल्य संवर्धन से ३०%+ अतिरिक्त मार्जिन' : 'Value addition with +30% higher margins',
      },
      recommendedOption: recommended,
      recommendedReason: reason,
    };
  };

  const decision = getDynamicDecision(selectedCrop);

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Header Banner */}
      <div className="rounded-3xl bg-linear-to-br from-[#245C3A] via-[#1B432B] to-[#122E1D] text-white p-6 sm:p-8 shadow-xl border border-[#5F8F45]/30 relative overflow-hidden">
        {/* Soft Background Ag-pattern */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-[#D6A63A]/15 blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -top-12 w-64 h-64 rounded-full bg-[#5F8F45]/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#D6A63A] text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{aiT.badge}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black font-serif tracking-tight text-white mb-2">
            {aiT.title}
          </h1>
          <p className="text-sm sm:text-base text-gray-200 leading-relaxed">
            {aiT.subtitle}
          </p>

          {/* Clarity Indicators (Mandatory UI distinction) */}
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-white/10 text-xs">
            <span className="text-gray-300 font-semibold">{t.home.sections.marketPricesSub}:</span>
            <span className="px-2.5 py-1 rounded-full bg-[#5F8F45]/30 border border-[#5F8F45]/60 text-white font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#5F8F45]" />
              {aiT.actualMandiTag} (APMC)
            </span>
            <span className="px-2.5 py-1 rounded-full bg-[#D6A63A]/30 border border-[#D6A63A]/60 text-[#D6A63A] font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#D6A63A]" />
              {aiT.calculatedEstimateTag}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-blue-500/30 border border-blue-400/60 text-blue-200 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              {aiT.projectedTrendTag}
            </span>
          </div>
        </div>
      </div>

      {/* Crop Selector Strip */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EEF3E8] shadow-xs">
        <label className="block text-xs font-bold text-[#68736B] uppercase tracking-wider mb-3">
          {aiT.selectCropPrompt}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {crops.map((crop) => {
            const isSelected = crop.id === selectedCropId;
            return (
              <button
                key={crop.id}
                onClick={() => setSelectedCropId(crop.id)}
                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex items-center gap-3 ${
                  isSelected
                    ? 'border-[#245C3A] bg-[#EEF3E8] ring-2 ring-[#245C3A]/20 shadow-xs'
                    : 'border-[#EEF3E8] bg-[#FBFAF4] hover:bg-white hover:border-[#5F8F45]/40'
                }`}
              >
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-200 shrink-0 border border-black/5">
                  <img
                    src={resolveCropImage({ imageUrl: crop.imageUrl, crop: crop.name, variety: crop.variety, category: crop.category, images: crop.images })}
                    alt={crop.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => handleCropImageError(e, crop.name, crop.variety, crop.category)}
                  />
                  <div className="w-full h-full bg-[#245C3A]/20 flex items-center justify-center text-xs font-bold text-[#245C3A]">
                    {crop.name[0]}
                  </div>
                </div>

                <div className="min-w-0">
                  <h4 className="font-bold text-xs sm:text-sm text-[#26332B] truncate">{crop.name}</h4>
                  <p className="text-[11px] text-[#68736B]">
                    {crop.quantityKg.toLocaleString('en-IN')} kg • ₹{crop.currentMandiPrice}/kg
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3-WAY COMPARATIVE HARVEST DECISION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* OPTION 1: SELL NOW */}
        <div
          className={`rounded-3xl p-6 border-2 flex flex-col justify-between shadow-xs transition-all relative ${
            decision.recommendedOption === 'sell_now'
              ? 'border-[#5F8F45] bg-[#EEF3E8]/80 ring-2 ring-[#5F8F45]/30'
              : 'border-[#EEF3E8] bg-white'
          }`}
        >
          {decision.recommendedOption === 'sell_now' && (
            <div className="absolute -top-3.5 left-6 px-3.5 py-1 rounded-full bg-[#245C3A] text-white text-[11px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#D6A63A]" />
              <span>{aiT.recommendedBadge}</span>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-2 mt-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#245C3A]">
                {aiT.optionASellNow}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#5F8F45]/20 text-[#245C3A] font-bold">
                {aiT.lowRisk}
              </span>
            </div>

            <h3 className="text-base font-bold text-[#26332B] mb-3">
              {decision.sellNow.title}
            </h3>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs text-[#68736B] p-3.5 rounded-2xl bg-white/80 border border-[#EEF3E8] mb-4">
              <div className="flex justify-between items-center">
                <span>{aiT.grossRevenue} ({selectedCrop.quantityKg} kg):</span>
                <span className="font-bold text-[#26332B]">
                  ₹{decision.sellNow.grossRevenue.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>{aiT.transportCost}:</span>
                <span className="text-[#B86F4B] font-semibold">
                  -₹{decision.sellNow.transportCost}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>{aiT.storageCost}:</span>
                <span className="text-[#5F8F45] font-semibold">₹0 ({t.common.all})</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[#EEF3E8]">
                <span>{aiT.timeline}:</span>
                <span className="font-semibold text-[#26332B]">{decision.sellNow.timeline}</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#EEF3E8]">
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-xs font-medium text-[#68736B]">{aiT.netRealization}:</span>
              <span className="text-2xl font-black font-serif text-[#245C3A]">
                ₹{decision.sellNow.netValue.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              onClick={() => onSelectTab('search-buyers')}
              className="w-full py-2.5 rounded-xl bg-[#245C3A] hover:bg-[#1B432B] text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{aiT.actionAcceptOffer}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* OPTION 2: COLD STORAGE & HOLD */}
        <div
          className={`rounded-3xl p-6 border-2 flex flex-col justify-between shadow-xs transition-all relative ${
            decision.recommendedOption === 'store'
              ? 'border-[#D6A63A] bg-[#FFFBEF] ring-2 ring-[#D6A63A]/30'
              : 'border-[#EEF3E8] bg-white'
          }`}
        >
          {decision.recommendedOption === 'store' && (
            <div className="absolute -top-3.5 left-6 px-3.5 py-1 rounded-full bg-[#8C6212] text-white text-[11px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#D6A63A]" />
              <span>{aiT.recommendedBadge}</span>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-2 mt-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C6212]">
                {aiT.optionBColdStorage}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#D6A63A]/20 text-[#8C6212] font-bold">
                {aiT.mediumRisk}
              </span>
            </div>

            <h3 className="text-base font-bold text-[#26332B] mb-3">
              {decision.storeAndSellLater.title}
            </h3>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs text-[#68736B] p-3.5 rounded-2xl bg-white/80 border border-[#EEF3E8] mb-4">
              <div className="flex justify-between items-center">
                <span>{aiT.grossRevenue} (Projected):</span>
                <span className="font-bold text-[#26332B]">
                  ₹{decision.storeAndSellLater.projectedGross.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>{aiT.storageCost} (30 days):</span>
                <span className="text-[#B86F4B] font-semibold">
                  -₹{decision.storeAndSellLater.storageCostMonth}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>{aiT.transportCost}:</span>
                <span className="text-[#B86F4B] font-semibold">
                  -₹{decision.storeAndSellLater.transportCost}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[#EEF3E8]">
                <span>{aiT.timeline}:</span>
                <span className="font-semibold text-[#26332B]">
                  {decision.storeAndSellLater.timeline}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#EEF3E8]">
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-xs font-medium text-[#68736B]">{aiT.netRealization}:</span>
              <span className="text-2xl font-black font-serif text-[#26332B]">
                ₹{decision.storeAndSellLater.netValue.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              onClick={() => onSelectTab('storage-processing')}
              className="w-full py-2.5 rounded-xl bg-[#FBFAF4] hover:bg-[#EEF3E8] border border-[#EEF3E8] text-[#26332B] font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Warehouse className="w-3.5 h-3.5 text-[#5F8F45]" />
              <span>{aiT.actionBookStorage}</span>
            </button>
          </div>
        </div>

        {/* OPTION 3: PROCESS & VALUE-ADD AT MILL */}
        <div
          className={`rounded-3xl p-6 border-2 flex flex-col justify-between shadow-xs transition-all relative ${
            decision.recommendedOption === 'process'
              ? 'border-[#B86F4B] bg-[#FFF5F0] ring-2 ring-[#B86F4B]/30'
              : 'border-[#EEF3E8] bg-white'
          }`}
        >
          {decision.recommendedOption === 'process' && (
            <div className="absolute -top-3.5 left-6 px-3.5 py-1 rounded-full bg-[#B86F4B] text-white text-[11px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              <span>{aiT.recommendedBadge}</span>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-2 mt-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#B86F4B]">
                {aiT.optionCProcessMill}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#B86F4B]/20 text-[#B86F4B] font-bold">
                {aiT.mediumRisk}
              </span>
            </div>

            <h3 className="text-base font-bold text-[#26332B] mb-3">
              {decision.processAndSell.title}
            </h3>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs text-[#68736B] p-3.5 rounded-2xl bg-white/80 border border-[#EEF3E8] mb-4">
              <div className="flex justify-between items-center">
                <span>{aiT.grossRevenue} (Processed):</span>
                <span className="font-bold text-[#26332B]">
                  ₹{decision.processAndSell.processedGross.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>{aiT.processingCost}:</span>
                <span className="text-[#B86F4B] font-semibold">
                  -₹{decision.processAndSell.processingFee}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>{aiT.transportCost}:</span>
                <span className="text-[#B86F4B] font-semibold">
                  -₹{decision.processAndSell.packagingTransport}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[#EEF3E8]">
                <span>{aiT.timeline}:</span>
                <span className="font-semibold text-[#26332B]">
                  {decision.processAndSell.timeline}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#EEF3E8]">
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-xs font-medium text-[#68736B]">{aiT.netRealization}:</span>
              <span className="text-2xl font-black font-serif text-[#26332B]">
                ₹{decision.processAndSell.netValue.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              onClick={() => onSelectTab('storage-processing')}
              className="w-full py-2.5 rounded-xl bg-[#FBFAF4] hover:bg-[#EEF3E8] border border-[#EEF3E8] text-[#26332B] font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Factory className="w-3.5 h-3.5 text-[#B86F4B]" />
              <span>{aiT.actionContactProcessor}</span>
            </button>
          </div>
        </div>
      </div>

      {/* WHY THIS DECISION IS RECOMMENDED - DETAILED AGRONOMIC INSIGHT */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EEF3E8] shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#EEF3E8] flex items-center justify-center text-[#245C3A] shrink-0">
            <Sparkles className="w-5 h-5 text-[#245C3A]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#26332B] mb-1">
              {aiT.aiExplanationHeading}
            </h3>
            <p className="text-sm text-[#4A554E] leading-relaxed">
              {decision.recommendedReason}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
