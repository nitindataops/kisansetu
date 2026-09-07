import {
  OfficialMandiRecord,
  MandiSearchParams,
  MandiSearchResponse,
  MandiComparisonResponse,
  MandiHistoryResponse,
} from '../types/market';
import { MarketPriceRecord } from '../types/farmer';

/**
 * Converts an OfficialMandiRecord to the UI MarketPriceRecord model
 */
export function mapOfficialToMarketPriceRecord(official: OfficialMandiRecord): MarketPriceRecord {
  return {
    crop: official.commodity,
    variety: official.variety,
    currentMandiPrice: official.modalPriceKg,
    minPriceToday: official.minPriceKg,
    modalPrice: official.modalPriceKg,
    maxPriceToday: official.maxPriceKg,
    unit: '₹/kg',
    isActualMandiPrice: true,
    isProjectedPrice: false,
    priceChange24h: official.priceChange24h || 0,
    percentChange24h: official.percentChange24h || 0,
    trend: official.trend,
    nearestMandi: `${official.market} APMC Yard, ${official.district} (${official.state})`,
    source: official.source,
    provenanceLabel: official.provenanceLabel,
    qualityRequirements: 'APMC Fair Average Quality (FAQ) Standard Verified Lot',
    buyerDemand: 'High',
    demandLevel: 'Official Mandi Trade Volume',
    lastUpdated: official.lastUpdated,
    sevenDayHistory: official.sevenDayHistory.map((h) => ({
      day: h.day,
      price: h.modalPriceKg,
      actualPrice: h.modalPriceKg,
      projectedPrice: undefined,
    })),
  };
}

/**
 * Client-Side API Service for Mandi Prices:
 * Strictly requests the backend /api/mandi-prices endpoint.
 * No hardcoded/synthetic records are ever injected on failure.
 */
export async function fetchMandiPrices(params: MandiSearchParams): Promise<MandiSearchResponse> {
  try {
    const query = new URLSearchParams();
    if (params.state && params.state !== 'All') query.set('state', params.state);
    if (params.district && params.district !== 'All') query.set('district', params.district);
    if (params.market && params.market !== 'All') query.set('market', params.market);
    if (params.commodity && params.commodity !== 'All') query.set('commodity', params.commodity);
    if (params.variety && params.variety !== 'All') query.set('variety', params.variety);
    if (params.date && params.date !== 'All') query.set('date', params.date);
    if (params.limit) query.set('limit', String(params.limit));

    const response = await fetch(`/api/mandi-prices?${query.toString()}`);
    if (response.ok) {
      const data: MandiSearchResponse = await response.json();
      return data;
    } else {
      const errorJson = await response.json().catch(() => ({}));
      return {
        success: false,
        source: 'official_agmarknet_api',
        isLiveApi: false,
        totalRecords: 0,
        records: [],
        errorMessage: errorJson.errorMessage || errorJson.error || `Server returned HTTP ${response.status}`,
        meta: {
          state: params.state,
          district: params.district,
          market: params.market,
          commodity: params.commodity,
          variety: params.variety,
        },
      };
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Network error';
    return {
      success: false,
      source: 'official_agmarknet_api',
      isLiveApi: false,
      totalRecords: 0,
      records: [],
      errorMessage: `Government mandi data temporarily unavailable (${msg}).`,
      meta: {
        state: params.state,
        district: params.district,
        market: params.market,
        commodity: params.commodity,
        variety: params.variety,
      },
    };
  }
}

export const searchOfficialMandiPrices = fetchMandiPrices;

/**
 * Fetch Mandi Metadata (States, Districts, Commodities)
 */
export async function fetchMandiMetadata(): Promise<{
  states: string[];
  districts: Record<string, string[]>;
  commodities: string[];
}> {
  try {
    const res = await fetch('/api/mandi-meta');
    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        return {
          states: data.states || [],
          districts: data.districts || {},
          commodities: data.commodities || [],
        };
      }
    }
  } catch {
    // ignore
  }

  return {
    states: ['All States', 'Uttar Pradesh', 'Punjab', 'Maharashtra', 'Rajasthan', 'Haryana', 'Madhya Pradesh', 'Gujarat', 'Karnataka', 'Andhra Pradesh', 'Telangana', 'Bihar', 'West Bengal', 'Tamil Nadu'],
    districts: {
      'Uttar Pradesh': ['Bareilly', 'Meerut', 'Lucknow', 'Moradabad', 'Agra', 'Varanasi', 'Kanpur'],
    },
    commodities: ['Wheat', 'Rice', 'Paddy(Dhan)', 'Maize', 'Bengal Gram(Gram/Chana)'],
  };
}

/**
 * Fetch Multi-Mandi Comparison
 */
export async function fetchMandiComparison(
  commodity: string = 'Wheat',
  state: string = 'Uttar Pradesh',
  district?: string
): Promise<MandiComparisonResponse> {
  try {
    const query = new URLSearchParams({ commodity, state });
    if (district && district !== 'All') query.set('district', district);
    const res = await fetch(`/api/mandi-compare?${query.toString()}`);
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch {
    // Handled in return
  }

  return {
    success: false,
    commodity,
    state,
    district,
    records: [],
    averageModalPriceKg: 0,
    highestMandi: null,
    lowestMandi: null,
    latestArrivalDate: '',
    isLiveApi: false,
    errorMessage: 'Government comparison data temporarily unavailable.',
  };
}

/**
 * Handle Voice Query with Mandi Assistant
 */
export async function queryVoiceMandiAssistant(query: string, lang: 'hi' | 'en' = 'hi') {
  try {
    const res = await fetch('/api/mandi-voice-query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, language: lang }),
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch {
    // Handled in return
  }

  return {
    success: false,
    detectedDistrict: '',
    detectedCommodity: '',
    record: null,
    spokenText:
      lang === 'hi'
        ? 'क्षमा करें, आधिकारिक सरकारी मंडी डेटा वर्तमान में अनुपलब्ध है।'
        : 'Sorry, official government mandi data is currently unavailable.',
    errorMessage: 'Government mandi data temporarily unavailable',
    isLiveApi: false,
  };
}

/**
 * Client-Side API Service for Mandi Price History (Distinct Arrival Dates):
 * Strictly requests the backend /api/mandi-prices/history endpoint.
 * No hardcoded/synthetic records are ever injected on failure.
 */
export async function fetchMandiPriceHistory(params: MandiSearchParams): Promise<MandiHistoryResponse> {
  try {
    const query = new URLSearchParams();
    if (params.state && params.state !== 'All') query.set('state', params.state);
    if (params.district && params.district !== 'All') query.set('district', params.district);
    if (params.market && params.market !== 'All') query.set('market', params.market);
    if (params.commodity && params.commodity !== 'All') query.set('commodity', params.commodity);
    if (params.variety && params.variety !== 'All') query.set('variety', params.variety);

    const response = await fetch(`/api/mandi-prices/history?${query.toString()}`);
    if (response.ok) {
      const data: MandiHistoryResponse = await response.json();
      return data;
    } else {
      const errorJson = await response.json().catch(() => ({}));
      return {
        success: false,
        source: 'official_agmarknet_api',
        isLiveApi: false,
        totalDistinctDates: 0,
        records: [],
        errorMessage: errorJson.errorMessage || errorJson.error || `Server returned HTTP ${response.status}`,
      };
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Network error';
    return {
      success: false,
      source: 'official_agmarknet_api',
      isLiveApi: false,
      totalDistinctDates: 0,
      records: [],
      errorMessage: `Government mandi data temporarily unavailable (${msg}).`,
    };
  }
}

