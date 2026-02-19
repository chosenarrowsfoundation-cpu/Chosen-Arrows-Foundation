/**
 * Normalize phone for tel: links (E.164-style).
 * Strips spaces/dashes; if number looks like Kenyan local (e.g. 0798 213 309), prepends +254.
 */
export function formatPhoneForTel(phone: string | undefined | null): string {
  if (!phone || typeof phone !== 'string') return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 9 && digits.startsWith('7')) return `+254${digits}`;
  if (digits.length === 10 && digits.startsWith('0')) return `+254${digits.slice(1)}`;
  if (digits.length >= 9 && !phone.trim().startsWith('+')) return `+254${digits.slice(-9)}`;
  return phone.trim().startsWith('+') ? phone.replace(/\s+/g, '') : `+${digits}`;
}

/**
 * Display-friendly format (e.g. +254 798 213 309 or keep as-is if already readable).
 */
export function formatPhoneDisplay(phone: string | undefined | null): string {
  if (!phone || typeof phone !== 'string') return '';
  const tel = formatPhoneForTel(phone);
  if (tel.startsWith('+254') && tel.length === 13) return `${tel.slice(0, 4)} ${tel.slice(4, 7)} ${tel.slice(7, 10)} ${tel.slice(10)}`;
  return phone;
}
