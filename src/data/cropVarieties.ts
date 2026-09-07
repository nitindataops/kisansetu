export interface CropVarietyInfo {
  id: string;
  name: string;
  nameHi: string;
  category: CropCategory;
  categoryHi: string;
  icon: string;
  defaultImages: string[];
  varieties: {
    id: string;
    name: string;
    nameHi: string;
    gradeReference?: string;
  }[];
  standardMoisture: string;
  standardStorage: string;
  standardDescription: string;
  standardDescriptionHi: string;
  mandiCommodityName: string; // Used to match with AGMARKNET API
}

export type CropCategory = 'Cereals / Grains' | 'Pulses';

export interface CategoryInfo {
  id: CropCategory;
  name: string;
  nameHi: string;
  icon: string;
  description: string;
  descriptionHi: string;
}

export const CROP_CATEGORIES: CategoryInfo[] = [
  {
    id: 'Cereals / Grains',
    name: 'Cereals / Grains',
    nameHi: 'अनाज / खाद्यान्न',
    icon: '🌾',
    description: 'Wheat, Rice / Paddy, Maize',
    descriptionHi: 'गेहूं, धान / चावल, मक्का',
  },
  {
    id: 'Pulses',
    name: 'Pulses',
    nameHi: 'दालें / दलहन',
    icon: '🥣',
    description: 'Pulses / Chana',
    descriptionHi: 'चना, दालें',
  },
];

export interface FarmerCropVariety {
  id: string;
  name: string;
  nameHi: string;
  gradeReference?: string;
}

export interface FarmerApprovedCrop {
  id: 'wheat' | 'rice' | 'maize' | 'pulses';
  name: string;
  nameHi: string;
  category: 'Cereals / Grains' | 'Pulses';
  categoryHi: string;
  icon: string;
  image: string;
  mandiCommodityName: string;
  varieties: FarmerCropVariety[];
  standardMoisture: string;
  standardStorage: string;
  standardDescription: string;
  standardDescriptionHi: string;
}

/**
 * EXACT 23 ACTIVE USER-FACING VARIETIES ACROSS THE 4 APPROVED CROPS:
 * 
 * Wheat (6): Sharbati, PBW 550, HD 2967, Lokwan, WH 1105, Kalyansona
 * Rice / Paddy (6): Basmati 1121, Pusa 1509, PR 126, Sona Masoori, Sharbati Paddy, Govindobhog
 * Maize (5): HQPM-1 Yellow, African Tall, DHM 117, Pioneer Hybrid, Sweet Corn Sugar-75
 * Pulses / Chana (6): Desi Chana (JG-11), Kabuli Chana (Dollar), Moong (IPM 205-7), Urad (Pant U-31), Arhar/Tur (BDN-711), Masoor (IPL-81)
 */
export const APPROVED_VARIETIES_BY_CROP = {
  wheat: [
    { id: 'sharbati', name: 'Sharbati', nameHi: 'शरबती', gradeReference: 'Premium Luster Grain' },
    { id: 'pbw_550', name: 'PBW 550', nameHi: 'पीबीडब्ल्यू 550', gradeReference: 'High Yield Mandi Standard' },
    { id: 'hd_2967', name: 'HD 2967', nameHi: 'एचडी 2967', gradeReference: 'All-India Major Bread Wheat' },
    { id: 'lokwan', name: 'Lokwan', nameHi: 'लोकवान', gradeReference: 'Golden Commercial Grade' },
    { id: 'wh_1105', name: 'WH 1105', nameHi: 'डब्ल्यूएच 1105', gradeReference: 'Disease Resistant FAQ' },
    { id: 'kalyansona', name: 'Kalyansona', nameHi: 'कल्याणसोना', gradeReference: 'Traditional High Quality' },
  ],
  rice: [
    { id: 'pusa_basmati_1121', name: 'Pusa Basmati 1121', nameHi: 'पूसा बासमती 1121', gradeReference: 'Extra Long Aromatic Grain' },
    { id: 'basmati_1509', name: '1509 Basmati', nameHi: '1509 बासमती', gradeReference: 'Early Maturing Export Grade' },
    { id: 'pr_126', name: 'PR 126', nameHi: 'पीआर 126', gradeReference: 'High Milling FAQ Grade' },
    { id: 'sona_masoori', name: 'Sona Masoori', nameHi: 'सोना मसूरी', gradeReference: 'Delicate Table Grain' },
    { id: 'ir_64', name: 'IR 64', nameHi: 'आईआर 64', gradeReference: 'Non-Basmati Staple Grain' },
    { id: 'govindabhog', name: 'Govindabhog', nameHi: 'गोविंदभोग', gradeReference: 'Heritage Sweet Aromatic' },
  ],
  maize: [
    { id: 'yellow_hybrid_hqpm_1', name: 'Yellow Hybrid (HQPM-1)', nameHi: 'येलो हाइब्रिड (HQPM-1)', gradeReference: 'High Quality Protein Maize' },
    { id: 'african_tall', name: 'African Tall', nameHi: 'अफ्रीकन टॉल', gradeReference: 'High Starch & Fodder' },
    { id: 'ganga_kaveri', name: 'Ganga Kaveri', nameHi: 'गंगा कावेरी', gradeReference: 'Hardy Commercial Yellow' },
    { id: 'sweet_corn_sugar_75', name: 'Sweet Corn (Sugar 75)', nameHi: 'स्वीट कॉर्न (शुगर 75)', gradeReference: 'Sweet Table Corn' },
    { id: 'baby_corn_g_5414', name: 'Baby Corn (G-5414)', nameHi: 'बेबी कॉर्न (G-5414)', gradeReference: 'Tender Processing Cob' },
  ],
  pulses: [
    { id: 'desi_chana_jg_11', name: 'Desi Chana (JG-11)', nameHi: 'देशी चना (JG-11)', gradeReference: 'Bold Brown Chickpea' },
    { id: 'kabuli_chana_dollar', name: 'Kabuli Chana (Dollar)', nameHi: 'काबुली चना (डॉलर)', gradeReference: 'Bold 12mm White Chickpea' },
    { id: 'moong_ipm_205_7', name: 'Moong (IPM 205-7)', nameHi: 'मूंग (IPM 205-7)', gradeReference: 'Shiny Green Gram' },
    { id: 'urad_pant_u_31', name: 'Urad (Pant U-31)', nameHi: 'उड़द (पंत U-31)', gradeReference: 'Black Gram Dal Grade' },
    { id: 'arhar_tur_bdn_711', name: 'Arhar/Tur (BDN-711)', nameHi: 'अरहर/तुअर (BDN-711)', gradeReference: 'Red Gram Dal Milling' },
    { id: 'masoor_ipl_81', name: 'Masoor (IPL-81)', nameHi: 'मसूर (IPL-81)', gradeReference: 'Bold Lentil FAQ' },
  ],
};

export const ALL_APPROVED_VARIETIES: string[] = [
  'Sharbati',
  'PBW 550',
  'HD 2967',
  'Lokwan',
  'WH 1105',
  'Kalyansona',
  'Pusa Basmati 1121',
  '1509 Basmati',
  'PR 126',
  'Sona Masoori',
  'IR 64',
  'Govindabhog',
  'Yellow Hybrid (HQPM-1)',
  'African Tall',
  'Ganga Kaveri',
  'Sweet Corn (Sugar 75)',
  'Baby Corn (G-5414)',
  'Desi Chana (JG-11)',
  'Kabuli Chana (Dollar)',
  'Moong (IPM 205-7)',
  'Urad (Pant U-31)',
  'Arhar/Tur (BDN-711)',
  'Masoor (IPL-81)',
];

/**
 * STRICT AUTHORITATIVE FARMER CROP DATASET
 * Contains ONLY the 4 approved KisanSetu farmer commodities:
 * 1. Wheat
 * 2. Rice / Paddy
 * 3. Maize
 * 4. Pulses / Chana
 * With exactly the 23 varieties and NO 'Other' options.
 */
export const FARMER_APPROVED_CROPS: FarmerApprovedCrop[] = [
  {
    id: 'wheat',
    name: 'Wheat',
    nameHi: 'गेहूं',
    category: 'Cereals / Grains',
    categoryHi: 'अनाज / खाद्यान्न',
    icon: '🌾',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80',
    mandiCommodityName: 'Wheat',
    varieties: APPROVED_VARIETIES_BY_CROP.wheat,
    standardMoisture: '11.0% - 12.0%',
    standardStorage: 'Moisture-proof clean HDPE bags in ventilated godown',
    standardDescription: 'Golden lustrous grains, free from weevil damage and foreign matter. High protein content.',
    standardDescriptionHi: 'चमकदार सुनहरे दाने, कीट क्षति और कंकड़-कचरे से मुक्त। उच्च प्रोटीन और अच्छी चपाती गुणवत्ता।',
  },
  {
    id: 'rice',
    name: 'Rice / Paddy',
    nameHi: 'चावल / धान',
    category: 'Cereals / Grains',
    categoryHi: 'अनाज / खाद्यान्न',
    icon: '🍚',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
    mandiCommodityName: 'Paddy(Dhan)(Common)',
    varieties: APPROVED_VARIETIES_BY_CROP.rice,
    standardMoisture: '13.0% - 14.0%',
    standardStorage: 'Elevated wooden dunnage pallet storage in dry warehouse',
    standardDescription: 'Slender, long grain paddy with uniform hulling maturity and minimal broken content.',
    standardDescriptionHi: 'पतला, लंबा दाना, एकसमान पकने वाला धान, कम टूटन और उच्च खुशबूदार गुणवत्ता।',
  },
  {
    id: 'maize',
    name: 'Maize',
    nameHi: 'मक्का',
    category: 'Cereals / Grains',
    categoryHi: 'अनाज / खाद्यान्न',
    icon: '🌽',
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&auto=format&fit=crop&q=80',
    mandiCommodityName: 'Maize',
    varieties: APPROVED_VARIETIES_BY_CROP.maize,
    standardMoisture: '12.0% - 13.5%',
    standardStorage: 'Dry aeration silos or ventilated grain bags',
    standardDescription: 'Bright yellow kernels, well-dried with optimal starch and low aflatoxin index.',
    standardDescriptionHi: 'चमकदार पीले दाने, उचित धूप में सूखे, स्टार्च और पोल्ट्री/फीड के लिए उपयुक्त।',
  },
  {
    id: 'pulses',
    name: 'Pulses / Chana',
    nameHi: 'दालें / चना',
    category: 'Pulses',
    categoryHi: 'दालें / दलहन',
    icon: '🥣',
    image: '/images/crops/chana_pulses.jpg',
    mandiCommodityName: 'Bengal Gram(Gram)(Whole)',
    varieties: APPROVED_VARIETIES_BY_CROP.pulses,
    standardMoisture: '9.5% - 11.0%',
    standardStorage: 'Treated hermetic bags in cool, dry warehouse',
    standardDescription: 'Clean, sound whole pulse grains, uniform sorting and free from bruchid pests.',
    standardDescriptionHi: 'साफ, घुन-मुक्त साबुत दलहन दाने, एकसमान छंटाई और उच्च प्रोटीन गुणवत्ता।',
  },
];

export const CROP_VARIETIES_DATABASE: CropVarietyInfo[] = [
  {
    id: 'wheat',
    name: 'Wheat',
    nameHi: 'गेहूं',
    category: 'Cereals / Grains',
    categoryHi: 'अनाज / खाद्यान्न',
    icon: '🌾',
    mandiCommodityName: 'Wheat',
    defaultImages: [
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1543257580-7269da773bf5?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
    ],
    varieties: APPROVED_VARIETIES_BY_CROP.wheat,
    standardMoisture: '11.0% - 12.0%',
    standardStorage: 'Moisture-proof clean HDPE bags in ventilated godown',
    standardDescription: 'Golden lustrous grains, free from weevil damage and foreign matter. High protein content.',
    standardDescriptionHi: 'चमकदार सुनहरे दाने, कीट क्षति और कंकड़-कचरे से मुक्त। उच्च प्रोटीन और अच्छी चपाती गुणवत्ता।',
  },
  {
    id: 'rice_paddy',
    name: 'Rice / Paddy',
    nameHi: 'धान / चावल',
    category: 'Cereals / Grains',
    categoryHi: 'अनाज / खाद्यान्न',
    icon: '🍚',
    mandiCommodityName: 'Paddy(Dhan)(Common)',
    defaultImages: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=800&auto=format&fit=crop&q=80',
    ],
    varieties: APPROVED_VARIETIES_BY_CROP.rice,
    standardMoisture: '13.0% - 14.0%',
    standardStorage: 'Elevated wooden dunnage pallet storage in dry warehouse',
    standardDescription: 'Slender, long grain paddy with uniform hulling maturity and minimal broken content.',
    standardDescriptionHi: 'पतला, लंबा दाना, एकसमान पकने वाला धान, कम टूटन और उच्च खुशबूदार गुणवत्ता।',
  },
  {
    id: 'maize',
    name: 'Maize',
    nameHi: 'मक्का',
    category: 'Cereals / Grains',
    categoryHi: 'अनाज / खाद्यान्न',
    icon: '🌽',
    mandiCommodityName: 'Maize',
    defaultImages: [
      'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&auto=format&fit=crop&q=80',
    ],
    varieties: APPROVED_VARIETIES_BY_CROP.maize,
    standardMoisture: '12.0% - 13.5%',
    standardStorage: 'Dry aeration silos or ventilated grain bags',
    standardDescription: 'Bright yellow kernels, well-dried with optimal starch and low aflatoxin index.',
    standardDescriptionHi: 'चमकदार पीले दाने, उचित धूप में सूखे, स्टार्च और पोल्ट्री/फीड के लिए उपयुक्त।',
  },
  {
    id: 'pulses',
    name: 'Pulses / Chana',
    nameHi: 'दालें / चना',
    category: 'Pulses',
    categoryHi: 'दालें / दलहन',
    icon: '🥣',
    mandiCommodityName: 'Bengal Gram(Gram)(Whole)',
    defaultImages: [
      '/images/crops/chana_pulses.jpg',
      '/images/crops/kabuli_chana.jpg',
    ],
    varieties: APPROVED_VARIETIES_BY_CROP.pulses,
    standardMoisture: '9.5% - 11.0%',
    standardStorage: 'Treated fumigated hermetic storage bags',
    standardDescription: 'Clean, sound whole pulse grains, uniform sorting and free from bruchid pests.',
    standardDescriptionHi: 'साफ, घुन-मुक्त साबुत दलहन दाने, एकसमान छंटाई और उच्च प्रोटीन गुणवत्ता।',
  },
];

/**
 * Strict helper to check if a crop name is one of the 4 approved farmer commodities:
 * 1. Wheat, 2. Rice, 3. Maize, 4. Pulses.
 * Explicitly rejects Tomato, Potato, Mustard, Onion, and all other non-approved crops.
 */
export function isApprovedCrop(cropName?: string): boolean {
  if (!cropName) return false;
  const lower = cropName.toLowerCase().trim();
  if (
    lower.includes('potato') ||
    lower.includes('tomato') ||
    lower.includes('tamatar') ||
    lower.includes('aaloo') ||
    lower.includes('aloo') ||
    lower.includes('mustard') ||
    lower.includes('sarson') ||
    lower.includes('rai') ||
    lower.includes('onion') ||
    lower.includes('pyaz') ||
    lower.includes('garlic') ||
    lower.includes('lahsun') ||
    lower.includes('cabbage') ||
    lower.includes('cauliflower') ||
    lower.includes('chilli') ||
    lower.includes('ginger') ||
    lower.includes('turmeric') ||
    lower.includes('soybean') ||
    lower.includes('groundnut') ||
    lower.includes('apple') ||
    lower.includes('mango') ||
    lower.includes('banana') ||
    lower.includes('grape') ||
    lower.includes('sugarcane') ||
    lower.includes('cotton') ||
    lower.includes('vegetable') ||
    lower.includes('fruit') ||
    lower.includes('spice') ||
    lower.includes('oilseed')
  ) {
    return false;
  }
  return (
    lower.includes('wheat') ||
    lower.includes('gehu') ||
    lower.includes('gehun') ||
    lower.includes('atta') ||
    lower.includes('rice') ||
    lower.includes('paddy') ||
    lower.includes('dhan') ||
    lower.includes('chawal') ||
    lower.includes('basmati') ||
    lower.includes('maize') ||
    lower.includes('makka') ||
    lower.includes('corn') ||
    lower.includes('pulse') ||
    lower.includes('chana') ||
    lower.includes('moong') ||
    lower.includes('masoor') ||
    lower.includes('arhar') ||
    lower.includes('tur') ||
    lower.includes('urad') ||
    lower.includes('dal')
  );
}

/**
 * Checks if a variety belongs to the approved list of 23 varieties
 */
export function isApprovedVariety(varietyName?: string, cropName?: string): boolean {
  if (!varietyName) return false;
  const normalized = normalizeToApprovedVariety(varietyName, cropName);
  return ALL_APPROVED_VARIETIES.includes(normalized);
}

/**
 * Maps any variety string to its canonical approved variety from the 23-variety universe
 */
export function normalizeToApprovedVariety(varietyName: string, cropName?: string): string {
  if (!varietyName) return 'Standard Mandi Grade';
  const v = varietyName.toLowerCase().trim();
  const c = (cropName || '').toLowerCase().trim();

  // Wheat (6)
  if (v.includes('sharbati') && !v.includes('paddy') && !c.includes('rice') && !c.includes('paddy')) return 'Sharbati';
  if (v.includes('550') || v.includes('pbw')) return 'PBW 550';
  if (v.includes('2967') || v.includes('hd')) return 'HD 2967';
  if (v.includes('lokwan')) return 'Lokwan';
  if (v.includes('1105') || v.includes('wh')) return 'WH 1105';
  if (v.includes('kalyan') || v.includes('sona') && (c.includes('wheat') || v.includes('wheat'))) return 'Kalyansona';

  // Rice (6)
  if (v.includes('1121') || (v.includes('basmati') && !v.includes('1509'))) return 'Basmati 1121';
  if (v.includes('1509')) return 'Pusa 1509';
  if (v.includes('126') || v.includes('pr 126') || v.includes('pr-126')) return 'PR 126';
  if (v.includes('masoori') || v.includes('masuri')) return 'Sona Masoori';
  if (v.includes('sharbati') && (v.includes('paddy') || c.includes('rice') || c.includes('paddy'))) return 'Sharbati Paddy';
  if (v.includes('govind') || v.includes('bhog')) return 'Govindobhog';

  // Maize (5)
  if (v.includes('hqpm') || (v.includes('yellow') && (c.includes('maize') || c.includes('corn')))) return 'HQPM-1 Yellow';
  if (v.includes('african') || v.includes('tall')) return 'African Tall';
  if (v.includes('117') || v.includes('dhm')) return 'DHM 117';
  if (v.includes('pioneer')) return 'Pioneer Hybrid';
  if (v.includes('sweet') || v.includes('sugar')) return 'Sweet Corn Sugar-75';

  // Pulses (6)
  if (v.includes('kabuli') || v.includes('dollar')) return 'Kabuli Chana (Dollar)';
  if (v.includes('desi') && (v.includes('chana') || c.includes('pulse') || c.includes('chana'))) return 'Desi Chana (JG-11)';
  if (v.includes('jg-11') || v.includes('bengal gram')) return 'Desi Chana (JG-11)';
  if (v.includes('moong') || v.includes('green gram')) return 'Moong (IPM 205-7)';
  if (v.includes('urad') || v.includes('black gram')) return 'Urad (Pant U-31)';
  if (v.includes('arhar') || v.includes('tur') || v.includes('pigeon pea')) return 'Arhar/Tur (BDN-711)';
  if (v.includes('masoor') || v.includes('lentil')) return 'Masoor (IPL-81)';

  // Fallback to match exact approved variety name directly
  for (const appVar of ALL_APPROVED_VARIETIES) {
    if (v.includes(appVar.toLowerCase())) {
      return appVar;
    }
  }

  return varietyName;
}

/**
 * Validates whether a listing conforms to the approved 4 crops, valid variety, active status, and positive quantity
 */
export function isValidActiveListing(listing: {
  crop?: string;
  variety?: string;
  quantity?: number;
  availableQuantityKg?: number;
  quantityKg?: number;
  status?: string;
}): boolean {
  if (!listing.crop || !isApprovedCrop(listing.crop)) return false;

  const qty = listing.quantity ?? listing.availableQuantityKg ?? listing.quantityKg ?? 0;
  if (qty <= 0) return false;

  if (listing.status) {
    const s = listing.status.toLowerCase();
    if (s.includes('sold') || s.includes('cancelled') || s.includes('inactive') || s.includes('closed') || s.includes('rejected')) {
      return false;
    }
  }

  return true;
}

export function getApprovedCropList(): FarmerApprovedCrop[] {
  return FARMER_APPROVED_CROPS;
}

export function getApprovedCropById(id: string): FarmerApprovedCrop | undefined {
  return FARMER_APPROVED_CROPS.find((c) => c.id.toLowerCase() === (id || '').toLowerCase());
}

export function getApprovedCropByName(name: string): FarmerApprovedCrop | undefined {
  if (!name) return undefined;
  const lower = name.toLowerCase().trim();
  return FARMER_APPROVED_CROPS.find(
    (c) =>
      c.name.toLowerCase() === lower ||
      c.id.toLowerCase() === lower ||
      lower.includes(c.name.toLowerCase()) ||
      c.name.toLowerCase().includes(lower)
  );
}

export function getApprovedCropVarieties(cropIdOrName: string): FarmerCropVariety[] {
  const found = getApprovedCropById(cropIdOrName) || getApprovedCropByName(cropIdOrName);
  return found ? found.varieties : [];
}
