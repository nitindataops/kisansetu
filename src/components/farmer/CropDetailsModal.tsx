import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  MapPin,
  Calendar,
  Layers,
  Scale,
  TrendingUp,
  Warehouse,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Info,
  Clock,
  ArrowRight,
  Edit2,
} from 'lucide-react';
import { CropListing } from '../../types/farmer';
import { LanguageCode } from '../../types';
import { searchOfficialMandiPrices } from '../../services/mandiApiService';
import { resolveCropGallery, handleCropImageError } from '../../data/imageAssets';

interface CropDetailsModalProps {
  crop: CropListing | null;
  onClose: () => void;
  onSellCrop: (crop: CropListing) => void;
  onEditCrop?: (crop: CropListing) => void;
  currentLanguage: LanguageCode;
}

export const CropDetailsModal: React.FC<CropDetailsModalProps> = ({
  crop,
  onClose,
  onSellCrop,
  onEditCrop,
  currentLanguage,
}) => {
  const isHi = currentLanguage === 'hi';
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isRefreshingMandi, setIsRefreshingMandi] = useState(false);
  const [liveMandiDetails, setLiveMandiDetails] = useState<any>(null);

  if (!crop) return null;

  const imagesList = resolveCropGallery({
    imageUrl: crop.imageUrl,
    crop: crop.name,
    variety: crop.variety,
    category: crop.category,
    images: crop.images,
  });

  const currentImage = imagesList[selectedImageIndex] || imagesList[0];
  const mandiDetails = liveMandiDetails || crop.mandiReferenceDetails;

  const handleRefreshMandi = async () => {
    setIsRefreshingMandi(true);
    try {
      const resp = await searchOfficialMandiPrices({
        state: crop.state || 'Uttar Pradesh',
        district: crop.district || 'Bareilly',
        market: crop.nearestMandi?.replace(' APMC', '') || 'Bareilly',
        commodity: crop.name,
        variety: crop.variety,
      });

      if (resp && resp.records && resp.records.length > 0) {
        const top = resp.records[0];
        const modalKg = top.modalPriceKg || parseFloat(((top.modalPriceQuintal || 2400) / 100).toFixed(2));
        const minKg = top.minPriceKg || parseFloat(((top.minPriceQuintal || 2200) / 100).toFixed(2));
        const maxKg = top.maxPriceKg || parseFloat(((top.maxPriceQuintal || 2600) / 100).toFixed(2));

        setLiveMandiDetails({
          commodity: crop.name,
          variety: crop.variety,
          market: top.market || 'Bareilly',
          district: top.district || 'Bareilly',
          state: top.state || 'Uttar Pradesh',
          minPriceQuintal: minKg * 100,
          modalPriceQuintal: modalKg * 100,
          maxPriceQuintal: maxKg * 100,
          minPriceKg: minKg,
          modalPriceKg: modalKg,
          maxPriceKg: maxKg,
          arrivalDate: top.arrivalDate || '01/09/2026',
          source: top.source || 'Official AGMARKNET / Government Open Data',
          lastFetchTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isLiveConnected: true,
          gradeSpecificNote:
            'Official mandi data does not provide a separate Grade-A price for this selection. The displayed rate is the official commodity/variety mandi reference rate.',
        });
      }
    } catch (err) {
      console.warn('Failed to refresh mandi in details modal:', err);
    } finally {
      setIsRefreshingMandi(false);
    }
  };

  const aiReport = crop.aiGradingResult;

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-[#EEF3E8] overflow-hidden my-6 max-h-[92vh] flex flex-col animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#EEF3E8] bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🌾</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold font-serif text-[#26332B]">{crop.name}</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#245C3A] text-white text-[11px] font-black">
                  Grade {crop.grade}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#EEF3E8] text-[#245C3A] text-[10px] font-bold">
                  {crop.status}
                </span>
              </div>
              <p className="text-xs text-[#68736B]">
                {crop.variety} • {crop.category} • {crop.location}
              </p>
            </div>
          </div>

          <button
            id="close-crop-details-modal"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto">
          {/* Top Grid: Photo Gallery & Core Economics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Gallery Column */}
            <div className="space-y-2.5">
              <div className="relative h-60 w-full rounded-2xl overflow-hidden bg-gray-100 border border-[#EEF3E8] shadow-xs">
                <img
                  src={currentImage}
                  alt={crop.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={(e) => handleCropImageError(e, crop.name, crop.variety, crop.category)}
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#D6A63A]" />
                    <span>{isHi ? 'एआई दृश्य सत्यापित' : 'AI Visual Assessed'}</span>
                  </span>
                </div>
              </div>

              {/* Thumbnails */}
              {imagesList.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {imagesList.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                        selectedImageIndex === idx
                          ? 'border-[#245C3A] ring-2 ring-[#245C3A]/30'
                          : 'border-gray-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumb ${idx}`}
                        className="w-full h-full object-cover"
                        onError={(e) => handleCropImageError(e, crop.name, crop.variety, crop.category)}
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Economics & Key Numbers */}
            <div className="flex flex-col justify-between space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#FBFAF4] border border-[#EEF3E8]">
                  <span className="text-[10px] uppercase font-bold text-[#68736B] block">
                    {isHi ? 'उपलब्ध स्टॉक मात्रा' : 'Available Lot Quantity'}
                  </span>
                  <div className="text-xl font-bold font-serif text-[#245C3A] mt-0.5">
                    {crop.quantityKg.toLocaleString('en-IN')} kg
                  </div>
                  <span className="text-[11px] text-[#68736B]">
                    ({(crop.quantityKg / 100).toFixed(1)} {isHi ? 'क्विंटल' : 'Quintal'})
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FFFBEF] border border-[#D6A63A]/40">
                  <span className="text-[10px] uppercase font-bold text-[#8C6212] block">
                    {isHi ? 'अपेक्षित विक्रय मूल्य' : 'Target Asking Price'}
                  </span>
                  <div className="text-xl font-black text-[#8C6212] mt-0.5">
                    ₹{crop.expectedPrice}{' '}
                    <span className="text-xs font-normal">/ kg</span>
                  </div>
                  <span className="text-[11px] text-[#8C6212] font-semibold">
                    (₹{Math.round(crop.expectedPrice * 100).toLocaleString('en-IN')} / Qtl)
                  </span>
                </div>
              </div>

              {/* Mandi Comparison Banner */}
              <div className="p-4 rounded-2xl bg-[#EEF3E8]/80 border border-[#5F8F45]/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#245C3A] flex items-center gap-1.5">
                    <span>🏛️</span>
                    <span>{isHi ? 'सरकारी मंडी संदर्भ भाव' : 'Live Government Mandi Reference'}</span>
                  </span>
                  <button
                    onClick={handleRefreshMandi}
                    className="p-1 rounded-lg hover:bg-white text-[#245C3A] text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    title={isHi ? 'रीफ्रेश करें' : 'Refresh Mandi Rate'}
                  >
                    <RefreshCw className={`w-3 h-3 ${isRefreshingMandi ? 'animate-spin' : ''}`} />
                    <span>{isHi ? 'रीफ्रेश' : 'Refresh'}</span>
                  </button>
                </div>

                <div className="flex items-baseline justify-between mt-1">
                  <div>
                    <span className="text-lg font-black text-[#26332B]">
                      ₹{mandiDetails?.modalPriceKg || crop.currentMandiPrice} / kg
                    </span>
                    <span className="text-xs text-[#68736B] block">
                      (₹{mandiDetails?.modalPriceQuintal || crop.currentMandiPrice * 100} / Qtl)
                    </span>
                  </div>

                  <div className="text-right text-[11px] text-[#68736B]">
                    <div>
                      {isHi ? 'मंडी:' : 'Mandi:'} <b>{mandiDetails?.market || crop.nearestMandi || 'Bareilly APMC'}</b>
                    </div>
                    <div>
                      {isHi ? 'आवक:' : 'Arrival:'} {mandiDetails?.arrivalDate || '01/09/2026'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Location & Storage meta */}
              <div className="space-y-1.5 text-xs text-[#26332B] pt-1">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#B86F4B]" />
                  <span>
                    {isHi ? 'स्थान:' : 'Location:'} <b>{crop.location}</b>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Warehouse className="w-3.5 h-3.5 text-[#5F8F45]" />
                  <span>
                    {isHi ? 'भंडारण स्थान:' : 'Storage:'} <b>{crop.storageLocation}</b>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#245C3A]" />
                  <span>
                    {isHi ? 'कटाई तिथि:' : 'Harvested On:'} <b>{crop.harvestedDate}</b>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Quality Report Section */}
          <div className="p-4 sm:p-5 rounded-2xl bg-linear-to-br from-[#FBFAF4] to-[#EEF3E8]/50 border border-[#5F8F45]/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#245C3A] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#D6A63A]" />
                <span>{isHi ? 'एआई गुणवत्ता विश्लेषण रिपोर्ट' : 'AI Crop Quality Assessment Report'}</span>
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#245C3A] text-white font-bold">
                Grade {crop.grade}
              </span>
            </div>

            {aiReport ? (
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-white border border-[#EEF3E8]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-[#26332B]">
                      {isHi ? 'दृश्य मूल्यांकन निष्कर्ष' : 'Visual Assessment Findings'}:
                    </span>
                    <span className="text-[#245C3A] font-bold">
                      {isHi ? 'विश्वास स्कोर:' : 'Confidence:'} {aiReport.confidence}%
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <strong className="text-[#245C3A] block mb-1">
                        ✓ {isHi ? 'सकारात्मक लक्षण' : 'Positive Indicators'}:
                      </strong>
                      {aiReport.visualIndicators.map((vi, i) => (
                        <div key={i} className="text-[#26332B] flex items-center gap-1">
                          <span className="text-green-600">✓</span> {vi}
                        </div>
                      ))}
                    </div>

                    <div>
                      <strong className="text-[#68736B] block mb-1">
                        • {isHi ? 'टिप्पणियां / भिन्नताएं' : 'Observations'}:
                      </strong>
                      {aiReport.potentialIssues.length > 0 ? (
                        aiReport.potentialIssues.map((pi, i) => (
                          <div key={i} className="text-[#68736B]">
                            • {pi}
                          </div>
                        ))
                      ) : (
                        <span className="text-green-700">
                          {isHi ? 'कोई महत्वपूर्ण दोष नहीं पाया गया।' : 'Sound condition lot.'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#EEF3E8] text-[#245C3A] text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5F8F45] shrink-0" />
                  <span>{aiReport.recommendation}</span>
                </div>

                <p className="text-[10px] text-gray-400 italic">
                  ℹ️ {aiReport.disclaimer}
                </p>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-white border border-[#EEF3E8] text-xs text-[#68736B]">
                <p className="italic">"{crop.description}"</p>
                <p className="text-[10px] text-gray-400 mt-2">
                  ℹ️ {isHi ? 'एआई ग्रेडिंग केवल फोटो-आधारित प्रारंभिक दृश्य मूल्यांकन है और यह प्रयोगशाला गुणवत्ता प्रमाणपत्र नहीं है।' : 'AI grading is an image-based preliminary assessment and is not a laboratory quality certificate.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 sm:p-5 border-t border-[#EEF3E8] bg-white flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            {onEditCrop && (
              <button
                onClick={() => {
                  onClose();
                  onEditCrop(crop);
                }}
                className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-[#26332B] hover:bg-[#EEF3E8] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5 text-[#5F8F45]" />
                <span>{isHi ? 'संपादित करें' : 'Edit Listing'}</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-[#68736B] hover:bg-gray-50 transition-colors cursor-pointer"
            >
              {isHi ? 'बंद करें' : 'Close'}
            </button>

            <button
              onClick={() => {
                onClose();
                onSellCrop(crop);
              }}
              className="px-6 py-2.5 rounded-xl bg-[#245C3A] hover:bg-[#1E4D31] text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>{isHi ? 'इस फसल के लिए खरीदार खोजें' : 'Find Buyers for this Crop'}</span>
              <ArrowRight className="w-4 h-4 text-[#D6A63A]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
