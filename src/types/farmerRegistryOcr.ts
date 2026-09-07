export type FarmerRegistryValidationStatus =
  | 'MATCHED'
  | 'POSSIBLE_MISMATCH'
  | 'UNREADABLE'
  | 'SUSPICIOUS_REVIEW';

export interface FarmerRegistryExtractedData {
  farmerNameEnglish?: string;
  farmerNameHindi?: string;
  fatherOrIdentifierName?: string;
  fatherOrIdentifierNameHindi?: string;
  aadhaarNumber?: string;
  registryNumber?: string;
  state?: string;
  district?: string;
  tehsil?: string;
  village?: string;
  landAreaTotal?: string;
  landUnit?: string;
  khataOrSurveyNumber?: string;
  isFarmerRegistryDocument: boolean;
  isReadable: boolean;
  unreadableReason?: string;
  confidenceScore?: number;
  extractedAt: string;
}

export interface FarmerRegistryComparisonField {
  field: 'name' | 'fatherName' | 'aadhaarNumber' | 'district' | 'tehsil' | 'village' | 'registryNumber';
  labelHi: string;
  labelEn: string;
  signupValue: string;
  ocrValue: string;
  status: 'MATCH' | 'MISMATCH' | 'NOT_PROVIDED' | 'DETECTED';
  notes?: string;
}

export interface FarmerRegistryOcrProcessResult {
  success: boolean;
  validationStatus: FarmerRegistryValidationStatus;
  statusBadgeTextHi: string;
  statusBadgeTextEn: string;
  statusTitle: string;
  statusMessage: string;
  warningMessage?: string;
  fileName: string;
  fileSizeFormatted?: string;
  extractedData: FarmerRegistryExtractedData;
  comparisons: FarmerRegistryComparisonField[];
  canProceed: boolean;
  disclaimer: string;
}

export interface FarmerSignupComparisonInput {
  name: string;
  fatherName?: string;
  aadhaarNumber?: string;
  district?: string;
  tehsil?: string;
  village?: string;
  registryNumber?: string;
}
