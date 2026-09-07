import React, { useState } from 'react';
import { 
  FilePlus, 
  Users, 
  Lock, 
  Calendar, 
  QrCode, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp,
  ShieldCheck,
  Building,
  Check,
  Clock,
  ChevronRight
} from 'lucide-react';
import { 
  BuyerRequirement, 
  PriceLockProposal, 
  FutureDemandPost, 
  BatchTraceabilityInfo 
} from '../../types/buyer';
import { LanguageCode } from '../../types';
import { buyerTranslations } from '../../data/buyerTranslations';

interface BuyerProcurementViewProps {
  currentLanguage: LanguageCode;
  requirements: BuyerRequirement[];
  onAddRequirement: (req: Omit<BuyerRequirement, 'id' | 'createdAt' | 'status'>) => void;
  priceLocks: PriceLockProposal[];
  onAddPriceLock: (lock: Omit<PriceLockProposal, 'id' | 'status' | 'createdAt'>) => void;
  futureDemands: FutureDemandPost[];
  onAddFutureDemand: (demand: Omit<FutureDemandPost, 'id' | 'createdAt' | 'responsesCount'>) => void;
  traceabilityBatches: BatchTraceabilityInfo[];
  onOpenBatchQR: (batchId: string) => void;
  onApprovePooledOrder?: (reqId: string) => void;
}

export const BuyerProcurementView: React.FC<BuyerProcurementViewProps> = ({
  currentLanguage,
  requirements,
  onAddRequirement,
  priceLocks,
  onAddPriceLock,
  futureDemands,
  onAddFutureDemand,
  traceabilityBatches,
  onOpenBatchQR,
  onApprovePooledOrder,
}) => {
  const t = buyerTranslations[currentLanguage] || buyerTranslations.en;

  const [activeProcurementTab, setActiveProcurementTab] = useState<'requirements' | 'priceLocks' | 'futureDemand' | 'traceability'>('requirements');

  // Modal states for adding items
  const [showReqModal, setShowReqModal] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);
  const [showDemandModal, setShowDemandModal] = useState(false);

  // New Requirement Form
  const [reqCrop, setReqCrop] = useState('Wheat');
  const [reqVariety, setReqVariety] = useState('Sharbati');
  const [reqQty, setReqQty] = useState(5000);
  const [reqMaxPrice, setReqMaxPrice] = useState(30);
  const [reqGrade, setReqGrade] = useState('A');
  const [reqLocation, setReqLocation] = useState('Bareilly, Uttar Pradesh');
  const [reqDeliveryDate, setReqDeliveryDate] = useState('2026-09-25');
  const [reqNotes, setReqNotes] = useState('Standard moisture < 12%, double-stitched gunny packaging required.');

  // New Price Lock Form
  const [lockFarmerId, setLockFarmerId] = useState('FARM-101');
  const [lockFarmerName, setLockFarmerName] = useState('Harpreet Singh');
  const [lockCrop, setLockCrop] = useState('Wheat');
  const [lockVariety, setLockVariety] = useState('Sharbati MP-306');
  const [lockQty, setLockQty] = useState(3000);
  const [lockAgreedPrice, setLockAgreedPrice] = useState(29);
  const [lockValidTill, setLockValidTill] = useState('2026-11-30');

  // New Future Demand Form
  const [demandCrop, setDemandCrop] = useState('Maize');
  const [demandVariety, setDemandVariety] = useState('HQPM-1 Yellow');
  const [demandTotalQty, setDemandTotalQty] = useState(10000);
  const [demandExpectedMonth, setDemandExpectedMonth] = useState('November 2026');
  const [demandTargetRate, setDemandTargetRate] = useState(24);
  const [demandLocation, setDemandLocation] = useState('North India Mandi Corridor');

  const handleCreateRequirement = (e: React.FormEvent) => {
    e.preventDefault();
    onAddRequirement({
      crop: reqCrop,
      variety: reqVariety,
      quantityKg: Number(reqQty),
      maxPricePerKg: Number(reqMaxPrice),
      grade: reqGrade,
      preferredLocation: reqLocation,
      deliveryDate: reqDeliveryDate,
      specialInstructions: reqNotes,
      allowFarmerPooling: true,
      matchedFarmers: [
        { farmerId: 'FARM-101', farmerName: 'Harpreet Singh', location: 'Bareilly, UP', availableQtyKg: 2000, offeredPrice: 28, distanceKm: 18, similarityScore: 96 },
        { farmerId: 'FARM-104', farmerName: 'Suresh Patel', location: 'Moradabad, UP', availableQtyKg: 1800, offeredPrice: 28.5, distanceKm: 32, similarityScore: 92 },
        { farmerId: 'FARM-102', farmerName: 'Rameshwar Sharma', location: 'Rampur, UP', availableQtyKg: 1200, offeredPrice: 29, distanceKm: 24, similarityScore: 89 },
      ],
    });
    setShowReqModal(false);
  };

  const handleCreatePriceLock = (e: React.FormEvent) => {
    e.preventDefault();
    onAddPriceLock({
      farmerId: lockFarmerId,
      farmerName: lockFarmerName,
      crop: lockCrop,
      variety: lockVariety,
      quantityKg: Number(lockQty),
      agreedPricePerKg: Number(lockAgreedPrice),
      validTill: lockValidTill,
      terms: 'Standard quality verification at destination warehouse within 24h of dispatch.',
    });
    setShowLockModal(false);
  };

  const handleCreateFutureDemand = (e: React.FormEvent) => {
    e.preventDefault();
    onAddFutureDemand({
      crop: demandCrop,
      variety: demandVariety,
      totalQuantityKg: Number(demandTotalQty),
      expectedProcurementMonth: demandExpectedMonth,
      targetPricePerKg: Number(demandTargetRate),
      deliveryLocation: demandLocation,
      notes: 'Open for pre-sowing cluster agreements with guaranteed farm-gate pickup.',
    });
    setShowDemandModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#E3DCB] p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#26332B] tracking-tight">
              {t.procurement.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#68736B] mt-1 font-medium">
              {t.procurement.subtitle}
            </p>
          </div>

          {/* Action Button based on active tab */}
          <div>
            {activeProcurementTab === 'requirements' && (
              <button
                onClick={() => setShowReqModal(true)}
                className="px-4 py-2.5 rounded-xl bg-[#245C3A] hover:bg-[#1C4B2E] text-white text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <FilePlus className="w-4 h-4" />
                <span>{t.procurement.postRequirementBtn}</span>
              </button>
            )}
            {activeProcurementTab === 'priceLocks' && (
              <button
                onClick={() => setShowLockModal(true)}
                className="px-4 py-2.5 rounded-xl bg-[#245C3A] hover:bg-[#1C4B2E] text-white text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Lock className="w-4 h-4 text-[#D6A63A]" />
                <span>{t.procurement.createPriceLockBtn}</span>
              </button>
            )}
            {activeProcurementTab === 'futureDemand' && (
              <button
                onClick={() => setShowDemandModal(true)}
                className="px-4 py-2.5 rounded-xl bg-[#245C3A] hover:bg-[#1C4B2E] text-white text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#D6A63A]" />
                <span>{t.procurement.postDemandBtn}</span>
              </button>
            )}
          </div>
        </div>

        {/* Procurement Sub-Tabs Bar */}
        <div className="flex items-center gap-2 mt-6 border-b border-[#F0EBE1] overflow-x-auto pb-1">
          <button
            onClick={() => setActiveProcurementTab('requirements')}
            className={`px-3.5 py-2 rounded-t-lg text-xs font-black transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeProcurementTab === 'requirements'
                ? 'text-[#245C3A] border-b-2 border-[#245C3A] bg-[#EEF3E8]/50'
                : 'text-[#68736B] hover:text-[#26332B]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{t.procurement.tabRequirements} ({requirements.length})</span>
          </button>

          <button
            onClick={() => setActiveProcurementTab('priceLocks')}
            className={`px-3.5 py-2 rounded-t-lg text-xs font-black transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeProcurementTab === 'priceLocks'
                ? 'text-[#245C3A] border-b-2 border-[#245C3A] bg-[#EEF3E8]/50'
                : 'text-[#68736B] hover:text-[#26332B]'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{t.procurement.tabPriceLocks} ({priceLocks.length})</span>
          </button>

          <button
            onClick={() => setActiveProcurementTab('futureDemand')}
            className={`px-3.5 py-2 rounded-t-lg text-xs font-black transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeProcurementTab === 'futureDemand'
                ? 'text-[#245C3A] border-b-2 border-[#245C3A] bg-[#EEF3E8]/50'
                : 'text-[#68736B] hover:text-[#26332B]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{t.procurement.tabFutureDemand} ({futureDemands.length})</span>
          </button>

          <button
            onClick={() => setActiveProcurementTab('traceability')}
            className={`px-3.5 py-2 rounded-t-lg text-xs font-black transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeProcurementTab === 'traceability'
                ? 'text-[#245C3A] border-b-2 border-[#245C3A] bg-[#EEF3E8]/50'
                : 'text-[#68736B] hover:text-[#26332B]'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>{t.procurement.tabBatchTraceability}</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Requirements & Reverse Matching & Farmer Pooling (Prompt Sections 26 & 27) */}
      {activeProcurementTab === 'requirements' && (
        <div className="space-y-6">
          {requirements.map((req) => {
            const reqQty = (req as any).requiredQuantityKg ?? (req as any).quantityKg ?? 0;
            const totalPooledQty = req.matchedFarmers?.reduce((acc: number, f: any) => acc + (f.availableQtyKg || f.availableQuantityKg || 0), 0) || 0;
            const isPoolingAvailable = ((req as any).allowFarmerPooling ?? true) && (req.matchedFarmers?.length || 0) > 1 && totalPooledQty >= reqQty;

            return (
              <div key={req.id} className="bg-white rounded-2xl border border-[#E3DCB] p-5 shadow-2xs space-y-4">
                
                {/* Requirement Overview */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F0EBE1]">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-black text-[#26332B]">
                        {req.crop} • {req.variety}
                      </h3>
                      <span className="px-2 py-0.5 rounded-md bg-[#245C3A] text-white text-[10px] font-black">
                        Grade {req.grade}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-[#EEF3E8] text-[#245C3A] text-[10px] font-bold">
                        {req.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-[#68736B] mt-0.5 flex items-center gap-2">
                      <span>Target: <strong>{(reqQty || 0).toLocaleString()} kg</strong> @ ≤ ₹{req.maxPricePerKg || 0}/kg</span>
                      <span>•</span>
                      <span>Delivery: {req.deliveryDate}</span>
                      <span>•</span>
                      <span>📍 {req.preferredLocation}</span>
                    </p>
                  </div>

                  <span className="text-[11px] font-bold text-[#8D9B91]">ID: {req.id}</span>
                </div>

                {/* Farmer Reverse Matching Cluster */}
                {req.matchedFarmers && req.matchedFarmers.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-[#245C3A] flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" />
                        <span>KisanSetu Matching Farmers ({req.matchedFarmers.length})</span>
                      </span>
                      <span className="text-[11px] text-[#68736B]">Ranked by proximity & price match</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {req.matchedFarmers.map((farmer: any, idx: number) => {
                        const farmerAvail = farmer.availableQtyKg ?? farmer.availableQuantityKg ?? 0;
                        const farmerPrice = farmer.offeredPrice ?? farmer.pricePerKg ?? 0;
                        const matchPct = farmer.similarityScore ?? 92;
                        return (
                          <div key={idx} className="p-3.5 rounded-xl bg-[#FBFAF4] border border-[#E3DCB] flex flex-col justify-between gap-2">
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-[#26332B] truncate">{farmer.farmerName}</span>
                                <span className="text-[10px] font-extrabold text-[#245C3A] bg-[#EEF3E8] px-1.5 py-0.5 rounded-sm">
                                  {matchPct}% Match
                                </span>
                              </div>
                              <span className="text-[11px] text-[#68736B] block mt-0.5">📍 {farmer.location} ({farmer.distanceKm || 12} km away)</span>
                              <div className="mt-2 flex items-baseline justify-between">
                                <span className="text-xs font-black text-[#245C3A]">₹{farmerPrice}/kg</span>
                                <span className="text-[11px] font-bold text-[#48534C]">Avail: {(farmerAvail || 0).toLocaleString()} kg</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Farmer Pooling Banner (Prompt Section 27) */}
                    {isPoolingAvailable && (
                      <div className="p-4 rounded-xl bg-[#EEF3E8] border border-[#5F8F45]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-2">
                          <div className="w-8 h-8 rounded-lg bg-[#245C3A] text-white flex items-center justify-center text-sm font-bold shrink-0">
                            🌾
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-[#245C3A]">
                              Farmer Supply Pooling Available ({(totalPooledQty || 0).toLocaleString()} kg Total)
                            </h4>
                            <p className="text-[11px] text-[#48534C] mt-0.5">
                              {t.procurement.farmerPoolingNotice}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            onApprovePooledOrder?.(req.id);
                            alert(`Pooled order of ${reqQty} kg approved across ${req.matchedFarmers?.length} farmers via KisanSetu Mandi Escrow!`);
                          }}
                          className="px-4 py-2 rounded-xl bg-[#245C3A] hover:bg-[#1C4B2E] text-white text-xs font-black transition-all flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{t.procurement.approvePoolBtn}</span>
                        </button>
                      </div>
                    )}

                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Price Locks (Prompt Section 28) */}
      {activeProcurementTab === 'priceLocks' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {priceLocks.map((lock: any) => (
              <div key={lock.id} className="bg-white rounded-2xl border border-[#E3DCB] p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#F0EBE1]">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#D6A63A]" />
                    <span className="text-sm font-black text-[#26332B]">{lock.crop} ({lock.variety})</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                    lock.status === 'locked' || lock.status === 'Accepted by Farmer' ? 'bg-[#EEF3E8] text-[#245C3A]' : 'bg-[#FAF7F0] text-[#9E6D14]'
                  }`}>
                    {(lock.status || 'Active Lock').toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[#68736B] block">Farmer:</span>
                    <strong className="text-[#26332B]">{lock.farmerName}</strong>
                  </div>
                  <div>
                    <span className="text-[#68736B] block">Locked Rate:</span>
                    <strong className="text-[#245C3A] text-sm">₹{lock.agreedPricePerKg || lock.lockedPricePerKg || 0}/kg</strong>
                  </div>
                  <div>
                    <span className="text-[#68736B] block">Quantity:</span>
                    <strong className="text-[#26332B]">{(lock.quantityKg || 0).toLocaleString()} kg</strong>
                  </div>
                  <div>
                    <span className="text-[#68736B] block">Valid / Delivery:</span>
                    <strong className="text-[#26332B]">{lock.validTill || lock.expectedDeliveryDate || lock.harvestWindow || 'Harvest 2026'}</strong>
                  </div>
                </div>

                <p className="text-[11px] text-[#738378] bg-[#FBFAF4] p-2 rounded-lg border border-[#EBE5D8]">
                  {lock.terms || lock.notes || 'Secured through KisanSetu forward contract framework.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Future Demand (Prompt Section 29) */}
      {activeProcurementTab === 'futureDemand' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#EEF3E8] border border-[#5F8F45]/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌱</span>
              <div>
                <h4 className="text-xs font-black text-[#245C3A]">KisanSetu Forward Crop Sowing Demand</h4>
                <p className="text-[11px] text-[#48534C]">{t.procurement.futureDemandNotice}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {futureDemands.map((demand: any) => {
              const demandQty = demand.totalQuantityKg ?? demand.expectedQuantityKg ?? 0;
              const responses = demand.responsesCount ?? demand.farmerInterestsCount ?? 0;
              return (
                <div key={demand.id} className="bg-white rounded-2xl border border-[#E3DCB] p-5 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#F0EBE1]">
                    <h4 className="text-sm font-black text-[#26332B]">{demand.crop} - {demand.variety}</h4>
                    <span className="text-xs font-bold text-[#245C3A] bg-[#EEF3E8] px-2 py-0.5 rounded-full">
                      {responses} Farmer Responses
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[#68736B] block">Expected Season:</span>
                      <strong className="text-[#26332B]">{demand.expectedProcurementMonth || demand.expectedSeason || 'Upcoming Season'}</strong>
                    </div>
                    <div>
                      <span className="text-[#68736B] block">Target Quantity:</span>
                      <strong className="text-[#26332B]">{(demandQty || 0).toLocaleString()} kg</strong>
                    </div>
                    <div>
                      <span className="text-[#68736B] block">Target Rate:</span>
                      <strong className="text-[#245C3A]">₹{demand.targetPricePerKg || 0}/kg</strong>
                    </div>
                    <div>
                      <span className="text-[#68736B] block">Hub Region:</span>
                      <strong className="text-[#26332B]">{demand.deliveryLocation || demand.preferredRegion || 'North India Hub'}</strong>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#738378] bg-[#FBFAF4] p-2 rounded-lg border border-[#EBE5D8]">
                    {demand.notes || demand.preferredQuality || 'Forward demand post for upcoming agricultural cycle.'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Batch Traceability (Prompt Section 34) */}
      {activeProcurementTab === 'traceability' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {traceabilityBatches.map((batch) => (
              <div key={batch.batchId} className="bg-white rounded-2xl border border-[#E3DCB] p-5 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F0EBE1]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-[#26332B]">{batch.crop} ({batch.variety})</span>
                      <span className="px-2 py-0.5 rounded-md bg-[#245C3A] text-white text-[10px] font-bold">
                        {batch.batchId}
                      </span>
                    </div>
                    <p className="text-xs text-[#68736B] mt-0.5">
                      Farmer: <strong>{batch.farmerName}</strong> • {batch.farmLocation}
                    </p>
                  </div>

                  <button
                    onClick={() => onOpenBatchQR(batch.batchId)}
                    className="px-3 py-1.5 rounded-xl bg-[#FAF7F0] border border-[#E3DCB] hover:bg-[#EEF3E8] text-xs font-bold text-[#245C3A] flex items-center gap-1.5 cursor-pointer self-start"
                  >
                    <QrCode className="w-4 h-4 text-[#245C3A]" />
                    <span>View Batch QR Code</span>
                  </button>
                </div>

                {/* Traceability Timeline */}
                <div className="pt-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#68736B] block mb-3">
                    Farm-to-Fork Verifiable Timeline
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    {batch.timeline.map((step, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-[#FBFAF4] border border-[#EBE5D8] flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#26332B]">{step.stage}</span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#245C3A]" />
                        </div>
                        <div className="mt-2 text-[10px] text-[#68736B]">
                          <span>{step.date}</span>
                          <p className="text-[#738378] mt-0.5">{step.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Post New Requirement Form */}
      {showReqModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl border border-[#E3DCB] shadow-2xl max-w-lg w-full overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE1]">
              <h3 className="text-base font-black text-[#26332B]">Post Bulk Crop Requirement</h3>
              <button onClick={() => setShowReqModal(false)} className="text-xs font-bold text-[#68736B]">✕</button>
            </div>

            <form onSubmit={handleCreateRequirement} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#48534C] block mb-1">Crop</label>
                  <input
                    type="text"
                    value={reqCrop}
                    onChange={(e) => setReqCrop(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FBFAF4] border border-[#D5DDD2] rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-[#48534C] block mb-1">Variety</label>
                  <input
                    type="text"
                    value={reqVariety}
                    onChange={(e) => setReqVariety(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FBFAF4] border border-[#D5DDD2] rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-[#48534C] block mb-1">Quantity (kg)</label>
                  <input
                    type="number"
                    value={reqQty}
                    onChange={(e) => setReqQty(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#FBFAF4] border border-[#D5DDD2] rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-[#48534C] block mb-1">Max Price (₹/kg)</label>
                  <input
                    type="number"
                    value={reqMaxPrice}
                    onChange={(e) => setReqMaxPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#FBFAF4] border border-[#D5DDD2] rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-[#48534C] block mb-1">Grade</label>
                  <select
                    value={reqGrade}
                    onChange={(e) => setReqGrade(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FBFAF4] border border-[#D5DDD2] rounded-xl"
                  >
                    <option value="A+">A+</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#48534C] block mb-1">Preferred Location</label>
                <input
                  type="text"
                  value={reqLocation}
                  onChange={(e) => setReqLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FBFAF4] border border-[#D5DDD2] rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-[#48534C] block mb-1">Required Delivery Date</label>
                <input
                  type="date"
                  value={reqDeliveryDate}
                  onChange={(e) => setReqDeliveryDate(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FBFAF4] border border-[#D5DDD2] rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-[#48534C] block mb-1">Special Packaging / Instructions</label>
                <textarea
                  value={reqNotes}
                  onChange={(e) => setReqNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FBFAF4] border border-[#D5DDD2] rounded-xl h-16"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowReqModal(false)}
                  className="px-4 py-2 rounded-xl bg-white border border-[#D5DDD2] text-[#48534C] font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#245C3A] hover:bg-[#1C4B2E] text-white font-bold"
                >
                  {t.procurement.form.submit}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Propose Price Lock */}
      {showLockModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl border border-[#E3DCB] shadow-2xl max-w-lg w-full overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE1]">
              <h3 className="text-base font-black text-[#26332B]">Propose Forward Price Lock</h3>
              <button onClick={() => setShowLockModal(false)} className="text-xs font-bold text-[#68736B]">✕</button>
            </div>

            <form onSubmit={handleCreatePriceLock} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#48534C] block mb-1">Target Farmer</label>
                <input
                  type="text"
                  value={lockFarmerName}
                  onChange={(e) => setLockFarmerName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FBFAF4] border border-[#D5DDD2] rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#48534C] block mb-1">Crop & Variety</label>
                  <input
                    type="text"
                    value={`${lockCrop} - ${lockVariety}`}
                    onChange={(e) => setLockCrop(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FBFAF4] border border-[#D5DDD2] rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-[#48534C] block mb-1">Locked Rate (₹/kg)</label>
                  <input
                    type="number"
                    value={lockAgreedPrice}
                    onChange={(e) => setLockAgreedPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#FBFAF4] border border-[#D5DDD2] rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#48534C] block mb-1">Quantity (kg)</label>
                  <input
                    type="number"
                    value={lockQty}
                    onChange={(e) => setLockQty(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#FBFAF4] border border-[#D5DDD2] rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-[#48534C] block mb-1">Valid Until Date</label>
                  <input
                    type="date"
                    value={lockValidTill}
                    onChange={(e) => setLockValidTill(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FBFAF4] border border-[#D5DDD2] rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowLockModal(false)}
                  className="px-4 py-2 rounded-xl bg-white border border-[#D5DDD2] text-[#48534C] font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#245C3A] hover:bg-[#1C4B2E] text-white font-bold"
                >
                  Send Price Lock Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Share Future Demand */}
      {showDemandModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl border border-[#E3DCB] shadow-2xl max-w-lg w-full overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE1]">
              <h3 className="text-base font-black text-[#26332B]">Share Future Sowing Demand</h3>
              <button onClick={() => setShowDemandModal(false)} className="text-xs font-bold text-[#68736B]">✕</button>
            </div>

            <form onSubmit={handleCreateFutureDemand} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#48534C] block mb-1">Crop</label>
                  <input
                    type="text"
                    value={demandCrop}
                    onChange={(e) => setDemandCrop(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FBFAF4] border border-[#D5DDD2] rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-[#48534C] block mb-1">Variety</label>
                  <input
                    type="text"
                    value={demandVariety}
                    onChange={(e) => setDemandVariety(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FBFAF4] border border-[#D5DDD2] rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#48534C] block mb-1">Target Quantity (kg)</label>
                  <input
                    type="number"
                    value={demandTotalQty}
                    onChange={(e) => setDemandTotalQty(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#FBFAF4] border border-[#D5DDD2] rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-[#48534C] block mb-1">Expected Sowing Month</label>
                  <input
                    type="text"
                    value={demandExpectedMonth}
                    onChange={(e) => setDemandExpectedMonth(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FBFAF4] border border-[#D5DDD2] rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDemandModal(false)}
                  className="px-4 py-2 rounded-xl bg-white border border-[#D5DDD2] text-[#48534C] font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#245C3A] hover:bg-[#1C4B2E] text-white font-bold"
                >
                  Publish Demand to Farmers
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
