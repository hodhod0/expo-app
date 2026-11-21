import type { OpeningHours } from '@/data/restaurant';

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

/**
 * Is the restaurant open at `now`? Handles closing after midnight
 * (e.g. Fri 12:00–00:30 is still open at 00:15 on Saturday).
 * Returns the closing time when open.
 */
export function openStatus(hours: OpeningHours[], now = new Date()): { open: boolean; closesAt?: string } {
  const day = now.getDay();
  const minutes = now.getHours() * 60 + now.getMinutes();

  const today = hours[day];
  if (today) {
    const open = toMinutes(today.open);
    const close = toMinutes(today.close);
    const overnight = close <= open;
    if (minutes >= open && (overnight || minutes < close)) return { open: true, closesAt: today.close };
  }

  // Still inside yesterday's after-midnight hours?
  const yesterday = hours[(day + 6) % 7];
  if (yesterday) {
    const open = toMinutes(yesterday.open);
    const close = toMinutes(yesterday.close);
    if (close <= open && minutes < close) return { open: true, closesAt: yesterday.close };
  }

  return { open: false };
}

/** Groups consecutive days with the same hours: [{ from: 1, to: 4, hours }, …] (Monday first). */
export function groupHours(hours: OpeningHours[]) {
  const order = [1, 2, 3, 4, 5, 6, 0];
  const groups: { days: number[]; hours: OpeningHours }[] = [];
  for (const day of order) {
    const h = hours[day];
    const last = groups[groups.length - 1];
    if (last && JSON.stringify(last.hours) === JSON.stringify(h)) last.days.push(day);
    else groups.push({ days: [day], hours: h });
  }
  return groups;
}
