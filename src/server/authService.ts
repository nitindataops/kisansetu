import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import {
  normalizeIndianPhoneNumber,
  maskPhoneNumber,
} from './phoneUtils';
import { FarmerProfile, CropListing } from '../types/farmer';
import { BuyerProfile, BuyerOrder, BuyerRequirement, BuyerMessageThread, MarketplaceProduct } from '../types/buyer';
import { ProcessingRecord, ProcessingStage, PostHarvestAnalytics } from '../types/processing';
import { INITIAL_FARMER_PROFILE, INITIAL_CROPS } from '../data/farmerData';
import { INITIAL_BUYER_PROFILE, INITIAL_BUYER_ORDERS, INITIAL_BUYER_REQUIREMENTS, INITIAL_MESSAGE_THREADS } from '../data/buyerData';

// ============================================================================
// DATA MODELS & TYPES
// ============================================================================

export type UserRole = 'farmer' | 'buyer' | 'admin';

export interface UserRecord {
  id: string;
  role: UserRole;
  identifier: string; // Phone number or email or user ID
  mobileNumber: string; // E.164 normalized (+91...)
  mobileVerified: boolean;
  mobileVerifiedAt: string;
  email?: string;
  passwordSalt: string;
  passwordHash: string;
  createdAt: string;
  farmerProfile?: FarmerProfile;
  buyerProfile?: BuyerProfile;
  status?: 'active' | 'suspended';
}

export interface AuthSession {
  token: string;
  userId: string;
  role: UserRole;
  createdAt: string;
  expiresAt: number;
}

export const CONFIG_ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'kisansetu2026@gmail.com').trim().toLowerCase();
export const CONFIG_ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD || 'Kisan@2026').trim();

export interface AdminAuditLog {
  id: string;
  action: string;
  adminEmail: string;
  targetType: 'farmer' | 'buyer' | 'listing' | 'order' | 'enquiry' | 'verification' | 'system';
  targetId: string;
  targetName?: string;
  details: string;
  timestamp: string;
}

// ============================================================================
// PASSWORD HASHING UTILITIES (SECURE PBKDF2 WITH SHA-512)
// ============================================================================

export function hashPassword(password: string, salt?: string): { salt: string; hash: string } {
  const passwordSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, passwordSalt, 10000, 64, 'sha512').toString('hex');
  return { salt: passwordSalt, hash };
}

export function verifyPassword(password: string, salt: string, storedHash: string): boolean {
  try {
    const calculatedHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    const bufA = Buffer.from(calculatedHash, 'hex');
    const bufB = Buffer.from(storedHash, 'hex');
    return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

// ============================================================================
// IN-MEMORY USER STORE WITH SEEDED DEFAULTS
// ============================================================================

export const users = new Map<string, UserRecord>();
export const activeSessions = new Map<string, AuthSession>();
export const buyerOrders = new Map<string, BuyerOrder[]>();
export const buyerRequirements = new Map<string, BuyerRequirement[]>();
export const buyerMessages = new Map<string, BuyerMessageThread[]>();
export const farmerCrops = new Map<string, CropListing[]>();
export const processingRecords = new Map<string, ProcessingRecord[]>();
export const buyerCart = new Map<string, any[]>();
export const buyerFavorites = new Map<string, string[]>();
export const adminAuditLogs: AdminAuditLog[] = [];


// ============================================================================
// SAFE SAME-CROP IMAGE RESOLUTION (NO RANDOM FALLBACKS)
// Priority: Uploaded Farmer Image -> Variety Image -> Crop Image -> Safe Same-Crop Fallback
// ============================================================================

export function resolveSafeCropImage(
  cropName?: string,
  variety?: string,
  category?: string,
  uploadedUrl?: string
): string {
  if (uploadedUrl && typeof uploadedUrl === 'string' && uploadedUrl.trim() !== '') {
    const lower = uploadedUrl.toLowerCase();
    if (
      !lower.includes('placeholder') &&
      !lower.includes('undefined') &&
      !lower.includes('null') &&
      !lower.includes('[object') &&
      !lower.includes('1546069901-ba9599a7e63c') &&
      !lower.includes('salad') &&
      !lower.includes('vegetable-dish')
    ) {
      return uploadedUrl;
    }
  }

  const c = (cropName || '').toLowerCase().trim();
  const v = (variety || '').toLowerCase().trim();

  // Strict Same-Crop Image Rules: Wheat, Rice/Paddy, Maize, Pulses/Chana
  if (c.includes('wheat') || c.includes('gehu') || v.includes('wheat') || v.includes('sharbati') || v.includes('lokwan')) {
    return 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80';
  }
  if (c.includes('rice') || c.includes('paddy') || c.includes('dhan') || c.includes('chawal') || v.includes('basmati') || v.includes('1121') || v.includes('pusa')) {
    return 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80';
  }
  if (c.includes('maize') || c.includes('makka') || c.includes('corn') || v.includes('maize') || v.includes('hqpm')) {
    return 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&auto=format&fit=crop&q=80';
  }
  if (v.includes('kabuli')) {
    return '/images/crops/kabuli_chana.jpg';
  }
  if (v.includes('moong')) {
    return '/images/crops/moong_pulses.jpg';
  }
  if (v.includes('urad')) {
    return '/images/crops/urad_pulses.jpg';
  }
  if (
    c.includes('chana') ||
    c.includes('gram') ||
    c.includes('pulse') ||
    c.includes('dal') ||
    c.includes('masoor') ||
    c.includes('arhar') ||
    c.includes('tur') ||
    v.includes('chana') ||
    v.includes('pulse') ||
    v.includes('gram')
  ) {
    return '/images/crops/chana_pulses.jpg';
  }

  // Category fallback for approved categories
  const cat = (category || '').toLowerCase();
  if (cat.includes('pulse') || cat.includes('legume')) {
    return '/images/crops/chana_pulses.jpg';
  }
  return 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80';
}

// Seed initial default accounts
function seedInitialUsers() {
  // 1. Default Farmer: Rajesh Kumar
  const farmerSalt = crypto.randomBytes(16).toString('hex');
  const farmerHash = hashPassword('password123', farmerSalt).hash;
  const farmerUser: UserRecord = {
    id: 'usr_farmer_rajesh_8842',
    role: 'farmer',
    identifier: '+919876543210',
    mobileNumber: '+919876543210',
    mobileVerified: true,
    mobileVerifiedAt: '2024-10-15T00:00:00.000Z',
    email: 'rajesh.kumar.farmer@kisansetu.in',
    passwordSalt: farmerSalt,
    passwordHash: farmerHash,
    createdAt: '2024-10-15T00:00:00.000Z',
    farmerProfile: { ...INITIAL_FARMER_PROFILE },
  };
  if (!users.has(farmerUser.id)) {
    users.set(farmerUser.id, farmerUser);
  }
  if (!farmerCrops.has('KISAN-UP-2026-8842')) {
    farmerCrops.set('KISAN-UP-2026-8842', [...INITIAL_CROPS]);
  }
  if (!farmerCrops.has(farmerUser.id)) {
    farmerCrops.set(farmerUser.id, [...INITIAL_CROPS]);
  }

  const initialProcessingRecords: ProcessingRecord[] = [
    {
      id: 'proc-rec-001',
      farmerId: 'KISAN-UP-2026-8842',
      farmerName: 'Rajesh Kumar',
      sourceCropId: 'crop-2',
      sourceCropName: 'Wheat',
      sourceCropVariety: 'Sharbati MP-306',
      sourceBatchId: 'BATCH-8842-CR2',
      processingTypeId: 'wheat-milling-atta',
      processingTypeName: 'Flour Chakki Milling (Whole Wheat Atta)',
      inputQuantityKg: 1000,
      outputQuantityKg: 780,
      processingLossKg: 220,
      processingYieldPercent: 78,
      availableProcessedQuantityKg: 780,
      soldProcessedQuantityKg: 0,
      rawCropPricePerKg: 28,
      processingCostTotal: 3500,
      processingCostPerKg: 3.5,
      targetSellingPricePerKg: 44,
      estimatedValueAdditionAmount: 2820,
      processingMethod: 'partner_mill',
      partnerFacilityId: 'mill-1',
      partnerFacilityName: 'Rohilkhand Agro Milling Center, Baheri',
      partnerContactPhone: '+91 98371 88402',
      processedProductName: 'Stone-Ground Whole Wheat Atta',
      processedProductVariety: 'Whole Grain Chakki Fresh',
      processedProductGrade: 'A+',
      processedBatchId: 'BATCH-PROC-WHT-8842',
      packagingType: '25 kg Polypropylene Bag',
      description: '100% stone-milled whole wheat chakki atta from Sharbati MP-306 harvest lot. High natural fiber, unbleached, retaining golden germ oil.',
      imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
      status: 'PROCESSED_AVAILABLE',
      isPublishedToMarketplace: true,
      marketplaceListingId: 'crop-proc-1',
      startDate: '2026-08-25',
      expectedCompletionDate: '2026-08-28',
      completedDate: '2026-08-28',
      createdAt: '2026-08-25T10:00:00.000Z',
      updatedAt: '2026-08-28T16:00:00.000Z',
    },
    {
      id: 'proc-rec-002',
      farmerId: 'KISAN-UP-2026-8842',
      farmerName: 'Rajesh Kumar',
      sourceCropId: 'crop-2',
      sourceCropName: 'Wheat',
      sourceCropVariety: 'Sharbati MP-306',
      sourceBatchId: 'BATCH-8842-CR2',
      processingTypeId: 'wheat-semolina-suji',
      processingTypeName: 'Semolina / Suji Extraction',
      inputQuantityKg: 500,
      outputQuantityKg: 325,
      processingLossKg: 175,
      processingYieldPercent: 65,
      availableProcessedQuantityKg: 325,
      soldProcessedQuantityKg: 0,
      rawCropPricePerKg: 28,
      processingCostTotal: 2000,
      processingCostPerKg: 4.0,
      targetSellingPricePerKg: 52,
      estimatedValueAdditionAmount: 900,
      processingMethod: 'self',
      processedProductName: 'Granular Coarse Suji (Semolina)',
      processedProductVariety: 'High Protein Durum Suji',
      processedProductGrade: 'A',
      processedBatchId: 'BATCH-PROC-SUJI-8842',
      packagingType: '5 kg Pouch',
      description: 'High-protein granular semolina extracted from Sharbati wheat grains.',
      status: 'PROCESSING_IN_PROGRESS',
      isPublishedToMarketplace: false,
      startDate: '2026-09-02',
      expectedCompletionDate: '2026-09-06',
      createdAt: '2026-09-02T09:30:00.000Z',
      updatedAt: '2026-09-02T09:30:00.000Z',
    },
  ];

  if (!processingRecords.has('KISAN-UP-2026-8842')) {
    processingRecords.set('KISAN-UP-2026-8842', [...initialProcessingRecords]);
  }
  if (!processingRecords.has(farmerUser.id)) {
    processingRecords.set(farmerUser.id, [...initialProcessingRecords]);
  }

  // 1b. Test Farmer: Rahul Kumar
  const rahulSalt = crypto.randomBytes(16).toString('hex');
  const rahulHash = hashPassword('password123', rahulSalt).hash;
  const rahulProfile: FarmerProfile = {
    name: 'Rahul Kumar',
    farmerId: 'KISAN-UP-2026-7721',
    mobile: '+91 98234 56789',
    email: 'rahul.kumar.farmer@kisansetu.in',
    address: 'Village Mangari, Tehsil Pindra, Varanasi, Uttar Pradesh',
    district: 'Varanasi',
    tehsil: 'Pindra',
    village: 'Mangari',
    pincode: '221206',
    landAreaAcres: 8.0,
    totalLandAcres: 8.0,
    soilType: 'Alluvial Loam',
    irrigationSource: 'Borewell + Canal',
    landType: 'Fertile Plain',
    primaryCrops: ['Wheat', 'Rice / Paddy', 'Maize', 'Pulses / Chana'],
    aadhaarMasked: 'XXXX-XXXX-3829',
    eKycStatus: 'VERIFIED ✓',
    kccStatus: 'Active',
    soilHealthStatus: 'Optimal (Updated 2026)',
    memberSince: 'March 2025',
    fatherName: 'Shri Mahendra Kumar',
    bankDetails: {
      bankName: 'Union Bank of India (Varanasi Agri Branch)',
      accountNumber: '•••• •••• 4418',
      ifscCode: 'UBIN0542918',
    },
  };
  const rahulUser: UserRecord = {
    id: 'usr_farmer_rahul_7721',
    role: 'farmer',
    identifier: '+919823456789',
    mobileNumber: '+919823456789',
    mobileVerified: true,
    mobileVerifiedAt: '2025-03-01T00:00:00.000Z',
    email: 'rahul.kumar.farmer@kisansetu.in',
    passwordSalt: rahulSalt,
    passwordHash: rahulHash,
    createdAt: '2025-03-01T00:00:00.000Z',
    farmerProfile: rahulProfile,
  };
  if (!users.has(rahulUser.id)) {
    users.set(rahulUser.id, rahulUser);
  }

  // 1c. Test Farmer: Amit Singh
  const amitSalt = crypto.randomBytes(16).toString('hex');
  const amitHash = hashPassword('password123', amitSalt).hash;
  const amitProfile: FarmerProfile = {
    name: 'Amit Singh',
    farmerId: 'KISAN-UP-2026-9902',
    mobile: '+91 98123 45678',
    email: 'amit.singh.farmer@kisansetu.in',
    address: 'Village Bhiti Rawat, Tehsil Sahjanwa, Gorakhpur, Uttar Pradesh',
    district: 'Gorakhpur',
    tehsil: 'Sahjanwa',
    village: 'Bhiti Rawat',
    pincode: '273209',
    landAreaAcres: 14.5,
    totalLandAcres: 14.5,
    soilType: 'Clayey Loam',
    irrigationSource: 'Tube-well + Solar Pump',
    landType: 'Irrigated Agricultural',
    primaryCrops: ['Wheat', 'Rice / Paddy', 'Maize', 'Pulses / Chana'],
    aadhaarMasked: 'XXXX-XXXX-9104',
    eKycStatus: 'VERIFIED ✓',
    kccStatus: 'Active',
    soilHealthStatus: 'Rich Nitrogen Grade A',
    memberSince: 'January 2025',
    fatherName: 'Shri Devendra Singh',
    bankDetails: {
      bankName: 'Punjab National Bank (Gorakhpur Rural Branch)',
      accountNumber: '•••• •••• 7731',
      ifscCode: 'PUNB0182700',
    },
  };
  const amitUser: UserRecord = {
    id: 'usr_farmer_amit_9902',
    role: 'farmer',
    identifier: '+919812345678',
    mobileNumber: '+919812345678',
    mobileVerified: true,
    mobileVerifiedAt: '2025-01-15T00:00:00.000Z',
    email: 'amit.singh.farmer@kisansetu.in',
    passwordSalt: amitSalt,
    passwordHash: amitHash,
    createdAt: '2025-01-15T00:00:00.000Z',
    farmerProfile: amitProfile,
  };
  if (!users.has(amitUser.id)) {
    users.set(amitUser.id, amitUser);
  }

  // 2. Default Buyer: Vikram Anand
  const buyerSalt = crypto.randomBytes(16).toString('hex');
  const buyerHash = hashPassword('password123', buyerSalt).hash;
  const buyerUser: UserRecord = {
    id: 'usr_buyer_vikram_7712',
    role: 'buyer',
    identifier: '+919837012456',
    mobileNumber: '+919837012456',
    mobileVerified: true,
    mobileVerifiedAt: '2025-01-10T00:00:00.000Z',
    email: 'procurement@bareillyagromandi.in',
    passwordSalt: buyerSalt,
    passwordHash: buyerHash,
    createdAt: '2025-01-10T00:00:00.000Z',
    buyerProfile: {
      ...INITIAL_BUYER_PROFILE,
      id: 'BUYER-UP-2026-7712',
      isDemoProfile: false,
    },
  };
  if (!users.has(buyerUser.id)) {
    users.set(buyerUser.id, buyerUser);
  }

  // Seed Vikram's orders, requirements, messages if not already in store
  if (!buyerOrders.has('BUYER-UP-2026-7712')) {
    buyerOrders.set(
      'BUYER-UP-2026-7712',
      INITIAL_BUYER_ORDERS.map((o) => ({ ...o, buyerId: 'BUYER-UP-2026-7712' }))
    );
  }
  if (!buyerRequirements.has('BUYER-UP-2026-7712')) {
    buyerRequirements.set(
      'BUYER-UP-2026-7712',
      INITIAL_BUYER_REQUIREMENTS.map((r) => ({ ...r, buyerId: 'BUYER-UP-2026-7712', userId: 'BUYER-UP-2026-7712' }))
    );
  }
  if (!buyerMessages.has('BUYER-UP-2026-7712')) {
    buyerMessages.set('BUYER-UP-2026-7712', [...INITIAL_MESSAGE_THREADS]);
  }

  // 2b. Second Seeded Buyer: Amit Gupta (Amit Traders)
  const amitBuyerSalt = crypto.randomBytes(16).toString('hex');
  const amitBuyerHash = hashPassword('password123', amitBuyerSalt).hash;
  const amitBuyerProfile: BuyerProfile = {
    id: 'BUYER-UP-2026-8820',
    name: 'Amit Gupta',
    businessName: 'Amit Traders & Cold Storage Enterprise',
    businessType: 'Wholesaler / Trader',
    mobile: '+919876543211',
    email: 'procurement@amittraders.in',
    location: 'Gorakhpur, Uttar Pradesh',
    district: 'Gorakhpur',
    state: 'Uttar Pradesh',
    pincode: '273001',
    deliveryAddress: 'Plot 14, APMC Commercial Yard, Gorakhpur, UP - 273001',
    gstinMasked: '09AABCA9812L1Z4',
    panMasked: 'AABCA9812L',
    verified: true,
    memberSince: 'February 2025',
    preferredCrops: ['Wheat', 'Rice / Paddy', 'Maize', 'Pulses / Chana'],
    isDemoProfile: false,
  };
  const amitBuyerUser: UserRecord = {
    id: 'usr_buyer_amit_8820',
    role: 'buyer',
    identifier: '+919876543211',
    mobileNumber: '+919876543211',
    mobileVerified: true,
    mobileVerifiedAt: '2025-02-01T00:00:00.000Z',
    email: 'procurement@amittraders.in',
    passwordSalt: amitBuyerSalt,
    passwordHash: amitBuyerHash,
    createdAt: '2025-02-01T00:00:00.000Z',
    buyerProfile: amitBuyerProfile,
  };
  if (!users.has(amitBuyerUser.id)) {
    users.set(amitBuyerUser.id, amitBuyerUser);
  }

  // Seed Amit Gupta's distinct orders and requirements if missing
  if (!buyerOrders.has('BUYER-UP-2026-8820')) {
    buyerOrders.set('BUYER-UP-2026-8820', [
      {
        id: 'KS-ORD-8821',
        crop: 'Wheat',
        variety: 'Sharbati MP-306',
        grade: 'A+',
        quantityKg: 3000,
        pricePerKg: 28,
        totalAmount: 84000,
        farmerId: 'KISAN-UP-2026-7721',
        farmerName: 'Rajesh Kumar',
        orderDate: '2026-02-28',
        createdAt: '2026-02-28',
        status: 'confirmed',
        deliveryAddress: 'Plot 14, APMC Commercial Yard, Gorakhpur, UP - 273001',
        estimatedDelivery: '3-4 Business Days',
        batchId: 'BATCH-2026-WHT-09',
        buyerId: 'BUYER-UP-2026-8820',
      },
    ]);
  }
  if (!buyerRequirements.has('BUYER-UP-2026-8820')) {
    buyerRequirements.set('BUYER-UP-2026-8820', [
      {
        id: 'REQ-2026-881',
        crop: 'Wheat',
        variety: 'HD 2967',
        grade: 'A',
        requiredQuantityKg: 5000,
        maxPricePerKg: 26,
        preferredLocation: 'Gorakhpur, Uttar Pradesh',
        maxDistanceKm: 80,
        deliveryDate: '2026-03-25',
        status: 'Matching',
        matchedFarmersCount: 2,
        matchedQuantityKg: 3500,
        matchScore: 92,
        createdAt: '2026-02-28',
        matchedFarmers: [],
      },
    ]);
  }
  if (!buyerMessages.has('BUYER-UP-2026-8820')) {
    buyerMessages.set('BUYER-UP-2026-8820', []);
  }

  // 3. Admin Account (Synchronized with server environment variables)
  const adminSalt = crypto.randomBytes(16).toString('hex');
  const adminHash = hashPassword(CONFIG_ADMIN_PASSWORD, adminSalt).hash;
  const adminUser: UserRecord = {
    id: 'usr_admin_001',
    role: 'admin',
    identifier: CONFIG_ADMIN_EMAIL,
    mobileNumber: '+919999999999',
    mobileVerified: true,
    mobileVerifiedAt: '2024-01-01T00:00:00.000Z',
    email: CONFIG_ADMIN_EMAIL,
    passwordSalt: adminSalt,
    passwordHash: adminHash,
    createdAt: '2024-01-01T00:00:00.000Z',
    status: 'active',
  };
  users.set(adminUser.id, adminUser);


  // Pre-seed persistent demo sessions if missing
  const farFuture = Date.now() + 365 * 24 * 60 * 60 * 1000;
  if (!activeSessions.has('stok_demo_farmer_rajesh_token')) {
    activeSessions.set('stok_demo_farmer_rajesh_token', {
      token: 'stok_demo_farmer_rajesh_token',
      userId: farmerUser.id,
      role: 'farmer',
      createdAt: new Date().toISOString(),
      expiresAt: farFuture,
    });
  }
  if (!activeSessions.has('stok_demo_buyer_vikram_token')) {
    activeSessions.set('stok_demo_buyer_vikram_token', {
      token: 'stok_demo_buyer_vikram_token',
      userId: buyerUser.id,
      role: 'buyer',
      createdAt: new Date().toISOString(),
      expiresAt: farFuture,
    });
  }
  if (!activeSessions.has('stok_demo_buyer_amit_token')) {
    activeSessions.set('stok_demo_buyer_amit_token', {
      token: 'stok_demo_buyer_amit_token',
      userId: amitBuyerUser.id,
      role: 'buyer',
      createdAt: new Date().toISOString(),
      expiresAt: farFuture,
    });
  }
}

export function isUserFacingApprovedCrop(cropName?: string): boolean {
  if (!cropName) return false;
  const lower = cropName.toLowerCase().trim();
  // Strictly reject unsupported crops
  if (
    lower.includes('tomato') ||
    lower.includes('potato') ||
    lower.includes('mustard') ||
    lower.includes('onion') ||
    lower.includes('sarson') ||
    lower.includes('tamatar') ||
    lower.includes('aloo') ||
    lower.includes('chilli') ||
    lower.includes('sugarcane') ||
    lower.includes('vegetable') ||
    lower.includes('fruit')
  ) {
    return false;
  }
  if (lower.includes('wheat') || lower.includes('gehu') || lower.includes('gehun')) return true;
  if (lower.includes('rice') || lower.includes('paddy') || lower.includes('dhan') || lower.includes('chawal') || lower.includes('basmati')) return true;
  if (lower.includes('maize') || lower.includes('corn') || lower.includes('makka')) return true;
  if (lower.includes('pulse') || lower.includes('chana') || lower.includes('dal') || lower.includes('masoor') || lower.includes('arhar') || lower.includes('tur') || lower.includes('moong') || lower.includes('urad') || lower.includes('gram')) return true;
  return false;
}

const PERSISTENCE_DIR = path.resolve(process.cwd(), '.data');
const PERSISTENCE_FILE = path.join(PERSISTENCE_DIR, 'kisansetu_auth_store.json');
const PERSISTENCE_BAK = path.join(PERSISTENCE_DIR, 'kisansetu_auth_store.bak');
const PERSISTENCE_TMP = path.join(PERSISTENCE_DIR, 'kisansetu_auth_store.tmp');

export function saveStoreToDisk() {
  try {
    if (!fs.existsSync(PERSISTENCE_DIR)) {
      fs.mkdirSync(PERSISTENCE_DIR, { recursive: true });
    }
    const data = {
      users: Array.from(users.entries()),
      activeSessions: Array.from(activeSessions.entries()),
      buyerOrders: Array.from(buyerOrders.entries()),
      buyerRequirements: Array.from(buyerRequirements.entries()),
      buyerMessages: Array.from(buyerMessages.entries()),
      farmerCrops: Array.from(farmerCrops.entries()),
      processingRecords: Array.from(processingRecords.entries()),
      buyerCart: Array.from(buyerCart.entries()),
      buyerFavorites: Array.from(buyerFavorites.entries()),
      adminAuditLogs,
    };
    const jsonStr = JSON.stringify(data, null, 2);

    // Write atomically via temporary file
    fs.writeFileSync(PERSISTENCE_TMP, jsonStr, 'utf-8');
    if (fs.existsSync(PERSISTENCE_FILE)) {
      try {
        fs.copyFileSync(PERSISTENCE_FILE, PERSISTENCE_BAK);
      } catch {}
    }
    fs.renameSync(PERSISTENCE_TMP, PERSISTENCE_FILE);
  } catch (err) {
    console.warn('[Store] Could not persist auth store to disk:', err);
  }
}

export function loadStoreFromDisk() {
  try {
    let raw: string | null = null;
    if (fs.existsSync(PERSISTENCE_FILE)) {
      try {
        raw = fs.readFileSync(PERSISTENCE_FILE, 'utf-8');
      } catch (err) {
        console.warn('[Store] Failed to read primary store, attempting backup:', err);
      }
    }
    if (!raw && fs.existsSync(PERSISTENCE_BAK)) {
      try {
        raw = fs.readFileSync(PERSISTENCE_BAK, 'utf-8');
      } catch {}
    }
    if (!raw) return;

    const data = JSON.parse(raw);
    if (data.users && Array.isArray(data.users)) {
      for (const [k, v] of data.users) {
        users.set(k, v);
      }
    }
    if (data.activeSessions && Array.isArray(data.activeSessions)) {
      for (const [k, v] of data.activeSessions) {
        if (v.expiresAt > Date.now()) {
          activeSessions.set(k, v);
        }
      }
    }
    if (data.buyerOrders && Array.isArray(data.buyerOrders)) {
      for (const [k, v] of data.buyerOrders) {
        buyerOrders.set(k, v);
      }
    }
    if (data.buyerRequirements && Array.isArray(data.buyerRequirements)) {
      for (const [k, v] of data.buyerRequirements) {
        buyerRequirements.set(k, v);
      }
    }
    if (data.buyerMessages && Array.isArray(data.buyerMessages)) {
      for (const [k, v] of data.buyerMessages) {
        buyerMessages.set(k, v);
      }
    }
    if (data.farmerCrops && Array.isArray(data.farmerCrops)) {
      for (const [k, v] of data.farmerCrops) {
        if (Array.isArray(v)) {
          const sanitized = v
            .filter((c: any) => isUserFacingApprovedCrop(c?.name || c?.crop))
            .map((c: any) => {
              const currentImg = c.imageUrl || (c.images && c.images[0]);
              // Heal any stale salad bowl image or bad URL
              if (
                !currentImg ||
                currentImg.includes('1546069901-ba9599a7e63c') ||
                currentImg.includes('salad') ||
                currentImg.includes('placeholder')
              ) {
                const cleanImg = resolveSafeCropImage(c.name || c.crop, c.variety, c.category);
                return {
                  ...c,
                  imageUrl: cleanImg,
                  images: [cleanImg],
                };
              }
              return c;
            });
          farmerCrops.set(k, sanitized);
        }
      }
    }
    if (data.processingRecords && Array.isArray(data.processingRecords)) {
      for (const [k, v] of data.processingRecords) {
        processingRecords.set(k, v);
      }
    }
    if (data.buyerCart && Array.isArray(data.buyerCart)) {
      for (const [k, v] of data.buyerCart) {
        buyerCart.set(k, v);
      }
    }
    if (data.buyerFavorites && Array.isArray(data.buyerFavorites)) {
      for (const [k, v] of data.buyerFavorites) {
        buyerFavorites.set(k, v);
      }
    }
    if (data.adminAuditLogs && Array.isArray(data.adminAuditLogs)) {
      adminAuditLogs.length = 0;
      adminAuditLogs.push(...data.adminAuditLogs);
    }
  } catch (err) {
    console.warn('[Store] Could not load auth store from disk:', err);
  }
}

export function syncAdminAccountFromConfig() {
  const adminSalt = crypto.randomBytes(16).toString('hex');
  const adminHash = hashPassword(CONFIG_ADMIN_PASSWORD, adminSalt).hash;
  const adminUser: UserRecord = {
    id: 'usr_admin_001',
    role: 'admin',
    identifier: CONFIG_ADMIN_EMAIL,
    mobileNumber: '+919999999999',
    mobileVerified: true,
    mobileVerifiedAt: '2024-01-01T00:00:00.000Z',
    email: CONFIG_ADMIN_EMAIL,
    passwordSalt: adminSalt,
    passwordHash: adminHash,
    createdAt: '2024-01-01T00:00:00.000Z',
    status: 'active',
  };
  users.set('usr_admin_001', adminUser);
}

// 1. First, load existing saved database from disk
loadStoreFromDisk();
// 2. Only seed missing demo accounts (NEVER overwriting existing registered accounts)
seedInitialUsers();
// 3. Ensure admin account credentials strictly match server environment variables
syncAdminAccountFromConfig();
// 4. Immediately save back to disk
saveStoreToDisk();


// Session cleanup interval
setInterval(() => {
  const now = Date.now();
  for (const [token, session] of activeSessions.entries()) {
    if (session.expiresAt < now) {
      activeSessions.delete(token);
    }
  }
}, 5 * 60 * 1000);

export function findUserByIdentifier(identifier: string, role?: UserRole): UserRecord | undefined {
  if (!identifier) return undefined;
  const cleanId = identifier.trim().toLowerCase();
  const noHyphenId = cleanId.replace(/[\s-_]/g, '');
  const digitsOnly = cleanId.replace(/\D/g, '');
  const phoneNorm = normalizeIndianPhoneNumber(identifier).normalized;

  // Admin identifier shortcut
  if (role === 'admin' || cleanId === CONFIG_ADMIN_EMAIL || cleanId === 'admin@kisansetu.in' || cleanId === 'usr_admin_001') {
    return users.get('usr_admin_001');
  }

  for (const user of users.values()) {

    if (role && user.role !== role) continue;

    // 1. Mobile phone match (normalized or 10-digit suffix)
    if (phoneNorm && user.mobileNumber === phoneNorm) return user;
    if (digitsOnly && digitsOnly.length === 10 && user.mobileNumber.replace(/\D/g, '').endsWith(digitsOnly)) {
      return user;
    }

    // 2. Email match
    if (user.email && user.email.toLowerCase() === cleanId) return user;

    // 3. User internal ID match
    const userIdLower = user.id.toLowerCase();
    if (userIdLower === cleanId || userIdLower.replace(/[\s-_]/g, '') === noHyphenId) {
      return user;
    }

    // 4. Farmer ID match
    if (user.farmerProfile?.farmerId) {
      const fId = user.farmerProfile.farmerId.trim().toLowerCase();
      if (fId === cleanId || fId.replace(/[\s-_]/g, '') === noHyphenId) {
        return user;
      }
    }

    // 5. Buyer ID match
    if (user.buyerProfile?.id) {
      const bId = user.buyerProfile.id.trim().toLowerCase();
      if (bId === cleanId || bId.replace(/[\s-_]/g, '') === noHyphenId) {
        return user;
      }
    }
  }
  return undefined;
}

export function findUserByPhone(phone: string): UserRecord | undefined {
  const norm = normalizeIndianPhoneNumber(phone);
  const digitsOnly = phone.replace(/\D/g, '');
  for (const user of users.values()) {
    if (norm.isValid && user.mobileNumber === norm.normalized) return user;
    if (digitsOnly && digitsOnly.length === 10 && user.mobileNumber.replace(/\D/g, '').endsWith(digitsOnly)) {
      return user;
    }
  }
  return undefined;
}

export function findUserById(id: string): UserRecord | undefined {
  return users.get(id);
}

// ============================================================================
// SIGNUP: FARMER ACCOUNT CREATION
// ============================================================================

export interface CreateFarmerInput {
  name: string;
  phone: string;
  password: string;
  fatherName?: string;
  email?: string;
  aadhaarNumber?: string;
  aadhaarFrontUrl?: string;
  aadhaarFrontFileName?: string;
  aadhaarBackUrl?: string;
  aadhaarBackFileName?: string;
  farmerId?: string;
  district?: string;
  tehsil?: string;
  city?: string;
  landAreaAcres?: number;
  primaryCrops?: string[];
  farmerRegistryNumber?: string;
  farmerRegistryDocumentUrl?: string;
  farmerRegistryFileName?: string;
  farmerRegistryOcrStatus?: 'pending' | 'success' | 'failed';
  farmerRegistryVerificationStatus?: 'MATCHED' | 'POSSIBLE_MISMATCH' | 'UNREADABLE' | 'SUSPICIOUS_REVIEW';
  farmerRegistryOcrData?: any;
  farmerRegistrySubmittedAt?: string;
}

export async function createFarmerAccount(input: CreateFarmerInput) {
  const {
    name,
    phone,
    password,
    fatherName,
    email,
    aadhaarNumber,
    aadhaarFrontUrl,
    aadhaarFrontFileName,
    aadhaarBackUrl,
    aadhaarBackFileName,
    farmerId,
    district,
    tehsil,
    city,
    landAreaAcres,
    primaryCrops,
    farmerRegistryNumber,
    farmerRegistryDocumentUrl,
    farmerRegistryFileName,
    farmerRegistryOcrStatus,
    farmerRegistryVerificationStatus,
    farmerRegistryOcrData,
    farmerRegistrySubmittedAt,
  } = input;

  if (!name || !name.trim()) {
    return { success: false, message: 'Farmer name is required.' };
  }

  if (!password || password.length < 6) {
    return { success: false, message: 'Password must be at least 6 characters long.' };
  }

  const phoneValidation = normalizeIndianPhoneNumber(phone);
  if (!phoneValidation.isValid) {
    return { success: false, message: phoneValidation.error || 'Invalid phone number.' };
  }

  const normalizedPhone = phoneValidation.normalized;

  // Prevent duplicate accounts with same mobile number
  const existing = findUserByPhone(normalizedPhone);
  if (existing) {
    return {
      success: false,
      message: 'An account is already registered with this mobile number. Please login instead.',
    };
  }

  // Prevent duplicate email if email provided
  if (email && email.trim()) {
    const cleanEmail = email.trim().toLowerCase();
    const existingEmailUser = Array.from(users.values()).find(
      (u) => u.email && u.email.toLowerCase() === cleanEmail
    );
    if (existingEmailUser) {
      return {
        success: false,
        message: 'An account is already registered with this email address. Please login instead.',
      };
    }
  }

  // Prevent duplicate farmer ID if custom ID requested
  if (farmerId && farmerId.trim()) {
    const requestedId = farmerId.trim();
    const existingFarmerIdUser = Array.from(users.values()).find(
      (u) =>
        u.farmerProfile?.farmerId?.toLowerCase() === requestedId.toLowerCase() ||
        u.id.toLowerCase() === requestedId.toLowerCase()
    );
    if (existingFarmerIdUser) {
      return {
        success: false,
        message: `Farmer ID "${requestedId}" is already in use. Please choose a different ID or login.`,
      };
    }
  }

  // Hash password securely
  const { salt, hash } = hashPassword(password);
  const now = new Date().toISOString();
  const userId = `usr_farmer_${Date.now()}`;
  
  let assignedFarmerId = farmerId?.trim();
  if (!assignedFarmerId) {
    let candidate = '';
    do {
      candidate = `KISAN-UP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    } while (
      Array.from(users.values()).some(
        (u) => u.farmerProfile?.farmerId === candidate || u.id === candidate
      )
    );
    assignedFarmerId = candidate;
  }

  const cleanAadhaar = aadhaarNumber ? aadhaarNumber.replace(/\D/g, '') : '';
  const maskedAadhaar = cleanAadhaar.length >= 4
    ? `XXXX-XXXX-${cleanAadhaar.slice(-4)}`
    : `XXXX-XXXX-${Math.floor(1000 + Math.random() * 9000)}`;

  const farmerEmail = (email && email.trim()) || `${assignedFarmerId.toLowerCase()}@kisansetu.in`;

  const farmerProfile: FarmerProfile = {
    name: name.trim(),
    farmerId: assignedFarmerId,
    mobile: phoneValidation.displayPhone,
    email: farmerEmail,
    address: `${city || tehsil || 'Baheri'}, ${district || 'Bareilly'}, Uttar Pradesh`,
    district: district?.trim() || 'Bareilly',
    tehsil: tehsil?.trim() || 'Baheri',
    village: city?.trim() || 'Haridaspur',
    pincode: '243201',
    landAreaAcres: landAreaAcres || 5.0,
    totalLandAcres: landAreaAcres || 5.0,
    soilType: 'Alluvial Loamy Soil',
    irrigationSource: 'Borewell + Canal',
    landType: 'Alluvial Agricultural Farmland',
    primaryCrops: primaryCrops && primaryCrops.length ? primaryCrops : ['Wheat', 'Rice / Paddy', 'Maize', 'Pulses / Chana'],
    aadhaarMasked: maskedAadhaar,
    eKycStatus: 'VERIFIED ✓',
    kccStatus: 'Active',
    soilHealthStatus: 'Soil Health Verified (2026)',
    memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    bankDetails: {
      bankName: 'State Bank of India',
      accountNumber: `•••• •••• ${Math.floor(1000 + Math.random() * 9000)}`,
      ifscCode: 'SBIN0001428',
      branchName: `${district || 'Bareilly'} Agri Branch`,
    },
    fatherName: fatherName?.trim(),
    properties: [],
    farmerRegistryNumber: farmerRegistryNumber?.trim(),
    farmerRegistryDocumentUrl: aadhaarFrontUrl || farmerRegistryDocumentUrl,
    farmerRegistryFileName: aadhaarFrontFileName || farmerRegistryFileName,
    farmerRegistryOcrStatus,
    farmerRegistryVerificationStatus,
    farmerRegistryOcrData,
    farmerRegistrySubmittedAt: farmerRegistrySubmittedAt || ((aadhaarFrontUrl || farmerRegistryDocumentUrl) ? now : undefined),
  };

  const newUser: UserRecord = {
    id: userId,
    role: 'farmer',
    identifier: normalizedPhone,
    mobileNumber: normalizedPhone,
    mobileVerified: true,
    mobileVerifiedAt: now,
    email: farmerEmail,
    passwordSalt: salt,
    passwordHash: hash,
    createdAt: now,
    farmerProfile,
  };

  users.set(userId, newUser);

  // Initialize crop listing arrays for the new farmer
  if (!farmerCrops.has(assignedFarmerId)) {
    farmerCrops.set(assignedFarmerId, []);
  }
  if (!farmerCrops.has(userId)) {
    farmerCrops.set(userId, []);
  }

  // Generate session token
  const sessionToken = `stok_${crypto.randomBytes(32).toString('hex')}`;
  activeSessions.set(sessionToken, {
    token: sessionToken,
    userId,
    role: 'farmer',
    createdAt: now,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  saveStoreToDisk();

  return {
    success: true,
    message: `Farmer account created successfully! Your Farmer ID is ${assignedFarmerId}.`,
    token: sessionToken,
    role: 'farmer' as const,
    userId,
    farmerId: assignedFarmerId,
    user: farmerProfile,
    profile: farmerProfile,
  };
}

// ============================================================================
// SIGNUP: BUYER ACCOUNT CREATION
// ============================================================================

export interface CreateBuyerInput {
  name: string;
  mobile: string;
  password: string;
  email?: string;
  buyerId?: string;
  profession?: string;
  aadhaar?: string;
  businessName?: string;
  businessType?: string;
  location?: string;
  district?: string;
  state?: string;
  pincode?: string;
}

export async function createBuyerAccount(input: CreateBuyerInput) {
  const {
    name,
    mobile,
    password,
    email,
    buyerId,
    profession,
    aadhaar,
    businessName,
    businessType,
    location,
    district,
    state,
    pincode,
  } = input;

  if (!name || !name.trim()) {
    return { success: false, message: 'Buyer name is required.' };
  }

  if (!password || password.length < 6) {
    return { success: false, message: 'Password must be at least 6 characters long.' };
  }

  const phoneValidation = normalizeIndianPhoneNumber(mobile);
  if (!phoneValidation.isValid) {
    return { success: false, message: phoneValidation.error || 'Invalid mobile number.' };
  }

  const normalizedPhone = phoneValidation.normalized;

  // Check for duplicate account by mobile
  const existing = findUserByPhone(normalizedPhone);
  if (existing) {
    return {
      success: false,
      message: 'An account is already registered with this mobile number. Please login instead.',
    };
  }

  // Prevent duplicate email if email provided
  if (email && email.trim()) {
    const cleanEmail = email.trim().toLowerCase();
    const existingEmailUser = Array.from(users.values()).find(
      (u) => u.email && u.email.toLowerCase() === cleanEmail
    );
    if (existingEmailUser) {
      return {
        success: false,
        message: 'An account is already registered with this email address. Please login instead.',
      };
    }
  }

  // Prevent duplicate buyer ID if custom ID requested
  if (buyerId && buyerId.trim()) {
    const requestedId = buyerId.trim();
    const existingBuyerIdUser = Array.from(users.values()).find(
      (u) =>
        u.buyerProfile?.id?.toLowerCase() === requestedId.toLowerCase() ||
        u.id.toLowerCase() === requestedId.toLowerCase()
    );
    if (existingBuyerIdUser) {
      return {
        success: false,
        message: `Buyer ID "${requestedId}" is already in use. Please choose a different ID or login.`,
      };
    }
  }

  // Hash password
  const { salt, hash } = hashPassword(password);
  const now = new Date().toISOString();
  const userId = `usr_buyer_${Date.now()}`;

  let assignedBuyerId = buyerId?.trim();
  if (!assignedBuyerId) {
    let candidate = '';
    do {
      candidate = `BUYER-UP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    } while (
      Array.from(users.values()).some(
        (u) => u.buyerProfile?.id === candidate || u.id === candidate
      )
    );
    assignedBuyerId = candidate;
  }

  const typedBusinessType =
    (profession === 'Trader' || profession === 'Wholesaler'
      ? 'Wholesaler / Trader'
      : profession === 'Retailer'
      ? 'Retailer / Supermarket'
      : (businessType as any)) || 'Wholesaler / Trader';

  const buyerEmail = (email && email.trim()) || `${assignedBuyerId.toLowerCase()}@kisansetu.in`;

  const buyerProfile: BuyerProfile = {
    id: assignedBuyerId,
    name: name.trim(),
    businessName: businessName?.trim() || `${name.trim()} Mandi Traders & Enterprises`,
    businessType: typedBusinessType,
    mobile: phoneValidation.displayPhone,
    email: buyerEmail,
    location: location?.trim() || `${district || 'Bareilly'}, ${state || 'Uttar Pradesh'}`,
    district: district?.trim() || 'Bareilly',
    state: state?.trim() || 'Uttar Pradesh',
    pincode: pincode?.trim() || '243001',
    deliveryAddress: `APMC Complex Yard, ${district || 'Bareilly'}, ${state || 'Uttar Pradesh'} - ${pincode || '243001'}`,
    gstinMasked: '09AAACB4821K1Z5',
    panMasked: aadhaar ? `XXXX-XXXX-${aadhaar.slice(-4)}` : 'AAACB4821K',
    verified: true,
    memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    preferredCrops: ['Wheat', 'Rice / Paddy', 'Maize', 'Pulses / Chana'],
    isDemoProfile: false,
  };

  const newUser: UserRecord = {
    id: userId,
    role: 'buyer',
    identifier: normalizedPhone,
    mobileNumber: normalizedPhone,
    mobileVerified: true,
    mobileVerifiedAt: now,
    email: buyerProfile.email,
    passwordSalt: salt,
    passwordHash: hash,
    createdAt: now,
    buyerProfile,
  };

  users.set(userId, newUser);

  // Initialize isolated data structures for new buyer
  buyerOrders.set(buyerProfile.id, []);
  buyerOrders.set(userId, []);
  buyerRequirements.set(buyerProfile.id, []);
  buyerRequirements.set(userId, []);
  buyerMessages.set(buyerProfile.id, []);
  buyerMessages.set(userId, []);

  // Generate session token
  const sessionToken = `stok_${crypto.randomBytes(32).toString('hex')}`;
  activeSessions.set(sessionToken, {
    token: sessionToken,
    userId,
    role: 'buyer',
    createdAt: now,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  saveStoreToDisk();

  return {
    success: true,
    message: `Buyer account created successfully! Your Buyer ID is ${assignedBuyerId}.`,
    token: sessionToken,
    role: 'buyer' as const,
    userId,
    buyerId: assignedBuyerId,
    user: buyerProfile,
    profile: buyerProfile,
  };
}

// ============================================================================
// DIRECT PASSWORD-BASED LOGIN
// ============================================================================

export async function directUserLogin(role: UserRole, identifier: string, password: string) {
  if (!identifier || !identifier.trim()) {
    return { success: false, message: 'Please enter your mobile number, email, or Account ID.' };
  }

  if (!password) {
    return { success: false, message: 'Please enter your password.' };
  }

  // Admin Login Handler
  if (role === 'admin') {
    const cleanId = identifier.trim().toLowerCase();
    const adminUser = users.get('usr_admin_001');
    const isIdMatch =
      cleanId === CONFIG_ADMIN_EMAIL ||
      cleanId === 'admin@kisansetu.in' ||
      cleanId === 'usr_admin_001' ||
      (adminUser && adminUser.email?.toLowerCase() === cleanId);

    if (!isIdMatch || !adminUser) {
      return { success: false, message: 'Invalid administrator credentials.' };
    }

    const isPwMatch =
      password.trim() === CONFIG_ADMIN_PASSWORD ||
      verifyPassword(password, adminUser.passwordSalt, adminUser.passwordHash);

    if (!isPwMatch) {
      return { success: false, message: 'Invalid administrator credentials or password.' };
    }

    const token = `stok_admin_${crypto.randomBytes(32).toString('hex')}`;
    const now = new Date().toISOString();
    activeSessions.set(token, {
      token,
      userId: adminUser.id,
      role: 'admin',
      createdAt: now,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    });

    adminAuditLogs.unshift({
      id: `audit-${Date.now()}`,
      action: 'ADMIN_LOGIN',
      adminEmail: CONFIG_ADMIN_EMAIL,
      targetType: 'system',
      targetId: adminUser.id,
      targetName: 'KisanSetu Admin Console',
      details: `Administrator signed in at ${now}`,
      timestamp: now,
    });

    saveStoreToDisk();

    return {
      success: true,
      message: 'Admin login successful!',
      token,
      role: 'admin' as UserRole,
      userId: adminUser.id,
      user: {
        id: adminUser.id,
        role: 'admin',
        email: CONFIG_ADMIN_EMAIL,
        name: 'KisanSetu Administrator',
      },
    };
  }

  const user = findUserByIdentifier(identifier, role);
  if (!user) {
    const otherRole = role === 'farmer' ? 'buyer' : 'farmer';
    const existsOther = findUserByIdentifier(identifier, otherRole);
    if (existsOther) {
      return {
        success: false,
        message: `यह खाता ${otherRole === 'farmer' ? 'किसान (Farmer)' : 'व्यापारी/खरीदार (Buyer)'} के रूप में पंजीकृत है। कृपया ${otherRole === 'farmer' ? 'किसान पोर्टल (मैं किसान हूँ)' : 'खरीदार पोर्टल (मैं खरीदार हूँ)'} से लॉगिन करें।`,
      };
    }
    return {
      success: false,
      message: `Invalid credentials. No ${role} account found matching this identifier.`,
    };
  }

  if (user.status === 'suspended') {
    return {
      success: false,
      message: 'This account has been suspended by the administrator. Please contact support.',
    };
  }


  // Verify password hash
  const isValidPassword = verifyPassword(password, user.passwordSalt, user.passwordHash);
  if (!isValidPassword) {
    return {
      success: false,
      message: 'Invalid credentials or password.',
    };
  }

  // Issue authenticated session token immediately
  const token = `stok_${crypto.randomBytes(32).toString('hex')}`;
  const now = new Date().toISOString();

  activeSessions.set(token, {
    token,
    userId: user.id,
    role: user.role,
    createdAt: now,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  saveStoreToDisk();

  const profileData =
    user.role === 'farmer' ? user.farmerProfile : user.role === 'buyer' ? user.buyerProfile : { id: user.id, role: user.role };

  return {
    success: true,
    message: 'Login successful!',
    token,
    role: user.role,
    userId: user.id,
    farmerId: user.farmerProfile?.farmerId,
    buyerId: user.buyerProfile?.id,
    user: profileData,
    profile: profileData,
  };
}

// ============================================================================
// SESSION MANAGEMENT & LOGOUT
// ============================================================================

export function getAuthenticatedUser(token: string) {
  if (!token) return null;
  const session = activeSessions.get(token);
  if (!session) return null;

  if (session.expiresAt < Date.now()) {
    activeSessions.delete(token);
    return null;
  }

  const user = users.get(session.userId);
  if (!user) return null;

  const profileData =
    user.role === 'farmer' ? user.farmerProfile : user.role === 'buyer' ? user.buyerProfile : { id: user.id, role: user.role };

  return {
    userId: user.id,
    role: user.role,
    mobileNumber: user.mobileNumber,
    email: user.email,
    profile: profileData,
    user: profileData,
  };
}

export function revokeSessionToken(token: string): boolean {
  if (!token) return false;
  const deleted = activeSessions.delete(token);
  if (deleted) {
    saveStoreToDisk();
  }
  return deleted;
}

export function getFarmerProfileByUserId(userId: string): FarmerProfile | null {
  const user = users.get(userId);
  if (!user || user.role !== 'farmer' || !user.farmerProfile) {
    return null;
  }
  return user.farmerProfile;
}

export function updateFarmerProfileByUserId(userId: string, updates: Partial<FarmerProfile>): FarmerProfile | null {
  const user = users.get(userId);
  if (!user || user.role !== 'farmer' || !user.farmerProfile) {
    return null;
  }
  user.farmerProfile = {
    ...user.farmerProfile,
    ...updates,
    farmerId: user.farmerProfile.farmerId, // Keep immutable farmer ID protected
  };
  saveStoreToDisk();
  return user.farmerProfile;
}

export function findFarmerUser(idOrFarmerId: string): UserRecord | null {
  if (!idOrFarmerId) return null;
  const clean = idOrFarmerId.trim();
  const direct = users.get(clean);
  if (direct && direct.role === 'farmer' && direct.farmerProfile) return direct;

  for (const u of users.values()) {
    if (u.role === 'farmer' && u.farmerProfile) {
      if (
        u.id === clean ||
        u.farmerProfile.farmerId === clean ||
        u.farmerProfile.farmerId.toLowerCase() === clean.toLowerCase() ||
        u.identifier === clean ||
        u.mobileNumber === clean
      ) {
        return u;
      }
    }
  }
  return null;
}

export function resolveCanonicalFarmerId(idOrFarmerId: string): string {
  if (!idOrFarmerId) return idOrFarmerId;
  const user = findFarmerUser(idOrFarmerId);
  if (user && user.farmerProfile?.farmerId) {
    return user.farmerProfile.farmerId;
  }
  return idOrFarmerId.trim();
}

export function getFarmerCrops(farmerId: string): CropListing[] {
  if (!farmerId) return [];
  const canonicalId = resolveCanonicalFarmerId(farmerId);
  const user = findFarmerUser(farmerId);

  // If canonical key exists in farmerCrops (even if empty []), return it directly
  if (farmerCrops.has(canonicalId)) {
    const list = farmerCrops.get(canonicalId) || [];
    return list.filter((c) => isUserFacingApprovedCrop(c.name || (c as any).crop));
  }

  // If present in user.id and not canonicalId
  if (user && farmerCrops.has(user.id)) {
    const list = farmerCrops.get(user.id) || [];
    farmerCrops.set(canonicalId, list);
    return list.filter((c) => isUserFacingApprovedCrop(c.name || (c as any).crop));
  }

  // Fallback check by raw id
  const raw = farmerId.trim();
  if (farmerCrops.has(raw)) {
    const list = farmerCrops.get(raw) || [];
    farmerCrops.set(canonicalId, list);
    return list.filter((c) => isUserFacingApprovedCrop(c.name || (c as any).crop));
  }

  // Initialize empty array for this farmer
  farmerCrops.set(canonicalId, []);
  return [];
}

export function saveFarmerCrop(farmerId: string, crop: CropListing): CropListing {
  const cropName = crop.name || (crop as any).crop || '';
  if (!isUserFacingApprovedCrop(cropName)) {
    throw new Error(`Crop "${cropName}" is not supported. KisanSetu supports only Wheat, Rice / Paddy, Maize, and Pulses / Chana.`);
  }

  const user = findFarmerUser(farmerId);
  const canonicalId = user?.farmerProfile?.farmerId || resolveCanonicalFarmerId(farmerId);
  const farmerProfile = user?.farmerProfile;

  const now = new Date().toISOString();
  const rawPrice = Number(crop.expectedPrice || (crop as any).pricePerKg || crop.currentMandiPrice || 25);
  const rawQty = Number(crop.quantityKg || (crop as any).quantity || 1000);
  const district = crop.district || farmerProfile?.district || 'Bareilly';
  const state = crop.state || 'Uttar Pradesh';
  const location = crop.location || `${district}, ${state}`;

  const resolvedCropImg = resolveSafeCropImage(
    crop.name || (crop as any).crop,
    crop.variety,
    crop.category,
    crop.imageUrl || (crop.images && crop.images[0])
  );

  const enrichedCrop: CropListing = {
    ...crop,
    id: crop.id || `crop-${Date.now()}`,
    name: crop.name || (crop as any).crop || 'Wheat',
    variety: crop.variety || 'Standard',
    category: crop.category || 'Grains',
    grade: crop.grade || 'A',
    quantityKg: rawQty,
    expectedPrice: rawPrice,
    currentMandiPrice: crop.currentMandiPrice || rawPrice,
    location,
    district,
    state,
    latitude: (crop as any).latitude ?? (farmerProfile as any)?.latitude,
    longitude: (crop as any).longitude ?? (farmerProfile as any)?.longitude,
    nearestMandi: crop.nearestMandi || `${district} APMC Mandi`,
    status: crop.status || 'Available for Sale',
    photoVerified: crop.photoVerified !== undefined ? crop.photoVerified : true,
    isDemoVerification: crop.isDemoVerification !== undefined ? crop.isDemoVerification : false,
    imageUrl: resolvedCropImg,
    images: crop.images && crop.images.length > 0 ? crop.images : [resolvedCropImg],
    harvestedDate: crop.harvestedDate || (crop as any).harvestDate || now.split('T')[0],
    storageLocation: crop.storageLocation || (crop as any).storageType || 'On-Farm Covered Storage',
    moistureContent: crop.moistureContent || 'Optimal',
    description: crop.description || `${crop.variety || 'Standard'} ${crop.name || 'Crop'} freshly harvested by ${farmerProfile?.name || 'verified farmer'} in ${district}.`,
    // Injected central marketplace compatibility metadata:
    ...({
      listingId: crop.id || `crop-${Date.now()}`,
      farmerId: canonicalId,
      sellerId: canonicalId,
      farmerName: farmerProfile?.name || (crop as any).farmerName || 'Kisan Producer',
      farmerPhone: farmerProfile?.mobile || (crop as any).farmerPhone || '',
      farmerLocation: location,
      latitude: (crop as any).latitude ?? (farmerProfile as any)?.latitude,
      longitude: (crop as any).longitude ?? (farmerProfile as any)?.longitude,
      qualityClassification: (crop as any).qualityClassification || (crop.grade === 'A+' || crop.grade === 'PREMIUM' ? 'PREMIUM' : 'STANDARD'),
      farmerVerified: farmerProfile ? farmerProfile.eKycStatus === 'VERIFIED ✓' : true,
      availableQuantityKg: (crop as any).availableQuantityKg !== undefined ? Number((crop as any).availableQuantityKg) : rawQty,
      pricePerKg: rawPrice,
      crop: crop.name || (crop as any).crop || 'Wheat',
      createdAt: (crop as any).createdAt || now,
      updatedAt: now,
      listingDate: (crop as any).listingDate || now,
      createdTimestamp: (crop as any).createdTimestamp || Date.now(),
      batchId: (crop as any).batchId || `BATCH-${canonicalId.split('-').pop() || '00'}-${(crop.id || '').replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase()}`,
    } as any),
  };

  const existing = farmerCrops.get(canonicalId) || [];
  const idx = existing.findIndex((c) => c.id === enrichedCrop.id);
  let updated: CropListing[];
  if (idx >= 0) {
    updated = [...existing];
    updated[idx] = enrichedCrop;
  } else {
    updated = [enrichedCrop, ...existing];
  }
  farmerCrops.set(canonicalId, updated);

  if (user && user.id !== canonicalId) {
    farmerCrops.set(user.id, updated);
  }

  saveStoreToDisk();
  return enrichedCrop;
}

export function deleteFarmerCrop(
  farmerId: string,
  cropId: string
): { success: boolean; deletedCount: number; message: string } {
  const cleanCropId = (cropId || '').trim();
  if (!cleanCropId) {
    return { success: false, deletedCount: 0, message: 'Crop ID is required.' };
  }
  const user = findFarmerUser(farmerId);
  const canonicalId = user?.farmerProfile?.farmerId || resolveCanonicalFarmerId(farmerId);

  let totalDeleted = 0;

  // Track all keys relevant to this farmer
  const targetKeys = new Set<string>();
  if (canonicalId) targetKeys.add(canonicalId);
  if (farmerId) targetKeys.add(farmerId.trim());
  if (user && user.id) targetKeys.add(user.id);

  // 1. Delete from all known farmer keys
  for (const key of targetKeys) {
    if (farmerCrops.has(key)) {
      const list = farmerCrops.get(key) || [];
      const beforeCount = list.length;
      const filtered = list.filter((c) => {
        const isMatch =
          c.id === cleanCropId ||
          (c as any).listingId === cleanCropId ||
          (c as any).batchId === cleanCropId;
        return !isMatch;
      });
      if (filtered.length < beforeCount) {
        totalDeleted += beforeCount - filtered.length;
      }
      farmerCrops.set(key, filtered);
    }
  }

  // 2. Also search all other entries in farmerCrops in case the crop was saved under an alternate key
  for (const [key, list] of farmerCrops.entries()) {
    if (targetKeys.has(key)) continue;
    const hasMatchingCrop = list.some((c) => {
      const isMatch =
        c.id === cleanCropId ||
        (c as any).listingId === cleanCropId ||
        (c as any).batchId === cleanCropId;
      if (!isMatch) return false;
      const cFarmer = (c as any).farmerId || (c as any).sellerId;
      return !cFarmer || cFarmer === canonicalId || cFarmer === farmerId || (user && cFarmer === user.id);
    });

    if (hasMatchingCrop) {
      const beforeCount = list.length;
      const filtered = list.filter((c) => {
        const isMatch =
          c.id === cleanCropId ||
          (c as any).listingId === cleanCropId ||
          (c as any).batchId === cleanCropId;
        return !isMatch;
      });
      totalDeleted += beforeCount - filtered.length;
      farmerCrops.set(key, filtered);
    }
  }

  // 3. Keep canonicalId and user.id strictly synced
  if (canonicalId && user && user.id && canonicalId !== user.id) {
    const canonList = farmerCrops.get(canonicalId) || [];
    farmerCrops.set(user.id, [...canonList]);
  }

  // 4. Save to disk immediately
  saveStoreToDisk();

  return {
    success: true,
    deletedCount: totalDeleted,
    message: totalDeleted > 0 ? `Crop listing "${cleanCropId}" deleted successfully.` : `Crop "${cleanCropId}" removed.`,
  };
}

export function normalizeToMarketplaceCategory(
  category?: string,
  cropName?: string
): 'Grains' | 'Pulses' {
  const cat = (category || '').toLowerCase();
  const cName = (cropName || '').toLowerCase();

  if (
    cat.includes('pulse') ||
    cat.includes('dal') ||
    cat.includes('legume') ||
    cat.includes('chana') ||
    cName.includes('chana') ||
    cName.includes('pulse') ||
    cName.includes('dal') ||
    cName.includes('gram') ||
    cName.includes('masoor') ||
    cName.includes('arhar') ||
    cName.includes('tur') ||
    cName.includes('moong') ||
    cName.includes('urad')
  ) {
    return 'Pulses';
  }
  return 'Grains';
}

export function mapCropToMarketplaceProduct(
  crop: CropListing,
  farmerProfile?: FarmerProfile
): MarketplaceProduct {
  const fId = (crop as any).farmerId || (crop as any).sellerId || farmerProfile?.farmerId || 'KISAN-UP-2026-8842';
  const linkedUser = findFarmerUser(fId);
  const actualProfile = linkedUser?.farmerProfile || farmerProfile;

  // Real Farmer Name Guarantee (Never Demo Farmer / Sample Farmer)
  const resolvedFarmerName =
    actualProfile?.name &&
    !actualProfile.name.toLowerCase().includes('demo') &&
    !actualProfile.name.toLowerCase().includes('sample')
      ? actualProfile.name
      : (crop as any).farmerName || actualProfile?.name || 'Kisan Producer';

  const district = crop.district || actualProfile?.district || 'Bareilly';
  const state = crop.state || 'Uttar Pradesh';
  const location =
    crop.location ||
    (actualProfile?.village ? `${actualProfile.village}, ${actualProfile.district}, ${state}` : `${district}, ${state}`);
  const cat = normalizeToMarketplaceCategory(crop.category, crop.name);
  const qty = Number(
    (crop as any).availableQuantityKg !== undefined
      ? (crop as any).availableQuantityKg
      : crop.quantityKg || 1000
  );
  const price = Number(crop.expectedPrice || (crop as any).pricePerKg || crop.currentMandiPrice || 25);
  
  // Strict Same-Crop Image Priority (Farmer uploaded -> Variety -> Crop -> Category -> Safe Produce)
  const rawImg = crop.imageUrl || (crop.images && crop.images[0]);
  const primaryImg = resolveSafeCropImage(crop.name, crop.variety, cat, rawImg);
  const gallery = crop.images && crop.images.length > 0 ? crop.images : [primaryImg];

  const createdTime = (crop as any).createdTimestamp || ((crop as any).createdAt ? Date.parse((crop as any).createdAt) : Date.now());

  return {
    id: crop.id,
    crop: crop.name || (crop as any).crop || 'Harvest Crop',
    variety: crop.variety || 'Standard',
    category: cat,
    grade: (crop.grade as any) || 'A',
    pricePerKg: price,
    availableQuantityKg: qty,
    ...({ quantityKg: qty } as any),
    minOrderQtyKg: Math.min(50, qty),
    location,
    district,
    state,
    distanceKm: (crop as any).distanceKm || Math.floor(18 + Math.random() * 32),
    farmerId: fId,
    farmerName: resolvedFarmerName,
    farmerVerified: actualProfile ? (actualProfile.eKycStatus === 'VERIFIED ✓') : true,
    farmerRating: (actualProfile as any)?.rating || 4.8,
    farmerPhone: (crop as any).farmerPhone || actualProfile?.mobile || '',
    nearestMandi: crop.nearestMandi || `${district} APMC Mandi`,
    completedDeals: (actualProfile as any)?.completedDeals || 14,
    harvestDate: crop.harvestedDate || (crop as any).harvestDate || 'Recent Harvest',
    createdAt: (crop as any).createdAt || new Date(createdTime).toISOString(),
    createdTimestamp: createdTime,
    storageType: crop.storageLocation || (crop as any).storageType || 'On-Farm Covered Shed',
    moistureContent: crop.moistureContent || 'Optimal',
    latitude: (crop as any).latitude ?? crop.coordinates?.latitude ?? (actualProfile as any)?.latitude,
    longitude: (crop as any).longitude ?? crop.coordinates?.longitude ?? (actualProfile as any)?.longitude,
    qualityClassification: (crop as any).qualityClassification || (crop.grade === 'A+' || crop.grade === 'PREMIUM' ? 'PREMIUM' : 'STANDARD'),
    imageUrl: primaryImg,
    galleryImages: gallery,
    description: crop.description || `${crop.variety || ''} ${crop.name || 'Crop'} directly from verified farmer in ${district}`,
    batchId: (crop as any).batchId || `BATCH-${fId.split('-').pop() || '00'}-${crop.id.replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase()}`,
    status: (crop.status as any) || 'Available for Sale',
    purchaseOpportunityScore: 92,
    smartBuySignal: price <= (crop.currentMandiPrice || price) ? 'Favorable' : 'Neutral',
    smartBuyRecommendation: (crop as any).produceType === 'processed'
      ? `Freshly processed value-added commodity from ${resolvedFarmerName}`
      : `Direct harvest listing from ${resolvedFarmerName}`,
    produceType: (crop as any).produceType || 'raw',
    processingType: (crop as any).processingType,
    sourceCropName: (crop as any).sourceCropName,
    sourceCropVariety: (crop as any).sourceCropVariety,
    sourceBatchId: (crop as any).sourceBatchId,
    processingDate: (crop as any).processingDate,
    processingCost: (crop as any).processingCost,
    processingYield: (crop as any).processingYield,
    processingFacility: (crop as any).processingFacility,
  };
}

export function getAllMarketplaceListings(options?: {
  crop?: string;
  variety?: string;
  district?: string;
  category?: string;
  status?: string;
  search?: string;
  farmerId?: string;
  minPrice?: number;
  maxPrice?: number;
  produceType?: string;
}): MarketplaceProduct[] {
  const seenIds = new Set<string>();
  const allListings: MarketplaceProduct[] = [];

  // Group by canonical farmer ID to ensure alias keys do not resurface deleted listings
  const canonicalGroups = new Map<string, { fId: string; list: CropListing[] }>();
  for (const [key, cropList] of farmerCrops.entries()) {
    const canon = resolveCanonicalFarmerId(key);
    if (!canonicalGroups.has(canon) || key === canon) {
      canonicalGroups.set(canon, { fId: canon, list: cropList });
    }
  }

  for (const { fId, list: cropList } of canonicalGroups.values()) {
    const farmerUser = findFarmerUser(fId);
    const profile = farmerUser?.farmerProfile;

    for (const crop of cropList) {
      if (!crop || !crop.id) continue;
      if (seenIds.has(crop.id)) continue;
      seenIds.add(crop.id);

      // Status check: only active/available listings in marketplace
      const statusLower = (crop.status || '').toLowerCase();
      if (statusLower === 'sold' || statusLower === 'inactive' || statusLower === 'deleted') {
        continue;
      }
      const qty = Number((crop as any).availableQuantityKg !== undefined ? (crop as any).availableQuantityKg : crop.quantityKg);
      if (qty <= 0) {
        continue;
      }

      // Enforce 4 approved active crops only (Wheat, Rice/Paddy, Maize, Pulses/Chana)
      const cropName = crop.name || (crop as any).crop || '';
      if (!isUserFacingApprovedCrop(cropName)) {
        continue;
      }

      const prod = mapCropToMarketplaceProduct(crop, profile);
      allListings.push(prod);
    }
  }

  // Filter if options provided
  let filtered = allListings;
  if (options) {
    if (options.farmerId) {
      filtered = filtered.filter((p) => p.farmerId === options.farmerId);
    }
    if (options.crop) {
      const c = options.crop.toLowerCase().trim();
      filtered = filtered.filter((p) => p.crop.toLowerCase().includes(c));
    }
    if (options.variety) {
      const v = options.variety.toLowerCase().trim();
      filtered = filtered.filter((p) => p.variety.toLowerCase().includes(v));
    }
    if (options.category && options.category !== 'all') {
      filtered = filtered.filter((p) => p.category === options.category);
    }
    if (options.district) {
      const d = options.district.toLowerCase().trim();
      filtered = filtered.filter((p) => p.district.toLowerCase().includes(d) || p.location.toLowerCase().includes(d));
    }
    if (options.minPrice !== undefined && options.minPrice > 0) {
      filtered = filtered.filter((p) => p.pricePerKg >= options.minPrice!);
    }
    if (options.maxPrice !== undefined && options.maxPrice > 0) {
      filtered = filtered.filter((p) => p.pricePerKg <= options.maxPrice!);
    }
    if (options.produceType && options.produceType !== 'all') {
      if (options.produceType === 'processed') {
        filtered = filtered.filter((p) => (p as any).produceType === 'processed');
      } else if (options.produceType === 'raw') {
        filtered = filtered.filter((p) => !(p as any).produceType || (p as any).produceType === 'raw');
      }
    }
    if (options.search) {
      const s = options.search.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.crop.toLowerCase().includes(s) ||
          p.variety.toLowerCase().includes(s) ||
          p.farmerName.toLowerCase().includes(s) ||
          p.location.toLowerCase().includes(s)
      );
    }
  }

  // Sort: newest first
  filtered.sort((a, b) => {
    const timeA = a.createdTimestamp || (a.createdAt ? Date.parse(a.createdAt) : 0);
    const timeB = b.createdTimestamp || (b.createdAt ? Date.parse(b.createdAt) : 0);
    return timeB - timeA;
  });

  return filtered;
}

export function getMarketplaceListingById(listingId: string): MarketplaceProduct | null {
  if (!listingId) return null;
  for (const [fId, cropList] of farmerCrops.entries()) {
    const crop = cropList.find((c) => c.id === listingId);
    if (crop) {
      const farmerUser = findFarmerUser(fId);
      return mapCropToMarketplaceProduct(crop, farmerUser?.farmerProfile);
    }
  }
  return null;
}

export interface PublicFarmerProfile {
  farmerId: string;
  name: string;
  location: string;
  district: string;
  tehsil: string;
  village: string;
  state: string;
  verified: boolean;
  memberSince: string;
  landAreaAcres?: number;
  primaryCrops?: string[];
  soilHealthCertified?: boolean;
  nearestMandi?: string;
  rating?: number;
  completedDeals?: number;
}

export function getPublicFarmerProfile(farmerId: string): PublicFarmerProfile | null {
  if (!farmerId) return null;
  const user = findFarmerUser(farmerId);
  if (!user || user.role !== 'farmer' || !user.farmerProfile) {
    return null;
  }
  const p = user.farmerProfile;
  return {
    farmerId: p.farmerId,
    name: p.name,
    location: p.address || `${p.district}, Uttar Pradesh`,
    district: p.district,
    tehsil: p.tehsil,
    village: p.village,
    state: 'Uttar Pradesh',
    verified: p.eKycStatus === 'VERIFIED ✓',
    memberSince: p.memberSince || 'January 2025',
    landAreaAcres: p.landAreaAcres || p.totalLandAcres,
    primaryCrops: p.primaryCrops || [],
    soilHealthCertified: !!p.soilHealthStatus,
    nearestMandi: `${p.district} APMC Mandi`,
    rating: 4.8,
    completedDeals: 16,
  };
}

export function getMarketplaceFarmers(): PublicFarmerProfile[] {
  const farmers: PublicFarmerProfile[] = [];
  const seenFarmerIds = new Set<string>();

  for (const u of users.values()) {
    if (u.role === 'farmer' && u.farmerProfile) {
      if (seenFarmerIds.has(u.farmerProfile.farmerId)) continue;
      seenFarmerIds.add(u.farmerProfile.farmerId);
      const pub = getPublicFarmerProfile(u.farmerProfile.farmerId);
      if (pub) farmers.push(pub);
    }
  }
  return farmers;
}

export function findBuyerUser(idOrBuyerId: string): UserRecord | null {
  if (!idOrBuyerId) return null;
  const direct = users.get(idOrBuyerId);
  if (direct && direct.role === 'buyer' && direct.buyerProfile) return direct;

  for (const u of users.values()) {
    if (u.role === 'buyer' && u.buyerProfile) {
      if (u.id === idOrBuyerId || u.buyerProfile.id === idOrBuyerId) {
        return u;
      }
    }
  }
  return null;
}

export function resolveCanonicalBuyerId(idOrBuyerId: string): string {
  if (!idOrBuyerId) return idOrBuyerId;
  const user = findBuyerUser(idOrBuyerId);
  if (user && user.buyerProfile?.id) {
    return user.buyerProfile.id;
  }
  return idOrBuyerId;
}

export function getBuyerProfileByUserId(userId: string): BuyerProfile | null {
  const user = findBuyerUser(userId);
  if (!user || user.role !== 'buyer' || !user.buyerProfile) {
    return null;
  }
  return { ...user.buyerProfile };
}

export function updateBuyerProfileByUserId(
  userId: string,
  updates: Partial<BuyerProfile>
): BuyerProfile | null {
  const user = findBuyerUser(userId);
  if (!user || user.role !== 'buyer' || !user.buyerProfile) {
    return null;
  }
  user.buyerProfile = {
    ...user.buyerProfile,
    ...updates,
    id: user.buyerProfile.id, // Preserve immutable buyer ID
  };
  saveStoreToDisk();
  return { ...user.buyerProfile };
}

export function getBuyerOrders(buyerId: string): BuyerOrder[] {
  const canonicalId = resolveCanonicalBuyerId(buyerId);
  const primary = buyerOrders.get(canonicalId) || [];
  if (canonicalId !== buyerId) {
    const secondary = buyerOrders.get(buyerId) || [];
    const map = new Map<string, BuyerOrder>();
    for (const o of secondary) map.set(o.id, o);
    for (const o of primary) map.set(o.id, o);
    return Array.from(map.values());
  }
  return primary;
}

export function addBuyerOrder(buyerId: string, orderData: Partial<BuyerOrder>): BuyerOrder {
  const canonicalId = resolveCanonicalBuyerId(buyerId);
  const current = buyerOrders.get(canonicalId) || [];
  const newOrder: BuyerOrder = {
    ...orderData,
    id: orderData.id || `KS-ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: orderData.createdAt || new Date().toISOString().split('T')[0],
    buyerId: canonicalId,
    status: orderData.status || 'confirmed',
  } as BuyerOrder;
  const updated = [newOrder, ...current];
  buyerOrders.set(canonicalId, updated);
  if (canonicalId !== buyerId) {
    buyerOrders.set(buyerId, updated);
  }

  // Inventory Sync: deduct quantity from the farmer's listing to prevent overselling
  if (orderData.productId && orderData.quantityKg) {
    const orderQty = Number(orderData.quantityKg);
    for (const [fId, crops] of farmerCrops.entries()) {
      const targetCropIndex = crops.findIndex((c) => c.id === orderData.productId || (c as any).listingId === orderData.productId);
      if (targetCropIndex >= 0) {
        const targetCrop = crops[targetCropIndex];
        const currentAvail = Number((targetCrop as any).availableQuantityKg !== undefined ? (targetCrop as any).availableQuantityKg : targetCrop.quantityKg);
        const newAvail = Math.max(0, currentAvail - orderQty);
        const updatedCrop = {
          ...targetCrop,
          availableQuantityKg: newAvail,
          quantityKg: newAvail,
          status: newAvail <= 0 ? 'Sold' : targetCrop.status,
        };
        const updatedCrops = [...crops];
        updatedCrops[targetCropIndex] = updatedCrop;
        farmerCrops.set(fId, updatedCrops);
        break;
      }
    }
  }

  saveStoreToDisk();
  return newOrder;
}

export function getBuyerRequirements(buyerId: string): BuyerRequirement[] {
  const canonicalId = resolveCanonicalBuyerId(buyerId);
  const primary = buyerRequirements.get(canonicalId) || [];
  if (canonicalId !== buyerId) {
    const secondary = buyerRequirements.get(buyerId) || [];
    const map = new Map<string, BuyerRequirement>();
    for (const r of secondary) map.set(r.id, r);
    for (const r of primary) map.set(r.id, r);
    return Array.from(map.values());
  }
  return primary;
}

export function addBuyerRequirement(
  buyerId: string,
  reqData: Partial<BuyerRequirement>
): BuyerRequirement {
  const canonicalId = resolveCanonicalBuyerId(buyerId);
  const current = buyerRequirements.get(canonicalId) || [];
  const qty = Number(reqData.requiredQuantityKg) || Number((reqData as any).quantityKg) || 1000;
  const newReq: BuyerRequirement = {
    ...reqData,
    id: reqData.id || `REQ-2026-${Math.floor(100 + Math.random() * 900)}`,
    requiredQuantityKg: qty,
    crop: reqData.crop || 'Produce',
    variety: reqData.variety || '',
    grade: reqData.grade || 'A',
    maxPricePerKg: Number(reqData.maxPricePerKg) || 25,
    preferredLocation: reqData.preferredLocation || 'Uttar Pradesh',
    maxDistanceKm: Number(reqData.maxDistanceKm) || 50,
    deliveryDate: reqData.deliveryDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    createdAt: reqData.createdAt || new Date().toISOString().split('T')[0],
    status: reqData.status || 'Matching',
    matchedFarmersCount: reqData.matchedFarmersCount ?? (reqData.matchedFarmers?.length || 1),
    matchedQuantityKg: reqData.matchedQuantityKg ?? Math.round(qty * 0.6),
    matchScore: reqData.matchScore ?? 90,
    matchedFarmers: reqData.matchedFarmers || [],
    buyerId: canonicalId,
    userId: canonicalId,
  } as BuyerRequirement;
  const updated = [newReq, ...current];
  buyerRequirements.set(canonicalId, updated);
  if (canonicalId !== buyerId) {
    buyerRequirements.set(buyerId, updated);
  }
  saveStoreToDisk();
  return newReq;
}

export function updateBuyerRequirementStatus(
  buyerId: string,
  reqId: string,
  status: string
): boolean {
  const canonicalId = resolveCanonicalBuyerId(buyerId);
  const list = buyerRequirements.get(canonicalId) || (canonicalId !== buyerId ? buyerRequirements.get(buyerId) : null);
  if (!list) return false;
  const item = list.find((r) => r.id === reqId);
  if (!item) return false;
  item.status = status as any;
  saveStoreToDisk();
  return true;
}

export function getBuyerMessageThreads(buyerId: string): BuyerMessageThread[] {
  const canonicalId = resolveCanonicalBuyerId(buyerId);
  const primary = buyerMessages.get(canonicalId) || [];
  if (canonicalId !== buyerId) {
    const secondary = buyerMessages.get(buyerId) || [];
    const map = new Map<string, BuyerMessageThread>();
    for (const t of secondary) map.set(t.id, t);
    for (const t of primary) map.set(t.id, t);
    return Array.from(map.values());
  }
  return primary;
}

export function addBuyerMessageToThread(
  buyerId: string,
  threadId: string,
  text: string,
  farmerId?: string,
  cropContext?: string,
  farmerName?: string,
  farmerLocation?: string
): BuyerMessageThread {
  const canonicalId = resolveCanonicalBuyerId(buyerId);
  let list = buyerMessages.get(canonicalId);
  if (!list) {
    list = [];
    buyerMessages.set(canonicalId, list);
  }
  let thread = list.find((t) => t.id === threadId);
  if (!thread) {
    thread = {
      id: threadId,
      farmerId: farmerId || 'KISAN-FARMER',
      farmerName: farmerName || 'Verified Farmer',
      farmerLocation: farmerLocation || 'Uttar Pradesh',
      cropContext: cropContext || 'Produce',
      unread: false,
      lastMessage: text,
      lastMessageTime: 'Just now',
      messages: [],
    };
    list.unshift(thread);
  }
  thread.lastMessage = text;
  thread.lastMessageTime = 'Just now';
  thread.messages.push({
    id: `M-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    sender: 'buyer',
    text,
    timestamp: 'Just now',
  });
  if (canonicalId !== buyerId) {
    buyerMessages.set(buyerId, list);
  }
  saveStoreToDisk();
  return thread;
}

export function revokeSession(token: string): boolean {
  if (!token) return false;
  const result = activeSessions.delete(token);
  saveStoreToDisk();
  return result;
}

// ============================================================================
// BUYER CART PERSISTENCE (ONE DATABASE - NO LOCAL-ONLY CART)
// ============================================================================

export function getBuyerCart(buyerId: string): any[] {
  const canonicalId = resolveCanonicalBuyerId(buyerId);
  return buyerCart.get(canonicalId) || buyerCart.get(buyerId) || [];
}

export function setBuyerCart(buyerId: string, items: any[]): any[] {
  const canonicalId = resolveCanonicalBuyerId(buyerId);
  const cleanItems = Array.isArray(items) ? items : [];
  buyerCart.set(canonicalId, cleanItems);
  if (canonicalId !== buyerId) {
    buyerCart.set(buyerId, cleanItems);
  }
  saveStoreToDisk();
  return cleanItems;
}

// ============================================================================
// BUYER FAVORITES PERSISTENCE (ONE DATABASE - NO LOCAL-ONLY FAVORITES)
// ============================================================================

export function getBuyerFavorites(buyerId: string): string[] {
  const canonicalId = resolveCanonicalBuyerId(buyerId);
  return buyerFavorites.get(canonicalId) || buyerFavorites.get(buyerId) || [];
}

export function setBuyerFavorites(buyerId: string, productIds: string[]): string[] {
  const canonicalId = resolveCanonicalBuyerId(buyerId);
  const cleanFavs = Array.isArray(productIds) ? Array.from(new Set(productIds)) : [];
  buyerFavorites.set(canonicalId, cleanFavs);
  if (canonicalId !== buyerId) {
    buyerFavorites.set(buyerId, cleanFavs);
  }
  saveStoreToDisk();
  return cleanFavs;
}

export function toggleBuyerFavorite(buyerId: string, productId: string): string[] {
  const current = getBuyerFavorites(buyerId);
  const set = new Set(current);
  if (set.has(productId)) {
    set.delete(productId);
  } else {
    set.add(productId);
  }
  const updated = Array.from(set);
  return setBuyerFavorites(buyerId, updated);
}

// ============================================================================
// PUBLIC FARMER PROFILE (SANITIZED - NO AADHAAR/PASSWORD/SENSITIVE SECRETS)
// ============================================================================

export function getFarmerPublicProfile(farmerId: string) {
  const user = findFarmerUser(farmerId);
  if (!user || user.role !== 'farmer' || !user.farmerProfile) {
    return null;
  }
  const p = user.farmerProfile;
  const canonicalId = p.farmerId || user.id;
  const crops = getFarmerCrops(canonicalId);
  const activeCrops = crops.filter(
    (c) => (c.status || '').toLowerCase() !== 'sold' && (c.status || '').toLowerCase() !== 'inactive'
  );

  return {
    farmerId: canonicalId,
    name: p.name,
    location: `${p.village || p.tehsil || ''}, ${p.district}, Uttar Pradesh`.replace(/^, /, ''),
    district: p.district,
    tehsil: p.tehsil,
    village: p.village,
    verified: p.eKycStatus === 'VERIFIED ✓',
    rating: (p as any).rating || 4.8,
    completedDeals: (p as any).completedDeals || 18,
    landAreaAcres: p.landAreaAcres || p.totalLandAcres || 5.0,
    primaryCrops: p.primaryCrops && p.primaryCrops.length ? p.primaryCrops : activeCrops.map((c) => c.name),
    soilHealthCertified: true,
    soilHealthCardCertified: true,
    nearestMandi: `${p.district} APMC Mandi`,
    memberSince: p.memberSince || '2025',
    activeListingsCount: activeCrops.length,
    activeCrops: activeCrops.map((c) => mapCropToMarketplaceProduct(c, p)),
  };
}

// ============================================================================
// UNIFIED CROSS-PLATFORM MESSAGE SYNC (BUYER <-> FARMER)
// ============================================================================

export function getFarmerMessageThreads(farmerId: string): BuyerMessageThread[] {
  const cleanId = farmerId.trim().toLowerCase();
  const matchedThreads: BuyerMessageThread[] = [];
  const seenThreadIds = new Set<string>();

  for (const list of buyerMessages.values()) {
    for (const thread of list) {
      if (seenThreadIds.has(thread.id)) continue;
      const tFId = (thread.farmerId || '').trim().toLowerCase();
      if (tFId === cleanId || cleanId.includes(tFId) || tFId.includes(cleanId)) {
        seenThreadIds.add(thread.id);
        matchedThreads.push(thread);
      }
    }
  }
  return matchedThreads;
}

export function addFarmerReplyToThread(
  farmerId: string,
  threadId: string,
  text: string
): BuyerMessageThread | null {
  for (const list of buyerMessages.values()) {
    const thread = list.find((t) => t.id === threadId);
    if (thread) {
      thread.lastMessage = text;
      thread.lastMessageTime = 'Just now';
      thread.unread = true; // unread for buyer
      thread.messages.push({
        id: `M-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        sender: 'farmer',
        text,
        timestamp: 'Just now',
      });
      saveStoreToDisk();
      return thread;
    }
  }
  return null;
}

// ============================================================================
// BUYER REQUIREMENT EDIT / UPDATE
// ============================================================================

export function updateBuyerRequirement(
  buyerId: string,
  reqId: string,
  updates: Partial<BuyerRequirement>
): BuyerRequirement | null {
  const canonicalId = resolveCanonicalBuyerId(buyerId);
  const list = buyerRequirements.get(canonicalId) || [];
  const req = list.find((r) => r.id === reqId);
  if (!req) return null;

  Object.assign(req, updates);
  if (updates.crop || updates.variety || updates.quantityKg || updates.targetPrice) {
    req.updatedAt = new Date().toISOString();
  }
  saveStoreToDisk();
  return req;
}

// ============================================================================
// POST-HARVEST PROCESSING & VALUE ADDITION LIFECYCLE MANAGEMENT
// ============================================================================

export function getFarmerProcessingRecords(farmerId: string): ProcessingRecord[] {
  const canonicalId = resolveCanonicalFarmerId(farmerId);
  let records = processingRecords.get(canonicalId) || [];
  if (records.length === 0 && canonicalId !== farmerId) {
    records = processingRecords.get(farmerId) || [];
  }
  // Return sorted newest first
  return [...records].sort((a, b) => {
    const timeA = a.createdAt ? Date.parse(a.createdAt) : 0;
    const timeB = b.createdAt ? Date.parse(b.createdAt) : 0;
    return timeB - timeA;
  });
}

export function createFarmerProcessingRecord(
  farmerId: string,
  recordData: Partial<ProcessingRecord>
): {
  success: boolean;
  message?: string;
  record?: ProcessingRecord;
  updatedSourceCrop?: CropListing;
  processedCrop?: CropListing;
} {
  const canonicalId = resolveCanonicalFarmerId(farmerId);
  const cropList = farmerCrops.get(canonicalId) || farmerCrops.get(farmerId) || [];
  const sourceCrop = cropList.find((c) => c.id === recordData.sourceCropId);

  if (!sourceCrop) {
    return {
      success: false,
      message: `Source raw crop inventory with ID "${recordData.sourceCropId}" was not found.`,
    };
  }

  const inputQty = Number(recordData.inputQuantityKg || 0);
  const currentAvail = Number(sourceCrop.quantityKg || 0);

  if (inputQty <= 0) {
    return {
      success: false,
      message: 'Processing input quantity must be greater than 0 kg.',
    };
  }

  if (inputQty > currentAvail) {
    return {
      success: false,
      message: `Insufficient raw inventory. Requested ${inputQty} kg, but only ${currentAvail} kg is available in lot.`,
    };
  }

  // 1. Deduct raw stock from source crop inventory
  sourceCrop.quantityKg = Math.max(0, currentAvail - inputQty);
  if ((sourceCrop as any).availableQuantityKg !== undefined) {
    (sourceCrop as any).availableQuantityKg = Math.max(0, Number((sourceCrop as any).availableQuantityKg) - inputQty);
  }
  if (sourceCrop.quantityKg === 0) {
    sourceCrop.status = 'Sold';
  }

  // 2. Calculate yield and loss
  const outputQty = Number(recordData.outputQuantityKg || 0);
  const lossKg = Math.max(0, Number((inputQty - outputQty).toFixed(2)));
  const yieldPercent = inputQty > 0 ? Math.min(100, Math.max(0, Number(((outputQty / inputQty) * 100).toFixed(1)))) : 0;

  // 3. Batch Traceability IDs
  const sourceBatchId =
    (sourceCrop as any).batchId ||
    (sourceCrop as any).sourceBatchId ||
    `BATCH-${canonicalId.split('-').pop() || '8842'}-${sourceCrop.id.replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase()}`;

  const cropShort = (sourceCrop.name || 'CROP').slice(0, 3).toUpperCase();
  const uniqueCode = Math.floor(1000 + Math.random() * 9000);
  const processedBatchId = `BATCH-PROC-${cropShort}-${uniqueCode}`;

  // 4. Resolve safe image
  const resolvedImg = resolveSafeCropImage(
    recordData.processedProductName || sourceCrop.name,
    recordData.processedProductVariety || sourceCrop.variety,
    sourceCrop.category,
    recordData.imageUrl || sourceCrop.imageUrl
  );

  const initialStatus: ProcessingStage = recordData.status || 'PROCESSING_IN_PROGRESS';
  const shouldPublish = recordData.isPublishedToMarketplace || initialStatus === 'PROCESSED_AVAILABLE';

  const newRecordId = `proc-rec-${Date.now()}-${uniqueCode}`;
  let processedCropListing: CropListing | undefined;

  // 5. If publishable or already processed, create the marketplace CropListing
  if (shouldPublish) {
    processedCropListing = {
      id: `crop-proc-${Date.now()}-${uniqueCode}`,
      name: recordData.processedProductName || `${sourceCrop.name} Value-Added Product`,
      variety: recordData.processedProductVariety || recordData.processingTypeName || 'Standard',
      category: sourceCrop.category,
      quantityKg: outputQty,
      availableQuantityKg: outputQty,
      grade: (recordData.processedProductGrade as any) || 'A+',
      location: sourceCrop.location,
      district: sourceCrop.district,
      state: sourceCrop.state,
      nearestMandi: sourceCrop.nearestMandi,
      currentMandiPrice: Math.round(Number(recordData.targetSellingPricePerKg || 40) * 0.9),
      expectedPrice: Number(recordData.targetSellingPricePerKg || 45),
      status: 'Available for Sale',
      photoVerified: true,
      isDemoVerification: false,
      imageUrl: resolvedImg,
      harvestedDate: sourceCrop.harvestedDate,
      processingDate: new Date().toISOString().split('T')[0],
      storageLocation: sourceCrop.storageLocation,
      moistureContent: 'Optimal Processed Level (<12%)',
      description:
        recordData.description ||
        `Freshly processed value-added produce from farm lot ${sourceBatchId}. Certified authentic agricultural produce directly from farmer.`,
      produceType: 'processed',
      processingType: recordData.processingTypeName,
      sourceCropId: sourceCrop.id,
      sourceCropName: sourceCrop.name,
      sourceCropVariety: sourceCrop.variety,
      sourceBatchId: sourceBatchId,
      processingRecordId: newRecordId,
      processingCost: Number(recordData.processingCostTotal || 0),
      processingYield: yieldPercent,
      processingFacility: recordData.partnerFacilityName || 'On-Farm Facility',
      batchId: processedBatchId,
    } as any;

    cropList.push(processedCropListing);
    farmerCrops.set(canonicalId, cropList);
  }

  // 6. Assemble complete ProcessingRecord
  const newRecord: ProcessingRecord = {
    id: newRecordId,
    farmerId: canonicalId,
    farmerName: recordData.farmerName || 'Rajesh Kumar',
    sourceCropId: sourceCrop.id,
    sourceCropName: sourceCrop.name,
    sourceCropVariety: sourceCrop.variety,
    sourceBatchId: sourceBatchId,
    processingTypeId: recordData.processingTypeId || 'custom-processing',
    processingTypeName: recordData.processingTypeName || 'Custom Transformation',
    inputQuantityKg: inputQty,
    outputQuantityKg: outputQty,
    processingLossKg: lossKg,
    processingYieldPercent: yieldPercent,
    availableProcessedQuantityKg: outputQty,
    soldProcessedQuantityKg: 0,
    rawCropPricePerKg: Number(recordData.rawCropPricePerKg || sourceCrop.expectedPrice || 25),
    processingCostTotal: Number(recordData.processingCostTotal || 0),
    processingCostPerKg: inputQty > 0 ? Number(((Number(recordData.processingCostTotal || 0)) / inputQty).toFixed(2)) : 0,
    targetSellingPricePerKg: Number(recordData.targetSellingPricePerKg || 45),
    estimatedValueAdditionAmount: Number(
      recordData.estimatedValueAdditionAmount !== undefined
        ? recordData.estimatedValueAdditionAmount
        : Math.round((outputQty * Number(recordData.targetSellingPricePerKg || 45)) - (inputQty * Number(recordData.rawCropPricePerKg || sourceCrop.expectedPrice || 25) + Number(recordData.processingCostTotal || 0)))
    ),
    processingMethod: recordData.processingMethod || 'self',
    partnerFacilityId: recordData.partnerFacilityId,
    partnerFacilityName: recordData.partnerFacilityName,
    partnerContactPhone: recordData.partnerContactPhone,
    processedProductName: recordData.processedProductName || `${sourceCrop.name} Processed`,
    processedProductVariety: recordData.processedProductVariety || 'Standard',
    processedProductGrade: recordData.processedProductGrade || 'A+',
    processedBatchId: processedBatchId,
    packagingType: recordData.packagingType || 'Standard Grain Sacks',
    description: recordData.description || '',
    imageUrl: resolvedImg,
    status: initialStatus,
    isPublishedToMarketplace: shouldPublish,
    marketplaceListingId: processedCropListing?.id,
    startDate: recordData.startDate || new Date().toISOString().split('T')[0],
    expectedCompletionDate: recordData.expectedCompletionDate,
    completedDate: initialStatus === 'PROCESSED_AVAILABLE' ? new Date().toISOString().split('T')[0] : undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const existingFarmerRecords = processingRecords.get(canonicalId) || [];
  existingFarmerRecords.push(newRecord);
  processingRecords.set(canonicalId, existingFarmerRecords);

  saveStoreToDisk();

  return {
    success: true,
    record: newRecord,
    updatedSourceCrop: sourceCrop,
    processedCrop: processedCropListing,
  };
}

export function updateProcessingRecordStatus(
  farmerId: string,
  recordId: string,
  newStatus: ProcessingStage,
  extra?: { isPublishedToMarketplace?: boolean; notes?: string }
): ProcessingRecord | null {
  const canonicalId = resolveCanonicalFarmerId(farmerId);
  const list = processingRecords.get(canonicalId) || processingRecords.get(farmerId) || [];
  const record = list.find((r) => r.id === recordId);
  if (!record) return null;

  record.status = newStatus;
  record.updatedAt = new Date().toISOString();

  if (newStatus === 'PROCESSED_AVAILABLE' && !record.completedDate) {
    record.completedDate = new Date().toISOString().split('T')[0];
  }

  // If user requests to publish or transitioning to PROCESSED_AVAILABLE
  if ((extra?.isPublishedToMarketplace || newStatus === 'PROCESSED_AVAILABLE') && !record.marketplaceListingId) {
    const cropList = farmerCrops.get(canonicalId) || [];
    const uniqueCode = Math.floor(1000 + Math.random() * 9000);
    const newCropListing: CropListing = {
      id: `crop-proc-${Date.now()}-${uniqueCode}`,
      name: record.processedProductName,
      variety: record.processedProductVariety || record.processingTypeName,
      category: 'Grain',
      quantityKg: record.availableProcessedQuantityKg,
      availableQuantityKg: record.availableProcessedQuantityKg,
      grade: (record.processedProductGrade as any) || 'A+',
      location: 'Bareilly, Uttar Pradesh',
      currentMandiPrice: Math.round(record.targetSellingPricePerKg * 0.9),
      expectedPrice: record.targetSellingPricePerKg,
      status: 'Available for Sale',
      photoVerified: true,
      isDemoVerification: false,
      imageUrl: record.imageUrl || resolveSafeCropImage(record.processedProductName),
      harvestedDate: 'Recent Harvest',
      processingDate: record.completedDate || new Date().toISOString().split('T')[0],
      storageLocation: 'Clean Storage Packhouse',
      moistureContent: 'Optimal Processed Level (<12%)',
      description: record.description || `Fresh value-added produce derived from farm batch ${record.sourceBatchId}.`,
      produceType: 'processed',
      processingType: record.processingTypeName,
      sourceCropId: record.sourceCropId,
      sourceCropName: record.sourceCropName,
      sourceCropVariety: record.sourceCropVariety,
      sourceBatchId: record.sourceBatchId,
      processingRecordId: record.id,
      processingCost: record.processingCostTotal,
      processingYield: record.processingYieldPercent,
      processingFacility: record.partnerFacilityName || 'On-Farm Facility',
      batchId: record.processedBatchId,
    } as any;

    cropList.push(newCropListing);
    farmerCrops.set(canonicalId, cropList);

    record.isPublishedToMarketplace = true;
    record.marketplaceListingId = newCropListing.id;
  }

  saveStoreToDisk();
  return record;
}

export function publishProcessingRecordToMarketplace(
  farmerId: string,
  recordId: string,
  customListing?: Partial<CropListing>
): { success: boolean; listing?: CropListing; message?: string } {
  const canonicalId = resolveCanonicalFarmerId(farmerId);
  const list = processingRecords.get(canonicalId) || processingRecords.get(farmerId) || [];
  const record = list.find((r) => r.id === recordId);
  if (!record) {
    return { success: false, message: 'Processing record not found.' };
  }

  const cropList = farmerCrops.get(canonicalId) || [];
  let listing = cropList.find((c) => c.id === record.marketplaceListingId);

  if (!listing) {
    const uniqueCode = Math.floor(1000 + Math.random() * 9000);
    listing = {
      id: `crop-proc-${Date.now()}-${uniqueCode}`,
      name: customListing?.name || record.processedProductName,
      variety: customListing?.variety || record.processedProductVariety || record.processingTypeName,
      category: customListing?.category || 'Grain',
      quantityKg: customListing?.quantityKg !== undefined ? customListing.quantityKg : record.availableProcessedQuantityKg,
      availableQuantityKg: (customListing as any)?.availableQuantityKg !== undefined ? (customListing as any).availableQuantityKg : record.availableProcessedQuantityKg,
      grade: customListing?.grade || (record.processedProductGrade as any) || 'A+',
      location: customListing?.location || 'Bareilly, Uttar Pradesh',
      currentMandiPrice: Math.round(Number(customListing?.expectedPrice || record.targetSellingPricePerKg) * 0.9),
      expectedPrice: Number(customListing?.expectedPrice || record.targetSellingPricePerKg),
      status: 'Available for Sale',
      photoVerified: true,
      isDemoVerification: false,
      imageUrl: customListing?.imageUrl || record.imageUrl || resolveSafeCropImage(record.processedProductName),
      harvestedDate: 'Recent Harvest',
      processingDate: record.completedDate || new Date().toISOString().split('T')[0],
      storageLocation: customListing?.storageLocation || 'Packhouse Facility',
      moistureContent: customListing?.moistureContent || 'Optimal Moisture (<12%)',
      description: customListing?.description || record.description || `Value-added produce from batch ${record.sourceBatchId}.`,
      produceType: 'processed',
      processingType: record.processingTypeName,
      sourceCropId: record.sourceCropId,
      sourceCropName: record.sourceCropName,
      sourceCropVariety: record.sourceCropVariety,
      sourceBatchId: record.sourceBatchId,
      processingRecordId: record.id,
      processingCost: record.processingCostTotal,
      processingYield: record.processingYieldPercent,
      processingFacility: record.partnerFacilityName || 'On-Farm Facility',
      batchId: record.processedBatchId,
    } as any;
    cropList.push(listing);
    farmerCrops.set(canonicalId, cropList);
  } else {
    // Update existing listing
    Object.assign(listing, customListing || {});
    listing.status = 'Available for Sale';
  }

  record.isPublishedToMarketplace = true;
  record.marketplaceListingId = listing.id;
  record.status = 'PROCESSED_AVAILABLE';
  record.updatedAt = new Date().toISOString();

  saveStoreToDisk();
  return { success: true, listing };
}

export function getPostHarvestAnalytics(farmerId: string): PostHarvestAnalytics {
  const records = getFarmerProcessingRecords(farmerId);
  const crops = farmerCrops.get(resolveCanonicalFarmerId(farmerId)) || [];
  const processedCrops = crops.filter((c: any) => c.produceType === 'processed');

  let totalRawProcessedKg = 0;
  let totalProcessedOutputKg = 0;
  let totalProcessingLossKg = 0;
  let totalEstimatedValueAdditionGain = 0;
  let totalValueAddedSalesRevenue = 0;

  for (const rec of records) {
    totalRawProcessedKg += Number(rec.inputQuantityKg || 0);
    totalProcessedOutputKg += Number(rec.outputQuantityKg || 0);
    totalProcessingLossKg += Number(rec.processingLossKg || 0);
    totalEstimatedValueAdditionGain += Number(rec.estimatedValueAdditionAmount || 0);
    if (rec.status === 'PROCESSED_AVAILABLE' || rec.status === 'SOLD') {
      totalValueAddedSalesRevenue += Number(rec.outputQuantityKg || 0) * Number(rec.targetSellingPricePerKg || 0);
    }
  }

  const overallAverageYieldPercent =
    totalRawProcessedKg > 0
      ? Number(((totalProcessedOutputKg / totalRawProcessedKg) * 100).toFixed(1))
      : 0;

  return {
    totalRawProcessedKg,
    totalProcessedOutputKg,
    totalProcessingLossKg,
    overallAverageYieldPercent,
    activeProcessedProductsCount: processedCrops.length,
    totalValueAddedSalesRevenue,
    totalEstimatedValueAdditionGain,
  };
}


