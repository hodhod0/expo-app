import type { Localized } from './sample';

/**
 * Restaurant details for the Info tab — demo values from the Figma design.
 * TODO: load from the API (dm_company/selcompany) once configured.
 */
export type OpeningHours = { open: string; close: string } | null; // null = closed that day

export const restaurant = {
  cuisine: { en: 'Lebanese grill & kitchen', ar: 'مطبخ ومشاوي لبنانية' } as Localized,
  phone: '+15550123456',
  whatsapp: '15550123456',
  address: { en: '12 Olive Street, City Centre', ar: '12 شارع الزيتون، وسط المدينة' } as Localized,
  addressNote: { en: 'Free parking behind the restaurant', ar: 'موقف مجاني خلف المطعم' } as Localized,
  coordinates: { lat: 33.8938, lng: 35.5018 },
  wifi: { network: 'OliveEmber_Guest' },
  /** Index 0 = Sunday … 6 = Saturday. A close time earlier than open means after midnight. */
  hours: [
    { open: '13:00', close: '22:00' },
    { open: '12:00', close: '23:00' },
    { open: '12:00', close: '23:00' },
    { open: '12:00', close: '23:00' },
    { open: '12:00', close: '23:00' },
    { open: '12:00', close: '00:30' },
    { open: '12:00', close: '00:30' },
  ] as OpeningHours[],
};
