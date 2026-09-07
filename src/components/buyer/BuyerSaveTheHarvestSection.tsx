import React from 'react';
import { Sparkles, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { MarketplaceProduct } from '../../types/buyer';
import { LanguageCode } from '../../types';
import { buyerTranslations } from '../../data/buyerTranslations';
import { resolveCropImage, handleCropImageError } from '../../data/imageAssets';

interface BuyerSaveTheHarvestSectionProps {
  products: MarketplaceProduct[];
  currentLanguage: LanguageCode;
  onSelectProduct: (product: MarketplaceProduct) => void;
}

export const BuyerSaveTheHarvestSection: React.FC<BuyerSaveTheHarvestSectionProps> = ({
  products,
  currentLanguage,
  onSelectProduct,
}) => {
  const t = buyerTranslations[currentLanguage] || buyerTranslations.en;
  const timeSensitiveProducts = products.filter((p) => p.isTimeSensitive);

  if (timeSensitiveProducts.length === 0) return null;

  return (
    <div className="bg-[#F7F2E7] rounded-3xl border border-[#DED4BE] p-5 sm:p-6 shadow-2xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#D6A63A] text-white flex items-center justify-center text-lg shadow-xs">
            ♻️
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-[#26332B] flex items-center gap-2">
              <span>{t.sections.saveTheHarvest}</span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#245C3A] text-white px-2 py-0.5 rounded-full">
                Direct Farm Dispatch
              </span>
            </h3>
            <p className="text-xs text-[#68736B] mt-0.5">
              {t.sections.saveTheHarvestSub}
            </p>
          </div>
        </div>

        <span className="text-xs font-bold text-[#D6A63A] bg-white px-3 py-1 rounded-full border border-[#DED4BE] self-start">
          {timeSensitiveProducts.length} Lots Available
        </span>
      </div>

      {/* Produce Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {timeSensitiveProducts.map((p) => {
          const resolvedImg = resolveCropImage({
            imageUrl: p.imageUrl,
            crop: p.crop,
            variety: p.variety,
            category: p.category,
            galleryImages: p.galleryImages,
          });

          return (
            <div
              key={p.id}
              onClick={() => onSelectProduct(p)}
              className="p-3.5 rounded-2xl bg-white border border-[#E3DCB] hover:border-[#245C3A] flex items-center gap-3.5 cursor-pointer shadow-2xs hover:shadow-xs transition-all group"
            >
              <img
                src={resolvedImg}
                alt={`${p.crop} ${p.variety}`}
                referrerPolicy="no-referrer"
                onError={(e) => handleCropImageError(e, p.crop, p.variety, p.category)}
                className="w-16 h-16 rounded-xl object-cover bg-[#F4EFE6] shrink-0 group-hover:scale-103 transition-transform"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#26332B] truncate">{p.crop}</span>
                  <span className="text-xs font-black text-[#245C3A]">₹{p.pricePerKg}/kg</span>
                </div>
                <span className="text-[11px] text-[#68736B] truncate block">{p.variety}</span>
                <div className="mt-1 flex items-center justify-between text-[10px] text-[#738378]">
                  <span>{p.availableQuantityKg} kg left</span>
                  <span className="text-[#D6A63A] font-bold flex items-center gap-0.5">
                    <Clock className="w-3 h-3" />
                    <span>Immediate Dispatch</span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

