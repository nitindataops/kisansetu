import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  Heart,
  ShoppingCart,
  MapPin,
  CheckCircle2,
  Calendar,
  Warehouse,
  Droplet,
  Sparkles,
  MessageSquare,
  QrCode,
  ShieldCheck,
  Navigation,
  Check,
  Plus,
  Minus,
  Star,
  ChevronRight,
  TrendingDown,
  Award,
  Zap,
  PhoneCall,
  Scale,
  Compass
} from 'lucide-react';
import { MarketplaceProduct } from '../../types/buyer';
import { LanguageCode } from '../../types';
import { buyerTranslations } from '../../data/buyerTranslations';
import { SMART_ALTERNATIVES_MAP } from '../../data/buyerData';
import { resolveCropGallery, handleCropImageError } from '../../data/imageAssets';
import { formatDistanceDisplay } from '../../utils/distanceCalculator';
import { getListingPrice } from '../../services/aiGradingService';
import { isApprovedCrop } from '../../utils/cropFilterUtils';
import { BuyerProductMapModal } from './BuyerProductMapModal';

interface BuyerProductDetailPageProps {
  product: MarketplaceProduct;
  allProducts: MarketplaceProduct[];
  currentLanguage: LanguageCode;
  onBack: () => void;
  onAddToCart: (product: MarketplaceProduct, quantityKg: number) => void;
  onBuyNow?: (product: MarketplaceProduct, quantityKg: number) => void;
  onSelectProduct: (product: MarketplaceProduct) => void;
  onSelectFarmerProfile: (farmerId: string) => void;
  onOpenMessageWithFarmer: (farmerId: string, cropName: string) => void;
  onOpenBatchQR: (batchId: string) => void;
  onOpenSmartBuyModal?: (product: MarketplaceProduct) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (productId: string) => void;
  buyerLocation?: string;
  buyerDistrict?: string;
}

export const BuyerProductDetailPage: React.FC<BuyerProductDetailPageProps> = ({
  product,
  allProducts,
  currentLanguage,
  onBack,
  onAddToCart,
  onBuyNow,
  onSelectProduct,
  onSelectFarmerProfile,
  onOpenMessageWithFarmer,
  onOpenBatchQR,
  onOpenSmartBuyModal,
  isFavorite = false,
  onToggleFavorite,
  buyerLocation = 'Bareilly APMC Mandi, Bareilly, Uttar Pradesh',
  buyerDistrict = 'Bareilly',
}) => {
  const t = buyerTranslations[currentLanguage] || buyerTranslations.en;
  const isHi = currentLanguage === 'hi';

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [orderQty, setOrderQty] = useState<number>(product.minOrderQtyKg || 100);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  // Reset selected image and quantity when product changes
  useEffect(() => {
    setSelectedImageIndex(0);
    setOrderQty(product.minOrderQtyKg || 100);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product.id]);

  const gallery = resolveCropGallery({
    imageUrl: product.imageUrl,
    crop: product.crop,
    variety: product.variety,
    category: product.category,
    galleryImages: product.galleryImages,
  });

  const alternatives = SMART_ALTERNATIVES_MAP[product.variety] || [];

  // Similar / Recommended products (strictly within approved 4 major crops)
  const similarProducts = [...allProducts]
    .filter((p) => p.id !== product.id && isApprovedCrop(p.crop))
    .map((p) => {
      let score = 0;
      if (p.crop.toLowerCase() === product.crop.toLowerCase()) score += 100;
      if (p.variety.toLowerCase() === product.variety.toLowerCase()) score += 50;
      if (p.grade === product.grade) score += 20;
      if (p.state === product.state || p.district === product.district) score += 15;
      if (Math.abs(p.pricePerKg - product.pricePerKg) <= 15) score += 10;
      if (p.category === product.category) score += 5;
      return { product: p, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((item) => item.product);

  const handleIncrement = () => {
    setOrderQty((prev) => Math.min(product.availableQuantityKg, prev + 50));
  };

  const handleDecrement = () => {
    setOrderQty((prev) => Math.max(product.minOrderQtyKg || 50, prev - 50));
  };

  const handleAdd = () => {
    onAddToCart(product, orderQty);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 1800);
  };

  const handleDirectBuy = () => {
    if (onBuyNow) {
      onBuyNow(product, orderQty);
    } else {
      onAddToCart(product, orderQty);
    }
  };

  const cropPricing = getListingPrice(product);
  const subtotal = orderQty * cropPricing.pricePerKg;

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-200">
      
      {/* 1. Breadcrumbs Navigation & Back Button */}
      <div className="bg-white rounded-2xl border border-[#E3DCB] p-3.5 sm:p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-semibold text-[#68736B] flex-wrap">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-[#245C3A] hover:underline font-bold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isHi ? 'बाज़ार वापस जाएं' : 'Marketplace'}</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-[#A2ADA5]" />
          <span className="text-[#38433C]">{product.category}</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#A2ADA5]" />
          <span className="text-[#38433C]">{product.crop}</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#A2ADA5]" />
          <span className="text-[#245C3A] font-extrabold">{product.variety}</span>
        </nav>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Farm Location GPS Button */}
          <button
            onClick={() => setIsMapModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-[#EEF3E8] border border-[#5F8F45]/30 text-xs font-bold text-[#245C3A] hover:bg-[#E2ECD9] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="View Farm Location on OpenStreetMap"
          >
            <Compass className="w-3.5 h-3.5 text-[#245C3A]" />
            <span>{isHi ? 'खेत का नक्शा (GPS)' : 'Farm Location & GPS'}</span>
          </button>

          <button
            onClick={() => onToggleFavorite?.(product.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
              isFavorite
                ? 'bg-red-50 text-red-600 border-red-200'
                : 'bg-[#FBFAF4] text-[#48534C] border-[#D5DDD2] hover:text-red-500'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            <span>{isFavorite ? (isHi ? 'पसंदीदा' : 'Saved') : (isHi ? 'सेव करें' : 'Save')}</span>
          </button>

          {product.batchId && (
            <button
              onClick={() => onOpenBatchQR(product.batchId!)}
              className="px-3 py-1.5 rounded-xl bg-[#EEF3E8] border border-[#5F8F45]/30 text-xs font-bold text-[#245C3A] hover:bg-[#E2ECD9] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>{isHi ? 'बैच क्यूआर' : 'Track Batch'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Visual Gallery (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Main Large Image */}
          <div className="relative aspect-4/3 w-full rounded-3xl overflow-hidden bg-[#F4EFE6] border border-[#E3DCB] shadow-sm">
            <img
              src={gallery[selectedImageIndex] || gallery[0]}
              alt={`${product.crop} ${product.variety}`}
              className="w-full h-full object-cover transition-transform duration-300"
              onError={(e) => handleCropImageError(e, product.crop, product.variety, product.category)}
              referrerPolicy="no-referrer"
            />

            {/* Quality Grade & Badges: ONLY PREMIUM OR STANDARD */}
            <div className="absolute top-3.5 left-3.5 flex items-center gap-2 flex-wrap">
              {cropPricing.isPremium ? (
                <span className="px-3 py-1 rounded-lg bg-[#B45309] text-white text-xs font-black shadow-xs tracking-wider flex items-center gap-1">
                  <span>★</span>
                  <span>PREMIUM (+5%)</span>
                </span>
              ) : (
                <span className="px-3 py-1 rounded-lg bg-[#245C3A] text-white text-xs font-black shadow-xs tracking-wider">
                  STANDARD
                </span>
              )}
              {product.isTimeSensitive && (
                <span className="px-2.5 py-1 rounded-lg bg-[#D6A63A] text-[#26332B] text-xs font-black uppercase tracking-wide shadow-xs flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  <span>Save Harvest</span>
                </span>
              )}
            </div>

            {/* Live Mandi Comparison Pill */}
            <div className="absolute bottom-3.5 left-3.5 right-3.5">
              <div className="bg-white/95 backdrop-blur-xs rounded-xl p-2 px-3 border border-[#E3DCB] shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#245C3A]">
                  <TrendingDown className="w-3.5 h-3.5 text-[#5F8F45]" />
                  <span>{cropPricing.isPremium ? 'Premium Mandi Rate (+5%)' : 'Standard Mandi Rate'}</span>
                </div>
                <span className="text-[11px] font-extrabold text-[#68736B]">
                  Govt Mandi Ref: ₹{cropPricing.mandiRateKg}/kg (₹{cropPricing.mandiRateQuintal}/Qtl)
                </span>
              </div>
            </div>
          </div>

          {/* Thumbnail Gallery Strip */}
          {gallery.length > 1 && (
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    selectedImageIndex === idx
                      ? 'border-[#245C3A] scale-102 ring-2 ring-[#245C3A]/30'
                      : 'border-transparent opacity-75 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => handleCropImageError(e, product.crop, product.variety, product.category)}
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Sourcing & Traceability Card */}
          <div className="bg-white rounded-2xl border border-[#E3DCB] p-4 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-2.5">
              <span className="text-xs font-black uppercase tracking-wider text-[#245C3A] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>{isHi ? 'गुणवत्ता एवं सत्यापन' : 'Quality & Origin Assurance'}</span>
              </span>
              <span className="text-[10px] font-bold text-[#5F8F45] bg-[#EEF3E8] px-2 py-0.5 rounded-sm">
                100% Verified
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#FBFAF4] border border-[#EBE5D8]">
                <span className="text-[10px] text-[#68736B] block">{isHi ? 'कटाई की तारीख' : 'Harvest Date'}</span>
                <span className="font-bold text-[#26332B]">{product.harvestDate || 'Fresh 2026 Season'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FBFAF4] border border-[#EBE5D8]">
                <span className="text-[10px] text-[#68736B]">{isHi ? 'नमी की मात्रा' : 'Moisture Content'}</span>
                <span className="font-bold text-[#26332B] block">{product.moistureContent || '11.2% (Standard)'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FBFAF4] border border-[#EBE5D8]">
                <span className="text-[10px] text-[#68736B]">{isHi ? 'भंडारण प्रकार' : 'Storage Condition'}</span>
                <span className="font-bold text-[#26332B] block">{product.storageType || 'Covered Silo'}</span>
              </div>
              <div 
                onClick={() => setIsMapModalOpen(true)}
                className="p-2.5 rounded-xl bg-[#EEF3E8] hover:bg-[#E2ECD9] border border-[#5F8F45]/30 cursor-pointer transition-colors"
                title="Click to view interactive GPS map"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#245C3A] font-bold">{isHi ? 'जीपीएस नक्शा' : 'Farm GPS Map'}</span>
                  <span className="text-[9px] font-black uppercase text-white bg-[#245C3A] px-1 rounded">MAP</span>
                </div>
                <span className="font-bold text-[#26332B] block truncate">{product.nearestMandi || product.location.split(',')[0]}</span>
              </div>
            </div>
          </div>

          {/* Value-Added Post-Harvest Processing Lineage Card */}
          {product.produceType === 'processed' && (
            <div className="bg-gradient-to-br from-[#FAF7F0] to-white rounded-2xl border border-[#D6A63A]/40 p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-[#EADBBD] pb-2.5">
                <span className="text-xs font-black uppercase tracking-wider text-[#8C6212] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#D6A63A]" />
                  <span>{isHi ? 'मूल्य संवर्धन प्रसंस्करण विवरण' : 'Post-Harvest Value Addition'}</span>
                </span>
                <span className="text-[10px] font-black text-white bg-[#245C3A] px-2 py-0.5 rounded-sm">
                  SIH2026193
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center p-2 rounded-xl bg-white border border-[#EEF3E8]">
                  <span className="text-[#68736B]">Transformation:</span>
                  <strong className="text-[#245C3A] font-extrabold">{product.processingType || 'Processed Agro Produce'}</strong>
                </div>
                {product.sourceCropName && (
                  <div className="flex justify-between items-center p-2 rounded-xl bg-white border border-[#EEF3E8]">
                    <span className="text-[#68736B]">Source Raw Produce:</span>
                    <strong className="text-[#26332B]">{product.sourceCropName}</strong>
                  </div>
                )}
                {product.processingYield && (
                  <div className="flex justify-between items-center p-2 rounded-xl bg-white border border-[#EEF3E8]">
                    <span className="text-[#68736B]">Processing Recovery:</span>
                    <strong className="text-[#5F8F45]">{product.processingYield}% Yield</strong>
                  </div>
                )}
                {product.processingFacility && (
                  <div className="flex justify-between items-center p-2 rounded-xl bg-white border border-[#EEF3E8]">
                    <span className="text-[#68736B]">Facility:</span>
                    <span className="text-[#26332B] font-semibold truncate max-w-[160px]">{product.processingFacility}</span>
                  </div>
                )}
                {product.sourceBatchId && (
                  <div className="flex justify-between items-center p-2 rounded-xl bg-white border border-[#EEF3E8]">
                    <span className="text-[#68736B]">Farm Lot Batch:</span>
                    <code className="text-[11px] font-mono font-bold text-[#245C3A]">{product.sourceBatchId}</code>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Information, Pricing & Procurement (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Info Header Card */}
          <div className="bg-white rounded-3xl border border-[#E3DCB] p-5 sm:p-6 shadow-2xs space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-[#F0EBE1] pb-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#5F8F45] bg-[#EEF3E8] px-2 py-0.5 rounded-md">
                    {product.category}
                  </span>
                  {product.produceType === 'processed' && (
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#8C6212] bg-[#D6A63A]/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#D6A63A]" />
                      <span>Value-Added</span>
                    </span>
                  )}
                  <span className="text-xs text-[#8D9B91]">ID: {product.id}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#26332B] tracking-tight mt-1">
                  {product.crop}
                </h1>
                <p className="text-base font-bold text-[#5F8F45] mt-0.5">
                  {product.variety}
                </p>
              </div>

              <div className="text-left sm:text-right bg-[#FBFAF4] sm:bg-transparent p-3 sm:p-0 rounded-2xl border border-[#EADBBD] sm:border-0">
                <div className="flex items-baseline gap-1 sm:justify-end">
                  <span className={`text-3xl sm:text-4xl font-black ${cropPricing.isPremium ? 'text-[#B45309]' : 'text-[#245C3A]'}`}>
                    ₹{cropPricing.pricePerKg}
                  </span>
                  <span className="text-sm font-bold text-[#68736B]">/ kg</span>
                </div>
                <span className="text-xs font-bold text-[#68736B] block mt-0.5">
                  ₹{(cropPricing.isPremium ? cropPricing.premiumRateQuintal : cropPricing.mandiRateQuintal).toLocaleString()} per Quintal
                </span>
                <span className={`text-[11px] font-extrabold block mt-0.5 ${cropPricing.isPremium ? 'text-[#B45309]' : 'text-[#245C3A]'}`}>
                  {cropPricing.isPremium 
                    ? '★ PREMIUM (+5% Govt Mandi Premium)' 
                    : 'STANDARD (Direct Live Mandi Rate)'}
                </span>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FBFAF4] border border-[#EBE5D8]">
                <Warehouse className="w-4 h-4 text-[#245C3A] shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] text-[#68736B] block">{isHi ? 'उपलब्ध स्टॉक' : 'Available Stock'}</span>
                  <span className="font-black text-[#26332B] truncate block">{product.availableQuantityKg.toLocaleString()} kg</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FBFAF4] border border-[#EBE5D8]">
                <Scale className="w-4 h-4 text-[#245C3A] shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] text-[#68736B] block">{isHi ? 'न्यूनतम आदेश' : 'Min Order Qty'}</span>
                  <span className="font-black text-[#26332B] truncate block">{product.minOrderQtyKg || 50} kg</span>
                </div>
              </div>

              {/* Clickable GPS & Location Card */}
              <div 
                onClick={() => setIsMapModalOpen(true)}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-[#EEF3E8] hover:bg-[#E2ECD9] border border-[#5F8F45]/30 col-span-2 sm:col-span-1 cursor-pointer transition-colors group"
                title="Click to view interactive GPS farm map"
              >
                <Compass className="w-4 h-4 text-[#245C3A] shrink-0 group-hover:rotate-45 transition-transform" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#245C3A] font-bold block">{isHi ? 'खेत का जीपीएस मैप' : 'Farm Location & GPS'}</span>
                    <span className="text-[8px] font-black uppercase text-white bg-[#245C3A] px-1 rounded">MAP</span>
                  </div>
                  <span className="font-black text-[#26332B] truncate block text-xs">{product.location} ({formatDistanceDisplay(product.distanceKm)})</span>
                </div>
              </div>
            </div>

            {/* Lot Description */}
            <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E3DCB]">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#68736B] mb-1.5">
                {isHi ? 'फसल विवरण और गुणवत्ता' : 'Produce & Lot Specifications'}
              </h3>
              <p className="text-xs text-[#38433C] leading-relaxed font-medium">
                {product.description || 'Cleaned, graded, and moisture-controlled batch ready for direct procurement. Stored under hygienic conditions to ensure optimal shelf-life.'}
              </p>
            </div>

            {/* Smart Buy Intelligence Signal */}
            {onOpenSmartBuyModal && (
              <div 
                onClick={() => onOpenSmartBuyModal(product)}
                className="p-3.5 rounded-2xl bg-[#EEF3E8] border border-[#5F8F45]/30 flex items-center justify-between cursor-pointer hover:bg-[#E2ECD9] transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#245C3A] text-white flex items-center justify-center font-bold text-sm">
                    🧠
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-[#245C3A]">KisanSetu Market Signal</span>
                      <span className="text-[10px] font-black uppercase text-white bg-[#5F8F45] px-1.5 py-0.5 rounded-sm">
                        {product.smartBuySignal || 'Favorable'}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#48534C] font-medium">
                      Opportunity Score: <strong>{product.purchaseOpportunityScore || 92}/100</strong> • Click to view price forecast
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#245C3A] group-hover:translate-x-1 transition-transform" />
              </div>
            )}

            {/* Interactive Quantity Stepper & Procurement Calculator */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#FBFAF4] border border-[#DFD7C4] space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h4 className="text-sm font-black text-[#26332B]">
                    {isHi ? 'खरीद मात्रा चुनें' : 'Procurement Quantity'}
                  </h4>
                  <span className="text-[11px] text-[#68736B]">
                    {isHi ? 'कुल उपलब्ध:' : 'Available in lot:'} {product.availableQuantityKg.toLocaleString()} kg
                  </span>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 bg-white border border-[#D5DDD2] rounded-xl p-1 shadow-2xs">
                  <button
                    onClick={handleDecrement}
                    disabled={orderQty <= (product.minOrderQtyKg || 50)}
                    className="w-9 h-9 rounded-lg bg-[#FAF7F0] border border-[#D5DDD2] flex items-center justify-center text-xs font-bold hover:bg-[#EEF3E8] disabled:opacity-40 cursor-pointer transition-colors"
                  >
                    <Minus className="w-4 h-4 text-[#26332B]" />
                  </button>
                  <input
                    type="number"
                    value={orderQty}
                    onChange={(e) => {
                      const val = Number(e.target.value) || 0;
                      setOrderQty(Math.min(product.availableQuantityKg, Math.max(product.minOrderQtyKg || 50, val)));
                    }}
                    className="w-20 text-center text-sm font-black text-[#245C3A] focus:outline-hidden"
                  />
                  <span className="text-xs font-bold text-[#68736B] pr-2">kg</span>
                  <button
                    onClick={handleIncrement}
                    disabled={orderQty >= product.availableQuantityKg}
                    className="w-9 h-9 rounded-lg bg-[#FAF7F0] border border-[#D5DDD2] flex items-center justify-center text-xs font-bold hover:bg-[#EEF3E8] disabled:opacity-40 cursor-pointer transition-colors"
                  >
                    <Plus className="w-4 h-4 text-[#26332B]" />
                  </button>
                </div>
              </div>

              {/* Subtotal Calculation Bar */}
              <div className="flex items-center justify-between border-t border-[#EAE3D2] pt-3 text-xs">
                <span className="font-bold text-[#48534C]">
                  {isHi ? 'अनुमानित कुल लागत:' : 'Estimated Procurement Cost:'}
                </span>
                <span className="text-lg font-black text-[#245C3A]">
                  ₹{subtotal.toLocaleString()}
                </span>
              </div>

              {/* Action Buttons: Add to Cart AND Buy Now */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                <button
                  onClick={handleAdd}
                  className={`w-full flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
                    addedSuccess
                      ? 'bg-[#1C4B2E] text-white ring-2 ring-[#D6A63A]'
                      : 'bg-[#245C3A] hover:bg-[#1C4B2E] text-white'
                  }`}
                >
                  {addedSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{isHi ? 'कार्ट में जोड़ा गया ✓' : 'Added to Cart ✓'}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>{isHi ? `कार्ट में जोड़ें` : `Add ${orderQty} kg to Cart`}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleDirectBuy}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <Zap className="w-4 h-4" />
                  <span>{isHi ? `तुरंत खरीदें` : `Buy Now (₹${subtotal.toLocaleString()})`}</span>
                </button>
              </div>

            </div>

          </div>

          {/* 3. Verified Farmer Profile Card */}
          <div className="bg-white rounded-3xl border border-[#E3DCB] p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#245C3A]" />
                <h3 className="text-xs font-black uppercase tracking-wider text-[#245C3A]">
                  {isHi ? 'सत्यापित किसान और विक्रेता' : 'Direct Producer / Seller Profile'}
                </h3>
              </div>
              <span className="text-[10px] font-extrabold text-[#D6A63A] bg-[#F7EFE0] px-2 py-0.5 rounded-sm border border-[#EADBBD]">
                Direct Farm Gate
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#245C3A] text-white flex items-center justify-center text-lg font-black shrink-0 shadow-2xs">
                  {product.farmerName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-black text-[#26332B]">{product.farmerName}</span>
                    {product.farmerVerified && (
                      <CheckCircle2 className="w-4 h-4 text-[#245C3A]" title="Verified Farmer" />
                    )}
                  </div>
                  <div className="text-xs text-[#68736B] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#245C3A]" />
                    <span>{product.location}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-[#68736B]">
                    {product.farmerRating && (
                      <span className="font-bold text-[#9E6D14] flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-[#D6A63A] text-[#D6A63A]" />
                        <span>{product.farmerRating} Rating</span>
                      </span>
                    )}
                    <span>• {product.completedDeals || 24} Successful Deals</span>
                  </div>
                </div>
              </div>

              {/* Farmer Actions */}
              <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
                <button
                  onClick={() => setIsMapModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-[#EEF3E8] hover:bg-[#E2ECD9] text-xs font-bold text-[#245C3A] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>{isHi ? 'खेत मैप' : 'Farm Map'}</span>
                </button>

                <button
                  onClick={() => onSelectFarmerProfile(product.farmerId)}
                  className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-white border border-[#D5DDD2] hover:border-[#245C3A] text-xs font-bold text-[#245C3A] transition-colors cursor-pointer"
                >
                  {isHi ? 'पूरा प्रोफाइल देखें' : 'View Profile'}
                </button>

                <button
                  onClick={() => onOpenMessageWithFarmer(product.farmerId, `${product.crop} (${product.variety})`)}
                  className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-[#245C3A] hover:bg-[#1C4B2E] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{isHi ? 'संदेश भेजें' : 'Message'}</span>
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 4. You May Also Like / Similar Harvest Lots */}
      {similarProducts.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-[#E3DCB]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-[#26332B] tracking-tight">
                {isHi ? 'आपको यह भी पसंद आ सकता है' : 'You May Also Like (Similar Lots)'}
              </h3>
              <p className="text-xs text-[#68736B]">
                {isHi ? 'समान फसलें और सत्यापित फार्म लॉट' : 'Other fresh batches in the same crop family'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {similarProducts.map((simProd) => {
              const simPricing = getListingPrice(simProd);
              return (
                <div
                  key={simProd.id}
                  onClick={() => onSelectProduct(simProd)}
                  className="group bg-white rounded-2xl border border-[#E3DCB] hover:border-[#245C3A] p-3 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-4/3 rounded-xl overflow-hidden bg-[#F4EFE6] relative mb-2.5">
                      <img
                        src={simProd.imageUrl}
                        alt={simProd.crop}
                        className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
                        onError={(e) => handleCropImageError(e, simProd.crop, simProd.variety, simProd.category)}
                        referrerPolicy="no-referrer"
                      />
                      {simPricing.isPremium ? (
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#B45309] text-white text-[10px] font-black shadow-xs">
                          PREMIUM
                        </span>
                      ) : (
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#245C3A] text-white text-[10px] font-black shadow-xs">
                          STANDARD
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-black text-[#26332B] group-hover:text-[#245C3A] transition-colors truncate">
                      {simProd.crop} - {simProd.variety}
                    </h4>
                    <div className="flex items-center justify-between mt-1 text-xs">
                      <span className="font-black text-[#245C3A]">₹{simPricing.pricePerKg}/kg</span>
                      <span className="text-[11px] text-[#68736B]">{simProd.availableQuantityKg} kg</span>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-[#F0EBE1] flex items-center justify-between text-[11px] text-[#68736B]">
                    <span className="truncate">{simProd.location.split(',')[0]}</span>
                    <span className="text-[#245C3A] font-bold group-hover:underline">{isHi ? 'देखें →' : 'View →'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Smart Alternatives Section */}
      {alternatives.length > 0 && (
        <div className="bg-white rounded-3xl border border-[#E3DCB] p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#26332B] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#D6A63A]" />
              <span>{t.sections.smartAlternativesTitle}</span>
            </h3>
            <span className="text-[10px] text-[#68736B]">KisanSetu Match Engine</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {alternatives.map((alt, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-[#FAF7F0] border border-[#EBE5D8] flex flex-col justify-between gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#26332B]">{alt.name} - {alt.variety}</span>
                  <span className="text-[10px] font-extrabold text-[#245C3A] bg-[#EEF3E8] px-2 py-0.5 rounded-full">
                    {alt.similarityScore}% Match
                  </span>
                </div>
                <p className="text-[11px] text-[#68736B] leading-tight mt-1">{alt.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Interactive Farm Geolocation Map Modal */}
      <BuyerProductMapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        product={product}
        buyerLocation={buyerLocation}
        buyerDistrict={buyerDistrict}
        currentLanguage={currentLanguage === 'hi' ? 'hi' : 'en'}
      />

    </div>
  );
};
