import React from 'react';
import { X, SlidersHorizontal, RotateCcw, Check, ArrowUpDown } from 'lucide-react';
import { BuyerFilterState } from './BuyerFilterSidebar';
import { LanguageCode } from '../../types';
import { buyerTranslations } from '../../data/buyerTranslations';
import { FilterCropOption, FilterVarietyOption } from '../../utils/cropFilterUtils';

interface BuyerMobileFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: BuyerFilterState;
  onFilterChange: (filters: BuyerFilterState) => void;
  onClearFilters: () => void;
  availableLocations: string[];
  availableCrops: FilterCropOption[];
  availableVarieties: FilterVarietyOption[];
  currentLanguage: LanguageCode;
  sortBy?: string;
  onSortByChange?: (sort: string) => void;
}

export const BuyerMobileFilterModal: React.FC<BuyerMobileFilterModalProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onClearFilters,
  availableLocations,
  availableCrops,
  availableVarieties,
  currentLanguage,
  sortBy = 'recommended',
  onSortByChange,
}) => {
  if (!isOpen) return null;

  const t = buyerTranslations[currentLanguage] || buyerTranslations.en;
  const isHi = currentLanguage === 'hi';

  const handleUpdate = (key: keyof BuyerFilterState, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const handleCropSelect = (cropName: string) => {
    if (filters.crop === cropName) {
      onFilterChange({
        ...filters,
        crop: '',
        variety: '',
      });
    } else {
      onFilterChange({
        ...filters,
        crop: cropName,
        variety: '', // Reset variety when crop changes
      });
    }
  };

  const handleVarietySelect = (varietyName: string) => {
    if (filters.variety === varietyName) {
      handleUpdate('variety', '');
    } else {
      handleUpdate('variety', varietyName);
    }
  };

  const activeFiltersCount = [
    filters.crop ? 1 : 0,
    filters.variety ? 1 : 0,
    filters.location ? 1 : 0,
    filters.grade ? 1 : 0,
    filters.farmer ? 1 : 0,
    filters.verifiedOnly ? 1 : 0,
    filters.minPrice > 0 || (filters.maxPrice && filters.maxPrice < 200) ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end lg:hidden">
      <div className="bg-white w-full max-w-sm h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-4 bg-[#FAF7F0] border-b border-[#E3DCB] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#245C3A]" />
            <h3 className="text-sm font-black text-[#26332B]">{t.filters.mobileFilterTitle}</h3>
            {activeFiltersCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#245C3A] text-white text-[10px] font-bold">
                {activeFiltersCount}
              </span>
            )}
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-[#68736B] hover:text-[#26332B] hover:bg-black/5 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Filters */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          
          {/* 1. Sort By */}
          {onSortByChange && (
            <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#E3DCB]">
              <label className="font-bold text-[#26332B] flex items-center gap-1.5 mb-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#245C3A]" />
                <span>{t.filters.sortBy}</span>
              </label>
              <select
                value={sortBy}
                onChange={(e) => onSortByChange(e.target.value)}
                className="w-full p-2 bg-white border border-[#D5DDD2] rounded-xl text-xs font-bold text-[#26332B]"
              >
                <option value="recommended">{t.sorting.recommended}</option>
                <option value="lowestPrice">{t.sorting.lowestPrice}</option>
                <option value="largestPrice">{t.sorting.largestPrice}</option>
                <option value="nearestFarmer">{t.sorting.nearestFarmer}</option>
                <option value="recentlyAdded">{t.sorting.recentlyAdded}</option>
              </select>
            </div>
          )}

          {/* 2. Crop (Single-select Clickable Pills) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-[#26332B]">{t.filters.crop}</label>
              {filters.crop && (
                <span className="text-[10px] font-bold text-[#245C3A] bg-[#EEF3E8] px-2 py-0.5 rounded-md">
                  {filters.crop}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => {
                  onFilterChange({
                    ...filters,
                    crop: '',
                    variety: '',
                  });
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border ${
                  !filters.crop
                    ? 'bg-[#245C3A] text-white border-[#245C3A]'
                    : 'bg-[#FBFAF4] text-[#48534C] border-[#D5DDD2]'
                }`}
              >
                {!filters.crop && <Check className="w-3.5 h-3.5" />}
                <span>{t.filters.allCrops}</span>
              </button>

              {availableCrops.map((c) => {
                const isSelected = filters.crop.toLowerCase() === c.name.toLowerCase();
                return (
                  <button
                    key={c.id}
                    onClick={() => handleCropSelect(c.name)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                      isSelected
                        ? 'bg-[#245C3A] text-white border-[#245C3A] shadow-xs'
                        : 'bg-[#FBFAF4] text-[#26332B] border-[#D5DDD2]'
                    }`}
                  >
                    <span>{c.icon}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    <span>{isHi ? c.nameHi : c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Variety (Cascaded dynamically from Selected Crop) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-[#26332B]">{t.filters.variety}</label>
              {filters.variety && (
                <span className="text-[10px] font-bold text-[#245C3A] bg-[#EEF3E8] px-2 py-0.5 rounded-md truncate max-w-[120px]">
                  {filters.variety}
                </span>
              )}
            </div>

            {filters.crop ? (
              availableVarieties.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => handleVarietySelect('')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border ${
                      !filters.variety
                        ? 'bg-[#245C3A] text-white border-[#245C3A]'
                        : 'bg-[#FBFAF4] text-[#48534C] border-[#D5DDD2]'
                    }`}
                  >
                    {!filters.variety && <Check className="w-3 h-3" />}
                    <span>{t.filters.allVarieties}</span>
                  </button>

                  {availableVarieties.map((v) => {
                    const isSelected = filters.variety.toLowerCase() === v.name.toLowerCase();
                    return (
                      <button
                        key={v.id}
                        onClick={() => handleVarietySelect(v.name)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border ${
                          isSelected
                            ? 'bg-[#245C3A] text-white border-[#245C3A] shadow-xs'
                            : 'bg-[#FBFAF4] text-[#26332B] border-[#D5DDD2]'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-white shrink-0" />}
                        <span>{isHi ? v.nameHi : v.name}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-[#68736B] italic">
                  {isHi ? 'इस फसल के लिए सभी किस्में उपलब्ध हैं।' : 'All varieties for this crop.'}
                </p>
              )
            ) : (
              <div className="p-2.5 rounded-xl bg-[#FAF7F0] border border-[#E3DCB] text-xs text-[#68736B]">
                <span>👆 {isHi ? 'किस्मों के लिए पहले एक फसल चुनें' : 'Select a crop above to see varieties'}</span>
              </div>
            )}
          </div>

          {/* 4. Location */}
          <div>
            <label className="font-bold text-[#26332B] block mb-1">{t.filters.location}</label>
            <select
              value={filters.location}
              onChange={(e) => handleUpdate('location', e.target.value)}
              className="w-full p-2 bg-[#FBFAF4] border border-[#D5DDD2] rounded-xl text-xs"
            >
              <option value="">{t.filters.allLocations}</option>
              {availableLocations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* 5. Price Range */}
          <div>
            <label className="font-bold text-[#26332B] block mb-1">{t.filters.priceRange}</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                max={filters.maxPrice}
                value={filters.minPrice || ''}
                onChange={(e) => handleUpdate('minPrice', Number(e.target.value) || 0)}
                placeholder="Min ₹"
                className="w-full p-2 bg-[#FBFAF4] border border-[#D5DDD2] rounded-xl text-xs"
              />
              <span>-</span>
              <input
                type="number"
                min={filters.minPrice}
                value={filters.maxPrice || ''}
                onChange={(e) => handleUpdate('maxPrice', Number(e.target.value) || 200)}
                placeholder="Max ₹"
                className="w-full p-2 bg-[#FBFAF4] border border-[#D5DDD2] rounded-xl text-xs"
              />
            </div>
          </div>

          {/* 6. Quality Grade */}
          <div>
            <label className="font-bold text-[#26332B] block mb-1">{t.filters.qualityGrade}</label>
            <div className="flex gap-2">
              {['', 'A+', 'A', 'B'].map((g) => (
                <button
                  key={g || 'all'}
                  onClick={() => handleUpdate('grade', g)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    filters.grade === g ? 'bg-[#245C3A] text-white' : 'bg-[#FBFAF4] border border-[#D5DDD2]'
                  }`}
                >
                  {g ? `Grade ${g}` : 'All'}
                </button>
              ))}
            </div>
          </div>

          {/* 7. Verified Farmers Only */}
          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filters.verifiedOnly}
                onChange={(e) => handleUpdate('verifiedOnly', e.target.checked)}
                className="w-4 h-4 text-[#245C3A] rounded-sm"
              />
              <span className="font-bold text-[#26332B]">{t.filters.verifiedOnly}</span>
            </label>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAF7F0] border-t border-[#E3DCB] flex gap-2">
          <button
            onClick={onClearFilters}
            className="flex-1 py-2.5 rounded-xl bg-white border border-[#D5DDD2] text-xs font-bold text-[#48534C] hover:bg-[#EEF3E8] cursor-pointer flex items-center justify-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.filters.clearAll}</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-[#245C3A] text-white text-xs font-black hover:bg-[#1C4B2E] cursor-pointer"
          >
            {t.filters.apply}
          </button>
        </div>

      </div>
    </div>
  );
};
