import crypto from 'crypto';

// ============================================================================
// INDIAN PHONE NUMBER NORMALIZATION & VALIDATION (E.164)
// ============================================================================

export interface PhoneValidationResult {
  isValid: boolean;
  normalized: string; // e.g. "+919876543210"
  displayPhone: string; // e.g. "+91 98765 43210"
  error?: string;
}

/**
 * Normalizes Indian mobile numbers to standard E.164 (+91XXXXXXXXXX)
 */
export function normalizeIndianPhoneNumber(rawPhone: string): PhoneValidationResult {
  if (!rawPhone || typeof rawPhone !== 'string') {
    return {
      isValid: false,
      normalized: '',
      displayPhone: '',
      error: 'Phone number is required.',
    };
  }

  // Remove whitespace, dashes, parens, dots
  let cleaned = rawPhone.replace(/[\s\-\(\)\.]/g, '').trim();

  // Strip leading '+'
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.slice(1);
  }

  // Handle leading '91' (country code without plus)
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    cleaned = cleaned.slice(2);
  }

  // Handle leading '0'
  if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = cleaned.slice(1);
  }

  // Check if exactly 10 digits
  if (!/^\d{10}$/.test(cleaned)) {
    return {
      isValid: false,
      normalized: '',
      displayPhone: '',
      error: 'Please enter a valid 10-digit mobile number.',
    };
  }

  // Validate standard Indian mobile prefix (starts with 6, 7, 8, 9)
  const firstDigit = cleaned[0];
  if (!['6', '7', '8', '9'].includes(firstDigit)) {
    return {
      isValid: false,
      normalized: '',
      displayPhone: '',
      error: 'Invalid mobile number. Indian mobile numbers start with 6, 7, 8, or 9.',
    };
  }

  const normalized = `+91${cleaned}`;
  const displayPhone = `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;

  return {
    isValid: true,
    normalized,
    displayPhone,
  };
}

/**
 * Masks a phone number for display (e.g. +91 ••••• ••210)
 */
export function maskPhoneNumber(phone: string): string {
  const norm = normalizeIndianPhoneNumber(phone);
  if (!norm.isValid) return phone;
  const digits = norm.normalized.replace('+91', '');
  return `+91 ••••• ••${digits.slice(-3)}`;
}

