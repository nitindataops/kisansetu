import { AiGradingResponse } from '../server/geminiAiGrading';

export interface ImageCompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

/**
 * Compresses an image file client-side using HTML5 Canvas
 */
export async function compressImageFile(
  file: File,
  options: ImageCompressionOptions = {}
): Promise<string> {
  const { maxWidth = 1200, maxHeight = 1200, quality = 0.82 } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

/**
 * Calls backend server endpoint to assess crop photos with Gemini AI
 */
export async function assessCropQualityWithAi(params: {
  images: string[];
  cropName?: string;
  variety?: string;
  category?: string;
  language?: 'en' | 'hi';
}): Promise<AiGradingResponse> {
  try {
    const response = await fetch('/api/ai/grade-crop', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`AI grading server returned ${response.status}`);
    }

    const data: AiGradingResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error assessing crop quality with AI:', error);
    const isHi = params.language === 'hi';
    return {
      success: false,
      isReliable: false,
      unreliableReason: isHi
        ? 'गुणवत्ता विश्लेषण इस समय पूरा नहीं हो सका।'
        : 'Quality analysis could not be completed at this time.',
      detectedCrop: params.cropName || 'Crop',
      detectedVariety: params.variety || 'Standard Variety',
      classification: 'STANDARD',
      grade: 'STANDARD',
      visualIndicators: [],
      detectedFeatures: [],
      potentialIssues: [isHi ? 'एआई सेवा अनुपलब्ध' : 'AI service temporarily unavailable'],
      recommendation: isHi
        ? 'यदि आवश्यक हो तो किसान द्वारा मैन्युअल वर्गीकरण चुनें।'
        : 'You may proceed with manual classification.',
      observations: isHi
        ? 'गुणवत्ता विश्लेषण इस समय पूरा नहीं हो सका।'
        : 'Quality analysis could not be completed at this time.',
      summaryText: isHi
        ? 'गुणवत्ता विश्लेषण इस समय पूरा नहीं हो सका।'
        : 'Quality analysis could not be completed at this time.',
      disclaimer: isHi
        ? 'गुणवत्ता मूल्यांकन कैमरे द्वारा खींची गई वास्तविक फोटो के दृश्य संकेतों पर आधारित है।'
        : 'Quality assessment is based on visual indicators from captured camera photos.',
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Calculates pricing based on government mandi reference:
 * - Standard crop price = LIVE GOVERNMENT MANDI REFERENCE RATE
 * - Premium crop price = LIVE GOVERNMENT MANDI REFERENCE RATE + 5%
 *
 * If live government mandi data is unavailable:
 * Live price is unavailable (do NOT invent fake prices).
 */
export function calculateMandiTierPricing(
  mandiRateQuintal: number | null | undefined,
  classification: 'PREMIUM' | 'STANDARD' = 'STANDARD'
): {
  isAvailable: boolean;
  standardRateQuintal: number | null;
  premiumRateQuintal: number | null;
  suggestedRateQuintal: number | null;
  suggestedRateKg: number | null;
  premiumBonusQuintal: number | null;
  statusMessageEn: string;
  statusMessageHi: string;
} {
  if (!mandiRateQuintal || mandiRateQuintal <= 0) {
    return {
      isAvailable: false,
      standardRateQuintal: null,
      premiumRateQuintal: null,
      suggestedRateQuintal: null,
      suggestedRateKg: null,
      premiumBonusQuintal: null,
      statusMessageEn: 'Government mandi data temporarily unavailable.',
      statusMessageHi: 'सरकारी मंडी भाव वर्तमान में अनुपलब्ध है।',
    };
  }

  const standardRateQuintal = Math.round(mandiRateQuintal);
  // Premium crop price = LIVE MANDI RATE + 5%
  const premiumRateQuintal = Math.round(standardRateQuintal * 1.05);
  const premiumBonusQuintal = premiumRateQuintal - standardRateQuintal;

  const isPremium = classification === 'PREMIUM';
  const suggestedRateQuintal = isPremium ? premiumRateQuintal : standardRateQuintal;
  const suggestedRateKg = Math.round((suggestedRateQuintal / 100) * 10) / 10;

  return {
    isAvailable: true,
    standardRateQuintal,
    premiumRateQuintal,
    suggestedRateQuintal,
    suggestedRateKg,
    premiumBonusQuintal,
    statusMessageEn: isPremium
      ? `Premium Rate (Mandi + 5%): ₹${premiumRateQuintal}/quintal (includes ₹${premiumBonusQuintal}/quintal quality premium)`
      : `Standard Rate (Mandi Reference): ₹${standardRateQuintal}/quintal`,
    statusMessageHi: isPremium
      ? `प्रीमियम दर (मंडी + 5%): ₹${premiumRateQuintal}/क्विंटल (₹${premiumBonusQuintal}/क्विंटल गुणवत्ता बोनस शामिल)`
      : `मानक दर (सरकारी मंडी संदर्भ): ₹${standardRateQuintal}/क्विंटल`,
  };
}

export interface CanonicalListingPriceResult {
  classification: 'PREMIUM' | 'STANDARD';
  displayGrade: 'PREMIUM' | 'STANDARD';
  isPremium: boolean;
  pricePerKg: number;
  mandiRateQuintal: number;
  mandiRateKg: number;
  premiumRateQuintal: number;
  premiumRateKg: number;
  bonusPerKg: number;
  formattedDisplay: string;
}

/**
 * Canonical pricing calculation for ALL crop/listing cards across both dashboards:
 * STANDARD: LIVE GOVERNMENT MANDI REFERENCE RATE
 * PREMIUM: LIVE GOVERNMENT MANDI REFERENCE RATE × 1.05 (+5%)
 */
export function getListingPrice(listing: {
  pricePerKg?: number;
  currentMandiPrice?: number;
  mandiReferencePrice?: number;
  grade?: string;
  qualityClassification?: string;
  expectedPrice?: number;
}): CanonicalListingPriceResult {
  const isPrem = 
    listing.qualityClassification === 'PREMIUM' ||
    listing.grade === 'PREMIUM' ||
    listing.grade === 'A+' ||
    listing.grade === 'A';

  const classification: 'PREMIUM' | 'STANDARD' = isPrem ? 'PREMIUM' : 'STANDARD';

  // Benchmark mandi rate per quintal
  let mandiPerKg = listing.currentMandiPrice || listing.mandiReferencePrice;
  if (!mandiPerKg || mandiPerKg <= 0) {
    mandiPerKg = listing.pricePerKg ? (isPrem ? Math.round((listing.pricePerKg / 1.05) * 10) / 10 : listing.pricePerKg) : 25;
  }
  const mandiRateQuintal = Math.round(mandiPerKg * 100);
  const mandiRateKg = Math.round((mandiRateQuintal / 100) * 10) / 10;
  
  // Standard = live mandi rate
  // Premium = live mandi rate * 1.05 (+5%)
  const premiumRateQuintal = Math.round(mandiRateQuintal * 1.05);
  const premiumRateKg = Math.round((premiumRateQuintal / 100) * 10) / 10;
  
  const finalPriceKg = isPrem ? premiumRateKg : mandiRateKg;
  const bonusPerKg = isPrem ? Math.round((premiumRateKg - mandiRateKg) * 10) / 10 : 0;

  return {
    classification,
    displayGrade: classification,
    isPremium: isPrem,
    pricePerKg: finalPriceKg,
    mandiRateQuintal,
    mandiRateKg,
    premiumRateQuintal,
    premiumRateKg,
    bonusPerKg,
    formattedDisplay: `₹${finalPriceKg}/kg`,
  };
}

/**
 * Calculates suggested listing range (legacy support)
 */
export function calculateSuggestedListingRange(
  modalPriceKg: number,
  minPriceKg: number,
  maxPriceKg: number,
  grade: 'PREMIUM' | 'STANDARD' | 'A' | 'B' | 'C' = 'STANDARD'
): { minRate: number; maxRate: number; note: string } {
  if (!modalPriceKg || modalPriceKg <= 0) {
    return { minRate: 20, maxRate: 28, note: 'Standard market reference' };
  }

  const isPremium = grade === 'PREMIUM' || grade === 'A';
  if (isPremium) {
    const rate = Math.round(modalPriceKg * 1.05 * 10) / 10;
    return {
      minRate: rate,
      maxRate: Math.round(rate * 1.05 * 10) / 10,
      note: 'Premium rate (Mandi Reference + 5% Quality Premium)',
    };
  } else {
    return {
      minRate: Math.round(modalPriceKg * 10) / 10,
      maxRate: Math.round(modalPriceKg * 1.02 * 10) / 10,
      note: 'Standard rate (Live Mandi Reference Rate)',
    };
  }
}
