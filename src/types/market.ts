export interface AgmarknetRawRecord {
  state?: string;
  district?: string;
  market?: string;
  commodity?: string;
  variety?: string;
  arrival_date?: string;
  min_price?: string | number;
  max_price?: string | number;
  modal_price?: string | number;
  // Case variations from different versions of data.gov.in
  State?: string;
  District?: string;
  Market?: string;
  Commodity?: string;
  Variety?: string;
  Arrival_Date?: string;
  Min_Price?: string | number;
  Max_Price?: string | number;
  Modal_Price?: string | number;
}

export interface OfficialMandiRecord {
  id: string;
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  arrivalDate: string; // ISO or DD/MM/YYYY
  minPriceQuintal: number;
  maxPriceQuintal: number;
  modalPriceQuintal: number;
  minPriceKg: number;
  maxPriceKg: number;
  modalPriceKg: number;
  unit: string;
  source: string;
  isOfficialRecord: boolean;
  provenanceLabel: string;
  priceChange24h?: number;
  percentChange24h?: number;
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
  sevenDayHistory: {
    date: string;
    day: string;
    modalPriceQuintal: number;
    modalPriceKg: number;
    minPriceKg: number;
    maxPriceKg: number;
  }[];
}

export interface MandiSearchParams {
  state?: string;
  district?: string;
  market?: string;
  commodity?: string;
  variety?: string;
  date?: string;
  mode?: 'official' | 'demo';
  limit?: number;
}

export interface MandiSearchResponse {
  success: boolean;
  source: 'official_agmarknet_api' | 'demo_data';
  isLiveApi: boolean;
  totalRecords: number;
  records: OfficialMandiRecord[];
  fetchedAt?: string;
  dataDate?: string;
  resourceId?: string;
  meta: {
    state?: string;
    district?: string;
    market?: string;
    commodity?: string;
    variety?: string;
    queryDate?: string;
    latestArrivalDate?: string;
    dataDate?: string;
    fetchedAt?: string;
    httpStatus?: number;
    resourceId?: string;
    note?: string;
  };
  errorMessage?: string;
}

export interface MandiHistoryRecord {
  arrivalDate: string;
  rawDate: string;
  displayDate: string;
  timestamp: number;
  modalPriceQuintal: number;
  modalPriceKg: number;
  minPriceQuintal: number;
  maxPriceQuintal: number;
  minPriceKg: number;
  maxPriceKg: number;
  variety?: string;
  market?: string;
  district?: string;
  state?: string;
  commodity?: string;
}

export interface MandiHistoryResponse {
  success: boolean;
  source: 'official_agmarknet_api' | 'demo_data';
  isLiveApi: boolean;
  totalDistinctDates: number;
  records: MandiHistoryRecord[];
  state?: string;
  district?: string;
  market?: string;
  commodity?: string;
  variety?: string;
  latestArrivalDate?: string;
  dataDate?: string;
  fetchedAt?: string;
  resourceId?: string;
  errorMessage?: string;
}

export interface MandiComparisonItem {
  market: string;
  district: string;
  state: string;
  distanceKm?: number;
  modalPriceKg: number;
  modalPriceQuintal: number;
  minPriceKg: number;
  maxPriceKg: number;
  arrivalDate: string;
  trend: 'up' | 'down' | 'stable';
  isNearest?: boolean;
  isHighestRate?: boolean;
}

export interface MandiComparisonResponse {
  success: boolean;
  commodity: string;
  state: string;
  district?: string;
  records: MandiComparisonItem[];
  averageModalPriceKg: number;
  highestMandi: MandiComparisonItem | null;
  lowestMandi: MandiComparisonItem | null;
  latestArrivalDate: string;
  isLiveApi?: boolean;
  errorMessage?: string;
}
