import { GoogleGenAI, Type } from '@google/genai';
import {
  FarmerRegistryExtractedData,
  FarmerRegistryComparisonField,
  FarmerRegistryOcrProcessResult,
  FarmerRegistryValidationStatus,
  FarmerSignupComparisonInput,
} from '../types/farmerRegistryOcr';

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
  if (!aiClient && apiKey) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build-farmer-ocr',
        },
      },
    });
  }
  return aiClient;
}

/**
 * Normalizes strings for strict yet fair comparison:
 * lowercase, trimmed, collapse internal spaces, removes standard punctuation
 */
export function normalizeText(str?: string | null): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Check if two names match using token set overlap & soundex-like common phonetic spellings in Indian names
 */
function areNamesMatching(nameA: string, nameB: string): boolean {
  const normA = normalizeText(nameA);
  const normB = normalizeText(nameB);

  if (!normA || !normB) return false;
  if (normA === normB) return true;

  // Check if one contains the other (e.g. "Rajesh Kumar" and "Rajesh Kumar Sharma" or "Rajesh")
  const tokensA = normA.split(' ').filter(Boolean);
  const tokensB = normB.split(' ').filter(Boolean);

  // Common Indian honorifics / aliases to treat as equivalent
  const sanitize = (t: string) =>
    t
      .replace(/^(shri|smt|kumar|singh|devi|prasad|prashad)$/, '')
      .replace(/prashad/g, 'prasad')
      .replace(/chaudhary/g, 'choudhary')
      .replace(/yadav/g, 'yadav');

  // Exact first & last token match check
  const significantTokensA = tokensA.map(sanitize).filter(Boolean);
  const significantTokensB = tokensB.map(sanitize).filter(Boolean);

  if (significantTokensA.length > 0 && significantTokensB.length > 0) {
    const common = significantTokensA.filter((t) =>
      significantTokensB.some((b) => b === t || (t.length > 3 && (b.includes(t) || t.includes(b))))
    );
    if (common.length >= Math.min(significantTokensA.length, significantTokensB.length)) {
      return true;
    }
  }

  // Check sub-string inclusion if lengths are reasonable
  if (normA.length >= 4 && normB.length >= 4) {
    if (normA.includes(normB) || normB.includes(normA)) {
      return true;
    }
  }

  return false;
}

/**
 * Check if geographic entities (District / Tehsil / Village) match
 */
function areLocationsMatching(locA: string, locB: string): boolean {
  const normA = normalizeText(locA);
  const normB = normalizeText(locB);

  if (!normA || !normB) return false;
  if (normA === normB) return true;

  // Check if one contains the other (e.g. "Rampur" in "Rampur District" or "Suar" in "Suar Tehsil")
  if (normA.includes(normB) || normB.includes(normA)) {
    return true;
  }

  return false;
}

/**
 * Compare registry numbers (e.g. 9_176_723_116345_005019)
 */
function areRegistryNumbersMatching(regA: string, regB: string): boolean {
  const cleanA = regA.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  const cleanB = regB.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

  if (!cleanA || !cleanB) return false;
  return cleanA === cleanB || cleanA.includes(cleanB) || cleanB.includes(cleanA);
}

/**
 * Compare Aadhaar numbers (clean 12-digit or 4-digit suffix)
 */
function areAadhaarMatching(aadhA: string, aadhB: string): boolean {
  const cleanA = aadhA.replace(/\D/g, '');
  const cleanB = aadhB.replace(/\D/g, '');
  if (!cleanA || !cleanB) return true;
  if (cleanA === cleanB) return true;
  if (cleanA.endsWith(cleanB) || cleanB.endsWith(cleanA)) return true;
  return false;
}

/**
 * Extract base64 payload and ensure clean MIME type
 */
function parseBase64Data(rawInput: string, providedMime?: string): { mimeType: string; base64: string } {
  let mimeType = providedMime || 'application/pdf';
  let base64 = rawInput;

  const dataUriMatch = rawInput.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
  if (dataUriMatch) {
    mimeType = dataUriMatch[1];
    base64 = dataUriMatch[2];
  }

  return { mimeType, base64: base64.trim() };
}

/**
 * Main OCR & Document Validation Engine
 */
export async function processFarmerRegistryDocument(
  rawDocument: string,
  fileName: string,
  fileSizeBytes: number,
  signupDetails: FarmerSignupComparisonInput,
  providedMime?: string
): Promise<FarmerRegistryOcrProcessResult> {
  const DISCLAIMER =
    'दस्तावेज़ सत्यापन केवल अपलोड की गई प्रति से टेक्स्ट मिलान पर आधारित है। यह आधिकारिक सरकारी रिकॉर्ड्स की कानूनी पुष्टि नहीं करता है। (OCR validation compares document text only and does not constitute authoritative government certification).';

  // 1. File Type and Size Quality Checks
  const { mimeType, base64 } = parseBase64Data(rawDocument, providedMime);

  const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  const isAllowedMime = allowedMimeTypes.includes(mimeType.toLowerCase());

  if (!isAllowedMime) {
    return {
      success: false,
      validationStatus: 'UNREADABLE',
      statusBadgeTextHi: 'अमान्य फ़ाइल प्रारूप',
      statusBadgeTextEn: 'Unsupported File Format',
      statusTitle: 'अमान्य फ़ाइल प्रारूप (Unsupported File)',
      statusMessage: 'कृपया केवल PDF, JPG, JPEG या PNG प्रारूप में किसान रजिस्ट्री अपलोड करें।',
      warningMessage: '⚠️ केवल PDF, JPG, JPEG या PNG दस्तावेज़ स्वीकार्य हैं।',
      fileName,
      fileSizeFormatted: `${(fileSizeBytes / (1024 * 1024)).toFixed(2)} MB`,
      extractedData: {
        isFarmerRegistryDocument: false,
        isReadable: false,
        unreadableReason: `Unsupported file type ${mimeType}. Expected PDF or image.`,
        extractedAt: new Date().toISOString(),
      },
      comparisons: [],
      canProceed: false,
      disclaimer: DISCLAIMER,
    };
  }

  // 10 MB limit check
  const MAX_BYTES = 10 * 1024 * 1024;
  if (fileSizeBytes > MAX_BYTES) {
    return {
      success: false,
      validationStatus: 'UNREADABLE',
      statusBadgeTextHi: 'फ़ाइल बहुत बड़ी है',
      statusBadgeTextEn: 'File Too Large',
      statusTitle: 'दस्तावेज़ का आकार बहुत बड़ा है (File Size Exceeded)',
      statusMessage: 'फ़ाइल का आकार 10 MB से अधिक है। कृपया 10 MB से कम आकार की PDF या फ़ोटो अपलोड करें।',
      warningMessage: '⚠️ कृपया 10 MB से कम आकार का दस्तावेज़ अपलोड करें।',
      fileName,
      fileSizeFormatted: `${(fileSizeBytes / (1024 * 1024)).toFixed(2)} MB`,
      extractedData: {
        isFarmerRegistryDocument: false,
        isReadable: false,
        unreadableReason: 'File size exceeds maximum threshold of 10 MB.',
        extractedAt: new Date().toISOString(),
      },
      comparisons: [],
      canProceed: false,
      disclaimer: DISCLAIMER,
    };
  }

  if (!base64 || base64.length < 100) {
    return {
      success: false,
      validationStatus: 'UNREADABLE',
      statusBadgeTextHi: 'दस्तावेज़ खाली या अमान्य है',
      statusBadgeTextEn: 'Empty or Corrupt File',
      statusTitle: 'दस्तावेज़ खाली या अमान्य है (Empty Document)',
      statusMessage: 'दस्तावेज़ में कोई डेटा नहीं मिला या फ़ाइल क्षतिग्रस्त है। कृपया साफ़ दस्तावेज़ दोबारा अपलोड करें।',
      warningMessage: '⚠️ कृपया अपनी वास्तविक किसान रजिस्ट्री का दस्तावेज़ अपलोड करें। गलत या खाली दस्तावेज़ न अपलोड करें।',
      fileName,
      extractedData: {
        isFarmerRegistryDocument: false,
        isReadable: false,
        unreadableReason: 'Empty or truncated file content.',
        extractedAt: new Date().toISOString(),
      },
      comparisons: [],
      canProceed: false,
      disclaimer: DISCLAIMER,
    };
  }

  // 2. Call Gemini AI OCR Engine
  const ai = getAiClient();
  if (!ai) {
    // If AI service is unconfigured, provide neutral unreadable state
    return {
      success: false,
      validationStatus: 'UNREADABLE',
      statusBadgeTextHi: 'सेवा अनुपलब्ध',
      statusBadgeTextEn: 'OCR Service Unavailable',
      statusTitle: 'दस्तावेज़ पढ़ा नहीं जा सका (OCR Service Unavailable)',
      statusMessage: 'दस्तावेज़ की जानकारी पढ़ी नहीं जा सकी। कृपया साफ़ दस्तावेज़ दोबारा अपलोड करें।',
      warningMessage: '⚠️ दस्तावेज़ की जानकारी पढ़ी नहीं जा सकी। कृपया साफ़ दस्तावेज़ दोबारा अपलोड करें।',
      fileName,
      extractedData: {
        isFarmerRegistryDocument: false,
        isReadable: false,
        unreadableReason: 'AI OCR service credentials not active.',
        extractedAt: new Date().toISOString(),
      },
      comparisons: [],
      canProceed: false,
      disclaimer: DISCLAIMER,
    };
  }

  try {
    const prompt = `You are an expert Indian Identity & Agricultural Document OCR analyzer for KisanSetu.
Carefully read and analyze the attached document (PDF or image) which can be an Indian Aadhaar Card (Front or Back) or Farmer Registry / Enrollment / AgriStack record.

Document Reference Context:
1. Aadhaar Card (Front or Back):
   - Government of India / Unique Identification Authority of India (UIDAI) / आधार
   - Name of Cardholder (in English and Hindi)
   - Father's / Husband's Name (Care of / C/O or S/O or W/O)
   - 12-digit Aadhaar Number (format: XXXX XXXX XXXX or masked XXXX XXXX 1234)
   - Address / District / State / Pincode
2. Farmer Registry Enrolment Data:
   - "Farmer registry Enrolment Data" or "Farmer Enrollment number" (e.g., 9_176_723_116345_005019)
   - "Farmer Name as per Aadhaar in English" and "Farmer's Name in Local Language" (Hindi)
   - "Identifier Name in English" (Father / Husband's Name)
   - Residential Details, State, District, Tehsil, Village

Extract all legible fields strictly as printed on the document.
If a field is missing, obscured, or not present, return an empty string.

Evaluate:
1. isReadable: boolean (true if text and labels can be read; false if blurry, totally dark, completely corrupt or blank)
2. unreadableReason: reason why it's unreadable if isReadable is false
3. isFarmerRegistryDocument: boolean (true if this document is an Indian Aadhaar Card (front or back) or Farmer Registry / Enrollment / AgriStack record; false if it's a random selfie, electricity bill, receipt, blank paper, or unrelated file)
4. aadhaarNumber: 12-digit Aadhaar number or 4-digit masked number if present
5. farmerNameEnglish: name of farmer/person in English
6. farmerNameHindi: name of farmer/person in Hindi / local language
7. fatherOrIdentifierName: father / husband / C/O name in English
8. fatherOrIdentifierNameHindi: father / husband in Hindi
9. registryNumber: farmer enrollment / registration number if present
10. state: state name (e.g. UTTAR PRADESH)
11. district: district name
12. tehsil: sub-district / tehsil
13. village: village / mouza
14. landAreaTotal: total area with unit if visible
15. khataOrSurveyNumber: S No. or S/S no. if visible
16. confidenceScore: estimated readability confidence from 0.0 to 1.0`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType,
                data: base64,
              },
            },
            {
              text: prompt,
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isReadable: { type: Type.BOOLEAN },
            unreadableReason: { type: Type.STRING },
            isFarmerRegistryDocument: { type: Type.BOOLEAN },
            aadhaarNumber: { type: Type.STRING },
            farmerNameEnglish: { type: Type.STRING },
            farmerNameHindi: { type: Type.STRING },
            fatherOrIdentifierName: { type: Type.STRING },
            fatherOrIdentifierNameHindi: { type: Type.STRING },
            registryNumber: { type: Type.STRING },
            state: { type: Type.STRING },
            district: { type: Type.STRING },
            tehsil: { type: Type.STRING },
            village: { type: Type.STRING },
            landAreaTotal: { type: Type.STRING },
            landUnit: { type: Type.STRING },
            khataOrSurveyNumber: { type: Type.STRING },
            confidenceScore: { type: Type.NUMBER },
          },
          required: ['isReadable', 'isFarmerRegistryDocument'],
        },
      },
    });

    const parsedJson = JSON.parse(response.text || '{}');

    const extractedData: FarmerRegistryExtractedData = {
      farmerNameEnglish: parsedJson.farmerNameEnglish?.trim() || '',
      farmerNameHindi: parsedJson.farmerNameHindi?.trim() || '',
      fatherOrIdentifierName: parsedJson.fatherOrIdentifierName?.trim() || '',
      fatherOrIdentifierNameHindi: parsedJson.fatherOrIdentifierNameHindi?.trim() || '',
      aadhaarNumber: parsedJson.aadhaarNumber?.trim() || '',
      registryNumber: parsedJson.registryNumber?.trim() || '',
      state: parsedJson.state?.trim() || '',
      district: parsedJson.district?.trim() || '',
      tehsil: parsedJson.tehsil?.trim() || '',
      village: parsedJson.village?.trim() || '',
      landAreaTotal: parsedJson.landAreaTotal?.trim() || '',
      landUnit: parsedJson.landUnit?.trim() || 'Hectare',
      khataOrSurveyNumber: parsedJson.khataOrSurveyNumber?.trim() || '',
      isFarmerRegistryDocument: !!parsedJson.isFarmerRegistryDocument,
      isReadable: !!parsedJson.isReadable,
      unreadableReason: parsedJson.unreadableReason?.trim() || '',
      confidenceScore: typeof parsedJson.confidenceScore === 'number' ? parsedJson.confidenceScore : 0.85,
      extractedAt: new Date().toISOString(),
    };

    // 3. Document Quality & Authenticity Check
    if (!extractedData.isReadable) {
      return {
        success: false,
        validationStatus: 'UNREADABLE',
        statusBadgeTextHi: 'दस्तावेज़ स्पष्ट नहीं है',
        statusBadgeTextEn: 'Document Unreadable',
        statusTitle: 'दस्तावेज़ स्पष्ट नहीं है (Document Unreadable)',
        statusMessage: 'दस्तावेज़ स्पष्ट नहीं है। कृपया साफ़ PDF या फोटो अपलोड करें।',
        warningMessage: '⚠️ कृपया अपनी वास्तविक किसान रजिस्ट्री का दस्तावेज़ अपलोड करें। साफ़ फोटो या PDF का उपयोग करें।',
        fileName,
        fileSizeFormatted: `${(fileSizeBytes / (1024 * 1024)).toFixed(2)} MB`,
        extractedData,
        comparisons: [],
        canProceed: false,
        disclaimer: DISCLAIMER,
      };
    }

    if (!extractedData.isFarmerRegistryDocument) {
      return {
        success: false,
        validationStatus: 'SUSPICIOUS_REVIEW',
        statusBadgeTextHi: 'दस्तावेज़ संदिग्ध / अमान्य',
        statusBadgeTextEn: 'Suspicious / Requires Review',
        statusTitle: 'दस्तावेज़ की जानकारी संदिग्ध लग रही है (Requires Review)',
        statusMessage: 'दस्तावेज़ की जानकारी संदिग्ध लग रही है। कृपया वास्तविक और वैध दस्तावेज़ अपलोड करें।',
        warningMessage: '⚠️ कृपया अपनी वास्तविक किसान रजिस्ट्री का दस्तावेज़ अपलोड करें। गलत या नकली दस्तावेज़ अपलोड न करें।',
        fileName,
        fileSizeFormatted: `${(fileSizeBytes / (1024 * 1024)).toFixed(2)} MB`,
        extractedData,
        comparisons: [],
        canProceed: false,
        disclaimer: DISCLAIMER,
      };
    }

    // 4. Compare OCR Data with Signup Data
    const comparisons: FarmerRegistryComparisonField[] = [];

    // Field 1: Farmer Name
    const ocrNameCombined = [extractedData.farmerNameEnglish, extractedData.farmerNameHindi].filter(Boolean).join(' / ');
    const isNameMatched =
      areNamesMatching(signupDetails.name, extractedData.farmerNameEnglish || '') ||
      areNamesMatching(signupDetails.name, extractedData.farmerNameHindi || '');

    comparisons.push({
      field: 'name',
      labelHi: 'किसान का नाम (Farmer Name)',
      labelEn: 'Farmer Name',
      signupValue: signupDetails.name,
      ocrValue: ocrNameCombined || '(दस्तावेज़ में नहीं मिला)',
      status: isNameMatched ? 'MATCH' : 'MISMATCH',
      notes: isNameMatched ? 'नाम का मिलान हुआ' : 'दस्तावेज़ में दर्ज नाम पंजीकरण नाम से भिन्न है',
    });

    // Field 2: Father's Name
    const ocrFatherCombined = [extractedData.fatherOrIdentifierName, extractedData.fatherOrIdentifierNameHindi]
      .filter(Boolean)
      .join(' / ');
    if (signupDetails.fatherName && signupDetails.fatherName.trim()) {
      const isFatherMatched =
        areNamesMatching(signupDetails.fatherName, extractedData.fatherOrIdentifierName || '') ||
        areNamesMatching(signupDetails.fatherName, extractedData.fatherOrIdentifierNameHindi || '');

      comparisons.push({
        field: 'fatherName',
        labelHi: 'पिता / पति का नाम (Father\'s / Husband\'s Name)',
        labelEn: "Father's / Husband's Name",
        signupValue: signupDetails.fatherName,
        ocrValue: ocrFatherCombined || '(दस्तावेज़ में नहीं मिला)',
        status: isFatherMatched ? 'MATCH' : 'MISMATCH',
      });
    } else if (ocrFatherCombined) {
      comparisons.push({
        field: 'fatherName',
        labelHi: 'पिता / पति का नाम (Father\'s / Husband\'s Name)',
        labelEn: "Father's / Husband's Name",
        signupValue: 'पंजीकरण में नहीं भरा गया',
        ocrValue: ocrFatherCombined,
        status: 'DETECTED',
      });
    }

    // Field: Aadhaar Number
    let isAadhaarMatched = true;
    if (signupDetails.aadhaarNumber && signupDetails.aadhaarNumber.trim()) {
      isAadhaarMatched = areAadhaarMatching(signupDetails.aadhaarNumber, extractedData.aadhaarNumber || '');
      comparisons.push({
        field: 'aadhaarNumber',
        labelHi: 'आधार संख्या (Aadhaar Number)',
        labelEn: 'Aadhaar Number',
        signupValue: signupDetails.aadhaarNumber,
        ocrValue: extractedData.aadhaarNumber || '(दस्तावेज़ में नहीं मिला)',
        status: isAadhaarMatched ? 'MATCH' : 'MISMATCH',
        notes: isAadhaarMatched ? 'आधार संख्या सत्यापित' : 'दस्तावेज़ में भिन्न आधार संख्या है',
      });
    } else if (extractedData.aadhaarNumber) {
      comparisons.push({
        field: 'aadhaarNumber',
        labelHi: 'आधार संख्या (Aadhaar Number)',
        labelEn: 'Aadhaar Number',
        signupValue: 'पंजीकरण में स्वतः प्राप्त',
        ocrValue: extractedData.aadhaarNumber,
        status: 'DETECTED',
      });
    }

    // Field: District (optional in simplified registration)
    let isDistrictMatched = true;
    if (signupDetails.district && signupDetails.district.trim()) {
      isDistrictMatched = areLocationsMatching(signupDetails.district, extractedData.district || '');
      comparisons.push({
        field: 'district',
        labelHi: 'ज़िला (District)',
        labelEn: 'District',
        signupValue: signupDetails.district,
        ocrValue: extractedData.district || '(दस्तावेज़ में नहीं मिला)',
        status: isDistrictMatched ? 'MATCH' : 'MISMATCH',
        notes: isDistrictMatched ? 'ज़िला मिलान हुआ' : 'दस्तावेज़ का ज़िला भिन्न है',
      });
    } else if (extractedData.district) {
      comparisons.push({
        field: 'district',
        labelHi: 'ज़िला (District)',
        labelEn: 'District',
        signupValue: 'प्रोफ़ाइल में दर्ज करें',
        ocrValue: extractedData.district,
        status: 'DETECTED',
      });
    }

    // Field 4: Tehsil
    if (signupDetails.tehsil && signupDetails.tehsil.trim()) {
      const isTehsilMatched = areLocationsMatching(signupDetails.tehsil, extractedData.tehsil || '');
      comparisons.push({
        field: 'tehsil',
        labelHi: 'तहसील (Tehsil)',
        labelEn: 'Tehsil',
        signupValue: signupDetails.tehsil,
        ocrValue: extractedData.tehsil || '(दस्तावेज़ में नहीं मिला)',
        status: isTehsilMatched ? 'MATCH' : 'MISMATCH',
      });
    } else if (extractedData.tehsil) {
      comparisons.push({
        field: 'tehsil',
        labelHi: 'तहसील (Tehsil)',
        labelEn: 'Tehsil',
        signupValue: 'पंजीकरण में नहीं भरा गया',
        ocrValue: extractedData.tehsil,
        status: 'DETECTED',
      });
    }

    // Field 5: Village
    if (signupDetails.village && signupDetails.village.trim()) {
      const isVillageMatched = areLocationsMatching(signupDetails.village, extractedData.village || '');
      comparisons.push({
        field: 'village',
        labelHi: 'ग्राम (Village)',
        labelEn: 'Village',
        signupValue: signupDetails.village,
        ocrValue: extractedData.village || '(दस्तावेज़ में नहीं मिला)',
        status: isVillageMatched ? 'MATCH' : 'MISMATCH',
      });
    } else if (extractedData.village) {
      comparisons.push({
        field: 'village',
        labelHi: 'ग्राम (Village)',
        labelEn: 'Village',
        signupValue: 'पंजीकरण में नहीं भरा गया',
        ocrValue: extractedData.village,
        status: 'DETECTED',
      });
    }

    // Field 6: Registry Number
    if (signupDetails.registryNumber && signupDetails.registryNumber.trim()) {
      const isRegMatched = areRegistryNumbersMatching(signupDetails.registryNumber, extractedData.registryNumber || '');
      comparisons.push({
        field: 'registryNumber',
        labelHi: 'किसान रजिस्ट्री संख्या (Registry Number)',
        labelEn: 'Registry Number',
        signupValue: signupDetails.registryNumber,
        ocrValue: extractedData.registryNumber || '(दस्तावेज़ में नहीं मिला)',
        status: isRegMatched ? 'MATCH' : 'MISMATCH',
      });
    } else if (extractedData.registryNumber) {
      comparisons.push({
        field: 'registryNumber',
        labelHi: 'किसान रजिस्ट्री संख्या (Registry Number)',
        labelEn: 'Registry Number',
        signupValue: 'पंजीकरण में स्वतः प्राप्त',
        ocrValue: extractedData.registryNumber,
        status: 'DETECTED',
      });
    }

    // 5. Determine Overall Validation Status
    let validationStatus: FarmerRegistryValidationStatus = 'MATCHED';
    let statusBadgeTextHi = 'जानकारी का मिलान हुआ';
    let statusBadgeTextEn = 'Document Information Matched';
    let statusTitle = 'दस्तावेज़ की जानकारी आपके द्वारा दी गई जानकारी से मेल खाती है।';
    let statusMessage = 'किसान रजिस्ट्री से आपका नाम और निवास विवरण सफलतापूर्वक सत्यापित हुआ।';
    let warningMessage: string | undefined = undefined;
    let canProceed = true;

    // Check for major mismatches
    const hasNameMismatch = !isNameMatched;
    const hasDistrictMismatch = signupDetails.district ? !isDistrictMatched : false;
    const hasAadhaarMismatch = (signupDetails.aadhaarNumber && extractedData.aadhaarNumber)
      ? !areAadhaarMatching(signupDetails.aadhaarNumber, extractedData.aadhaarNumber)
      : false;

    if (hasNameMismatch || hasDistrictMismatch || hasAadhaarMismatch) {
      validationStatus = 'POSSIBLE_MISMATCH';
      statusBadgeTextHi = 'जानकारी में भिन्नता मिली';
      statusBadgeTextEn = 'Possible Information Mismatch';
      statusTitle = 'दस्तावेज़ में दी गई जानकारी आपकी जानकारी से मेल नहीं खा रही है।';
      statusMessage =
        'दस्तावेज़ में दी गई जानकारी आपकी जानकारी से मेल नहीं खा रही है। कृपया सही दस्तावेज़ अपलोड करें।';
      warningMessage = '⚠️ कृपया अपनी वास्तविक आधार या किसान पहचान दस्तावेज़ अपलोड करें। गलत या नकली दस्तावेज़ अपलोड न करें।';
      canProceed = false;
    }

    return {
      success: true,
      validationStatus,
      statusBadgeTextHi,
      statusBadgeTextEn,
      statusTitle,
      statusMessage,
      warningMessage,
      fileName,
      fileSizeFormatted: `${(fileSizeBytes / (1024 * 1024)).toFixed(2)} MB`,
      extractedData,
      comparisons,
      canProceed,
      disclaimer: DISCLAIMER,
    };
  } catch (error: any) {
    console.error('Error during Farmer Registry OCR processing:', error);
    return {
      success: false,
      validationStatus: 'UNREADABLE',
      statusBadgeTextHi: 'दस्तावेज़ पढ़ा नहीं जा सका',
      statusBadgeTextEn: 'OCR Processing Error',
      statusTitle: 'दस्तावेज़ की जानकारी पढ़ी नहीं जा सकी (Processing Error)',
      statusMessage: 'दस्तावेज़ की जानकारी पढ़ी नहीं जा सकी। कृपया साफ़ दस्तावेज़ दोबारा अपलोड करें।',
      warningMessage: '⚠️ कृपया अपनी वास्तविक किसान रजिस्ट्री का दस्तावेज़ अपलोड करें। साफ़ फोटो या PDF का उपयोग करें।',
      fileName,
      extractedData: {
        isFarmerRegistryDocument: false,
        isReadable: false,
        unreadableReason: error?.message || 'Unknown OCR processing error',
        extractedAt: new Date().toISOString(),
      },
      comparisons: [],
      canProceed: false,
      disclaimer: DISCLAIMER,
    };
  }
}
