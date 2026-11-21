import { createContext, useContext, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import { useSettingsStore } from '@/store/useSettingsStore';

import { darkColors, lightColors, type ColorTokens } from './colors';
import { fontFamilies } from './typography';

type Theme = {
  scheme: 'light' | 'dark';
  colors: ColorTokens;
  fonts: (typeof fontFamilies)['latin'];
  isRTL: boolean;
};

const ThemeContext = createContext<Theme | null>(null);

/** Resolves Light / Dark / System and the current language into one theme object. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const preference = useSettingsStore((s) => s.theme);
  const language = useSettingsStore((s) => s.language);

  const scheme = preference === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : preference;
  const isRTL = language === 'ar';

  const theme: Theme = {
    scheme,
    colors: scheme === 'dark' ? darkColors : lightColors,
    fonts: fontFamilies[isRTL ? 'arabic' : 'latin'],
    isRTL,
  };

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error('useTheme must be used inside <ThemeProvider>');
  return theme;
}
