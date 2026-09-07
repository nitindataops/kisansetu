import React, { useState, useEffect } from 'react';
import {
  Warehouse,
  Factory,
  Snowflake,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  PhoneCall,
  Clock,
  Coins,
  FileCheck2,
  Sparkles,
  ArrowRight,
  Plus,
  Filter,
  Scale,
  TrendingUp,
  RefreshCw,
  QrCode,
  Layers,
} from 'lucide-react';
import { StorageFacility, ProcessorOpportunity, CropListing } from '../../types/farmer';
import { ProcessingRecord, PostHarvestAnalytics, ProcessingStage } from '../../types/processing';
import { LanguageCode } from '../../types';
import { getFarmerTranslations } from '../../data/farmerTranslations';
import { getProcessingTranslations } from '../../data/processingTranslations';
import {
  fetchProcessingRecordsApi,
  createProcessingRecordApi,
  updateProcessingStatusApi,
  publishProcessingToMarketplaceApi,
  fetchPostHarvestAnalyticsApi,
} from '../../services/processingApiService';
import { StartProcessingModal } from './StartProcessingModal';
import { ProcessingTraceabilityModal } from './ProcessingTraceabilityModal';
import { ProcessingRecordCard } from './ProcessingRecordCard';

interface StorageProcessingViewProps {
  storages: StorageFacility[];
  processors: ProcessorOpportunity[];
  currentLanguage: LanguageCode;
  crops?: CropListing[];
  farmerProfile?: any;
  onUpdateCrops?: (updatedCrops: CropListing[]) => void;
}

export const StorageProcessingView: React.FC<StorageProcessingViewProps> = ({
  storages,
  processors,
  currentLanguage,
  crops = [],
  farmerProfile,
  onUpdateCrops,
}) => {
  const [activeTab, setActiveTab] = useState<'processing' | 'storage' | 'mills'>('processing');
  const [selectedStorage, setSelectedStorage] = useState<StorageFacility | null>(null);
  const [selectedProcessor, setSelectedProcessor] = useState<ProcessorOpportunity | null>(null);
  const [reserveSuccess, setReserveSuccess] = useState(false);
  const [reserveQty, setReserveQty] = useState('50');

  // Processing specific state
  const [records, setRecords] = useState<ProcessingRecord[]>([]);
  const [analytics, setAnalytics] = useState<PostHarvestAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isStartModalOpen, setIsStartModalOpen] = useState<boolean>(false);
  const [traceabilityRecord, setTraceabilityRecord] = useState<ProcessingRecord | null>(null);
  const [filterStage, setFilterStage] = useState<'all' | ProcessingStage>('all');
  const [statusFeedback, setStatusFeedback] = useState<string>('');

  const farmerId = farmerProfile?.farmerId || (farmerProfile as any)?.id || 'KISAN-UP-2026-8842';
  const farmerName = farmerProfile?.name || 'Rajesh Kumar';

  const t = getFarmerTranslations(currentLanguage);
  const pT = getProcessingTranslations(currentLanguage);
  const aiT = t.aiAnalysisView;

  const loadProcessingData = async () => {
    setIsLoading(true);
    try {
      const [recs, stats] = await Promise.all([
        fetchProcessingRecordsApi(farmerId),
        fetchPostHarvestAnalyticsApi(farmerId),
      ]);
      setRecords(recs);
      setAnalytics(stats);
    } catch (err) {
      console.warn('Could not load processing data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProcessingData();
  }, [farmerId]);

  const handleStartProcessingSubmit = async (payload: Partial<ProcessingRecord>): Promise<boolean> => {
    const res = await createProcessingRecordApi(payload);
    if (res.success && res.record) {
      // Refresh processing data
      await loadProcessingData();

      // If source crop or processed crop were updated, sync with FarmerDashboard
      if (onUpdateCrops && crops.length > 0) {
        let nextCrops = [...crops];
        if (res.updatedSourceCrop) {
          nextCrops = nextCrops.map((c) => (c.id === res.updatedSourceCrop.id ? res.updatedSourceCrop : c));
        }
        if (res.processedCrop) {
          nextCrops = [res.processedCrop, ...nextCrops.filter((c) => c.id !== res.processedCrop.id)];
        }
        onUpdateCrops(nextCrops);
      }

      setStatusFeedback('Post-harvest processing operation successfully initiated!');
      setTimeout(() => setStatusFeedback(''), 4000);
      return true;
    }
    return false;
  };

  const handleMarkCompleted = async (recordId: string) => {
    const res = await updateProcessingStatusApi(recordId, 'PROCESSED_AVAILABLE', farmerId, {
      isPublishedToMarketplace: true,
    });
    if (res.success) {
      await loadProcessingData();
      setStatusFeedback('Processing marked as completed and available in inventory!');
      setTimeout(() => setStatusFeedback(''), 3000);
    }
  };

  const handlePublishToMarketplace = async (record: ProcessingRecord) => {
    const res = await publishProcessingToMarketplaceApi(record.id, farmerId);
    if (res.success) {
      await loadProcessingData();
      if (onUpdateCrops && res.listing) {
        onUpdateCrops([res.listing, ...crops.filter((c) => c.id !== res.listing.id)]);
      }
      setStatusFeedback(`"${record.processedProductName}" is now live on the Buyer Marketplace!`);
      setTimeout(() => setStatusFeedback(''), 4000);
    }
  };

  const handleReserveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReserveSuccess(true);
    setTimeout(() => {
      setReserveSuccess(false);
      setSelectedStorage(null);
      setSelectedProcessor(null);
      setReserveQty('50');
    }, 3000);
  };

  // Filtered records
  const filteredRecords = records.filter((r) => {
    if (filterStage === 'all') return true;
    return r.status === filterStage;
  });

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Feedback banner */}
      {statusFeedback && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs font-bold text-emerald-800 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusFeedback}</span>
        </div>
      )}

      {/* Main Header & Tab Navigation */}
      <div className="bg-white p-6 rounded-3xl border border-[#EEF3E8] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏭</span>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#26332B] flex items-center gap-2">
              <span>{pT.moduleTitle}</span>
              <span className="text-[10px] font-black uppercase tracking-wider bg-[#5F8F45]/15 text-[#245C3A] px-2 py-0.5 rounded-full">
                SIH2026193
              </span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#68736B] mt-0.5">
            {pT.moduleSubtitle}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#EEF3E8] border border-[#5F8F45]/20 self-start md:self-auto overflow-x-auto">
          <button
            onClick={() => setActiveTab('processing')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'processing'
                ? 'bg-[#245C3A] text-white shadow-2xs'
                : 'text-[#26332B] hover:text-[#245C3A]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E6C65B]" />
            <span>{pT.tabs.postHarvest}</span>
            {records.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-white/20 rounded-full text-[10px]">
                {records.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('storage')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'storage'
                ? 'bg-[#245C3A] text-white shadow-2xs'
                : 'text-[#26332B] hover:text-[#245C3A]'
            }`}
          >
            <Warehouse className="w-3.5 h-3.5" />
            <span>{pT.tabs.storage}</span>
          </button>

          <button
            onClick={() => setActiveTab('mills')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'mills'
                ? 'bg-[#245C3A] text-white shadow-2xs'
                : 'text-[#26332B] hover:text-[#245C3A]'
            }`}
          >
            <Factory className="w-3.5 h-3.5" />
            <span>{pT.tabs.mills}</span>
          </button>
        </div>
      </div>

      {/* Post-Harvest Analytics Ribbon */}
      {activeTab === 'processing' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-3xl bg-white border border-[#EEF3E8] shadow-2xs">
            <span className="text-[11px] font-bold text-[#68736B] uppercase tracking-wider block">
              {pT.analytics.rawProcessed}
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl sm:text-2xl font-black text-[#26332B]">
                {(analytics?.totalRawProcessedKg || 1500).toLocaleString()}
              </span>
              <span className="text-xs font-bold text-[#68736B]">kg</span>
            </div>
            <span className="text-[10px] text-[#5F8F45] font-semibold mt-0.5 block">
              Direct from farm lot harvest
            </span>
          </div>

          <div className="p-4 rounded-3xl bg-white border border-[#EEF3E8] shadow-2xs">
            <span className="text-[11px] font-bold text-[#68736B] uppercase tracking-wider block">
              {pT.analytics.outputProduced}
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl sm:text-2xl font-black text-[#245C3A]">
                {(analytics?.totalProcessedOutputKg || 1105).toLocaleString()}
              </span>
              <span className="text-xs font-bold text-[#68736B]">kg</span>
            </div>
            <span className="text-[10px] text-[#68736B] font-semibold mt-0.5 block">
              Avg Recovery: {analytics?.overallAverageYieldPercent || 73.7}%
            </span>
          </div>

          <div className="p-4 rounded-3xl bg-white border border-[#EEF3E8] shadow-2xs">
            <span className="text-[11px] font-bold text-[#68736B] uppercase tracking-wider block">
              {pT.analytics.activeProducts}
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl sm:text-2xl font-black text-[#26332B]">
                {analytics?.activeProcessedProductsCount || 2}
              </span>
              <span className="text-xs font-bold text-[#68736B]">Batches</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 block">
              Live in Buyer Marketplace
            </span>
          </div>

          <div className="p-4 rounded-3xl bg-gradient-to-br from-[#245C3A] to-[#1B432B] text-white shadow-xs">
            <span className="text-[11px] font-bold text-[#E6C65B] uppercase tracking-wider block">
              {pT.analytics.netGain}
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl sm:text-2xl font-black text-green-300">
                +₹{(analytics?.totalEstimatedValueAdditionGain || 3720).toLocaleString()}
              </span>
            </div>
            <span className="text-[10px] text-white/80 font-semibold mt-0.5 block">
              Estimated Value Addition Margin
            </span>
          </div>
        </div>
      )}

      {/* Tab 1: Post-Harvest Processing Operations Hub */}
      {activeTab === 'processing' && (
        <div className="space-y-4">
          {/* Subheader & Action Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#EEF3E8] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setFilterStage('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  filterStage === 'all'
                    ? 'bg-[#245C3A] text-white'
                    : 'bg-[#FAF7F0] text-[#26332B] hover:bg-[#EEF3E8]'
                }`}
              >
                All Records ({records.length})
              </button>
              <button
                onClick={() => setFilterStage('PROCESSING_IN_PROGRESS')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  filterStage === 'PROCESSING_IN_PROGRESS'
                    ? 'bg-amber-600 text-white'
                    : 'bg-[#FAF7F0] text-[#26332B] hover:bg-[#EEF3E8]'
                }`}
              >
                In Progress ({records.filter((r) => r.status === 'PROCESSING_IN_PROGRESS').length})
              </button>
              <button
                onClick={() => setFilterStage('PROCESSED_AVAILABLE')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  filterStage === 'PROCESSED_AVAILABLE'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-[#FAF7F0] text-[#26332B] hover:bg-[#EEF3E8]'
                }`}
              >
                Completed & In Stock ({records.filter((r) => r.status === 'PROCESSED_AVAILABLE').length})
              </button>
            </div>

            {/* Launch Modal Action */}
            <button
              onClick={() => setIsStartModalOpen(true)}
              className="px-5 py-2.5 rounded-2xl bg-[#245C3A] hover:bg-[#1B432B] text-white text-xs font-black shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all self-stretch sm:self-auto"
            >
              <Plus className="w-4 h-4 text-[#E6C65B]" />
              <span>{pT.form.startProcessingBtn}</span>
            </button>
          </div>

          {/* Records Grid */}
          {filteredRecords.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredRecords.map((record) => (
                <ProcessingRecordCard
                  key={record.id}
                  record={record}
                  currentLanguage={currentLanguage}
                  onMarkCompleted={handleMarkCompleted}
                  onPublishToMarketplace={handlePublishToMarketplace}
                  onViewTraceability={(r) => setTraceabilityRecord(r)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-10 text-center border border-[#EEF3E8] space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#FAF7F0] text-[#245C3A] flex items-center justify-center mx-auto">
                <Sparkles className="w-7 h-7 text-[#E6C65B]" />
              </div>
              <h4 className="text-base font-bold text-[#26332B]">No processing records in this filter</h4>
              <p className="text-xs text-[#68736B] max-w-md mx-auto">
                Convert your raw harvest into high-margin value-added commodities like stone-ground atta, cold-pressed oil, or packaged pulses.
              </p>
              <button
                onClick={() => setIsStartModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-[#245C3A] text-white text-xs font-bold cursor-pointer"
              >
                {pT.form.startProcessingBtn}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Cold Storages & Warehouses */}
      {activeTab === 'storage' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {storages.map((st) => (
            <div
              key={st.id}
              className="bg-white rounded-3xl border border-[#EEF3E8] hover:border-[#5F8F45]/40 transition-all p-5 sm:p-6 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-bold text-base text-[#26332B]">{st.name}</h3>
                    <p className="text-xs text-[#68736B] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#5F8F45]" />
                      <span>{st.location}</span>
                      <span>•</span>
                      <span>{st.distanceKm} km away</span>
                    </p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#5F8F45]/15 text-[#245C3A] text-xs font-bold">
                    {st.storageType || (st as any).type || 'Cold Storage'}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-[#68736B] p-3.5 rounded-2xl bg-[#FBFAF4] border border-[#EEF3E8] mb-4">
                  <div className="flex justify-between">
                    <span>Available Capacity:</span>
                    <b className="text-[#245C3A]">{st.availableCapacityQuintals} Quintals</b>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Rent Rate:</span>
                    <b className="text-[#26332B]">₹{st.pricePerQuintalMonth ?? (st as any).ratePerQuintalMonth ?? 25} / Quintal / Month</b>
                  </div>
                  <div className="flex justify-between">
                    <span>Supported Crops / Features:</span>
                    <b className="text-[#26332B]">
                      {Array.isArray((st as any).suitableCrops) && (st as any).suitableCrops.length > 0
                        ? (st as any).suitableCrops.join(', ')
                        : Array.isArray(st.features) && st.features.length > 0
                        ? st.features.slice(0, 2).join(' • ')
                        : 'Wheat, Paddy, Maize, Pulses'}
                    </b>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedStorage(st)}
                className="w-full py-2.5 rounded-xl bg-[#245C3A] hover:bg-[#1B432B] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                {aiT.actionBookStorage}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Processing Mills & Transformation Units */}
      {activeTab === 'mills' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {processors.map((pr) => (
            <div
              key={pr.id}
              className="bg-white rounded-3xl border border-[#EEF3E8] hover:border-[#5F8F45]/40 transition-all p-5 sm:p-6 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-bold text-base text-[#26332B]">{pr.name || (pr as any).facilityName}</h3>
                    <p className="text-xs text-[#68736B] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#5F8F45]" />
                      <span>{pr.location}</span>
                      <span>•</span>
                      <span>{pr.distanceKm} km away</span>
                    </p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#D6A63A]/20 text-[#8C6212] text-xs font-bold">
                    {pr.cropRequired || (pr as any).inputCrop}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-[#68736B] p-3.5 rounded-2xl bg-[#FBFAF4] border border-[#EEF3E8] mb-4">
                  <div className="flex justify-between">
                    <span>Transformation Capability:</span>
                    <b className="text-[#245C3A]">{pr.processingType || (pr as any).outputProduct}</b>
                  </div>
                  <div className="flex justify-between">
                    <span>Turnaround / Terms:</span>
                    <b className="text-[#26332B]">{pr.paymentTerms || `${pr.turnaroundDays} Days Turnaround`}</b>
                  </div>
                  <div className="flex justify-between">
                    <span>Expected Realization:</span>
                    <b className="text-[#5F8F45] font-black">{pr.expectedValue || 'High Value Addition'}</b>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedProcessor(pr)}
                  className="flex-1 py-2.5 rounded-xl bg-[#245C3A] hover:bg-[#1B432B] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  {aiT.actionContactProcessor}
                </button>
                <button
                  onClick={() => {
                    setIsStartModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-[#245C3A] text-[#245C3A] hover:bg-[#EEF3E8] text-xs font-bold transition-colors cursor-pointer"
                >
                  Start Run
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Start Value Addition Modal */}
      <StartProcessingModal
        isOpen={isStartModalOpen}
        onClose={() => setIsStartModalOpen(false)}
        rawCrops={crops}
        partnerMills={processors}
        currentLanguage={currentLanguage}
        farmerId={farmerId}
        farmerName={farmerName}
        onSubmit={handleStartProcessingSubmit}
      />

      {/* Traceability & QR Code Modal */}
      <ProcessingTraceabilityModal
        isOpen={Boolean(traceabilityRecord)}
        onClose={() => setTraceabilityRecord(null)}
        record={traceabilityRecord}
        currentLanguage={currentLanguage}
      />

      {/* Legacy Booking Dialog Modal */}
      {(selectedStorage || selectedProcessor) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-[#EEF3E8]">
            <h3 className="font-bold text-base text-[#26332B] mb-1">
              {selectedStorage ? 'Book Warehouse Slot' : 'Connect with Processing Unit'}
            </h3>
            <p className="text-xs text-[#68736B] mb-4">
              {selectedStorage ? selectedStorage.name : selectedProcessor?.name || (selectedProcessor as any)?.facilityName}
            </p>

            {reserveSuccess ? (
              <div className="p-4 bg-green-50 rounded-2xl border border-green-200 text-center">
                <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-xs font-bold text-green-800">
                  Request successfully confirmed! Manager contact details sent to your phone.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReserveSubmit} className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-[#68736B] uppercase block mb-1">
                    Quantity (Quintals)
                  </label>
                  <input
                    type="number"
                    value={reserveQty}
                    onChange={(e) => setReserveQty(e.target.value)}
                    required
                    className="w-full p-2.5 bg-[#FBFAF4] text-xs font-bold text-[#26332B] rounded-xl border border-[#EEF3E8]"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#245C3A] text-white text-xs font-bold cursor-pointer"
                  >
                    Confirm Booking
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStorage(null);
                      setSelectedProcessor(null);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#FBFAF4] text-[#26332B] text-xs font-bold cursor-pointer"
                  >
                    {t.common.cancel}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
