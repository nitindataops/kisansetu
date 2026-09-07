import React, { useState } from 'react';
import {
  Search,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  DollarSign,
  Truck,
  Building,
  Star,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Info,
  PhoneCall,
  SlidersHorizontal,
} from 'lucide-react';
import { BuyerMatch, MarketPriceRecord } from '../../types/farmer';
import { LanguageCode } from '../../types';
import { getFarmerTranslations } from '../../data/farmerTranslations';

interface SearchBuyersViewProps {
  buyers: BuyerMatch[];
  marketPrices: MarketPriceRecord[];
  onOpenMakeOffer: (buyer: BuyerMatch) => void;
  onOpenContactBuyer: (buyer: BuyerMatch) => void;
  onOpenBuyerDetails: (buyer: BuyerMatch) => void;
  currentLanguage: LanguageCode;
}

export const SearchBuyersView: React.FC<SearchBuyersViewProps> = ({
  buyers,
  marketPrices,
  onOpenMakeOffer,
  onOpenContactBuyer,
  onOpenBuyerDetails,
  currentLanguage,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCropChip, setSelectedCropChip] = useState<string>('All');

  const t = getFarmerTranslations(currentLanguage);
  const bT = t.searchBuyersView;

  const cropChips = [
    { id: 'All', label: t.home.categories.all, icon: '🧺' },
    { id: 'Wheat', label: t.home.categories.wheat, icon: '🌾' },
    { id: 'Rice', label: t.home.categories.rice, icon: '🍚' },
    { id: 'Maize', label: t.home.categories.maize || 'Maize', icon: '🌽' },
    { id: 'Pulses', label: t.home.categories.pulses, icon: '🫘' },
  ];

  // Selected crop's live market intelligence
  const currentCropPriceData = marketPrices.find((m) =>
    selectedCropChip !== 'All' ? m.crop.toLowerCase().includes(selectedCropChip.toLowerCase()) : false
  );

  const filteredBuyers = buyers.filter((buyer) => {
    const matchSearch =
      buyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      buyer.requiredCrop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      buyer.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchChip =
      selectedCropChip === 'All' ||
      buyer.requiredCrop.toLowerCase().includes(selectedCropChip.toLowerCase());

    return matchSearch && matchChip;
  });

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* 1. SEARCH HEADER */}
      <section className="bg-linear-to-br from-[#245C3A] via-[#1E4D31] to-[#143521] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-[#D6A63A]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#D6A63A] text-xs font-bold mb-3 border border-white/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Verified Direct Buyers</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black tracking-tight text-white mb-2">
            {bT.title}
          </h2>
          <p className="text-white/80 text-xs sm:text-sm mb-6 leading-relaxed">
            {bT.subtitle}
          </p>

          {/* Search Bar Input */}
          <div className="relative bg-white rounded-2xl p-1.5 sm:p-2 shadow-2xl flex items-center gap-2 border border-white/20">
            <div className="pl-3 text-[#5F8F45]">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={bT.searchPlaceholder}
              className="w-full bg-transparent text-xs sm:text-sm text-[#26332B] placeholder:text-gray-400 focus:outline-hidden font-medium py-2"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-2 text-xs font-bold text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                Clear
              </button>
            )}
            <button className="px-5 py-2.5 rounded-xl bg-[#245C3A] hover:bg-[#1E4D31] text-white text-xs font-bold transition-colors shrink-0 shadow-xs cursor-pointer">
              {t.nav.searchBtn}
            </button>
          </div>
        </div>

        {/* 2. CROP CHIPS BAR */}
        <div className="mt-6 pt-5 border-t border-white/15">
          <span className="text-xs font-bold text-white/70 block mb-2.5">
            {bT.filterByCrop}:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {cropChips.map((chip) => (
              <button
                key={chip.id}
                onClick={() => setSelectedCropChip(chip.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  selectedCropChip === chip.id
                    ? 'bg-[#D6A63A] text-[#1A2E20] shadow-md scale-105'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                }`}
              >
                <span>{chip.icon}</span>
                <span>{chip.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SELECTED CROP LIVE MARKET BENCHMARK */}
      {currentCropPriceData && (
        <section className="p-5 rounded-3xl bg-[#EEF3E8] border border-[#5F8F45]/30 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in-50">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold text-[#5F8F45] bg-white px-2 py-0.5 rounded-md">
                Live Mandi Benchmark
              </span>
              <span className="text-xs font-medium text-[#68736B]">
                {currentCropPriceData.nearestMandi}
              </span>
            </div>
            <h3 className="text-lg font-bold font-serif text-[#245C3A]">
              {currentCropPriceData.crop} • {t.home.cropCard.mandiRate}: ₹{currentCropPriceData.currentMandiPrice}/kg
            </h3>
            <p className="text-xs text-[#68736B]">
              <b>Quality Requirement:</b> {currentCropPriceData.qualityRequirements}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[11px] text-[#68736B] block">Demand Level</span>
              <span className="text-xs font-bold text-[#245C3A] bg-white px-2.5 py-1 rounded-lg border border-[#5F8F45]/20 inline-block">
                {currentCropPriceData.demandLevel || currentCropPriceData.buyerDemand || 'High'}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* 4. BUYERS GRID */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-base font-serif text-[#26332B]">
            {bT.availableBuyers} ({filteredBuyers.length})
          </h3>
        </div>

        {filteredBuyers.length === 0 ? (
          <div className="p-10 bg-white rounded-3xl border border-[#EEF3E8] text-center">
            <Building className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="font-bold text-sm text-[#26332B]">{bT.noBuyersFound}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredBuyers.map((buyer) => (
              <div
                key={buyer.id}
                className="bg-white rounded-3xl border border-[#EEF3E8] hover:border-[#5F8F45]/50 shadow-xs hover:shadow-md transition-all p-5 sm:p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-base text-[#26332B]">{buyer.name}</h4>
                        {buyer.verified && (
                          <ShieldCheck className="w-4 h-4 text-[#5F8F45]" title="Verified Buyer" />
                        )}
                      </div>
                      <p className="text-xs text-[#68736B] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-[#5F8F45]" />
                        <span>{buyer.location}</span>
                        <span>•</span>
                        <span>{buyer.distanceKm} km {bT.away}</span>
                      </p>
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-[#5F8F45]/15 text-[#245C3A] text-xs font-black">
                      {buyer.matchScore}% {t.home.buyerCard.match}
                    </span>
                  </div>

                  {/* Requirement details */}
                  <div className="space-y-2 text-xs p-3.5 rounded-2xl bg-[#FBFAF4] border border-[#EEF3E8] my-3">
                    <div className="flex justify-between">
                      <span className="text-[#68736B]">{t.home.buyerCard.required}:</span>
                      <strong className="text-[#26332B]">
                        {buyer.requiredCrop} ({buyer.requiredVariety})
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#68736B]">{bT.quantityNeeded}:</span>
                      <span className="font-semibold text-[#26332B]">
                        {buyer.requiredQuantityKg.toLocaleString('en-IN')} kg
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#68736B]">{bT.pickupFacility}:</span>
                      <span className="text-[#5F8F45] font-semibold flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5" />
                        <span>{buyer.pickupProvided ? bT.farmPickupAvailable : 'Self Transport'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Price Offer & Escrow */}
                  <div className="flex items-baseline justify-between mb-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#68736B] block">
                        {t.home.buyerCard.offeredRate}
                      </span>
                      <div className="text-xl font-black font-serif text-[#245C3A]">
                        ₹{buyer.offeredPrice} <span className="text-xs font-normal text-gray-500">/kg</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] font-bold text-[#5F8F45] block">
                        ✓ {t.home.buyerCard.escrowProtected}
                      </span>
                      <span className="text-[11px] text-[#68736B]">
                        {buyer.paymentTerms}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-[#EEF3E8]">
                  <button
                    onClick={() => onOpenMakeOffer(buyer)}
                    className="flex-1 py-2.5 rounded-xl bg-[#245C3A] hover:bg-[#1B432B] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>{bT.makeOfferBtn}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onOpenContactBuyer(buyer)}
                    className="px-3.5 py-2.5 rounded-xl bg-[#FBFAF4] hover:bg-[#EEF3E8] border border-[#EEF3E8] text-[#26332B] text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-[#5F8F45]" />
                    <span>{bT.contactBtn}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
