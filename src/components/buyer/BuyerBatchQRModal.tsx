import React from 'react';
import { X, QrCode, ShieldCheck, CheckCircle2, MapPin, Calendar, ExternalLink } from 'lucide-react';
import { BatchTraceabilityInfo } from '../../types/buyer';
import { LanguageCode } from '../../types';

interface BuyerBatchQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  batchId: string | null;
  batchInfo?: BatchTraceabilityInfo;
}

export const BuyerBatchQRModal: React.FC<BuyerBatchQRModalProps> = ({
  isOpen,
  onClose,
  batchId,
  batchInfo,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl border border-[#E3DCB] shadow-2xl max-w-md w-full overflow-hidden p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE1]">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-[#245C3A]" />
            <h3 className="text-base font-black text-[#26332B]">KisanSetu Batch Traceability</h3>
          </div>
          <button onClick={onClose} className="text-xs font-bold text-[#68736B] p-1">✕</button>
        </div>

        {/* QR Code Display Frame */}
        <div className="flex flex-col items-center justify-center p-6 bg-[#FAF7F0] rounded-2xl border border-[#E3DCB]">
          <div className="p-3 bg-white rounded-xl shadow-xs border border-[#D5DDD2]">
            {/* SVG Simulated QR Code */}
            <svg viewBox="0 0 100 100" className="w-36 h-36">
              <rect width="100" height="100" fill="#ffffff" />
              {/* Corner 1 */}
              <rect x="5" y="5" width="26" height="26" fill="#245C3A" rx="4" />
              <rect x="9" y="9" width="18" height="18" fill="#ffffff" rx="2" />
              <rect x="13" y="13" width="10" height="10" fill="#245C3A" rx="1" />
              {/* Corner 2 */}
              <rect x="69" y="5" width="26" height="26" fill="#245C3A" rx="4" />
              <rect x="73" y="9" width="18" height="18" fill="#ffffff" rx="2" />
              <rect x="77" y="13" width="10" height="10" fill="#245C3A" rx="1" />
              {/* Corner 3 */}
              <rect x="5" y="69" width="26" height="26" fill="#245C3A" rx="4" />
              <rect x="9" y="73" width="18" height="18" fill="#ffffff" rx="2" />
              <rect x="13" y="77" width="10" height="10" fill="#245C3A" rx="1" />
              {/* Data points */}
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

          <span className="font-mono text-xs font-black text-[#245C3A] mt-3">
            {batchId || 'BATCH-2026-WHT-089'}
          </span>
          <span className="text-[10px] text-[#68736B] mt-0.5">
            Scan with any phone camera to verify farm origin
          </span>
        </div>

        {/* Batch Quick Details */}
        <div className="p-3.5 rounded-2xl bg-[#FBFAF4] border border-[#E3DCB] space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-[#68736B]">Crop & Variety:</span>
            <strong className="text-[#26332B]">{batchInfo?.crop || 'Wheat'} ({batchInfo?.variety || 'Sharbati'})</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-[#68736B]">Farmer Origin:</span>
            <strong className="text-[#245C3A]">{batchInfo?.farmerName || 'Harpreet Singh'}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-[#68736B]">Farm Location:</span>
            <strong className="text-[#26332B]">{batchInfo?.farmLocation || 'Bareilly, Uttar Pradesh'}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-[#68736B]">Harvest Date:</span>
            <strong className="text-[#26332B]">{batchInfo?.harvestDate || '2026-08-28'}</strong>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-[#245C3A] text-white text-xs font-bold transition-colors cursor-pointer"
        >
          Done
        </button>

      </div>
    </div>
  );
};
