import type { Dish } from '@/data/sample';
import type { Diet, PriceRange, SortOption, SpiceLevel } from '@/store/useFilterStore';

const SPICE_VALUE: Record<SpiceLevel, number> = { any: -1, mild: 1, medium: 2, hot: 3 };

function inPriceRange(price: number, range: PriceRange) {
  switch (range) {
    case 'under10':
      return price < 10;
    case '10to20':
      return price >= 10 && price <= 20;
    case 'over20':
      return price > 20;
    default:
      return true;
  }
}

/** Applies the Filters sheet choices: every selected diet must match, spice must equal the chosen level. */
export function filterDishes(
  dishes: Dish[],
  f: { diets: Diet[]; spice: SpiceLevel; price: PriceRange; sort: SortOption },
) {
  const result = dishes.filter(
    (d) =>
      f.diets.every((diet) => d.diets?.includes(diet)) &&
      (f.spice === 'any' || (d.spice ?? 0) === SPICE_VALUE[f.spice]) &&
      inPriceRange(d.price, f.price),
  );

  if (f.sort === 'priceLow') return [...result].sort((a, b) => a.price - b.price);
  if (f.sort === 'priceHigh') return [...result].sort((a, b) => b.price - a.price);
  return [...result].sort((a, b) => (b.reviews ?? 0) - (a.reviews ?? 0));
}
