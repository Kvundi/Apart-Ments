// lib/phone.ts
// Helpers for turning user-entered Kenyan phone numbers into dialable formats.

/**
 * Normalise a phone number to E.164 (e.g. "+254712345678").
 * Handles common Kenyan input styles:
 *   0712 345 678, 712345678, 254712345678, +254 712 345 678
 * Returns null if the input can't be turned into a plausible number.
 */
export function toE164(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return null;

  let e164: string;
  if (hasPlus) {
    e164 = `+${digits}`;
  } else if (digits.startsWith("254")) {
    e164 = `+${digits}`;
  } else if (digits.startsWith("0") && digits.length === 10) {
    e164 = `+254${digits.slice(1)}`;
  } else if (digits.length === 9 && /^[17]/.test(digits)) {
    e164 = `+254${digits}`;
  } else {
    return null;
  }

  // E.164 allows at most 15 digits; anything under 8 isn't a real number.
  const len = e164.length - 1;
  return len >= 8 && len <= 15 ? e164 : null;
}

/** Human-friendly display: "+254 712 345 678" for Kenyan numbers. */
export function formatPhone(e164: string): string {
  const m = e164.match(/^\+254(\d{3})(\d{3})(\d{3})$/);
  return m ? `+254 ${m[1]} ${m[2]} ${m[3]}` : e164;
}

/** Digits-only form required by wa.me links. */
export function toWhatsAppNumber(e164: string): string {
  return e164.replace(/\D/g, "");
}
