import React from 'react';
import {
  X,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Calendar,
  Factory,
  ArrowRight,
  Layers,
  Sparkles,
  Download,
} from 'lucide-react';
import { ProcessingRecord } from '../../types/processing';
import { LanguageCode } from '../../types';

interface ProcessingTraceabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: ProcessingRecord | null;
  currentLanguage: LanguageCode;
}

export const ProcessingTraceabilityModal: React.FC<ProcessingTraceabilityModalProps> = ({
  isOpen,
  onClose,
  record,
  currentLanguage,
}) => {
  if (!isOpen || !record) return null;

  const isHi = currentLanguage === 'hi';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl border border-[#EEF3E8] shadow-2xl max-w-lg w-full overflow-hidden p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#EEF3E8]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#245C3A] text-white flex items-center justify-center">
              <QrCode className="w-4 h-4 text-[#E6C65B]" />
            </div>
            <div>
              <h3 className="text-base font-bold font-serif text-[#26332B]">
                {isHi ? 'प्रसंस्करण बैच ट्रैसेबिलिटी' : 'Farm-to-Fork Batch Traceability'}
              </h3>
              <span className="text-[10px] text-[#5F8F45] font-black uppercase tracking-wider">
                SIH2026193 Authenticated
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#EEF3E8] flex items-center justify-center text-[#68736B] hover:text-[#26332B] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* QR Code Block */}
        <div className="flex flex-col items-center justify-center p-5 bg-[#FAF7F0] rounded-2xl border border-[#EEF3E8] text-center">
          <div className="p-3 bg-white rounded-xl shadow-xs border border-[#D5DDD2]">
            <svg viewBox="0 0 100 100" className="w-32 h-32">
              <rect width="100" height="100" fill="#ffffff" />
              <rect x="5" y="5" width="26" height="26" fill="#245C3A" rx="4" />
              <rect x="9" y="9" width="18" height="18" fill="#ffffff" rx="2" />
              <rect x="13" y="13" width="10" height="10" fill="#245C3A" rx="1" />
              <rect x="69" y="5" width="26" height="26" fill="#245C3A" rx="4" />
              <rect x="73" y="9" width="18" height="18" fill="#ffffff" rx="2" />
              <rect x="77" y="13" width="10" height="10" fill="#245C3A" rx="1" />
              <rect x="5" y="69" width="26" height="26" fill="#245C3A" rx="4" />
              <rect x="9" y="73" width="18" height="18" fill="#ffffff" rx="2" />
              <rect x="13" y="77" width="10" height="10" fill="#245C3A" rx="1" />
              <rect x="36" y="8" width="6" height="6" fill="#245C3A" />
              <rect x="46" y="8" width="6" height="12" fill="#245C3A" />
              <rect x="56" y="8" width="6" height="6" fill="#245C3A" />
              <rect x="36" y="24" width="16" height="6" fill="#245C3A" />
              <rect x="8" y="36" width="14" height="6" fill="#245C3A" />
              <rect x="28" y="36" width="6" height="14" fill="#245C3A" />
              <rect x="40" y="36" width="10" height="10" fill="#245C3A" />
              <rect x="56" y="36" width="14" height="6" fill="#245C3A" />
              <rect x="76" y="36" width="16" height="6" fill="#245C3A" />
              <rect x="8" y="48" width="6" height="14" fill="#245C3A" />
              <rect x="20" y="54" width="14" height="6" fill="#245C3A" />
              <rect x="40" y="52" width="12" height="12" fill="#D6A63A" />
              <rect x="58" y="48" width="8" height="14" fill="#245C3A" />
              <rect x="72" y="48" width="6" height="18" fill="#245C3A" />
              <rect x="84" y="54" width="8" height="12" fill="#245C3A" />
              <rect x="36" y="70" width="12" height="6" fill="#245C3A" />
              <rect x="54" y="68" width="16" height="8" fill="#245C3A" />
              <rect x="76" y="74" width="16" height="6" fill="#245C3A" />
              <rect x="36" y="82" width="6" height="10" fill="#245C3A" />
              <rect x="48" y="82" width="14" height="10" fill="#245C3A" />
              <rect x="68" y="86" width="24" height="6" fill="#245C3A" />
            </svg>
          </div>
          <span className="font-mono text-xs font-black text-[#245C3A] mt-2.5">
            {record.processedBatchId}
          </span>
          <span className="text-[10px] text-[#68736B]">
            Cryptographically anchored to Farmer ID: {record.farmerId}
          </span>
        </div>

        {/* Traceability Journey Chain */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-[#245C3A] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Produce Journey & Lineage</span>
          </h4>

          {/* Step 1: Raw Harvest Lot */}
          <div className="p-3.5 rounded-2xl bg-[#FBFAF4] border border-[#EEF3E8] relative pl-8">
            <div className="absolute left-3 top-4 w-2.5 h-2.5 rounded-full bg-[#5F8F45]" />
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#26332B]">1. Farm Harvest Origin</span>
              <span className="font-mono text-[10px] text-[#5F8F45] bg-[#EEF3E8] px-2 py-0.5 rounded-sm">
                {record.sourceBatchId}
              </span>
            </div>
            <p className="text-xs text-[#68736B] mt-0.5">
              {record.sourceCropName} ({record.sourceCropVariety || 'Standard'}) • {record.farmerName}
            </p>
            <p className="text-[11px] text-[#8D9B91]">
              Lot Allocated for Processing: <strong>{record.inputQuantityKg} kg</strong>
            </p>
          </div>

          {/* Step 2: Processing Transformation */}
          <div className="p-3.5 rounded-2xl bg-[#FBFAF4] border border-[#EEF3E8] relative pl-8">
            <div className="absolute left-3 top-4 w-2.5 h-2.5 rounded-full bg-[#D6A63A]" />
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#26332B]">2. Value Addition Processing</span>
              <span className="text-[10px] font-bold text-[#8C6212] bg-[#D6A63A]/20 px-2 py-0.5 rounded-sm">
                {record.processingYieldPercent}% Yield
              </span>
            </div>
            <p className="text-xs text-[#245C3A] font-semibold mt-0.5">
              {record.processingTypeName}
            </p>
            <p className="text-[11px] text-[#68736B]">
              Facility: {record.partnerFacilityName || 'On-Farm Processing Facility'}
            </p>
            <p className="text-[11px] text-[#8D9B91]">
              Input: {record.inputQuantityKg} kg → Output: {record.outputQuantityKg} kg (Loss: {record.processingLossKg} kg)
            </p>
          </div>

          {/* Step 3: Finished Value-Added Commodity */}
          <div className="p-3.5 rounded-2xl bg-[#EEF3E8] border border-[#5F8F45]/30 relative pl-8">
            <div className="absolute left-3 top-4 w-2.5 h-2.5 rounded-full bg-[#245C3A]" />
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#245C3A]">3. Processed Market Lot</span>
              <span className="text-[10px] font-black text-white bg-[#245C3A] px-2 py-0.5 rounded-sm">
                Grade {record.processedProductGrade || 'A+'}
              </span>
            </div>
            <p className="text-xs font-bold text-[#26332B] mt-0.5">
              {record.processedProductName}
            </p>
            <p className="text-[11px] text-[#68736B]">
              Packaging: {record.packagingType || 'Direct Food-Grade Bags'}
            </p>
            <p className="text-[11px] text-[#245C3A] font-bold">
              Available Stock: {record.availableProcessedQuantityKg} kg @ ₹{record.targetSellingPricePerKg}/kg
            </p>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-[#245C3A] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
        >
          Close
        </button>
      </div>
    </div>
  );
};
