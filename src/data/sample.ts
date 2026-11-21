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

export type Localized = Record<Language, string>;

export type SubCategory = { id: string; title: Localized };

export type Dish = {
  id: string;
  mainCategoryId: string;
  subCategoryId: string;
  name: Localized;
  description: Localized;
  price: number;
  prepMinutes: number;
  calories?: number;
  rating?: number;
  reviews?: number;
  allergens: string[];
  ingredients?: Localized[];
  tags?: ('chefsPick' | 'spicy' | 'vegetarian')[];
  tint: string;
  imageUrl?: string;
};

export const sampleSubCategories: Record<string, SubCategory[]> = {
  mains: [
    { id: 'grills', title: { en: 'Grills', ar: 'مشاوي' } },
    { id: 'rice', title: { en: 'Rice dishes', ar: 'أطباق الأرز' } },
    { id: 'seafood', title: { en: 'Seafood', ar: 'مأكولات بحرية' } },
    { id: 'burgers', title: { en: 'Burgers', ar: 'برغر' } },
  ],
};

export const sampleDishes: Dish[] = [
  {
    id: 'mixed-grill',
    mainCategoryId: 'mains',
    subCategoryId: 'grills',
    name: { en: 'Mixed Grill Platter', ar: 'طبق مشاوي مشكّل' },
    description: {
      en: 'Shish taouk, kafta and lamb skewers with garlic sauce',
      ar: 'شيش طاووق وكفتة وأسياخ لحم مع صلصة الثوم',
    },
    price: 22,
    prepMinutes: 25,
    calories: 820,
    rating: 4.7,
    reviews: 98,
    allergens: [],
    tags: ['spicy'],
    ingredients: [
      { en: 'Chicken', ar: 'دجاج' },
      { en: 'Kafta', ar: 'كفتة' },
      { en: 'Lamb', ar: 'لحم غنم' },
      { en: 'Garlic sauce', ar: 'ثومية' },
    ],
    tint: '#DDA263',
  },
  {
    id: 'lamb-ouzi',
    mainCategoryId: 'mains',
    subCategoryId: 'rice',
    name: { en: 'Lamb Ouzi', ar: 'أوزي لحم' },
    description: {
      en: 'Slow-roasted lamb over spiced rice with toasted nuts',
      ar: 'لحم مشوي ببطء على أرز متبّل مع مكسرات محمّصة',
    },
    price: 18.5,
    prepMinutes: 30,
    calories: 640,
    rating: 4.8,
    reviews: 126,
    allergens: ['nuts', 'dairy'],
    tags: ['chefsPick', 'spicy'],
    ingredients: [
      { en: 'Lamb shoulder', ar: 'كتف خروف' },
      { en: 'Basmati rice', ar: 'أرز بسمتي' },
      { en: 'Almonds', ar: 'لوز' },
      { en: 'Pine nuts', ar: 'صنوبر' },
      { en: 'Seven spices', ar: 'سبع بهارات' },
      { en: 'Yogurt', ar: 'لبن' },
    ],
    tint: '#D98A5A',
  },
  {
    id: 'sea-bass',
    mainCategoryId: 'mains',
    subCategoryId: 'seafood',
    name: { en: 'Grilled Sea Bass', ar: 'سمك قاروص مشوي' },
    description: {
      en: 'Whole fish with lemon, fresh herbs and tahini sauce',
      ar: 'سمكة كاملة مع الليمون والأعشاب الطازجة وصلصة الطحينة',
    },
    price: 24,
    prepMinutes: 20,
    calories: 520,
    rating: 4.6,
    reviews: 74,
    allergens: ['fish', 'sesame'],
    tint: '#6F9682',
  },
  {
    id: 'shawarma-plate',
    mainCategoryId: 'mains',
    subCategoryId: 'grills',
    name: { en: 'Chicken Shawarma Plate', ar: 'صحن شاورما دجاج' },
    description: {
      en: 'Marinated chicken, fries, pickles and toum',
      ar: 'دجاج متبّل مع بطاطا مقلية ومخلل وثومية',
    },
    price: 12.5,
    prepMinutes: 15,
    calories: 780,
    rating: 4.5,
    reviews: 210,
    allergens: [],
    tint: '#CDB088',
  },
  {
    id: 'beef-burger',
    mainCategoryId: 'mains',
    subCategoryId: 'burgers',
    name: { en: 'Smoked Beef Burger', ar: 'برغر لحم مدخّن' },
    description: {
      en: 'Aged beef, cheddar, caramelised onion, brioche bun',
      ar: 'لحم معتّق وجبنة شيدر وبصل مكرمل وخبز بريوش',
    },
    price: 13,
    prepMinutes: 15,
    calories: 910,
    rating: 4.4,
    reviews: 152,
    allergens: ['gluten', 'dairy', 'eggs'],
    tint: '#9C7657',
  },
];

/** Demo helper: dishes for a category (falls back to all sample dishes). */
export function getSampleDishes(mainCategoryId: string) {
  const list = sampleDishes.filter((d) => d.mainCategoryId === mainCategoryId);
  return list.length ? list : sampleDishes;
}

export function getSampleDish(id: string) {
  return sampleDishes.find((d) => d.id === id);
}

export const restaurantName: Record<Language, string> = {
  en: 'Olive & Ember',
  ar: 'زيتون وجمر',
};

/** Display names for allergen keys. */
export const allergenNames: Record<string, Localized> = {
  nuts: { en: 'nuts', ar: 'المكسرات' },
  dairy: { en: 'dairy', ar: 'الألبان' },
  gluten: { en: 'gluten', ar: 'الغلوتين' },
  eggs: { en: 'eggs', ar: 'البيض' },
  fish: { en: 'fish', ar: 'السمك' },
  shellfish: { en: 'shellfish', ar: 'المحار' },
  sesame: { en: 'sesame', ar: 'السمسم' },
};
