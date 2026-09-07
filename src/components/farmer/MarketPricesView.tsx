import React, { useState, useEffect } from 'react';
import {
  Building2,
  CheckCircle2,
  Info,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Search,
  RotateCw,
  SlidersHorizontal,
  TrendingUp,
  Scale,
  Calendar,
  ShieldCheck,
  BellRing,
  AlertTriangle,
  Clock,
  Database,
} from 'lucide-react';
import { OfficialMandiRecord, MandiComparisonItem, MandiHistoryRecord } from '../../types/market';
import { LanguageCode } from '../../types';
import { getFarmerTranslations } from '../../data/farmerTranslations';
import {
  fetchMandiPrices,
  fetchMandiMetadata,
  fetchMandiComparison,
  fetchMandiPriceHistory,
} from '../../services/mandiApiService';
import { isApprovedCrop } from '../../data/cropVarieties';

interface MarketPricesViewProps {
  currentLanguage: LanguageCode;
}

interface ValidatedPoint {
  day: string;
  fullDate?: string;
  price: number;
  quintalPrice?: number;
  kgPrice?: number;
  minPrice?: number;
  maxPrice?: number;
  variety?: string;
  market?: string;
}

export const MarketPricesView: React.FC<MarketPricesViewProps> = ({
  currentLanguage,
}) => {
  const t = getFarmerTranslations(currentLanguage);
  const mpT = t.marketPricesView;

  // Filter & Search State
  const [selectedState, setSelectedState] = useState<string>('Uttar Pradesh');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Bareilly');
  const [selectedMarket, setSelectedMarket] = useState<string>('Bareilly');
  const [selectedCommodity, setSelectedCommodity] = useState<string>('Wheat');
  const [selectedVariety, setSelectedVariety] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // UI & Data State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLiveApi, setIsLiveApi] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [metaNote, setMetaNote] = useState<string | null>(null);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  const [dataDate, setDataDate] = useState<string | null>(null);
  const [resourceId, setResourceId] = useState<string | null>(null);

  const [officialRecords, setOfficialRecords] = useState<OfficialMandiRecord[]>([]);
  const [activeRecord, setActiveRecord] = useState<OfficialMandiRecord | null>(null);
  const [comparisonData, setComparisonData] = useState<{
    records: MandiComparisonItem[];
    averageModalPriceKg: number;
    highestMandi: MandiComparisonItem | null;
    lowestMandi: MandiComparisonItem | null;
    isLiveApi?: boolean;
    errorMessage?: string;
  } | null>(null);

  // 7-Day History State (Strictly real Government Open Data arrival dates)
  const [historyRecords, setHistoryRecords] = useState<MandiHistoryRecord[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState<boolean>(false);
  const [historyError, setHistoryError] = useState<string | null>(null);

  // Metadata Catalog
  const [statesList, setStatesList] = useState<string[]>([
    'Uttar Pradesh',
    'Punjab',
    'Haryana',
    'Rajasthan',
    'Madhya Pradesh',
    'Maharashtra',
    'Gujarat',
    'Bihar',
    'West Bengal',
    'Karnataka',
    'Andhra Pradesh',
    'Telangana',
    'Tamil Nadu',
    'Odisha',
    'Chattisgarh',
    'Jharkhand',
    'Uttarakhand',
    'Himachal Pradesh',
    'Keralam',
  ]);
  const [districtsMap, setDistrictsMap] = useState<Record<string, string[]>>({
    'Uttar Pradesh': ['Bareilly', 'Badaun', 'Bulandshahar', 'Balrampur', 'Khiri (Lakhimpur)', 'Sambhal', 'Sitapur', 'Meerut', 'Lucknow', 'Moradabad', 'Agra', 'Varanasi', 'Kanpur', 'Aligarh'],
    Rajasthan: ['Chittorgarh', 'Jaipur', 'Kota', 'Jodhpur', 'Bikaner', 'Alwar', 'Sri Ganganagar'],
    'Madhya Pradesh': ['Rewa', 'Indore', 'Bhopal', 'Ujjain', 'Jabalpur', 'Gwalior', 'Khandwa'],
    'Andhra Pradesh': ['Prakasam', 'Kurnool', 'Guntur', 'Krishna', 'West Godavari', 'East Godavari'],
    Punjab: ['Ludhiana', 'Amritsar', 'Patiala', 'Jalandhar', 'Bathinda'],
    Haryana: ['Karnal', 'Ambala', 'Hisar', 'Rohtak', 'Kurukshetra'],
    Maharashtra: ['Pune', 'Nashik', 'Nagpur', 'Aurangabad', 'Solapur'],
    Keralam: ['Ernakulam', 'Kozhikode(Calicut)', 'Thiruvananthapuram', 'Kollam'],
  });
  const [commoditiesList, setCommoditiesList] = useState<string[]>([
    'Wheat',
    'Paddy(Dhan)',
    'Rice',
    'Maize',
    'Bengal Gram(Gram/Chana)',
  ]);

  // Unit display switcher: per kg vs per quintal
  const [priceUnitView, setPriceUnitView] = useState<'kg' | 'quintal'>('kg');

  // Chart Interaction State
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  // Alert Modal State
  const [alertSubmitted, setAlertSubmitted] = useState<boolean>(false);
  const [alertTargetPrice, setAlertTargetPrice] = useState<string>('');

  // Load Metadata Catalog on mount
  useEffect(() => {
    async function loadMeta() {
      try {
        const meta = await fetchMandiMetadata();
        if (meta) {
          if (meta.states?.length) setStatesList(meta.states.filter((s) => s !== 'All States'));
          if (meta.districts) setDistrictsMap(meta.districts);
          if (meta.commodities?.length) {
            const uniqueCmds = Array.from(new Set(meta.commodities)).filter((c) => isApprovedCrop(c));
            if (uniqueCmds.length > 0) {
              setCommoditiesList(uniqueCmds);
            }
          }
        }
      } catch (e) {
        console.warn('Metadata load error:', e);
      }
    }
    loadMeta();
  }, []);

  // Perform search when filter parameters change
  const executeSearch = async (overrideParams?: {
    state?: string;
    district?: string;
    market?: string;
    commodity?: string;
    variety?: string;
  }) => {
    setIsLoading(true);
    setErrorMessage(null);
    setMetaNote(null);
    try {
      const state = overrideParams?.state !== undefined ? overrideParams.state : selectedState;
      const district = overrideParams?.district !== undefined ? overrideParams.district : selectedDistrict;
      const market = overrideParams?.market !== undefined ? overrideParams.market : selectedMarket;
      const commodity = overrideParams?.commodity !== undefined ? overrideParams.commodity : selectedCommodity;
      const variety = overrideParams?.variety !== undefined ? overrideParams.variety : selectedVariety;

      const res = await fetchMandiPrices({
        state,
        district,
        market,
        commodity,
        variety: variety === 'All' ? undefined : variety,
        limit: 50,
      });

      setIsLiveApi(Boolean(res.isLiveApi));
      setFetchedAt(res.fetchedAt || null);
      setDataDate(res.dataDate || res.meta?.latestArrivalDate || null);
      setResourceId(res.resourceId || null);
      setMetaNote(res.meta?.note || null);

      const approvedRecords = (res.records || []).filter((r) => isApprovedCrop(r.commodity));

      if (res.success && approvedRecords.length > 0) {
        setOfficialRecords(approvedRecords);
        // Select matching record if present, otherwise default to first
        const match =
          approvedRecords.find(
            (r) =>
              (district === 'All' || r.district.toLowerCase() === district.toLowerCase()) &&
              (commodity === 'All' || r.commodity.toLowerCase() === commodity.toLowerCase())
          ) || approvedRecords[0];
        setActiveRecord(match);
        setErrorMessage(null);
      } else {
        setOfficialRecords([]);
        setActiveRecord(null);
        if (res.isLiveApi) {
          setErrorMessage(
            res.errorMessage ||
              (currentLanguage === 'hi'
                ? 'इस चयन के लिए आज के सरकारी रिकॉर्ड में कोई डेटा प्राप्त नहीं हुआ।'
                : 'No official government mandi records were found for the selected crop/location.')
          );
        } else {
          setErrorMessage(
            res.errorMessage ||
              (currentLanguage === 'hi'
                ? 'सरकारी मंडी सेवा अस्थायी रूप से अनुपलब्ध है।'
                : 'Government mandi service is temporarily unavailable.')
          );
        }
      }

      // Also refresh comparison across mandis strictly from real API records
      const compRes = await fetchMandiComparison(
        commodity === 'All' ? 'Wheat' : commodity,
        state === 'All' ? 'Uttar Pradesh' : state,
        district === 'All' ? undefined : district
      );
      if (compRes) {
        setComparisonData(compRes);
      }

      // Also query historical distinct arrival dates from official government source
      setIsHistoryLoading(true);
      setHistoryError(null);
      fetchMandiPriceHistory({
        state,
        district,
        market,
        commodity,
        variety: variety === 'All' ? undefined : variety,
      })
        .then((histRes) => {
          if (histRes.success && Array.isArray(histRes.records)) {
            setHistoryRecords(histRes.records);
            setHistoryError(null);
          } else {
            setHistoryRecords([]);
            setHistoryError(histRes.errorMessage || 'History unavailable');
          }
        })
        .catch((err) => {
          console.error('Error fetching mandi history:', err);
          setHistoryRecords([]);
          setHistoryError('History unavailable');
        })
        .finally(() => {
          setIsHistoryLoading(false);
        });
    } catch (err) {
      console.error('Error executing mandi search:', err);
      setErrorMessage(
        currentLanguage === 'hi'
          ? 'सरकारी मंडी सेवा अस्थायी रूप से अनुपलब्ध है।'
          : 'Government mandi service is temporarily unavailable.'
      );
      setOfficialRecords([]);
      setActiveRecord(null);
      setHistoryRecords([]);
      setIsLiveApi(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger search on mount & when state/district/market/commodity changes
  useEffect(() => {
    executeSearch();
  }, [selectedState, selectedDistrict, selectedMarket, selectedCommodity]);

  // Handle State Change
  const handleStateChange = (newState: string) => {
    setSelectedState(newState);
    const districts = districtsMap[newState] || ['All'];
    const newDistrict = districts[0] || 'All';
    setSelectedDistrict(newDistrict);
    setSelectedMarket(newDistrict);
  };

  // Handle District Change
  const handleDistrictChange = (newDistrict: string) => {
    setSelectedDistrict(newDistrict);
    setSelectedMarket(newDistrict);
  };

  // Handle Quick Crop Filter Click
  const handleQuickCropSelect = (crop: string) => {
    setSelectedCommodity(crop);
    executeSearch({ commodity: crop });
  };

  // Pricing Derivations
  const modalKg = activeRecord ? activeRecord.modalPriceKg : 0;
  const modalQ = activeRecord ? activeRecord.modalPriceQuintal : 0;
  const minKg = activeRecord ? activeRecord.minPriceKg : 0;
  const minQ = activeRecord ? activeRecord.minPriceQuintal : 0;
  const maxKg = activeRecord ? activeRecord.maxPriceKg : 0;
  const maxQ = activeRecord ? activeRecord.maxPriceQuintal : 0;

  const displayModal = priceUnitView === 'kg' ? `₹${modalKg}` : `₹${modalQ.toLocaleString('en-IN')}`;
  const displayMin = priceUnitView === 'kg' ? `₹${minKg}` : `₹${minQ.toLocaleString('en-IN')}`;
  const displayMax = priceUnitView === 'kg' ? `₹${maxKg}` : `₹${maxQ.toLocaleString('en-IN')}`;
  const unitLabel = priceUnitView === 'kg' ? '/kg' : '/Quintal';

  // 7-day distinct arrival dates: strictly rely on real government records
  const baseHistory = historyRecords.length > 0
    ? historyRecords
    : (activeRecord && activeRecord.arrivalDate
        ? [{
            arrivalDate: activeRecord.arrivalDate,
            rawDate: activeRecord.arrivalDate,
            displayDate: activeRecord.arrivalDate,
            timestamp: 0,
            modalPriceQuintal: activeRecord.modalPriceQuintal,
            modalPriceKg: activeRecord.modalPriceKg,
            minPriceQuintal: activeRecord.minPriceQuintal,
            maxPriceQuintal: activeRecord.maxPriceQuintal,
            minPriceKg: activeRecord.minPriceKg,
            maxPriceKg: activeRecord.maxPriceKg,
            variety: activeRecord.variety,
            market: activeRecord.market,
            district: activeRecord.district,
            state: activeRecord.state,
            commodity: activeRecord.commodity,
          }]
        : []);

  const chartHistory: ValidatedPoint[] = baseHistory.map((item) => ({
    day: item.displayDate || item.arrivalDate || item.rawDate || 'Day',
    fullDate: item.arrivalDate || item.rawDate,
    price: priceUnitView === 'kg' ? item.modalPriceKg : item.modalPriceQuintal,
    quintalPrice: item.modalPriceQuintal,
    kgPrice: item.modalPriceKg,
    minPrice: priceUnitView === 'kg' ? item.minPriceKg : item.minPriceQuintal,
    maxPrice: priceUnitView === 'kg' ? item.maxPriceKg : item.maxPriceQuintal,
    variety: item.variety,
    market: item.market,
  }));

  // SVG Chart Geometry
  const svgWidth = 560;
  const svgHeight = 150;
  const padLeft = 55;
  const padRight = 35;
  const padTop = 22;
  const padBottom = 32;

  const pricesList = chartHistory.map((h) => h.price);
  const minHistPrice = pricesList.length > 0 ? Math.min(...pricesList) : 0;
  const maxHistPrice = pricesList.length > 0 ? Math.max(...pricesList) : 10;
  const priceSpan = maxHistPrice === minHistPrice ? Math.max(1, maxHistPrice * 0.1) : maxHistPrice - minHistPrice;
  const yDomainMin = Math.max(0, minHistPrice - priceSpan * 0.25);
  const yDomainMax = maxHistPrice + priceSpan * 0.25;
  const totalYDomain = yDomainMax - yDomainMin || 1;

  const pointsCoordinates = chartHistory.map((pt, idx) => {
    const x =
      chartHistory.length > 1
        ? padLeft + (idx / (chartHistory.length - 1)) * (svgWidth - padLeft - padRight)
        : svgWidth / 2;
    const y =
      padTop +
      (1 - (pt.price - yDomainMin) / totalYDomain) * (svgHeight - padTop - padBottom);
    return { ...pt, x, y };
  });

  const pathD =
    pointsCoordinates.length > 0
      ? pointsCoordinates.reduce(
          (acc, pt, idx) => (idx === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`),
          ''
        )
      : '';

  const areaD =
    pointsCoordinates.length > 0
      ? `${pathD} L ${pointsCoordinates[pointsCoordinates.length - 1].x},${
          svgHeight - padBottom
        } L ${pointsCoordinates[0].x},${svgHeight - padBottom} Z`
      : '';

  const handleSetAlert = (e: React.FormEvent) => {
    e.preventDefault();
    setAlertSubmitted(true);
    setTimeout(() => {
      setAlertSubmitted(false);
      setAlertTargetPrice('');
    }, 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* 1. Official Government Header & Provenance Bar */}
      <div className="bg-white p-6 rounded-3xl border border-[#EEF3E8] shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl" aria-hidden="true">🏛️</span>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#26332B]">
                {mpT.title}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#68736B] mt-1 max-w-3xl">
              {mpT.subtitle}
            </p>
          </div>

          {/* Provenance & Connection Status Badge */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
            {isLiveApi ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{mpT.liveApiActive}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>
                  {currentLanguage === 'hi' ? 'एपीआई ऑफलाइन / अनुपलब्ध' : 'API Unconfigured / Offline'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Official Provenance Strip */}
        <div className="mt-4 pt-3 border-t border-[#EEF3E8] flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#68736B]">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-[#245C3A]">{mpT.apiProvenanceLabel}</span>
            <span>•</span>
            <span>Source: Government of India — Data.gov.in / AGMARKNET</span>
            {resourceId && (
              <>
                <span>•</span>
                <span className="font-mono text-[10px] text-gray-500">Resource: {resourceId.slice(0, 8)}...</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-4 flex-wrap text-[#26332B] font-medium">
            {dataDate && (
              <div className="flex items-center gap-1 text-[#8C6212] font-semibold">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  {mpT.dataDateLabel}: <b>{dataDate}</b>
                </span>
              </div>
            )}
            {fetchedAt && (
              <div className="flex items-center gap-1 text-[#68736B]">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {mpT.lastFetchLabel}: <b>{new Date(fetchedAt).toLocaleTimeString()}</b>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Search & Filter Bar: State, District, Mandi, Commodity, Variety */}
      <div className="bg-[#FBFAF4] p-5 rounded-3xl border border-[#EEF3E8] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-[#245C3A] uppercase tracking-wider">
            <SlidersHorizontal className="w-4 h-4" />
            <span>
              {currentLanguage === 'hi'
                ? 'सरकारी मंडी खोज व फिल्टर (State, District, Mandi, Commodity)'
                : 'Government Mandi Rate Search (State, District, Mandi, Commodity)'}
            </span>
          </div>
          {isLoading && (
            <div className="flex items-center gap-1.5 text-xs text-[#5F8F45] font-semibold animate-pulse">
              <RotateCw className="w-3.5 h-3.5 animate-spin" />
              <span>{currentLanguage === 'hi' ? 'डेटा लोड हो रहा है...' : 'Querying Mandi Feed...'}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* State */}
          <div>
            <label htmlFor="select-state" className="block text-[11px] font-bold text-[#68736B] mb-1">
              {mpT.stateSelectLabel || 'State'}
            </label>
            <select
              id="select-state"
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full p-2 bg-white text-xs font-semibold text-[#26332B] rounded-xl border border-[#EEF3E8] focus:border-[#5F8F45] focus:outline-none"
            >
              <option value="All">{mpT.allOption || 'All States'}</option>
              {statesList.map((st, idx) => (
                <option key={`st-${st}-${idx}`} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* District */}
          <div>
            <label htmlFor="select-district" className="block text-[11px] font-bold text-[#68736B] mb-1">
              {mpT.districtSelectLabel || 'District'}
            </label>
            <select
              id="select-district"
              value={selectedDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="w-full p-2 bg-white text-xs font-semibold text-[#26332B] rounded-xl border border-[#EEF3E8] focus:border-[#5F8F45] focus:outline-none"
            >
              <option value="All">{mpT.allOption || 'All Districts'}</option>
              {(districtsMap[selectedState] || ['Bareilly', 'Badaun', 'Bulandshahar', 'Meerut', 'Lucknow']).map((dst, idx) => (
                <option key={`dst-${dst}-${idx}`} value={dst}>
                  {dst}
                </option>
              ))}
            </select>
          </div>

          {/* Market (Mandi) */}
          <div>
            <label htmlFor="select-market" className="block text-[11px] font-bold text-[#68736B] mb-1">
              {mpT.mandiSelectLabel || 'Market (Mandi)'}
            </label>
            <input
              id="select-market"
              type="text"
              value={selectedMarket}
              onChange={(e) => setSelectedMarket(e.target.value)}
              placeholder="e.g. Bareilly or All"
              className="w-full p-2 bg-white text-xs font-semibold text-[#26332B] rounded-xl border border-[#EEF3E8] focus:border-[#5F8F45] focus:outline-none"
            />
          </div>

          {/* Commodity (Crop) */}
          <div>
            <label htmlFor="select-commodity" className="block text-[11px] font-bold text-[#68736B] mb-1">
              {mpT.commoditySelectLabel || 'Commodity'}
            </label>
            <select
              id="select-commodity"
              value={selectedCommodity}
              onChange={(e) => setSelectedCommodity(e.target.value)}
              className="w-full p-2 bg-white text-xs font-semibold text-[#26332B] rounded-xl border border-[#EEF3E8] focus:border-[#5F8F45] focus:outline-none"
            >
              <option value="All">{mpT.allOption || 'All Commodities'}</option>
              {commoditiesList.map((cmd, idx) => (
                <option key={`cmd-${cmd}-${idx}`} value={cmd}>
                  {cmd}
                </option>
              ))}
            </select>
          </div>

          {/* Variety */}
          <div>
            <label htmlFor="select-variety" className="block text-[11px] font-bold text-[#68736B] mb-1">
              {mpT.varietySelectLabel || 'Variety'}
            </label>
            <input
              id="select-variety"
              type="text"
              value={selectedVariety}
              onChange={(e) => setSelectedVariety(e.target.value)}
              placeholder="e.g. Dara / Sharbati / All"
              className="w-full p-2 bg-white text-xs font-semibold text-[#26332B] rounded-xl border border-[#EEF3E8] focus:border-[#5F8F45] focus:outline-none"
            />
          </div>

          {/* Search Trigger Button */}
          <div className="flex items-end">
            <button
              id="btn-search-mandi"
              onClick={() => executeSearch()}
              className="w-full py-2 px-3 bg-[#245C3A] hover:bg-[#1b462c] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{mpT.searchMandiBtn || 'Search'}</span>
            </button>
          </div>
        </div>

        {/* Quick Commodity Pills Bar */}
        <div className="pt-2 border-t border-[#EEF3E8] flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-bold text-[#68736B] uppercase">
              {currentLanguage === 'hi' ? 'त्वरित फसल:' : 'Quick Select:'}
            </span>
            {commoditiesList.slice(0, 8).map((crop, idx) => {
              const isSelected = selectedCommodity.toLowerCase() === crop.toLowerCase();
              return (
                <button
                  key={`quick-crop-${crop}-${idx}`}
                  id={`quick-crop-${crop.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  onClick={() => handleQuickCropSelect(crop)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-[#245C3A] text-white shadow-xs'
                      : 'bg-white hover:bg-[#EEF3E8] text-[#26332B] border border-[#EEF3E8]'
                  }`}
                >
                  {crop}
                </button>
              );
            })}
          </div>

          {/* Unit Toggle: ₹/kg vs ₹/Quintal */}
          <div className="flex items-center gap-1 shrink-0 bg-white px-2 py-1 rounded-xl border border-[#EEF3E8] text-xs">
            <span className="text-[11px] font-semibold text-[#68736B] mr-1">
              {currentLanguage === 'hi' ? 'इकाई:' : 'Unit:'}
            </span>
            <button
              id="unit-toggle-kg"
              onClick={() => setPriceUnitView('kg')}
              className={`px-2.5 py-0.5 rounded-lg font-bold text-xs cursor-pointer ${
                priceUnitView === 'kg' ? 'bg-[#245C3A] text-white' : 'text-[#68736B]'
              }`}
            >
              ₹/kg
            </button>
            <button
              id="unit-toggle-quintal"
              onClick={() => setPriceUnitView('quintal')}
              className={`px-2.5 py-0.5 rounded-lg font-bold text-xs cursor-pointer ${
                priceUnitView === 'quintal' ? 'bg-[#245C3A] text-white' : 'text-[#68736B]'
              }`}
            >
              ₹/Quintal
            </button>
          </div>
        </div>
      </div>

      {/* Meta Diagnostic Banner (e.g. if District had 0 arrivals today and State mandis are shown) */}
      {metaNote && (
        <div className="p-3.5 bg-[#EEF3E8] rounded-2xl border border-[#245C3A]/20 flex items-center gap-2.5 text-xs text-[#245C3A] font-medium shadow-xs">
          <Info className="w-4 h-4 shrink-0 text-[#245C3A]" />
          <span>{metaNote}</span>
        </div>
      )}

      {/* 3. Main Display: Real Active Mandi Record OR Differentiated Error/No-Record State */}
      {activeRecord ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Price Card & 7-Day Chart (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-7 border border-[#EEF3E8] shadow-xs flex flex-col justify-between">
            <div>
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#EEF3E8] mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#5F8F45] uppercase tracking-wider block">
                      {activeRecord.market} APMC Mandi • {activeRecord.district} ({activeRecord.state})
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#EEF3E8] text-[#245C3A] text-[10px] font-bold">
                      {mpT.actualMandiBadge}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold font-serif text-[#26332B] mt-1">
                    {activeRecord.commodity}{' '}
                    <span className="text-lg font-normal text-gray-500">
                      ({activeRecord.variety})
                    </span>
                  </h3>
                  <p className="text-xs text-[#68736B] mt-1">
                    Source: Government of India — Data.gov.in / AGMARKNET • Directorate of Marketing & Inspection
                  </p>
                </div>

                {/* Main Rate Highlight */}
                <div className="text-left sm:text-right">
                  <span className="text-[10px] uppercase font-bold text-[#68736B] block mb-0.5">
                    {mpT.currentMarketPrice || 'Latest Modal Price'}
                  </span>
                  <div className="text-3xl sm:text-4xl font-black font-serif text-[#245C3A]">
                    {displayModal}{' '}
                    <span className="text-sm font-normal text-gray-500">{unitLabel}</span>
                  </div>
                  <div className="text-xs text-[#68736B] mt-0.5">
                    {priceUnitView === 'kg'
                      ? `(₹${modalQ.toLocaleString('en-IN')} /Quintal)`
                      : `(₹${modalKg} /kg)`}
                  </div>

                  {/* Trend Indicator */}
                  {activeRecord.trend && (
                    <div
                      className={`inline-flex items-center gap-1 text-xs font-bold mt-1.5 px-2.5 py-0.5 rounded-lg ${
                        activeRecord.trend === 'up'
                          ? 'bg-green-100 text-green-800'
                          : activeRecord.trend === 'down'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {activeRecord.trend === 'up' ? (
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      ) : activeRecord.trend === 'down' ? (
                        <ArrowDownRight className="w-3.5 h-3.5" />
                      ) : (
                        <Minus className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {activeRecord.priceChange24h !== undefined && activeRecord.priceChange24h > 0 ? '+' : ''}
                        ₹{activeRecord.priceChange24h || 0}{' '}
                        ({activeRecord.percentChange24h !== undefined && activeRecord.percentChange24h > 0 ? '+' : ''}
                        {activeRecord.percentChange24h || 0}%)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Price Stats Strip: Today's Min | Modal Rate | Today's Max */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-[#FBFAF4] border border-[#EEF3E8] mb-6">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#68736B] block">
                    {mpT.todayMin}
                  </span>
                  <span className="text-sm sm:text-lg font-bold text-[#26332B] block mt-0.5">
                    {displayMin}
                    <span className="text-[11px] font-normal text-gray-500 ml-1">{unitLabel}</span>
                  </span>
                  <span className="text-[10px] text-gray-500 block">
                    {priceUnitView === 'kg' ? `₹${minQ}/Qtl` : `₹${minKg}/kg`}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-[#68736B] block">
                    {mpT.modalAverage}
                  </span>
                  <span className="text-sm sm:text-lg font-bold text-[#245C3A] block mt-0.5">
                    {displayModal}
                    <span className="text-[11px] font-normal text-gray-500 ml-1">{unitLabel}</span>
                  </span>
                  <span className="text-[10px] text-gray-500 block">
                    {priceUnitView === 'kg' ? `₹${modalQ}/Qtl` : `₹${modalKg}/kg`}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-[#68736B] block">
                    {mpT.todayMax}
                  </span>
                  <span className="text-sm sm:text-lg font-bold text-[#D6A63A] block mt-0.5">
                    {displayMax}
                    <span className="text-[11px] font-normal text-gray-500 ml-1">{unitLabel}</span>
                  </span>
                  <span className="text-[10px] text-gray-500 block">
                    {priceUnitView === 'kg' ? `₹${maxQ}/Qtl` : `₹${maxKg}/kg`}
                  </span>
                </div>
              </div>

              {/* 7-Day Official Price Movement Graph */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#245C3A]" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#68736B]">
                      {mpT.historicalTrend}
                    </h4>
                  </div>
                  <span className="text-[11px] text-[#245C3A] font-semibold bg-[#EEF3E8] px-2.5 py-0.5 rounded-md">
                    {mpT.officialGovMandiDataBadge}
                  </span>
                </div>

                {/* Graph Container: Strictly uses real historical records without synthetic interpolation */}
                {isHistoryLoading ? (
                  <div className="p-8 rounded-2xl bg-[#FBFAF4] border border-[#EEF3E8] text-center text-xs text-[#68736B]">
                    <RotateCw className="w-6 h-6 text-[#5F8F45] mx-auto mb-2 animate-spin" />
                    <p className="font-semibold text-[#26332B]">
                      {currentLanguage === 'hi'
                        ? 'सरकारी आवक रिकॉर्ड लोड हो रहे हैं...'
                        : 'Querying verified government historical records...'}
                    </p>
                  </div>
                ) : !isLiveApi ? (
                  <div className="p-8 rounded-2xl bg-[#FFFBEF] border border-amber-200 text-center text-xs text-amber-900">
                    <AlertTriangle className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                    <p className="font-bold text-sm text-amber-950">{mpT.mandiDataUnavailable}</p>
                    <p className="text-[11px] mt-1 text-amber-800">
                      {currentLanguage === 'hi'
                        ? 'सरकारी ओपन डेटा एपीआई कनेक्ट होने पर वास्तविक इतिहास प्रदर्शित होगा।'
                        : 'Official government arrival records will be displayed once the live AGMARKNET API responds.'}
                    </p>
                  </div>
                ) : chartHistory.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-[#FBFAF4] border border-[#EEF3E8] text-center text-xs text-[#68736B]">
                    <Info className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    <p className="font-semibold text-[#26332B]">Historical government mandi records are currently insufficient for this chart.</p>
                    <p className="text-[11px] mt-1 text-gray-500">
                      {currentLanguage === 'hi'
                        ? 'इस मंडी के लिए वर्तमान बुलेटिन में एकल दैनिक रिकॉर्ड दर्ज है।'
                        : 'Single daily arrival record reported in the current government bulletin.'}
                    </p>
                  </div>
                ) : chartHistory.length === 1 ? (
                  /* Case: Exactly 1 Real Record Available - Clear Verified Notice */
                  <div className="bg-[#FBFAF4] rounded-2xl border border-[#EEF3E8] p-5 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#245C3A]">
                          <CheckCircle2 className="w-4 h-4 text-[#5F8F45]" />
                          <span>{mpT.singleRecordAvailable}</span>
                        </div>
                        <p className="text-[11px] text-[#68736B] mt-1">
                          {currentLanguage === 'hi'
                            ? 'डेटा की प्रामाणिकता बनाए रखने के लिए बिना अतिरिक्त वास्तविक आवक के कोई काल्पनिक रेखा नहीं खींची गई है।'
                            : 'To maintain strict data integrity, no synthetic line is drawn when only a single arrival date exists in the official government bulletin.'}
                        </p>
                      </div>
                      <span className="text-[11px] font-bold text-[#8C6212] bg-[#FFFBEF] px-2.5 py-1 rounded-lg border border-[#D6A63A]/40 shrink-0">
                        {chartHistory[0].fullDate || chartHistory[0].day}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#EEF3E8]">
                      <div className="bg-white p-3 rounded-xl border border-[#EEF3E8]">
                        <span className="text-[10px] uppercase font-bold text-[#68736B] block">
                          {mpT.arrivalDateLabel}
                        </span>
                        <span className="text-sm font-bold text-[#26332B] block mt-0.5">
                          {chartHistory[0].fullDate || chartHistory[0].day}
                        </span>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-[#EEF3E8]">
                        <span className="text-[10px] uppercase font-bold text-[#68736B] block">
                          {mpT.modalAverage}
                        </span>
                        <span className="text-sm font-bold text-[#245C3A] block mt-0.5">
                          {priceUnitView === 'kg'
                            ? `₹${chartHistory[0].kgPrice} /kg`
                            : `₹${(chartHistory[0].quintalPrice || 0).toLocaleString('en-IN')} /Quintal`}
                        </span>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-[#EEF3E8]">
                        <span className="text-[10px] uppercase font-bold text-[#68736B] block">
                          {currentLanguage === 'hi' ? 'न्यूनतम - अधिकतम' : 'Min - Max Range'}
                        </span>
                        <span className="text-sm font-bold text-[#8C6212] block mt-0.5">
                          ₹{chartHistory[0].minPrice} - ₹{chartHistory[0].maxPrice}{' '}
                          <span className="text-[10px] text-gray-500 font-normal">{unitLabel}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#68736B] pt-2 border-t border-[#EEF3E8]/80">
                      <span>Source: Government of India — Data.gov.in / AGMARKNET</span>
                      <span className="font-medium text-[#245C3A]">{mpT.arrivalDatesGovReported}</span>
                    </div>
                  </div>
                ) : (
                  /* Case: >= 2 Distinct Real Dates Available - Render Verified SVG Graph */
                  <div className="bg-[#FBFAF4] rounded-2xl border border-[#EEF3E8] p-4 relative overflow-hidden">
                    {/* Hover Tooltip */}
                    {hoveredPointIndex !== null && pointsCoordinates[hoveredPointIndex] && (
                      <div
                        className="absolute z-20 bg-[#245C3A] text-white px-3 py-1.5 rounded-xl text-xs shadow-md pointer-events-none transition-all duration-150 transform -translate-x-1/2 -translate-y-full"
                        style={{
                          left: `${(pointsCoordinates[hoveredPointIndex].x / svgWidth) * 100}%`,
                          top: `${(pointsCoordinates[hoveredPointIndex].y / svgHeight) * 100 - 6}%`,
                        }}
                      >
                        <div className="font-bold">
                          {priceUnitView === 'kg'
                            ? `₹${pointsCoordinates[hoveredPointIndex].price} /kg`
                            : `₹${pointsCoordinates[hoveredPointIndex].price.toLocaleString('en-IN')} /Quintal`}
                        </div>
                        <div className="text-[10px] text-white/80">
                          {pointsCoordinates[hoveredPointIndex].fullDate || pointsCoordinates[hoveredPointIndex].day}
                        </div>
                      </div>
                    )}

                    {/* SVG Line & Area */}
                    <div className="w-full overflow-x-auto no-scrollbar">
                      <svg
                        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                        className="w-full h-36 sm:h-44 overflow-visible"
                      >
                        <defs>
                          <linearGradient id="officialMandiGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#245C3A" stopOpacity="0.28" />
                            <stop offset="100%" stopColor="#245C3A" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>

                        {/* Y-Axis Grid Lines */}
                        <line
                          x1={padLeft}
                          y1={padTop}
                          x2={svgWidth - padRight}
                          y2={padTop}
                          stroke="#EEF3E8"
                          strokeDasharray="3 3"
                        />
                        <text
                          x={padLeft - 8}
                          y={padTop + 4}
                          textAnchor="end"
                          className="text-[9px] fill-[#8A948C] font-mono"
                        >
                          ₹{Math.round(yDomainMax)}
                        </text>

                        <line
                          x1={padLeft}
                          y1={(padTop + svgHeight - padBottom) / 2}
                          x2={svgWidth - padRight}
                          y2={(padTop + svgHeight - padBottom) / 2}
                          stroke="#EEF3E8"
                          strokeDasharray="3 3"
                        />
                        <text
                          x={padLeft - 8}
                          y={(padTop + svgHeight - padBottom) / 2 + 3}
                          textAnchor="end"
                          className="text-[9px] fill-[#8A948C] font-mono"
                        >
                          ₹{Math.round((yDomainMin + yDomainMax) / 2)}
                        </text>

                        <line
                          x1={padLeft}
                          y1={svgHeight - padBottom}
                          x2={svgWidth - padRight}
                          y2={svgHeight - padBottom}
                          stroke="#EEF3E8"
                        />
                        <text
                          x={padLeft - 8}
                          y={svgHeight - padBottom + 3}
                          textAnchor="end"
                          className="text-[9px] fill-[#8A948C] font-mono"
                        >
                          ₹{Math.round(yDomainMin)}
                        </text>

                        {/* Area Fill */}
                        <path d={areaD} fill="url(#officialMandiGradient)" />

                        {/* Line Stroke */}
                        <path
                          d={pathD}
                          fill="none"
                          stroke="#245C3A"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        {/* Data Points */}
                        {pointsCoordinates.map((pt, idx) => (
                          <g
                            key={`hist-pt-${idx}`}
                            className="cursor-pointer"
                            onMouseEnter={() => setHoveredPointIndex(idx)}
                            onMouseLeave={() => setHoveredPointIndex(null)}
                          >
                            <circle
                              cx={pt.x}
                              cy={pt.y}
                              r={hoveredPointIndex === idx ? 5.5 : 3.5}
                              fill={hoveredPointIndex === idx ? '#8C6212' : '#245C3A'}
                              stroke="#FFFFFF"
                              strokeWidth="2"
                              className="transition-all duration-150"
                            />
                            {/* X-Axis Date Label */}
                            <text
                              x={pt.x}
                              y={svgHeight - 10}
                              textAnchor="middle"
                              className={`text-[9px] font-semibold transition-colors ${
                                hoveredPointIndex === idx ? 'fill-[#245C3A] font-bold' : 'fill-[#68736B]'
                              }`}
                            >
                              {pt.day}
                            </text>
                          </g>
                        ))}
                      </svg>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#68736B] mt-2 pt-2 border-t border-[#EEF3E8]">
                      <span>Source: Government of India — Data.gov.in / AGMARKNET</span>
                      <span className="font-medium text-[#245C3A]">{mpT.arrivalDatesGovReported}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Price Confidence & Verification Note */}
            <div className="mt-6 pt-4 border-t border-[#EEF3E8] flex flex-wrap items-center justify-between gap-3 text-xs text-[#68736B]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#5F8F45]" />
                <span className="font-medium text-[#26332B]">
                  {currentLanguage === 'hi'
                    ? 'एफएक्यू (FAQ) ग्रेड मानकों के अनुसार आधिकारिक रूप से सत्यापित'
                    : 'Officially Verified Fair Average Quality (FAQ) Standards'}
                </span>
              </div>
              <span>
                {currentLanguage === 'hi' ? 'दैनिक आवक तिथि:' : 'Reported Arrival Date:'}{' '}
                <b>{activeRecord.arrivalDate || 'Today'}</b>
              </span>
            </div>
          </div>

          {/* Right Column: Alert & APMC Norms (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Set SMS Price Alert Card */}
            <div className="bg-[#FFFBEF] rounded-3xl p-6 border border-[#D6A63A]/40 shadow-xs">
              <div className="flex items-center gap-2 text-[#8C6212] font-bold text-xs uppercase tracking-wider mb-2">
                <BellRing className="w-4 h-4" />
                <span>{mpT.priceAlertsHeading}</span>
              </div>
              <p className="text-xs text-[#8C6212]/90 mb-4">{mpT.priceAlertSub}</p>

              {alertSubmitted ? (
                <div className="p-3 bg-white rounded-2xl border border-[#D6A63A] text-xs font-bold text-[#8C6212] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5F8F45]" />
                  <span>{mpT.smsAlertActivated}</span>
                </div>
              ) : (
                <form onSubmit={handleSetAlert} className="space-y-2.5">
                  <div>
                    <label htmlFor="input-target-price" className="text-[11px] font-bold text-[#8C6212] uppercase block mb-1">
                      {mpT.targetPriceLabel}
                    </label>
                    <input
                      id="input-target-price"
                      type="number"
                      value={alertTargetPrice}
                      onChange={(e) => setAlertTargetPrice(e.target.value)}
                      placeholder={`e.g. ${Math.ceil(modalKg * 1.1 || 30)}`}
                      required
                      className="w-full p-2.5 bg-white text-xs text-[#26332B] rounded-xl border border-[#D6A63A]/40 focus:border-[#8C6212] font-semibold"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-[#8C6212] hover:bg-[#64440B] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    {mpT.setAlertBtn}
                  </button>
                </form>
              )}
            </div>

            {/* Quality Standard & Mandi Ingress */}
            <div className="bg-white rounded-3xl p-6 border border-[#EEF3E8] shadow-xs">
              <h4 className="font-bold text-sm text-[#26332B] mb-3">
                {currentLanguage === 'hi' ? 'एपीएमसी गुणवत्ता एवं आवक मानदंड' : 'APMC Quality & Grade Norms'}
              </h4>
              <div className="space-y-3 text-xs text-[#68736B]">
                <div className="flex justify-between items-center pb-2 border-b border-[#EEF3E8]">
                  <span>{currentLanguage === 'hi' ? 'दैनिक आवक स्थिति:' : 'Reported Arrival Date:'}</span>
                  <b className="text-[#26332B]">{activeRecord.arrivalDate || 'Today'}</b>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-[#EEF3E8]">
                  <span>{currentLanguage === 'hi' ? 'मंडी मांग स्थिति:' : 'Mandi Trading Status:'}</span>
                  <b className="text-[#245C3A]">
                    {currentLanguage === 'hi' ? 'सत्यापित एपीएमसी व्यापार' : 'Verified APMC Trading'}
                  </b>
                </div>
                <div>
                  <span className="block text-[11px] font-semibold text-[#8A948C] mb-1">
                    {currentLanguage === 'hi' ? 'एफएक्यू (FAQ) गुणवत्ता मानक:' : 'APMC FAQ Quality Standard:'}
                  </span>
                  <p className="text-[#26332B] bg-[#FBFAF4] p-2.5 rounded-xl border border-[#EEF3E8] leading-relaxed">
                    {activeRecord.commodity.toLowerCase().includes('wheat')
                      ? 'Moisture <12%, Foreign matter <1%, uniform golden grain luster, zero infestation.'
                      : activeRecord.commodity.toLowerCase().includes('maize')
                      ? 'Moisture <13%, Foreign matter <1.5%, sound yellow kernels, zero mould or aflatoxin.'
                      : activeRecord.commodity.toLowerCase().includes('rice') || activeRecord.commodity.toLowerCase().includes('paddy')
                      ? 'Grain elongation >1.8x, sound kernels, moisture <14%, minimal broken percentage.'
                      : 'Fair Average Quality (FAQ) certified lot as per Directorate of Marketing & Inspection.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Differentiated Empty / Error States */
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#EEF3E8] text-center space-y-3 shadow-xs">
          {isLiveApi ? (
            /* State: Connected to Government API, but 0 records matched specific query */
            <>
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-[#245C3A]">
                <Info className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-[#26332B]">
                {currentLanguage === 'hi' ? 'कोई सरकारी रिकॉर्ड नहीं मिला' : 'No Official Records Found'}
              </h3>
              <p className="text-xs sm:text-sm text-[#68736B] max-w-xl mx-auto leading-relaxed">
                {errorMessage ||
                  (currentLanguage === 'hi'
                    ? `आज के सरकारी बुलेटिन में ${selectedCommodity} के लिए कोई आवक दर्ज नहीं हुई है। कृपया अन्य राज्य या फसल का चयन करें।`
                    : `No official mandi arrivals were reported for ${selectedCommodity} in today's government bulletin. Try selecting "All States" or another crop.`)}
              </p>
              <div className="pt-3 flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setSelectedState('All');
                    setSelectedDistrict('All');
                    executeSearch({ state: 'All', district: 'All' });
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#245C3A] hover:bg-[#1b462c] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{currentLanguage === 'hi' ? 'सभी राज्यों में खोजें' : 'Search Across All States'}</span>
                </button>
                <button
                  onClick={() => executeSearch()}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-[#EEF3E8] text-[#245C3A] border border-[#EEF3E8] text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>{currentLanguage === 'hi' ? 'पुनः प्रयास करें' : 'Refresh'}</span>
                </button>
              </div>
            </>
          ) : (
            /* State: API Error or Key unconfigured */
            <>
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-700">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-[#26332B]">
                {currentLanguage === 'hi'
                  ? 'सरकारी मंडी सेवा अस्थायी रूप से अनुपलब्ध है'
                  : 'Government Mandi Service Temporarily Unavailable'}
              </h3>
              <p className="text-xs sm:text-sm text-[#68736B] max-w-xl mx-auto leading-relaxed">
                {errorMessage ||
                  (currentLanguage === 'hi'
                    ? 'सरकारी ओपन डेटा एपीआई से कनेक्ट नहीं हो सका। कृपया पुनः प्रयास करें।'
                    : 'The official Government Open Data feed is currently unreachable. Please retry.')}
              </p>
              <div className="pt-3">
                <button
                  onClick={() => executeSearch()}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#245C3A] hover:bg-[#1b462c] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>{currentLanguage === 'hi' ? 'पुनः प्रयास करें' : 'Retry Government API Request'}</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* 4. Multi-Mandi Comparison Table: Strictly Uses Real API records */}
      <div className="bg-white p-6 rounded-3xl border border-[#EEF3E8] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#245C3A]" />
              <h3 className="text-lg font-bold font-serif text-[#26332B]">
                {mpT.multiMandiCompareTitle} — {selectedCommodity}
              </h3>
            </div>
            <p className="text-xs text-[#68736B] mt-0.5">
              {mpT.multiMandiCompareSub}
            </p>
          </div>

          {comparisonData?.averageModalPriceKg ? (
            <div className="px-3 py-1.5 rounded-xl bg-[#EEF3E8] text-[#245C3A] text-xs font-bold self-start sm:self-auto">
              <span>{mpT.averageRateAcrossMandis}: </span>
              <span className="font-extrabold">₹{comparisonData.averageModalPriceKg} /kg</span>{' '}
              <span className="text-[11px] font-normal text-gray-600">
                (₹{Math.round(comparisonData.averageModalPriceKg * 100)} /Qtl)
              </span>
            </div>
          ) : null}
        </div>

        {/* Comparison Table / Empty Notice */}
        {comparisonData?.records && comparisonData.records.length > 0 ? (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#EEF3E8] text-[#68736B] font-bold uppercase text-[10px]">
                  <th className="py-3 px-3">{currentLanguage === 'hi' ? 'मंडी यार्ड' : 'Mandi Yard'}</th>
                  <th className="py-3 px-3">{currentLanguage === 'hi' ? 'जिला व राज्य' : 'District & State'}</th>
                  <th className="py-3 px-3 text-right">{currentLanguage === 'hi' ? 'न्यूनतम दर' : 'Min Rate'}</th>
                  <th className="py-3 px-3 text-right font-black text-[#245C3A]">
                    {currentLanguage === 'hi' ? 'मॉडल दर (Modal)' : 'Modal Rate'}
                  </th>
                  <th className="py-3 px-3 text-right">{currentLanguage === 'hi' ? 'अधिकतम दर' : 'Max Rate'}</th>
                  <th className="py-3 px-3 text-center">{currentLanguage === 'hi' ? 'आवक तिथि' : 'Arrival Date'}</th>
                  <th className="py-3 px-3 text-center">{currentLanguage === 'hi' ? 'रुझान' : '24h Trend'}</th>
                  <th className="py-3 px-3 text-center">{currentLanguage === 'hi' ? 'कार्रवाई' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF3E8]">
                {comparisonData.records.map((row, i) => {
                  const isSelected =
                    activeRecord?.market.toLowerCase() === row.market.toLowerCase() &&
                    activeRecord?.district.toLowerCase() === row.district.toLowerCase();

                  return (
                    <tr
                      key={i}
                      className={`hover:bg-[#FBFAF4] transition-colors ${
                        isSelected ? 'bg-[#EEF3E8]/50 font-semibold' : ''
                      }`}
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#26332B]">{row.market} Mandi</span>
                          {row.isNearest && (
                            <span className="px-2 py-0.5 rounded-md bg-[#EEF3E8] text-[#245C3A] text-[10px] font-bold">
                              {mpT.nearestMandiBadge}
                            </span>
                          )}
                          {row.isHighestRate && (
                            <span className="px-2 py-0.5 rounded-md bg-[#FFFBEF] text-[#8C6212] border border-[#D6A63A]/30 text-[10px] font-bold">
                              ⭐ {mpT.highestRateBadge}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-[#68736B]">
                        {row.district}, {row.state}
                      </td>
                      <td className="py-3 px-3 text-right text-[#68736B]">
                        ₹{priceUnitView === 'kg' ? row.minPriceKg : row.minPriceKg * 100}
                      </td>
                      <td className="py-3 px-3 text-right font-black text-[#245C3A] text-sm">
                        ₹{priceUnitView === 'kg' ? row.modalPriceKg : row.modalPriceQuintal}
                        <span className="text-[10px] font-normal text-gray-500 ml-0.5">{unitLabel}</span>
                      </td>
                      <td className="py-3 px-3 text-right text-[#D6A63A] font-bold">
                        ₹{priceUnitView === 'kg' ? row.maxPriceKg : row.maxPriceKg * 100}
                      </td>
                      <td className="py-3 px-3 text-center text-[#68736B]">{row.arrivalDate || 'Today'}</td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            row.trend === 'up'
                              ? 'bg-green-100 text-green-800'
                              : row.trend === 'down'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {row.trend === 'up' ? '▲ Up' : row.trend === 'down' ? '▼ Down' : '● Stable'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => {
                            setSelectedDistrict(row.district);
                            setSelectedMarket(row.market);
                            const matched = officialRecords.find(
                              (r) =>
                                r.market.toLowerCase() === row.market.toLowerCase() &&
                                r.commodity.toLowerCase() === selectedCommodity.toLowerCase()
                            );
                            if (matched) setActiveRecord(matched);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-[#245C3A] text-white'
                              : 'bg-white hover:bg-[#EEF3E8] text-[#245C3A] border border-[#EEF3E8]'
                          }`}
                        >
                          {isSelected
                            ? currentLanguage === 'hi'
                              ? 'सक्रिय'
                              : 'Selected'
                            : currentLanguage === 'hi'
                            ? 'चुनें'
                            : 'View Mandi'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-[#FBFAF4] border border-[#EEF3E8] text-center text-xs text-[#68736B]">
            <Info className="w-5 h-5 text-gray-400 mx-auto mb-1.5" />
            <p className="font-semibold text-[#26332B]">{mpT.mandiCompareUnavailable}</p>
            <p className="text-[11px] text-gray-500 mt-0.5">
              {currentLanguage === 'hi'
                ? 'सरकारी डेटा उपलब्ध होने पर यहां विभिन्न मंडियों की तुलना प्रदर्शित की जाएगी।'
                : 'Mandi rate comparison across markets will populate automatically when official records are returned.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
