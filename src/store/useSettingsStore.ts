import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type ThemePreference = 'system' | 'light' | 'dark';
export type Language = 'en' | 'ar';

type SettingsState = {
  theme: ThemePreference;
  language: Language;
  /** Table number from the QR scan or manual entry; null = browsing without a table. */
  tableNumber: string | null;
  /** Allergens the guest wants to avoid (e.g. "nuts", "dairy"). */
  allergies: string[];
  hasSeenOnboarding: boolean;
  setTheme: (theme: ThemePreference) => void;
  setLanguage: (language: Language) => void;
  setTableNumber: (table: string | null) => void;
  toggleAllergy: (allergen: string) => void;
  clearAllergies: () => void;
  completeOnboarding: () => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      language: 'en',
      tableNumber: null,
      allergies: [],
      hasSeenOnboarding: false,
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setTableNumber: (tableNumber) => set({ tableNumber }),
      toggleAllergy: (allergen) =>
        set((s) => ({
          allergies: s.allergies.includes(allergen)
            ? s.allergies.filter((a) => a !== allergen)
            : [...s.allergies, allergen],
        })),
      clearAllergies: () => set({ allergies: [] }),
      completeOnboarding: () => set({ hasSeenOnboarding: true }),
    }),
    { name: 'settings', storage: createJSONStorage(() => AsyncStorage) },
  ),
);
