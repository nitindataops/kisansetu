import React, { useState } from 'react';
import { 
  Heart, 
  ShoppingCart, 
  MapPin, 
  CheckCircle2, 
  Check,
  Eye,
  Navigation,
  Zap
} from 'lucide-react';
import { MarketplaceProduct } from '../../types/buyer';
import { LanguageCode } from '../../types';
import { buyerTranslations } from '../../data/buyerTranslations';
import { resolveCropImage, handleCropImageError } from '../../data/imageAssets';
import { formatDistanceDisplay } from '../../utils/distanceCalculator';
import { getListingPrice } from '../../services/aiGradingService';

interface BuyerProductCardProps {
  product: MarketplaceProduct;
  currentLanguage: LanguageCode;
  onAddToCart: (product: MarketplaceProduct, quantityKg: number) => void;
  onBuyNow?: (product: MarketplaceProduct, quantityKg: number) => void;
  onViewDetails: (product: MarketplaceProduct) => void;
  onSelectFarmerProfile?: (farmerId: string) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (productId: string) => void;
}

export const BuyerProductCard: React.FC<BuyerProductCardProps> = ({
  product,
  currentLanguage,
  onAddToCart,
  onBuyNow,
  onViewDetails,
  onSelectFarmerProfile,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const [addedAnim, setAddedAnim] = useState(false);
  const t = buyerTranslations[currentLanguage] || buyerTranslations.en;
  const isHi = currentLanguage === 'hi';
  const pricing = getListingPrice(product);

  const resolvedImageUrl = resolveCropImage({
    imageUrl: product.imageUrl,
    crop: product.crop,
    variety: product.variety,
    category: product.category,
    galleryImages: product.galleryImages,
  });

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, product.minOrderQtyKg || 50);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1200);
  };

  const handleBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onBuyNow) {
      onBuyNow(product, product.minOrderQtyKg || 50);
    } else {
      onAddToCart(product, product.minOrderQtyKg || 50);
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(product.id);
  };

  const handleFarmerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectFarmerProfile?.(product.farmerId);
  };

  return (
    <div
      onClick={() => onViewDetails(product)}
      className="group bg-white rounded-2xl border border-[#E3DCB] hover:border-[#245C3A] shadow-2xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col cursor-pointer relative"
    >
      {/* Product Image Container */}
      <div className="relative w-full aspect-4/3 bg-[#F4EFE6] overflow-hidden">
        <img
          src={resolvedImageUrl}
          alt={`${product.crop} ${product.variety}`}
          onError={(e) => handleCropImageError(e, product.crop, product.variety, product.category)}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
          referrerPolicy="no-referrer"
        />

        {/* Quality Grade Badge (Top Left) */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
          {pricing.isPremium ? (
            <span className="px-2 py-0.5 rounded-md bg-[#B45309] text-white text-[10.5px] font-black tracking-wide shadow-xs flex items-center gap-1">
              <span>★</span>
              <span>PREMIUM (+5%)</span>
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-[#245C3A] text-white text-[10.5px] font-black tracking-wide shadow-xs">
              STANDARD
            </span>
          )}
          {product.produceType === 'processed' && (
            <span className="px-2 py-0.5 rounded-md bg-[#D6A63A] text-[#26332B] text-[10px] font-black uppercase tracking-wider shadow-xs flex items-center gap-0.5">
              <span>✨</span>
              <span>Value-Added</span>
            </span>
          )}
          {product.isTimeSensitive && (
            <span className="px-2 py-0.5 rounded-md bg-[#D6A63A] text-[#26332B] text-[10px] font-black uppercase tracking-wider shadow-xs animate-pulse">
              Save Harvest
            </span>
          )}
        </div>

        {/* Favorite Button (Top Right) */}
        <button
          type="button"
          onClick={handleFavorite}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-xs cursor-pointer ${
            isFavorite
              ? 'bg-red-50 text-red-500 hover:bg-red-100'
              : 'bg-white/90 text-[#68736B] hover:text-red-500 hover:bg-white backdrop-blur-xs'
          }`}
          aria-label={t.productCard.favorite}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Quick View Hover Button */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="px-3 py-1.5 rounded-lg bg-white/95 text-[#245C3A] text-xs font-bold shadow-md flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            <span>{t.productCard.viewDetails}</span>
          </span>
        </div>
      </div>

      {/* Card Information Hierarchy */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* 1. Crop Name & Variety */}
          <div className="flex items-baseline justify-between gap-1">
            <h3 className="text-base font-extrabold text-[#26332B] tracking-tight group-hover:text-[#245C3A] transition-colors line-clamp-1">
              {product.crop}
            </h3>
          </div>
          <p className="text-xs font-medium text-[#68736B] line-clamp-1 mt-0.5" title={product.variety}>
            {product.variety}
          </p>

          {/* 2. Price & Available Quantity */}
          <div className="mt-2.5 flex items-baseline justify-between gap-2">
            <div>
              <div className="flex items-baseline gap-0.5">
                <span className="text-lg sm:text-xl font-black text-[#245C3A]">
                  ₹{pricing.pricePerKg}
                </span>
                <span className="text-xs font-bold text-[#68736B]">
                  {t.productCard.perKg}
                </span>
              </div>
              {pricing.isPremium && (
                <div className="text-[10px] font-semibold text-[#B45309]">
                  Live Mandi: ₹{pricing.mandiRateKg}/kg (+5%)
                </div>
              )}
            </div>

            <div className="text-right">
              <span className="text-[11px] font-semibold text-[#48534C] bg-[#FBFAF4] px-2 py-0.5 rounded-md border border-[#E7E0D0]">
                {t.productCard.available} <strong className="text-[#26332B]">{product.availableQuantityKg.toLocaleString()} kg</strong>
              </span>
            </div>
          </div>

          {/* 3. Location, Distance & Real Farmer Verification */}
          <div className="mt-3 pt-2.5 border-t border-[#F0EBE1] flex flex-col gap-1 text-xs">
            <div className="flex items-center justify-between gap-1 text-[#68736B]">
              <div className="flex items-center gap-1 truncate">
                <MapPin className="w-3 h-3 text-[#245C3A] shrink-0" />
                <span className="truncate">{product.location}</span>
              </div>
              <span className="text-[10px] font-semibold text-[#5F8F45] bg-[#EEF3E8] px-1.5 py-0.5 rounded-sm shrink-0 flex items-center gap-0.5">
                <Navigation className="w-2.5 h-2.5" />
                {formatDistanceDisplay(product.distanceKm)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-1 mt-0.5">
              <button
                type="button"
                onClick={handleFarmerClick}
                className="text-[11px] font-bold text-[#245C3A] hover:underline flex items-center gap-1 truncate text-left cursor-pointer"
              >
                <CheckCircle2 className="w-3 h-3 text-[#245C3A] shrink-0" />
                <span className="truncate">{product.farmerName}</span>
              </button>

              {product.farmerRating && (
                <span className="text-[10px] font-bold text-[#9E6D14] bg-[#F7EFE0] px-1.5 py-0.2 rounded-sm border border-[#EADBBD] shrink-0">
                  ★ {product.farmerRating}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 4. Action Area: [ 🛒 कार्ट में जोड़ें ]   [ खरीदें ] */}
        <div className="pt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={handleAdd}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer border ${
              addedAnim
                ? 'bg-[#1C4B2E] text-white border-[#1C4B2E]'
                : 'bg-[#FBFAF4] hover:bg-[#EEF3E8] text-[#245C3A] border-[#D5DDD2] hover:border-[#245C3A]'
            }`}
          >
            {addedAnim ? (
              <>
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{t.productCard.addedToCart}</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{t.productCard.addToCart}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleBuy}
            className="flex-1 py-2 px-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 bg-[#245C3A] hover:bg-[#1C4B2E] text-white transition-all shadow-xs active:scale-98 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 shrink-0 text-[#EADBBD]" />
            <span className="truncate">{isHi ? 'खरीदें' : 'Buy Now'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
