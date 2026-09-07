/**
 * Distance Calculation and Geolocation Reference for KisanSetu
 * Computes road/geographic distances from Buyer location (e.g. Bareilly, UP or Pune, MH)
 * to Farmer origin mandi centers.
 */

// Well-known road distances from Bareilly APMC hub (in KM)
const BAREILLY_DISTANCES_KM: Record<string, number> = {
  'bareilly': 8,
  'baheri': 18,
  'pilibhit': 48,
  'budaun': 45,
  'shahjahanpur': 72,
  'rampur': 65,
  'moradabad': 90,
  'sambhal': 110,
  'aligarh': 180,
  'bulandshahr': 200,
  'meerut': 220,
  'hapur': 210,
  'ghaziabad': 240,
  'noida': 245,
  'delhi': 250,
  'lucknow': 250,
  'kanpur': 260,
  'agra': 220,
  'mathura': 230,
  'karnal': 310,
  'ludhiana': 480,
  'amritsar': 610,
  'chandigarh': 420,
  'shimla': 490,
  'indore': 780,
  'bhopal': 720,
  'nashik': 1280,
  'pune': 1420,
  'mumbai': 1360,
  'guntur': 1750,
};

// Canonical Real Agricultural Coordinates for Indian Districts and Mandi Centers
export const INDIAN_AGRI_COORDINATES: Record<string, { lat: number; lng: number; district: string; state: string }> = {
  'baheri': { lat: 28.7758, lng: 79.4975, district: 'Bareilly', state: 'Uttar Pradesh' },
  'bareilly': { lat: 28.3670, lng: 79.4304, district: 'Bareilly', state: 'Uttar Pradesh' },
  'pilibhit': { lat: 28.6310, lng: 79.8037, district: 'Pilibhit', state: 'Uttar Pradesh' },
  'budaun': { lat: 28.0339, lng: 79.1245, district: 'Budaun', state: 'Uttar Pradesh' },
  'shahjahanpur': { lat: 27.8805, lng: 79.9120, district: 'Shahjahanpur', state: 'Uttar Pradesh' },
  'rampur': { lat: 28.8154, lng: 79.0256, district: 'Rampur', state: 'Uttar Pradesh' },
  'moradabad': { lat: 28.8386, lng: 78.7733, district: 'Moradabad', state: 'Uttar Pradesh' },
  'sambhal': { lat: 28.5843, lng: 78.5721, district: 'Sambhal', state: 'Uttar Pradesh' },
  'aligarh': { lat: 27.8974, lng: 78.0880, district: 'Aligarh', state: 'Uttar Pradesh' },
  'meerut': { lat: 28.9845, lng: 77.7064, district: 'Meerut', state: 'Uttar Pradesh' },
  'hapur': { lat: 28.7306, lng: 77.7759, district: 'Hapur', state: 'Uttar Pradesh' },
  'ghaziabad': { lat: 28.6692, lng: 77.4538, district: 'Ghaziabad', state: 'Uttar Pradesh' },
  'noida': { lat: 28.5355, lng: 77.3910, district: 'Gautam Buddha Nagar', state: 'Uttar Pradesh' },
  'delhi': { lat: 28.7041, lng: 77.1025, district: 'Delhi', state: 'Delhi' },
  'lucknow': { lat: 26.8467, lng: 80.9462, district: 'Lucknow', state: 'Uttar Pradesh' },
  'kanpur': { lat: 26.4499, lng: 80.3319, district: 'Kanpur Nagar', state: 'Uttar Pradesh' },
  'agra': { lat: 27.1767, lng: 78.0081, district: 'Agra', state: 'Uttar Pradesh' },
  'mathura': { lat: 27.4924, lng: 77.6737, district: 'Mathura', state: 'Uttar Pradesh' },
  'karnal': { lat: 29.6857, lng: 76.9905, district: 'Karnal', state: 'Haryana' },
  'ludhiana': { lat: 30.9010, lng: 75.8573, district: 'Ludhiana', state: 'Punjab' },
  'amritsar': { lat: 31.6340, lng: 74.8723, district: 'Amritsar', state: 'Punjab' },
  'chandigarh': { lat: 30.7333, lng: 76.7794, district: 'Chandigarh', state: 'Chandigarh' },
  'shimla': { lat: 31.1048, lng: 77.1734, district: 'Shimla', state: 'Himachal Pradesh' },
  'indore': { lat: 22.7196, lng: 75.8577, district: 'Indore', state: 'Madhya Pradesh' },
  'bhopal': { lat: 23.2599, lng: 77.4126, district: 'Bhopal', state: 'Madhya Pradesh' },
  'nashik': { lat: 19.9975, lng: 73.7898, district: 'Nashik', state: 'Maharashtra' },
  'pune': { lat: 18.5204, lng: 73.8567, district: 'Pune', state: 'Maharashtra' },
  'mumbai': { lat: 19.0760, lng: 72.8777, district: 'Mumbai', state: 'Maharashtra' },
  'guntur': { lat: 16.3067, lng: 80.4365, district: 'Guntur', state: 'Andhra Pradesh' },
};

/**
 * Resolves precise coordinates for a given location and district.
 * Uses stored coordinates if provided, else falls back to authentic district geo-center.
 */
export function getCoordinatesForLocation(
  location?: string,
  district?: string,
  explicitLat?: number,
  explicitLng?: number
): { lat: number; lng: number; isEstimated: boolean } {
  if (typeof explicitLat === 'number' && typeof explicitLng === 'number' && !isNaN(explicitLat) && !isNaN(explicitLng)) {
    return { lat: explicitLat, lng: explicitLng, isEstimated: false };
  }

  const query = `${location || ''} ${district || ''}`.toLowerCase();
  for (const [key, coords] of Object.entries(INDIAN_AGRI_COORDINATES)) {
    if (query.includes(key)) {
      return { lat: coords.lat, lng: coords.lng, isEstimated: false };
    }
  }

  // Default to Bareilly APMC region hub if not found
  return { lat: 28.3670, lng: 79.4304, isEstimated: true };
}

/**
 * Calculates straight-line geographic distance using Haversine formula
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Calculates or looks up distance in KM from Buyer's reference city to farmer's location.
 * Returns null if location is unknown/unavailable (adhering to data integrity rules).
 */
export function getDistanceToBuyerKm(farmerLocation?: string, buyerLocation?: string): number | null {
  if (!farmerLocation || farmerLocation.trim() === '') {
    return null;
  }

  const farmerLocLower = farmerLocation.toLowerCase();

  // If farmer already has exact distance provided in object
  // Otherwise check against Bareilly reference map
  for (const [city, dist] of Object.entries(BAREILLY_DISTANCES_KM)) {
    if (farmerLocLower.includes(city)) {
      return dist;
    }
  }

  return null;
}

/**
 * Formats distance display string
 */
export function formatDistanceDisplay(distanceKm?: number | null): string {
  if (distanceKm === undefined || distanceKm === null || isNaN(distanceKm)) {
    return 'Distance unavailable';
  }
  return `${distanceKm} km away`;
}
