export type LandVerificationStatus = 'Pending' | 'Verified' | 'Needs Correction' | 'Rejected';

export const OFFICIAL_UP_BHULEKH_URL = 'https://upbhulekh.gov.in/#/selection';

export type PropertyVerificationStatus =
  | 'Not Verified'
  | 'Verification Pending'
  | 'Verified'
  | 'Partial Match'
  | 'Mismatch'
  | 'Record Not Found'
  | 'Government Service Unavailable';

export interface FarmerProperty {
  id: string;
  farmerId: string;
  district: string;
  tehsil: string;
  village: string;
  gataNumber: string; // गाटा संख्या / खसरा संख्या
  khatauniNumber?: string; // खतौनी संख्या / खाता संख्या (optional)
  landArea: number; // रकबा
  landAreaUnit: 'Hectare' | 'Bigha' | 'Acre'; // इकाई
  status: PropertyVerificationStatus;
  statusNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface FarmerLandRecord {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerMobile: string;
  fatherName: string;
  district: string;
  tehsil: string;
  village: string;
  khataNumber: string; // खाता संख्या
  khasraNumber: string; // खसरा संख्या
  landArea: number; // क्षेत्रफल (संख्या)
  landUnit: 'Acres' | 'Bigha' | 'Hectare'; // इकाई
  ownerNameInKhatauni: string; // खतौनी में दर्ज खातेदार का नाम
  status: LandVerificationStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  adminNotes?: string;
  officialUpBhulekhVerified: boolean;
  verificationSource: 'Admin Manual Review' | 'Official UP Bhulekh' | 'Under Review';
}

export interface LandVerificationInput {
  farmerId?: string;
  farmerName: string;
  farmerMobile?: string;
  fatherName: string;
  district: string;
  tehsil: string;
  village: string;
  khataNumber: string;
  khasraNumber: string;
  landArea: number;
  landUnit: 'Acres' | 'Bigha' | 'Hectare';
  ownerNameInKhatauni: string;
}
