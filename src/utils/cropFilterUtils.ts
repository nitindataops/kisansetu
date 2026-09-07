import { FARMER_APPROVED_CROPS, getApprovedCropVarieties } from '../data/cropVarieties';
import { MarketplaceProduct } from '../types/buyer';

export interface FilterCropOption {
  id: string;
  name: string;
  nameHi: string;
  icon: string;
}

export interface FilterVarietyOption {
  id: string;
  name: string;
  nameHi: string;
}

/**
 * Checks if a crop belongs to the 4 authoritative approved active marketplace crops:
 * 1. Wheat
 * 2. Rice / Paddy
 * 3. Maize
 * 4. Pulses / Chana
 */
export function isApprovedCrop(cropName?: string): boolean {
  if (!cropName) return false;
  const lower = cropName.toLowerCase().trim();
  if (lower.includes('wheat') || lower.includes('gehu') || lower.includes('gehun')) return true;
  if (lower.includes('rice') || lower.includes('paddy') || lower.includes('dhan') || lower.includes('chawal') || lower.includes('basmati')) return true;
  if (lower.includes('maize') || lower.includes('corn') || lower.includes('makka')) return true;
  if (lower.includes('pulse') || lower.includes('chana') || lower.includes('dal') || lower.includes('masoor') || lower.includes('arhar') || lower.includes('tur') || lower.includes('moong') || lower.includes('urad') || lower.includes('gram')) return true;
  return false;
}

/**
 * Authoritative 4-crop registry for Buyer filters matching Farmer registry.
 * Strictly: Wheat, Rice / Paddy, Maize, Pulses / Chana.
 */
export function getAvailableFilterCrops(_products?: MarketplaceProduct[]): FilterCropOption[] {
  return FARMER_APPROVED_CROPS.map((ac) => ({
    id: ac.name,
    name: ac.name,
    nameHi: ac.nameHi,
    icon: ac.icon,
  }));
}

/**
 * Strictly returns only the verified varieties for the selected approved crop.
 */
export function getVarietiesForCrop(cropName: string, _products?: MarketplaceProduct[]): FilterVarietyOption[] {
  if (!cropName || !cropName.trim()) {
    return [];
  }

  const approvedVarieties = getApprovedCropVarieties(cropName);
  if (!approvedVarieties || approvedVarieties.length === 0) {
    return [];
  }

  return approvedVarieties
    .filter((v) => v.id !== 'other')
    .map((v) => ({
      id: v.name,
      name: v.name,
      nameHi: v.nameHi,
    }));
}

/**
 * Check if a product matches crop and variety filters, enforcing the 4-crop active scope
 */
export function matchesCropAndVariety(
  product: MarketplaceProduct,
  selectedCrop: string,
  selectedVariety: string
): boolean {
  // Ensure product belongs to approved 4 active crops
  if (!isApprovedCrop(product.crop)) {
    return false;
  }

  if (selectedCrop && selectedCrop.trim()) {
    const prodCrop = (product.crop || '').toLowerCase().trim();
    const selCrop = selectedCrop.toLowerCase().trim();

    // Matching logic for Wheat, Rice/Paddy, Maize, Pulses/Chana
    const isWheatMatch =
      (selCrop.includes('wheat') || selCrop.includes('gehu')) &&
      (prodCrop.includes('wheat') || prodCrop.includes('gehu') || prodCrop.includes('atta'));

    const isRiceMatch =
      (selCrop.includes('rice') || selCrop.includes('paddy') || selCrop.includes('dhan')) &&
      (prodCrop.includes('rice') || prodCrop.includes('paddy') || prodCrop.includes('dhan') || prodCrop.includes('basmati'));

    const isMaizeMatch =
      (selCrop.includes('maize') || selCrop.includes('corn') || selCrop.includes('makka')) &&
      (prodCrop.includes('maize') || prodCrop.includes('corn') || prodCrop.includes('makka'));

    const isPulsesMatch =
      (selCrop.includes('pulse') || selCrop.includes('chana') || selCrop.includes('dal')) &&
      (prodCrop.includes('pulse') || prodCrop.includes('chana') || prodCrop.includes('dal') || prodCrop.includes('gram') || prodCrop.includes('masoor') || prodCrop.includes('arhar') || prodCrop.includes('moong') || prodCrop.includes('urad'));

    const directMatch = prodCrop.includes(selCrop) || selCrop.includes(prodCrop);

    if (!isWheatMatch && !isRiceMatch && !isMaizeMatch && !isPulsesMatch && !directMatch) {
      return false;
    }
  }

  if (selectedVariety && selectedVariety.trim()) {
    const prodVariety = (product.variety || '').toLowerCase().trim();
    const selVariety = selectedVariety.toLowerCase().trim();
    if (!prodVariety.includes(selVariety) && !selVariety.includes(prodVariety)) {
      return false;
    }
  }

  return true;
}
