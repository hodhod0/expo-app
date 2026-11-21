import { create } from 'zustand';

export const DIETS = ['vegetarian', 'vegan', 'glutenFree', 'halal', 'dairyFree'] as const;
export const ALLERGENS = ['nuts', 'dairy', 'gluten', 'eggs', 'shellfish', 'sesame', 'fish'] as const;
export const SPICE_LEVELS = ['any', 'mild', 'medium', 'hot'] as const;
export const PRICE_RANGES = ['any', 'under10', '10to20', 'over20'] as const;
export const SORTS = ['popular', 'priceLow', 'priceHigh'] as const;

export type Diet = (typeof DIETS)[number];
export type SpiceLevel = (typeof SPICE_LEVELS)[number];
export type PriceRange = (typeof PRICE_RANGES)[number];
export type SortOption = (typeof SORTS)[number];

type FilterState = {
  diets: Diet[];
  spice: SpiceLevel;
  price: PriceRange;
  sort: SortOption;
  toggleDiet: (diet: Diet) => void;
  setSpice: (spice: SpiceLevel) => void;
  setPrice: (price: PriceRange) => void;
  setSort: (sort: SortOption) => void;
  reset: () => void;
};

const initial = { diets: [] as Diet[], spice: 'any' as SpiceLevel, price: 'any' as PriceRange, sort: 'popular' as SortOption };

/** Menu filters for this visit (not saved). Allergies live in the settings store because they are saved. */
export const useFilterStore = create<FilterState>()((set) => ({
  ...initial,
  toggleDiet: (diet) =>
    set((s) => ({ diets: s.diets.includes(diet) ? s.diets.filter((d) => d !== diet) : [...s.diets, diet] })),
  setSpice: (spice) => set({ spice }),
  setPrice: (price) => set({ price }),
  setSort: (sort) => set({ sort }),
  reset: () => set(initial),
}));

export function activeFilterCount(s: Pick<FilterState, 'diets' | 'spice' | 'price' | 'sort'>) {
  return s.diets.length + (s.spice !== 'any' ? 1 : 0) + (s.price !== 'any' ? 1 : 0) + (s.sort !== 'popular' ? 1 : 0);
}
