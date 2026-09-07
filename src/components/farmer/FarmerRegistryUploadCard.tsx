import React, { useState, useRef } from 'react';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  RefreshCw,
  Eye,
  ShieldCheck,
  FileCheck2,
  Loader2,
  Info,
} from 'lucide-react';
import {
  FarmerRegistryOcrProcessResult,
  FarmerSignupComparisonInput,
  FarmerRegistryValidationStatus,
} from '../../types/farmerRegistryOcr';
import { processFarmerRegistryOcrApi } from '../../services/authApiService';
import { LanguageCode } from '../../types';

interface FarmerRegistryUploadCardProps {
  currentLanguage: LanguageCode;
  signupDetails: FarmerSignupComparisonInput;
  onOcrComplete: (result: FarmerRegistryOcrProcessResult | null, fileDataUrl: string, fileName: string) => void;
  onApplyExtractedDetails?: (extracted: {
    name?: string;
    fatherName?: string;
    district?: string;
    tehsil?: string;
    village?: string;
    registryNumber?: string;
    landArea?: string;
  }) => void;
}

export const FarmerRegistryUploadCard: React.FC<FarmerRegistryUploadCardProps> = ({
  currentLanguage,
  signupDetails,
  onOcrComplete,
  onApplyExtractedDetails,
}) => {
  const isHi = currentLanguage === 'hi' || currentLanguage === 'hr';

  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: number;
    sizeFormatted: string;
    type: string;
    dataUrl: string;
  } | null>(null);

  const [ocrStep, setOcrStep] = useState<'idle' | 'reading' | 'comparing' | 'complete' | 'error'>('idle');
  const [ocrResult, setOcrResult] = useState<FarmerRegistryOcrProcessResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelection = async (file: File) => {
    setErrorMessage(null);

    // 1. File Type Check
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const extension = file.name.split('.').pop()?.toLowerCase();
    const isExtensionValid = ['pdf', 'jpg', 'jpeg', 'png', 'webp'].includes(extension || '');

    if (!validTypes.includes(file.type) && !isExtensionValid) {
      setErrorMessage(
        isHi
          ? 'अमान्य प्रारूप। कृपया केवल PDF, JPG, JPEG या PNG दस्तावेज़ अपलोड करें।'
          : 'Invalid file format. Please upload only PDF, JPG, JPEG, or PNG documents.'
      );
      return;
    }

    // 2. File Size Check (10 MB limit)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setErrorMessage(
        isHi
          ? 'फ़ाइल 10 MB से बड़ी है। कृपया 10 MB से कम आकार का दस्तावेज़ अपलोड करें।'
          : 'File exceeds 10 MB. Please upload a file smaller than 10 MB.'
      );
      return;
    }

    if (file.size < 100) {
      setErrorMessage(
        isHi
          ? 'दस्तावेज़ खाली या क्षतिग्रस्त प्रतीत होता है। कृपया साफ़ दस्तावेज़ चुनें।'
          : 'The document appears empty or corrupted. Please choose a valid file.'
      );
      return;
    }

    // Read File as Data URL
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      const fileData = {
        name: file.name,
        size: file.size,
        sizeFormatted: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        type: file.type || 'application/pdf',
        dataUrl,
      };

      setSelectedFile(fileData);
      await triggerOcrProcessing(dataUrl, file.name, file.size, file.type || 'application/pdf');
    };

    reader.onerror = () => {
      setErrorMessage(
        isHi
          ? 'फ़ाइल पढ़ने में त्रुटि हुई। कृपया दोबारा प्रयास करें।'
          : 'Failed to read file. Please try again.'
      );
    };

    reader.readAsDataURL(file);
  };

  const triggerOcrProcessing = async (
    dataUrl: string,
    fileName: string,
    fileSize: number,
    mimeType: string
  ) => {
    setErrorMessage(null);
    setOcrStep('reading');

    // Friendly progression feedback
    const readingTimer = setTimeout(() => {
      setOcrStep('comparing');
    }, 1200);

    try {
      const result = await processFarmerRegistryOcrApi({
        documentBase64: dataUrl,
        fileName,
        fileSizeBytes: fileSize,
        mimeType,
        signupDetails: {
          name: signupDetails.name || '',
          fatherName: signupDetails.fatherName || '',
          district: signupDetails.district || '',
          tehsil: signupDetails.tehsil || '',
          village: signupDetails.village || '',
          registryNumber: signupDetails.registryNumber || '',
        },
      });

      clearTimeout(readingTimer);
      setOcrStep('complete');
      setOcrResult(result);
      onOcrComplete(result, dataUrl, fileName);
    } catch (err: any) {
      clearTimeout(readingTimer);
      setOcrStep('error');
      setErrorMessage(
        isHi
          ? 'दस्तावेज़ की जानकारी पढ़ी नहीं जा सकी। कृपया साफ़ दस्तावेज़ दोबारा अपलोड करें।'
          : 'Could not read document information. Please upload a clear document again.'
      );
      onOcrComplete(null, '', '');
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setOcrResult(null);
    setOcrStep('idle');
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onOcrComplete(null, '', '');
  };

  // Status Styling Configuration
  const getValidationTheme = (status: FarmerRegistryValidationStatus) => {
    switch (status) {
      case 'MATCHED':
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-300',
          badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
          titleColor: 'text-emerald-900',
          descColor: 'text-emerald-700',
        };
      case 'POSSIBLE_MISMATCH':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-300',
          badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
          icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
          titleColor: 'text-amber-900',
          descColor: 'text-amber-800',
        };
      case 'UNREADABLE':
        return {
          bg: 'bg-red-50',
          border: 'border-red-300',
          badgeBg: 'bg-red-100 text-red-800 border-red-300',
          icon: <XCircle className="w-5 h-5 text-red-600" />,
          titleColor: 'text-red-900',
          descColor: 'text-red-700',
        };
      case 'SUSPICIOUS_REVIEW':
        return {
          bg: 'bg-rose-50',
          border: 'border-rose-300',
          badgeBg: 'bg-rose-100 text-rose-900 border-rose-300',
          icon: <AlertTriangle className="w-5 h-5 text-rose-600" />,
          titleColor: 'text-rose-900',
          descColor: 'text-rose-800',
        };
    }
  };

  return (
    <div id="farmer-registry-upload-section" className="space-y-4 pt-3 border-t border-gray-200">
      {/* 1. Header & Clear Instructions */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <FileCheck2 className="w-4 h-4" />
            </span>
            <label className="text-xs font-extrabold text-[#26332B] uppercase tracking-wide">
              {isHi ? 'किसान रजिस्ट्री दस्तावेज़' : 'Farmer Registry Document'} *
            </label>
          </div>
          <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            {isHi ? 'वास्तविक दस्तावेज़ आवश्यक' : 'Document Required'}
          </span>
        </div>
        <p className="text-xs text-gray-600 mt-1 font-medium leading-relaxed">
          {isHi
            ? 'कृपया अपनी वास्तविक किसान रजिस्ट्री / किसान पंजीकरण दस्तावेज़ अपलोड करें। (समर्थित प्रारूप: PDF, JPG, JPEG, PNG - अधिकतम 10 MB)'
            : 'Please upload your genuine Farmer Registry / Farmer Enrollment document. (Supported formats: PDF, JPG, JPEG, PNG - Max 10 MB)'}
        </p>
      </div>

      {/* 2. Upload Box / Dropzone (When no file or re-uploading) */}
      {!selectedFile && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleFileSelection(e.dataTransfer.files[0]);
            }
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            isDragOver
              ? 'border-emerald-600 bg-emerald-50/70 scale-[1.01]'
              : 'border-gray-300 hover:border-emerald-500 bg-gray-50/70 hover:bg-emerald-50/30'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf,image/jpeg,image/jpg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileSelection(e.target.files[0]);
              }
            }}
          />

          <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 mb-3 shadow-sm">
            <UploadCloud className="w-6 h-6" />
          </div>

          <p className="text-sm font-bold text-gray-800">
            {isHi ? 'किसान रजिस्ट्री अपलोड करें' : 'Upload Farmer Registry'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {isHi
              ? 'फ़ाइल चुनने के लिए यहाँ क्लिक करें या खींचकर लाएं'
              : 'Click to browse or drag and drop your file here'}
          </p>

          <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-gray-600 font-medium">
            <span className="px-2 py-0.5 rounded bg-gray-200/80">PDF</span>
            <span className="px-2 py-0.5 rounded bg-gray-200/80">JPG</span>
            <span className="px-2 py-0.5 rounded bg-gray-200/80">PNG</span>
            <span>• अधिकतम 10 MB</span>
          </div>
        </div>
      )}

      {/* 3. Loading State with Progressive OCR steps */}
      {selectedFile && (ocrStep === 'reading' || ocrStep === 'comparing') && (
        <div className="p-5 rounded-2xl bg-white border border-emerald-200 shadow-sm space-y-3 animate-pulse">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 text-emerald-600 animate-spin flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-900 truncate">{selectedFile.name}</p>
              <p className="text-[11px] text-gray-500">{selectedFile.sizeFormatted}</p>
            </div>
          </div>

          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full bg-emerald-600 transition-all duration-500 ${
                ocrStep === 'reading' ? 'w-1/2' : 'w-5/6'
              }`}
            />
          </div>

          <p className="text-xs font-bold text-emerald-800 text-center flex items-center justify-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>
              {ocrStep === 'reading'
                ? isHi
                  ? 'दस्तावेज़ पढ़ा जा रहा है...'
                  : 'Reading document text...'
                : isHi
                ? 'दस्तावेज़ की जानकारी जांची जा रही है...'
                : 'Verifying document details...'}
            </span>
          </p>
        </div>
      )}

      {/* 4. Error Message (If file unreadable / upload failed) */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5">
          <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">{isHi ? 'त्रुटि' : 'Error'}</p>
            <p className="mt-0.5">{errorMessage}</p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-bold text-red-700 underline cursor-pointer"
          >
            {isHi ? 'पुनः प्रयास' : 'Retry'}
          </button>
        </div>
      )}

      {/* 5. OCR Processing Complete: Results Preview & Validation State */}
      {selectedFile && ocrStep === 'complete' && ocrResult && (
        <div className="space-y-4">
          {(() => {
            const theme = getValidationTheme(ocrResult.validationStatus);
            return (
              <div
                className={`p-4 rounded-2xl border ${theme.bg} ${theme.border} space-y-3 transition-all`}
              >
                {/* Status Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5">{theme.icon}</div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${theme.badgeBg}`}>
                          {isHi ? ocrResult.statusBadgeTextHi : ocrResult.statusBadgeTextEn}
                        </span>
                        <span className="text-[11px] text-gray-500 flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          <span className="truncate max-w-[180px]">{selectedFile.name}</span>
                        </span>
                      </div>
                      <h4 className={`text-sm font-bold mt-1.5 ${theme.titleColor}`}>
                        {ocrResult.statusTitle}
                      </h4>
                      <p className={`text-xs mt-0.5 leading-relaxed ${theme.descColor}`}>
                        {ocrResult.statusMessage}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="p-1.5 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-black/5 text-xs font-semibold flex items-center gap-1 cursor-pointer flex-shrink-0"
                    title={isHi ? 'दस्तावेज़ पुनः अपलोड करें' : 'Re-upload Document'}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{isHi ? 'बदलें' : 'Change'}</span>
                  </button>
                </div>

                {/* Warning Banner (Neutral wording, non-accusatory) */}
                {ocrResult.warningMessage && (
                  <div className="p-3 rounded-xl bg-amber-100/90 border border-amber-300 text-amber-950 text-xs font-semibold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0" />
                    <span>{ocrResult.warningMessage}</span>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Section 8: OCR Extracted Information Preview */}
          {ocrResult.extractedData && ocrResult.extractedData.isReadable && (
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-extrabold text-[#26332B] flex items-center gap-1.5 uppercase tracking-wide">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{isHi ? 'दस्तावेज़ से प्राप्त जानकारी' : 'Extracted Document Details'}</span>
                </h5>
                {onApplyExtractedDetails && (
                  <button
                    type="button"
                    onClick={() => {
                      onApplyExtractedDetails({
                        name:
                          ocrResult.extractedData.farmerNameHindi ||
                          ocrResult.extractedData.farmerNameEnglish,
                        fatherName:
                          ocrResult.extractedData.fatherOrIdentifierNameHindi ||
                          ocrResult.extractedData.fatherOrIdentifierName,
                        district: ocrResult.extractedData.district,
                        tehsil: ocrResult.extractedData.tehsil,
                        village: ocrResult.extractedData.village,
                        registryNumber: ocrResult.extractedData.registryNumber,
                        landArea: ocrResult.extractedData.landAreaTotal,
                      });
                    }}
                    className="text-[11px] text-emerald-700 hover:text-emerald-900 font-bold underline cursor-pointer"
                  >
                    {isHi ? 'विवरण फॉर्म में भरें' : 'Auto-fill in Form'}
                  </button>
                )}
              </div>

              {/* Extracted Fields Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-2 bg-white rounded-xl border border-gray-200">
                  <span className="text-[10px] text-gray-500 block font-semibold">
                    {isHi ? 'किसान का नाम' : 'Farmer Name'}
                  </span>
                  <span className="font-bold text-gray-900 truncate block">
                    {ocrResult.extractedData.farmerNameHindi ||
                      ocrResult.extractedData.farmerNameEnglish ||
                      '—'}
                  </span>
                </div>

                <div className="p-2 bg-white rounded-xl border border-gray-200">
                  <span className="text-[10px] text-gray-500 block font-semibold">
                    {isHi ? 'पिता / पति का नाम' : "Father's Name"}
                  </span>
                  <span className="font-bold text-gray-900 truncate block">
                    {ocrResult.extractedData.fatherOrIdentifierNameHindi ||
                      ocrResult.extractedData.fatherOrIdentifierName ||
                      '—'}
                  </span>
                </div>

                <div className="p-2 bg-white rounded-xl border border-gray-200">
                  <span className="text-[10px] text-gray-500 block font-semibold">
                    {isHi ? 'रजिस्ट्री संख्या' : 'Registry Number'}
                  </span>
                  <span className="font-bold text-gray-900 truncate block">
                    {ocrResult.extractedData.registryNumber || '—'}
                  </span>
                </div>

                <div className="p-2 bg-white rounded-xl border border-gray-200">
                  <span className="text-[10px] text-gray-500 block font-semibold">
                    {isHi ? 'ज़िला' : 'District'}
                  </span>
                  <span className="font-bold text-gray-900 truncate block">
                    {ocrResult.extractedData.district || '—'}
                  </span>
                </div>

                <div className="p-2 bg-white rounded-xl border border-gray-200">
                  <span className="text-[10px] text-gray-500 block font-semibold">
                    {isHi ? 'तहसील' : 'Tehsil'}
                  </span>
                  <span className="font-bold text-gray-900 truncate block">
                    {ocrResult.extractedData.tehsil || '—'}
                  </span>
                </div>

                <div className="p-2 bg-white rounded-xl border border-gray-200">
                  <span className="text-[10px] text-gray-500 block font-semibold">
                    {isHi ? 'ग्राम' : 'Village'}
                  </span>
                  <span className="font-bold text-gray-900 truncate block">
                    {ocrResult.extractedData.village || '—'}
                  </span>
                </div>
              </div>

              {/* Section 8: Comparison Matrix */}
              <div className="pt-2 border-t border-gray-200">
                <h6 className="text-[11px] font-extrabold text-gray-700 mb-2 uppercase tracking-wide">
                  {isHi ? 'आपकी दी गई जानकारी से मिलान' : 'Comparison With Signup Details'}
                </h6>

                <div className="space-y-1.5">
                  {ocrResult.comparisons.map((comp) => {
                    const isMatch = comp.status === 'MATCH';
                    const isMismatch = comp.status === 'MISMATCH';
                    const isDetected = comp.status === 'DETECTED';

                    return (
                      <div
                        key={comp.field}
                        className="flex items-center justify-between p-2 bg-white rounded-xl border border-gray-200 text-xs"
                      >
                        <div className="min-w-0 pr-2">
                          <span className="font-bold text-gray-800 block">
                            {isHi ? comp.labelHi : comp.labelEn}
                          </span>
                          <span className="text-[11px] text-gray-500 truncate block">
                            {isHi ? 'पंजीकरण:' : 'Signup:'} {comp.signupValue || '—'} |{' '}
                            {isHi ? 'दस्तावेज़:' : 'Doc:'} {comp.ocrValue || '—'}
                          </span>
                        </div>

                        <div className="flex-shrink-0">
                          {isMatch && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>{isHi ? 'समान (Match)' : 'Match'}</span>
                            </span>
                          )}
                          {isMismatch && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                              <AlertTriangle className="w-3 h-3 text-amber-700" />
                              <span>{isHi ? 'भिन्न (Mismatch)' : 'Mismatch'}</span>
                            </span>
                          )}
                          {isDetected && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                              <Info className="w-3 h-3 text-blue-600" />
                              <span>{isHi ? 'दस्तावेज़ में उपलब्ध' : 'Detected'}</span>
                            </span>
                          )}
                          {comp.status === 'NOT_PROVIDED' && (
                            <span className="text-[11px] text-gray-400 font-medium">
                              {isHi ? '—' : '—'}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Re-upload Action Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-xl border border-gray-300 shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{isHi ? 'दस्तावेज़ पुनः अपलोड करें' : 'Re-upload Document'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Legal / OCR Limitation Disclaimer */}
          <p className="text-[10px] text-gray-500 italic leading-relaxed px-1">
            ℹ️ {ocrResult.disclaimer}
          </p>
        </div>
      )}
    </div>
  );
};
