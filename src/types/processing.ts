export type ProcessingStage =
  | 'RAW_AVAILABLE'
  | 'PROCESSING_PLANNED'
  | 'PROCESSING_IN_PROGRESS'
  | 'PROCESSED_AVAILABLE'
  | 'SOLD';

export interface ProcessingTypeOption {
  id: string;
  nameEn: string;
  nameHi: string;
  category: string;
  targetProductNameEn: string;
  targetProductNameHi: string;
  typicalYieldPercent: number; // e.g. 78 for 78%
  typicalProcessingCostPerKg: number; // e.g. 3.5 (₹3.5 per kg raw input)
  recommendedGrade: 'A+' | 'A' | 'B';
  packagingOptionsEn: string[];
  packagingOptionsHi: string[];
  shelfLifeMonths: number;
  descriptionEn: string;
  descriptionHi: string;
  allowedCrops: string[]; // matching crop names like 'Wheat', 'Rice / Paddy', etc.
}

export interface ProcessingRecord {
  id: string;
  farmerId: string;
  farmerName: string;
  sourceCropId: string;
  sourceCropName: string;
  sourceCropVariety: string;
  sourceBatchId: string;
  processingTypeId: string;
  processingTypeName: string;
  
  // Quantity tracking
  inputQuantityKg: number;
  outputQuantityKg: number;
  processingLossKg: number;
  processingYieldPercent: number;
  availableProcessedQuantityKg: number;
  soldProcessedQuantityKg: number;

  // Economics
  rawCropPricePerKg: number;
  processingCostTotal: number;
  processingCostPerKg: number;
  targetSellingPricePerKg: number;
  estimatedValueAdditionAmount: number;

  // Processing Partner
  processingMethod: 'self' | 'partner_mill';
  partnerFacilityId?: string;
  partnerFacilityName?: string;
  partnerContactPhone?: string;

  // Processed Product Details
  processedProductName: string;
  processedProductVariety?: string;
  processedProductGrade: 'A+' | 'A' | 'B' | 'C';
  processedBatchId: string;
  packagingType: string;
  description?: string;
  imageUrl?: string;

  // Lifecycle
  status: ProcessingStage;
  isPublishedToMarketplace: boolean;
  marketplaceListingId?: string;

  // Timestamps
  startDate: string;
  expectedCompletionDate: string;
  completedDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostHarvestAnalytics {
  totalRawProcessedKg: number;
  totalProcessedOutputKg: number;
  totalProcessingLossKg: number;
  overallAverageYieldPercent: number;
  activeProcessedProductsCount: number;
  totalValueAddedSalesRevenue: number;
  totalEstimatedValueAdditionGain: number;
}
