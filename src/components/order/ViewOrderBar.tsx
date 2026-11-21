import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import Animated, { SlideInDown, SlideOutDown, ZoomIn } from 'react-native-reanimated';

import { AppText } from '@/components/ui/AppText';
import { PressableScale } from '@/components/ui/PressableScale';
import { useContentInset } from '@/hooks/useContentInset';
import { useRtl } from '@/hooks/useRtl';
import { orderTotals, useOrderStore } from '@/store/useOrderStore';
import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/spacing';
import { formatPrice } from '@/utils/format';

/**
 * Dark floating bar "4 · View order · $65.50" — slides up when the order gets its
 * first dish and away when it is emptied; the count badge pops on every change.
 */
export function ViewOrderBar() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { row } = useRtl();
  const inset = useContentInset();
  const lines = useOrderStore((s) => s.lines);
  const { itemCount, subtotal } = orderTotals(lines);

  if (itemCount === 0) return null;

  return (
    <Animated.View
      entering={SlideInDown.springify().damping(18)}
      exiting={SlideOutDown.duration(200)}
      style={[styles.wrap, { left: inset, right: inset }]}>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={`${t('category.viewOrder')}, ${itemCount}, ${formatPrice(subtotal)}`}
        onPress={() => router.push('/order')}
        style={[styles.bar, { flexDirection: row, backgroundColor: colors.ink }]}>
        <Animated.View
          key={itemCount}
          entering={ZoomIn.springify().damping(10)}
          style={[styles.badge, { backgroundColor: colors.primary }]}>
          <AppText variant="bodySmall" weight="bold" color="onColor">
            {itemCount}
          </AppText>
        </Animated.View>
        <AppText variant="body" weight="semibold" color="surface" style={styles.label}>
          {t('category.viewOrder')}
        </AppText>
        <AppText variant="body" weight="bold" color="gold">
          {formatPrice(subtotal)}
        </AppText>
      </PressableScale>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', bottom: 16 },
  bar: {
    height: 56,
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    borderRadius: radius.lg - 2,
    boxShadow: '0 8px 20px rgba(30, 25, 20, 0.25)',
  },
  badge: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  label: { flex: 1 },
});
