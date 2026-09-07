import { GoogleGenAI, Type } from '@google/genai';

export interface AiGradingRequest {
  images: string[]; // Base64 data URLs or standard base64 strings
  cropName?: string;
  variety?: string;
  category?: string;
  language?: 'en' | 'hi';
}

export interface AiGradingResponse {
  success: boolean;
  isReliable: boolean;
  unreliableReason?: string;
  detectedCrop: string;
  detectedVariety: string;
  classification: 'PREMIUM' | 'STANDARD';
  grade: 'PREMIUM' | 'STANDARD' | 'A' | 'B' | 'C';
  isManual?: boolean;
  confidence?: number;
  confidenceScore?: number;
  grainUniformityScore?: number;
  detectedFeatures?: string[];
  summaryText?: string;
  visualIndicators: string[];
  potentialIssues: string[];
  recommendation: string;
  observations: string;
  qualityFactors?: {
    uniformity: number; // 0 - 100
    cleanliness: number; // 0 - 100
    colorVibrancy: number; // 0 - 100
    damageLevel: 'Low' | 'Moderate' | 'High';
  };
  disclaimer: string;
  timestamp: string;
}

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
  if (!aiClient && apiKey) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

/**
 * Extracts pure base64 data and mimeType from data URL, HTTP/HTTPS URL, or raw base64 string
 */
async function prepareImagePayload(imageStr: string): Promise<{ mimeType: string; data: string } | null> {
  if (!imageStr || typeof imageStr !== 'string') return null;
  const trimmed = imageStr.trim();

  // 1. Data URL (e.g. data:image/jpeg;base64,...)
  const match = trimmed.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
  if (match) {
    return { mimeType: match[1], data: match[2] };
  }

  // 2. HTTP / HTTPS URL (Fetch buffer and convert to base64)
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    try {
      const response = await fetch(trimmed);
      if (!response.ok) return null;
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const contentType = response.headers.get('content-type') || 'image/jpeg';
      const mimeType = contentType.split(';')[0].trim() || 'image/jpeg';
      return {
        mimeType,
        data: buffer.toString('base64'),
      };
    } catch (e) {
      console.warn('[AI Crop Grading] Failed to fetch remote image URL:', trimmed, e);
      return null;
    }
  }

  // 3. Raw base64 string
  const cleaned = trimmed.replace(/\s+/g, '');
  if (/^[A-Za-z0-9+/=]+$/.test(cleaned) && cleaned.length > 50) {
    return { mimeType: 'image/jpeg', data: cleaned };
  }

  return null;
}

export async function gradeCropImage(req: AiGradingRequest): Promise<AiGradingResponse> {
  const { images, cropName = '', variety = '', language = 'en' } = req;
  const isHindi = language === 'hi';
  const timestamp = new Date().toISOString();

  if (!images || images.length === 0) {
    return {
      success: false,
      isReliable: false,
      unreliableReason: isHindi
        ? 'कृपया फसल की गुणवत्ता विश्लेषण के लिए कैमरे से फोटो लें।'
        : 'Please capture a crop photo for quality assessment.',
      detectedCrop: cropName || 'Unknown',
      detectedVariety: variety || 'Standard',
      classification: 'STANDARD',
      grade: 'STANDARD',
      visualIndicators: [],
      potentialIssues: [isHindi ? 'कोई फोटो उपलब्ध नहीं' : 'No photo provided'],
      recommendation: isHindi ? 'कैमरे से फोटो लें' : 'Capture photo for analysis',
      observations: '',
      disclaimer: isHindi
        ? 'गुणवत्ता मूल्यांकन कैमरे द्वारा खींची गई वास्तविक फोटो के दृश्य संकेतों पर आधारित है।'
        : 'Quality assessment is based on visual indicators from captured camera photos.',
      timestamp,
    };
  }

  const ai = getAiClient();

  if (ai) {
    try {
      const extracted = await Promise.all(images.slice(0, 3).map((img) => prepareImagePayload(img)));
      const imageParts = extracted
        .filter((part): part is { mimeType: string; data: string } => part !== null && part.data.length > 20)
        .map((part) => ({
          inlineData: {
            mimeType: part.mimeType,
            data: part.data,
          },
        }));

      if (imageParts.length === 0) {
        throw new Error('No valid image payloads extracted');
      }

      const promptText = `
You are an expert Agricultural Commodity Visual Assessor inspecting farmer camera-captured crop photos for KisanSetu marketplace.
The farmer claims this crop is: "${cropName || 'Unspecified'}" and variety: "${variety || 'Unspecified'}".
Target Language for text fields: ${isHindi ? 'Hindi' : 'English'}.

CRITICAL GUIDELINES:
1. Carefully inspect the visual features in the provided camera-captured image(s).
2. Check if the image clearly shows agricultural produce/crops (grains, paddy/rice, maize, pulses/chana).
3. If the image is blurred, too dark, unreadable, out of focus, or NOT an agricultural crop, you MUST set isReliable: false and provide a helpful unreliableReason ("${isHindi ? 'छवि स्पष्ट नहीं है या फसल दृश्यमान नहीं है। कृपया स्पष्ट फोटो लें।' : 'Unable to reliably analyze this image. Please capture a clearer crop image.'}"). Do NOT fabricate an assessment.
4. If the image is clear and gradable:
   - Identify detectedCrop and detectedVariety.
   - Assign exactly ONE Quality Classification:
     - "PREMIUM": Outstanding visual quality, high uniformity, clean lustrous grain surfaces, minimal/zero visible damage or discoloration or foreign particles.
     - "STANDARD": Normal commercial mandi merchantable quality, acceptable uniformity, standard market condition, minor cosmetic variations.
   - visualIndicators: 2 to 4 authentic visual traits observed from the photo (e.g. "Uniform grain size", "Clean lustrous kernels", "Sound physical condition", "Low visible damage").
   - potentialIssues: 0 to 2 minor issues observed (e.g. "Minor size variation", "Few broken grains").
   - recommendation: A concise sentence (e.g. "${isHindi ? 'प्रीमियम ई-मंडी संदर्भ दर के लिए उपयुक्त।' : 'Suitable for premium mandi reference pricing.'}").
   - observations: 1-2 sentence detailed summary of actual visual traits.
5. Do NOT invent arbitrary numeric percentage scores or fake certifications.

Respond strictly in JSON matching the schema.
`;

      const modelName = process.env.AI_MODEL || 'gemini-2.5-flash';
      const response = await ai.models.generateContent({
        model: modelName,
        contents: {
          parts: [...imageParts, { text: promptText }],
        },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isReliable: { type: Type.BOOLEAN },
              unreliableReason: { type: Type.STRING },
              detectedCrop: { type: Type.STRING },
              detectedVariety: { type: Type.STRING },
              classification: { type: Type.STRING, enum: ['PREMIUM', 'STANDARD'] },
              visualIndicators: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              potentialIssues: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              recommendation: { type: Type.STRING },
              observations: { type: Type.STRING },
            },
            required: [
              'isReliable',
              'detectedCrop',
              'detectedVariety',
              'classification',
              'visualIndicators',
              'potentialIssues',
              'recommendation',
              'observations',
            ],
          },
        },
      });

      const text = response.text?.trim() || '{}';
      const parsed = JSON.parse(text);

      const isReliable = parsed.isReliable ?? true;
      const classification = (parsed.classification === 'PREMIUM' ? 'PREMIUM' : 'STANDARD') as 'PREMIUM' | 'STANDARD';
      const visualIndicators = Array.isArray(parsed.visualIndicators) && parsed.visualIndicators.length > 0
        ? parsed.visualIndicators
        : isHindi
        ? ['अच्छा दाना स्वरूप', 'समान आकार व रंग', 'स्वच्छ सतह', 'कम दृश्यमान क्षति']
        : ['Good appearance', 'Uniform size & color', 'Clean surface', 'Low visible damage'];
      const potentialIssues = Array.isArray(parsed.potentialIssues) ? parsed.potentialIssues : [];
      const recommendation = parsed.recommendation || (classification === 'PREMIUM'
        ? (isHindi ? 'प्रीमियम ई-मंडी दर के लिए उपयुक्त।' : 'Eligible for premium reference pricing.')
        : (isHindi ? 'मानक मंडी दर के अनुसार उपयुक्त।' : 'Suitable for standard mandi reference pricing.'));
      const observations = parsed.observations || (isHindi ? 'दृश्य निरीक्षण में उत्पाद अच्छी स्थिति में है।' : 'Visual inspection shows sound physical quality.');

      return {
        success: isReliable,
        isReliable,
        unreliableReason: isReliable ? undefined : parsed.unreliableReason || (isHindi ? 'छवि गुणवत्ता अपर्याप्त है।' : 'Quality analysis could not be completed at this time.'),
        detectedCrop: parsed.detectedCrop || cropName || 'Crop',
        detectedVariety: parsed.detectedVariety || variety || 'Standard Variety',
        classification: isReliable ? classification : 'STANDARD',
        grade: isReliable ? classification : 'STANDARD',
        visualIndicators,
        detectedFeatures: visualIndicators,
        potentialIssues,
        recommendation,
        observations,
        summaryText: observations || recommendation,
        disclaimer: isHindi
          ? 'गुणवत्ता मूल्यांकन कैमरे द्वारा खींची गई वास्तविक फोटो के दृश्य संकेतों पर आधारित है।'
          : 'Quality assessment is based on visual indicators from captured camera photos.',
        timestamp,
      };
    } catch (error) {
      console.warn('[AI Crop Grading] Gemini API call error or quota exceeded:', error);
    }
  }

  // Strict non-fabrication rule (Mandate PART 13):
  // If AI analysis is unavailable, unconfigured, quota exhausted, network failure, or invalid response:
  // Return: success: false, isReliable: false. Do NOT automatically assign PREMIUM.
  const fallbackCrop = cropName || (isHindi ? 'फसल' : 'Crop');
  const fallbackVariety = variety || (isHindi ? 'मानक' : 'Standard');

  return {
    success: false,
    isReliable: false,
    unreliableReason: isHindi
      ? 'गुणवत्ता विश्लेषण इस समय पूरा नहीं हो सका।'
      : 'Quality analysis could not be completed at this time.',
    detectedCrop: fallbackCrop,
    detectedVariety: fallbackVariety,
    classification: 'STANDARD',
    grade: 'STANDARD',
    visualIndicators: [],
    detectedFeatures: [],
    potentialIssues: [isHindi ? 'एआई सेवा अनुपलब्ध' : 'AI analysis temporarily unavailable'],
    recommendation: isHindi
      ? 'यदि आवश्यक हो तो किसान द्वारा मैन्युअल वर्गीकरण चुनें।'
      : 'You may proceed with manual classification.',
    observations: isHindi
      ? 'गुणवत्ता विश्लेषण इस समय पूरा नहीं हो सका।'
      : 'Quality analysis could not be completed at this time.',
    summaryText: isHindi
      ? 'गुणवत्ता विश्लेषण इस समय पूरा नहीं हो सका।'
      : 'Quality analysis could not be completed at this time.',
    disclaimer: isHindi
      ? 'गुणवत्ता मूल्यांकन कैमरे द्वारा खींची गई वास्तविक फोटो के दृश्य संकेतों पर आधारित है।'
      : 'Quality assessment is based on visual indicators from captured camera photos.',
    timestamp,
  };
}
