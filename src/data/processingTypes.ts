import { ProcessingTypeOption } from '../types/processing';

export const PROCESSING_TYPE_CONFIGS: ProcessingTypeOption[] = [
  // 1. Wheat
  {
    id: 'wheat-milling-atta',
    nameEn: 'Flour Chakki Milling (Whole Wheat Atta)',
    nameHi: 'आटा चक्की पिसाई (शुद्ध गेहूं का आटा)',
    category: 'Milling',
    targetProductNameEn: 'Stone-Ground Whole Wheat Atta',
    targetProductNameHi: 'पत्थर की चक्की का शुद्ध गेहूं आटा',
    typicalYieldPercent: 78,
    typicalProcessingCostPerKg: 3.5,
    recommendedGrade: 'A+',
    packagingOptionsEn: ['10 kg Jute Bag', '25 kg Polypropylene Bag', '50 kg Polypropylene Bag'],
    packagingOptionsHi: ['10 किग्रा जूट थैला', '25 किग्रा पीपी बोरी', '50 किग्रा पीपी बोरी'],
    shelfLifeMonths: 4,
    descriptionEn: 'Cold-ground whole wheat flour preserving natural germ and bran nutrients without chemical bleaching.',
    descriptionHi: 'प्राकृतिक चोकर और पोषक तत्वों से भरपूर बिना केमिकल ब्लीच किया हुआ शुद्ध चक्की आटा।',
    allowedCrops: ['Wheat', 'गेहूं', 'Sharbati Wheat', 'Durum Wheat'],
  },
  {
    id: 'wheat-semolina-suji',
    nameEn: 'Semolina / Suji Extraction',
    nameHi: 'सूजी / रवा निष्कर्षण',
    category: 'Milling',
    targetProductNameEn: 'Granular Coarse Suji (Semolina)',
    targetProductNameHi: 'दानेदार दरदरी सूजी (रवा)',
    typicalYieldPercent: 65,
    typicalProcessingCostPerKg: 4.0,
    recommendedGrade: 'A',
    packagingOptionsEn: ['5 kg Pouch', '25 kg Bag', '50 kg Bag'],
    packagingOptionsHi: ['5 किग्रा पाउच', '25 किग्रा बोरी', '50 किग्रा बोरी'],
    shelfLifeMonths: 6,
    descriptionEn: 'High-gluten granular semolina purified from hard durum wheat kernels.',
    descriptionHi: 'कठोर गेहूं के दानों से शुद्ध की गई उच्च प्रोटीन दानेदार सूजी।',
    allowedCrops: ['Wheat', 'गेहूं', 'Sharbati Wheat', 'Durum Wheat'],
  },

  // 2. Paddy / Rice
  {
    id: 'paddy-milling-rice',
    nameEn: 'Rice Milling & Silky Polishing',
    nameHi: 'धान की कुटाई व पॉलिश (चावल)',
    category: 'Milling',
    targetProductNameEn: 'Aged Long-Grain Milled Rice',
    targetProductNameHi: 'पुराना लंबा दाना कुटा हुआ चावल',
    typicalYieldPercent: 68,
    typicalProcessingCostPerKg: 3.0,
    recommendedGrade: 'A+',
    packagingOptionsEn: ['10 kg Bag', '25 kg Bag', '50 kg Bag'],
    packagingOptionsHi: ['10 किग्रा बोरी', '25 किग्रा बोरी', '50 किग्रा बोरी'],
    shelfLifeMonths: 12,
    descriptionEn: 'De-husked and graded long-grain rice with low broken percentage (<2%).',
    descriptionHi: 'छिलका उतरा, ग्रेडेड और कम टूटन (<2%) वाला उच्च गुणवत्ता का चावल।',
    allowedCrops: ['Rice', 'Paddy', 'धान', 'चावल', 'Basmati Rice', 'Non-Basmati Rice'],
  },
  {
    id: 'paddy-flaking-poha',
    nameEn: 'Flattened Rice / Poha Processing',
    nameHi: 'पोहा / चिड़वा निर्माण',
    category: 'Flaking',
    targetProductNameEn: 'Thick Pressed Rice Flakes (Poha)',
    targetProductNameHi: 'मोटा शुद्ध पोहा (चिड़वा)',
    typicalYieldPercent: 62,
    typicalProcessingCostPerKg: 4.5,
    recommendedGrade: 'A',
    packagingOptionsEn: ['5 kg Pouch', '20 kg Bag'],
    packagingOptionsHi: ['5 किग्रा पाउच', '20 किग्रा बोरी'],
    shelfLifeMonths: 6,
    descriptionEn: 'Parboiled and rolled nutritious rice flakes, ideal for commercial breakfast packaging.',
    descriptionHi: 'उबाले और रोल किए गए पौष्टिक चावल के गुच्छे (पोहा)।',
    allowedCrops: ['Rice', 'Paddy', 'धान', 'चावल', 'Basmati Rice'],
  },

  // 3. Maize
  {
    id: 'maize-milling-flour',
    nameEn: 'Maize Milling (Makki Atta & Grits)',
    nameHi: 'मक्का पिसाई (मक्की का आटा व दलिया)',
    category: 'Milling',
    targetProductNameEn: 'Sun-Dried Yellow Corn Flour (Makki Atta)',
    targetProductNameHi: 'धूप में सूखा पीला मक्की का आटा',
    typicalYieldPercent: 75,
    typicalProcessingCostPerKg: 3.0,
    recommendedGrade: 'A',
    packagingOptionsEn: ['10 kg Bag', '25 kg Bag'],
    packagingOptionsHi: ['10 किग्रा बोरी', '25 किग्रा बोरी'],
    shelfLifeMonths: 4,
    descriptionEn: 'Stone-milled yellow corn flour with retained sweet corn aroma and natural fiber.',
    descriptionHi: 'स्वादिष्ट और रेशेदार पीले दानों से पिसा हुआ शुद्ध मक्के का आटा।',
    allowedCrops: ['Maize', 'Corn', 'मक्का', 'मक्की'],
  },
  {
    id: 'maize-degerming-grits',
    nameEn: 'Maize Degerming & Corn Grits Milling',
    nameHi: 'मक्का डी-जर्मिंग व कॉर्न ग्रिट्स पिसाई',
    category: 'Milling',
    targetProductNameEn: 'High-Purity Brewer & Snack Grade Corn Grits',
    targetProductNameHi: 'उच्च गुणवत्ता कॉर्न ग्रिट्स व मक्का दलिया',
    typicalYieldPercent: 72,
    typicalProcessingCostPerKg: 3.2,
    recommendedGrade: 'A+',
    packagingOptionsEn: ['10 kg Bag', '25 kg Poly Bag', '50 kg Jute Bag'],
    packagingOptionsHi: ['10 किग्रा बैग', '25 किग्रा पॉली बैग', '50 किग्रा जूट बोरी'],
    shelfLifeMonths: 9,
    descriptionEn: 'Degermed yellow maize processed into uniform coarse grits and fine corn meal for food processors.',
    descriptionHi: 'जर्म निकाला हुआ छना मक्का ग्रिट्स व शुद्ध मक्का दलिया।',
    allowedCrops: ['Maize', 'मक्का', 'Corn', 'Yellow Maize'],
  },

  // 4. Pulses (Chana, Moong, Urad, Tur/Arhar, Masoor)
  {
    id: 'pulses-dal-splitting',
    nameEn: 'Dal Splitting, De-husking & Grading',
    nameHi: 'दाल मिलिंग (दराई, छिलका उतारना व ग्रेडिंग)',
    category: 'Dal Processing',
    targetProductNameEn: 'Unpolished Split Washed Dal',
    targetProductNameHi: 'अनपॉलिश्ड धुली/छिलका दाल',
    typicalYieldPercent: 74,
    typicalProcessingCostPerKg: 3.5,
    recommendedGrade: 'A+',
    packagingOptionsEn: ['5 kg Pouch', '25 kg Bag', '50 kg Bag'],
    packagingOptionsHi: ['5 किग्रा पाउच', '25 किग्रा बोरी', '50 किग्रा बोरी'],
    shelfLifeMonths: 9,
    descriptionEn: 'Cleaned, graded, de-stoned, and split pulse dal without artificial polishing wax or colors.',
    descriptionHi: 'बिना किसी कृत्रिम पॉलिश या रंग की, पत्थर रहित शुद्ध साफ दाल।',
    allowedCrops: ['Chana', 'चना', 'Moong', 'मूंग', 'Urad', 'उड़द', 'Arhar', 'Tur', 'तुअर', 'अरहर', 'Masoor', 'मसूर', 'Pulses'],
  },
  {
    id: 'chana-besan-milling',
    nameEn: 'Gram Flour (Besan) Milling',
    nameHi: 'चना दाल बेसन पिसाई',
    category: 'Milling',
    targetProductNameEn: 'Pure Micro-Milled Chana Dal Besan',
    targetProductNameHi: 'शुद्ध चना दाल का बारीक बेसन',
    typicalYieldPercent: 72,
    typicalProcessingCostPerKg: 4.0,
    recommendedGrade: 'A',
    packagingOptionsEn: ['1 kg Pouch x 25', '10 kg Bag', '25 kg Bag'],
    packagingOptionsHi: ['1 किग्रा पैकेट x 25', '10 किग्रा बोरी', '25 किग्रा बोरी'],
    shelfLifeMonths: 4,
    descriptionEn: 'Finely ground 100% pure chickpea flour, aromatic and free from adulteration.',
    descriptionHi: '100% शुद्ध चना दाल से तैयार खुशबूदार और मिलावट मुक्त बेसन।',
    allowedCrops: ['Chana', 'चना', 'Bengal Gram', 'Pulses'],
  },
  {
    id: 'gram-milling-besan',
    nameEn: 'Chana Dal Fine Milling (Pure Besan Flour)',
    nameHi: 'चना दाल पिसाई (शुद्ध बेसन आटा)',
    category: 'Milling',
    targetProductNameEn: 'Fine-Ground Pure Chana Dal Besan',
    targetProductNameHi: 'शुद्ध दानेदार चना दाल बेसन',
    typicalYieldPercent: 88,
    typicalProcessingCostPerKg: 4.5,
    recommendedGrade: 'A+',
    packagingOptionsEn: ['1 kg Pouch', '5 kg Bag', '25 kg Polypropylene Bag'],
    packagingOptionsHi: ['1 किग्रा पैकेट', '5 किग्रा बैग', '25 किग्रा बोरी'],
    shelfLifeMonths: 6,
    descriptionEn: 'De-husked and split Bengal gram milled into aromatic, fine-mesh golden besan.',
    descriptionHi: 'छिलका उतरी शुद्ध चना दाल से तैयार महकदार उच्च गुणवत्ता वाला बेसन।',
    allowedCrops: ['Bengal Gram', 'Chana', 'चना', 'Pulses', 'दालें', 'Desi Chana'],
  },
];

/**
 * Filter agriculturally valid processing types for a given crop name or category
 */
export function getProcessingOptionsForCrop(cropName: string, category?: string): ProcessingTypeOption[] {
  const normCrop = (cropName || '').toLowerCase().trim();
  const normCat = (category || '').toLowerCase().trim();

  const matches = PROCESSING_TYPE_CONFIGS.filter((opt) => {
    return opt.allowedCrops.some((c) => {
      const target = c.toLowerCase().trim();
      return normCrop.includes(target) || target.includes(normCrop) || (normCat && normCat.includes(target));
    });
  });

  // If crop has no specific match, fallback to a general milling/cleaning option suitable for its category
  if (matches.length === 0) {
    if (normCat.includes('pulse') || normCrop.includes('chana') || normCrop.includes('dal')) {
      return [PROCESSING_TYPE_CONFIGS[4]]; // Dal processing
    }
    return [PROCESSING_TYPE_CONFIGS[0]]; // Wheat/Grain milling
  }

  return matches;
}

/**
 * Calculate processing yield percentage and processing loss in kg
 */
export function calculateYieldAndLoss(
  inputKg: number,
  outputKg: number
): { yieldPercent: number; lossKg: number } {
  if (inputKg <= 0 || outputKg < 0) {
    return { yieldPercent: 0, lossKg: 0 };
  }
  const lossKg = Math.max(0, Number((inputKg - outputKg).toFixed(2)));
  const yieldPercent = Math.min(100, Math.max(0, Number(((outputKg / inputKg) * 100).toFixed(1))));
  return { yieldPercent, lossKg };
}

/**
 * Calculate Value-Addition Economics:
 * Processed Gross Realization - Raw Material Value - Processing Cost = Estimated Value Addition (₹)
 */
export function calculateValueAddition(
  rawQuantityKg: number,
  rawPricePerKg: number,
  outputQuantityKg: number,
  targetSellingPricePerKg: number,
  processingCostTotal: number
): {
  rawMaterialValue: number;
  processedGrossRevenue: number;
  totalCost: number;
  netValueAdditionAmount: number;
  valueAdditionPercentage: number;
} {
  const rawMaterialValue = Math.round(rawQuantityKg * rawPricePerKg);
  const processedGrossRevenue = Math.round(outputQuantityKg * targetSellingPricePerKg);
  const totalCost = rawMaterialValue + processingCostTotal;
  const netValueAdditionAmount = processedGrossRevenue - totalCost;
  const valueAdditionPercentage =
    rawMaterialValue > 0
      ? Number(((netValueAdditionAmount / rawMaterialValue) * 100).toFixed(1))
      : 0;

  return {
    rawMaterialValue,
    processedGrossRevenue,
    totalCost,
    netValueAdditionAmount,
    valueAdditionPercentage,
  };
}
