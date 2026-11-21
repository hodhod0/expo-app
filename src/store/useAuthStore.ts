import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { User } from '@/api/auth';

type AuthState = {
  /** Signed-in guest, or null when browsing as a guest. Passwords are never stored. */
  user: User | null;
  setUser: (user: User | null) => void;
  signOut: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      signOut: () => set({ user: null }),
    }),
    { name: 'auth', storage: createJSONStorage(() => AsyncStorage) },
  ),
);
