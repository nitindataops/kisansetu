/**
 * KisanSetu - Agriculture Produce Image Resolution & Fallback System
 * 
 * Provides verified high-definition agricultural imagery strictly for the 4 approved crops:
 * 1. Wheat
 * 2. Rice / Paddy
 * 3. Maize
 * 4. Pulses / Chana
 * 
 * Resolution cascade:
 * real farmer uploaded image -> variety-specific image -> crop-level image -> category fallback -> safe agri embedded SVG fallback.
 */
import type { SyntheticEvent } from 'react';

export interface CropImageResolutionParams {
  imageUrl?: string;
  images?: string[];
  galleryImages?: string[];
  crop?: string;
  variety?: string;
  category?: string;
}

// 1. Embedded High-Fidelity SVG Data URIs for clean agricultural placeholder when photos are unavailable
function createCropSvgDataUri(
  title: string,
  _iconHint: string,
  bgColor1: string,
  bgColor2: string,
  accentColor: string,
  detailText: string
): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bgColor1}"/>
      <stop offset="100%" stop-color="${bgColor2}"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.1"/>
    </filter>
  </defs>
  
  <!-- Subtle natural agricultural background -->
  <rect width="400" height="300" fill="url(#bg)"/>
  <path d="M0 220 Q100 200 200 220 T400 220 L400 300 L0 300 Z" fill="${accentColor}" opacity="0.08"/>
  <path d="M0 250 Q100 235 200 250 T400 250 L400 300 L0 300 Z" fill="${accentColor}" opacity="0.12"/>
  
  <!-- Central Plant Leaf Icon (Clean minimal vector outline, NOT cartoon clip-art) -->
  <g transform="translate(170, 75)">
    <circle cx="30" cy="30" r="34" fill="#ffffff" opacity="0.9" filter="url(#shadow)"/>
    <path d="M30 14 C42 14, 46 26, 46 36 C36 46, 24 42, 14 30 C14 18, 26 14, 30 14 Z" fill="none" stroke="${accentColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M30 14 L30 46" stroke="${accentColor}" stroke-width="2" stroke-linecap="round"/>
  </g>

  <!-- Clean Crop Name & Agricultural Details Badge -->
  <g filter="url(#shadow)">
    <rect x="50" y="165" width="300" height="74" rx="14" fill="#ffffff" opacity="0.98"/>
    <rect x="50.5" y="165.5" width="299" height="73" rx="13.5" fill="none" stroke="${accentColor}" stroke-width="1.2" opacity="0.3"/>
  </g>
  
  <text x="200" y="196" font-size="16" font-weight="800" text-anchor="middle" fill="#1C3826" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" letter-spacing="0.2px">${title}</text>
  <text x="200" y="214" font-size="11" font-weight="600" text-anchor="middle" fill="${accentColor}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">${detailText}</text>
  <text x="200" y="229" font-size="9.5" font-weight="500" text-anchor="middle" fill="#68736B" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">Mandi Verified • Active Lot</text>
  
  <!-- Top Agricultural Tag -->
  <rect x="14" y="14" width="124" height="22" rx="6" fill="#1C4B2E" opacity="0.9"/>
  <text x="76" y="28.5" font-size="10" font-weight="700" text-anchor="middle" fill="#FAF7F0" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">🌾 KisanSetu Produce</text>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// 2. Comprehensive SVG crop fallback map strictly for approved crops
export const EMBEDDED_CROP_SVGS: Record<string, string> = {
  'wheat': createCropSvgDataUri('Golden Sharbati Wheat', '🌾', '#FEF3C7', '#FDE68A', '#92400E', 'Cleaned Grains • Standard/Premium Mandi Lot'),
  'sharbati wheat': createCropSvgDataUri('MP Sharbati Wheat', '🌾', '#FEF3C7', '#FCD34D', '#B45309', 'Lustrous Protein Rich • Quality Certified'),
  'rice': createCropSvgDataUri('Pusa Basmati Rice', '🍚', '#F0FDF4', '#DCFCE7', '#166534', 'Aged Long Grain • Supreme Aroma'),
  'paddy': createCropSvgDataUri('Harvest Basmati Paddy', '🌾', '#FEF9C3', '#FEF08A', '#854D0E', 'Direct Farm Lot • Optimal Hulling'),
  'maize': createCropSvgDataUri('Yellow Golden Corn', '🌽', '#FEF08A', '#FDE047', '#A16207', 'Starch & Feed Grade • Mandi Certified'),
  'pulses': createCropSvgDataUri('Pulses / Dalen', '🥣', '#FEF3C7', '#FDE68A', '#78350F', 'High Protein Pulses • FAQ Grade'),
  'chana': createCropSvgDataUri('Desi Chana (JG-11)', '🥣', '#FEF3C7', '#FDE68A', '#78350F', 'Bold Whole Grain • Clean Lot'),
  'kabuli chana': createCropSvgDataUri('Kabuli Dollar Chana', '🥣', '#FEF3C7', '#FDE68A', '#78350F', 'Bold 12mm Grains • Clean Grade A+'),
  'moong': createCropSvgDataUri('Green Moong (IPM 205-7)', '🥣', '#DCFCE7', '#BBF7D0', '#166534', 'Shiny Bold Beans • Superior Quality'),
  'urad': createCropSvgDataUri('Black Urad (Pant U-31)', '🥣', '#F1F5F9', '#E2E8F0', '#334155', 'Sound Grain • Machine Cleaned'),
  'arhar': createCropSvgDataUri('Arhar/Tur (BDN-711)', '🥣', '#FEF3C7', '#FCD34D', '#B45309', 'Export & Dal Milling Quality'),
  'masoor': createCropSvgDataUri('Red Masoor (IPL-81)', '🥣', '#FEE2E2', '#FECACA', '#B91C1C', 'Clean Whole Lentil • Grade A'),
  'default_agri': createCropSvgDataUri('Verified Mandi Produce', '🌱', '#EEF3E8', '#DDE7D3', '#245C3A', 'Direct Farm Gate Lot • Verified'),
};

/**
 * Returns a guaranteed, immediate SVG Data URI fallback for approved crops
 */
export function getCropSvgFallback(crop?: string, variety?: string, category?: string): string {
  const cNorm = (crop || '').toLowerCase().trim();
  const vNorm = (variety || '').toLowerCase().trim();
  const catNorm = (category || '').toLowerCase().trim();

  // 1. Variety-level SVG check
  if (vNorm.includes('sharbati')) return EMBEDDED_CROP_SVGS['sharbati wheat'];
  if (vNorm.includes('basmati') || vNorm.includes('1121') || vNorm.includes('1509')) return EMBEDDED_CROP_SVGS['rice'];
  if (vNorm.includes('kabuli')) return EMBEDDED_CROP_SVGS['kabuli chana'];
  if (vNorm.includes('moong')) return EMBEDDED_CROP_SVGS['moong'];
  if (vNorm.includes('urad')) return EMBEDDED_CROP_SVGS['urad'];
  if (vNorm.includes('arhar') || vNorm.includes('tur')) return EMBEDDED_CROP_SVGS['arhar'];
  if (vNorm.includes('masoor')) return EMBEDDED_CROP_SVGS['masoor'];
  if (vNorm.includes('chana')) return EMBEDDED_CROP_SVGS['chana'];

  // 2. Crop-level SVG check
  if (cNorm.includes('wheat') || cNorm.includes('gehu')) return EMBEDDED_CROP_SVGS['wheat'];
  if (cNorm.includes('rice') || cNorm.includes('paddy') || cNorm.includes('dhan')) return EMBEDDED_CROP_SVGS['paddy'];
  if (cNorm.includes('maize') || cNorm.includes('corn') || cNorm.includes('makka')) return EMBEDDED_CROP_SVGS['maize'];
  if (cNorm.includes('pulse') || cNorm.includes('chana') || cNorm.includes('dal')) return EMBEDDED_CROP_SVGS['pulses'];

  // 3. Category-level SVG check
  if (catNorm.includes('grain') || catNorm.includes('cereal')) return EMBEDDED_CROP_SVGS['wheat'];
  if (catNorm.includes('pulse')) return EMBEDDED_CROP_SVGS['pulses'];

  return EMBEDDED_CROP_SVGS['default_agri'];
}

// 3. Curated high-reliability agriculture photo library strictly for approved crops
export const AGRICULTURE_CROP_IMAGES: Record<string, { primary: string; gallery: string[] }> = {
  // --- WHEAT ---
  'wheat': {
    primary: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80',
    ],
  },
  'sharbati wheat': {
    primary: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80',
    ],
  },
  'atta': {
    primary: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80',
    ],
  },
  'wheat flour': {
    primary: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
    ],
  },
  'stone-ground whole wheat atta': {
    primary: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
    ],
  },

  // --- RICE / PADDY ---
  'rice': {
    primary: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1568644396922-5c3bfae12521?w=800&auto=format&fit=crop&q=80',
    ],
  },
  'paddy': {
    primary: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
    ],
  },
  'basmati': {
    primary: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
    ],
  },

  // --- MAIZE / CORN ---
  'maize': {
    primary: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&auto=format&fit=crop&q=80',
    ],
  },
  'corn': {
    primary: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&auto=format&fit=crop&q=80',
    ],
  },

  // --- PULSES / CHANA ---
  'chana': {
    primary: '/images/crops/chana_pulses.jpg',
    gallery: [
      '/images/crops/chana_pulses.jpg',
      '/images/crops/kabuli_chana.jpg',
    ],
  },
  'desi chana': {
    primary: '/images/crops/chana_pulses.jpg',
    gallery: [
      '/images/crops/chana_pulses.jpg',
      '/images/crops/kabuli_chana.jpg',
    ],
  },
  'kabuli chana': {
    primary: '/images/crops/kabuli_chana.jpg',
    gallery: [
      '/images/crops/kabuli_chana.jpg',
      '/images/crops/chana_pulses.jpg',
    ],
  },
  'kabuli': {
    primary: '/images/crops/kabuli_chana.jpg',
    gallery: [
      '/images/crops/kabuli_chana.jpg',
      '/images/crops/chana_pulses.jpg',
    ],
  },
  'moong': {
    primary: '/images/crops/moong_pulses.jpg',
    gallery: [
      '/images/crops/moong_pulses.jpg',
      '/images/crops/chana_pulses.jpg',
    ],
  },
  'green moong': {
    primary: '/images/crops/moong_pulses.jpg',
    gallery: [
      '/images/crops/moong_pulses.jpg',
      '/images/crops/chana_pulses.jpg',
    ],
  },
  'urad': {
    primary: '/images/crops/urad_pulses.jpg',
    gallery: [
      '/images/crops/urad_pulses.jpg',
      '/images/crops/chana_pulses.jpg',
    ],
  },
  'black urad': {
    primary: '/images/crops/urad_pulses.jpg',
    gallery: [
      '/images/crops/urad_pulses.jpg',
      '/images/crops/chana_pulses.jpg',
    ],
  },
  'pulses': {
    primary: '/images/crops/chana_pulses.jpg',
    gallery: [
      '/images/crops/chana_pulses.jpg',
      '/images/crops/kabuli_chana.jpg',
      '/images/crops/moong_pulses.jpg',
      '/images/crops/urad_pulses.jpg',
    ],
  },
  'dal': {
    primary: '/images/crops/chana_pulses.jpg',
    gallery: [
      '/images/crops/chana_pulses.jpg',
      '/images/crops/moong_pulses.jpg',
    ],
  },
  'masoor': {
    primary: '/images/crops/chana_pulses.jpg',
    gallery: [
      '/images/crops/chana_pulses.jpg',
    ],
  },
  'arhar': {
    primary: '/images/crops/chana_pulses.jpg',
    gallery: [
      '/images/crops/chana_pulses.jpg',
    ],
  },
  'tur': {
    primary: '/images/crops/chana_pulses.jpg',
    gallery: [
      '/images/crops/chana_pulses.jpg',
    ],
  },
};

export const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  'Grains': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80',
  'Cereals / Grains': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80',
  'Pulses': '/images/crops/chana_pulses.jpg',
  'Pulses & Legumes': '/images/crops/chana_pulses.jpg',
  'Pulses / Chana': '/images/crops/chana_pulses.jpg',
};

export const SAFE_AGRICULTURE_FALLBACK = EMBEDDED_CROP_SVGS['default_agri'];

// Blacklisted / Unrelated Unsplash image IDs that must never be shown for crops
const BLACKLISTED_IMAGE_PATTERNS = [
  'photo-1546069901-ba9599a7e63c', // Salad / vegetable dish (Must never be used for crops)
  'photo-1530595467537-0b5996c41f2d', // Bear photo
  'photo-1546470427-0d4db154ceb7', // Ice cream / dessert
  'photo-1508746829417-e6f548d8d6ed', // Human portrait / person
  'salad',
  'vegetable-dish',
  'placeholder',
  'undefined',
  'null',
  '[object',
];

export function isUnsafeOrCorruptedUrl(url?: string): boolean {
  if (!url || typeof url !== 'string' || url.trim() === '') return true;
  const lower = url.toLowerCase().trim();
  return BLACKLISTED_IMAGE_PATTERNS.some((pattern) => lower.includes(pattern));
}

/**
 * Resolves the most accurate and reliable product image URL for an approved produce listing.
 * Follows the strict priority cascade:
 * 1. Valid user uploaded base64 / direct photo
 * 2. Variety match
 * 3. Crop match
 * 4. Category fallback
 * 5. Safe Agriculture embedded SVG fallback
 */
export function resolveProductImage(params: CropImageResolutionParams): string {
  const varietyNorm = (params.variety || '').toLowerCase().trim();
  const cropNorm = (params.crop || '').toLowerCase().trim();
  const catNorm = (params.category || '').toLowerCase().trim();

  // 1. Direct photo / valid captured image (Always highest priority)
  const candidateUrl = params.imageUrl || (params.images && params.images[0]) || (params.galleryImages && params.galleryImages[0]);
  if (candidateUrl && !isUnsafeOrCorruptedUrl(candidateUrl)) {
    return candidateUrl;
  }

  // 2. Variety-specific matches
  if (varietyNorm.includes('sharbati')) {
    return AGRICULTURE_CROP_IMAGES['sharbati wheat'].primary;
  }
  if (varietyNorm.includes('basmati') || varietyNorm.includes('1121') || varietyNorm.includes('1509')) {
    return AGRICULTURE_CROP_IMAGES['rice'].primary;
  }
  if (varietyNorm.includes('kabuli')) {
    return AGRICULTURE_CROP_IMAGES['kabuli chana'].primary;
  }
  if (varietyNorm.includes('chana') || varietyNorm.includes('bengal gram')) {
    return AGRICULTURE_CROP_IMAGES['chana'].primary;
  }
  if (varietyNorm.includes('moong')) {
    return AGRICULTURE_CROP_IMAGES['moong'].primary;
  }
  if (varietyNorm.includes('urad')) {
    return AGRICULTURE_CROP_IMAGES['urad'].primary;
  }
  if (varietyNorm.includes('arhar') || varietyNorm.includes('tur')) {
    return AGRICULTURE_CROP_IMAGES['arhar'].primary;
  }
  if (varietyNorm.includes('masoor')) {
    return AGRICULTURE_CROP_IMAGES['masoor'].primary;
  }

  // 3. Crop-level matches
  if (cropNorm.includes('wheat') || cropNorm.includes('gehu') || cropNorm.includes('atta')) {
    return AGRICULTURE_CROP_IMAGES['wheat'].primary;
  }
  if (cropNorm.includes('rice') || cropNorm.includes('paddy') || cropNorm.includes('dhan') || cropNorm.includes('chawal')) {
    return AGRICULTURE_CROP_IMAGES['rice'].primary;
  }
  if (cropNorm.includes('maize') || cropNorm.includes('corn') || cropNorm.includes('makka')) {
    return AGRICULTURE_CROP_IMAGES['maize'].primary;
  }
  if (cropNorm.includes('pulse') || cropNorm.includes('chana') || cropNorm.includes('dal')) {
    return AGRICULTURE_CROP_IMAGES['pulses'].primary;
  }

  for (const [key, val] of Object.entries(AGRICULTURE_CROP_IMAGES)) {
    if (cropNorm.includes(key) || varietyNorm.includes(key)) {
      return val.primary;
    }
  }

  // 4. Candidate URL check
  if (candidateUrl && !isUnsafeOrCorruptedUrl(candidateUrl)) {
    return candidateUrl;
  }

  // 5. Category-level agricultural image fallback
  for (const [catKey, catImg] of Object.entries(CATEGORY_FALLBACK_IMAGES)) {
    if (catNorm.includes(catKey.toLowerCase()) || cropNorm.includes(catKey.toLowerCase())) {
      return catImg;
    }
  }

  // 6. Embedded SVG fallback
  return getCropSvgFallback(params.crop, params.variety, params.category);
}

export const resolveCropImage = resolveProductImage;

/**
 * Resolves gallery images array for a produce lot with strict sanitization
 */
export function resolveCropGallery(params: CropImageResolutionParams): string[] {
  const primaryImg = resolveProductImage(params);
  
  if (params.galleryImages && params.galleryImages.length > 0) {
    const valid = params.galleryImages.filter((img) => img && !isUnsafeOrCorruptedUrl(img));
    if (valid.length > 0) {
      return valid;
    }
  }
  if (params.images && params.images.length > 0) {
    const valid = params.images.filter((img) => img && !isUnsafeOrCorruptedUrl(img));
    if (valid.length > 0) {
      return valid;
    }
  }

  const cropNorm = (params.crop || '').toLowerCase().trim();
  const varietyNorm = (params.variety || '').toLowerCase().trim();

  for (const [key, val] of Object.entries(AGRICULTURE_CROP_IMAGES)) {
    if (cropNorm.includes(key) || varietyNorm.includes(key)) {
      return val.gallery.filter((img) => !isUnsafeOrCorruptedUrl(img));
    }
  }

  return [primaryImg];
}

/**
 * Standardized image onError handler for React img elements.
 * Automatically falls back to the embedded SVG Data URI for that crop.
 */
export function handleCropImageError(
  e: SyntheticEvent<HTMLImageElement, Event>,
  crop?: string,
  variety?: string,
  category?: string
): void {
  const target = e.currentTarget;
  const fallbackSvg = getCropSvgFallback(crop, variety, category);
  if (target.src !== fallbackSvg) {
    target.src = fallbackSvg;
  }
}
