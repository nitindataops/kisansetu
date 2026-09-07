import { FarmerLandRecord, LandVerificationInput } from '../types/landVerification';

export interface LandVerificationApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  record?: FarmerLandRecord;
  error?: string;
}

export async function fetchFarmerLandVerification(farmerIdOrMobile: string): Promise<FarmerLandRecord | null> {
  try {
    const res = await fetch(`/api/farmer/land-verification/${encodeURIComponent(farmerIdOrMobile)}`);
    const data = await res.json();
    if (data.success && data.record) {
      return data.record;
    }
    return null;
  } catch (err) {
    console.warn('Failed to fetch farmer land verification:', err);
    return null;
  }
}

export async function submitFarmerLandVerification(input: LandVerificationInput): Promise<LandVerificationApiResponse<FarmerLandRecord>> {
  try {
    const res = await fetch('/api/farmer/land-verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      message: 'Network error submitting land verification.',
      error: err?.message,
    };
  }
}

