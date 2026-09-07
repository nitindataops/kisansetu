import { FarmerProfile, CropListing } from '../types/farmer';
import { BuyerProfile, BuyerOrder, BuyerRequirement, BuyerMessageThread, MarketplaceProduct } from '../types/buyer';
import { FarmerRegistryOcrProcessResult } from '../types/farmerRegistryOcr';

export interface AuthSuccessResponse {
  success: boolean;
  message?: string;
  token?: string;
  role?: 'farmer' | 'buyer' | 'admin';
  user?: FarmerProfile | BuyerProfile | any;
  error?: string;
}

// ============================================================================
// CLIENT AUTH STORAGE HELPERS
// ============================================================================

const TOKEN_KEY = 'kisansetu_auth_token';
const ROLE_KEY = 'kisansetu_auth_role';
const USER_KEY = 'kisansetu_auth_user';

export function saveAuthSession(token: string, role: string, user: any) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(ROLE_KEY, role);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (err) {
    console.warn('[AuthService] Could not save to localStorage:', err);
  }
}

export function getStoredAuthSession(): { token: string | null; role: string | null; user: any | null } {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const role = localStorage.getItem(ROLE_KEY);
    const rawUser = localStorage.getItem(USER_KEY);
    const user = rawUser ? JSON.parse(rawUser) : null;
    return { token, role, user };
  } catch {
    return { token: null, role: null, user: null };
  }
}

export function clearAuthSession() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(USER_KEY);
  } catch (err) {
    console.warn('[AuthService] Error clearing localStorage:', err);
  }
}

// ============================================================================
// API CALLS
// ============================================================================

/**
 * 1. Farmer Registration (Password-based)
 */
export async function registerFarmerApi(params: {
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
}): Promise<AuthSuccessResponse> {
  try {
    const res = await fetch('/api/auth/farmer/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (data.success && data.token) {
      saveAuthSession(data.token, data.role, data.user);
    }
    return data;
  } catch (err: any) {
    return {
      success: false,
      message: 'Network error while registering farmer account.',
      error: err?.message,
    };
  }
}

/**
 * Farmer Registry Document OCR Extraction & Validation API
 */
export async function processFarmerRegistryOcrApi(payload: {
  documentBase64: string;
  fileName: string;
  fileSizeBytes: number;
  mimeType?: string;
  signupDetails: {
    name: string;
    fatherName?: string;
    aadhaarNumber?: string;
    district?: string;
    tehsil?: string;
    village?: string;
    registryNumber?: string;
  };
}): Promise<FarmerRegistryOcrProcessResult> {
  try {
    const res = await fetch('/api/farmer/ocr-registry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      validationStatus: 'UNREADABLE',
      statusBadgeTextHi: 'कनेक्शन त्रुटि',
      statusBadgeTextEn: 'Network Error',
      statusTitle: 'दस्तावेज़ की जानकारी पढ़ी नहीं जा सकी',
      statusMessage: 'दस्तावेज़ पढ़ने में नेटवर्क समस्या हुई। कृपया पुनः प्रयास करें।',
      warningMessage: '⚠️ कृपया अपनी वास्तविक किसान रजिस्ट्री का दस्तावेज़ अपलोड करें। साफ़ फोटो या PDF का उपयोग करें।',
      fileName: payload.fileName,
      extractedData: {
        isFarmerRegistryDocument: false,
        isReadable: false,
        unreadableReason: err?.message || 'Network error during OCR processing',
        extractedAt: new Date().toISOString(),
      },
      comparisons: [],
      canProceed: false,
      disclaimer:
        'दस्तावेज़ सत्यापन केवल अपलोड की गई प्रति से टेक्स्ट मिलान पर आधारित है। यह आधिकारिक सरकारी रिकॉर्ड्स की कानूनी पुष्टि नहीं करता है।',
    };
  }
}

/**
 * 2. Buyer Registration (Password-based)
 */
export async function registerBuyerApi(params: {
  name: string;
  mobile: string;
  password: string;
  profession?: string;
  aadhaar?: string;
  businessName?: string;
  businessType?: string;
  location?: string;
  district?: string;
  state?: string;
  pincode?: string;
}): Promise<AuthSuccessResponse> {
  try {
    const res = await fetch('/api/auth/buyer/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (data.success && data.token) {
      saveAuthSession(data.token, data.role, data.user);
    }
    return data;
  } catch (err: any) {
    return {
      success: false,
      message: 'Network error while registering buyer account.',
      error: err?.message,
    };
  }
}

/**
 * 3. Farmer Login: Direct password-based authentication
 */
export async function loginFarmerDirectApi(identifier: string, password: string): Promise<AuthSuccessResponse> {
  try {
    const res = await fetch('/api/auth/farmer/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });
    const data = await res.json();
    if (data.success && data.token) {
      saveAuthSession(data.token, data.role || 'farmer', data.user);
    }
    return data;
  } catch (err: any) {
    return {
      success: false,
      message: 'Network error during farmer login.',
      error: err?.message,
    };
  }
}

/**
 * 4. Buyer Login: Direct password-based authentication
 */
export async function loginBuyerDirectApi(identifier: string, password: string): Promise<AuthSuccessResponse> {
  try {
    const res = await fetch('/api/auth/buyer/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });
    const data = await res.json();
    if (data.success && data.token) {
      saveAuthSession(data.token, data.role || 'buyer', data.user);
    }
    return data;
  } catch (err: any) {
    return {
      success: false,
      message: 'Network error during buyer login.',
      error: err?.message,
    };
  }
}

/**
 * 4b. Admin Login: Direct password-based authentication
 */
export async function loginAdminDirectApi(identifier: string, password: string): Promise<AuthSuccessResponse> {
  try {
    const res = await fetch('/api/auth/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });
    const data = await res.json();
    if (data.success && data.token) {
      saveAuthSession(data.token, 'admin', data.user);
    }
    return data;
  } catch (err: any) {
    return {
      success: false,
      message: 'Network error during admin login.',
      error: err?.message,
    };
  }
}


/**
 * 5. Get current authenticated user
 */
export async function fetchCurrentUser(): Promise<AuthSuccessResponse> {
  const { token } = getStoredAuthSession();
  if (!token) return { success: false, message: 'No active session' };

  try {
    const res = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return data;
  } catch {
    return { success: false, message: 'Session lookup failed' };
  }
}

/**
 * 6. Logout User (Clears local session & revokes backend token)
 */
export async function logoutUserApi(): Promise<void> {
  const { token } = getStoredAuthSession();
  clearAuthSession();
  if (token) {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // Ignore network errors on logout
    }
  }
}

/**
 * 7. Fetch Authenticated Farmer Profile directly from Database
 * Strictly derives authenticated farmer identity from token/session.
 */
export async function fetchFarmerProfileApi(): Promise<{
  success: boolean;
  profile?: FarmerProfile;
  user?: FarmerProfile;
  userId?: string;
  farmerId?: string;
  message?: string;
}> {
  const { token } = getStoredAuthSession();
  if (!token) {
    return { success: false, message: 'No active session token found.' };
  }

  try {
    const res = await fetch('/api/farmer/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (data.success && (data.profile || data.user)) {
      const p = (data.profile || data.user) as FarmerProfile;
      saveAuthSession(token, 'farmer', p);
    }
    return data;
  } catch (err: any) {
    console.error('Error in fetchFarmerProfileApi:', err);
    return {
      success: false,
      message: err?.message || 'Network error fetching authenticated farmer profile.',
    };
  }
}

/**
 * 8. Update Authenticated Farmer Profile in Database
 */
export async function updateFarmerProfileApi(
  updates: Partial<FarmerProfile>
): Promise<{
  success: boolean;
  profile?: FarmerProfile;
  message?: string;
}> {
  const { token } = getStoredAuthSession();
  if (!token) {
    return { success: false, message: 'No active session token found.' };
  }

  try {
    const res = await fetch('/api/farmer/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (data.success && (data.profile || data.user)) {
      const p = (data.profile || data.user) as FarmerProfile;
      saveAuthSession(token, 'farmer', p);
    }
    return data;
  } catch (err: any) {
    console.error('Error in updateFarmerProfileApi:', err);
    return {
      success: false,
      message: err?.message || 'Network error updating profile.',
    };
  }
}

/**
 * 9. Fetch Authenticated Buyer Profile directly from Database
 * Strictly derives authenticated buyer identity from token/session.
 */
export async function fetchBuyerProfileApi(): Promise<{
  success: boolean;
  profile?: BuyerProfile;
  user?: BuyerProfile;
  userId?: string;
  buyerId?: string;
  message?: string;
}> {
  const { token } = getStoredAuthSession();
  if (!token) {
    return { success: false, message: 'No active session token found.' };
  }

  try {
    const res = await fetch('/api/buyer/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (data.success && (data.profile || data.user)) {
      const p = (data.profile || data.user) as BuyerProfile;
      saveAuthSession(token, 'buyer', p);
    }
    return data;
  } catch (err: any) {
    console.error('Error in fetchBuyerProfileApi:', err);
    return {
      success: false,
      message: err?.message || 'Network error fetching authenticated buyer profile.',
    };
  }
}

/**
 * 10. Update Authenticated Buyer Profile in Database
 */
export async function updateBuyerProfileApi(
  updates: Partial<BuyerProfile>
): Promise<{
  success: boolean;
  profile?: BuyerProfile;
  message?: string;
}> {
  const { token } = getStoredAuthSession();
  if (!token) {
    return { success: false, message: 'No active session token found.' };
  }

  try {
    const res = await fetch('/api/buyer/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (data.success && (data.profile || data.user)) {
      const p = (data.profile || data.user) as BuyerProfile;
      saveAuthSession(token, 'buyer', p);
    }
    return data;
  } catch (err: any) {
    console.error('Error in updateBuyerProfileApi:', err);
    return {
      success: false,
      message: err?.message || 'Network error updating buyer profile.',
    };
  }
}

/**
 * 11. Fetch Authenticated Buyer Orders
 */
export async function fetchBuyerOrdersApi(): Promise<{
  success: boolean;
  orders?: BuyerOrder[];
  message?: string;
}> {
  const { token } = getStoredAuthSession();
  if (!token) {
    return { success: false, message: 'No active session token found.' };
  }

  try {
    const res = await fetch('/api/buyer/orders', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  } catch (err: any) {
    console.error('Error in fetchBuyerOrdersApi:', err);
    return { success: false, message: 'Network error fetching buyer orders.' };
  }
}

/**
 * 12. Create Authenticated Buyer Order
 */
export async function createBuyerOrderApi(
  order: Partial<BuyerOrder>
): Promise<{
  success: boolean;
  order?: BuyerOrder;
  message?: string;
}> {
  const { token } = getStoredAuthSession();
  if (!token) {
    return { success: false, message: 'No active session token found.' };
  }

  try {
    const res = await fetch('/api/buyer/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(order),
    });
    return await res.json();
  } catch (err: any) {
    console.error('Error in createBuyerOrderApi:', err);
    return { success: false, message: 'Network error placing order.' };
  }
}

/**
 * 13. Fetch Authenticated Buyer Requirements
 */
export async function fetchBuyerRequirementsApi(): Promise<{
  success: boolean;
  requirements?: BuyerRequirement[];
  message?: string;
}> {
  const { token } = getStoredAuthSession();
  if (!token) {
    return { success: false, message: 'No active session token found.' };
  }

  try {
    const res = await fetch('/api/buyer/requirements', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  } catch (err: any) {
    console.error('Error in fetchBuyerRequirementsApi:', err);
    return { success: false, message: 'Network error fetching requirements.' };
  }
}

/**
 * 14. Create Authenticated Buyer Requirement
 */
export async function createBuyerRequirementApi(
  requirement: Partial<BuyerRequirement>
): Promise<{
  success: boolean;
  requirement?: BuyerRequirement;
  message?: string;
}> {
  const { token } = getStoredAuthSession();
  if (!token) {
    return { success: false, message: 'No active session token found.' };
  }

  try {
    const res = await fetch('/api/buyer/requirements', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requirement),
    });
    return await res.json();
  } catch (err: any) {
    console.error('Error in createBuyerRequirementApi:', err);
    return { success: false, message: 'Network error posting requirement.' };
  }
}

/**
 * 15. Update Requirement Status
 */
export async function updateBuyerRequirementStatusApi(
  reqId: string,
  status: string
): Promise<{ success: boolean; message?: string }> {
  const { token } = getStoredAuthSession();
  if (!token) {
    return { success: false, message: 'No active session token found.' };
  }

  try {
    const res = await fetch(`/api/buyer/requirements/${encodeURIComponent(reqId)}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    return await res.json();
  } catch (err: any) {
    console.error('Error in updateBuyerRequirementStatusApi:', err);
    return { success: false, message: 'Network error updating requirement status.' };
  }
}

/**
 * 16. Fetch Authenticated Buyer Messages
 */
export async function fetchBuyerMessagesApi(): Promise<{
  success: boolean;
  threads?: BuyerMessageThread[];
  message?: string;
}> {
  const { token } = getStoredAuthSession();
  if (!token) {
    return { success: false, message: 'No active session token found.' };
  }

  try {
    const res = await fetch('/api/buyer/messages', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  } catch (err: any) {
    console.error('Error in fetchBuyerMessagesApi:', err);
    return { success: false, message: 'Network error fetching messages.' };
  }
}

/**
 * 17. Send Authenticated Buyer Message
 */
export async function sendBuyerMessageApi(
  threadId: string,
  text: string,
  farmerId?: string,
  cropContext?: string,
  farmerName?: string,
  farmerLocation?: string
): Promise<{
  success: boolean;
  thread?: BuyerMessageThread;
  message?: string;
}> {
  const { token } = getStoredAuthSession();
  if (!token) {
    return { success: false, message: 'No active session token found.' };
  }

  try {
    const res = await fetch('/api/buyer/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ threadId, text, farmerId, cropContext, farmerName, farmerLocation }),
    });
    return await res.json();
  } catch (err: any) {
    console.error('Error in sendBuyerMessageApi:', err);
    return { success: false, message: 'Network error sending message.' };
  }
}

/**
 * 15. Farmer Crops Persistence API
 */
export async function fetchFarmerCropsApi(farmerId?: string): Promise<{
  success: boolean;
  crops?: CropListing[];
  message?: string;
}> {
  const { token } = getStoredAuthSession();
  const url = farmerId ? `/api/farmer/crops?farmerId=${encodeURIComponent(farmerId)}` : '/api/farmer/crops';
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, { headers });
    return await res.json();
  } catch (err: any) {
    console.error('Error in fetchFarmerCropsApi:', err);
    return { success: false, message: 'Failed to fetch crops from server.' };
  }
}

export async function saveFarmerCropApi(crop: CropListing, farmerId?: string): Promise<{
  success: boolean;
  crop?: CropListing;
  message?: string;
}> {
  const { token } = getStoredAuthSession();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch('/api/farmer/crops', {
      method: 'POST',
      headers,
      body: JSON.stringify({ crop, farmerId }),
    });
    return await res.json();
  } catch (err: any) {
    console.error('Error in saveFarmerCropApi:', err);
    return { success: false, message: 'Failed to save crop listing.' };
  }
}

export async function deleteFarmerCropApi(cropId: string, farmerId?: string): Promise<{
  success: boolean;
  message?: string;
}> {
  const { token } = getStoredAuthSession();
  const url = farmerId ? `/api/farmer/crops/${encodeURIComponent(cropId)}?farmerId=${encodeURIComponent(farmerId)}` : `/api/farmer/crops/${encodeURIComponent(cropId)}`;
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      method: 'DELETE',
      headers,
    });
    return await res.json();
  } catch (err: any) {
    console.error('Error in deleteFarmerCropApi:', err);
    return { success: false, message: 'Failed to delete crop listing.' };
  }
}

/**
 * 16. Buyer Marketplace Real-Time API (Reads from central database)
 */
export async function fetchMarketplaceListingsApi(params?: {
  crop?: string;
  variety?: string;
  category?: string;
  district?: string;
  search?: string;
  sortBy?: string;
  farmerId?: string;
  minPrice?: number;
  maxPrice?: number;
}): Promise<{
  success: boolean;
  count: number;
  products: MarketplaceProduct[];
  listings: MarketplaceProduct[];
  message?: string;
}> {
  const query = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        query.append(k, String(v));
      }
    });
  }
  const qs = query.toString();
  const url = qs ? `/api/marketplace/listings?${qs}` : '/api/marketplace/listings';

  try {
    const res = await fetch(url, {
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: Failed to fetch marketplace listings`);
    }
    const data = await res.json();
    return {
      success: true,
      count: data.count || (data.products ? data.products.length : 0),
      products: data.products || data.listings || [],
      listings: data.listings || data.products || [],
    };
  } catch (err: any) {
    console.error('Error in fetchMarketplaceListingsApi:', err);
    return {
      success: false,
      count: 0,
      products: [],
      listings: [],
      message: err.message || 'Failed to connect to marketplace service.',
    };
  }
}

export async function fetchMarketplaceListingByIdApi(listingId: string): Promise<{
  success: boolean;
  product?: MarketplaceProduct;
  listing?: MarketplaceProduct;
  message?: string;
}> {
  try {
    const res = await fetch(`/api/marketplace/listings/${encodeURIComponent(listingId)}`);
    if (!res.ok) {
      return { success: false, message: 'Listing not found' };
    }
    const data = await res.json();
    return {
      success: true,
      product: data.product || data.listing,
      listing: data.listing || data.product,
    };
  } catch (err: any) {
    console.error('Error in fetchMarketplaceListingByIdApi:', err);
    return { success: false, message: 'Failed to fetch listing.' };
  }
}

export async function fetchMarketplaceFarmerProfileApi(farmerId: string): Promise<{
  success: boolean;
  farmer?: any;
  message?: string;
}> {
  try {
    const res = await fetch(`/api/marketplace/farmers/${encodeURIComponent(farmerId)}`);
    if (!res.ok) {
      return { success: false, message: 'Farmer not found' };
    }
    return await res.json();
  } catch (err: any) {
    console.error('Error in fetchMarketplaceFarmerProfileApi:', err);
    return { success: false, message: 'Failed to fetch farmer profile.' };
  }
}

export async function fetchMarketplaceFarmersApi(): Promise<{
  success: boolean;
  farmers: any[];
  count: number;
}> {
  try {
    const res = await fetch('/api/marketplace/farmers');
    if (!res.ok) {
      return { success: false, farmers: [], count: 0 };
    }
    const data = await res.json();
    return {
      success: true,
      farmers: data.farmers || [],
      count: data.count || (data.farmers ? data.farmers.length : 0),
    };
  } catch (err: any) {
    console.error('Error in fetchMarketplaceFarmersApi:', err);
    return { success: false, farmers: [], count: 0 };
  }
}

// ============================================================================
// BUYER CART API (CENTRAL DATABASE PERSISTENCE)
// ============================================================================

export async function fetchBuyerCartApi(buyerId?: string): Promise<{ success: boolean; cart: any[] }> {
  try {
    const { token } = getStoredAuthSession();
    const query = buyerId ? `?buyerId=${encodeURIComponent(buyerId)}` : '';
    const res = await fetch(`/api/buyer/cart${query}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) return { success: false, cart: [] };
    const data = await res.json();
    return { success: true, cart: data.cart || [] };
  } catch (err) {
    console.error('Error in fetchBuyerCartApi:', err);
    return { success: false, cart: [] };
  }
}

export async function saveBuyerCartApi(items: any[], buyerId?: string): Promise<{ success: boolean; cart: any[] }> {
  try {
    const { token } = getStoredAuthSession();
    const res = await fetch('/api/buyer/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ items, buyerId }),
    });
    if (!res.ok) return { success: false, cart: items };
    const data = await res.json();
    return { success: true, cart: data.cart || items };
  } catch (err) {
    console.error('Error in saveBuyerCartApi:', err);
    return { success: false, cart: items };
  }
}

// ============================================================================
// BUYER FAVORITES API (CENTRAL DATABASE PERSISTENCE)
// ============================================================================

export async function fetchBuyerFavoritesApi(buyerId?: string): Promise<{ success: boolean; favorites: string[] }> {
  try {
    const { token } = getStoredAuthSession();
    const query = buyerId ? `?buyerId=${encodeURIComponent(buyerId)}` : '';
    const res = await fetch(`/api/buyer/favorites${query}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) return { success: false, favorites: [] };
    const data = await res.json();
    return { success: true, favorites: data.favorites || [] };
  } catch (err) {
    console.error('Error in fetchBuyerFavoritesApi:', err);
    return { success: false, favorites: [] };
  }
}

export async function saveBuyerFavoritesApi(
  productIds: string[],
  buyerId?: string
): Promise<{ success: boolean; favorites: string[] }> {
  try {
    const { token } = getStoredAuthSession();
    const res = await fetch('/api/buyer/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ favorites: productIds, buyerId }),
    });
    if (!res.ok) return { success: false, favorites: productIds };
    const data = await res.json();
    return { success: true, favorites: data.favorites || productIds };
  } catch (err) {
    console.error('Error in saveBuyerFavoritesApi:', err);
    return { success: false, favorites: productIds };
  }
}

export async function toggleBuyerFavoriteApi(
  productId: string,
  buyerId?: string
): Promise<{ success: boolean; favorites: string[]; isFavorite?: boolean }> {
  try {
    const { token } = getStoredAuthSession();
    const res = await fetch('/api/buyer/favorites/toggle', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ productId, buyerId }),
    });
    if (!res.ok) return { success: false, favorites: [] };
    const data = await res.json();
    return { success: true, favorites: data.favorites || [], isFavorite: data.isFavorite };
  } catch (err) {
    console.error('Error in toggleBuyerFavoriteApi:', err);
    return { success: false, favorites: [] };
  }
}

// ============================================================================
// BUYER REQUIREMENT UPDATE API
// ============================================================================

export async function updateBuyerRequirementApi(
  reqId: string,
  updates: Partial<BuyerRequirement>
): Promise<{ success: boolean; requirement?: BuyerRequirement; message?: string }> {
  try {
    const { token } = getStoredAuthSession();
    const res = await fetch(`/api/buyer/requirements/${encodeURIComponent(reqId)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(updates),
    });
    if (!res.ok) return { success: false, message: 'Failed to update requirement' };
    return await res.json();
  } catch (err: any) {
    console.error('Error in updateBuyerRequirementApi:', err);
    return { success: false, message: err.message || 'Network error' };
  }
}

// ============================================================================
// FARMER MESSAGES & REAL-TIME REPLIES (CENTRAL DATABASE)
// ============================================================================

export async function fetchFarmerMessagesApi(
  farmerId?: string
): Promise<{ success: boolean; threads: BuyerMessageThread[] }> {
  try {
    const { token } = getStoredAuthSession();
    const query = farmerId ? `?farmerId=${encodeURIComponent(farmerId)}` : '';
    const res = await fetch(`/api/farmer/messages${query}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) return { success: false, threads: [] };
    const data = await res.json();
    return { success: true, threads: data.threads || [] };
  } catch (err) {
    console.error('Error in fetchFarmerMessagesApi:', err);
    return { success: false, threads: [] };
  }
}

export async function replyFarmerMessageApi(
  threadId: string,
  text: string,
  farmerId?: string
): Promise<{ success: boolean; thread?: BuyerMessageThread; message?: string }> {
  try {
    const { token } = getStoredAuthSession();
    const res = await fetch('/api/farmer/messages/reply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ threadId, text, farmerId }),
    });
    if (!res.ok) return { success: false, message: 'Failed to reply to message' };
    return await res.json();
  } catch (err: any) {
    console.error('Error in replyFarmerMessageApi:', err);
    return { success: false, message: err.message || 'Network error' };
  }
}

export async function fetchFarmerPublicProfileApi(farmerId: string): Promise<{
  success: boolean;
  farmer?: any;
  message?: string;
}> {
  try {
    const res = await fetch(`/api/farmer/public-profile/${encodeURIComponent(farmerId)}`);
    if (!res.ok) return { success: false, message: 'Farmer not found' };
    return await res.json();
  } catch (err: any) {
    console.error('Error in fetchFarmerPublicProfileApi:', err);
    return { success: false, message: err.message || 'Network error' };
  }
}

// ============================================================================
// ADMIN CONTROL CENTER CLIENT API HELPERS
// ============================================================================

function getAdminHeaders() {
  const { token } = getStoredAuthSession();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function fetchAdminStatsApi() {
  try {
    const res = await fetch('/api/admin/stats', { headers: getAdminHeaders() });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err.message || 'Failed to fetch admin statistics' };
  }
}

export async function fetchAdminFarmersApi() {
  try {
    const res = await fetch('/api/admin/farmers', { headers: getAdminHeaders() });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err.message || 'Failed to fetch farmers list' };
  }
}

export async function fetchAdminFarmerDetailsApi(farmerId: string) {
  try {
    const res = await fetch(`/api/admin/farmers/${encodeURIComponent(farmerId)}`, { headers: getAdminHeaders() });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err.message || 'Failed to fetch farmer details' };
  }
}

export async function updateFarmerVerificationApi(farmerId: string, status: string | boolean, reason?: string) {
  try {
    const normalizedStatus = typeof status === 'boolean' ? (status ? 'VERIFIED' : 'PENDING') : status;
    const res = await fetch(`/api/admin/farmers/${encodeURIComponent(farmerId)}/verify`, {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify({ status: normalizedStatus, reason }),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err.message || 'Failed to update verification' };
  }
}

export async function updateFarmerStatusApi(farmerId: string, status: 'active' | 'suspended', reason?: string) {
  return toggleUserSuspensionApi(farmerId, status === 'suspended');
}

export async function updateBuyerStatusApi(buyerId: string, status: 'active' | 'suspended', reason?: string) {
  return toggleUserSuspensionApi(buyerId, status === 'suspended');
}

export async function updateAdminOrderStatusApi(orderId: string, status: string, notes?: string) {
  return updateOrderStatusApi(orderId, status);
}


export async function fetchAdminBuyersApi() {
  try {
    const res = await fetch('/api/admin/buyers', { headers: getAdminHeaders() });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err.message || 'Failed to fetch buyers list' };
  }
}

export async function fetchAdminBuyerDetailsApi(buyerId: string) {
  try {
    const res = await fetch(`/api/admin/buyers/${encodeURIComponent(buyerId)}`, { headers: getAdminHeaders() });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err.message || 'Failed to fetch buyer details' };
  }
}

export async function toggleUserSuspensionApi(userId: string, suspended: boolean) {
  try {
    const res = await fetch(`/api/admin/users/${encodeURIComponent(userId)}/toggle-suspension`, {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify({ suspended }),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err.message || 'Failed to update user suspension' };
  }
}

export async function fetchAdminListingsApi(params?: { crop?: string; quality?: string; status?: string; search?: string }) {
  try {
    const query = new URLSearchParams();
    if (params?.crop) query.set('crop', params.crop);
    if (params?.quality) query.set('quality', params.quality);
    if (params?.status) query.set('status', params.status);
    if (params?.search) query.set('search', params.search);
    const res = await fetch(`/api/admin/listings?${query.toString()}`, { credentials: 'omit', headers: getAdminHeaders() });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err.message || 'Failed to fetch listings' };
  }
}

export async function updateListingStatusApi(listingId: string, status: string, reason?: string) {
  try {
    const res = await fetch(`/api/admin/listings/${encodeURIComponent(listingId)}/status`, {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify({ status, reason }),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err.message || 'Failed to update listing status' };
  }
}

export async function deleteListingPermanentlyApi(listingId: string, reason?: string) {
  try {
    const res = await fetch(`/api/admin/listings/${encodeURIComponent(listingId)}`, {
      method: 'DELETE',
      headers: getAdminHeaders(),
      body: JSON.stringify({ reason }),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err.message || 'Failed to delete listing' };
  }
}

export async function fetchAdminOrdersApi() {
  try {
    const res = await fetch('/api/admin/orders', { headers: getAdminHeaders() });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err.message || 'Failed to fetch orders' };
  }
}

export async function updateOrderStatusApi(orderId: string, status: string) {
  try {
    const res = await fetch(`/api/admin/orders/${encodeURIComponent(orderId)}/status`, {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify({ status }),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err.message || 'Failed to update order status' };
  }
}

export async function fetchAdminEnquiriesApi() {
  try {
    const res = await fetch('/api/admin/enquiries', { headers: getAdminHeaders() });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err.message || 'Failed to fetch enquiries' };
  }
}

export async function fetchAdminPendingVerificationsApi() {
  try {
    const res = await fetch('/api/admin/verifications/pending', { headers: getAdminHeaders() });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err.message || 'Failed to fetch pending verifications' };
  }
}

export async function fetchAdminActivityApi() {
  try {
    const res = await fetch('/api/admin/activity', { headers: getAdminHeaders() });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err.message || 'Failed to fetch market activity' };
  }
}

export async function fetchAdminReportsApi() {
  try {
    const res = await fetch('/api/admin/reports', { headers: getAdminHeaders() });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err.message || 'Failed to fetch reports' };
  }
}

export async function fetchAdminAuditLogsApi() {
  try {
    const res = await fetch('/api/admin/audit-logs', { headers: getAdminHeaders() });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err.message || 'Failed to fetch audit logs' };
  }
}


