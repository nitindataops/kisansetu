import {
  AgmarknetRawRecord,
  OfficialMandiRecord,
  MandiSearchParams,
  MandiSearchResponse,
  MandiComparisonResponse,
  MandiComparisonItem,
  MandiHistoryRecord,
  MandiHistoryResponse,
} from '../../types/market';

// In-memory cache for live government responses (Key -> { timestamp: number, data: MandiSearchResponse })
const liveApiCache = new Map<string, { timestamp: number; data: MandiSearchResponse }>();
// In-memory cache for historical requests
const historyApiCache = new Map<string, { timestamp: number; data: MandiHistoryResponse }>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes TTL for live records

const MONTH_NAMES_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Exact normalization mapping from common/UI commodity terms to Data.gov.in AGMARKNET dataset names.
 * Strictly restricted to approved KisanSetu crops: Wheat, Rice/Paddy, Maize, Pulses/Chana.
 */
const COMMODITY_NORMALIZATION_MAP: Record<string, string> = {
  // 1. Wheat
  wheat: 'Wheat',
  gehu: 'Wheat',
  gehun: 'Wheat',
  sharbati: 'Wheat',
  lokwan: 'Wheat',

  // 2. Rice / Paddy
  'paddy(dhan)': 'Paddy(Common)',
  'paddy(common)': 'Paddy(Common)',
  paddy: 'Paddy(Common)',
  dhan: 'Paddy(Common)',
  'paddy(basmati)': 'Paddy(Basmati)',
  basmati: 'Paddy(Basmati)',
  rice: 'Rice',
  chawal: 'Rice',

  // 3. Maize
  maize: 'Maize',
  makka: 'Maize',
  corn: 'Maize',

  // 4. Pulses / Chana
  'bengal gram(gram/chana)': 'Bengal Gram(Gram)(Whole)',
  'bengal gram(gram)(whole)': 'Bengal Gram(Gram)(Whole)',
  'bengal gram': 'Bengal Gram(Gram)(Whole)',
  chana: 'Bengal Gram(Gram)(Whole)',
  gram: 'Bengal Gram(Gram)(Whole)',
  pulses: 'Bengal Gram(Gram)(Whole)',
  pulse: 'Bengal Gram(Gram)(Whole)',
  dal: 'Bengal Gram(Gram)(Whole)',
  'arhar (tur/red gram)': 'Red gram/Arhar/Tur(whole)',
  'red gram/arhar/tur(whole)': 'Red gram/Arhar/Tur(whole)',
  arhar: 'Red gram/Arhar/Tur(whole)',
  tur: 'Red gram/Arhar/Tur(whole)',
  'green gram (moong)': 'Green Gram(Moong)(Whole)',
  'green gram(moong)(whole)': 'Green Gram(Moong)(Whole)',
  moong: 'Green Gram(Moong)(Whole)',
  'black gram (urd beans)': 'Black Gram(Urd Beans)(Whole)',
  'black gram(urd beans)(whole)': 'Black Gram(Urd Beans)(Whole)',
  urad: 'Black Gram(Urd Beans)(Whole)',
  urd: 'Black Gram(Urd Beans)(Whole)',
  'masur dal': 'Masur Dal',
  masur: 'Masur Dal',
};

/**
 * Exact normalization mapping from common state aliases to Data.gov.in AGMARKNET names.
 */
const STATE_NORMALIZATION_MAP: Record<string, string> = {
  kerala: 'Keralam',
  keralam: 'Keralam',
  chhattisgarh: 'Chattisgarh',
  chattisgarh: 'Chattisgarh',
  'andaman & nicobar': 'Andaman and Nicobar',
  'andaman and nicobar islands': 'Andaman and Nicobar',
  'andaman and nicobar': 'Andaman and Nicobar',
  orissa: 'Odisha',
  odisha: 'Odisha',
  up: 'Uttar Pradesh',
  'uttar pradesh': 'Uttar Pradesh',
  mp: 'Madhya Pradesh',
  'madhya pradesh': 'Madhya Pradesh',
  wb: 'West Bengal',
  'west bengal': 'West Bengal',
  hp: 'Himachal Pradesh',
  'himachal pradesh': 'Himachal Pradesh',
  ap: 'Andhra Pradesh',
  'andhra pradesh': 'Andhra Pradesh',
  tn: 'Tamil Nadu',
  'tamil nadu': 'Tamil Nadu',
  punjab: 'Punjab',
  haryana: 'Haryana',
  rajasthan: 'Rajasthan',
  gujarat: 'Gujarat',
  maharashtra: 'Maharashtra',
  bihar: 'Bihar',
  telangana: 'Telangana',
  uttarakhand: 'Uttarakhand',
  tripura: 'Tripura',
  chandigarh: 'Chandigarh',
};

export function normalizeCommodity(input?: string): string {
  if (!input || input === 'All' || input === 'All Commodities') return '';
  const key = input.trim().toLowerCase();
  return COMMODITY_NORMALIZATION_MAP[key] || input.trim();
}

export function normalizeState(input?: string): string {
  if (!input || input === 'All' || input === 'All States') return '';
  const key = input.trim().toLowerCase();
  return STATE_NORMALIZATION_MAP[key] || input.trim();
}

/**
 * Normalizes an arrival date into timestamp, standard DD/MM/YYYY format, and display format (e.g. "02 Sep")
 */
function parseArrivalDate(dateStr: string): { timestamp: number; normalizedDate: string; displayDate: string } {
  if (!dateStr) return { timestamp: 0, normalizedDate: '', displayDate: '' };
  const trimmed = dateStr.trim();

  // Match DD/MM/YYYY or DD-MM-YYYY
  const dmyMatch = trimmed.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10);
    const month = parseInt(dmyMatch[2], 10) - 1;
    const year = parseInt(dmyMatch[3], 10);
    const dateObj = new Date(Date.UTC(year, month, day));
    const padDay = String(day).padStart(2, '0');
    const padMonth = String(month + 1).padStart(2, '0');
    const monthStr = MONTH_NAMES_EN[month] || '';
    return {
      timestamp: dateObj.getTime(),
      normalizedDate: `${padDay}/${padMonth}/${year}`,
      displayDate: `${padDay} ${monthStr}`,
    };
  }

  // Match YYYY-MM-DD or YYYY/MM/DD
  const ymdMatch = trimmed.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/);
  if (ymdMatch) {
    const year = parseInt(ymdMatch[1], 10);
    const month = parseInt(ymdMatch[2], 10) - 1;
    const day = parseInt(ymdMatch[3], 10);
    const dateObj = new Date(Date.UTC(year, month, day));
    const padDay = String(day).padStart(2, '0');
    const padMonth = String(month + 1).padStart(2, '0');
    const monthStr = MONTH_NAMES_EN[month] || '';
    return {
      timestamp: dateObj.getTime(),
      normalizedDate: `${padDay}/${padMonth}/${year}`,
      displayDate: `${padDay} ${monthStr}`,
    };
  }

  const parsed = Date.parse(trimmed);
  if (!isNaN(parsed)) {
    const d = new Date(parsed);
    const padDay = String(d.getUTCDate()).padStart(2, '0');
    const monthStr = MONTH_NAMES_EN[d.getUTCMonth()] || '';
    return {
      timestamp: parsed,
      normalizedDate: trimmed,
      displayDate: `${padDay} ${monthStr}`,
    };
  }

  return { timestamp: 0, normalizedDate: trimmed, displayDate: trimmed };
}

/**
 * Normalizes raw or string numeric values into valid positive floats
 */
function parsePrice(val: unknown): number {
  if (typeof val === 'number') return Number.isFinite(val) && !isNaN(val) && val > 0 ? val : 0;
  if (typeof val === 'string') {
    const cleaned = val.replace(/[^0-9.]/g, '');
    const num = parseFloat(cleaned);
    return Number.isFinite(num) && !isNaN(num) && num > 0 ? num : 0;
  }
  return 0;
}

/**
 * Formats a raw record from Data.gov.in AGMARKNET API into normalized OfficialMandiRecord
 */
function normalizeAgmarknetRecord(raw: AgmarknetRawRecord, index: number): OfficialMandiRecord {
  const state = (raw.state || raw.State || 'Unknown State').trim();
  const district = (raw.district || raw.District || 'Unknown District').trim();
  const market = (raw.market || raw.Market || 'Unknown Market').trim();
  const commodity = (raw.commodity || raw.Commodity || 'Unknown Commodity').trim();
  const variety = (raw.variety || raw.Variety || 'FAQ').trim();
  const arrivalDate = (raw.arrival_date || raw.Arrival_Date || '').trim();

  const minQ = parsePrice(raw.min_price || raw.Min_Price);
  const maxQ = parsePrice(raw.max_price || raw.Max_Price);
  const modalQ = parsePrice(raw.modal_price || raw.Modal_Price) || (minQ > 0 && maxQ > 0 ? (minQ + maxQ) / 2 : minQ || maxQ || 0);

  const finalMinQ = minQ > 0 ? minQ : modalQ;
  const finalMaxQ = maxQ > 0 ? maxQ : modalQ;

  const modalKg = Math.round((modalQ / 100) * 10) / 10;
  const minKg = Math.round((finalMinQ / 100) * 10) / 10;
  const maxKg = Math.round((finalMaxQ / 100) * 10) / 10;

  // ONLY use official recorded arrival date point (NO fake historical curves)
  const history = arrivalDate
    ? [
        {
          date: arrivalDate,
          day: arrivalDate,
          modalPriceQuintal: modalQ,
          modalPriceKg: modalKg,
          minPriceKg: minKg,
          maxPriceKg: maxKg,
        },
      ]
    : [];

  return {
    id: `agmarknet-${index}-${state}-${district}-${market}-${commodity}-${variety}`
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-'),
    state,
    district,
    market,
    commodity,
    variety,
    arrivalDate,
    minPriceQuintal: finalMinQ,
    maxPriceQuintal: finalMaxQ,
    modalPriceQuintal: modalQ,
    minPriceKg: minKg,
    maxPriceKg: maxKg,
    modalPriceKg: modalKg,
    unit: '₹/Quintal (₹/kg)',
    source: 'AGMARKNET (DMI, Ministry of Agriculture & Farmers Welfare, GoI)',
    isOfficialRecord: true,
    provenanceLabel: 'Official AGMARKNET Record • Directorate of Marketing & Inspection',
    priceChange24h: 0,
    percentChange24h: 0,
    trend: 'stable',
    lastUpdated: `Government Record • Arrival Date: ${arrivalDate || 'Not specified'}`,
    sevenDayHistory: history,
  };
}

/**
 * Main Search Function for Official Mandi Prices:
 * Queries the official Open Government Data / AGMARKNET API (api.data.gov.in).
 * Resource ID: 9ef84268-d588-465a-a308-a864a43d0070
 * Follows strict non-synthetic, non-mock data rules.
 */
export async function searchOfficialMandiPrices(params: MandiSearchParams): Promise<MandiSearchResponse> {
  const apiKey = (process.env.DATA_GOV_IN_API_KEY || process.env.DATA_GOV_API_KEY || '').trim();

  // If no API key configured on server, immediately return failure with clear technical message
  if (!apiKey || apiKey.length === 0) {
    console.warn('[AGMARKNET Live Provider] DATA_GOV_IN_API_KEY or DATA_GOV_API_KEY is not configured in server environment.');
    return {
      success: false,
      source: 'official_agmarknet_api',
      isLiveApi: false,
      totalRecords: 0,
      records: [],
      errorMessage: 'Government mandi data temporarily unavailable.',
      meta: {
        state: params.state,
        district: params.district,
        market: params.market,
        commodity: params.commodity,
        variety: params.variety,
        resourceId: '9ef84268-d588-465a-a308-a864a43d0070',
        httpStatus: 0,
        note: 'DATA_GOV_IN_API_KEY missing in server environment',
      },
    };
  }

  const normalizedCommodity = normalizeCommodity(params.commodity);
  const normalizedState = normalizeState(params.state);

  const cacheKey = `live-${normalizedState || 'all'}-${params.district || 'all'}-${params.market || 'all'}-${normalizedCommodity || 'all'}-${params.variety || 'all'}-${params.date || 'all'}`;

  // Check in-memory cache
  const cached = liveApiCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    const resourceUrl = new URL('https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070');
    resourceUrl.searchParams.append('api-key', apiKey);
    resourceUrl.searchParams.append('format', 'json');
    resourceUrl.searchParams.append('offset', '0');
    // Fetch up to 500 records for the commodity/state to allow precise client/district matching
    resourceUrl.searchParams.append('limit', String(Math.max(params.limit || 50, 500)));

    if (normalizedCommodity) {
      resourceUrl.searchParams.append('filters[commodity]', normalizedCommodity);
    }
    if (normalizedState) {
      resourceUrl.searchParams.append('filters[state]', normalizedState);
    }

    // Mask secret API key for logging
    const maskedUrl = resourceUrl.toString().replace(/api-key=[^&]+/, 'api-key=***MASKED***');

    const res = await fetch(resourceUrl.toString(), {
      headers: {
        'User-Agent': 'KisanSetu-Farmer-Platform/1.0 (Ministry of Agriculture Data Integration)',
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(12000),
    });

    if (res.ok) {
      const json = await res.json();
      const rawRecords: AgmarknetRawRecord[] = Array.isArray(json.records) ? json.records : [];

      // Diagnostic logging (WITHOUT exposing API key)
      console.log('[AGMARKNET Server Diagnostic]:', {
        url: maskedUrl,
        commodity: normalizedCommodity || 'All',
        state: normalizedState || 'All',
        district: params.district || 'All',
        market: params.market || 'All',
        variety: params.variety || 'All',
        date: params.date || 'All',
        limit: 500,
        offset: 0,
        httpStatus: res.status,
        responseTotal: json.total || 0,
        responseRecordCount: rawRecords.length,
      });

      if (rawRecords.length === 0) {
        // API is active and connected, but 0 records matched this commodity in this region today
        const emptyResponse: MandiSearchResponse = {
          success: true,
          source: 'official_agmarknet_api',
          isLiveApi: true,
          totalRecords: 0,
          records: [],
          errorMessage: `No official government mandi records found in today's dataset for ${params.commodity || 'this crop'}${normalizedState ? ' in ' + normalizedState : ''}.`,
          meta: {
            state: params.state,
            district: params.district,
            market: params.market,
            commodity: params.commodity,
            variety: params.variety,
            resourceId: '9ef84268-d588-465a-a308-a864a43d0070',
            httpStatus: res.status,
            note: 'Zero records returned by official Data.gov.in endpoint for this query',
          },
        };
        liveApiCache.set(cacheKey, { timestamp: Date.now(), data: emptyResponse });
        return emptyResponse;
      }

      // We have official government records! Normalize them
      const allNormalized = rawRecords.map((r, i) => normalizeAgmarknetRecord(r, i));
      const latestArrival = allNormalized[0]?.arrivalDate || '';

      let filteredRecords = allNormalized;
      let diagnosticNote: string | undefined;

      // Check district filter if requested and not "All"
      if (params.district && params.district !== 'All' && params.district !== 'All Districts') {
        const districtKey = params.district.trim().toLowerCase();
        const districtMatches = allNormalized.filter(
          (r) => r.district.toLowerCase() === districtKey || r.district.toLowerCase().includes(districtKey)
        );

        if (districtMatches.length > 0) {
          filteredRecords = districtMatches;
        } else {
          // If specific district has 0 reported arrivals today (e.g. Bareilly), show the other official records for the State
          filteredRecords = allNormalized;
          diagnosticNote = `No official arrivals recorded for ${params.district} district in today's government bulletin. Showing ${allNormalized.length} official records from other mandis in ${normalizedState || 'the region'}.`;
        }
      }

      // Check market filter if requested
      if (params.market && params.market !== 'All' && params.market !== 'All Mandis') {
        const marketKey = params.market.trim().toLowerCase();
        const marketMatches = filteredRecords.filter(
          (r) => r.market.toLowerCase() === marketKey || r.market.toLowerCase().includes(marketKey)
        );
        if (marketMatches.length > 0) {
          filteredRecords = marketMatches;
        }
      }

      // Check variety filter if requested
      if (params.variety && params.variety !== 'All' && params.variety !== 'FAQ' && params.variety !== 'All Varieties') {
        const varietyKey = params.variety.trim().toLowerCase();
        const varietyMatches = filteredRecords.filter((r) => r.variety.toLowerCase().includes(varietyKey));
        if (varietyMatches.length > 0) {
          filteredRecords = varietyMatches;
        }
      }

      const response: MandiSearchResponse = {
        success: true,
        source: 'official_agmarknet_api',
        isLiveApi: true,
        totalRecords: filteredRecords.length,
        records: filteredRecords,
        dataDate: latestArrival,
        resourceId: '9ef84268-d588-465a-a308-a864a43d0070',
        fetchedAt: new Date().toISOString(),
        meta: {
          state: params.state,
          district: params.district,
          market: params.market,
          commodity: params.commodity,
          variety: params.variety,
          latestArrivalDate: latestArrival,
          dataDate: latestArrival,
          fetchedAt: new Date().toISOString(),
          httpStatus: res.status,
          resourceId: '9ef84268-d588-465a-a308-a864a43d0070',
          note: diagnosticNote,
        },
      };

      liveApiCache.set(cacheKey, { timestamp: Date.now(), data: response });
      return response;
    } else {
      console.error(`[AGMARKNET Live Provider] Data.gov.in returned HTTP Error: ${res.status} ${res.statusText}`);
      return {
        success: false,
        source: 'official_agmarknet_api',
        isLiveApi: false,
        totalRecords: 0,
        records: [],
        errorMessage: 'Government mandi data temporarily unavailable.',
        meta: {
          state: params.state,
          district: params.district,
          market: params.market,
          commodity: params.commodity,
          variety: params.variety,
          resourceId: '9ef84268-d588-465a-a308-a864a43d0070',
          httpStatus: res.status,
        },
      };
    }
  } catch (error: any) {
    console.error('[AGMARKNET Live Provider] Network/Fetch Exception:', error?.message || error);
    return {
      success: false,
      source: 'official_agmarknet_api',
      isLiveApi: false,
      totalRecords: 0,
      records: [],
      errorMessage: 'Government mandi data temporarily unavailable.',
      meta: {
        state: params.state,
        district: params.district,
        market: params.market,
        commodity: params.commodity,
        variety: params.variety,
        resourceId: '9ef84268-d588-465a-a308-a864a43d0070',
        httpStatus: 0,
      },
    };
  }
}

/**
 * Searches official mandi prices history by distinct arrival dates in the official dataset.
 * Does NOT generate fake dates or synthetic price curves.
 */
export async function searchOfficialMandiHistory(params: MandiSearchParams): Promise<MandiHistoryResponse> {
  const apiKey = (process.env.DATA_GOV_IN_API_KEY || process.env.DATA_GOV_API_KEY || '').trim();

  if (!apiKey || apiKey.length === 0) {
    return {
      success: false,
      source: 'official_agmarknet_api',
      isLiveApi: false,
      totalDistinctDates: 0,
      records: [],
      errorMessage: 'Government mandi data temporarily unavailable.',
    };
  }

  const normalizedCommodity = normalizeCommodity(params.commodity);
  const normalizedState = normalizeState(params.state);

  const cacheKey = `hist-${normalizedState || 'all'}-${params.district || 'all'}-${params.market || 'all'}-${normalizedCommodity || 'all'}`;
  const cached = historyApiCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    const searchRes = await searchOfficialMandiPrices({
      ...params,
      limit: 500,
    });

    if (!searchRes.success || searchRes.records.length === 0) {
      return {
        success: searchRes.success,
        source: 'official_agmarknet_api',
        isLiveApi: searchRes.isLiveApi,
        totalDistinctDates: 0,
        records: [],
        state: params.state,
        district: params.district,
        market: params.market,
        commodity: params.commodity,
        errorMessage: 'Historical government mandi records are currently insufficient for this chart.',
      };
    }

    // Group records by arrival date
    const dateMap = new Map<string, MandiHistoryRecord>();

    for (const rec of searchRes.records) {
      if (!rec.arrivalDate) continue;
      const parsed = parseArrivalDate(rec.arrivalDate);
      if (!dateMap.has(parsed.normalizedDate)) {
        dateMap.set(parsed.normalizedDate, {
          arrivalDate: parsed.normalizedDate,
          rawDate: rec.arrivalDate,
          displayDate: parsed.displayDate,
          timestamp: parsed.timestamp,
          modalPriceQuintal: rec.modalPriceQuintal,
          modalPriceKg: rec.modalPriceKg,
          minPriceQuintal: rec.minPriceQuintal,
          maxPriceQuintal: rec.maxPriceQuintal,
          minPriceKg: rec.minPriceKg,
          maxPriceKg: rec.maxPriceKg,
          variety: rec.variety,
          market: rec.market,
          district: rec.district,
          state: rec.state,
          commodity: rec.commodity,
        });
      }
    }

    const distinctDates = Array.from(dateMap.values()).sort((a, b) => a.timestamp - b.timestamp);

    const historyResponse: MandiHistoryResponse = {
      success: true,
      source: 'official_agmarknet_api',
      isLiveApi: true,
      totalDistinctDates: distinctDates.length,
      records: distinctDates,
      state: params.state,
      district: params.district,
      market: params.market,
      commodity: params.commodity,
      latestArrivalDate: searchRes.dataDate,
      dataDate: searchRes.dataDate,
      fetchedAt: new Date().toISOString(),
      resourceId: '9ef84268-d588-465a-a308-a864a43d0070',
      errorMessage:
        distinctDates.length < 2
          ? 'Historical government mandi records are currently insufficient for this chart.'
          : undefined,
    };

    historyApiCache.set(cacheKey, { timestamp: Date.now(), data: historyResponse });
    return historyResponse;
  } catch (error: any) {
    return {
      success: false,
      source: 'official_agmarknet_api',
      isLiveApi: false,
      totalDistinctDates: 0,
      records: [],
      errorMessage: 'Historical government mandi records are currently insufficient for this chart.',
    };
  }
}

/**
 * Returns multi-mandi comparison strictly based on actual government records returned by the API.
 * Never fabricates or synthesizes market rates.
 */
export async function getMandiComparison(
  commodity: string,
  state: string,
  district?: string
): Promise<MandiComparisonResponse> {
  const searchRes = await searchOfficialMandiPrices({
    commodity,
    state,
    limit: 500,
  });

  if (!searchRes.success || searchRes.records.length === 0) {
    return {
      success: searchRes.success,
      commodity,
      state,
      district,
      records: [],
      averageModalPriceKg: 0,
      highestMandi: null,
      lowestMandi: null,
      latestArrivalDate: '',
      isLiveApi: searchRes.isLiveApi,
      errorMessage: searchRes.errorMessage,
    };
  }

  // Deduplicate by market name
  const marketMap = new Map<string, OfficialMandiRecord>();
  for (const rec of searchRes.records) {
    if (!marketMap.has(rec.market)) {
      marketMap.set(rec.market, rec);
    }
  }

  const uniqueRecords = Array.from(marketMap.values());
  const modalPrices = uniqueRecords.map((r) => r.modalPriceKg);
  const maxPrice = Math.max(...modalPrices);
  const minPrice = Math.min(...modalPrices);
  const sumPrice = modalPrices.reduce((acc, p) => acc + p, 0);
  const avgPrice = Math.round((sumPrice / (modalPrices.length || 1)) * 10) / 10;

  const comparisonItems: MandiComparisonItem[] = uniqueRecords.map((r) => {
    const isHighest = r.modalPriceKg === maxPrice && uniqueRecords.length > 1;
    const isNearest = district ? r.district.toLowerCase() === district.toLowerCase() : false;

    return {
      market: r.market,
      district: r.district,
      state: r.state,
      modalPriceKg: r.modalPriceKg,
      modalPriceQuintal: r.modalPriceQuintal,
      minPriceKg: r.minPriceKg,
      maxPriceKg: r.maxPriceKg,
      arrivalDate: r.arrivalDate,
      trend: 'stable',
      isHighestRate: isHighest,
      isNearest: isNearest,
    };
  });

  const highestMandi = comparisonItems.find((m) => m.modalPriceKg === maxPrice) || null;
  const lowestMandi = comparisonItems.find((m) => m.modalPriceKg === minPrice) || null;

  return {
    success: true,
    commodity,
    state,
    district,
    records: comparisonItems,
    averageModalPriceKg: avgPrice,
    highestMandi,
    lowestMandi,
    latestArrivalDate: searchRes.dataDate || '',
    isLiveApi: true,
  };
}

/**
 * Returns comprehensive metadata of all states and commodities supported by the official Data.gov.in dataset.
 */
export function getMandiMetadata() {
  const states = [
    'All States',
    'Andhra Pradesh',
    'Bihar',
    'Chandigarh',
    'Chattisgarh',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Keralam',
    'Madhya Pradesh',
    'Maharashtra',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
    'Andaman and Nicobar',
  ];

  const districts: Record<string, string[]> = {
    'Uttar Pradesh': [
      'Bareilly',
      'Badaun',
      'Bulandshahar',
      'Balrampur',
      'Khiri (Lakhimpur)',
      'Mau(Maunathbhanjan)',
      'Sambhal',
      'Shamli',
      'Sitapur',
      'Meerut',
      'Lucknow',
      'Moradabad',
      'Agra',
      'Varanasi',
      'Kanpur',
      'Aligarh',
      'Allahabad (Prayagraj)',
      'Ayodhya (Faizabad)',
      'Azamgarh',
      'Bahraich',
      'Ballia',
      'Banda',
      'Barabanki',
      'Basti',
      'Bijnor',
      'Chandauli',
      'Deoria',
      'Etah',
      'Etawah',
      'Farrukhabad',
      'Fatehpur',
      'Firozabad',
      'Gautam Buddha Nagar',
      'Ghaziabad',
      'Ghazipur',
      'Gonda',
      'Gorakhpur',
      'Hamirpur',
      'Hapur',
      'Hardoi',
      'Hathras',
      'Jalaun',
      'Jaunpur',
      'Jhansi',
      'Kannauj',
      'Kanpur Dehat',
      'Kasganj',
      'Kaushambi',
      'Kushinagar',
      'Lalitpur',
      'Mahoba',
      'Mahrajganj',
      'Mainpuri',
      'Mathura',
      'Mirzapur',
      'Muzaffarnagar',
      'Pilibhit',
      'Pratapgarh',
      'Rae Bareli',
      'Rampur',
      'Saharanpur',
      'Sant Kabir Nagar',
      'Shahjahanpur',
      'Shravasti',
      'Siddharth Nagar',
      'Sonbhadra',
      'Sultanpur',
      'Unnao',
    ],
    Rajasthan: [
      'Chittorgarh',
      'Jaipur',
      'Jodhpur',
      'Kota',
      'Bikaner',
      'Alwar',
      'Ajmer',
      'Bhilwara',
      'Sriganganagar',
      'Bharatpur',
      'Pali',
      'Barmer',
      'Sikar',
      'Nagaur',
      'Tonk',
      'Udaipur',
      'Hanumangarh',
      'Bundi',
      'Churu',
      'Dausa',
      'Dholpur',
      'Dungarpur',
      'Jaisalmer',
      'Jalore',
      'Jhalawar',
      'Jhunjhunu',
      'Karauli',
      'Pratapgarh',
      'Rajsamand',
      'Sawai Madhopur',
      'Sirohi',
    ],
    'Madhya Pradesh': [
      'Rewa',
      'Indore',
      'Bhopal',
      'Jabalpur',
      'Gwalior',
      'Ujjain',
      'Sagar',
      'Dewas',
      'Satna',
      'Ratlam',
      'Khandwa',
      'Chhindwara',
      'Badwani',
      'Harda',
      'Morena',
      'Vidisha',
      'Sehore',
      'Hoshangabad (Narmadapuram)',
      'Dhar',
      'Khargone',
    ],
    'Andhra Pradesh': [
      'Prakasam',
      'Kurnool',
      'Guntur',
      'Krishna',
      'West Godavari',
      'East Godavari',
      'Chittoor',
      'Anantapur',
      'Visakhapatnam',
      'Srikakulam',
      'Vizianagaram',
      'Kadapa',
      'Nellore',
    ],
    Maharashtra: [
      'Nashik',
      'Pune',
      'Nagpur',
      'Ahmednagar',
      'Solapur',
      'Kolhapur',
      'Aurangabad (Chhatrapati Sambhajinagar)',
      'Amravati',
      'Nanded',
      'Jalgaon',
      'Satara',
      'Sangli',
      'Latur',
      'Dhule',
      'Akola',
      'Chandrapur',
      'Parbhani',
      'Buldhana',
      'Jalna',
      'Beed',
      'Yavatmal',
      'Osmanabad (Dharashiv)',
      'Nandurbar',
      'Wardha',
    ],
    Punjab: [
      'Ludhiana',
      'Amritsar',
      'Jalandhar',
      'Patiala',
      'Bathinda',
      'Hoshiarpur',
      'Moga',
      'Sangrur',
      'Firozpur',
      'Gurdaspur',
      'Kapurthala',
      'Muktsar',
      'Barnala',
      'Faridkot',
      'Fatehgarh Sahib',
      'Fazilka',
      'Mansa',
      'Pathankot',
      'Rupnagar',
      'SAS Nagar (Mohali)',
      'SBS Nagar (Nawanshahr)',
      'Tarn Taran',
    ],
    Haryana: [
      'Karnal',
      'Hisar',
      'Ambala',
      'Rohtak',
      'Panipat',
      'Sonipat',
      'Sirsa',
      'Yamunanagar',
      'Kurukshetra',
      'Bhiwani',
      'Jind',
      'Kaithal',
      'Fatehabad',
      'Rewari',
      'Palwal',
      'Mahendragarh',
      'Gurugram',
      'Faridabad',
      'Jhajjar',
      'Panchkula',
      'Charkhi Dadri',
    ],
    Gujarat: [
      'Ahmedabad',
      'Surat',
      'Vadodara',
      'Rajkot',
      'Bhavnagar',
      'Jamnagar',
      'Junagadh',
      'Gandhinagar',
      'Anand',
      'Bharuch',
      'Mehsana',
      'Patan',
      'Banaskantha',
      'Sabarkantha',
      'Amreli',
      'Surendranagar',
      'Kheda',
      'Panchmahal',
      'Dahod',
      'Valsad',
      'Navsari',
      'Kutch',
      'Morbi',
      'Gir Somnath',
      'Botad',
      'Devbhoomi Dwarka',
      'Aravalli',
      'Mahisagar',
      'Chhota Udaipur',
      'Narmada',
      'Tapi',
      'Dang',
    ],
    'West Bengal': [
      'Burdwan (Purba Bardhaman)',
      'Hooghly',
      'Nadia',
      'Murshidabad',
      'North 24 Parganas',
      'South 24 Parganas',
      'Birbhum',
      'Bankura',
      'Midnapore (Paschim Medinipur)',
      'Purba Medinipur',
      'Malda',
      'Uttar Dinajpur',
      'Dakshin Dinajpur',
      'Jalpaiguri',
      'Cooch Behar',
      'Darjeeling',
      'Kalimpong',
      'Alipurduar',
      'Purulia',
      'Howrah',
      'Jhargram',
      'Paschim Bardhaman',
    ],
    Keralam: [
      'Ernakulam',
      'Kozhikode(Calicut)',
      'Thiruvananthapuram',
      'Kollam',
      'Thrissur',
      'Palakkad',
      'Malappuram',
      'Kannur',
      'Kottayam',
      'Alappuzha',
      'Idukki',
      'Pathanamthitta',
      'Wayanad',
      'Kasaragod',
    ],
  };

  const commodities = [
    'Wheat',
    'Rice',
    'Paddy(Dhan)',
    'Maize',
    'Bengal Gram(Gram/Chana)',
  ];

  return { states, districts, commodities };
}

/**
 * Handles voice-based mandi queries (Hindi & English).
 */
export async function handleVoiceMandiQuery(queryText: string, lang: 'hi' | 'en' = 'en') {
  const queryLower = queryText.toLowerCase();

  let recognizedCommodity = 'Wheat';
  for (const [key, val] of Object.entries(COMMODITY_NORMALIZATION_MAP)) {
    if (queryLower.includes(key)) {
      recognizedCommodity = val;
      break;
    }
  }

  let recognizedState = 'Uttar Pradesh';
  for (const [key, val] of Object.entries(STATE_NORMALIZATION_MAP)) {
    if (queryLower.includes(key)) {
      recognizedState = val;
      break;
    }
  }

  const result = await searchOfficialMandiPrices({
    commodity: recognizedCommodity,
    state: recognizedState,
  });

  const record = result.records[0];

  let speechResponse = '';
  if (record) {
    if (lang === 'hi') {
      speechResponse = `${record.market} मंडी में ${record.commodity} का आज का सरकारी भाव ₹${record.modalPriceQuintal} प्रति क्विंटल (यानि ₹${record.modalPriceKg} प्रति किलो) दर्ज किया गया है।`;
    } else {
      speechResponse = `Today's official government rate for ${record.commodity} at ${record.market} mandi is ₹${record.modalPriceQuintal} per quintal (₹${record.modalPriceKg} per kg).`;
    }
  } else {
    if (lang === 'hi') {
      speechResponse = `${recognizedCommodity} के लिए आज के सरकारी रिकॉर्ड में भाव उपलब्ध नहीं हैं।`;
    } else {
      speechResponse = `Official mandi records for ${recognizedCommodity} are not found in today's government dataset.`;
    }
  }

  return {
    queryText,
    recognizedCommodity,
    recognizedState,
    speechResponse,
    record,
    isLiveApi: result.isLiveApi,
  };
}
