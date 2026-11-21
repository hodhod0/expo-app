import { useWindowDimensions } from 'react-native';

import { screenPadding } from '@/theme/spacing';

/** Width of the centred content column on tablets and desktop browsers. */
export const MAX_CONTENT_WIDTH = 560;

/**
 * Distance from the window edge to the content column's inner edge, so floating
 * elements (Call waiter button, View order bar) line up with the content on wide screens.
 * On phones this is just the normal 24px screen padding.
 */
export function useContentInset() {
  const { width } = useWindowDimensions();
  return Math.max(0, (width - MAX_CONTENT_WIDTH) / 2) + screenPadding;
}
