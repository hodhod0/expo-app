import type { Dish, MainCategory } from '@/data/sample';

/**
 * Makes text comparable: lower-case, no Latin accents, no Arabic diacritics,
 * and common Arabic letter variants unified (أ إ آ → ا, ة → ه, ى → ي).
 */
export function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[ً-ٰٕـ]/g, '') // tashkeel, hamza marks (from NFD of أ إ آ), tatweel
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .trim();
}

/** A dish matches when every word of the query appears in its name, description or ingredients (either language). */
export function searchDishes(dishes: Dish[], query: string) {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  if (!words.length) return [];

  const scored = dishes
    .map((dish) => {
      const name = normalize(`${dish.name.en} ${dish.name.ar}`);
      const rest = normalize(
        [dish.description.en, dish.description.ar, ...(dish.ingredients ?? []).flatMap((i) => [i.en, i.ar])].join(' '),
      );
      if (!words.every((w) => name.includes(w) || rest.includes(w))) return null;
      // Name matches rank above description/ingredient matches.
      const score = words.reduce((s, w) => s + (name.includes(w) ? 2 : 1), 0);
      return { dish, score };
    })
    .filter((r) => r !== null);

  return scored.sort((a, b) => b.score - a.score).map((r) => r.dish);
}

export function searchCategories(categories: MainCategory[], query: string) {
  const q = normalize(query);
  if (!q) return [];
  return categories.filter((c) => normalize(`${c.title.en} ${c.title.ar}`).includes(q));
}
