import React, { useState } from 'react';
import { 
  X, 
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
  ArrowRight,
  Navigation,
  User,
  Plus,
  Minus,
  Check
} from 'lucide-react';
import { MarketplaceProduct } from '../../types/buyer';
import { LanguageCode } from '../../types';
import { buyerTranslations } from '../../data/buyerTranslations';
import { SMART_ALTERNATIVES_MAP } from '../../data/buyerData';
import { resolveCropGallery, resolveCropImage, handleCropImageError } from '../../data/imageAssets';
import { formatDistanceDisplay } from '../../utils/distanceCalculator';

interface BuyerProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: MarketplaceProduct | null;
  currentLanguage: LanguageCode;
  onAddToCart: (product: MarketplaceProduct, quantityKg: number) => void;
  onSelectFarmerProfile: (farmerId: string) => void;
  onOpenMessageWithFarmer: (farmerId: string, cropName: string) => void;
  onOpenBatchQR: (batchId: string) => void;
  onOpenSmartBuyModal: (product: MarketplaceProduct) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (productId: string) => void;
}

export const BuyerProductDetailsModal: React.FC<BuyerProductDetailsModalProps> = ({
  isOpen,
  onClose,
  product,
  currentLanguage,
  onAddToCart,
  onSelectFarmerProfile,
  onOpenMessageWithFarmer,
  onOpenBatchQR,
  onOpenSmartBuyModal,
  isFavorite = false,
  onToggleFavorite,
}) => {
  if (!isOpen || !product) return null;

  const t = buyerTranslations[currentLanguage] || buyerTranslations.en;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [orderQty, setOrderQty] = useState<number>(product.minOrderQtyKg || 100);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const gallery = resolveCropGallery({
    imageUrl: product.imageUrl,
    crop: product.crop,
    variety: product.variety,
    category: product.category,
    galleryImages: product.galleryImages,
  });

  const alternatives = SMART_ALTERNATIVES_MAP[product.variety] || [];

  const handleIncrement = () => {
    setOrderQty((prev) => Math.min(product.availableQuantityKg, prev + 50));
  };

  const handleDecrement = () => {
    setOrderQty((prev) => Math.max(product.minOrderQtyKg || 50, prev - 50));
  };

  const handleAdd = () => {
    onAddToCart(product, orderQty);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-3xl border border-[#E3DCB] shadow-2xl max-w-4xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        
        {/* Modal Top Header Bar */}
        <div className="px-5 py-4 bg-[#FAF7F0] border-b border-[#E3DCB] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-[#245C3A] text-white text-xs font-extrabold">
              Grade {product.grade}
            </span>
            <span className="text-xs font-bold text-[#68736B]">• {product.category}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite?.(product.id)}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                isFavorite ? 'bg-red-50 text-red-500' : 'bg-white text-[#68736B] hover:text-red-500 border border-[#D5DDD2]'
              }`}
              title="Save to favorites"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white text-[#68736B] hover:text-[#26332B] border border-[#D5DDD2] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Main 2-Column Product Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left Column: Image Gallery (5 cols) */}
            <div className="md:col-span-5 flex flex-col gap-3">
              <div className="aspect-4/3 rounded-2xl overflow-hidden bg-[#F4EFE6] border border-[#E3DCB] shadow-2xs">
                <img
                  src={gallery[selectedImageIndex] || gallery[0]}
                  alt={`${product.crop} ${product.variety}`}
                  className="w-full h-full object-cover"
                  onError={(e) => handleCropImageError(e, product.crop, product.variety, product.category)}
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Thumbnails */}
              {gallery.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        selectedImageIndex === idx ? 'border-[#245C3A] scale-102 ring-1 ring-[#245C3A]' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt="Thumbnail"
                        className="w-full h-full object-cover"
                        onError={(e) => handleCropImageError(e, product.crop, product.variety, product.category)}
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Smart Buy Trigger Button */}
              <button
                onClick={() => onOpenSmartBuyModal(product)}
                className="w-full p-3 rounded-xl bg-[#EEF3E8] hover:bg-[#E2ECD9] border border-[#5F8F45]/30 text-left flex items-center justify-between transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">🧠</span>
                  <div>
                    <span className="text-xs font-bold text-[#245C3A] block">Smart Buy Intelligence</span>
                    <span className="text-[10px] text-[#5F8F45]">Score: {product.purchaseOpportunityScore || 92}/100</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#245C3A] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Right Column: Key Details & Pricing (7 cols) */}
            <div className="md:col-span-7 flex flex-col justify-between gap-4">
              
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-2xl font-black text-[#26332B] tracking-tight">
                      {product.crop}
                    </h2>
                    <p className="text-sm font-semibold text-[#5F8F45] mt-0.5">
                      {product.variety}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-2xl sm:text-3xl font-black text-[#245C3A]">
                      ₹{product.pricePerKg}
                    </span>
                    <span className="text-xs font-bold text-[#68736B] block">per kg</span>
                  </div>
                </div>

                {/* Badges Ribbon */}
                <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
                  <span className="flex items-center gap-1 text-[#48534C] bg-[#FBFAF4] px-2.5 py-1 rounded-lg border border-[#E7E0D0]">
                    <Warehouse className="w-3.5 h-3.5 text-[#245C3A]" />
                    <span>Available: <strong>{product.availableQuantityKg.toLocaleString()} kg</strong></span>
                  </span>
                  <span className="flex items-center gap-1 text-[#48534C] bg-[#FBFAF4] px-2.5 py-1 rounded-lg border border-[#E7E0D0]">
                    <MapPin className="w-3.5 h-3.5 text-[#245C3A]" />
                    <span>{product.location}</span>
                  </span>
                  <span className="flex items-center gap-1 text-[#5F8F45] bg-[#EEF3E8] px-2.5 py-1 rounded-lg border border-[#5F8F45]/30">
                    <Navigation className="w-3.5 h-3.5 text-[#245C3A]" />
                    <span>{formatDistanceDisplay(product.distanceKm)}</span>
                  </span>
                  {product.moistureContent && (
                    <span className="flex items-center gap-1 text-[#48534C] bg-[#FBFAF4] px-2.5 py-1 rounded-lg border border-[#E7E0D0]">
                      <Droplet className="w-3.5 h-3.5 text-blue-500" />
                      <span>{product.moistureContent}</span>
                    </span>
                  )}
                  {product.harvestDate && (
                    <span className="flex items-center gap-1 text-[#48534C] bg-[#FBFAF4] px-2.5 py-1 rounded-lg border border-[#E7E0D0]">
                      <Calendar className="w-3.5 h-3.5 text-[#D6A63A]" />
                      <span>Harvested: {product.harvestDate}</span>
                    </span>
                  )}
                </div>

                {/* Description */}
                <div className="mt-4 p-3 rounded-xl bg-[#FAF7F0] border border-[#E3DCB]">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#68736B] mb-1">
                    Lot Description & Quality Notes
                  </h4>
                  <p className="text-xs text-[#38433C] leading-relaxed font-medium">
                    {product.description}
                  </p>
                </div>
              </div>

              {/* Quantity Picker & Add to Cart Action */}
              <div className="pt-3 border-t border-[#F0EBE1] space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#26332B]">Procurement Quantity</span>
                    <span className="text-[10px] text-[#68736B]">Min order: {product.minOrderQtyKg || 50} kg</span>
                  </div>

                  <div className="flex items-center gap-2 bg-[#FBFAF4] border border-[#D5DDD2] rounded-xl p-1">
                    <button
                      onClick={handleDecrement}
                      disabled={orderQty <= (product.minOrderQtyKg || 50)}
                      className="w-8 h-8 rounded-lg bg-white border border-[#D5DDD2] flex items-center justify-center text-xs font-bold hover:bg-[#EEF3E8] disabled:opacity-40 cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-16 text-center text-sm font-extrabold text-[#245C3A]">
                      {orderQty} kg
                    </span>
                    <button
                      onClick={handleIncrement}
                      disabled={orderQty >= product.availableQuantityKg}
                      className="w-8 h-8 rounded-lg bg-white border border-[#D5DDD2] flex items-center justify-center text-xs font-bold hover:bg-[#EEF3E8] disabled:opacity-40 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleAdd}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer ${
                      addedSuccess
                        ? 'bg-[#1C4B2E] text-white ring-2 ring-[#D6A63A]'
                        : 'bg-[#245C3A] hover:bg-[#1C4B2E] text-white'
                    }`}
                  >
                    {addedSuccess ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Procurement Cart ✓</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add {orderQty} kg to Cart (₹{(orderQty * product.pricePerKg).toLocaleString()})</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Real Farmer Section (Section 23, 24, 25 of Prompt) */}
          <div className="p-4 rounded-2xl bg-[#FBFAF4] border border-[#E3DCB]">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE1] mb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#245C3A]" />
                <h4 className="text-xs font-black uppercase tracking-wider text-[#245C3A]">
                  Verified Farmer & Sourcing Origin
                </h4>
              </div>
              <span className="text-[10px] font-bold text-[#D6A63A] bg-[#F7EFE0] px-2 py-0.5 rounded-sm border border-[#EADBBD]">
                Direct Farm-Gate Lot
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#245C3A] text-white flex items-center justify-center text-base font-black">
                  {product.farmerName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-black text-[#26332B]">{product.farmerName}</span>
                    {product.farmerVerified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#245C3A]" />
                    )}
                  </div>
                  <div className="text-xs text-[#68736B] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#68736B]" />
                    <span>{product.location}</span>
                  </div>
                  <span className="text-[10px] text-[#8D9B91]">ID: {product.farmerId}</span>
                </div>
              </div>

              {/* Action Buttons: View Profile, Message, Batch QR */}
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => onSelectFarmerProfile(product.farmerId)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-[#D5DDD2] hover:border-[#245C3A] text-xs font-bold text-[#245C3A] transition-colors cursor-pointer"
                >
                  View Farmer Profile
                </button>

                <button
                  onClick={() => onOpenMessageWithFarmer(product.farmerId, `${product.crop} (${product.variety})`)}
                  className="px-3 py-1.5 rounded-lg bg-[#245C3A] hover:bg-[#1C4B2E] text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Message Farmer</span>
                </button>

                {product.batchId && (
                  <button
                    onClick={() => onOpenBatchQR(product.batchId!)}
                    className="px-3 py-1.5 rounded-lg bg-[#FAF7F0] border border-[#E3DCB] hover:bg-[#EEF3E8] text-xs font-bold text-[#48534C] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5 text-[#245C3A]" />
                    <span>Track Batch</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Smart Alternatives (Section 33 of Prompt) */}
          {alternatives.length > 0 && (
            <div className="p-4 rounded-2xl bg-white border border-[#E3DCB]">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#26332B] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D6A63A]" />
                  <span>{t.sections.smartAlternativesTitle}</span>
                </h4>
                <span className="text-[10px] text-[#68736B]">KisanSetu Similarity Engine</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {alternatives.map((alt, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#FAF7F0] border border-[#EBE5D8] flex flex-col justify-between gap-1">
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

        </div>

      </div>
    </div>
  );
};
