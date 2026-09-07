import React from 'react';
import {
  Sprout,
  Search,
  Warehouse,
  Factory,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ChevronRight,
  Package,
  Layers,
  Scale,
  DollarSign,
  Truck,
  Building,
} from 'lucide-react';
import {
  CropListing,
  BuyerMatch,
  OrderRecord,
  ValueDecision,
  FarmerDashboardTab,
} from '../../types/farmer';
import { resolveCropImage, handleCropImageError } from '../../data/imageAssets';

interface FarmerOverviewProps {
  crops: CropListing[];
  buyers: BuyerMatch[];
  orders: OrderRecord[];
  valueDecision: ValueDecision;
  onSelectTab: (tab: FarmerDashboardTab) => void;
  onOpenAddCropModal: () => void;
  onOpenBuyerDetails: (buyer: BuyerMatch) => void;
  onOpenContactBuyer: (buyer: BuyerMatch) => void;
  onOpenMakeOffer: (buyer: BuyerMatch) => void;
  onOpenMapModal: () => void;
}

export const FarmerOverview: React.FC<FarmerOverviewProps> = ({
  crops,
  buyers,
  orders,
  valueDecision,
  onSelectTab,
  onOpenAddCropModal,
  onOpenBuyerDetails,
  onOpenContactBuyer,
  onOpenMakeOffer,
  onOpenMapModal,
}) => {
  // Aggregate stats
  const totalQuantityKg = crops.reduce((acc, c) => acc + c.quantityKg, 0);
  const activeOrdersCount = orders.filter(
    (o) => o.status !== 'Payment Completed'
  ).length;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in-50 duration-300">
      {/* 1. DASHBOARD HERO: Your Farm at a Glance 🌾 */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#245C3A] via-[#1E4D31] to-[#122E1D] text-white p-6 sm:p-8 shadow-xl border border-[#5F8F45]/30">
        {/* Subtle moving background farm contours and crop breeze */}
        <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
          <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-[#D6A63A] blur-3xl" />
          <div className="absolute -left-16 -bottom-16 w-80 h-80 rounded-full bg-[#5F8F45] blur-3xl" />
          {/* Animated Wheat wave layer */}
          <div className="absolute bottom-0 inset-x-0 h-24 flex justify-around opacity-25">
            {[...Array(12)].map((_, i) => (
              <span
                key={i}
                className="text-4xl select-none"
                style={{
                  animation: `wheatBreeze ${4 + (i % 4)}s ease-in-out infinite alternate`,
                  animationDelay: `${i * 0.3}s`,
                }}
              >
                🌾
              </span>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes wheatBreeze {
            0% { transform: rotate(-6deg) scale(0.95); }
            100% { transform: rotate(10deg) scale(1.05); }
          }
        `}</style>

        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#D6A63A] text-xs font-bold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Harvest Season 2026 • Meerut Agricultural Zone</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black tracking-tight text-white mb-2">
                Your Farm at a Glance 🌾
              </h2>
              <p className="text-white/80 text-sm sm:text-base leading-relaxed">
                Direct trade connections active. 5 verified institutional buyers have open
                procurement for your registered crops today.
              </p>
            </div>

            {/* Quick Location & Map Button */}
            <button
              onClick={onOpenMapModal}
              className="self-start lg:self-center inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/30 text-white text-xs font-bold backdrop-blur-md transition-all duration-200 shadow-sm"
            >
              <MapPin className="w-4 h-4 text-[#D6A63A]" />
              <span>📍 Haridaspur, Meerut (18 km to Mandi)</span>
              <span className="underline ml-1">View on Map</span>
            </button>
          </div>

          {/* 4 Farm Key Metric Blocks */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-white/15">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <div className="flex items-center justify-between text-white/70 text-xs font-medium mb-1">
                <span>Total Land</span>
                <span className="text-base">🌱</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold font-serif text-white">12.5 Acres</div>
              <div className="text-[11px] text-[#D6A63A] mt-0.5 font-medium">Alluvial Soil • Irrigated</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <div className="flex items-center justify-between text-white/70 text-xs font-medium mb-1">
                <span>Active Crops</span>
                <span className="text-base">🌾</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold font-serif text-white">
                {crops.length} Listed
              </div>
              <div className="text-[11px] text-[#5F8F45] bg-white/10 px-1.5 py-0.5 rounded-md inline-block mt-0.5 font-bold">
                ✓ Photo Verified
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <div className="flex items-center justify-between text-white/70 text-xs font-medium mb-1">
                <span>Available Quantity</span>
                <span className="text-base">⚖️</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold font-serif text-white">
                {totalQuantityKg.toLocaleString('en-IN')} kg
              </div>
              <div className="text-[11px] text-white/80 mt-0.5 font-medium">Ready for Dispatch</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <div className="flex items-center justify-between text-white/70 text-xs font-medium mb-1">
                <span>Buyer Requests</span>
                <span className="text-base">🛒</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold font-serif text-[#D6A63A]">
                7 Inquiries
              </div>
              <div className="text-[11px] text-white/80 mt-0.5 font-medium">
                {buyers.length} Verified Matches
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 4 LARGE FRIENDLY QUICK ACTION CARDS */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold font-serif text-[#26332B] flex items-center gap-2">
              <span>Quick Actions</span>
              <span className="text-xs font-normal text-[#68736B]">
                (Tap to perform essential farm tasks)
              </span>
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Add Crop / Sell */}
          <button
            id="quick-action-add-crop"
            onClick={onOpenAddCropModal}
            className="group text-left p-5 rounded-2xl bg-white hover:bg-[#EEF3E8]/80 border-2 border-[#5F8F45]/30 hover:border-[#5F8F45] transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#5F8F45]/15 text-[#245C3A] flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">
                🌱
              </div>
              <h4 className="text-base font-bold text-[#245C3A] flex items-center justify-between">
                <span>Add Crop / Sell</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-[#5F8F45]" />
              </h4>
              <p className="text-xs text-[#68736B] mt-1 leading-relaxed">
                List your harvested crop with expected rate and grade.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#EEF3E8] flex items-center gap-1.5 text-xs font-bold text-[#245C3A]">
              <span>+ List New Harvest</span>
            </div>
          </button>

          {/* Card 2: Find Buyers */}
          <button
            id="quick-action-find-buyers"
            onClick={() => onSelectTab('search-buyers')}
            className="group text-left p-5 rounded-2xl bg-white hover:bg-[#EEF3E8]/80 border border-[#EEF3E8] hover:border-[#245C3A]/40 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#245C3A]/10 text-[#245C3A] flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">
                🔎
              </div>
              <h4 className="text-base font-bold text-[#26332B] flex items-center justify-between">
                <span>Find Buyers</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-[#245C3A]" />
              </h4>
              <p className="text-xs text-[#68736B] mt-1 leading-relaxed">
                Discover verified institutional buyers near you.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#EEF3E8] flex items-center gap-1.5 text-xs font-bold text-[#5F8F45]">
              <span>{buyers.length} Verified Buyers Ready →</span>
            </div>
          </button>

          {/* Card 3: Find Processor */}
          <button
            id="quick-action-find-processor"
            onClick={() => onSelectTab('storage-processing')}
            className="group text-left p-5 rounded-2xl bg-white hover:bg-[#EEF3E8]/80 border border-[#EEF3E8] hover:border-[#D6A63A]/60 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#D6A63A]/15 text-[#8C6212] flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">
                🏭
              </div>
              <h4 className="text-base font-bold text-[#26332B] flex items-center justify-between">
                <span>Find Processor</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-[#D6A63A]" />
              </h4>
              <p className="text-xs text-[#68736B] mt-1 leading-relaxed">
                Find milling, sorting and food processing opportunities.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#EEF3E8] flex items-center gap-1.5 text-xs font-bold text-[#8C6212]">
              <span>Explore 4 Mills Nearby →</span>
            </div>
          </button>

          {/* Card 4: Find Storage */}
          <button
            id="quick-action-find-storage"
            onClick={() => onSelectTab('storage-processing')}
            className="group text-left p-5 rounded-2xl bg-white hover:bg-[#EEF3E8]/80 border border-[#EEF3E8] hover:border-[#B86F4B]/50 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#B86F4B]/15 text-[#B86F4B] flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">
                ❄️
              </div>
              <h4 className="text-base font-bold text-[#26332B] flex items-center justify-between">
                <span>Find Storage</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-[#B86F4B]" />
              </h4>
              <p className="text-xs text-[#68736B] mt-1 leading-relaxed">
                Find nearby cold storage and hermetic grain silos.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#EEF3E8] flex items-center gap-1.5 text-xs font-bold text-[#B86F4B]">
              <span>From ₹14/quintal/mo →</span>
            </div>
          </button>
        </div>
      </section>

      {/* 3. VALUE DECISION: What's the Best Option for Your Crop? */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EEF3E8] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EEF3E8]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">📊</span>
              <h3 className="text-lg sm:text-xl font-bold font-serif text-[#26332B]">
                What's the Best Option for Your Crop?
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#68736B] mt-0.5">
              Live market intelligence analysis for <b className="text-[#245C3A]">{valueDecision.cropName}</b>
            </p>
          </div>

          {/* Calculated Estimate Disclaimer Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D6A63A]/15 border border-[#D6A63A]/30 text-[#8C6212] text-xs font-bold self-start sm:self-auto">
            <Scale className="w-3.5 h-3.5" />
            <span>Calculated Estimate</span>
          </div>
        </div>

        {/* 3 Comparative Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {/* OPTION 1: SELL NOW (RECOMMENDED) */}
          <div className="relative rounded-2xl p-5 border-2 border-[#5F8F45] bg-[#EEF3E8]/60 flex flex-col justify-between shadow-xs">
            <div className="absolute -top-3 left-4 px-3 py-0.5 rounded-full bg-[#245C3A] text-white text-[11px] font-black uppercase tracking-wider shadow-xs flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-[#D6A63A]" />
              <span>Recommended</span>
            </div>

            <div>
              <div className="flex items-center justify-between mt-1 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#245C3A]">
                  SELL NOW
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-[#5F8F45]/20 text-[#245C3A] font-bold">
                  Low Risk
                </span>
              </div>

              <h4 className="text-sm font-bold text-[#26332B] mb-2">
                Direct Buyer Sale (Mother Dairy)
              </h4>

              <div className="space-y-1.5 text-xs text-[#68736B] mb-4">
                <div className="flex justify-between">
                  <span>Gross Realization:</span>
                  <span className="font-semibold text-[#26332B]">
                    ₹{(valueDecision?.sellNow?.grossRevenue ?? 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Transportation (24 km):</span>
                  <span className="text-[#B86F4B]">-₹{valueDecision?.sellNow?.transportCost ?? 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Mandi Cess / Storage:</span>
                  <span className="text-[#5F8F45]">₹0 (Free)</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#5F8F45]/30">
              <div className="flex items-baseline justify-between mb-3">
                <span className="text-xs font-medium text-[#68736B]">Estimated Net:</span>
                <span className="text-2xl font-black font-serif text-[#245C3A]">
                  ₹{(valueDecision?.sellNow?.netValue ?? 0).toLocaleString('en-IN')}
                </span>
              </div>

              <button
                onClick={() => onSelectTab('search-buyers')}
                className="w-full py-2.5 rounded-xl bg-[#245C3A] hover:bg-[#1E4D31] text-white font-bold text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>Accept Best Offer (₹31/kg)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* OPTION 2: STORE AND SELL LATER */}
          <div className="rounded-2xl p-5 border border-[#EEF3E8] bg-white flex flex-col justify-between hover:border-[#D6A63A]/40 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8C6212]">
                  COLD STORE (30 Days)
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-[#D6A63A]/20 text-[#8C6212] font-bold">
                  Med Risk
                </span>
              </div>

              <h4 className="text-sm font-bold text-[#26332B] mb-2">
                Sheetal Cold Storage (8 km)
              </h4>

              <div className="space-y-1.5 text-xs text-[#68736B] mb-4">
                <div className="flex justify-between">
                  <span>Projected Gross (₹34/kg):</span>
                  <span className="font-semibold text-[#26332B]">
                    ₹{(valueDecision?.storeAndSellLater?.projectedGross ?? 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Storage Rent (1 Mo):</span>
                  <span className="text-[#B86F4B]">
                    -₹{valueDecision?.storeAndSellLater?.storageCostMonth ?? 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>2-Way Transport:</span>
                  <span className="text-[#B86F4B]">
                    -₹{valueDecision?.storeAndSellLater?.transportCost ?? 0}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#EEF3E8]">
              <div className="flex items-baseline justify-between mb-3">
                <span className="text-xs font-medium text-[#68736B]">Projected Net:</span>
                <span className="text-xl font-bold font-serif text-[#26332B]">
                  ₹{(valueDecision?.storeAndSellLater?.netValue ?? 0).toLocaleString('en-IN')}
                </span>
              </div>

              <button
                onClick={() => onSelectTab('storage-processing')}
                className="w-full py-2.5 rounded-xl bg-[#FBFAF4] hover:bg-[#EEF3E8] border border-[#EEF3E8] text-[#26332B] font-bold text-xs transition-colors"
              >
                <span>Reserve Storage Space</span>
              </button>
            </div>
          </div>

          {/* OPTION 3: PROCESS & VALUE ADD */}
          <div className="rounded-2xl p-5 border border-[#EEF3E8] bg-white flex flex-col justify-between hover:border-[#B86F4B]/40 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#B86F4B]">
                  PROCESS (Puree Plant)
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-[#B86F4B]/20 text-[#B86F4B] font-bold">
                  Med Risk
                </span>
              </div>

              <h4 className="text-sm font-bold text-[#26332B] mb-2">
                Kisan Agro Puree Unit (22 km)
              </h4>

              <div className="space-y-1.5 text-xs text-[#68736B] mb-4">
                <div className="flex justify-between">
                  <span>Processed Value:</span>
                  <span className="font-semibold text-[#26332B]">
                    ₹{(valueDecision?.processAndSell?.processedGross ?? 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Fee:</span>
                  <span className="text-[#B86F4B]">
                    -₹{valueDecision?.processAndSell?.processingFee ?? 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Packaging & Transport:</span>
                  <span className="text-[#B86F4B]">
                    -₹{valueDecision?.processAndSell?.packagingTransport ?? 0}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#EEF3E8]">
              <div className="flex items-baseline justify-between mb-3">
                <span className="text-xs font-medium text-[#68736B]">Potential Net:</span>
                <span className="text-xl font-bold font-serif text-[#26332B]">
                  ₹{(valueDecision?.processAndSell?.netValue ?? 0).toLocaleString('en-IN')}
                </span>
              </div>

              <button
                onClick={() => onSelectTab('storage-processing')}
                className="w-full py-2.5 rounded-xl bg-[#FBFAF4] hover:bg-[#EEF3E8] border border-[#EEF3E8] text-[#26332B] font-bold text-xs transition-colors"
              >
                <span>Inquire Processing Mill</span>
              </button>
            </div>
          </div>
        </div>

        {/* Recommendation Reason Callout */}
        <div className="mt-4 p-3.5 rounded-xl bg-[#EEF3E8] border border-[#5F8F45]/20 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-[#245C3A] shrink-0 mt-0.5" />
          <p className="text-xs text-[#26332B] leading-relaxed">
            <strong className="text-[#245C3A]">Why Sell Now is Recommended: </strong>
            {valueDecision.recommendedReason}
          </p>
        </div>
      </section>

      {/* 4. MY CROPS & BEST BUYERS TWO-COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: My Crops Preview (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#EEF3E8] shadow-sm">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#EEF3E8]">
            <div className="flex items-center gap-2">
              <Sprout className="w-5 h-5 text-[#5F8F45]" />
              <h3 className="text-lg font-bold font-serif text-[#26332B]">My Crops Inventory</h3>
            </div>
            <button
              onClick={() => onSelectTab('my-crops')}
              className="text-xs font-bold text-[#245C3A] hover:underline flex items-center gap-1"
            >
              <span>View All ({crops.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {crops.slice(0, 3).map((crop) => (
              <div
                key={crop.id}
                className="p-3.5 rounded-2xl bg-[#FBFAF4] hover:bg-[#EEF3E8]/50 border border-[#EEF3E8] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-200 shrink-0 border border-black/5">
                    <img
                      src={resolveCropImage({ imageUrl: crop.imageUrl, crop: crop.name, variety: crop.variety, category: crop.category, images: crop.images })}
                      alt={crop.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => handleCropImageError(e, crop.name, crop.variety, crop.category)}
                    />
                    <div className="absolute inset-0 bg-[#245C3A]/20 flex items-center justify-center text-xs font-bold text-white">
                      {crop.name[0]}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-[#26332B]">{crop.name}</h4>
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#5F8F45]/15 text-[#245C3A] font-bold">
                        Grade {crop.grade}
                      </span>
                    </div>
                    <p className="text-xs text-[#68736B]">{crop.variety}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs">
                      <span className="font-bold text-[#245C3A]">
                        {(crop.quantityKg ?? 0).toLocaleString('en-IN')} kg
                      </span>
                      <span className="text-[#68736B]">•</span>
                      <span className="text-xs text-[#68736B]">Mandi: ₹{crop.currentMandiPrice}/kg</span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase font-bold text-[#68736B]">Expected</span>
                    <div className="text-sm font-bold text-[#D6A63A]">₹{crop.expectedPrice}/kg</div>
                  </div>

                  <button
                    onClick={() => onSelectTab('my-crops')}
                    className="px-3 py-1.5 rounded-xl bg-white border border-[#5F8F45]/30 text-[#245C3A] hover:bg-[#245C3A] hover:text-white text-xs font-bold transition-colors"
                  >
                    Manage
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-[#EEF3E8]">
            <button
              onClick={onOpenAddCropModal}
              className="w-full py-2.5 rounded-xl border border-dashed border-[#5F8F45] text-[#245C3A] hover:bg-[#EEF3E8] text-xs font-bold transition-colors flex items-center justify-center gap-2"
            >
              <span>+ Add Another Crop to Sell</span>
            </button>
          </div>
        </div>

        {/* Right Column: Best Matched Buyers (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#EEF3E8] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#EEF3E8]">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-[#245C3A]" />
                <h3 className="text-lg font-bold font-serif text-[#26332B]">Best Matched Buyers</h3>
              </div>
              <button
                onClick={() => onSelectTab('search-buyers')}
                className="text-xs font-bold text-[#245C3A] hover:underline flex items-center gap-1"
              >
                <span>Browse All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {buyers.slice(0, 2).map((buyer) => (
                <div
                  key={buyer.id}
                  className="p-4 rounded-2xl bg-[#FBFAF4] border border-[#EEF3E8] hover:border-[#5F8F45]/40 transition-all"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-sm text-[#26332B]">{buyer.name}</h4>
                        <ShieldCheck className="w-4 h-4 text-[#5F8F45]" />
                      </div>
                      <p className="text-xs text-[#68736B]">
                        Required: <b className="text-[#26332B]">{buyer.requiredCrop}</b> ({buyer.requiredQuantityKg} kg)
                      </p>
                    </div>

                    {/* Transparent Match Score */}
                    <div className="text-right">
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#5F8F45]/15 text-[#245C3A] font-black text-xs">
                        {buyer.matchScore}% Match
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs py-2 my-2 border-y border-[#EEF3E8]">
                    <div>
                      <span className="text-[#68736B]">Offered Rate:</span>{' '}
                      <strong className="text-[#245C3A] text-sm">₹{buyer.offeredPrice}/kg</strong>
                    </div>
                    <div className="text-[#68736B]">
                      <span>📍 {buyer.distanceKm} km away</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenMakeOffer(buyer)}
                      className="flex-1 py-1.5 rounded-xl bg-[#245C3A] hover:bg-[#1E4D31] text-white text-xs font-bold transition-colors text-center"
                    >
                      Make Offer
                    </button>
                    <button
                      onClick={() => onOpenContactBuyer(buyer)}
                      className="px-3 py-1.5 rounded-xl bg-white border border-[#EEF3E8] hover:bg-[#EEF3E8] text-[#26332B] text-xs font-semibold transition-colors"
                    >
                      Contact
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#EEF3E8]">
            <div className="flex items-center justify-between text-xs text-[#68736B]">
              <span>All buyers verified by APMC/FSSAI</span>
              <span className="text-[#5F8F45] font-bold">100% Escrow Protected</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. ACTIVE ORDERS & TIMELINE SUMMARY */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EEF3E8] shadow-sm">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#EEF3E8]">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#245C3A]" />
            <h3 className="text-lg font-bold font-serif text-[#26332B]">
              Active Orders & Dispatch Tracking
            </h3>
          </div>
          <button
            onClick={() => onSelectTab('orders')}
            className="text-xs font-bold text-[#245C3A] hover:underline flex items-center gap-1"
          >
            <span>View Full Orders ({orders.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-4">
          {orders.slice(0, 2).map((order) => (
            <div
              key={order.id}
              className="p-5 rounded-2xl bg-[#FBFAF4] border border-[#EEF3E8] hover:border-[#5F8F45]/40 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#68736B]">
                      {order.orderNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#5F8F45]/15 text-[#245C3A] text-xs font-bold">
                      {order.status}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-[#26332B] mt-0.5">
                    {order.buyerName} • {order.crop} ({order.quantityKg} kg @ ₹{order.ratePerKg}/kg)
                  </h4>
                </div>

                <div className="text-left md:text-right">
                  <span className="text-xs text-[#68736B] block">Total Deal Amount</span>
                  <span className="text-lg font-black font-serif text-[#245C3A]">
                    ₹{(order.totalAmount ?? 0).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] text-[#5F8F45] block font-medium">
                    ✓ {order.paymentStatus}
                  </span>
                </div>
              </div>

              {/* 7-Step Order Progress Tracker */}
              <div className="pt-2">
                <div className="hidden sm:grid grid-cols-7 gap-1 text-center">
                  {[
                    'Offer Submitted',
                    'Negotiation',
                    'Accepted',
                    'Pickup Scheduled',
                    'In Transit',
                    'Delivered',
                    'Payment Completed',
                  ].map((step, idx) => {
                    const isDone = idx <= order.stepIndex;
                    const isCurrent = idx === order.stepIndex;
                    return (
                      <div key={step} className="flex flex-col items-center">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mb-1 transition-colors ${
                            isCurrent
                              ? 'bg-[#245C3A] text-white ring-4 ring-[#5F8F45]/20'
                              : isDone
                              ? 'bg-[#5F8F45] text-white'
                              : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          {isDone ? '✓' : idx + 1}
                        </div>
                        <span
                          className={`text-[10px] leading-tight ${
                            isCurrent
                              ? 'font-bold text-[#245C3A]'
                              : isDone
                              ? 'font-medium text-[#26332B]'
                              : 'text-gray-400'
                          }`}
                        >
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Mobile simplified progress bar */}
                <div className="sm:hidden">
                  <div className="flex justify-between text-xs font-bold text-[#245C3A] mb-1">
                    <span>Progress: {order.status}</span>
                    <span>Step {order.stepIndex + 1} of 7</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#5F8F45] rounded-full transition-all"
                      style={{ width: `${((order.stepIndex + 1) / 7) * 100}%` }}
                    />
                  </div>
                </div>

                {order.vehicleNumber && (
                  <div className="mt-3 p-2.5 rounded-xl bg-white border border-[#EEF3E8] flex items-center justify-between text-xs text-[#26332B]">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[#5F8F45]" />
                      <span>
                        Vehicle: <b>{order.vehicleNumber}</b> (Driver: {order.driverName})
                      </span>
                    </div>
                    {order.driverPhone && (
                      <a
                        href={`tel:${order.driverPhone}`}
                        className="text-[#245C3A] font-bold hover:underline"
                      >
                        📞 Call Driver
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
