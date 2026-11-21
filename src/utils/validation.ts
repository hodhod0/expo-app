/** Returns an i18n key for the first problem, or null when valid. */
export function validateEmail(value: string) {
  if (!value.trim()) return 'auth.errors.required';
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim()) ? null : 'auth.errors.email';
}

export function validatePassword(value: string, strict = false) {
  if (!value) return 'auth.errors.required';
  if (strict && (value.length < 8 || !/\d/.test(value))) return 'auth.errors.passwordRule';
  return null;
}

export function validateName(value: string) {
  return value.trim().length >= 2 ? null : 'auth.errors.name';
}

/** Optional: empty is fine; otherwise digits, spaces, dashes and a leading +, at least 7 digits. */
export function validatePhone(value: string) {
  if (!value.trim()) return null;
  const digits = value.replace(/\D/g, '');
  return /^\+?[\d\s-]+$/.test(value.trim()) && digits.length >= 7 ? null : 'auth.errors.phone';
}
