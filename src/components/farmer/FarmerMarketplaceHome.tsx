import React from 'react';
import {
  Sprout,
  Plus,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Package,
  Bell,
  Sparkles,
  ChevronRight,
  Truck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Mic,
  MapPin,
  Calendar,
  Edit2,
  Trash2,
  Eye,
} from 'lucide-react';
import {
  CropListing,
  BuyerMatch,
  OrderRecord,
  MarketPriceRecord,
  BuyerEnquiry,
  NotificationItem,
  FarmerDashboardTab,
  FarmerProfile,
} from '../../types/farmer';
import { LanguageCode } from '../../types';
import { getFarmerTranslations } from '../../data/farmerTranslations';
import { resolveCropImage, handleCropImageError } from '../../data/imageAssets';
import { isApprovedCrop } from '../../data/cropVarieties';
import { getListingPrice } from '../../services/aiGradingService';

interface FarmerMarketplaceHomeProps {
  profile: FarmerProfile;
  crops: CropListing[];
  buyers: BuyerMatch[];
  orders: OrderRecord[];
  marketPrices: MarketPriceRecord[];
  enquiries: BuyerEnquiry[];
  notifications: NotificationItem[];
  onSelectTab: (tab: FarmerDashboardTab) => void;
  onOpenAddCropModal: () => void;
  onOpenCropDetails: (crop: CropListing) => void;
  onEditCrop?: (crop: CropListing) => void;
  onDeleteCrop?: (cropId: string) => void;
  onSellCrop?: (crop: CropListing) => void;
  onOpenAiAssistant: (initialPrompt?: string) => void;
  currentLanguage: LanguageCode;
}

export const FarmerMarketplaceHome: React.FC<FarmerMarketplaceHomeProps> = ({
  profile,
  crops,
  buyers,
  orders,
  marketPrices,
  enquiries,
  notifications,
  onSelectTab,
  onOpenAddCropModal,
  onOpenCropDetails,
  onEditCrop,
  onDeleteCrop,
  onSellCrop,
  onOpenAiAssistant,
  currentLanguage,
}) => {
  const t = getFarmerTranslations(currentLanguage);
  const homeT = t.home;
  const isHi = currentLanguage === 'hi';

  // Aggregate metrics
  const totalStockKg = crops.reduce((acc, c) => acc + c.quantityKg, 0);
  const activeOrders = orders.filter((o) => o.status !== 'Payment Completed');
  const availableCropsCount = crops.filter((c) => c.status === 'Available for Sale').length;

  // Selected major mandi rates for overview
  const featuredMandiPrices = marketPrices.slice(0, 4);

  // Top 3 enquiries
  const recentEnquiries = enquiries.slice(0, 3);

  // Top 3 notifications
  const recentNotifications = notifications.slice(0, 3);

  // Recent 2 active orders
  const recentOrders = orders.slice(0, 2);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in-50 duration-300">
      {/* ========================================================================= */}
      {/* 1. WELCOME / FARMER OVERVIEW HERO                                         */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#245C3A] via-[#1B432B] to-[#122E1D] text-white p-6 sm:p-8 shadow-lg border border-[#5F8F45]/30">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#D6A63A] text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D6A63A]" />
              <span>
                {isHi ? 'सत्यापित किसान' : 'Verified Farmer'} • ID: {profile.farmerId}
              </span>
              {profile.village && (
                <span className="text-gray-300">
                  • {profile.village}, {profile.district}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black font-serif tracking-tight text-white">
              {(() => {
                const name = profile?.name?.trim() || '';
                const hour = new Date().getHours();
                let template = homeT.greetingMorning;
                if (hour >= 12 && hour < 17) {
                  template = homeT.greetingAfternoon;
                } else if (hour >= 17 || hour < 5) {
                  template = homeT.greetingEvening;
                }
                if (name) {
                  return template.replace(/\{name\}/g, name);
                }
                return template.replace(/\{name\}\s*/g, '').trim();
              })()}
            </h1>

            <p className="text-xs sm:text-sm text-gray-200 max-w-2xl leading-relaxed">
              {homeT.welcomeSub}
            </p>

            {/* Direct primary Add Crop button */}
            <div className="pt-2 flex items-center gap-3 flex-wrap">
              <button
                id="farmer-hero-add-crop-btn"
                onClick={onOpenAddCropModal}
                className="px-4 py-2.5 rounded-xl bg-[#D6A63A] hover:bg-[#C2942F] text-[#245C3A] font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all cursor-pointer hover:scale-102"
              >
                <Plus className="w-4 h-4 text-[#245C3A]" />
                <span>{homeT.quickActions.addCrop}</span>
              </button>

              <button
                onClick={() => onSelectTab('voice-assistant')}
                className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Mic className="w-4 h-4 text-[#D6A63A]" />
                <span>{isHi ? '🎙️ आवाज सहायक' : '🎙️ Voice Assistant'}</span>
              </button>
            </div>
          </div>

          {/* 3 Compact High-Level Metrics */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 shrink-0">
            <div className="p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-left">
              <div className="text-[11px] text-gray-300 font-medium">
                {isHi ? 'सक्रिय फसलें' : 'Active Crops'}
              </div>
              <div className="text-xl sm:text-2xl font-black font-serif text-[#D6A63A] mt-0.5">
                {crops.length}
              </div>
              <div className="text-[10px] text-green-300 font-semibold mt-0.5">
                ✓ {availableCropsCount} {isHi ? 'बिक्री योग्य' : 'Available'}
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-left">
              <div className="text-[11px] text-gray-300 font-medium">
                {isHi ? 'कुल उपलब्ध स्टॉक' : 'Total Stock'}
              </div>
              <div className="text-xl sm:text-2xl font-black font-serif text-white mt-0.5">
                {(totalStockKg ?? 0).toLocaleString('en-IN')}{' '}
                <span className="text-xs font-normal">kg</span>
              </div>
              <div className="text-[10px] text-gray-300 font-medium mt-0.5">
                ≈ {(totalStockKg / 100).toFixed(1)} {isHi ? 'क्विंटल' : 'Quintals'}
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-left">
              <div className="text-[11px] text-gray-300 font-medium">
                {isHi ? 'सक्रिय ऑर्डर्स' : 'Active Orders'}
              </div>
              <div className="text-xl sm:text-2xl font-black font-serif text-[#D6A63A] mt-0.5">
                {activeOrders.length}
              </div>
              <div className="text-[10px] text-amber-300 font-semibold mt-0.5">
                🚚 {activeOrders.length > 0 ? (isHi ? 'पिकअप शेड्यूल' : 'In Transit') : (isHi ? 'सुरक्षित' : 'Settled')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. PRESENT CROPS — ACTUAL CROP CARDS (MUST REMAIN)                        */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#245C3A]/10 text-[#245C3A] flex items-center justify-center">
              <Sprout className="w-5 h-5 text-[#245C3A]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black font-serif text-[#26332B]">
                  {isHi ? 'वर्तमान फसलें (Present Crops)' : 'Present Crops'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-[#245C3A]/10 text-[#245C3A] text-xs font-bold">
                  {crops.filter((crop) => isApprovedCrop(crop.name || (crop as any).crop)).length} {isHi ? 'सक्रिय' : 'Active Lots'}
                </span>
              </div>
              <p className="text-xs text-[#68736B]">
                {isHi
                  ? 'आपके खेत की वर्तमान सक्रिय फसलें (केवल 4 प्रमुख फसलें: गेहूं, धान, मक्का, दालें), मात्रा, मंडी भाव और एआई गुणवत्ता ग्रेडिंग'
                  : 'Your active harvest crop lots (4 Major Crops: Wheat, Rice/Paddy, Maize, Pulses/Chana) with live Mandi rate and AI quality grading'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="present-crops-add-btn"
              onClick={onOpenAddCropModal}
              className="px-4 py-2 rounded-xl bg-[#245C3A] hover:bg-[#1E4D31] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#D6A63A]" />
              <span>{isHi ? '+ नई फसल जोड़ें' : '+ Add Crop'}</span>
            </button>
          </div>
        </div>

        {(() => {
          const validCrops = crops.filter((crop) => isApprovedCrop(crop.name || (crop as any).crop));
          if (validCrops.length === 0) {
            return (
              <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#EEF3E8] shadow-xs text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-[#EEF3E8] text-[#245C3A] flex items-center justify-center mx-auto text-2xl shadow-2xs">
                  🌾
                </div>
                <h3 className="text-base font-bold text-[#26332B]">
                  {isHi ? 'वर्तमान में कोई सक्रिय फसल सूचीबद्ध नहीं है' : 'No active crops currently listed'}
                </h3>
                <p className="text-xs text-[#68736B] max-w-md mx-auto leading-relaxed">
                  {isHi
                    ? 'अपनी कटाई को सीधे सत्यापित खरीदारों को बेचने के लिए नई फसल जोड़ें।'
                    : 'Add your active harvest lots with camera assessment and live mandi rates to connect with verified buyers.'}
                </p>
                <button
                  onClick={onOpenAddCropModal}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#245C3A] hover:bg-[#1E4D31] text-white text-xs font-bold shadow-md cursor-pointer transition-colors"
                >
                  <Plus className="w-4 h-4 text-[#D6A63A]" />
                  <span>{isHi ? '+ नई फसल जोड़ें' : '+ Add Your First Crop'}</span>
                </button>
              </div>
            );
          }

          return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {validCrops.map((crop) => {
                const cropPricing = getListingPrice(crop);
                return (
                  <div
                    key={crop.id}
                    className="bg-white rounded-3xl border border-[#EEF3E8] hover:border-[#5F8F45]/50 transition-all shadow-xs hover:shadow-md overflow-hidden flex flex-col justify-between group"
                  >
                    <div>
                      {/* Crop Banner Image with Badges */}
                      <div className="relative h-44 sm:h-48 w-full bg-gray-100 overflow-hidden">
                        <img
                          src={resolveCropImage({
                            imageUrl: crop.imageUrl || (crop as any).image,
                            crop: crop.name,
                            variety: crop.variety,
                            category: crop.category,
                            images: crop.images,
                          })}
                          alt={crop.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                          onError={(e) => handleCropImageError(e, crop.name, crop.variety, crop.category)}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                          {cropPricing.isPremium ? (
                            <span className="px-2.5 py-1 rounded-full bg-[#B45309] text-white text-xs font-black shadow-xs flex items-center gap-1">
                              <span>★</span>
                              <span>PREMIUM (+5%)</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full bg-[#245C3A] text-white text-xs font-black shadow-xs">
                              STANDARD
                            </span>
                          )}

                          <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-[#D6A63A]" />
                            <span>{isHi ? 'एआई सत्यापित' : 'AI Verified'}</span>
                          </span>
                        </div>

                        {/* Status badge top right */}
                        <div className="absolute top-3 right-3">
                          <span className="px-2 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#245C3A] text-[10px] font-bold shadow-2xs">
                            {crop.status || 'Available for Sale'}
                          </span>
                        </div>

                        {/* Quantity pill bottom right */}
                        <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-white/95 backdrop-blur-md text-[#245C3A] text-xs font-black shadow-xs">
                          {(crop.quantityKg ?? 0).toLocaleString('en-IN')} kg
                          <span className="text-[10px] text-[#68736B] font-medium ml-1">
                            ({((crop.quantityKg ?? 0) / 100).toFixed(1)} {isHi ? 'क्विंटल' : 'Qtl'})
                          </span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-4 sm:p-5 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-bold text-base sm:text-lg text-[#26332B] font-serif leading-snug">
                              {crop.name}
                            </h3>
                            <p className="text-xs text-[#68736B]">
                              {crop.variety || 'Standard Approved'} • {crop.location || `${crop.district || 'Bareilly'}, Uttar Pradesh`}
                            </p>
                          </div>
                        </div>

                        {/* Specifications */}
                        <div className="grid grid-cols-2 gap-2 text-xs text-[#68736B] py-2 border-y border-[#EEF3E8]">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-gray-400 block">
                              {isHi ? 'कटाई तिथि' : 'Harvest Date'}:
                            </span>
                            <span className="font-semibold text-[#26332B]">
                              {crop.harvestedDate || 'March 2026'}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-gray-400 block">
                              {isHi ? 'नमी / सूखापन' : 'Moisture'}:
                            </span>
                            <span className="font-semibold text-[#26332B]">
                              {crop.moistureContent || '11.5%'}
                            </span>
                          </div>
                        </div>

                        {/* Price Comparison */}
                        <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-[#FBFAF4] border border-[#EEF3E8]">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-[#68736B] block">
                              {isHi ? 'सरकारी मंडी भाव' : 'Live Mandi Ref'}
                            </span>
                            <div className="text-sm sm:text-base font-bold text-[#26332B]">
                              ₹{cropPricing.mandiRateKg}{' '}
                              <span className="text-xs font-normal text-gray-500">/kg</span>
                            </div>
                            <span className="text-[10px] text-gray-400 block">
                              (₹{cropPricing.mandiRateQuintal.toLocaleString('en-IN')}/q)
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] uppercase font-bold text-[#68736B] block">
                              {isHi ? 'सूचीबद्ध भाव' : 'Listing Price'}
                            </span>
                            <div className="text-sm sm:text-base font-black text-[#245C3A]">
                              ₹{cropPricing.pricePerKg}{' '}
                              <span className="text-xs font-normal text-gray-500">/kg</span>
                            </div>
                            <span className="text-[10px] text-[#245C3A] font-semibold block">
                              (₹{Math.round(cropPricing.pricePerKg * 100).toLocaleString('en-IN')}/q)
                              {cropPricing.isPremium && <span className="text-[#B45309] ml-1 font-bold">+5%</span>}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                {/* Actions Footer */}
                <div className="p-4 sm:p-5 pt-0 space-y-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => (onSellCrop ? onSellCrop(crop) : onSelectTab('search-buyers'))}
                      className="flex-1 py-2.5 rounded-xl bg-[#245C3A] hover:bg-[#1B432B] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span>{isHi ? 'खरीदार खोजें' : 'Find Buyers'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onOpenCropDetails(crop)}
                      className="p-2.5 rounded-xl bg-[#FBFAF4] hover:bg-[#EEF3E8] border border-[#EEF3E8] text-[#245C3A] transition-colors cursor-pointer"
                      title={isHi ? 'विवरण देखें' : 'View Details'}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {onEditCrop && (
                      <button
                        onClick={() => onEditCrop(crop)}
                        className="p-2.5 rounded-xl bg-[#FBFAF4] hover:bg-[#EEF3E8] border border-[#EEF3E8] text-[#245C3A] transition-colors cursor-pointer"
                        title={isHi ? 'संपादित करें' : 'Edit Crop'}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    {onDeleteCrop && (
                      <button
                        onClick={() => onDeleteCrop(crop.id)}
                        className="p-2.5 rounded-xl bg-[#FBFAF4] hover:bg-rose-50 border border-[#EEF3E8] hover:border-rose-200 text-rose-600 transition-colors cursor-pointer"
                        title={isHi ? 'हटाएं' : 'Delete Crop'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    })()}
  </section>

      {/* ========================================================================= */}
      {/* 3. TWO-COLUMN OVERVIEW: CURRENT MANDI SUMMARY + RECENT BUYER ENQUIRIES   */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CURRENT MARKET / MANDI SUMMARY */}
        <section className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EEF3E8] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EEF3E8]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#EEF3E8] text-[#245C3A] flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#26332B]">
                  {isHi ? 'वर्तमान मंडी भाव सारांश' : 'Current Mandi Summary'}
                </h2>
                <p className="text-xs text-[#68736B]">
                  {isHi ? 'सरकारी ई-नाम व एगमार्कनेट लाइव भाव' : 'Live AGMARKNET & e-NAM modal rates'}
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-[#5F8F45] bg-[#EEF3E8] px-2.5 py-1 rounded-full">
              LIVE APMC
            </span>
          </div>

          <div className="space-y-2.5">
            {featuredMandiPrices.map((mp, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-[#FBFAF4] border border-[#EEF3E8] flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-[#26332B] text-sm">{mp.crop}</div>
                  <div className="text-[11px] text-[#68736B] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#B86F4B]" />
                    <span>{mp.nearestMandi || 'District APMC Mandi'}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-black font-serif text-sm sm:text-base text-[#245C3A]">
                    ₹{(mp.modalPrice || mp.currentMandiPrice * 100).toLocaleString('en-IN')}{' '}
                    <span className="text-[10px] font-normal text-[#68736B]">/q</span>
                  </div>
                  <div className="flex items-center justify-end gap-1 text-[11px] font-bold mt-0.5">
                    {mp.trend === 'up' ? (
                      <span className="text-emerald-700 flex items-center">
                        <TrendingUp className="w-3 h-3 mr-0.5" />
                        +₹{Math.abs(mp.priceChange24h)}
                      </span>
                    ) : (
                      <span className="text-rose-700 flex items-center">
                        <TrendingDown className="w-3 h-3 mr-0.5" />
                        -₹{Math.abs(mp.priceChange24h)}
                      </span>
                    )}
                    <span className="text-gray-400 font-normal">• 24h</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-1 text-right">
            <button
              onClick={() => onSelectTab('market-prices')}
              className="text-xs font-bold text-[#245C3A] hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>{isHi ? 'मेनू में "मंडी भाव" से सभी मंडियां देखें' : 'View all APMC rates in Menu → Mandi Rates'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>

        {/* RECENT BUYER ENQUIRIES */}
        <section className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EEF3E8] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EEF3E8]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#EEF3E8] text-[#245C3A] flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#26332B]">
                  {isHi ? 'ताज़ा खरीदार पूछताछ' : 'Recent Buyer Enquiries'}
                </h2>
                <p className="text-xs text-[#68736B]">
                  {isHi ? 'सत्यापित मिलों व थोक खरीदारों से आए प्रस्ताव' : 'Inquiries from verified buyers & mills'}
                </p>
              </div>
            </div>

            {enquiries.filter((e) => e.status === 'New').length > 0 && (
              <span className="text-[11px] font-black text-white bg-[#B86F4B] px-2.5 py-0.5 rounded-full">
                {enquiries.filter((e) => e.status === 'New').length} {isHi ? 'नई' : 'New'}
              </span>
            )}
          </div>

          {recentEnquiries.length === 0 ? (
            <div className="p-6 rounded-2xl bg-[#FBFAF4] border border-dashed border-[#EEF3E8] text-center text-xs text-[#68736B]">
              {isHi ? 'फिलहाल कोई नई पूछताछ लंबित नहीं है।' : 'No active enquiries pending right now.'}
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentEnquiries.map((enq) => (
                <div
                  key={enq.id}
                  className="p-3 rounded-2xl bg-[#FBFAF4] border border-[#EEF3E8] flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 font-bold text-[#26332B]">
                      <span>{enq.buyerName}</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-[#5F8F45]" />
                    </div>
                    <div className="text-[11px] text-[#68736B]">
                      {enq.crop} • {enq.requestedQuantityKg.toLocaleString('en-IN')} kg
                    </div>
                    <div className="text-[11px] font-semibold text-[#8C6212]">
                      {isHi ? 'प्रस्तावित भाव' : 'Offered'}: ₹{enq.offeredPricePerKg}/kg
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        enq.status === 'New'
                          ? 'bg-[#B86F4B]/15 text-[#B86F4B]'
                          : enq.status === 'Accepted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {enq.status}
                    </span>
                    <button
                      onClick={() => onSelectTab('enquiries')}
                      className="block mt-1 text-[11px] font-bold text-[#245C3A] hover:underline cursor-pointer"
                    >
                      {isHi ? 'उत्तर दें →' : 'Respond →'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-1 text-right">
            <button
              onClick={() => onSelectTab('enquiries')}
              className="text-xs font-bold text-[#245C3A] hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>{isHi ? 'मेनू में "संदेश / पूछताछ" खोलें' : 'Open in Menu → Messages / Enquiries'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      </div>

      {/* ========================================================================= */}
      {/* 4. TWO-COLUMN OVERVIEW: RECENT ORDERS + IMPORTANT NOTIFICATIONS           */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RECENT ORDERS */}
        <section className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EEF3E8] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EEF3E8]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#EEF3E8] text-[#245C3A] flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#26332B]">
                  {isHi ? 'हाल के ऑर्डर्स व बिक्री' : 'Recent Orders & Sales'}
                </h2>
                <p className="text-xs text-[#68736B]">
                  {isHi ? 'कटाई बिक्री व पिकअप ट्रैकिंग' : 'Harvest sales & pickup tracking'}
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-[#245C3A] bg-[#EEF3E8] px-2.5 py-1 rounded-full">
              Escrow Protected
            </span>
          </div>

          {recentOrders.length === 0 ? (
            <div className="p-6 rounded-2xl bg-[#FBFAF4] border border-dashed border-[#EEF3E8] text-center text-xs text-[#68736B]">
              {isHi ? 'कोई सक्रिय ऑर्डर नहीं है।' : 'No active orders found.'}
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentOrders.map((ord) => (
                <div
                  key={ord.orderNumber}
                  className="p-3.5 rounded-2xl bg-[#FBFAF4] border border-[#EEF3E8] flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-[#245C3A]">{ord.orderNumber}</span>
                      <span className="text-[#68736B]">• {ord.buyerName}</span>
                    </div>
                    <div className="font-medium text-[#26332B]">
                      {ord.cropName} ({ord.variety}) • {ord.quantityKg.toLocaleString('en-IN')} kg
                    </div>
                    <div className="text-[11px] text-[#5F8F45] font-bold flex items-center gap-1">
                      <Truck className="w-3 h-3" />
                      <span>
                        {isHi ? 'पिकअप' : 'Pickup'}: {ord.pickupScheduledDate}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-black font-serif text-sm text-[#26332B]">
                      ₹{ord.totalAmount.toLocaleString('en-IN')}
                    </div>
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D6A63A]/20 text-[#8C6212] mt-1">
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-1 text-right">
            <button
              onClick={() => onSelectTab('orders')}
              className="text-xs font-bold text-[#245C3A] hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>{isHi ? 'मेनू में "ऑर्डर्स" से पूरी सूची देखें' : 'View all orders in Menu → Orders'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>

        {/* IMPORTANT NOTIFICATIONS */}
        <section className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EEF3E8] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EEF3E8]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#EEF3E8] text-[#245C3A] flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#26332B]">
                  {isHi ? 'महत्वपूर्ण सूचनाएं' : 'Important Notifications'}
                </h2>
                <p className="text-xs text-[#68736B]">
                  {isHi ? 'मंडी भाव व ऑर्डर संबंधी ताज़ा अलर्ट्स' : 'Market alerts and order updates'}
                </p>
              </div>
            </div>

            {notifications.filter((n) => !n.read).length > 0 && (
              <span className="text-[11px] font-black text-[#245C3A] bg-[#D6A63A] px-2.5 py-0.5 rounded-full">
                {notifications.filter((n) => !n.read).length} {isHi ? 'नए' : 'Unread'}
              </span>
            )}
          </div>

          <div className="space-y-2.5">
            {recentNotifications.map((notif) => (
              <div
                key={notif.id}
                className="p-3 rounded-2xl bg-[#FBFAF4] border border-[#EEF3E8] flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-[#26332B] flex items-center gap-1.5">
                    {!notif.read && <span className="w-2 h-2 rounded-full bg-[#B86F4B]" />}
                    <span>{notif.title}</span>
                  </div>
                  <div className="text-[11px] text-[#68736B] line-clamp-2">{notif.message}</div>
                </div>
                <div className="text-[10px] text-gray-400 shrink-0 font-medium whitespace-nowrap">
                  {notif.timestamp}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-1 text-right">
            <button
              onClick={() => onSelectTab('notifications')}
              className="text-xs font-bold text-[#245C3A] hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>{isHi ? 'मेनू में "सूचनाएं" खोलें' : 'View all in Menu → Notifications'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      </div>

      {/* ========================================================================= */}
      {/* 5. AI INSIGHTS / ADVISORY COMPACT SUMMARY                                 */}
      {/* ========================================================================= */}
      <section className="bg-gradient-to-br from-[#FFFBEF] to-[#FAF3DE] rounded-3xl p-5 sm:p-6 border border-[#D6A63A]/40 shadow-xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-[#D6A63A]/20">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#B87A14]" />
            <h2 className="text-base font-bold text-[#8C6212]">
              {isHi ? 'एआई कृषि व बाज़ार परामर्श' : 'AI Crop & Market Advisory'}
            </h2>
          </div>
          <span className="text-[10px] font-bold text-[#8C6212] bg-[#D6A63A]/20 px-2.5 py-0.5 rounded-full border border-[#D6A63A]/30">
            Powered by KisanSetu AI
          </span>
        </div>

        <p className="text-xs sm:text-sm text-[#64440B] leading-relaxed">
          {isHi
            ? '💡 बाज़ार विश्लेषण: आपके क्षेत्र में गेहूं और चना के भाव अगले 7-10 दिनों में 4% से 6% तक मजबूत रहने का अनुमान है। यदि भंडारण उपलब्ध है, तो 40-50% स्टॉक को होल्ड करना लाभकारी हो सकता है।'
            : '💡 Market Insight: Wheat & Chana modal prices in your district are forecasted to rise 4–6% over the next 7–10 days. Storing 40–50% of your harvest in registered warehouse could yield higher returns.'}
        </p>

        <div className="flex items-center gap-3 pt-1 flex-wrap">
          <button
            onClick={() => onSelectTab('ai-analysis')}
            className="px-3.5 py-1.5 rounded-xl bg-[#245C3A] hover:bg-[#1E4D31] text-white text-xs font-bold transition-colors cursor-pointer"
          >
            {isHi ? 'विस्तृत एआई विश्लेषण देखें →' : 'View Full AI Analysis →'}
          </button>

          <button
            onClick={() => onSelectTab('voice-assistant')}
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-amber-50 text-[#8C6212] border border-[#D6A63A]/40 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Mic className="w-3.5 h-3.5 text-[#B87A14]" />
            <span>{isHi ? '🎙️ आवाज सहायक से पूछें' : '🎙️ Ask Voice Assistant'}</span>
          </button>
        </div>
      </section>
    </div>
  );
};
