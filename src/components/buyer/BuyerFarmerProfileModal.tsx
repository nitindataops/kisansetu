import React from 'react';
import { 
  X, 
  CheckCircle2, 
  MapPin, 
  ShieldCheck, 
  Award, 
  Calendar, 
  Store, 
  MessageSquare, 
  Star,
  FileCheck,
  TrendingUp
} from 'lucide-react';
import { MarketplaceProduct } from '../../types/buyer';
import { LanguageCode } from '../../types';
import { buyerTranslations } from '../../data/buyerTranslations';
import { resolveCropImage, handleCropImageError } from '../../data/imageAssets';

interface BuyerFarmerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  farmerId: string | null;
  farmerData?: {
    farmerId: string;
    name: string;
    location: string;
    state?: string;
    phone?: string;
    verified: boolean;
    landAreaAcre?: number;
    primaryCrops: string[];
    memberSince: string;
    rating: number;
    completedDeals: number;
    soilHealthCardCertified: boolean;
    nearestMandi: string;
    activeListingsCount?: number;
    avatar?: string;
  };
  farmerProducts: MarketplaceProduct[];
  currentLanguage: LanguageCode;
  onSelectProduct: (product: MarketplaceProduct) => void;
  onMessageFarmer: (farmerId: string, cropName: string) => void;
}

export const BuyerFarmerProfileModal: React.FC<BuyerFarmerProfileModalProps> = ({
  isOpen,
  onClose,
  farmerId,
  farmerData,
  farmerProducts,
  currentLanguage,
  onSelectProduct,
  onMessageFarmer,
}) => {
  if (!isOpen || !farmerData) return null;

  const t = buyerTranslations[currentLanguage] || buyerTranslations.en;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-3xl border border-[#E3DCB] shadow-2xl max-w-3xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        
        {/* Farmer Header Cover */}
        <div className="bg-gradient-to-r from-[#1C4B2E] via-[#245C3A] to-[#2E6B47] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white text-[#245C3A] flex items-center justify-center text-2xl font-black shadow-md shrink-0 overflow-hidden">
              {farmerData.avatar ? (
                <img src={farmerData.avatar} alt={farmerData.name} className="w-full h-full object-cover" />
              ) : (
                farmerData.name.charAt(0)
              )}
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black text-white">{farmerData.name}</h3>
                {farmerData.verified && (
                  <span className="px-2 py-0.5 rounded-full bg-[#E2ECD9] text-[#245C3A] text-[11px] font-extrabold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#245C3A]" />
                    <span>Verified Grower</span>
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-[#D8E4D1] mt-1 font-medium">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#D6A63A]" />
                  <span>{farmerData.location}</span>
                </span>
                <span>•</span>
                <span>ID: {farmerData.farmerId}</span>
                <span>•</span>
                <span>Member Since {farmerData.memberSince}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* KisanSetu Trust Grid (Prompt Section 25) */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#245C3A] mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#245C3A]" />
              <span>KisanSetu Farmer Trust Metrics</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#E3DCB] text-center">
                <span className="text-[10px] font-bold text-[#68736B] uppercase block">Rating</span>
                <span className="text-base font-black text-[#9E6D14] mt-0.5 block">★ {farmerData.rating} / 5.0</span>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#E3DCB] text-center">
                <span className="text-[10px] font-bold text-[#68736B] uppercase block">Completed Deals</span>
                <span className="text-base font-black text-[#245C3A] mt-0.5 block">{farmerData.completedDeals} Lots</span>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#E3DCB] text-center">
                <span className="text-[10px] font-bold text-[#68736B] uppercase block">Land Holding</span>
                <span className="text-base font-black text-[#26332B] mt-0.5 block">{farmerData.landAreaAcre || 6.5} Acres</span>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#E3DCB] text-center">
                <span className="text-[10px] font-bold text-[#68736B] uppercase block">Soil Health Card</span>
                <span className="text-xs font-black text-[#245C3A] mt-1 block">
                  {farmerData.soilHealthCardCertified ? '✓ Govt Certified' : 'In Verification'}
                </span>
              </div>
            </div>
          </div>

          {/* Farmer Details Info Box */}
          <div className="p-4 rounded-2xl bg-[#FBFAF4] border border-[#E3DCB] space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#68736B]">Nearest APMC Mandi:</span>
              <span className="font-bold text-[#26332B]">{farmerData.nearestMandi}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#68736B]">Primary Cultivated Crops:</span>
              <span className="font-bold text-[#245C3A]">{(farmerData.primaryCrops || []).join(', ') || 'Wheat, Paddy, Maize, Pulses (Chana)'}</span>
            </div>
          </div>

          {/* Active Listings from this Farmer */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#26332B] flex items-center gap-1.5">
                <Store className="w-4 h-4 text-[#245C3A]" />
                <span>Active Produce Lots ({farmerProducts.length})</span>
              </h4>
            </div>

            {farmerProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {farmerProducts.map((p) => {
                  const resolvedImg = resolveCropImage({
                    imageUrl: p.imageUrl,
                    crop: p.crop,
                    variety: p.variety,
                    category: p.category,
                  });
                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        onClose();
                        onSelectProduct(p);
                      }}
                      className="p-3 rounded-xl bg-white border border-[#E3DCB] hover:border-[#245C3A] flex items-center gap-3 cursor-pointer shadow-2xs hover:shadow-xs transition-all"
                    >
                      <img
                        src={resolvedImg}
                        alt={p.crop}
                        className="w-14 h-14 rounded-lg object-cover bg-[#F4EFE6] shrink-0"
                        onError={(e) => handleCropImageError(e, p.crop, p.variety, p.category)}
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex flex-col min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-[#26332B] truncate">{p.crop}</span>
                          <span className="text-xs font-black text-[#245C3A]">₹{p.pricePerKg}/kg</span>
                        </div>
                        <span className="text-[11px] text-[#68736B] truncate">{p.variety}</span>
                        <span className="text-[10px] text-[#8D9B91] mt-0.5">Available: {p.availableQuantityKg.toLocaleString()} kg</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-[#68736B] italic">No other active crop lots listed currently.</p>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-[#FAF7F0] px-6 py-4 border-t border-[#E3DCB] flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onMessageFarmer(farmerData.farmerId, (farmerData.primaryCrops && farmerData.primaryCrops[0]) || 'Produce');
            }}
            className="px-4 py-2 rounded-xl bg-[#245C3A] hover:bg-[#1C4B2E] text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Send Direct Message</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white border border-[#D5DDD2] text-[#48534C] text-xs font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
