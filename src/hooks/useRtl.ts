import { useTheme } from '@/theme/ThemeProvider';

/** Layout helpers that mirror automatically for Arabic. */
export function useRtl() {
  const { isRTL } = useTheme();
  return {
    isRTL,
    row: (isRTL ? 'row-reverse' : 'row') as 'row' | 'row-reverse',
    start: (isRTL ? 'flex-end' : 'flex-start') as 'flex-start' | 'flex-end',
    end: (isRTL ? 'flex-start' : 'flex-end') as 'flex-start' | 'flex-end',
  };
}
