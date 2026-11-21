import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { useContentInset } from '@/hooks/useContentInset';
import { useRtl } from '@/hooks/useRtl';
import { orderTotals, useOrderStore } from '@/store/useOrderStore';
import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/spacing';
import { formatPrice } from '@/utils/format';

/** Dark floating bar "4 · View order · $65.50" — only shown when the order has items. */
export function ViewOrderBar() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { row } = useRtl();
  const inset = useContentInset();
  const lines = useOrderStore((s) => s.lines);
  const { itemCount, subtotal } = orderTotals(lines);

  if (itemCount === 0) return null;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push('/order')}
      style={({ pressed }) => [
        styles.bar,
        { left: inset, right: inset, flexDirection: row, backgroundColor: colors.ink, opacity: pressed ? 0.92 : 1 },
      ]}>
      <View style={[styles.badge, { backgroundColor: colors.primary }]}>
        <AppText variant="bodySmall" weight="bold" color="onColor">
          {itemCount}
        </AppText>
      </View>
      <AppText variant="body" weight="semibold" color="surface" style={styles.label}>
        {t('category.viewOrder')}
      </AppText>
      <AppText variant="body" weight="bold" color="gold">
        {formatPrice(subtotal)}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    bottom: 16,
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
