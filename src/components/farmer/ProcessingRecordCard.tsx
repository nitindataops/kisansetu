import React from 'react';
import {
  Factory,
  CheckCircle2,
  Clock,
  Sparkles,
  QrCode,
  ArrowRight,
  TrendingUp,
  Package,
  Layers,
  ShoppingBag,
} from 'lucide-react';
import { ProcessingRecord, ProcessingStage } from '../../types/processing';
import { LanguageCode } from '../../types';
import { getProcessingTranslations } from '../../data/processingTranslations';

interface ProcessingRecordCardProps {
  record: ProcessingRecord;
  currentLanguage: LanguageCode;
  onMarkCompleted: (recordId: string) => void;
  onPublishToMarketplace: (record: ProcessingRecord) => void;
  onViewTraceability: (record: ProcessingRecord) => void;
}

export const ProcessingRecordCard: React.FC<ProcessingRecordCardProps> = ({
  record,
  currentLanguage,
  onMarkCompleted,
  onPublishToMarketplace,
  onViewTraceability,
}) => {
  const t = getProcessingTranslations(currentLanguage);
  const isHi = currentLanguage === 'hi';

  const isInProgress = record.status === 'PROCESSING_IN_PROGRESS';
  const isAvailable = record.status === 'PROCESSED_AVAILABLE';
  const isSold = record.status === 'SOLD';

  return (
    <div className="bg-white rounded-3xl border border-[#EEF3E8] hover:border-[#5F8F45]/40 transition-all p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
      <div>
        {/* Top Badges */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider flex items-center gap-1 ${
                isInProgress
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : isAvailable
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-slate-100 text-slate-800'
              }`}
            >
              {isInProgress && <Clock className="w-3 h-3 text-amber-700" />}
              {isAvailable && <CheckCircle2 className="w-3 h-3 text-emerald-700" />}
              <span>{t.stages[record.status] || record.status}</span>
            </span>

            {record.isPublishedToMarketplace ? (
              <span className="px-2 py-0.5 rounded-full bg-[#5F8F45]/15 text-[#245C3A] text-[10px] font-extrabold flex items-center gap-1">
                <ShoppingBag className="w-3 h-3" />
                <span>Live in Marketplace</span>
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium">
                Not Listed
              </span>
            )}
          </div>

          <button
            onClick={() => onViewTraceability(record)}
            className="text-[11px] font-bold text-[#245C3A] hover:text-[#1B432B] flex items-center gap-1 cursor-pointer bg-[#EEF3E8] px-2 py-1 rounded-xl transition-colors shrink-0"
            title="View Traceability & QR"
          >
            <QrCode className="w-3.5 h-3.5 text-[#245C3A]" />
            <span className="hidden sm:inline">QR Trace</span>
          </button>
        </div>

        {/* Title & Transformation */}
        <h3 className="text-base font-bold text-[#26332B] mt-1 line-clamp-1">
          {record.processedProductName}
        </h3>
        <p className="text-xs text-[#5F8F45] font-semibold flex items-center gap-1 mt-0.5">
          <span>From raw: {record.sourceCropName}</span>
          <ArrowRight className="w-3 h-3 text-[#68736B]" />
          <span>{record.processingTypeName}</span>
        </p>

        {/* Details Box */}
        <div className="space-y-2 text-xs text-[#68736B] p-3.5 rounded-2xl bg-[#FBFAF4] border border-[#EEF3E8] mt-3">
          <div className="flex justify-between items-center">
            <span>Input → Output:</span>
            <strong className="text-[#26332B]">
              {record.inputQuantityKg} kg → {record.outputQuantityKg} kg
            </strong>
          </div>
          <div className="flex justify-between items-center">
            <span>Yield & Loss:</span>
            <span className="text-[#245C3A] font-bold">
              {record.processingYieldPercent}% Yield ({record.processingLossKg} kg loss)
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>Facility / Method:</span>
            <span className="text-[#26332B] truncate max-w-[200px]" title={record.partnerFacilityName}>
              {record.partnerFacilityName || 'On-Farm Facility'}
            </span>
          </div>
          <div className="flex justify-between items-center pt-1 border-t border-[#EEF3E8]">
            <span className="font-medium text-[#68736B]">Net Value Gain:</span>
            <strong className="text-emerald-700 font-black">
              +₹{(record.estimatedValueAdditionAmount || 0).toLocaleString()}
            </strong>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#68736B] mt-2 px-1">
          <span>Batch: <code className="text-[#245C3A] font-mono">{record.processedBatchId}</code></span>
          <span>Target: <b className="text-[#26332B]">₹{record.targetSellingPricePerKg}/kg</b></span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-1">
        {isInProgress && (
          <button
            onClick={() => onMarkCompleted(record.id)}
            className="flex-1 py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Mark Completed</span>
          </button>
        )}

        {isAvailable && !record.isPublishedToMarketplace && (
          <button
            onClick={() => onPublishToMarketplace(record)}
            className="flex-1 py-2 px-3 rounded-xl bg-[#245C3A] hover:bg-[#1B432B] text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E6C65B]" />
            <span>Publish to Marketplace</span>
          </button>
        )}

        <button
          onClick={() => onViewTraceability(record)}
          className={`py-2 px-3 rounded-xl border border-[#EEF3E8] bg-[#FAF7F0] hover:bg-[#EEF3E8] text-xs font-bold text-[#26332B] transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
            !isInProgress && record.isPublishedToMarketplace ? 'w-full' : ''
          }`}
        >
          <QrCode className="w-3.5 h-3.5 text-[#245C3A]" />
          <span>Traceability Details</span>
        </button>
      </div>
    </div>
  );
};
