import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Camera,
  Trash2,
  RefreshCw,
  Info,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Check,
  Brain,
  SwitchCamera,
  Layers,
  Award,
  Calendar,
  Warehouse,
  Droplets,
  TrendingUp,
} from 'lucide-react';
import { CropListing } from '../../types/farmer';
import { LanguageCode } from '../../types';
import { getFarmerTranslations } from '../../data/farmerTranslations';
import {
  FARMER_APPROVED_CROPS,
  FarmerApprovedCrop,
  FarmerCropVariety,
} from '../../data/cropVarieties';
import {
  assessCropQualityWithAi,
  calculateMandiTierPricing,
} from '../../services/aiGradingService';
import { searchOfficialMandiPrices } from '../../services/mandiApiService';
import { AiGradingResponse } from '../../server/geminiAiGrading';

interface AddCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCrop: (crop: CropListing) => void;
  editCropData?: CropListing | null;
  currentLanguage: LanguageCode;
}

// Exactly 6 clean, logical, user-friendly steps:
// 1: Crop & Variety (फसल और किस्म)
// 2: Details & Quantity (मात्रा व विवरण)
// 3: Camera Capture (लाइव कैमरा फोटो)
// 4: Quality Assessment (गुणवत्ता जांच)
// 5: Price & Mandi Reference (भाव व मंडी दर)
// 6: Final Review & Publish (समीक्षा व प्रकाशन)
type AddCropStep = 1 | 2 | 3 | 4 | 5 | 6;

interface StepInfo {
  step: AddCropStep;
  icon: string;
  titleHi: string;
  titleEn: string;
  subtitleHi: string;
  subtitleEn: string;
}

const STEP_INFOS: StepInfo[] = [
  {
    step: 1,
    icon: '🌾',
    titleHi: 'फसल और किस्म',
    titleEn: 'Crop & Variety',
    subtitleHi: 'वह फसल और किस्म चुनें जिसे आप बेचना चाहते हैं।',
    subtitleEn: 'Select the crop and variety you want to sell.',
  },
  {
    step: 2,
    icon: '📋',
    titleHi: 'मात्रा व विवरण',
    titleEn: 'Quantity & Details',
    subtitleHi: 'बिक्री मात्रा, कटाई की तारीख और भंडारण दर्ज करें।',
    subtitleEn: 'Enter available quantity, harvest date, and storage.',
  },
  {
    step: 3,
    icon: '📷',
    titleHi: 'लाइव कैमरा फोटो',
    titleEn: 'Camera Photo',
    subtitleHi: 'विश्वसनीयता हेतु लाइव कैमरे से फसल की असली फोटो खींचें।',
    subtitleEn: 'Capture live camera photo of your crop for authenticity.',
  },
  {
    step: 4,
    icon: '⭐',
    titleHi: 'गुणवत्ता स्तर',
    titleEn: 'Quality Level',
    subtitleHi: 'एआई द्वारा फोटो की दृश्य जांच करें या स्वयं मानक/प्रीमियम चुनें।',
    subtitleEn: 'Inspect visible quality indicators (Standard or Premium).',
  },
  {
    step: 5,
    icon: '💰',
    titleHi: 'भाव व मंडी दर',
    titleEn: 'Price & Mandi',
    subtitleHi: 'सरकारी मंडी दर का संदर्भ देखें और अपना अपेक्षित भाव तय करें।',
    subtitleEn: 'Check official mandi benchmark and set your listing price.',
  },
  {
    step: 6,
    icon: '✓',
    titleHi: 'समीक्षा व प्रकाशन',
    titleEn: 'Review & Publish',
    subtitleHi: 'सभी विवरणों की पुष्टि करें और अपनी फसल लिस्ट करें।',
    subtitleEn: 'Review listing details and publish directly to buyers.',
  },
];

export const AddCropModal: React.FC<AddCropModalProps> = ({
  isOpen,
  onClose,
  onAddCrop,
  editCropData,
  currentLanguage,
}) => {
  const isHi = currentLanguage === 'hi';
  const t = getFarmerTranslations(currentLanguage);

  // 6-Step Navigation State
  const [currentStep, setCurrentStep] = useState<AddCropStep>(1);

  // STEP 1: Crop Selection (Approved crops: Wheat, Rice, Maize, Pulses)
  const [selectedCrop, setSelectedCrop] = useState<FarmerApprovedCrop>(FARMER_APPROVED_CROPS[0]);

  // Variety Selection (strictly from selected crop)
  const [selectedVariety, setSelectedVariety] = useState<FarmerCropVariety>(
    FARMER_APPROVED_CROPS[0].varieties[0]
  );
  const [customVarietyText, setCustomVarietyText] = useState('');

  // STEP 2: Quantity & Crop Details
  const [quantityInput, setQuantityInput] = useState('20');
  const [quantityUnit, setQuantityUnit] = useState<'kg' | 'quintal' | 'ton'>('quintal');
  const [quantityError, setQuantityError] = useState('');
  const [harvestDate, setHarvestDate] = useState(new Date().toISOString().split('T')[0]);
  const [storageLocation, setStorageLocation] = useState('Bareilly On-Farm Storage');
  const [moistureContent, setMoistureContent] = useState('11.5%');
  const [description, setDescription] = useState('');

  // Farm Geolocation GPS State
  const [coordinates, setCoordinates] = useState<{
    latitude: number;
    longitude: number;
    accuracy?: number;
    timestamp?: string;
  } | null>(null);
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'locating' | 'acquired' | 'failed'>('idle');

  // STEP 3: Camera-Only Crop Capture
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [images, setImages] = useState<string[]>([]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [photoError, setPhotoError] = useState('');

  // STEP 4: Quality Classification (STANDARD / PREMIUM)
  const [qualityClassification, setQualityClassification] = useState<'PREMIUM' | 'STANDARD'>('STANDARD');
  const [isManualClassification, setIsManualClassification] = useState(false);
  const [isAiGrading, setIsAiGrading] = useState(false);
  const [aiResult, setAiResult] = useState<AiGradingResponse | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // STEP 5: Price & Mandi Reference
  const [pricingType, setPricingType] = useState<'fixed' | 'negotiable'>('fixed');
  const [priceInput, setPriceInput] = useState('2450');
  const [priceUnit, setPriceUnit] = useState<'kg' | 'quintal'>('quintal');
  const [priceError, setPriceError] = useState('');

  // Mandi live data (Government reference)
  const [stateName] = useState('Uttar Pradesh');
  const [districtName] = useState('Bareilly');
  const [mandiName] = useState('Bareilly');
  const [isLoadingMandi, setIsLoadingMandi] = useState(false);
  const [mandiPriceKg, setMandiPriceKg] = useState<number>(24.5);
  const [mandiMinKg, setMandiMinKg] = useState<number>(22.0);
  const [mandiMaxKg, setMandiMaxKg] = useState<number>(26.5);
  const [mandiModalQuintal, setMandiModalQuintal] = useState<number>(2450);
  const [mandiArrivalDate, setMandiArrivalDate] = useState<string>('');
  const [mandiSource, setMandiSource] = useState<string>('Official AGMARKNET / Data.gov.in');
  const [lastMandiFetchTime, setLastMandiFetchTime] = useState<string>('');
  const [isMandiAvailable, setIsMandiAvailable] = useState<boolean>(true);
  const [mandiGradeNote, setMandiGradeNote] = useState<string>('');

  // Stop camera media tracks cleanly
  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => {
        try {
          t.stop();
        } catch {
          // ignore
        }
      });
      streamRef.current = null;
    }
    setIsCameraActive(false);
    setIsCameraLoading(false);
  };

  // Start live camera stream (Environment/Back camera preferred)
  const startCamera = async (facing: 'environment' | 'user' = 'environment') => {
    setCameraError(null);
    setIsCameraLoading(true);

    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error(
          isHi
            ? 'इस डिवाइस अथवा ब्राउज़र में कैमरा समर्थित नहीं है।'
            : 'Camera access is not supported on this device/browser.'
        );
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      setIsCameraActive(true);
      setCameraFacingMode(facing);
    } catch (err: any) {
      console.error('Camera open error:', err);
      let msg = isHi
        ? 'कैमरा खोलने में असमर्थ। कृपया ब्राउज़र में कैमरा अनुमति दें।'
        : 'Unable to access camera. Please allow camera permissions.';
      if (err.name === 'NotAllowedError') {
        msg = isHi
          ? 'कैमरा अनुमति अस्वीकृत है। कृपया ब्राउज़र सेटिंग्स में कैमरा चालू करें।'
          : 'Camera permission denied. Please allow camera access to continue.';
      } else if (err.name === 'NotFoundError') {
        msg = isHi ? 'डिवाइस पर कोई कैमरा नहीं मिला।' : 'No camera detected on device.';
      }
      setCameraError(msg);
      setIsCameraActive(false);
    } finally {
      setIsCameraLoading(false);
    }
  };

  // Capture frame from active camera stream
  const handleCaptureFrame = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

    if (images.length >= 3) {
      setImages([dataUrl, images[0], images[1]]);
    } else {
      setImages((prev) => [...prev, dataUrl]);
    }

    setPhotoError('');
    stopCameraStream();
  };

  const handleToggleFacingMode = () => {
    const newFacing = cameraFacingMode === 'environment' ? 'user' : 'environment';
    startCamera(newFacing);
  };

  const handleRemovePhoto = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const acquireGpsLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setGpsStatus('failed');
      return;
    }
    setGpsStatus('locating');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoordinates({
          latitude: Number(pos.coords.latitude.toFixed(6)),
          longitude: Number(pos.coords.longitude.toFixed(6)),
          accuracy: Math.round(pos.coords.accuracy),
          timestamp: new Date().toISOString(),
        });
        setGpsStatus('acquired');
      },
      (err) => {
        console.warn('GPS location acquisition error:', err);
        setGpsStatus('failed');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  // Fetch official Mandi price data whenever selected crop changes
  useEffect(() => {
    let isSubscribed = true;

    async function fetchMandiData() {
      setIsLoadingMandi(true);
      try {
        const result = await searchOfficialMandiPrices({
          commodity: selectedCrop.mandiCommodityName,
          state: stateName,
          district: districtName,
        });

        if (!isSubscribed) return;

        if (result && result.records && result.records.length > 0) {
          const rec = result.records[0];
          const modalQuintal = Math.round(rec.modalPriceKg * 100) || 2450;
          const minQuintal = Math.round(rec.minPriceKg * 100) || Math.round(modalQuintal * 0.9);
          const maxQuintal = Math.round(rec.maxPriceKg * 100) || Math.round(modalQuintal * 1.1);

          setMandiModalQuintal(modalQuintal);
          setMandiPriceKg(rec.modalPriceKg);
          setMandiMinKg(rec.minPriceKg);
          setMandiMaxKg(rec.maxPriceKg);
          setMandiArrivalDate(rec.arrivalDate || new Date().toISOString().split('T')[0]);
          setMandiSource(rec.source || result.source || 'Official AGMARKNET / Data.gov.in');
          setLastMandiFetchTime(new Date().toLocaleTimeString());
          setIsMandiAvailable(true);
          setMandiGradeNote('FAQ (Fair Average Quality)');

          // Auto-adjust default price input to mandi modal
          if (!editCropData) {
            setPriceInput(modalQuintal.toString());
          }
        } else {
          setIsMandiAvailable(false);
        }
      } catch (err) {
        console.warn('Official Mandi lookup note:', err);
        if (isSubscribed) {
          setIsMandiAvailable(false);
        }
      } finally {
        if (isSubscribed) {
          setIsLoadingMandi(false);
        }
      }
    }

    if (isOpen) {
      fetchMandiData();
    }

    return () => {
      isSubscribed = false;
    };
  }, [selectedCrop, stateName, districtName, isOpen, editCropData]);

  // Populate when editing an existing crop
  useEffect(() => {
    if (editCropData) {
      const matchedCrop =
        FARMER_APPROVED_CROPS.find(
          (c) =>
            c.name.toLowerCase() === (editCropData.name || editCropData.cropName || '').toLowerCase()
        ) || FARMER_APPROVED_CROPS[0];

      setSelectedCrop(matchedCrop);

      const matchedVar =
        matchedCrop.varieties.find(
          (v) => v.name.toLowerCase() === (editCropData.variety || '').toLowerCase()
        ) || matchedCrop.varieties[0];

      setSelectedVariety(matchedVar);

      if (editCropData.quantityKg) {
        setQuantityInput((editCropData.quantityKg / 100).toString());
        setQuantityUnit('quintal');
      } else if (editCropData.quantity) {
        const parts = editCropData.quantity.split(' ');
        setQuantityInput(parts[0] || '20');
        if (parts[1]?.toLowerCase().includes('ton')) setQuantityUnit('ton');
        else if (parts[1]?.toLowerCase().includes('kg')) setQuantityUnit('kg');
        else setQuantityUnit('quintal');
      }

      if (editCropData.price) {
        setPriceInput(editCropData.price.toString());
        setPriceUnit(editCropData.priceUnit || 'quintal');
      }

      if (editCropData.pricingType) {
        setPricingType(editCropData.pricingType);
      }

      if (editCropData.images && editCropData.images.length > 0) {
        setImages(editCropData.images);
      }

      if (editCropData.qualityClassification) {
        setQualityClassification(editCropData.qualityClassification);
      }

      if (editCropData.coordinates) {
        setCoordinates(editCropData.coordinates);
        setGpsStatus('acquired');
      }

      setDescription(editCropData.description || '');
      setHarvestDate(editCropData.harvestDate || new Date().toISOString().split('T')[0]);
      setStorageLocation(editCropData.storageLocation || 'Bareilly On-Farm Storage');
      setMoistureContent(editCropData.moistureContent || '11.5%');
    }
  }, [editCropData]);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  // When crop changes, reset selected variety to the first variety of the new crop (STRICT CROP -> VARIETY HIERARCHY)
  const handleSelectCrop = (crop: FarmerApprovedCrop) => {
    setSelectedCrop(crop);
    setSelectedVariety(crop.varieties[0]);
    setCustomVarietyText('');
    setStorageLocation(crop.standardStorage);
    setMoistureContent(crop.standardMoisture);
  };

  const activeVarietyName =
    selectedVariety.id === 'custom_other'
      ? customVarietyText.trim() || (isHi ? 'अन्य किस्म' : 'Other Variety')
      : selectedVariety.name;

  // Run AI grading on captured crop photos
  const handleRunAiAssessment = async () => {
    if (images.length === 0) {
      setPhotoError(
        isHi
          ? 'एआई विश्लेषण के लिए कृपया पहले कैमरे से फसल की फोटो लें।'
          : 'Please capture at least one crop photo before running AI assessment.'
      );
      return;
    }

    setIsAiGrading(true);
    setAiError(null);

    try {
      const result = await assessCropQualityWithAi({
        cropName: selectedCrop.name,
        variety: activeVarietyName,
        category: selectedCrop.category,
        images: images,
        language: currentLanguage === 'hi' ? 'hi' : 'en',
      });

      setAiResult(result);

      if (result.success && result.isReliable) {
        const assignedTier = result.classification === 'PREMIUM' ? 'PREMIUM' : 'STANDARD';
        setQualityClassification(assignedTier);
        setIsManualClassification(false);

        // Calculate pricing tier
        const tierCalc = calculateMandiTierPricing(mandiModalQuintal, assignedTier);
        if (tierCalc.suggestedRateQuintal) {
          setPriceInput(tierCalc.suggestedRateQuintal.toString());
        }
      } else {
        setAiError(
          result.unreliableReason ||
            (isHi
              ? 'गुणवत्ता विश्लेषण इस समय पूरा नहीं हो सका। कृपया नीचे स्वयं मानक अथवा प्रीमियम चुनें।'
              : 'Quality analysis could not be completed at this time. Please select quality classification manually below.')
        );
      }
    } catch (err: any) {
      console.error('AI Assessment Error:', err);
      setAiError(
        isHi
          ? 'गुणवत्ता विश्लेषण इस समय पूरा नहीं हो सका। कृपया नीचे स्वयं मानक अथवा प्रीमियम चुनें।'
          : 'Quality analysis could not be completed at this time. Please select quality classification manually below.'
      );
    } finally {
      setIsAiGrading(false);
    }
  };

  const handleSelectManualClassification = (tier: 'PREMIUM' | 'STANDARD') => {
    setQualityClassification(tier);
    setIsManualClassification(true);

    if (isMandiAvailable && mandiModalQuintal > 0) {
      const tierCalc = calculateMandiTierPricing(mandiModalQuintal, tier);
      if (tierCalc.suggestedRateQuintal) {
        setPriceInput(tierCalc.suggestedRateQuintal.toString());
      }
    }
  };

  // STEP VALIDATIONS
  const validateCurrentStep = (): boolean => {
    // Step 1: Crop & Variety
    if (currentStep === 1) {
      if (!selectedCrop || !selectedVariety) return false;
      if (selectedVariety.id === 'custom_other' && !customVarietyText.trim()) {
        return false;
      }
      return true;
    }

    // Step 2: Details & Quantity
    if (currentStep === 2) {
      const val = parseFloat(quantityInput);
      if (isNaN(val) || val <= 0) {
        setQuantityError(
          isHi ? 'कृपया उपलब्ध फसल की सही मात्रा दर्ज करें।' : 'Please enter a valid quantity greater than 0.'
        );
        return false;
      }
      setQuantityError('');
      return true;
    }

    // Step 3: Camera Capture
    if (currentStep === 3) {
      if (images.length === 0) {
        setPhotoError(
          isHi
            ? 'कृपया आगे बढ़ने के लिए कैमरे से फसल की कम से कम 1 फोटो खींचें।'
            : 'Please capture at least 1 live photo with the camera to continue.'
        );
        return false;
      }
      setPhotoError('');
      return true;
    }

    // Step 4: Quality Assessment
    if (currentStep === 4) {
      return !!qualityClassification;
    }

    // Step 5: Price & Mandi Reference
    if (currentStep === 5) {
      const priceVal = parseFloat(priceInput);
      if (isNaN(priceVal) || priceVal <= 0) {
        setPriceError(
          isHi ? 'कृपया मान्य विक्रय दर दर्ज करें।' : 'Please enter a valid asking price greater than 0.'
        );
        return false;
      }
      setPriceError('');
      return true;
    }

    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    if (currentStep === 3) {
      stopCameraStream();
    }
    if (currentStep < 6) {
      setCurrentStep((prev) => (prev + 1) as AddCropStep);
    }
  };

  const handleBack = () => {
    if (currentStep === 3) {
      stopCameraStream();
    }
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as AddCropStep);
    }
  };

  const handleStepClick = (stepNum: AddCropStep) => {
    if (stepNum < currentStep) {
      if (currentStep === 3) stopCameraStream();
      setCurrentStep(stepNum);
    }
  };

  // SUBMIT COMPLETED LISTING
  const handleSubmitListing = () => {
    if (!validateCurrentStep()) return;

    const qtyNum = parseFloat(quantityInput) || 20;
    const calculatedKg =
      quantityUnit === 'ton'
        ? Math.round(qtyNum * 1000)
        : quantityUnit === 'quintal'
        ? Math.round(qtyNum * 100)
        : Math.round(qtyNum);

    const priceNum = parseFloat(priceInput) || mandiModalQuintal;
    const pricePerKgVal =
      priceUnit === 'quintal' ? Math.round((priceNum / 100) * 100) / 100 : priceNum;

    const completeCrop: CropListing = {
      id:
        editCropData?.id ||
        `CROP-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      name: selectedCrop.name,
      variety: activeVarietyName,
      category: selectedCrop.category,
      quantityKg: calculatedKg,
      grade: qualityClassification,
      qualityClassification,
      pricingTypeTier: qualityClassification,
      isManualClassification,
      capturedViaCamera: true,
      location: `${districtName}, ${stateName}`,
      district: districtName,
      state: stateName,
      coordinates: coordinates || undefined,
      currentMandiPrice: mandiPriceKg,
      expectedPrice: pricePerKgVal,
      status: 'Available for Sale',
      photoVerified: true,
      isDemoVerification: false,
      imageUrl: images[0] || selectedCrop.image,
      images: images.length > 0 ? images : [selectedCrop.image],
      harvestedDate: harvestDate,
      storageLocation,
      moistureContent,
      description: description.trim() || selectedCrop.standardDescription,
      aiGradingResult: aiResult
        ? {
            isReliable: aiResult.isReliable ?? true,
            unreliableReason: aiResult.unreliableReason,
            detectedCrop: aiResult.detectedCrop || selectedCrop.name,
            detectedVariety: aiResult.detectedVariety || activeVarietyName,
            classification: qualityClassification,
            grade: qualityClassification,
            isManual: isManualClassification,
            visualIndicators: aiResult.visualIndicators || [],
            potentialIssues: aiResult.potentialIssues || [],
            recommendation: aiResult.recommendation || '',
            observations: aiResult.observations || '',
            disclaimer: aiResult.disclaimer || '',
            timestamp: new Date().toISOString(),
          }
        : undefined,
      mandiReferenceDetails: {
        commodity: selectedCrop.mandiCommodityName,
        variety: activeVarietyName,
        market: mandiName,
        district: districtName,
        state: stateName,
        minPriceQuintal: Math.round(mandiMinKg * 100),
        modalPriceQuintal: mandiModalQuintal,
        maxPriceQuintal: Math.round(mandiMaxKg * 100),
        minPriceKg: mandiMinKg,
        modalPriceKg: mandiPriceKg,
        maxPriceKg: mandiMaxKg,
        arrivalDate: mandiArrivalDate || new Date().toISOString().split('T')[0],
        source: mandiSource,
        lastFetchTime: lastMandiFetchTime || new Date().toISOString(),
        isLiveConnected: isMandiAvailable,
      },
    };

    onAddCrop(completeCrop);
    onClose();
  };

  if (!isOpen) return null;

  const currentStepInfo = STEP_INFOS[currentStep - 1];

  return (
    <div
      id="add-crop-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto"
    >
      <div
        id="add-crop-modal-container"
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#D5E3CE] flex flex-col overflow-hidden my-auto max-h-[92vh]"
      >
        {/* ========================================================================= */}
        {/* HEADER: Title & Close Button                                             */}
        {/* ========================================================================= */}
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-[#EEF3E8] bg-gradient-to-r from-[#245C3A] to-[#1B432B] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-xl shadow-xs border border-white/20">
              {currentStepInfo.icon}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold leading-tight">
                {editCropData
                  ? isHi
                    ? 'फसल विवरण संशोधित करें'
                    : 'Edit Crop Listing'
                  : isHi
                  ? 'नई फसल जोड़ें (Add Crop)'
                  : 'List New Harvest'}
              </h2>
              <p className="text-xs text-emerald-100/90 font-medium">
                {isHi ? 'सत्यापित थोक खरीदारों से सीधा संपर्क' : 'Direct connection to verified wholesale buyers'}
              </p>
            </div>
          </div>

          <button
            id="btn-close-add-crop-modal"
            type="button"
            onClick={() => {
              stopCameraStream();
              onClose();
            }}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            title={isHi ? 'बंद करें' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* STEP PROGRESS INDICATOR (Responsive & Touchable)                         */}
        {/* ========================================================================= */}
        <div className="px-4 py-3 sm:px-6 bg-[#FBFAF4] border-b border-[#EEF3E8] shrink-0">
          {/* Desktop Step Flow */}
          <div className="hidden sm:flex items-center justify-between gap-1">
            {STEP_INFOS.map((st) => {
              const isCompleted = st.step < currentStep;
              const isActive = st.step === currentStep;

              return (
                <button
                  key={st.step}
                  type="button"
                  onClick={() => handleStepClick(st.step)}
                  disabled={st.step > currentStep}
                  className={`flex-1 flex items-center gap-2 p-2 rounded-xl text-left transition-all ${
                    isActive
                      ? 'bg-[#EEF3E8] border border-[#245C3A]/30 shadow-xs'
                      : isCompleted
                      ? 'hover:bg-white cursor-pointer opacity-90'
                      : 'opacity-40 cursor-not-allowed'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 transition-colors ${
                      isActive
                        ? 'bg-[#245C3A] text-white shadow-xs'
                        : isCompleted
                        ? 'bg-[#5F8F45] text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : st.step}
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`text-[11px] font-bold truncate leading-tight ${
                        isActive ? 'text-[#245C3A]' : isCompleted ? 'text-[#26332B]' : 'text-gray-500'
                      }`}
                    >
                      {isHi ? st.titleHi : st.titleEn}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Mobile Step Flow (Compact & Clear) */}
          <div className="sm:hidden flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-[#245C3A] text-white text-xs font-black font-mono">
                {currentStep}/6
              </span>
              <div>
                <p className="text-xs font-bold text-[#26332B] leading-tight">
                  {isHi ? currentStepInfo.titleHi : currentStepInfo.titleEn}
                </p>
                <p className="text-[10px] text-[#68736B]">
                  {isHi ? currentStepInfo.subtitleHi : currentStepInfo.subtitleEn}
                </p>
              </div>
            </div>

            {/* Visual Mini Dots */}
            <div className="flex items-center gap-1.5 shrink-0">
              {STEP_INFOS.map((st) => (
                <span
                  key={st.step}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    st.step === currentStep
                      ? 'w-5 bg-[#245C3A]'
                      : st.step < currentStep
                      ? 'w-2 bg-[#5F8F45]'
                      : 'w-2 bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STEP CONTENT BODY (Scrollable area)                                      */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5 text-left">
          {/* Step Header Title & Subtitle */}
          <div className="hidden sm:block pb-2 border-b border-[#EEF3E8]">
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#5F8F45] block">
              {isHi ? `चरण ${currentStep} / ६` : `Step ${currentStep} of 6`}
            </span>
            <h3 className="text-lg font-bold text-[#26332B]">
              {isHi ? currentStepInfo.titleHi : currentStepInfo.titleEn}
            </h3>
            <p className="text-xs text-[#68736B] mt-0.5">
              {isHi ? currentStepInfo.subtitleHi : currentStepInfo.subtitleEn}
            </p>
          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* STEP 01: CROP SELECTION & VARIETY (STRICT 4 ACTIVE CROPS ONLY)          */}
          {/* ----------------------------------------------------------------------- */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-in fade-in-50 duration-200">
              {/* Four Active Approved Crops Cards */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#26332B] block">
                  {isHi ? '१. प्रमुख फसल चुनें (केवल ४ सक्रिय फसलें):' : '1. Select Crop (4 Approved Crops Only):'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {FARMER_APPROVED_CROPS.map((crop) => {
                    const isSelected = selectedCrop.id === crop.id;
                    return (
                      <button
                        key={crop.id}
                        type="button"
                        onClick={() => handleSelectCrop(crop)}
                        className={`p-3.5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-between min-h-[110px] relative ${
                          isSelected
                            ? 'border-[#245C3A] bg-[#EEF3E8] shadow-sm scale-102 ring-2 ring-[#5F8F45]/20'
                            : 'border-[#EEF3E8] bg-white hover:bg-[#FBFAF4] hover:border-[#D5E3CE]'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#245C3A] text-white flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                        <span className="text-3xl mb-1">{crop.icon}</span>
                        <div>
                          <h4 className="font-bold text-sm text-[#26332B] leading-tight">
                            {isHi ? crop.nameHi : crop.name}
                          </h4>
                          <span className="text-[10px] text-[#68736B] font-medium block mt-0.5">
                            {crop.name}
                          </span>
                        </div>
                        <span className="mt-1 text-[9px] font-bold px-2 py-0.5 rounded-md bg-white border border-[#D5E3CE] text-[#245C3A]">
                          {isHi ? crop.categoryHi : crop.category}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Crop's Approved Varieties */}
              <div className="space-y-2 pt-2 border-t border-[#EEF3E8]">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#26332B] block">
                    {isHi
                      ? `२. ${selectedCrop.nameHi} की स्वीकृत किस्में (${selectedCrop.varieties.length}):`
                      : `2. Approved Varieties for ${selectedCrop.name}:`}
                  </label>
                  <span className="text-[11px] text-[#5F8F45] font-semibold">
                    {selectedCrop.varieties.length} {isHi ? 'विकल्प' : 'Varieties'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {selectedCrop.varieties.map((variety) => {
                    const isSelected = selectedVariety.id === variety.id;
                    return (
                      <button
                        key={variety.id}
                        type="button"
                        onClick={() => setSelectedVariety(variety)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'border-[#245C3A] bg-[#EEF3E8] font-bold text-[#245C3A] shadow-2xs ring-1 ring-[#245C3A]'
                            : 'border-[#EEF3E8] bg-white text-[#26332B] hover:bg-[#FBFAF4]'
                        }`}
                      >
                        <div className="min-w-0 pr-1">
                          <p className="text-xs font-bold truncate leading-tight">
                            {isHi ? variety.nameHi : variety.name}
                          </p>
                          {variety.gradeReference && (
                            <p className="text-[10px] text-[#68736B] truncate mt-0.5 font-normal">
                              {variety.gradeReference}
                            </p>
                          )}
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#245C3A] shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Variety input if 'custom_other' is chosen */}
                {selectedVariety.id === 'custom_other' && (
                  <div className="pt-2">
                    <input
                      type="text"
                      value={customVarietyText}
                      onChange={(e) => setCustomVarietyText(e.target.value)}
                      placeholder={isHi ? 'अपनी विशेष किस्म का नाम दर्ज करें' : 'Enter specific variety name'}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#245C3A] rounded-xl text-xs sm:text-sm text-[#26332B] focus:outline-hidden ring-2 ring-[#5F8F45]/20"
                    />
                  </div>
                )}
              </div>

              {/* Standard Storage & Moisture Reference Banner */}
              <div className="p-3 rounded-2xl bg-[#FBFAF4] border border-[#EEF3E8] flex items-center gap-3 text-xs">
                <Info className="w-4 h-4 text-[#5F8F45] shrink-0" />
                <div className="text-[#68736B]">
                  <span className="font-bold text-[#26332B]">
                    {isHi ? 'मानक संदर्भ:' : 'Standard Reference:'}{' '}
                  </span>
                  {isHi ? selectedCrop.standardDescriptionHi : selectedCrop.standardDescription}
                </div>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------------- */}
          {/* STEP 02: QUANTITY, HARVEST & STORAGE DETAILS                            */}
          {/* ----------------------------------------------------------------------- */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-in fade-in-50 duration-200">
              {/* Group 1: Quantity & Unit */}
              <div className="p-4 rounded-2xl bg-white border border-[#EEF3E8] shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#26332B] flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-[#245C3A]" />
                    <span>{isHi ? 'बिक्री हेतु कुल उपलब्ध मात्रा' : 'Available Quantity for Sale'}</span>
                  </label>
                  <span className="text-xs font-bold text-[#245C3A]">
                    {quantityInput}{' '}
                    {quantityUnit === 'quintal'
                      ? isHi
                        ? 'क्विंटल'
                        : 'Quintal'
                      : quantityUnit === 'ton'
                      ? isHi
                        ? 'टन'
                        : 'Ton'
                      : 'kg'}
                  </span>
                </div>

                {/* Input with unit toggle */}
                <div className="flex items-center gap-2">
                  <input
                    id="input-crop-quantity"
                    type="number"
                    min="1"
                    step="any"
                    value={quantityInput}
                    onChange={(e) => {
                      setQuantityInput(e.target.value);
                      setQuantityError('');
                    }}
                    placeholder="उदा: 25"
                    className="flex-1 px-4 py-3 bg-[#FBFAF4] border border-[#D5E3CE] rounded-xl text-base sm:text-lg font-bold text-[#26332B] focus:border-[#245C3A] focus:bg-white focus:outline-hidden"
                  />

                  {/* Unit Pills */}
                  <div className="flex items-center bg-[#FBFAF4] p-1 rounded-xl border border-[#EEF3E8]">
                    {(['quintal', 'ton', 'kg'] as const).map((unit) => (
                      <button
                        key={unit}
                        type="button"
                        onClick={() => setQuantityUnit(unit)}
                        className={`px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          quantityUnit === unit
                            ? 'bg-[#245C3A] text-white shadow-xs'
                            : 'text-[#68736B] hover:text-[#26332B]'
                        }`}
                      >
                        {unit === 'quintal'
                          ? isHi
                            ? 'क्विंटल'
                            : 'Quintal'
                          : unit === 'ton'
                          ? isHi
                            ? 'टन'
                            : 'Ton'
                          : 'kg'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-[#68736B] mr-1">
                    {isHi ? 'त्वरित चयन:' : 'Quick Select:'}
                  </span>
                  {['5', '10', '20', '50', '100', '200'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setQuantityInput(preset)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                        quantityInput === preset
                          ? 'bg-[#EEF3E8] border-[#245C3A] text-[#245C3A]'
                          : 'bg-white border-[#EEF3E8] text-[#26332B] hover:bg-[#FBFAF4]'
                      }`}
                    >
                      {preset} {quantityUnit === 'quintal' ? 'Q' : quantityUnit === 'ton' ? 'T' : 'kg'}
                    </button>
                  ))}
                </div>

                {quantityError && (
                  <p className="text-xs font-bold text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{quantityError}</span>
                  </p>
                )}

                {/* Live Standard Conversion */}
                <div className="p-2 rounded-xl bg-[#EEF3E8]/70 text-[11px] text-[#245C3A] font-semibold flex items-center justify-between">
                  <span>{isHi ? 'मानक वजन समकक्ष:' : 'Standard Metric Weight:'}</span>
                  <span className="font-mono font-bold">
                    {quantityUnit === 'ton'
                      ? `${(parseFloat(quantityInput) || 0) * 1000} kg (${(parseFloat(quantityInput) || 0) * 10} Quintal)`
                      : quantityUnit === 'quintal'
                      ? `${(parseFloat(quantityInput) || 0) * 100} kg (${((parseFloat(quantityInput) || 0) / 10).toFixed(1)} Ton)`
                      : `${parseFloat(quantityInput) || 0} kg`}
                  </span>
                </div>
              </div>

              {/* Group 2: Harvest & Storage Information */}
              <div className="p-4 rounded-2xl bg-white border border-[#EEF3E8] shadow-xs space-y-3">
                <h4 className="text-xs font-bold text-[#26332B] flex items-center gap-1.5">
                  <Warehouse className="w-4 h-4 text-[#245C3A]" />
                  <span>{isHi ? 'कटाई व भंडारण विवरण' : 'Harvest & Storage Information'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] font-bold text-[#68736B] block mb-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#5F8F45]" />
                      <span>{isHi ? 'कटाई की तारीख' : 'Harvest Date'}</span>
                    </label>
                    <input
                      type="date"
                      value={harvestDate}
                      onChange={(e) => setHarvestDate(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FBFAF4] border border-[#EEF3E8] rounded-xl text-xs text-[#26332B] focus:border-[#245C3A] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#68736B] block mb-1 flex items-center gap-1">
                      <Droplets className="w-3.5 h-3.5 text-[#5F8F45]" />
                      <span>{isHi ? 'नमी (Moisture %)' : 'Moisture %'}</span>
                    </label>
                    <input
                      type="text"
                      value={moistureContent}
                      onChange={(e) => setMoistureContent(e.target.value)}
                      placeholder="उदा: 11.5%"
                      className="w-full px-3 py-2 bg-[#FBFAF4] border border-[#EEF3E8] rounded-xl text-xs text-[#26332B] focus:border-[#245C3A] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#68736B] block mb-1 flex items-center gap-1">
                      <Warehouse className="w-3.5 h-3.5 text-[#5F8F45]" />
                      <span>{isHi ? 'भंडारण स्थान' : 'Storage Location'}</span>
                    </label>
                    <input
                      type="text"
                      value={storageLocation}
                      onChange={(e) => setStorageLocation(e.target.value)}
                      placeholder="उदा: पक्का गोदाम"
                      className="w-full px-3 py-2 bg-[#FBFAF4] border border-[#EEF3E8] rounded-xl text-xs text-[#26332B] focus:border-[#245C3A] focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Group 3: Farm Field GPS Geotag */}
              <div className="p-4 rounded-2xl bg-[#FBFAF4] border border-[#EEF3E8] space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#EEF3E8] text-[#245C3A] flex items-center justify-center">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-[#26332B]">
                        {isHi ? 'खेत का जीपीएस स्थान (Geotag)' : 'Farm Field GPS Geotag'}
                      </h5>
                      <p className="text-[10px] text-[#68736B]">
                        {isHi ? 'खरीदारों को परिवहन दूरी की स्पष्ट जानकारी देता है' : 'Helps buyers calculate logistics distance accurately'}
                      </p>
                    </div>
                  </div>

                  {gpsStatus === 'locating' ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 text-xs font-bold">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>{isHi ? 'खोज रहे हैं...' : 'Locating...'}</span>
                    </div>
                  ) : coordinates ? (
                    <button
                      type="button"
                      onClick={acquireGpsLocation}
                      className="px-3 py-1.5 rounded-xl bg-[#EEF3E8] text-[#245C3A] text-xs font-bold hover:bg-[#dbe7d3] transition-colors cursor-pointer"
                    >
                      {isHi ? 'पुनः प्राप्त करें' : 'Update GPS'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={acquireGpsLocation}
                      className="px-3.5 py-1.5 rounded-xl bg-[#245C3A] hover:bg-[#1B432B] text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{isHi ? 'जीपीएस जोड़ें' : 'Tag GPS'}</span>
                    </button>
                  )}
                </div>

                {coordinates && (
                  <div className="flex items-center gap-2 text-xs text-[#245C3A] bg-[#EEF3E8] p-2.5 rounded-xl font-mono">
                    <CheckCircle2 className="w-4 h-4 text-[#5F8F45] shrink-0" />
                    <span>
                      Lat: {coordinates.latitude.toFixed(4)}°, Lon: {coordinates.longitude.toFixed(4)}°
                      {coordinates.accuracy ? ` (±${coordinates.accuracy}m)` : ''}
                    </span>
                  </div>
                )}
              </div>

              {/* Group 4: Description (Optional) */}
              <div>
                <label className="text-xs font-bold text-[#26332B] block mb-1">
                  {isHi ? 'फसल विवरण (वैकल्पिक)' : 'Crop Description (Optional)'}
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={
                    isHi
                      ? 'उदा: ताज़ा कटाई की फसल, साफ और छनी हुई, सुरक्षित गोदाम में रखी है।'
                      : 'e.g. Fresh harvest, sorted and moisture-controlled in covered storage.'
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-[#EEF3E8] rounded-xl text-xs text-[#26332B] focus:border-[#245C3A] focus:outline-hidden resize-none"
                />
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------------- */}
          {/* STEP 03: LIVE CAMERA PHOTO CAPTURE (STRICTLY CAMERA-ONLY)               */}
          {/* ----------------------------------------------------------------------- */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in-50 duration-200">
              {/* Hidden Canvas for Frame Capture */}
              <canvas ref={canvasRef} className="hidden" />

              {/* Live Camera Active Viewport */}
              {isCameraActive ? (
                <div className="relative rounded-2xl overflow-hidden bg-black border-2 border-[#245C3A] shadow-xl aspect-4/3 max-h-[360px] mx-auto">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />

                  {/* Viewfinder Target Brackets */}
                  <div className="absolute inset-8 pointer-events-none border-2 border-white/60 rounded-2xl flex flex-col justify-between p-3">
                    <div className="flex justify-between">
                      <div className="w-5 h-5 border-t-2 border-l-2 border-emerald-400" />
                      <div className="w-5 h-5 border-t-2 border-r-2 border-emerald-400" />
                    </div>
                    <p className="text-center text-[11px] font-bold text-white bg-black/50 px-2 py-1 rounded-md backdrop-blur-xs mx-auto">
                      {isHi ? 'फसल के दानों को फ्रेम के बीच रखें' : 'Keep crop grains inside viewfinder'}
                    </p>
                    <div className="flex justify-between">
                      <div className="w-5 h-5 border-b-2 border-l-2 border-emerald-400" />
                      <div className="w-5 h-5 border-b-2 border-r-2 border-emerald-400" />
                    </div>
                  </div>

                  {/* Controls Floating Bar */}
                  <div className="absolute bottom-4 inset-x-4 flex items-center justify-between px-3">
                    <button
                      type="button"
                      onClick={handleToggleFacingMode}
                      className="p-3 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs transition-colors cursor-pointer"
                      title={isHi ? 'कैमरा बदलें' : 'Switch Camera'}
                    >
                      <SwitchCamera className="w-5 h-5" />
                    </button>

                    {/* Shutter Button */}
                    <button
                      id="btn-camera-shutter"
                      type="button"
                      onClick={handleCaptureFrame}
                      className="w-16 h-16 rounded-full bg-white border-4 border-[#245C3A] flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      aria-label="Capture Photo"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#245C3A] flex items-center justify-center text-white">
                        <Camera className="w-6 h-6" />
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={stopCameraStream}
                      className="p-3 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs transition-colors cursor-pointer"
                      title={isHi ? 'बंद करें' : 'Close Camera'}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Camera Open Card */
                <div className="p-6 rounded-2xl border-2 border-dashed border-[#5F8F45]/50 bg-[#FBFAF4] text-center space-y-3.5">
                  <div className="w-16 h-16 rounded-2xl bg-[#EEF3E8] border border-[#245C3A]/20 text-[#245C3A] flex items-center justify-center mx-auto shadow-xs">
                    <Camera className="w-8 h-8" />
                  </div>

                  <div>
                    <h4 className="font-bold text-sm sm:text-base text-[#26332B]">
                      {isHi ? 'लाइव कैमरे से फसल की फोटो लें' : 'Take Crop Photo with Live Camera'}
                    </h4>
                    <p className="text-xs text-[#68736B] max-w-sm mx-auto mt-1">
                      {isHi
                        ? 'फसल के दानों या ढेर की साफ़ फोटो खींचें। गैलरी या इंटरनेट से ली गई फोटो वर्जित हैं।'
                        : 'Real-time camera capture only. Gallery and downloaded photos are strictly prohibited.'}
                    </p>
                  </div>

                  {isCameraLoading ? (
                    <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#245C3A]">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{isHi ? 'कैमरा शुरू हो रहा है...' : 'Starting camera...'}</span>
                    </div>
                  ) : (
                    <button
                      id="btn-open-camera"
                      type="button"
                      onClick={() => startCamera('environment')}
                      className="px-6 py-3 rounded-xl bg-[#245C3A] hover:bg-[#1B432B] text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2 mx-auto cursor-pointer hover:scale-102"
                    >
                      <Camera className="w-4 h-4" />
                      <span>{isHi ? '📷 कैमरा खोलें व फोटो खींचें' : '📷 Open Camera & Capture'}</span>
                    </button>
                  )}
                </div>
              )}

              {/* Camera Error Message */}
              {cameraError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                  <div className="space-y-1">
                    <p className="font-semibold">{cameraError}</p>
                    <button
                      type="button"
                      onClick={() => startCamera('environment')}
                      className="text-[11px] underline font-bold hover:text-red-900 cursor-pointer"
                    >
                      {isHi ? 'पुनः अनुमति दें व प्रयास करें' : 'Retry Camera Access'}
                    </button>
                  </div>
                </div>
              )}

              {/* Photo Error */}
              {photoError && (
                <p className="text-xs font-bold text-red-600 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  <span>{photoError}</span>
                </p>
              )}

              {/* Captured Photo Thumbnails */}
              {images.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-[#EEF3E8]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#26332B] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#5F8F45]" />
                      {isHi ? 'कैमरे से खींची गई तस्वीरें:' : 'Camera-Captured Photos:'}
                    </span>
                    <span className="text-[#68736B] font-medium">{images.length}/3 photos</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    {images.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-4/3 rounded-xl overflow-hidden border-2 border-[#245C3A] shadow-xs group bg-gray-100"
                      >
                        <img
                          src={imgUrl}
                          alt={`Captured ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-bold">
                          Live ✓
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(idx)}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-md transition-colors cursor-pointer"
                          title={isHi ? 'हटाएं' : 'Remove'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {images.length < 3 && !isCameraActive && (
                    <button
                      type="button"
                      onClick={() => startCamera('environment')}
                      className="text-xs font-bold text-[#245C3A] hover:underline flex items-center gap-1 pt-1 cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>{isHi ? '+ अन्य फोटो जोड़ें' : '+ Capture Another Photo'}</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ----------------------------------------------------------------------- */}
          {/* STEP 04: AI QUALITY ASSESSMENT (STANDARD / PREMIUM ONLY)                */}
          {/* ----------------------------------------------------------------------- */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in-50 duration-200">
              {/* AI Explanation Banner */}
              <div className="p-3.5 rounded-2xl bg-[#EEF3E8] border border-[#5F8F45]/30 flex items-start gap-2.5 text-xs text-[#245C3A]">
                <Brain className="w-4 h-4 text-[#245C3A] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">
                    {isHi ? 'दृश्य गुणवत्ता परीक्षण' : 'AI Visual Quality Assessment'}
                  </p>
                  <p className="text-[#68736B] text-[11px] mt-0.5">
                    {isHi
                      ? 'AI कैमरे से खींची गई फोटो का दृश्य परीक्षण कर चमक, दाने की एकसमानता और सफाई के आधार पर श्रेणी निर्धारित करता है।'
                      : 'AI checks the captured crop image for visible quality indicators (Standard or Premium).'}
                  </p>
                </div>
              </div>

              {/* AI Trigger Area */}
              {!aiResult && !isAiGrading && (
                <div className="p-5 rounded-2xl bg-[#FBFAF4] border border-[#EEF3E8] text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#245C3A] text-white flex items-center justify-center mx-auto shadow-md">
                    <Sparkles className="w-6 h-6 text-amber-300" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#26332B]">
                      {isHi ? 'एआई गुणवत्ता विश्लेषण चलाएं' : 'Run AI Quality Analysis'}
                    </h4>
                    <p className="text-xs text-[#68736B] max-w-sm mx-auto mt-0.5">
                      {isHi
                        ? 'यह कैमरे से खींची गई फोटो का परीक्षण कर स्टैंडर्ड अथवा प्रीमियम श्रेणी तय करेगा।'
                        : 'Inspects grain luster, uniformity, and assigns Standard or Premium classification.'}
                    </p>
                  </div>
                  <button
                    id="btn-run-ai-grading"
                    type="button"
                    onClick={handleRunAiAssessment}
                    className="px-5 py-2.5 rounded-xl bg-[#245C3A] hover:bg-[#1B432B] text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer flex items-center gap-2 mx-auto"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>{isHi ? 'एआई जांच शुरू करें' : 'Start AI Analysis'}</span>
                  </button>
                </div>
              )}

              {/* Loading State */}
              {isAiGrading && (
                <div className="p-7 rounded-2xl bg-[#FBFAF4] border border-[#EEF3E8] text-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-[#5F8F45] animate-spin mx-auto" />
                  <h4 className="font-bold text-sm text-[#245C3A]">
                    {isHi ? 'फोटो का गुणवत्ता विश्लेषण प्रगति पर है...' : 'Analyzing crop photos with AI...'}
                  </h4>
                  <p className="text-xs text-[#68736B]">
                    {isHi
                      ? 'दाने का रंग, चमक और दृश्य एकसमानता का परीक्षण किया जा रहा है...'
                      : 'Checking grain luster, uniformity, and visible cleanliness...'}
                  </p>
                </div>
              )}

              {/* AI Error Display (Honest failure message, no fake percentages) */}
              {aiError && !isAiGrading && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                  <div className="flex items-center gap-2 font-bold">
                    <Info className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>{isHi ? 'गुणवत्ता सूचना' : 'Quality Notice'}</span>
                  </div>
                  <p>{aiError}</p>
                  <p className="text-[11px] text-amber-800">
                    {isHi
                      ? 'कृपया नीचे दिए गए विकल्पों में से अपनी फसल की गुणवत्ता स्तर चुनें।'
                      : 'Please select your quality tier manually below.'}
                  </p>
                </div>
              )}

              {/* Reliable AI Result Display */}
              {aiResult && aiResult.isReliable && aiResult.success && !isAiGrading && (
                <div className="p-4 rounded-2xl bg-[#FBFAF4] border border-[#245C3A]/30 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#EEF3E8]">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-[#5F8F45]" />
                      <span className="font-bold text-xs sm:text-sm text-[#26332B]">
                        {isHi ? 'एआई गुणवत्ता मूल्यांकन परिणाम:' : 'AI Visual Assessment Result:'}
                      </span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-xl font-black text-xs text-white ${
                        qualityClassification === 'PREMIUM' ? 'bg-[#245C3A]' : 'bg-[#38433C]'
                      }`}
                    >
                      {qualityClassification === 'PREMIUM'
                        ? isHi
                          ? 'प्रीमियम (PREMIUM ⭐)'
                          : 'PREMIUM ⭐'
                        : isHi
                        ? 'मानक (STANDARD)'
                        : 'STANDARD'}
                    </span>
                  </div>

                  {aiResult.observations && (
                    <p className="text-xs text-[#26332B] italic bg-white p-2.5 rounded-xl border border-[#EEF3E8]">
                      "{aiResult.observations}"
                    </p>
                  )}
                </div>
              )}

              {/* Quality Tier Selector (STANDARD vs PREMIUM) */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#26332B]">
                    {isHi ? 'गुणवत्ता स्तर चयन:' : 'Select Quality Classification:'}
                  </span>
                  {isManualClassification && (
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                      {isHi ? 'मैन्युअल चयन' : 'Manual Selection'}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* STANDARD TIER */}
                  <button
                    type="button"
                    onClick={() => handleSelectManualClassification('STANDARD')}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                      qualityClassification === 'STANDARD'
                        ? 'border-[#245C3A] bg-[#EEF3E8] shadow-xs ring-1 ring-[#245C3A]'
                        : 'border-[#EEF3E8] bg-white hover:bg-[#FBFAF4]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-[#26332B] flex items-center gap-1.5">
                          <Layers className="w-4 h-4 text-gray-600" />
                          <span>{isHi ? 'मानक (STANDARD)' : 'STANDARD'}</span>
                        </span>
                        {qualityClassification === 'STANDARD' && (
                          <Check className="w-4 h-4 text-[#245C3A] stroke-[3]" />
                        )}
                      </div>
                      <p className="text-xs text-[#68736B] mt-1 leading-relaxed">
                        {isHi
                          ? 'सामान्य औसत गुणवत्ता (FAQ)। बिक्री दर = सरकारी मंडी मॉडल भाव।'
                          : 'Fair average quality meeting standard market expectations. Priced at Mandi Rate.'}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-[#EEF3E8] text-[11px] font-bold text-[#26332B]">
                      {isHi ? 'दर: सरकारी मंडी संदर्भ दर' : 'Price: Mandi Reference Rate'}
                    </div>
                  </button>

                  {/* PREMIUM TIER (+5%) */}
                  <button
                    type="button"
                    onClick={() => handleSelectManualClassification('PREMIUM')}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                      qualityClassification === 'PREMIUM'
                        ? 'border-[#245C3A] bg-[#EEF3E8] shadow-xs ring-2 ring-[#5F8F45]/30'
                        : 'border-[#EEF3E8] bg-white hover:bg-[#FBFAF4]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-[#245C3A] flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-[#245C3A]" />
                          <span>{isHi ? 'प्रीमियम (PREMIUM)' : 'PREMIUM'}</span>
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="px-1.5 py-0.5 rounded bg-[#245C3A] text-white text-[10px] font-bold">
                            +5%
                          </span>
                          {qualityClassification === 'PREMIUM' && (
                            <Check className="w-4 h-4 text-[#245C3A] stroke-[3]" />
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-[#68736B] mt-1 leading-relaxed">
                        {isHi
                          ? 'उत्कृष्ट चमक, एकसमान दाना, साफ और बिना दोष। +5% मंडी बोनस के योग्य।'
                          : 'Superior grain luster, uniformity, and cleanliness. Eligible for +5% premium price.'}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-[#EEF3E8] text-[11px] font-black text-[#245C3A]">
                      {isHi ? 'दर: सरकारी मंडी भाव + 5% बोनस' : 'Price: Government Mandi Rate + 5%'}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------------- */}
          {/* STEP 05: MANDI BENCHMARK PRICING & ASKING PRICE                        */}
          {/* ----------------------------------------------------------------------- */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-in fade-in-50 duration-200">
              {/* Government Mandi Reference Card */}
              <div className="p-4 rounded-2xl bg-[#FBFAF4] border border-[#D5E3CE] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#245C3A]" />
                    <span className="font-bold text-xs sm:text-sm text-[#26332B]">
                      {isHi ? 'सरकारी मंडी मॉडल भाव संदर्भ:' : 'Government Mandi Reference Rate:'}
                    </span>
                  </div>
                  {isLoadingMandi ? (
                    <div className="flex items-center gap-1 text-[11px] text-[#245C3A]">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>{isHi ? 'अपडेट हो रहा है...' : 'Fetching...'}</span>
                    </div>
                  ) : (
                    <span className="text-[10px] font-bold text-[#5F8F45] bg-[#EEF3E8] px-2 py-0.5 rounded-md">
                      {mandiName} मंडी
                    </span>
                  )}
                </div>

                {isMandiAvailable && mandiModalQuintal > 0 ? (
                  <div className="space-y-2.5">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 rounded-xl bg-white border border-[#EEF3E8]">
                        <span className="text-[10px] text-[#68736B] block">
                          {isHi ? 'न्यूनतम दर' : 'Min Rate'}
                        </span>
                        <span className="font-bold text-xs text-[#26332B]">
                          ₹{Math.round(mandiMinKg * 100)}/q
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-[#EEF3E8] border border-[#245C3A]/30">
                        <span className="text-[10px] text-[#245C3A] font-bold block">
                          {isHi ? 'मॉडल मंडी भाव' : 'Modal Rate'}
                        </span>
                        <span className="font-extrabold text-sm text-[#245C3A]">
                          ₹{mandiModalQuintal}/q
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-white border border-[#EEF3E8]">
                        <span className="text-[10px] text-[#68736B] block">
                          {isHi ? 'अधिकतम दर' : 'Max Rate'}
                        </span>
                        <span className="font-bold text-xs text-[#26332B]">
                          ₹{Math.round(mandiMaxKg * 100)}/q
                        </span>
                      </div>
                    </div>

                    {/* Calculated Tier Rate Presets */}
                    <div className="p-2.5 rounded-xl bg-white border border-[#EEF3E8] flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div>
                        <span className="font-bold text-[#26332B]">
                          {qualityClassification === 'PREMIUM'
                            ? isHi
                              ? 'प्रीमियम अनुशंसित भाव (+5%):'
                              : 'Premium Rate (+5% Mandi):'
                            : isHi
                            ? 'मानक अनुशंसित भाव (मंडी दर):'
                            : 'Standard Rate (Mandi Rate):'}
                        </span>
                        <span className="font-extrabold text-[#245C3A] ml-1.5 font-mono">
                          ₹
                          {qualityClassification === 'PREMIUM'
                            ? Math.round(mandiModalQuintal * 1.05)
                            : mandiModalQuintal}
                          /क्विंटल
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const targetRate =
                            qualityClassification === 'PREMIUM'
                              ? Math.round(mandiModalQuintal * 1.05)
                              : mandiModalQuintal;
                          setPriceInput(targetRate.toString());
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#245C3A] text-white text-[11px] font-bold hover:bg-[#1B432B] transition-colors cursor-pointer"
                      >
                        {isHi ? 'यह दर लागू करें' : 'Apply This Rate'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-white border border-[#EEF3E8] text-xs text-[#68736B]">
                    {isHi
                      ? 'सरकारी मंडी डेटा वर्तमान में अनुपलब्ध है। आप सीधे अपनी अपेक्षित विक्रय दर दर्ज कर सकते हैं।'
                      : 'Official mandi benchmark rate temporarily unavailable. You can enter your expected price directly.'}
                  </div>
                )}
              </div>

              {/* Farmer's Asking Price Input */}
              <div className="p-4 rounded-2xl bg-white border border-[#EEF3E8] shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#26332B] block">
                    {isHi ? 'आपकी अपेक्षित विक्रय दर (Listing Price):' : 'Your Expected Listing Price:'}
                  </label>

                  {/* Pricing Type Toggle: Fixed vs Negotiable */}
                  <div className="flex items-center bg-[#FBFAF4] p-1 rounded-xl border border-[#EEF3E8]">
                    <button
                      type="button"
                      onClick={() => setPricingType('fixed')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        pricingType === 'fixed'
                          ? 'bg-[#245C3A] text-white shadow-xs'
                          : 'text-[#68736B] hover:text-[#26332B]'
                      }`}
                    >
                      {isHi ? 'स्थिर भाव (Fixed)' : 'Fixed'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPricingType('negotiable')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        pricingType === 'negotiable'
                          ? 'bg-[#245C3A] text-white shadow-xs'
                          : 'text-[#68736B] hover:text-[#26332B]'
                      }`}
                    >
                      {isHi ? 'बातचीत योग्य (Negotiable)' : 'Negotiable'}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-bold text-[#68736B]">
                      ₹
                    </span>
                    <input
                      id="input-crop-price"
                      type="number"
                      min="1"
                      step="any"
                      value={priceInput}
                      onChange={(e) => {
                        setPriceInput(e.target.value);
                        setPriceError('');
                      }}
                      placeholder="उदा: 2450"
                      className="w-full pl-8 pr-4 py-3 bg-[#FBFAF4] border border-[#D5E3CE] rounded-xl text-base sm:text-lg font-bold text-[#26332B] focus:border-[#245C3A] focus:bg-white focus:outline-hidden"
                    />
                  </div>

                  {/* Price Unit Selector */}
                  <div className="flex items-center bg-[#FBFAF4] p-1 rounded-xl border border-[#EEF3E8]">
                    <button
                      type="button"
                      onClick={() => setPriceUnit('quintal')}
                      className={`px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        priceUnit === 'quintal'
                          ? 'bg-[#245C3A] text-white shadow-xs'
                          : 'text-[#68736B] hover:text-[#26332B]'
                      }`}
                    >
                      / {isHi ? 'क्विंटल' : 'Quintal'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPriceUnit('kg')}
                      className={`px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        priceUnit === 'kg'
                          ? 'bg-[#245C3A] text-white shadow-xs'
                          : 'text-[#68736B] hover:text-[#26332B]'
                      }`}
                    >
                      / {isHi ? 'कि.ग्रा.' : 'kg'}
                    </button>
                  </div>
                </div>

                {priceError && (
                  <p className="text-xs font-bold text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{priceError}</span>
                  </p>
                )}

                {/* Total Estimated Lot Value */}
                <div className="p-3 rounded-xl bg-[#EEF3E8] flex items-center justify-between text-xs text-[#245C3A] font-bold">
                  <span>{isHi ? 'अनुमानित कुल लॉट मूल्य:' : 'Total Estimated Lot Value:'}</span>
                  <span className="text-sm sm:text-base font-extrabold font-mono">
                    ₹
                    {(() => {
                      const p = parseFloat(priceInput) || 0;
                      const q = parseFloat(quantityInput) || 0;
                      if (priceUnit === 'quintal') {
                        const totalQ =
                          quantityUnit === 'ton' ? q * 10 : quantityUnit === 'quintal' ? q : q / 100;
                        return Math.round(p * totalQ).toLocaleString('en-IN');
                      } else {
                        const totalKg =
                          quantityUnit === 'ton' ? q * 1000 : quantityUnit === 'quintal' ? q * 100 : q;
                        return Math.round(p * totalKg).toLocaleString('en-IN');
                      }
                    })()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------------- */}
          {/* STEP 06: FINAL REVIEW & PUBLISH LISTING                                 */}
          {/* ----------------------------------------------------------------------- */}
          {currentStep === 6 && (
            <div className="space-y-4 animate-in fade-in-50 duration-200">
              {/* Summary Card */}
              <div className="p-4 rounded-2xl bg-[#FBFAF4] border border-[#EEF3E8] space-y-3.5">
                {/* Crop & Variety Header with Photo */}
                <div className="flex items-center gap-3.5 pb-3 border-b border-[#EEF3E8]">
                  <div className="w-18 h-18 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border-2 border-[#245C3A] shadow-xs">
                    <img
                      src={images[0] || selectedCrop.image}
                      alt={selectedCrop.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-base sm:text-lg text-[#26332B] leading-tight">
                        {isHi ? selectedCrop.nameHi : selectedCrop.name}
                      </h4>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[11px] font-black text-white ${
                          qualityClassification === 'PREMIUM' ? 'bg-[#245C3A]' : 'bg-[#4B5563]'
                        }`}
                      >
                        {qualityClassification}
                      </span>
                    </div>
                    <p className="text-xs text-[#5F8F45] font-bold mt-0.5">{activeVarietyName}</p>
                    <p className="text-[11px] text-[#68736B] mt-0.5">
                      {districtName}, {stateName}
                    </p>
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-white border border-[#EEF3E8]">
                    <span className="text-[10px] text-[#68736B] block">
                      {isHi ? 'कुल मात्रा' : 'Quantity'}
                    </span>
                    <span className="font-extrabold text-sm text-[#26332B]">
                      {quantityInput}{' '}
                      {quantityUnit === 'quintal'
                        ? isHi
                          ? 'क्विंटल'
                          : 'Quintal'
                        : quantityUnit === 'ton'
                        ? isHi
                          ? 'टन'
                          : 'Ton'
                        : 'kg'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-[#EEF3E8]">
                    <span className="text-[10px] text-[#68736B] block">
                      {isHi ? 'विक्रय दर' : 'Listing Rate'}
                    </span>
                    <span className="font-extrabold text-sm text-[#245C3A]">
                      ₹{priceInput}/{priceUnit === 'quintal' ? (isHi ? 'क्विंटल' : 'q') : 'kg'}
                    </span>
                    <span className="text-[10px] text-[#68736B] block">
                      ({pricingType === 'fixed' ? (isHi ? 'स्थिर' : 'Fixed') : (isHi ? 'बातचीत योग्य' : 'Negotiable')})
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-[#EEF3E8] col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-[#68736B] block">
                      {isHi ? 'मंडी मॉडल भाव' : 'Mandi Reference'}
                    </span>
                    <span className="font-bold text-xs text-[#26332B]">
                      {isMandiAvailable && mandiModalQuintal > 0
                        ? `₹${mandiModalQuintal}/क्विंटल`
                        : isHi
                        ? 'अनुपलब्ध'
                        : 'Unavailable'}
                    </span>
                  </div>
                </div>

                {/* Verification Badges */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-[#EEF3E8] text-[11px]">
                  <span className="px-2.5 py-1 rounded-lg bg-[#EEF3E8] text-[#245C3A] font-bold flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5" />
                    {isHi ? 'लाइव कैमरा सत्यापित ✓' : 'Live Camera Verified ✓'}
                  </span>
                  {coordinates && (
                    <span className="px-2.5 py-1 rounded-lg bg-[#EEF3E8] text-[#245C3A] font-bold flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {isHi ? 'खेत जीपीएस टैग ✓' : 'GPS Geotagged ✓'}
                    </span>
                  )}
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-[#EEF3E8] text-[#26332B] font-semibold">
                    {qualityClassification === 'PREMIUM'
                      ? isHi
                        ? 'प्रीमियम श्रेणी (+5% मंडी दर)'
                        : 'Premium Tier (+5% Mandi Rate)'
                      : isHi
                      ? 'मानक दर (मंडी दर)'
                      : 'Standard Tier (Mandi Rate)'}
                  </span>
                </div>

                {description && (
                  <div className="pt-2 border-t border-[#EEF3E8]">
                    <span className="text-[10px] text-[#68736B] block">
                      {isHi ? 'विवरण' : 'Description'}
                    </span>
                    <p className="text-xs text-[#26332B] italic line-clamp-2">"{description}"</p>
                  </div>
                )}
              </div>

              {/* Security & Verification Note */}
              <div className="p-3.5 rounded-xl bg-[#EEF3E8] border border-[#5F8F45]/20 text-xs text-[#245C3A] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-[#5F8F45]" />
                <span>
                  {isHi
                    ? 'आपकी फसल किसानसेतु डेटाबेस में सुरक्षित रूप से दर्ज होगी और सत्यापित थोक खरीदारों को दिखेगी।'
                    : 'Crop will be persisted to KisanSetu database and published directly to verified buyers.'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* BOTTOM ACTION BAR (Back & Next / Submit) - STICKY & TOUCH-FRIENDLY       */}
        {/* ========================================================================= */}
        <div className="p-3.5 sm:p-5 border-t border-[#EEF3E8] bg-white flex items-center justify-between gap-3 shrink-0">
          {/* Back Button */}
          <button
            id="btn-add-crop-back"
            type="button"
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`min-h-[44px] px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              currentStep === 1
                ? 'opacity-40 cursor-not-allowed border-gray-200 text-gray-400 bg-gray-50'
                : 'border-gray-200 text-[#26332B] hover:bg-[#EEF3E8] hover:border-[#245C3A]'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{isHi ? 'पीछे' : 'Back'}</span>
          </button>

          {/* Next / Submit Button */}
          {currentStep < 6 ? (
            <button
              id="btn-add-crop-next"
              type="button"
              onClick={handleNext}
              className="min-h-[44px] px-6 sm:px-7 py-2.5 rounded-xl bg-[#245C3A] hover:bg-[#1B432B] text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer hover:scale-102"
            >
              <span>{isHi ? 'आगे बढ़ें' : 'Next Step'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              id="btn-add-crop-submit"
              type="button"
              onClick={handleSubmitListing}
              className="min-h-[48px] px-6 sm:px-8 py-2.5 rounded-xl bg-gradient-to-r from-[#245C3A] to-[#1B432B] hover:from-[#1E4D31] hover:to-[#143321] text-white text-xs sm:text-sm font-black shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer hover:scale-102"
            >
              <CheckCircle2 className="w-5 h-5 text-[#D6A63A]" />
              <span>{isHi ? 'फसल लिस्ट करें ✓' : 'List Crop on KisanSetu ✓'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
