import fs from 'fs';
import path from 'path';
import {
  FarmerLandRecord,
  LandVerificationInput,
  LandVerificationStatus,
  FarmerProperty,
  PropertyVerificationStatus,
} from '../types/landVerification';

const landRecords = new Map<string, FarmerLandRecord>();
const farmerProperties = new Map<string, FarmerProperty>();

const PERSISTENCE_DIR = path.resolve(process.cwd(), '.data');
const LAND_PERSISTENCE_FILE = path.join(PERSISTENCE_DIR, 'kisansetu_land_store.json');

export function saveLandStoreToDisk() {
  try {
    if (!fs.existsSync(PERSISTENCE_DIR)) {
      fs.mkdirSync(PERSISTENCE_DIR, { recursive: true });
    }
    const data = {
      landRecords: Array.from(landRecords.entries()),
      farmerProperties: Array.from(farmerProperties.entries()),
    };
    fs.writeFileSync(LAND_PERSISTENCE_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[LandStore] Could not persist land store to disk:', err);
  }
}

export function loadLandStoreFromDisk() {
  try {
    if (!fs.existsSync(LAND_PERSISTENCE_FILE)) return;
    const raw = fs.readFileSync(LAND_PERSISTENCE_FILE, 'utf-8');
    const data = JSON.parse(raw);
    if (data.landRecords && Array.isArray(data.landRecords)) {
      for (const [k, v] of data.landRecords) {
        landRecords.set(k, v);
      }
    }
    if (data.farmerProperties && Array.isArray(data.farmerProperties)) {
      for (const [k, v] of data.farmerProperties) {
        farmerProperties.set(k, v);
      }
    }
  } catch (err) {
    console.warn('[LandStore] Could not load land store from disk:', err);
  }
}

// Seed initial realistic Farmer verification records & properties
function seedInitialRecords() {
  const seed1: FarmerLandRecord = {
    id: 'lnd_rec_001',
    farmerId: 'KISAN-UP-2026-8842',
    farmerName: 'Rajesh Kumar',
    farmerMobile: '+91 98765 43210',
    fatherName: 'Shri Ram Sevak Verma',
    district: 'Bareilly',
    tehsil: 'Baheri',
    village: 'Haridaspur',
    khataNumber: '00142',
    khasraNumber: '312/1',
    landArea: 12.5,
    landUnit: 'Acres',
    ownerNameInKhatauni: 'Rajesh Kumar Verma',
    status: 'Verified',
    submittedAt: '2026-08-10T10:30:00.000Z',
    reviewedAt: '2026-08-12T14:15:00.000Z',
    reviewedBy: 'Admin Verification Officer (KisanSetu Revenue Desk)',
    adminNotes: 'Verified against manual Khatauni record. Owner name and Khasra 312/1 confirmed in Tehsil Baheri register.',
    officialUpBhulekhVerified: false,
    verificationSource: 'Admin Manual Review',
  };

  const initialProp1: FarmerProperty = {
    id: 'prop-1',
    farmerId: 'KISAN-UP-2026-8842',
    district: 'Bareilly',
    tehsil: 'Baheri',
    village: 'Haridaspur',
    gataNumber: '312/1',
    khatauniNumber: '00142',
    landArea: 12.5,
    landAreaUnit: 'Acre',
    status: 'Not Verified',
    statusNotes: 'Bhulekh record देखने के लिए official website पर जाएँ।',
    createdAt: '2026-08-10T10:30:00.000Z',
  };
  farmerProperties.set(initialProp1.id, initialProp1);

  const seed2: FarmerLandRecord = {
    id: 'lnd_rec_002',
    farmerId: 'KISAN-UP-2026-1049',
    farmerName: 'Suresh Chandra Sharma',
    farmerMobile: '+91 98371 55420',
    fatherName: 'Babu Lal Sharma',
    district: 'Meerut',
    tehsil: 'Mawana',
    village: 'Asilpur',
    khataNumber: '00089',
    khasraNumber: '104/2',
    landArea: 8.5,
    landUnit: 'Acres',
    ownerNameInKhatauni: 'Suresh Chandra Sharma',
    status: 'Pending',
    submittedAt: '2026-09-01T09:15:00.000Z',
    officialUpBhulekhVerified: false,
    verificationSource: 'Under Review',
  };

  const seed3: FarmerLandRecord = {
    id: 'lnd_rec_003',
    farmerId: 'KISAN-UP-2026-4412',
    farmerName: 'Ramkishan Yadav',
    farmerMobile: '+91 94120 77319',
    fatherName: 'Jagannath Yadav',
    district: 'Varanasi',
    tehsil: 'Pindra',
    village: 'Karampur',
    khataNumber: '00215',
    khasraNumber: '78',
    landArea: 4.0,
    landUnit: 'Bigha',
    ownerNameInKhatauni: 'Ramkishan & Brothers Joint Khata',
    status: 'Needs Correction',
    submittedAt: '2026-08-25T11:00:00.000Z',
    reviewedAt: '2026-08-26T16:30:00.000Z',
    reviewedBy: 'Admin Reviewer (Desk Varanasi)',
    adminNotes: 'Khatauni indicates joint co-ownership. Please enter specific individual share proportion in land area.',
    officialUpBhulekhVerified: false,
    verificationSource: 'Admin Manual Review',
  };

  const seedRahul: FarmerLandRecord = {
    id: 'lnd_rec_rahul_7721',
    farmerId: 'KISAN-UP-2026-7721',
    farmerName: 'Rahul Kumar',
    farmerMobile: '+91 98234 56789',
    fatherName: 'Shri Mahendra Kumar',
    district: 'Varanasi',
    tehsil: 'Pindra',
    village: 'Mangari',
    khataNumber: '00219',
    khasraNumber: '118/2',
    landArea: 8.0,
    landUnit: 'Acres',
    ownerNameInKhatauni: 'Rahul Kumar',
    status: 'Verified',
    submittedAt: '2026-03-02T10:00:00.000Z',
    reviewedAt: '2026-03-05T14:00:00.000Z',
    reviewedBy: 'Admin Verification Officer (UP Bhulekh Desk)',
    adminNotes: 'Verified against UP Revenue Board Tehsil Pindra register.',
    officialUpBhulekhVerified: true,
    verificationSource: 'Official UP Bhulekh',
  };

  const seedAmit: FarmerLandRecord = {
    id: 'lnd_rec_amit_9902',
    farmerId: 'KISAN-UP-2026-9902',
    farmerName: 'Amit Singh',
    farmerMobile: '+91 98123 45678',
    fatherName: 'Shri Devendra Singh',
    district: 'Gorakhpur',
    tehsil: 'Sahjanwa',
    village: 'Bhiti Rawat',
    khataNumber: '00355',
    khasraNumber: '245/1',
    landArea: 14.5,
    landUnit: 'Acres',
    ownerNameInKhatauni: 'Amit Singh',
    status: 'Verified',
    submittedAt: '2026-01-20T11:00:00.000Z',
    reviewedAt: '2026-01-22T15:30:00.000Z',
    reviewedBy: 'Admin Verification Officer (Gorakhpur Revenue Desk)',
    adminNotes: 'Verified against UP Bhulekh Khatauni record.',
    officialUpBhulekhVerified: true,
    verificationSource: 'Official UP Bhulekh',
  };

  landRecords.set(seed1.id, seed1);
  landRecords.set(seed2.id, seed2);
  landRecords.set(seed3.id, seed3);
  landRecords.set(seedRahul.id, seedRahul);
  landRecords.set(seedAmit.id, seedAmit);
}

seedInitialRecords();
if (!fs.existsSync(LAND_PERSISTENCE_FILE)) {
  saveLandStoreToDisk();
} else {
  loadLandStoreFromDisk();
}

export function getAllLandVerifications(statusFilter?: string): FarmerLandRecord[] {
  const all = Array.from(landRecords.values());
  if (statusFilter && statusFilter !== 'ALL') {
    return all.filter((r) => r.status.toLowerCase() === statusFilter.toLowerCase());
  }
  return all.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
}

export function getLandVerificationByFarmer(farmerIdOrMobile: string): FarmerLandRecord | null {
  if (!farmerIdOrMobile) return null;
  const clean = farmerIdOrMobile.trim().toLowerCase();
  for (const rec of landRecords.values()) {
    if (rec.farmerId.toLowerCase() === clean) return rec;
    if (rec.farmerMobile.replace(/\s+/g, '') === clean.replace(/\s+/g, '')) return rec;
    if (rec.farmerName.toLowerCase() === clean) return rec;
  }
  return null;
}

export function submitOrUpdateLandVerification(input: LandVerificationInput): {
  success: boolean;
  message: string;
  record?: FarmerLandRecord;
} {
  const {
    farmerId,
    farmerName,
    farmerMobile,
    fatherName,
    district,
    tehsil,
    village,
    khataNumber,
    khasraNumber,
    landArea,
    landUnit,
    ownerNameInKhatauni,
  } = input;

  if (!farmerName || !fatherName || !district || !tehsil || !village || !khataNumber || !khasraNumber) {
    return {
      success: false,
      message: 'All land record fields (Farmer Name, Father Name, District, Tehsil, Village, Khata, Khasra) are required.',
    };
  }

  const numericArea = parseFloat(String(landArea)) || 1.0;
  const assignedFarmerId = farmerId?.trim() || `KISAN-UP-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  // Find existing record for this farmer if any
  let existingId: string | null = null;
  for (const [id, rec] of landRecords.entries()) {
    if (
      (farmerId && rec.farmerId.toLowerCase() === farmerId.toLowerCase()) ||
      (farmerMobile && rec.farmerMobile.replace(/\s+/g, '') === farmerMobile.replace(/\s+/g, ''))
    ) {
      existingId = id;
      break;
    }
  }

  const recordId = existingId || `lnd_rec_${Date.now()}`;
  const now = new Date().toISOString();

  const newRecord: FarmerLandRecord = {
    id: recordId,
    farmerId: assignedFarmerId,
    farmerName: farmerName.trim(),
    farmerMobile: farmerMobile?.trim() || '+91 98765 43210',
    fatherName: fatherName.trim(),
    district: district.trim(),
    tehsil: tehsil.trim(),
    village: village.trim(),
    khataNumber: khataNumber.trim(),
    khasraNumber: khasraNumber.trim(),
    landArea: numericArea,
    landUnit: landUnit || 'Acres',
    ownerNameInKhatauni: (ownerNameInKhatauni || farmerName).trim(),
    status: 'Pending', // New submissions or re-submissions reset to Pending
    submittedAt: now,
    officialUpBhulekhVerified: false,
    verificationSource: 'Under Review',
  };

  landRecords.set(recordId, newRecord);
  saveLandStoreToDisk();

  return {
    success: true,
    message: 'Land verification details submitted successfully. Status is Pending Admin review.',
    record: newRecord,
  };
}

export function updateLandVerificationStatus(
  recordId: string,
  update: {
    status: LandVerificationStatus;
    adminNotes?: string;
    reviewedBy?: string;
  }
): { success: boolean; message: string; record?: FarmerLandRecord } {
  const existing = landRecords.get(recordId);
  if (!existing) {
    return { success: false, message: 'Land verification record not found.' };
  }

  const now = new Date().toISOString();
  existing.status = update.status;
  existing.reviewedAt = now;
  existing.reviewedBy = update.reviewedBy?.trim() || 'Admin Verification Officer';
  if (update.adminNotes !== undefined) {
    existing.adminNotes = update.adminNotes.trim();
  }

  if (update.status === 'Verified') {
    existing.verificationSource = 'Admin Manual Review';
    existing.officialUpBhulekhVerified = false; // Only true if genuine UP Bhulekh API validated it
  }

  landRecords.set(recordId, existing);
  saveLandStoreToDisk();

  return {
    success: true,
    message: `Land verification status successfully updated to ${update.status}.`,
    record: existing,
  };
}

// ============================================================================
// AUTHENTICATED FARMER PROPERTY MANAGEMENT (ISOLATED PER FARMER)
// ============================================================================

export function getPropertiesByFarmer(farmerId: string): FarmerProperty[] {
  if (!farmerId) return [];
  const clean = farmerId.trim().toLowerCase();
  const result: FarmerProperty[] = [];
  for (const prop of farmerProperties.values()) {
    if (prop.farmerId.toLowerCase() === clean) {
      result.push(prop);
    }
  }
  return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function saveOrUpdateFarmerProperty(input: {
  id?: string;
  farmerId: string;
  district: string;
  tehsil: string;
  village: string;
  gataNumber: string;
  khatauniNumber?: string;
  landArea: number;
  landAreaUnit: 'Hectare' | 'Bigha' | 'Acre';
}): { success: boolean; message: string; property?: FarmerProperty } {
  const { farmerId, district, tehsil, village, gataNumber, khatauniNumber, landArea, landAreaUnit } = input;

  if (!farmerId || !farmerId.trim()) {
    return { success: false, message: 'Farmer ID is required.' };
  }
  if (!district || !district.trim() || !tehsil || !tehsil.trim() || !village || !village.trim() || !gataNumber || !gataNumber.trim()) {
    return { success: false, message: 'District, Tehsil, Village, and Gata No. are required.' };
  }

  const propId = input.id?.trim() || `prop_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`;
  const now = new Date().toISOString();

  const existing = farmerProperties.get(propId);
  if (existing && existing.farmerId.toLowerCase() !== farmerId.trim().toLowerCase()) {
    return { success: false, message: 'Unauthorized: Cannot modify property belonging to another farmer.' };
  }

  const newProp: FarmerProperty = {
    id: propId,
    farmerId: farmerId.trim(),
    district: district.trim(),
    tehsil: tehsil.trim(),
    village: village.trim(),
    gataNumber: gataNumber.trim(),
    khatauniNumber: khatauniNumber?.trim() || '',
    landArea: parseFloat(String(landArea)) || 1.0,
    landAreaUnit: landAreaUnit || 'Acre',
    // Strict rule: Do not show Government Verified unless official government API integration returns verified
    status: 'Not Verified',
    statusNotes: 'Bhulekh record देखने के लिए official website पर जाएँ।',
    createdAt: existing ? existing.createdAt : now,
    updatedAt: now,
  };

  farmerProperties.set(propId, newProp);
  saveLandStoreToDisk();

  return {
    success: true,
    message: 'Property details saved successfully.',
    property: newProp,
  };
}

export function deleteFarmerProperty(farmerId: string, propertyId: string): boolean {
  if (!farmerId || !propertyId) return false;
  const existing = farmerProperties.get(propertyId);
  if (!existing) return false;
  if (existing.farmerId.toLowerCase() !== farmerId.trim().toLowerCase()) {
    return false; // Farmer A cannot delete Farmer B's property
  }
  const deleted = farmerProperties.delete(propertyId);
  if (deleted) {
    saveLandStoreToDisk();
  }
  return deleted;
}
