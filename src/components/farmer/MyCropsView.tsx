import React, { useState } from 'react';
import {
  Sprout,
  Plus,
  Edit2,
  Trash2,
  Eye,
  ShieldCheck,
  MapPin,
  TrendingUp,
  Scale,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Warehouse,
} from 'lucide-react';
import { CropListing } from '../../types/farmer';
import { LanguageCode } from '../../types';
import { getFarmerTranslations } from '../../data/farmerTranslations';
import { resolveCropImage, handleCropImageError } from '../../data/imageAssets';
import { isApprovedCrop } from '../../data/cropVarieties';
import { getListingPrice } from '../../services/aiGradingService';
import { ManageQuantityModal } from './ManageQuantityModal';

interface MyCropsViewProps {
  crops: CropListing[];
  onOpenAddCrop: () => void;
  onEditCrop: (crop: CropListing) => void;
  onDeleteCrop: (cropId: string) => void;
  onSellCrop: (crop: CropListing) => void;
  onViewCropDetails: (crop: CropListing) => void;
  onUpdateCropQuantity?: (cropId: string, newQuantity: number) => void;
  currentLanguage: LanguageCode;
}

export const MyCropsView: React.FC<MyCropsViewProps> = ({
  crops,
  onOpenAddCrop,
  onEditCrop,
  onDeleteCrop,
  onSellCrop,
  onViewCropDetails,
  onUpdateCropQuantity,
  currentLanguage,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterProduceType, setFilterProduceType] = useState<'all' | 'raw' | 'processed'>('all');
  const [managingQuantityCrop, setManagingQuantityCrop] = useState<CropListing | null>(null);

  const isHi = currentLanguage === 'hi';
  const t = getFarmerTranslations(currentLanguage);
  const myT = t.myCropsView;

  const categories = [
    { id: 'All', label: isHi ? 'सभी फसलें' : 'All Crops' },
    { id: 'Cereals / Grains', label: isHi ? 'अनाज (गेहूं, धान, मक्का)' : 'Grains (Wheat, Rice, Maize)' },
    { id: 'Pulses', label: isHi ? 'दालें व चना' : 'Pulses & Chana' },
  ];

  const filteredCrops = crops.filter((crop) => {
    // 1. Strict Approved Crops Universe (Wheat, Rice, Maize, Pulses only)
    if (!isApprovedCrop(crop.name)) {
      return false;
    }

    // Produce type filter
    if (filterProduceType === 'processed' && crop.produceType !== 'processed') {
      return false;
    }
    if (filterProduceType === 'raw' && crop.produceType === 'processed') {
      return false;
    }

    if (filterCategory === 'All') return true;
    return (
      crop.category === filterCategory ||
      (filterCategory === 'Cereals / Grains' && (crop.category === 'Grain' || crop.category === 'Cereals / Grains')) ||
      (filterCategory === 'Pulses' && (crop.category === 'Pulse' || crop.category === 'Pulses'))
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#EEF3E8] shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🌾</span>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#26332B]">
              {isHi ? 'मेरी सूचीबद्ध फसलें (My Crops)' : myT.title}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#68736B] mt-0.5">
            {isHi
              ? 'आपकी वर्तमान में बिक्री हेतु उपलब्ध फसलें, एआई ग्रेडिंग स्कोर और लाइव सरकारी मंडी भाव।'
              : 'Manage your active crop listings, view AI quality ratings, and check live government Mandi rates.'}
          </p>
        </div>

        <button
          id="add-crop-top-btn"
          onClick={onOpenAddCrop}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#245C3A] hover:bg-[#1E4D31] text-white text-sm font-bold shadow-md transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#D6A63A]" />
          <span>{isHi ? '+ नई फसल जोड़ें' : myT.addNewCropBtn}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 no-scrollbar">
          {/* Produce Type Pill Filters */}
          <div className="flex items-center p-0.5 rounded-xl bg-[#EEF3E8] border border-[#5F8F45]/20 mr-2 shrink-0">
            <button
              onClick={() => setFilterProduceType('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterProduceType === 'all'
                  ? 'bg-[#245C3A] text-white shadow-2xs'
                  : 'text-[#26332B] hover:text-[#245C3A]'
              }`}
            >
              {isHi ? 'सभी उत्पाद' : 'All Produce'}
            </button>
            <button
              onClick={() => setFilterProduceType('raw')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterProduceType === 'raw'
                  ? 'bg-[#245C3A] text-white shadow-2xs'
                  : 'text-[#26332B] hover:text-[#245C3A]'
              }`}
            >
              {isHi ? 'कच्ची फसलें' : 'Raw Harvest'}
            </button>
            <button
              onClick={() => setFilterProduceType('processed')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                filterProduceType === 'processed'
                  ? 'bg-[#245C3A] text-white shadow-2xs'
                  : 'text-[#26332B] hover:text-[#245C3A]'
              }`}
            >
              <span>✨</span>
              <span>{isHi ? 'प्रसंस्कृत उत्पाद' : 'Processed Produce'}</span>
            </button>
          </div>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                filterCategory === cat.id
                  ? 'bg-[#245C3A] text-white shadow-2xs'
                  : 'bg-white border border-[#EEF3E8] text-[#68736B] hover:bg-[#EEF3E8] hover:text-[#26332B]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-[#68736B] font-medium">
          {isHi ? 'प्रदर्शित' : myT.showing} <b>{filteredCrops.length}</b> / <b>{crops.length}</b> {isHi ? 'फसलें' : myT.cropsListed}
        </div>
      </div>

      {/* Crops Grid */}
      {filteredCrops.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-[#EEF3E8]">
          <Sprout className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-base font-bold text-[#26332B]">{isHi ? 'इस श्रेणी में कोई फसल नहीं मिली' : myT.noCropsFound}</p>
          <button
            onClick={onOpenAddCrop}
            className="mt-4 px-5 py-2.5 rounded-xl bg-[#245C3A] text-white text-xs font-bold cursor-pointer"
          >
            {isHi ? '+ फसल जोड़ें' : myT.addNewCropBtn}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCrops.map((crop) => {
            const cropPricing = getListingPrice(crop);
            return (
            <div
              key={crop.id}
              className="bg-white rounded-3xl border border-[#EEF3E8] hover:border-[#5F8F45]/50 transition-all shadow-xs hover:shadow-md overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Crop Banner Image with Fallback */}
                <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                  <img
                    src={resolveCropImage({ imageUrl: crop.imageUrl, crop: crop.name, variety: crop.variety, category: crop.category, images: crop.images })}
                    alt={crop.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => handleCropImageError(e, crop.name, crop.variety, crop.category)}
                  />
                  <div className="absolute inset-0 bg-[#245C3A]/10 flex items-center justify-center -z-10">
                    <span className="text-4xl">🌾</span>
                  </div>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2 flex-wrap">
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

                    {crop.produceType === 'processed' ? (
                      <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-[#D6A63A] to-[#8C6212] text-white text-[10px] font-black flex items-center gap-1 shadow-xs">
                        <Sparkles className="w-3 h-3 text-yellow-200" />
                        <span>{isHi ? 'मूल्य संवर्धित' : 'Value-Added'}</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#D6A63A]" />
                        <span>{isHi ? 'एआई दृश्य सत्यापित' : 'AI Verified Assessment'}</span>
                      </span>
                    )}
                  </div>

                  {/* Available Stock Tag */}
                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-white/95 backdrop-blur-md text-[#245C3A] text-xs font-black shadow-xs">
                    {crop.quantityKg.toLocaleString('en-IN')} kg
                    <span className="text-[10px] text-[#68736B] font-medium ml-1">
                      ({(crop.quantityKg / 100).toFixed(1)} {isHi ? 'क्विंटल' : 'Qtl'})
                    </span>
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-lg text-[#26332B]">{crop.name}</h3>
                      <p className="text-xs text-[#68736B]">
                        {crop.variety} • {crop.location || 'Bareilly, Uttar Pradesh'}
                      </p>
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-[#EEF3E8] text-[#245C3A] text-xs font-bold">
                      {crop.status}
                    </span>
                  </div>

                  {/* Specifications */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-[#68736B] py-2 border-y border-[#EEF3E8]">
                    {crop.produceType === 'processed' ? (
                      <>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-[#D6A63A] block">
                            {isHi ? 'प्रसंस्करण प्रकार' : 'Value Addition'}:
                          </span>
                          <span className="font-semibold text-[#26332B] truncate block" title={crop.processingType}>
                            {crop.processingType || 'Processed Commodity'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-[#5F8F45] block">
                            {isHi ? 'रिकवरी दर (Yield)' : 'Processing Yield'}:
                          </span>
                          <span className="font-semibold text-[#245C3A]">
                            {crop.processingYieldPercent ? `${crop.processingYieldPercent}% Recovery` : 'Standard Refined'}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-gray-400 block">
                            {isHi ? 'कटाई तिथि' : myT.harvestDate}:
                          </span>
                          <span className="font-semibold text-[#26332B]">{crop.harvestedDate}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-gray-400 block">
                            {isHi ? 'नमी / सूखापन' : myT.moistureContent}:
                          </span>
                          <span className="font-semibold text-[#26332B]">
                            {crop.moistureContent || '11.5%'}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Price Comparison */}
                  <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-[#FBFAF4] border border-[#EEF3E8]">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#68736B] block">
                        {isHi ? 'सरकारी मंडी भाव' : 'Live Mandi Reference'}
                      </span>
                      <div className="text-base font-bold text-[#26332B]">
                        ₹{cropPricing.mandiRateKg}{' '}
                        <span className="text-xs font-normal text-gray-500">/kg</span>
                      </div>
                      <span className="text-[10px] text-gray-400 block">
                        (₹{cropPricing.mandiRateQuintal} / Qtl)
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-[#68736B] block">
                        {isHi ? 'विक्रय मूल्य' : 'Listing Price'} ({cropPricing.classification})
                      </span>
                      <div className={`text-base font-black ${cropPricing.isPremium ? 'text-[#B45309]' : 'text-[#245C3A]'}`}>
                        ₹{cropPricing.pricePerKg}{' '}
                        <span className="text-xs font-normal text-gray-500">/kg</span>
                      </div>
                      <span className={`text-[10px] font-semibold block ${cropPricing.isPremium ? 'text-[#B45309]' : 'text-[#245C3A]'}`}>
                        (₹{cropPricing.isPremium ? cropPricing.premiumRateQuintal : cropPricing.mandiRateQuintal}/Qtl{cropPricing.isPremium ? ' • +5% मंडी बोनस' : ''})
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-5 pt-0 space-y-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSellCrop(crop)}
                    className="flex-1 py-2.5 rounded-xl bg-[#245C3A] hover:bg-[#1B432B] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>{isHi ? 'खरीदार खोजें' : 'Find Buyers'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onViewCropDetails(crop)}
                    className="px-3 py-2.5 rounded-xl bg-[#FBFAF4] hover:bg-[#EEF3E8] border border-[#EEF3E8] text-[#245C3A] text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                    title={isHi ? 'विवरण देखें' : 'View Details'}
                  >
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline">{isHi ? 'विवरण' : 'Details'}</span>
                  </button>

                  <button
                    onClick={() => setManagingQuantityCrop(crop)}
                    className="px-3 py-2.5 rounded-xl bg-[#FBFAF4] hover:bg-[#EEF3E8] border border-[#EEF3E8] text-[#26332B] text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                    title={isHi ? 'मात्रा प्रबंधित करें' : 'Manage Quantity'}
                  >
                    <Scale className="w-4 h-4 text-[#D6A63A]" />
                    <span className="hidden sm:inline">{isHi ? 'मात्रा' : 'Qty'}</span>
                  </button>

                  <button
                    onClick={() => onEditCrop(crop)}
                    className="p-2.5 rounded-xl bg-[#FBFAF4] hover:bg-[#EEF3E8] border border-[#EEF3E8] text-[#26332B] transition-colors cursor-pointer"
                    title={isHi ? 'संपादित करें' : 'Edit Listing'}
                  >
                    <Edit2 className="w-4 h-4 text-[#5F8F45]" />
                  </button>

                  <button
                    onClick={() => onDeleteCrop(crop.id)}
                    className="p-2.5 rounded-xl bg-[#FFF5F0] hover:bg-red-100 border border-red-100 text-[#B86F4B] transition-colors cursor-pointer"
                    title={isHi ? 'लिस्टिंग हटाएं' : 'Remove Listing'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      )}

      {/* Quantity Manager Modal */}
      {managingQuantityCrop && (
        <ManageQuantityModal
          crop={managingQuantityCrop}
          isOpen={true}
          onClose={() => setManagingQuantityCrop(null)}
          onUpdateQuantity={(id, newQty) => {
            if (onUpdateCropQuantity) {
              onUpdateCropQuantity(id, newQty);
            }
          }}
          currentLanguage={currentLanguage}
        />
      )}
    </div>
  );
};
