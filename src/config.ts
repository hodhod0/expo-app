/**
 * App-wide settings read from `.env` (EXPO_PUBLIC_* variables are bundled into the app).
 *
 * On a real phone, `localhost` points at the phone itself — use your PC's
 * local network IP instead, e.g. http://192.168.1.20:9002/bomain/
 */
export const config = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:9002/bomain/',
  /** Restaurant (company) id — `cp_id` in the backend. */
  companyId: process.env.EXPO_PUBLIC_COMPANY_ID ?? '',
} as const;
