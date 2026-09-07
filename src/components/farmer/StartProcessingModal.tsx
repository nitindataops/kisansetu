import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Factory,
  CheckCircle2,
  AlertCircle,
  Scale,
  Package,
  Layers,
  Coins,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { CropListing, StorageFacility, ProcessorOpportunity } from '../../types/farmer';
import { ProcessingRecord, ProcessingTypeOption } from '../../types/processing';
import { LanguageCode } from '../../types';
import { getProcessingTranslations } from '../../data/processingTranslations';
import {
  PROCESSING_TYPE_CONFIGS,
  getProcessingOptionsForCrop,
} from '../../data/processingTypes';

interface StartProcessingModalProps {
  isOpen: boolean;
  onClose: () => void;
  rawCrops: CropListing[];
  partnerMills: ProcessorOpportunity[];
  currentLanguage: LanguageCode;
  farmerId: string;
  farmerName: string;
  initialSelectedCrop?: CropListing | null;
  onSubmit: (recordPayload: Partial<ProcessingRecord>) => Promise<boolean>;
}

export const StartProcessingModal: React.FC<StartProcessingModalProps> = ({
  isOpen,
  onClose,
  rawCrops,
  partnerMills,
  currentLanguage,
  farmerId,
  farmerName,
  initialSelectedCrop,
  onSubmit,
}) => {
  const isHi = currentLanguage === 'hi';
  const t = getProcessingTranslations(currentLanguage);

  // Available raw crops with quantity > 0
  const eligibleCrops = rawCrops.filter(
    (c) =>
      (!c.produceType || c.produceType === 'raw') &&
      Number((c as any).availableQuantityKg !== undefined ? (c as any).availableQuantityKg : c.quantityKg) > 0
  );

  const [selectedCropId, setSelectedCropId] = useState<string>(
    initialSelectedCrop?.id || eligibleCrops[0]?.id || ''
  );
  const [selectedConfigId, setSelectedConfigId] = useState<string>('');
  const [inputQtyKg, setInputQtyKg] = useState<number>(500);
  const [processingMethod, setProcessingMethod] = useState<'self' | 'partner_mill'>('partner_mill');
  const [selectedMillId, setSelectedMillId] = useState<string>(partnerMills[0]?.id || '');
  const [customCostPerKg, setCustomCostPerKg] = useState<number>(3.5);
  const [targetSellingPricePerKg, setTargetSellingPricePerKg] = useState<number>(45);
  const [packagingType, setPackagingType] = useState<string>('Standard 25kg Sacks');
  const [productName, setProductName] = useState<string>('');
  const [productVariety, setProductVariety] = useState<string>('');
  const [productGrade, setProductGrade] = useState<string>('A+');
  const [isImmediatePublish, setIsImmediatePublish] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const selectedCrop = rawCrops.find((c) => c.id === selectedCropId) || eligibleCrops[0];
  const availableOptions: ProcessingTypeOption[] = selectedCrop
    ? getProcessingOptionsForCrop(selectedCrop.name)
    : PROCESSING_TYPE_CONFIGS;

  // Sync state when crop changes
  useEffect(() => {
    if (selectedCrop) {
      const opts = getProcessingOptionsForCrop(selectedCrop.name);
      const defaultOpt = opts[0] || PROCESSING_TYPE_CONFIGS[0];
      setSelectedConfigId(defaultOpt.id);
      setCustomCostPerKg(defaultOpt.typicalProcessingCostPerKg);
      const defaultTargetPrice = Math.round(Number(selectedCrop.expectedPrice || 25) * 1.5);
      setTargetSellingPricePerKg(defaultTargetPrice);
      setPackagingType(isHi ? defaultOpt.packagingOptionsHi[0] : defaultOpt.packagingOptionsEn[0]);
      setProductName(isHi ? defaultOpt.targetProductNameHi : defaultOpt.targetProductNameEn);
      setProductVariety(selectedCrop.variety || 'Refined Pure');
      setProductGrade(defaultOpt.recommendedGrade || 'A+');

      const maxAvail = Number(
        (selectedCrop as any).availableQuantityKg !== undefined
          ? (selectedCrop as any).availableQuantityKg
          : selectedCrop.quantityKg
      );
      setInputQtyKg(Math.min(500, maxAvail > 0 ? maxAvail : 100));
    }
  }, [selectedCropId, isHi]);

  // When processing config changes
  const handleConfigChange = (cfgId: string) => {
    setSelectedConfigId(cfgId);
    const cfg = PROCESSING_TYPE_CONFIGS.find((c) => c.id === cfgId);
    if (cfg && selectedCrop) {
      setCustomCostPerKg(cfg.typicalProcessingCostPerKg);
      setPackagingType(isHi ? cfg.packagingOptionsHi[0] : cfg.packagingOptionsEn[0]);
      setProductName(isHi ? cfg.targetProductNameHi : cfg.targetProductNameEn);
      setProductGrade(cfg.recommendedGrade || 'A+');
      const defaultTargetPrice = Math.round(Number(selectedCrop.expectedPrice || 25) * (100 / cfg.typicalYieldPercent) * 1.2);
      setTargetSellingPricePerKg(defaultTargetPrice);
    }
  };

  const currentConfig: ProcessingTypeOption =
    PROCESSING_TYPE_CONFIGS.find((c) => c.id === selectedConfigId) ||
    availableOptions[0] ||
    PROCESSING_TYPE_CONFIGS[0];

  const yieldPercent = currentConfig?.typicalYieldPercent || 75;
  const outputQtyKg = Math.round((inputQtyKg * yieldPercent) / 100);
  const lossKg = Math.max(0, inputQtyKg - outputQtyKg);

  const rawCropPrice = Number(selectedCrop?.expectedPrice || 25);
  const rawTotalValue = inputQtyKg * rawCropPrice;
  const processingCostTotal = Math.round(inputQtyKg * customCostPerKg);
  const grossProcessedRevenue = Math.round(outputQtyKg * targetSellingPricePerKg);
  const netValueGain = grossProcessedRevenue - (rawTotalValue + processingCostTotal);

  if (!isOpen) return null;

  const maxInputAvailable = Number(
    (selectedCrop as any)?.availableQuantityKg !== undefined
      ? (selectedCrop as any)?.availableQuantityKg
      : selectedCrop?.quantityKg || 0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!selectedCrop) {
      setErrorMessage('Please select a valid raw crop from your inventory.');
      return;
    }

    if (inputQtyKg <= 0) {
      setErrorMessage('Input quantity must be greater than 0 kg.');
      return;
    }

    if (inputQtyKg > maxInputAvailable) {
      setErrorMessage(`Cannot exceed available stock of ${maxInputAvailable} kg.`);
      return;
    }

    setIsSubmitting(true);

    const partnerFacility = partnerMills.find((m) => m.id === selectedMillId);

    const payload: Partial<ProcessingRecord> = {
      farmerId,
      farmerName,
      sourceCropId: selectedCrop.id,
      sourceCropName: selectedCrop.name,
      sourceCropVariety: selectedCrop.variety,
      processingTypeId: currentConfig.id,
      processingTypeName: isHi ? currentConfig.nameHi : currentConfig.nameEn,
      inputQuantityKg: inputQtyKg,
      outputQuantityKg: outputQtyKg,
      processingLossKg: lossKg,
      processingYieldPercent: yieldPercent,
      rawCropPricePerKg: rawCropPrice,
      processingCostTotal,
      processingCostPerKg: customCostPerKg,
      targetSellingPricePerKg,
      estimatedValueAdditionAmount: netValueGain,
      processingMethod,
      partnerFacilityId: processingMethod === 'partner_mill' ? partnerFacility?.id : undefined,
      partnerFacilityName:
        processingMethod === 'partner_mill'
          ? partnerFacility?.facilityName || 'Regional Agro Processing Unit'
          : 'On-Farm Facility',
      partnerContactPhone: processingMethod === 'partner_mill' ? partnerFacility?.contactPhone : undefined,
      processedProductName: productName || `${selectedCrop.name} Value-Added Product`,
      processedProductVariety: productVariety || 'Refined Pure',
      processedProductGrade: productGrade,
      packagingType,
      status: isImmediatePublish ? 'PROCESSED_AVAILABLE' : 'PROCESSING_IN_PROGRESS',
      isPublishedToMarketplace: isImmediatePublish,
    };

    try {
      const success = await onSubmit(payload);
      if (success) {
        onClose();
      } else {
        setErrorMessage('Failed to save processing record. Please verify inputs.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error creating processing record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-3xl border border-[#EEF3E8] shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-[#EEF3E8] flex items-center justify-between bg-gradient-to-r from-[#FAF7F0] to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#245C3A] text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-[#E6C65B]" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold font-serif text-[#26332B] flex items-center gap-2">
                <span>{t.form.modalTitle}</span>
                <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-[#5F8F45]/15 text-[#245C3A]">
                  SIH2026193
                </span>
              </h3>
              <p className="text-xs text-[#68736B]">{t.form.modalSubtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#EEF3E8] hover:bg-[#E3DCB] flex items-center justify-center text-[#68736B] hover:text-[#26332B] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1">
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs font-bold text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Raw Produce Source */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-[#245C3A] flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                <span>1. {t.form.selectCropLabel}</span>
              </label>
              {selectedCrop && (
                <span className="text-xs font-bold text-[#5F8F45] bg-[#EEF3E8] px-2.5 py-0.5 rounded-full">
                  {t.form.availableRawLabel}: {maxInputAvailable.toLocaleString()} kg
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <select
                  value={selectedCropId}
                  onChange={(e) => setSelectedCropId(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-[#FBFAF4] border border-[#EEF3E8] text-xs font-bold text-[#26332B] focus:outline-none focus:border-[#245C3A]"
                >
                  {eligibleCrops.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.variety || 'Lot'}) — {c.quantityKg} kg avail
                    </option>
                  ))}
                </select>
                {selectedCrop && (
                  <p className="text-[11px] text-[#68736B] mt-1">
                    Source Batch: <span className="font-mono text-[#245C3A]">{selectedCrop.batchId || 'BATCH-2026'}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#68736B] block mb-1">
                  {t.form.inputQtyLabel} (Max {maxInputAvailable} kg)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={10}
                    max={maxInputAvailable}
                    value={inputQtyKg}
                    onChange={(e) => setInputQtyKg(Math.max(1, Number(e.target.value)))}
                    className="w-full p-3 rounded-2xl bg-[#FBFAF4] border border-[#EEF3E8] text-xs font-bold text-[#26332B] focus:outline-none focus:border-[#245C3A]"
                  />
                  <span className="absolute right-3.5 top-3 text-xs font-bold text-[#68736B]">kg</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Value Addition Transformation */}
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-wider text-[#245C3A] flex items-center gap-1.5">
              <Factory className="w-4 h-4" />
              <span>2. {t.form.selectProcessingTypeLabel}</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {availableOptions.map((opt) => {
                const isSelected = selectedConfigId === opt.id;
                const optName = isHi ? opt.nameHi : opt.nameEn;
                const optDesc = isHi ? opt.descriptionHi : opt.descriptionEn;
                return (
                  <div
                    key={opt.id}
                    onClick={() => handleConfigChange(opt.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#EEF3E8] border-[#245C3A] shadow-xs ring-1 ring-[#245C3A]'
                        : 'bg-white border-[#EEF3E8] hover:border-[#5F8F45]/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-xs text-[#26332B]">{optName}</h4>
                        <p className="text-[11px] text-[#68736B] mt-0.5">{optDesc}</p>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#245C3A] shrink-0" />}
                    </div>
                    <div className="flex items-center justify-between text-[11px] mt-2 pt-2 border-t border-[#EEF3E8]/80">
                      <span className="text-[#5F8F45] font-bold">Yield: {opt.typicalYieldPercent}%</span>
                      <span className="text-[#245C3A] font-extrabold">₹{opt.typicalProcessingCostPerKg}/kg fee</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Yield, Output & Processed Product Details */}
          <div className="p-4 rounded-3xl bg-[#FAF7F0] border border-[#EEF3E8] space-y-4">
            <div className="flex items-center justify-between border-b border-[#EEF3E8] pb-2.5">
              <span className="text-xs font-black uppercase tracking-wider text-[#26332B] flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-[#245C3A]" />
                <span>Yield & Quantity Calculations</span>
              </span>
              <span className="text-xs font-black text-[#245C3A]">{yieldPercent}% Recovery</span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-2.5 rounded-2xl bg-white border border-[#EEF3E8]">
                <span className="text-[10px] text-[#68736B] block">Raw Input</span>
                <strong className="text-sm font-black text-[#26332B]">{inputQtyKg} kg</strong>
              </div>
              <div className="p-2.5 rounded-2xl bg-white border border-[#EEF3E8]">
                <span className="text-[10px] text-[#5F8F45] block">Finished Output</span>
                <strong className="text-sm font-black text-[#245C3A]">{outputQtyKg} kg</strong>
              </div>
              <div className="p-2.5 rounded-2xl bg-white border border-[#EEF3E8]">
                <span className="text-[10px] text-[#8C6212] block">Processing Byproduct / Loss</span>
                <strong className="text-sm font-black text-[#8C6212]">{lossKg} kg</strong>
              </div>
            </div>

            {/* Product Meta customization */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[11px] font-bold text-[#68736B] block mb-1">
                  {t.form.productNameLabel}
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#EEF3E8] text-xs font-bold text-[#26332B]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#68736B] block mb-1">
                  {t.form.packagingLabel}
                </label>
                <input
                  type="text"
                  value={packagingType}
                  onChange={(e) => setPackagingType(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#EEF3E8] text-xs font-bold text-[#26332B]"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Processing Method (Self or Partner Mill) */}
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-wider text-[#245C3A] flex items-center gap-1.5">
              <Factory className="w-4 h-4" />
              <span>3. {t.form.processingPartnerLabel}</span>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setProcessingMethod('partner_mill')}
                className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                  processingMethod === 'partner_mill'
                    ? 'bg-[#EEF3E8] border-[#245C3A] ring-1 ring-[#245C3A]'
                    : 'bg-white border-[#EEF3E8]'
                }`}
              >
                <span className="text-xs font-bold text-[#26332B] block">{t.form.partnerMillOption}</span>
                <span className="text-[10px] text-[#68736B]">Certified milling facility with quality testing</span>
              </button>

              <button
                type="button"
                onClick={() => setProcessingMethod('self')}
                className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                  processingMethod === 'self'
                    ? 'bg-[#EEF3E8] border-[#245C3A] ring-1 ring-[#245C3A]'
                    : 'bg-white border-[#EEF3E8]'
                }`}
              >
                <span className="text-xs font-bold text-[#26332B] block">{t.form.selfProcessingOption}</span>
                <span className="text-[10px] text-[#68736B]">Processed in on-farm mini-mill / cold press</span>
              </button>
            </div>

            {processingMethod === 'partner_mill' && partnerMills.length > 0 && (
              <div>
                <label className="text-[11px] font-bold text-[#68736B] block mb-1">
                  {t.form.selectPartnerMillLabel}
                </label>
                <select
                  value={selectedMillId}
                  onChange={(e) => setSelectedMillId(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-[#FBFAF4] border border-[#EEF3E8] text-xs font-bold text-[#26332B]"
                >
                  {partnerMills.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.facilityName} ({m.location}) — ₹{m.processingFeePerKg}/kg fee
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Section 5: Real-Time Value Addition Economics Card */}
          <div className="p-4 rounded-3xl bg-gradient-to-br from-[#245C3A] to-[#1B432B] text-white space-y-3 shadow-md">
            <div className="flex items-center justify-between border-b border-white/15 pb-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#E6C65B] flex items-center gap-1.5">
                <Coins className="w-4 h-4" />
                <span>{t.form.economicsHeading}</span>
              </span>
              <span className="text-[11px] text-white/80">Per Lot Financial Projection</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white/10">
                <span className="text-[10px] text-white/70 block">{t.form.rawValEstimate}</span>
                <span className="font-extrabold text-white text-sm">₹{rawTotalValue.toLocaleString()}</span>
                <span className="text-[9px] text-white/60 block">@ ₹{rawCropPrice}/kg raw</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/10">
                <span className="text-[10px] text-white/70 block">Processing Cost</span>
                <span className="font-extrabold text-white text-sm">₹{processingCostTotal.toLocaleString()}</span>
                <span className="text-[9px] text-white/60 block">@ ₹{customCostPerKg}/kg</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/10">
                <span className="text-[10px] text-white/70 block">{t.form.processedGrossEstimate}</span>
                <span className="font-extrabold text-[#E6C65B] text-sm">₹{grossProcessedRevenue.toLocaleString()}</span>
                <span className="text-[9px] text-white/60 block">@ ₹{targetSellingPricePerKg}/kg target</span>
              </div>
              <div className="p-2.5 rounded-xl bg-green-950/60 border border-green-400/40">
                <span className="text-[10px] text-green-300 font-bold block">{t.form.netValueGainEstimate}</span>
                <span className="font-black text-green-300 text-base">+₹{netValueGain.toLocaleString()}</span>
                <span className="text-[9px] text-green-200 block">Pure Profit Margin</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <div className="flex-1">
                <label className="text-[10px] text-white/80 block mb-0.5">Target Selling Price (₹/kg)</label>
                <input
                  type="number"
                  value={targetSellingPricePerKg}
                  onChange={(e) => setTargetSellingPricePerKg(Math.max(1, Number(e.target.value)))}
                  className="w-full p-2 rounded-lg bg-white/20 text-white font-bold text-xs border border-white/20"
                />
              </div>
              <div className="flex-1">
                <label className="text-[10px] text-white/80 block mb-0.5">Milling Cost (₹/kg input)</label>
                <input
                  type="number"
                  step="0.5"
                  value={customCostPerKg}
                  onChange={(e) => setCustomCostPerKg(Math.max(0, Number(e.target.value)))}
                  className="w-full p-2 rounded-lg bg-white/20 text-white font-bold text-xs border border-white/20"
                />
              </div>
            </div>
          </div>

          {/* Section 6: Marketplace Publishing Checkbox */}
          <div className="p-3.5 rounded-2xl bg-[#FBFAF4] border border-[#EEF3E8] flex items-start gap-3">
            <input
              type="checkbox"
              id="publishToMarketplace"
              checked={isImmediatePublish}
              onChange={(e) => setIsImmediatePublish(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded text-[#245C3A] cursor-pointer"
            />
            <label htmlFor="publishToMarketplace" className="text-xs text-[#26332B] font-medium cursor-pointer">
              <span className="font-bold block">{t.form.publishCheckboxLabel}</span>
              <span className="text-[11px] text-[#68736B]">
                Creates a verified listing in the Buyer Marketplace immediately with batch QR traceability.
              </span>
            </label>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-[#EEF3E8] bg-[#FAF7F0] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl border border-[#EEF3E8] bg-white text-xs font-bold text-[#68736B] hover:text-[#26332B] cursor-pointer"
          >
            {t.form.cancelBtn}
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedCrop}
            className="px-6 py-2.5 rounded-xl bg-[#245C3A] hover:bg-[#1B432B] text-white text-xs font-black shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Saving...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#E6C65B]" />
                <span>{t.form.submitBtn}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
