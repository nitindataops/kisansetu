import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  RotateCcw, 
  SlidersHorizontal,
  CheckCircle2,
  UserCheck,
  MapPin,
  Check,
  ArrowUpDown,
  X
} from 'lucide-react';
import { LanguageCode } from '../../types';
import { buyerTranslations } from '../../data/buyerTranslations';
import { FilterCropOption, FilterVarietyOption } from '../../utils/cropFilterUtils';

export interface BuyerFilterState {
  category: string;
  location: string;
  crop: string;
  variety: string;
  minPrice: number;
  maxPrice: number;
  grade: string;
  farmer: string;
  verifiedOnly: boolean;
  minQuantity: number;
}

interface BuyerFilterSidebarProps {
  filters: BuyerFilterState;
  onFilterChange: (filters: BuyerFilterState) => void;
  onClearFilters: () => void;
  availableLocations: string[];
  availableCrops: FilterCropOption[];
  availableVarieties: FilterVarietyOption[];
  availableFarmers: { id: string; name: string; location: string }[];
  currentLanguage: LanguageCode;
  featuredFarmers?: {
    farmerId: string;
    name: string;
    location: string;
    verified: boolean;
    rating: number;
    completedDeals: number;
    avatar?: string;
  }[];
  onSelectFarmerProfile?: (farmerId: string) => void;
  sortBy?: string;
  onSortByChange?: (sort: string) => void;
  onClose?: () => void;
}

export const BuyerFilterSidebar: React.FC<BuyerFilterSidebarProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  availableLocations,
  availableCrops,
  availableVarieties,
  availableFarmers,
  currentLanguage,
  featuredFarmers = [],
  onSelectFarmerProfile,
  sortBy = 'recommended',
  onSortByChange,
  onClose,
}) => {
  const t = buyerTranslations[currentLanguage] || buyerTranslations.en;
  const isHi = currentLanguage === 'hi';

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    crop: true,
    variety: true,
    location: true,
    price: false,
    grade: false,
    farmer: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleUpdate = (key: keyof BuyerFilterState, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const handleCropSelect = (cropName: string) => {
    // Single-select: if clicked again, toggle off; otherwise set new crop and reset variety
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
        variety: '', // Automatically reset variety when crop changes
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
    <aside className="w-full flex flex-col gap-4 animate-in fade-in duration-200">
      
      {/* Main Filter Box */}
      <div className="bg-white rounded-2xl border border-[#E3DCB] p-4 sm:p-5 shadow-2xs">
        
        {/* Header with Title, Reset & Optional Close */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE1] mb-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#245C3A]" />
            <h3 className="text-xs sm:text-sm font-black text-[#26332B] uppercase tracking-wider">
              {t.filters.title}
            </h3>
            {activeFiltersCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#245C3A] text-white text-[10px] font-extrabold">
                {activeFiltersCount}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClearFilters}
              className="text-xs font-bold text-[#D6A63A] hover:text-[#9E6D14] flex items-center gap-1 transition-colors cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{t.filters.clearAll}</span>
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-[#68736B] hover:text-[#26332B] hover:bg-[#FAF7F0] cursor-pointer"
                title="Close Filter"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          
          {/* 1. Crop Filter (Single-select Clickable Pills/Cards) */}
          <div className="border-b border-[#F0EBE1] pb-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#26332B] flex items-center gap-1.5">
                <span>{t.filters.crop}</span>
                {filters.crop && (
                  <span className="text-[10px] font-extrabold text-[#245C3A] bg-[#EEF3E8] px-2 py-0.5 rounded-md">
                    {filters.crop}
                  </span>
                )}
              </span>
              <button
                onClick={() => toggleSection('crop')}
                className="text-[#68736B] hover:text-[#26332B] p-0.5 cursor-pointer"
              >
                {openSections.crop ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {openSections.crop && (
              <div className="mt-2 space-y-2">
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
                        ? 'bg-[#245C3A] text-white border-[#245C3A] shadow-xs'
                        : 'bg-[#FBFAF4] text-[#48534C] border-[#D5DDD2] hover:bg-[#EEF3E8]'
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
                        id={`filter-crop-${c.name.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={() => handleCropSelect(c.name)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                          isSelected
                            ? 'bg-[#245C3A] text-white border-[#245C3A] shadow-xs'
                            : 'bg-[#FBFAF4] text-[#26332B] border-[#D5DDD2] hover:bg-[#EEF3E8] hover:border-[#245C3A]'
                        }`}
                      >
                        <span className="text-sm leading-none">{c.icon}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                        <span>{isHi ? c.nameHi : c.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 2. Variety Filter (Dynamically Cascaded from Selected Crop) */}
          <div className="border-b border-[#F0EBE1] pb-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#26332B] flex items-center gap-1.5">
                <span>{t.filters.variety}</span>
                {filters.variety && (
                  <span className="text-[10px] font-extrabold text-[#245C3A] bg-[#EEF3E8] px-2 py-0.5 rounded-md truncate max-w-[140px]">
                    {filters.variety}
                  </span>
                )}
              </span>
              <button
                onClick={() => toggleSection('variety')}
                className="text-[#68736B] hover:text-[#26332B] p-0.5 cursor-pointer"
              >
                {openSections.variety ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {openSections.variety && (
              <div className="mt-2">
                {filters.crop ? (
                  availableVarieties.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        onClick={() => handleVarietySelect('')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border ${
                          !filters.variety
                            ? 'bg-[#245C3A] text-white border-[#245C3A]'
                            : 'bg-[#FBFAF4] text-[#48534C] border-[#D5DDD2] hover:bg-[#EEF3E8]'
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
                            id={`filter-variety-${v.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                            onClick={() => handleVarietySelect(v.name)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border text-left ${
                              isSelected
                                ? 'bg-[#245C3A] text-white border-[#245C3A] shadow-xs'
                                : 'bg-[#FBFAF4] text-[#26332B] border-[#D5DDD2] hover:bg-[#EEF3E8]'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 text-white shrink-0" />}
                            <span>{isHi ? v.nameHi : v.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-[#68736B] italic py-1">
                      {isHi ? 'इस फसल के लिए सभी किस्में दिखाई जा रही हैं।' : 'All varieties for this crop are shown.'}
                    </p>
                  )
                ) : (
                  <div className="p-2.5 rounded-xl bg-[#FAF7F0] border border-[#E3DCB] text-xs text-[#68736B]">
                    <span>👆 {isHi ? 'किस्मों को देखने के लिए ऊपर एक फसल चुनें' : 'Select a crop above to see specific varieties'}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 3. Location Filter */}
          <div className="border-b border-[#F0EBE1] pb-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#26332B]">{t.filters.location}</span>
              <button
                onClick={() => toggleSection('location')}
                className="text-[#68736B] hover:text-[#26332B] p-0.5 cursor-pointer"
              >
                {openSections.location ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
            {openSections.location && (
              <div className="mt-1">
                <select
                  value={filters.location}
                  onChange={(e) => handleUpdate('location', e.target.value)}
                  className="w-full px-2.5 py-2 text-xs bg-[#FBFAF4] border border-[#D5DDD2] rounded-xl text-[#26332B] focus:border-[#245C3A] focus:outline-hidden"
                >
                  <option value="">{t.filters.allLocations}</option>
                  {availableLocations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* 4. Price Range Filter */}
          <div className="border-b border-[#F0EBE1] pb-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#26332B]">{t.filters.priceRange}</span>
              <button
                onClick={() => toggleSection('price')}
                className="text-[#68736B] hover:text-[#26332B] p-0.5 cursor-pointer"
              >
                {openSections.price ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
            {openSections.price && (
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <span className="text-[10px] text-[#68736B]">Min ₹/kg</span>
                    <input
                      type="number"
                      min={0}
                      max={filters.maxPrice}
                      value={filters.minPrice || ''}
                      onChange={(e) => handleUpdate('minPrice', Number(e.target.value) || 0)}
                      placeholder="0"
                      className="w-full px-2 py-1 text-xs bg-[#FBFAF4] border border-[#D5DDD2] rounded-lg"
                    />
                  </div>
                  <span className="text-[#68736B] self-end pb-1">-</span>
                  <div className="flex-1">
                    <span className="text-[10px] text-[#68736B]">Max ₹/kg</span>
                    <input
                      type="number"
                      min={filters.minPrice}
                      value={filters.maxPrice || ''}
                      onChange={(e) => handleUpdate('maxPrice', Number(e.target.value) || 200)}
                      placeholder="200"
                      className="w-full px-2 py-1 text-xs bg-[#FBFAF4] border border-[#D5DDD2] rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 5. Quality Grade Filter */}
          <div className="border-b border-[#F0EBE1] pb-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#26332B]">{t.filters.qualityGrade}</span>
              <button
                onClick={() => toggleSection('grade')}
                className="text-[#68736B] hover:text-[#26332B] p-0.5 cursor-pointer"
              >
                {openSections.grade ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
            {openSections.grade && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {['', 'A+', 'A', 'B'].map((gradeOpt) => {
                  const isSelected = filters.grade === gradeOpt;
                  return (
                    <button
                      key={gradeOpt || 'all'}
                      onClick={() => handleUpdate('grade', gradeOpt)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#245C3A] text-white'
                          : 'bg-[#FBFAF4] text-[#48534C] border border-[#D5DDD2] hover:bg-[#EEF3E8]'
                      }`}
                    >
                      {gradeOpt ? `Grade ${gradeOpt}` : t.filters.allGrades}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 6. Farmer Filter */}
          <div className="border-b border-[#F0EBE1] pb-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#26332B]">{t.filters.farmer}</span>
              <button
                onClick={() => toggleSection('farmer')}
                className="text-[#68736B] hover:text-[#26332B] p-0.5 cursor-pointer"
              >
                {openSections.farmer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
            {openSections.farmer && (
              <div className="mt-1">
                <select
                  value={filters.farmer}
                  onChange={(e) => handleUpdate('farmer', e.target.value)}
                  className="w-full px-2.5 py-2 text-xs bg-[#FBFAF4] border border-[#D5DDD2] rounded-xl text-[#26332B] focus:border-[#245C3A] focus:outline-hidden"
                >
                  <option value="">All Farmers</option>
                  {availableFarmers.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.location.split(',')[0]})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* 7. Verified Farmers Only */}
          <div className="pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filters.verifiedOnly}
                onChange={(e) => handleUpdate('verifiedOnly', e.target.checked)}
                className="w-4 h-4 text-[#245C3A] rounded-sm border-[#D5DDD2] focus:ring-[#245C3A]"
              />
              <span className="text-xs font-semibold text-[#26332B] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#245C3A]" />
                <span>{t.filters.verifiedOnly}</span>
              </span>
            </label>
          </div>

        </div>

        {/* Sort By at Bottom of Filter Section */}
        {onSortByChange && (
          <div className="mt-4 pt-3 border-t border-[#F0EBE1]">
            <label className="text-[11px] font-bold text-[#68736B] uppercase tracking-wider flex items-center gap-1 mb-1.5">
              <ArrowUpDown className="w-3 h-3 text-[#245C3A]" />
              <span>{t.filters.sortBy}</span>
            </label>
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              className="w-full px-2.5 py-2 bg-[#FBFAF4] border border-[#D5DDD2] rounded-xl text-xs font-bold text-[#26332B] focus:border-[#245C3A] focus:outline-hidden cursor-pointer"
            >
              <option value="recommended">{t.sorting.recommended}</option>
              <option value="lowestPrice">{t.sorting.lowestPrice}</option>
              <option value="largestPrice">{t.sorting.largestPrice}</option>
              <option value="nearestFarmer">{t.sorting.nearestFarmer}</option>
              <option value="recentlyAdded">{t.sorting.recentlyAdded}</option>
            </select>
          </div>
        )}

      </div>

      {/* 2. Best Farmers Section (Cleanly Named "Best Farmers") */}
      {featuredFarmers.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#E3DCB] p-4 shadow-2xs">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#F0EBE1] mb-3">
            <h4 className="text-xs font-black text-[#26332B] uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-[#245C3A]" />
              <span>{isHi ? 'सर्वश्रेष्ठ किसान' : 'Best Farmers'}</span>
            </h4>
          </div>

          <div className="space-y-2.5">
            {featuredFarmers.slice(0, 4).map((farmer) => (
              <div
                key={farmer.farmerId}
                className="flex items-center justify-between gap-2 p-2 rounded-xl bg-[#FBFAF4] hover:bg-[#EEF3E8] border border-[#EBE5D8] transition-all group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#245C3A] text-white flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden">
                    {farmer.avatar ? (
                      <img
                        src={farmer.avatar}
                        alt={farmer.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      farmer.name.charAt(0)
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-[#26332B] truncate group-hover:text-[#245C3A]">
                      {farmer.name}
                    </span>
                    <span className="text-[10px] text-[#68736B] truncate flex items-center gap-0.5">
                      <MapPin className="w-2.5 h-2.5 text-[#68736B]" />
                      <span>{farmer.location.split(',')[0]}</span>
                    </span>
                  </div>
                </div>

                {onSelectFarmerProfile && (
                  <button
                    onClick={() => onSelectFarmerProfile(farmer.farmerId)}
                    className="px-2 py-1 rounded-md bg-white border border-[#D5DDD2] hover:border-[#245C3A] text-[10px] font-bold text-[#245C3A] transition-colors cursor-pointer shrink-0"
                  >
                    View
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </aside>
  );
};
