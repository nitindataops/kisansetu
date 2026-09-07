// Post-Harvest Processing & Value Addition Client Service
import { ProcessingRecord, ProcessingStage, PostHarvestAnalytics } from '../types/processing';

const AUTH_STORAGE_KEY = 'kisansetu_auth_session';

function getAuthHeader(): Record<string, string> {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      const sess = JSON.parse(raw);
      if (sess?.token) {
        return { Authorization: `Bearer ${sess.token}` };
      }
    }
  } catch {}
  return {};
}

/**
 * Fetch all processing records for the farmer
 */
export async function fetchProcessingRecordsApi(farmerId?: string): Promise<ProcessingRecord[]> {
  try {
    const fId = farmerId || 'KISAN-UP-2026-8842';
    const res = await fetch(`/api/farmer/processing-records?farmerId=${encodeURIComponent(fId)}`, {
      headers: { ...getAuthHeader() },
    });
    const data = await res.json();
    if (data.success && Array.isArray(data.records)) {
      try {
        localStorage.setItem(`kisansetu_processing_${fId}`, JSON.stringify(data.records));
      } catch {}
      return data.records;
    }
    return [];
  } catch (err) {
    console.warn('Network error fetching processing records, checking local cache:', err);
    try {
      const fId = farmerId || 'KISAN-UP-2026-8842';
      const cached = localStorage.getItem(`kisansetu_processing_${fId}`);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {}
    return [];
  }
}

/**
 * Create a new processing record (deducts raw crop stock, calculates yields and creates traceability batch)
 */
export async function createProcessingRecordApi(recordPayload: Partial<ProcessingRecord>): Promise<{
  success: boolean;
  message?: string;
  record?: ProcessingRecord;
  updatedSourceCrop?: any;
  processedCrop?: any;
}> {
  try {
    const res = await fetch('/api/farmer/processing-records', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(recordPayload),
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error('Failed to create processing record:', err);
    return { success: false, message: err?.message || 'Network error while creating processing record.' };
  }
}

/**
 * Update processing stage status (e.g. from in-progress to processed available)
 */
export async function updateProcessingStatusApi(
  recordId: string,
  status: ProcessingStage,
  farmerId?: string,
  extra?: { isPublishedToMarketplace?: boolean; notes?: string }
): Promise<{ success: boolean; record?: ProcessingRecord; message?: string }> {
  try {
    const res = await fetch(`/api/farmer/processing-records/${encodeURIComponent(recordId)}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({
        farmerId: farmerId || 'KISAN-UP-2026-8842',
        status,
        ...extra,
      }),
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error('Failed to update processing status:', err);
    return { success: false, message: err?.message || 'Network error updating processing status.' };
  }
}

/**
 * Publish processed product batch to buyer marketplace
 */
export async function publishProcessingToMarketplaceApi(
  recordId: string,
  farmerId?: string,
  customListing?: any
): Promise<{ success: boolean; listing?: any; message?: string }> {
  try {
    const res = await fetch(`/api/farmer/processing-records/${encodeURIComponent(recordId)}/publish`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({
        farmerId: farmerId || 'KISAN-UP-2026-8842',
        customListing,
      }),
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error('Failed to publish processing batch to marketplace:', err);
    return { success: false, message: err?.message || 'Network error publishing to marketplace.' };
  }
}

/**
 * Fetch aggregated post-harvest analytics
 */
export async function fetchPostHarvestAnalyticsApi(farmerId?: string): Promise<PostHarvestAnalytics | null> {
  try {
    const fId = farmerId || 'KISAN-UP-2026-8842';
    const res = await fetch(`/api/farmer/post-harvest-analytics?farmerId=${encodeURIComponent(fId)}`, {
      headers: { ...getAuthHeader() },
    });
    const data = await res.json();
    if (data.success && data.analytics) {
      return data.analytics;
    }
    return null;
  } catch (err) {
    console.warn('Network error fetching post-harvest analytics:', err);
    return null;
  }
}
