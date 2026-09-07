// Property Details API Service & Future UP Bhulekh Verification Interface Layer
import { FarmerProperty, PropertyVerificationStatus, OFFICIAL_UP_BHULEKH_URL } from '../types/landVerification';

export { OFFICIAL_UP_BHULEKH_URL };

export interface SavePropertyPayload {
  id?: string;
  farmerId: string;
  district: string;
  tehsil: string;
  village: string;
  gataNumber: string;
  khatauniNumber?: string;
  landArea: number;
  landAreaUnit: 'Hectare' | 'Bigha' | 'Acre';
}

/**
 * Fetch property details for an authenticated farmer
 */
export async function fetchFarmerPropertiesApi(farmerId: string): Promise<FarmerProperty[]> {
  try {
    const res = await fetch(`/api/farmer/properties/${encodeURIComponent(farmerId)}`);
    const data = await res.json();
    if (data.success && Array.isArray(data.properties)) {
      return data.properties;
    }
    return [];
  } catch (err) {
    console.warn('Network error fetching farmer properties:', err);
    // Fallback to local storage cache if network is offline
    try {
      const cached = localStorage.getItem(`kisansetu_properties_${farmerId}`);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {
      // Ignore storage errors
    }
    return [];
  }
}

/**
 * Save or update a property record for the authenticated farmer
 */
export async function saveFarmerPropertyApi(payload: SavePropertyPayload): Promise<{
  success: boolean;
  property?: FarmerProperty;
  message?: string;
}> {
  try {
    const res = await fetch('/api/farmer/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.success && data.property) {
      // Update local storage backup
      try {
        const key = `kisansetu_properties_${payload.farmerId}`;
        const existing: FarmerProperty[] = JSON.parse(localStorage.getItem(key) || '[]');
        const updated = existing.filter((p) => p.id !== data.property.id);
        updated.unshift(data.property);
        localStorage.setItem(key, JSON.stringify(updated));
      } catch {
        // Ignore storage errors
      }
      return data;
    }
    return {
      success: false,
      message: data.message || 'Failed to save property details.',
    };
  } catch (err: any) {
    console.warn('Network error saving farmer property:', err);
    // Offline resilience: save to local state
    const fallbackProperty: FarmerProperty = {
      id: payload.id || `prop_${Date.now()}`,
      farmerId: payload.farmerId,
      district: payload.district,
      tehsil: payload.tehsil,
      village: payload.village,
      gataNumber: payload.gataNumber,
      khatauniNumber: payload.khatauniNumber || '',
      landArea: payload.landArea,
      landAreaUnit: payload.landAreaUnit,
      status: 'Not Verified',
      statusNotes: 'Bhulekh record देखने के लिए official website पर जाएँ।',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    try {
      const key = `kisansetu_properties_${payload.farmerId}`;
      const existing: FarmerProperty[] = JSON.parse(localStorage.getItem(key) || '[]');
      const updated = existing.filter((p) => p.id !== fallbackProperty.id);
      updated.unshift(fallbackProperty);
      localStorage.setItem(key, JSON.stringify(updated));
    } catch {
      // Ignore
    }
    return {
      success: true,
      property: fallbackProperty,
      message: 'Property details saved locally.',
    };
  }
}

/**
 * Delete a property record
 */
export async function deleteFarmerPropertyApi(farmerId: string, propertyId: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/farmer/properties/${encodeURIComponent(farmerId)}/${encodeURIComponent(propertyId)}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    return !!data.success;
  } catch (err) {
    console.warn('Network error deleting property:', err);
    return false;
  }
}

/**
 * Future Government UP Bhulekh Verification Service Interface
 * Prepared for official government API integration without fabricating fake verification.
 */
export interface GovernmentBhulekhVerificationRequest {
  district: string;
  tehsil: string;
  village: string;
  gataNumber: string;
  khatauniNumber?: string;
  farmerName: string;
}

export interface GovernmentBhulekhVerificationResult {
  status: PropertyVerificationStatus;
  isVerified: boolean;
  officialApiConnected: boolean;
  messageHi: string;
  messageEn: string;
  verifiedAt?: string;
  officialRecordExcerpt?: {
    ownerName?: string;
    fatherName?: string;
    khataNumber?: string;
    khasraNumber?: string;
    areaHectares?: number;
  };
}

/**
 * Clean service layer function for future UP Bhulekh official API integration.
 * Currently returns unverified notice since official API credentials/webhook
 * are not connected, and directs farmer to visit the official portal.
 */
export async function verifyWithOfficialBhulekhApi(
  _req: GovernmentBhulekhVerificationRequest
): Promise<GovernmentBhulekhVerificationResult> {
  // Real API integration stub: Official UP Bhulekh does not currently offer a public write/verification API token
  return {
    status: 'Not Verified',
    isVerified: false,
    officialApiConnected: false,
    messageHi: 'Bhulekh record देखने के लिए official website पर जाएँ।',
    messageEn: 'Visit the official UP Bhulekh portal to view land records.',
  };
}
