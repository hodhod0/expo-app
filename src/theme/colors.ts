/**
 * Colour tokens — same names and values as the Figma variables
 * ("Digital Menu" = light, "Digital Menu · Dark" = dark).
 */
export const lightColors = {
  bg: '#F7F3EC',
  surface: '#FFFFFF',
  ink: '#1E1B16',
  muted: '#857C70',
  line: '#ECE5DA',
  primary: '#C8502A',
  primarySoft: '#F7E4D9',
  accent: '#2E4A3B',
  accentSoft: '#E2EBE4',
  /** Text/icons drawn on `accent` or `accentSoft` backgrounds. */
  accentText: '#2E4A3B',
  gold: '#E8B04B',
  /** Text/icons on primary or accent fills — white in both themes. */
  onColor: '#FFFFFF',
  scrim: '#14110E',
} as const;

export type ColorTokens = { [K in keyof typeof lightColors]: string };

export const darkColors: ColorTokens = {
  bg: '#141210',
  surface: '#211D19',
  ink: '#F3EEE6',
  muted: '#A89F92',
  line: '#332E28',
  primary: '#E2693E',
  primarySoft: '#3B241A',
  accent: '#2C4638',
  accentSoft: '#1E2D25',
  accentText: '#9CC9AF',
  gold: '#EDB955',
  onColor: '#FFFFFF',
  scrim: '#000000',
};
