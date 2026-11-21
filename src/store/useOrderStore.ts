import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type OrderLine = {
  itemId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  note?: string;
  imageUrl?: string;
  /** Placeholder colour when there is no photo. */
  tint?: string;
};

type OrderState = {
  lines: OrderLine[];
  add: (line: Omit<OrderLine, 'quantity'>, quantity?: number) => void;
  setQuantity: (itemId: string, quantity: number) => void;
  setNote: (itemId: string, note: string) => void;
  clear: () => void;
};

/** Guest's order list — shown to the waiter, no payment in the app. */
export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      lines: [],
      add: (line, quantity = 1) =>
        set((s) => {
          const existing = s.lines.find((l) => l.itemId === line.itemId);
          if (existing) {
            return {
              lines: s.lines.map((l) =>
                l.itemId === line.itemId ? { ...l, quantity: l.quantity + quantity } : l,
              ),
            };
          }
          return { lines: [...s.lines, { ...line, quantity }] };
        }),
      setQuantity: (itemId, quantity) =>
        set((s) => ({
          lines:
            quantity <= 0
              ? s.lines.filter((l) => l.itemId !== itemId)
              : s.lines.map((l) => (l.itemId === itemId ? { ...l, quantity } : l)),
        })),
      setNote: (itemId, note) =>
        set((s) => ({ lines: s.lines.map((l) => (l.itemId === itemId ? { ...l, note } : l)) })),
      clear: () => set({ lines: [] }),
    }),
    { name: 'order', storage: createJSONStorage(() => AsyncStorage) },
  ),
);

export const SERVICE_RATE = 0.1;

export function orderTotals(lines: OrderLine[]) {
  const itemCount = lines.reduce((n, l) => n + l.quantity, 0);
  const subtotal = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
  const service = subtotal * SERVICE_RATE;
  return { itemCount, subtotal, service, total: subtotal + service };
}
