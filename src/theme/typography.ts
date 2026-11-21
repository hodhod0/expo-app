import {
  Cairo_400Regular,
  Cairo_500Medium,
  Cairo_600SemiBold,
  Cairo_700Bold,
} from '@expo-google-fonts/cairo';
import { Fraunces_600SemiBold } from '@expo-google-fonts/fraunces';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { ReemKufi_700Bold } from '@expo-google-fonts/reem-kufi';

/** Passed to `useFonts` in the root layout. */
export const fontAssets = {
  Fraunces_600SemiBold,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  Cairo_400Regular,
  Cairo_500Medium,
  Cairo_600SemiBold,
  Cairo_700Bold,
  ReemKufi_700Bold,
};

export type FontWeightName = 'regular' | 'medium' | 'semibold' | 'bold' | 'display';

/** Latin uses Plus Jakarta Sans + Fraunces; Arabic uses Cairo + Reem Kufi. */
export const fontFamilies: Record<'latin' | 'arabic', Record<FontWeightName, string>> = {
  latin: {
    regular: 'PlusJakartaSans_400Regular',
    medium: 'PlusJakartaSans_500Medium',
    semibold: 'PlusJakartaSans_600SemiBold',
    bold: 'PlusJakartaSans_700Bold',
    display: 'Fraunces_600SemiBold',
  },
  arabic: {
    regular: 'Cairo_400Regular',
    medium: 'Cairo_500Medium',
    semibold: 'Cairo_600SemiBold',
    bold: 'Cairo_700Bold',
    display: 'ReemKufi_700Bold',
  },
};

/** Text sizes from the Figma screens. */
export const textVariants = {
  display: { fontSize: 28, weight: 'display' },
  title: { fontSize: 24, weight: 'display' },
  heading: { fontSize: 18, weight: 'semibold' },
  subheading: { fontSize: 16, weight: 'semibold' },
  body: { fontSize: 15, weight: 'regular' },
  bodySmall: { fontSize: 14, weight: 'regular' },
  caption: { fontSize: 13, weight: 'medium' },
  tiny: { fontSize: 11, weight: 'medium' },
} as const satisfies Record<string, { fontSize: number; weight: FontWeightName }>;

export type TextVariant = keyof typeof textVariants;
