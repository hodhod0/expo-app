import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type FavouritesState = {
  ids: string[];
  toggle: (itemId: string) => void;
  isFavourite: (itemId: string) => boolean;
};

export const useFavouritesStore = create<FavouritesState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (itemId) =>
        set((s) => ({
          ids: s.ids.includes(itemId) ? s.ids.filter((id) => id !== itemId) : [...s.ids, itemId],
        })),
      isFavourite: (itemId) => get().ids.includes(itemId),
    }),
    {
      name: 'favourites',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ ids: s.ids }),
    },
  ),
);
