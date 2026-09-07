import { FarmerProperty } from './landVerification';

export interface FarmerProfile {
  name: string;
  farmerId: string;
  mobile: string;
  email: string;
  address: string;
  district: string;
  tehsil: string;
  village: string;
  pincode: string;
  landAreaAcres: number;
  totalLandAcres?: number;
  soilType?: string;
  irrigationSource?: string;
  landType: string;
  primaryCrops: string[];
  aadhaarMasked: string; // Must strictly be masked, e.g. "XXXX-XXXX-8492"
  eKycStatus: 'VERIFIED ✓';
  kccStatus: 'Active';
  soilHealthStatus: string;
  memberSince: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    branchName?: string;
  };
  fatherName?: string;
  properties?: FarmerProperty[];
  farmerRegistryNumber?: string;
  farmerRegistryDocumentUrl?: string;
  farmerRegistryFileName?: string;
  farmerRegistryOcrStatus?: 'pending' | 'success' | 'failed';
  farmerRegistryVerificationStatus?: 'MATCHED' | 'POSSIBLE_MISMATCH' | 'UNREADABLE' | 'SUSPICIOUS_REVIEW';
  farmerRegistryOcrData?: any;
  farmerRegistrySubmittedAt?: string;
}

export interface CropListing {
  id: string;
  name: string;
  variety: string;
  category: string;
  quantityKg: number;
  grade: 'PREMIUM' | 'STANDARD' | 'A+' | 'A' | 'B' | 'C';
  qualityClassification?: 'PREMIUM' | 'STANDARD';
  pricingTypeTier?: 'PREMIUM' | 'STANDARD';
  isManualClassification?: boolean;
  capturedViaCamera?: boolean;
  location: string;
  district?: string;
  state?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    timestamp?: string;
  };
  latitude?: number;
  longitude?: number;
  nearestMandi?: string;
  currentMandiPrice: number;
  expectedPrice: number;
  status: 'Available for Sale' | 'Deal in Negotiation' | 'Under Offer' | 'Sold';
  photoVerified: boolean;
  isDemoVerification: boolean;
  imageUrl: string;
  images?: string[];
  harvestedDate: string;
  storageLocation: string;
  moistureContent?: string;
  description: string;
  produceType?: 'raw' | 'processed';
  processingType?: string;
  sourceCropId?: string;
  sourceCropName?: string;
  sourceCropVariety?: string;
  sourceBatchId?: string;
  processingRecordId?: string;
  processingDate?: string;
  processingCost?: number;
  processingYield?: number;
  processingFacility?: string;
  aiGradingResult?: {
    isReliable: boolean;
    unreliableReason?: string;
    detectedCrop: string;
    detectedVariety: string;
    classification?: 'PREMIUM' | 'STANDARD';
    grade: 'PREMIUM' | 'STANDARD' | 'A' | 'B' | 'C';
    isManual?: boolean;
    confidence?: number;
    visualIndicators: string[];
    potentialIssues: string[];
    recommendation: string;
    observations: string;
    qualityFactors?: {
      uniformity: number;
      cleanliness: number;
      colorVibrancy: number;
      damageLevel: 'Low' | 'Moderate' | 'High';
    };
    disclaimer: string;
    timestamp: string;
  };
  mandiReferenceDetails?: {
    commodity: string;
    variety: string;
    market: string;
    district: string;
    state: string;
    minPriceQuintal: number;
    modalPriceQuintal: number;
    maxPriceQuintal: number;
    minPriceKg: number;
    modalPriceKg: number;
    maxPriceKg: number;
    arrivalDate: string;
    source: string;
    lastFetchTime: string;
    isLiveConnected: boolean;
    gradeSpecificNote?: string;
    suggestedRange?: { minRate: number; maxRate: number; note: string };
  };
}

export interface BuyerMatch {
  id: string;
  name: string;
  logoText: string;
  verified: boolean;
  requiredCrop: string;
  requiredVariety?: string;
  requiredQuantityKg: number;
  offeredPrice: number;
  distanceKm: number;
  location: string;
  paymentTerms: string;
  matchScore: number;
  matchFactors: string[];
  rating: number;
  completedDeals: number;
  contactPerson: string;
  contactPhone: string;
}

export interface ProcessorOpportunity {
  id: string;
  name: string;
  cropRequired: string;
  quantityRequiredKg: number;
  processingType: string;
  distanceKm: number;
  location: string;
  expectedValue: string;
  paymentTerms: string;
  turnaroundDays: number;
  contactPhone: string;
}

export interface StorageFacility {
  id: string;
  name: string;
  storageType: 'Cold Storage (0-4°C)' | 'Hermetic Grain Silos' | 'Standard Dry Warehouse' | 'Controlled Atmosphere (CA)';
  distanceKm: number;
  location: string;
  availableCapacityQuintals: number;
  totalCapacityQuintals: number;
  pricePerQuintalMonth: number;
  temperatureControlled: boolean;
  features: string[];
  contactPhone: string;
}

export interface MarketPriceRecord {
  crop: string;
  variety: string;
  currentMandiPrice: number;
  minPriceToday?: number;
  modalPrice?: number;
  maxPriceToday?: number;
  unit: string;
  isActualMandiPrice: boolean;
  isProjectedPrice: boolean;
  priceChange24h: number;
  percentChange24h?: number;
  trend: 'up' | 'down' | 'stable';
  nearestMandi: string;
  source: string;
  provenanceLabel?: string;
  sevenDayHistory: {
    day: string;
    actualPrice?: number;
    price?: number;
    projectedPrice?: number;
  }[];
  qualityRequirements: string;
  buyerDemand: 'Very High' | 'High' | 'Moderate' | 'Low';
  demandLevel?: string;
  lastUpdated: string;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  buyerName: string;
  crop: string;
  variety: string;
  quantityKg: number;
  ratePerKg: number;
  totalAmount: number;
  status: 'Offer Submitted' | 'Negotiation' | 'Accepted' | 'Pickup Scheduled' | 'In Transit' | 'Delivered' | 'Payment Completed';
  stepIndex: number;
  orderDate: string;
  pickupDate?: string;
  deliveryDate?: string;
  paymentDate?: string;
  paymentStatus: 'Pending Escrow' | 'In Escrow' | 'Released to Bank';
  vehicleNumber?: string;
  driverName?: string;
  driverPhone?: string;
}

export interface BuyerEnquiry {
  id: string;
  buyerName: string;
  buyerLocation: string;
  crop: string;
  requestedQuantityKg: number;
  offeredPricePerKg: number;
  farmerExpectedPrice: number;
  distanceKm: number;
  message: string;
  timestamp: string;
  status: 'New' | 'Countered' | 'Accepted' | 'Declined';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'enquiry' | 'offer_accepted' | 'pickup' | 'price_alert' | 'storage' | 'system';
  read: boolean;
  actionTab?: string;
}

export interface ValueDecision {
  cropName: string;
  quantityKg: number;
  sellNow: {
    title: string;
    grossRevenue: number;
    transportCost: number;
    otherCosts: number;
    netValue: number;
    timeline: string;
    riskLevel: 'Low' | 'Medium' | 'High';
  };
  storeAndSellLater: {
    title: string;
    projectedGross: number;
    storageCostMonth: number;
    transportCost: number;
    netValue: number;
    timeline: string;
    riskLevel: 'Low' | 'Medium' | 'High';
    expectedAppreciation: string;
  };
  processAndSell: {
    title: string;
    processedGross: number;
    processingFee: number;
    packagingTransport: number;
    netValue: number;
    timeline: string;
    riskLevel: 'Low' | 'Medium' | 'High';
    valueAdd: string;
  };
  recommendedOption: 'sell_now' | 'store' | 'process';
  recommendedReason: string;
}

export type FarmerDashboardTab =
  | 'overview'
  | 'my-crops'
  | 'add-crop'
  | 'search-buyers'
  | 'market-prices'
  | 'ai-analysis'
  | 'voice-assistant'
  | 'orders'
  | 'enquiries'
  | 'storage-processing'
  | 'notifications'
  | 'profile'
  | 'support';

export * from './processing';
