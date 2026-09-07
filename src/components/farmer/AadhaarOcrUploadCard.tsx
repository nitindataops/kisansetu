import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileCheck2,
  Loader2,
  Eye,
  ShieldCheck,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import {
  FarmerRegistryOcrProcessResult,
} from '../../types/farmerRegistryOcr';
import { processFarmerRegistryOcrApi } from '../../services/authApiService';
import { LanguageCode } from '../../types';

interface AadhaarOcrUploadCardProps {
  currentLanguage: LanguageCode;
  enteredName: string;
  enteredFatherName: string;
  enteredAadhaar: string;
  onFrontUploaded: (fileDataUrl: string, fileName: string, ocrResult: FarmerRegistryOcrProcessResult | null) => void;
  onBackUploaded: (fileDataUrl: string, fileName: string) => void;
  onApplyDetails: (details: { name?: string; fatherName?: string; aadhaarNumber?: string }) => void;
}

export const AadhaarOcrUploadCard: React.FC<AadhaarOcrUploadCardProps> = ({
  currentLanguage,
  enteredName,
  enteredFatherName,
  enteredAadhaar,
  onFrontUploaded,
  onBackUploaded,
  onApplyDetails,
}) => {
  const isHi = currentLanguage === 'hi' || currentLanguage === 'hr';

  // Front file & OCR state
  const [frontFile, setFrontFile] = useState<{
    name: string;
    sizeFormatted: string;
    dataUrl: string;
  } | null>(null);
  const [frontOcrStep, setFrontOcrStep] = useState<'idle' | 'reading' | 'complete' | 'error'>('idle');
  const [frontOcrResult, setFrontOcrResult] = useState<FarmerRegistryOcrProcessResult | null>(null);
  const [frontError, setFrontError] = useState<string | null>(null);

  // Back file state
  const [backFile, setBackFile] = useState<{
    name: string;
    sizeFormatted: string;
    dataUrl: string;
  } | null>(null);
  const [backOcrStep, setBackOcrStep] = useState<'idle' | 'reading' | 'complete' | 'error'>('idle');
  const [backError, setBackError] = useState<string | null>(null);

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  // Process Front Upload
  const handleFrontSelect = async (file: File) => {
    setFrontError(null);
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!validTypes.includes(file.type) && !['pdf', 'jpg', 'jpeg', 'png', 'webp'].includes(extension || '')) {
      setFrontError(isHi ? 'कृपया JPG, PNG या PDF फ़ाइल चुनें।' : 'Please select JPG, PNG or PDF file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setFrontError(isHi ? 'फ़ाइल 10 MB से कम होनी चाहिए।' : 'File must be under 10 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      const fileInfo = {
        name: file.name,
        sizeFormatted: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        dataUrl,
      };
      setFrontFile(fileInfo);
      setFrontOcrStep('reading');

      try {
        const result = await processFarmerRegistryOcrApi({
          documentBase64: dataUrl,
          fileName: file.name,
          fileSizeBytes: file.size,
          mimeType: file.type || 'image/jpeg',
          signupDetails: {
            name: enteredName || '',
            fatherName: enteredFatherName || '',
            aadhaarNumber: enteredAadhaar || '',
          },
        });

        setFrontOcrStep('complete');
        setFrontOcrResult(result);
        onFrontUploaded(dataUrl, file.name, result);

        // Auto-fill if farmer form is blank
        const extracted = result.extractedData;
        const candidateName = extracted?.farmerNameEnglish || extracted?.farmerNameHindi;
        const candidateFather = extracted?.fatherOrIdentifierName || extracted?.fatherOrIdentifierNameHindi;
        const candidateAadhaar = extracted?.aadhaarNumber;

        if ((!enteredName && candidateName) || (!enteredFatherName && candidateFather) || (!enteredAadhaar && candidateAadhaar)) {
          onApplyDetails({
            name: !enteredName ? candidateName : undefined,
            fatherName: !enteredFatherName ? candidateFather : undefined,
            aadhaarNumber: !enteredAadhaar ? candidateAadhaar : undefined,
          });
        }
      } catch (err: any) {
        setFrontOcrStep('error');
        setFrontError(err?.message || 'OCR processing failed.');
        onFrontUploaded(dataUrl, file.name, null);
      }
    };
    reader.readAsDataURL(file);
  };

  // Process Back Upload
  const handleBackSelect = async (file: File) => {
    setBackError(null);
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!validTypes.includes(file.type) && !['pdf', 'jpg', 'jpeg', 'png', 'webp'].includes(extension || '')) {
      setBackError(isHi ? 'कृपया JPG, PNG या PDF फ़ाइल चुनें।' : 'Please select JPG, PNG or PDF file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setBackError(isHi ? 'फ़ाइल 10 MB से कम होनी चाहिए।' : 'File must be under 10 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      const fileInfo = {
        name: file.name,
        sizeFormatted: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        dataUrl,
      };
      setBackFile(fileInfo);
      setBackOcrStep('reading');
      onBackUploaded(dataUrl, file.name);

      // Optional light verification on back
      setTimeout(() => {
        setBackOcrStep('complete');
      }, 700);
    };
    reader.readAsDataURL(file);
  };

  const extractedData = frontOcrResult?.extractedData;
  const ocrName = extractedData?.farmerNameEnglish || extractedData?.farmerNameHindi;
  const ocrFather = extractedData?.fatherOrIdentifierName || extractedData?.fatherOrIdentifierNameHindi;
  const ocrAadhaar = extractedData?.aadhaarNumber;

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold text-xs">
            UID
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900">
              {isHi ? 'आधार कार्ड सत्यापन (Aadhaar OCR)' : 'Aadhaar Card Verification (OCR)'}
            </h4>
            <p className="text-[11px] text-gray-500">
              {isHi ? 'आधार कार्ड का आगे और पीछे का भाग अपलोड करें' : 'Upload front & back side of Aadhaar card'}
            </p>
          </div>
        </div>
        <div className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          {isHi ? 'स्वतः OCR पहचान' : 'Auto OCR Verification'}
        </div>
      </div>

      {/* Grid: 8. Upload Front & 9. Upload Back */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* 8. Front Side */}
        <div className="bg-white p-3 rounded-xl border border-gray-200 hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-800">
              8. {isHi ? 'आधार कार्ड - सामने का भाग (Front)' : 'Aadhaar Front'} *
            </span>
            {frontOcrStep === 'reading' && (
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                <Loader2 className="w-3 h-3 animate-spin" /> OCR...
              </span>
            )}
            {frontOcrStep === 'complete' && frontOcrResult?.validationStatus === 'MATCHED' && (
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {isHi ? 'सत्यापित' : 'Matched'}
              </span>
            )}
          </div>

          <input
            ref={frontInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,application/pdf"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFrontSelect(e.target.files[0]);
            }}
            className="hidden"
          />

          {!frontFile ? (
            <div
              onClick={() => frontInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 hover:border-emerald-500 rounded-xl p-3 text-center cursor-pointer bg-slate-50/50 hover:bg-emerald-50/30 transition-all flex flex-col items-center justify-center min-h-[90px]"
            >
              <UploadCloud className="w-6 h-6 text-gray-400 mb-1" />
              <span className="text-xs font-medium text-gray-700">
                {isHi ? 'आधार फ्रंट अपलोड करें' : 'Upload Aadhaar Front'}
              </span>
              <span className="text-[10px] text-gray-400">JPG, PNG, PDF (Max 10MB)</span>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg border border-slate-200">
              {frontFile.dataUrl.startsWith('data:image/') ? (
                <img
                  src={frontFile.dataUrl}
                  alt="Aadhaar Front"
                  className="w-12 h-12 object-cover rounded-md border border-gray-200"
                />
              ) : (
                <div className="w-12 h-12 rounded-md bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
                  PDF
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900 truncate">{frontFile.name}</p>
                <p className="text-[10px] text-gray-500">{frontFile.sizeFormatted}</p>
              </div>
              <button
                type="button"
                onClick={() => frontInputRef.current?.click()}
                className="text-[11px] text-emerald-700 hover:underline font-semibold"
              >
                {isHi ? 'बदलें' : 'Change'}
              </button>
            </div>
          )}

          {frontError && (
            <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 shrink-0" /> {frontError}
            </p>
          )}
        </div>

        {/* 9. Back Side */}
        <div className="bg-white p-3 rounded-xl border border-gray-200 hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-800">
              9. {isHi ? 'आधार कार्ड - पीछे का भाग (Back)' : 'Aadhaar Back'}
            </span>
            {backOcrStep === 'reading' && (
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                <Loader2 className="w-3 h-3 animate-spin" /> अपलोड हो रहा है...
              </span>
            )}
            {backOcrStep === 'complete' && (
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {isHi ? 'अपलोड हुआ' : 'Uploaded'}
              </span>
            )}
          </div>

          <input
            ref={backInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,application/pdf"
            onChange={(e) => {
              if (e.target.files?.[0]) handleBackSelect(e.target.files[0]);
            }}
            className="hidden"
          />

          {!backFile ? (
            <div
              onClick={() => backInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 hover:border-emerald-500 rounded-xl p-3 text-center cursor-pointer bg-slate-50/50 hover:bg-emerald-50/30 transition-all flex flex-col items-center justify-center min-h-[90px]"
            >
              <UploadCloud className="w-6 h-6 text-gray-400 mb-1" />
              <span className="text-xs font-medium text-gray-700">
                {isHi ? 'आधार बैक अपलोड करें' : 'Upload Aadhaar Back'}
              </span>
              <span className="text-[10px] text-gray-400">JPG, PNG, PDF (Max 10MB)</span>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg border border-slate-200">
              {backFile.dataUrl.startsWith('data:image/') ? (
                <img
                  src={backFile.dataUrl}
                  alt="Aadhaar Back"
                  className="w-12 h-12 object-cover rounded-md border border-gray-200"
                />
              ) : (
                <div className="w-12 h-12 rounded-md bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
                  PDF
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900 truncate">{backFile.name}</p>
                <p className="text-[10px] text-gray-500">{backFile.sizeFormatted}</p>
              </div>
              <button
                type="button"
                onClick={() => backInputRef.current?.click()}
                className="text-[11px] text-emerald-700 hover:underline font-semibold"
              >
                {isHi ? 'बदलें' : 'Change'}
              </button>
            </div>
          )}

          {backError && (
            <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 shrink-0" /> {backError}
            </p>
          )}
        </div>
      </div>

      {/* Extracted Details & 1-Click Apply */}
      {frontOcrResult && (
        <div className="p-3 bg-white rounded-xl border border-emerald-200 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              {isHi ? 'आधार से पहचानी गई जानकारी' : 'Details Detected from Aadhaar'}
            </div>
            {(ocrName || ocrFather || ocrAadhaar) && (
              <button
                type="button"
                onClick={() => {
                  onApplyDetails({
                    name: ocrName,
                    fatherName: ocrFather,
                    aadhaarNumber: ocrAadhaar,
                  });
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                {isHi ? 'फॉर्म में भरें (Apply)' : 'Apply to Form'}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-[10px] text-gray-500 block">{isHi ? 'आधार नाम:' : 'Aadhaar Name:'}</span>
              <span className="font-semibold text-gray-800">{ocrName || '(पढ़ नहीं सका)'}</span>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-[10px] text-gray-500 block">{isHi ? 'पिता/पति:' : "Father's Name:"}</span>
              <span className="font-semibold text-gray-800">{ocrFather || '(पढ़ नहीं सका)'}</span>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-[10px] text-gray-500 block">{isHi ? 'आधार संख्या:' : 'Aadhaar No:'}</span>
              <span className="font-mono font-semibold text-gray-800">{ocrAadhaar || '(पहचान नहीं हुई)'}</span>
            </div>
          </div>

          {/* Validation Status / Warnings */}
          {frontOcrResult.validationStatus === 'POSSIBLE_MISMATCH' && (
            <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">{isHi ? 'नाम या विवरण में भिन्नता' : 'Name or Detail Mismatch'}</p>
                <p className="text-[11px] text-amber-800">
                  {isHi
                    ? 'कृपया सुनिश्चित करें कि दर्ज नाम आपके आधार कार्ड के नाम से मेल खाता हो।'
                    : 'Please make sure entered name matches your Aadhaar card.'}
                </p>
              </div>
            </div>
          )}

          {frontOcrResult.validationStatus === 'UNREADABLE' && (
            <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-900 flex items-start gap-1.5">
              <XCircle className="w-3.5 h-3.5 text-red-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">{isHi ? 'स्पष्ट फोटो अपलोड करें' : 'Upload Clear Image'}</p>
                <p className="text-[11px] text-red-800">
                  {frontOcrResult.statusMessage ||
                    (isHi ? 'दस्तावेज़ स्पष्ट नहीं है। कृपया साफ़ फोटो अपलोड करें।' : 'Document text unclear.')}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <p className="text-[11px] text-gray-500 italic">
        🔒 {isHi ? 'आधार विवरण सुरक्षित और केवल किसान सत्यापन के लिए उपयोग किया जाता है।' : 'Aadhaar details are encrypted and used only for identity verification.'}
      </p>
    </div>
  );
};
