import type { Language } from '@/store/useSettingsStore';

/**
 * Demo data shown until the API is configured (.env EXPO_PUBLIC_COMPANY_ID).
 * Matches the content of the Figma screens.
 */
export type MainCategory = {
  id: string;
  title: Record<Language, string>;
  count: Record<Language, string>;
  /** Placeholder colour until real photos come from the API. */
  tint: string;
  imageUrl?: string;
};

export const sampleMainCategories: MainCategory[] = [
  { id: 'breakfast', title: { en: 'Breakfast', ar: 'الفطور' }, count: { en: '14 dishes', ar: '14 طبق' }, tint: '#D98A5A' },
  { id: 'mains', title: { en: 'Mains', ar: 'الأطباق الرئيسية' }, count: { en: '24 dishes', ar: '24 طبق' }, tint: '#B39A78' },
  { id: 'grills', title: { en: 'Grills', ar: 'المشاوي' }, count: { en: '12 dishes', ar: '12 طبق' }, tint: '#6F9682' },
  { id: 'desserts', title: { en: 'Desserts', ar: 'الحلويات' }, count: { en: '10 dishes', ar: '10 أطباق' }, tint: '#DDA263' },
  { id: 'drinks', title: { en: 'Drinks', ar: 'المشروبات' }, count: { en: '18 drinks', ar: '18 مشروب' }, tint: '#9C7657' },
  { id: 'salads', title: { en: 'Salads', ar: 'السلطات' }, count: { en: '8 dishes', ar: '8 أطباق' }, tint: '#CDB088' },
];

export const sampleChefPick = {
  dishId: 'lamb-ouzi',
  title: { en: 'Wood-fired\nLamb Ouzi', ar: 'أوزي لحم\nعلى الحطب' } as Record<Language, string>,
  tint: '#D98A5A',
};

export const restaurantName: Record<Language, string> = {
  en: 'Olive & Ember',
  ar: 'زيتون وجمر',
};
