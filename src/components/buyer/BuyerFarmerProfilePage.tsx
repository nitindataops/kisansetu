import React from 'react';
import { 
  ArrowLeft,
  MapPin,
  CheckCircle2,
  Star,
  ShieldCheck,
  Award,
  Calendar,
  MessageSquare,
  Package,
  Layers,
  ChevronRight,
  Sparkles,
  PhoneCall,
  UserCheck
} from 'lucide-react';
import { MarketplaceProduct } from '../../types/buyer';
import { LanguageCode } from '../../types';
import { BuyerProductCard } from './BuyerProductCard';

interface FarmerProfileData {
  farmerId: string;
  name: string;
  location: string;
  verified: boolean;
  rating?: number;
  completedDeals?: number;
  landAreaAcres?: number;
  landAreaAcre?: number;
  primaryCrops?: string[];
  avatar?: string;
  memberSince?: string;
  experienceYears?: number;
  soilHealthCertified?: boolean;
  soilHealthCardCertified?: boolean;
  mandiYard?: string;
  nearestMandi?: string;
}

interface BuyerFarmerProfilePageProps {
  farmerId: string;
  farmerData?: FarmerProfileData;
  farmerProducts: MarketplaceProduct[];
  currentLanguage: LanguageCode;
  onBack: () => void;
  onSelectProduct: (product: MarketplaceProduct) => void;
  onAddToCart: (product: MarketplaceProduct, quantityKg: number) => void;
  onMessageFarmer: (farmerId: string, cropName: string) => void;
  favoriteProductIds: Set<string>;
  onToggleFavorite: (productId: string) => void;
}

export const BuyerFarmerProfilePage: React.FC<BuyerFarmerProfilePageProps> = ({
  farmerId,
  farmerData,
  farmerProducts,
  currentLanguage,
  onBack,
  onSelectProduct,
  onAddToCart,
  onMessageFarmer,
  favoriteProductIds,
  onToggleFavorite,
}) => {
  const isHi = currentLanguage === 'hi';
  const name = farmerData?.name || farmerProducts[0]?.farmerName || 'Verified Farmer';
  const location = farmerData?.location || farmerProducts[0]?.location || 'Bareilly, Uttar Pradesh';
  const rating = farmerData?.rating || farmerProducts[0]?.farmerRating || 4.8;
  const deals = farmerData?.completedDeals || 28;
  const primaryCropList = farmerData?.primaryCrops || Array.from(new Set(farmerProducts.map((p) => p.crop)));

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-200">
      
      {/* 1. Breadcrumbs & Top Bar */}
      <div className="bg-white rounded-2xl border border-[#E3DCB] p-3.5 sm:p-4 shadow-2xs flex items-center justify-between gap-3">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-semibold text-[#68736B]">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-[#245C3A] hover:underline font-bold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isHi ? 'बाज़ार वापस जाएं' : 'Marketplace'}</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-[#A2ADA5]" />
          <span className="text-[#38433C]">{isHi ? 'सर्वश्रेष्ठ किसान' : 'Best Farmers'}</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#A2ADA5]" />
          <span className="text-[#245C3A] font-extrabold">{name}</span>
        </nav>

        <button
          onClick={() => onMessageFarmer(farmerId, primaryCropList[0] || 'Produce')}
          className="px-3.5 py-1.5 rounded-xl bg-[#245C3A] hover:bg-[#1C4B2E] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>{isHi ? 'किसान से चैट करें' : 'Chat with Farmer'}</span>
        </button>
      </div>

      {/* 2. Farmer Profile Hero Banner Card */}
      <div className="bg-white rounded-3xl border border-[#E3DCB] p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#EEF3E8] rounded-full blur-3xl -z-10 opacity-70 pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4 sm:gap-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[#245C3A] text-white flex items-center justify-center text-3xl font-black shrink-0 shadow-md overflow-hidden relative border-2 border-white">
              {farmerData?.avatar ? (
                <img
                  src={farmerData.avatar}
                  alt={name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                name.charAt(0)
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-[#26332B] tracking-tight">
                  {name}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#EEF3E8] border border-[#5F8F45]/30 text-[#245C3A] text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#245C3A]" />
                  <span>{isHi ? 'सत्यापित उत्पादक' : 'Verified Producer'}</span>
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#68736B] flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#245C3A]" />
                  <span>{location}</span>
                </span>
                <span>•</span>
                <span>ID: {farmerId}</span>
                <span>•</span>
                <span>{isHi ? 'सदस्य:' : 'Member since'} {farmerData?.memberSince || '2024'}</span>
              </div>

              {/* Rating & Deals Metrics */}
              <div className="flex items-center gap-3 pt-1 text-xs">
                <div className="flex items-center gap-1 font-extrabold text-[#9E6D14] bg-[#F7EFE0] px-2.5 py-1 rounded-lg border border-[#EADBBD]">
                  <Star className="w-3.5 h-3.5 fill-[#D6A63A] text-[#D6A63A]" />
                  <span>{rating} / 5.0 Rating</span>
                </div>

                <div className="font-bold text-[#245C3A] bg-[#EEF3E8] px-2.5 py-1 rounded-lg border border-[#5F8F45]/30">
                  {deals} {isHi ? 'सफल सौदे' : 'Completed Deals'}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={() => onMessageFarmer(farmerId, primaryCropList[0] || 'Produce')}
              className="px-5 py-3 rounded-2xl bg-[#245C3A] hover:bg-[#1C4B2E] text-white text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{isHi ? 'सीधा संपर्क / बातचीत' : 'Direct Producer Inquiry'}</span>
            </button>
          </div>
        </div>

        {/* Sourcing & Trust Pillars */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#F0EBE1]">
          <div className="p-3 rounded-2xl bg-[#FBFAF4] border border-[#EBE5D8]">
            <span className="text-[10px] text-[#68736B] block uppercase tracking-wider font-bold">
              {isHi ? 'कुल कृषि भूमि' : 'Farmland Size'}
            </span>
            <span className="text-sm font-black text-[#26332B] mt-0.5 block">
              {farmerData?.landAreaAcres || farmerData?.landAreaAcre || '12.5'} Acres
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-[#FBFAF4] border border-[#EBE5D8]">
            <span className="text-[10px] text-[#68736B] block uppercase tracking-wider font-bold">
              {isHi ? 'मृदा स्वास्थ्य कार्ड' : 'Soil Health Card'}
            </span>
            <span className="text-sm font-black text-[#5F8F45] mt-0.5 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Certified ✓</span>
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-[#FBFAF4] border border-[#EBE5D8]">
            <span className="text-[10px] text-[#68736B] block uppercase tracking-wider font-bold">
              {isHi ? 'अनुभव' : 'Farming Experience'}
            </span>
            <span className="text-sm font-black text-[#26332B] mt-0.5 block">
              {farmerData?.experienceYears || 18}+ Years
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-[#FBFAF4] border border-[#EBE5D8]">
            <span className="text-[10px] text-[#68736B] block uppercase tracking-wider font-bold">
              {isHi ? 'प्राथमिक मंडी' : 'Primary APMC Yard'}
            </span>
            <span className="text-sm font-black text-[#26332B] mt-0.5 truncate block">
              {farmerData?.mandiYard || farmerData?.nearestMandi || location.split(',')[0]}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Active Harvest Listings by this Farmer */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-[#26332B] tracking-tight flex items-center gap-2">
              <Package className="w-5 h-5 text-[#245C3A]" />
              <span>{isHi ? 'इस किसान के सक्रिय उत्पाद एवं फसलें' : "Active Farm-Gate Listings"}</span>
            </h2>
            <p className="text-xs text-[#68736B] mt-0.5">
              {isHi 
                ? `सीधे ${name} के खेत से उपलब्ध ताज़ा लॉट` 
                : `Directly harvested batches available from ${name}'s farm`}
            </p>
          </div>
          <span className="text-xs font-bold text-[#5F8F45] bg-[#EEF3E8] px-3 py-1 rounded-full border border-[#5F8F45]/30">
            {farmerProducts.length} Lots Available
          </span>
        </div>

        {farmerProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {farmerProducts.map((prod) => (
              <BuyerProductCard
                key={prod.id}
                product={prod}
                currentLanguage={currentLanguage}
                onAddToCart={onAddToCart}
                onViewDetails={onSelectProduct}
                isFavorite={favoriteProductIds.has(prod.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-[#E3DCB] p-12 text-center text-[#8D9B91] space-y-2">
            <span className="text-4xl">🌾</span>
            <h4 className="text-base font-bold text-[#26332B]">No active public lots at this moment</h4>
            <p className="text-xs max-w-sm mx-auto">
              New batches are uploaded regularly following seasonal harvest schedules.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
