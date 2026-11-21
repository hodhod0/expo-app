import { router } from 'expo-router';
import { Info, Plus, ShoppingBag, Utensils } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TopBar } from '@/components/layout/TopBar';
import { OrderItem } from '@/components/order/OrderItem';
import { OrderSummary } from '@/components/order/OrderSummary';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { useRtl } from '@/hooks/useRtl';
import { orderTotals, useOrderStore, type OrderLine } from '@/store/useOrderStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, screenPadding } from '@/theme/spacing';
import { formatPrice } from '@/utils/format';

/** 10 · My Order — the guest's list to show the waiter (no payment in the app). */
export default function OrderScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { row, start } = useRtl();
  const insets = useSafeAreaInsets();
  const lines = useOrderStore((s) => s.lines);
  const clear = useOrderStore((s) => s.clear);
  const table = useSettingsStore((s) => s.tableNumber);
  const [confirmClear, setConfirmClear] = useState(false);
  const [showWaiter, setShowWaiter] = useState(false);
  const totals = orderTotals(lines);

  // "Clear" needs a second tap within 3 seconds, so a stray tap can't wipe the order.
  useEffect(() => {
    if (!confirmClear) return;
    const timer = setTimeout(() => setConfirmClear(false), 3000);
    return () => clearTimeout(timer);
  }, [confirmClear]);

  const onClear = () => {
    if (confirmClear) {
      clear();
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
    }
  };

  if (showWaiter && lines.length > 0) {
    return <WaiterView lines={lines} table={table} total={totals.total} onClose={() => setShowWaiter(false)} />;
  }

  if (lines.length === 0) {
    return (
      <Screen contentStyle={styles.content}>
        <TopBar title={t('order.title')} />
        <View style={styles.empty}>
          <View style={[styles.emptyIcon, { backgroundColor: colors.primarySoft }]}>
            <ShoppingBag size={32} color={colors.primary} />
          </View>
          <AppText variant="title" style={styles.center}>
            {t('order.emptyTitle')}
          </AppText>
          <AppText color="muted" style={styles.center}>
            {t('order.emptyText')}
          </AppText>
          <Button label={t('order.browse')} onPress={() => router.replace('/')} style={styles.emptyButton} />
        </View>
      </Screen>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <Screen contentStyle={[styles.content, { paddingBottom: 0 }]}>
        <TopBar
          title={t('order.title')}
          textAction={{ label: confirmClear ? t('order.clearConfirm') : t('order.clear'), onPress: onClear }}
        />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 150 + insets.bottom }]}
          showsVerticalScrollIndicator={false}>
          <View style={{ alignItems: start }}>
            <View style={[styles.tableChip, { flexDirection: row, backgroundColor: colors.accentSoft }]}>
              <Utensils size={14} color={colors.accentText} />
              <AppText variant="caption" weight="semibold" color="accentText">
                {(table ? t('order.table', { number: table }) : t('order.noTable')) +
                  ' · ' +
                  t('order.itemCount', { count: totals.itemCount })}
              </AppText>
            </View>
          </View>

          {lines.map((line) => (
            <OrderItem key={line.itemId} line={line} />
          ))}

          <Pressable
            accessibilityRole="button"
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
            style={[styles.addMore, { flexDirection: row, borderColor: colors.primary }]}>
            <Plus size={18} color={colors.primary} />
            <AppText variant="bodySmall" weight="semibold" color="primary">
              {t('order.addMore')}
            </AppText>
          </Pressable>

          <OrderSummary subtotal={totals.subtotal} service={totals.service} total={totals.total} />
        </ScrollView>
      </Screen>

      <View
        style={[
          styles.bottomBar,
          { paddingBottom: 14 + insets.bottom, backgroundColor: colors.surface, borderTopColor: colors.line },
        ]}>
        <Button label={t('order.showWaiter')} onPress={() => setShowWaiter(true)} style={styles.fullWidth} />
        <View style={[styles.note, { flexDirection: row }]}>
          <Info size={14} color={colors.muted} />
          <AppText variant="caption" weight="regular" color="muted" style={{ fontSize: 12 }}>
            {t('order.noPayment')}
          </AppText>
        </View>
      </View>
    </View>
  );
}

/** Large, high-contrast list for the waiter to read at the table. */
function WaiterView({
  lines,
  table,
  total,
  onClose,
}: {
  lines: OrderLine[];
  table: string | null;
  total: number;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { row, start } = useRtl();

  return (
    <Screen scroll contentStyle={styles.content}>
      <AppText variant="caption" color="muted">
        {t('order.waiterTitle')}
      </AppText>
      <AppText variant="display" style={{ fontSize: 40 }}>
        {table ? t('order.table', { number: table }) : t('order.noTable')}
      </AppText>
      <View style={[styles.waiterCard, { backgroundColor: colors.surface }]}>
        {lines.map((l) => (
          <View key={l.itemId} style={{ alignItems: start, gap: 2 }}>
            <View style={[styles.waiterLine, { flexDirection: row }]}>
              <AppText variant="heading" color="primary">
                {l.quantity} ×
              </AppText>
              <AppText variant="heading" style={styles.waiterName}>
                {l.name}
              </AppText>
            </View>
            {l.note ? (
              <AppText variant="bodySmall" color="muted">
                {l.note}
              </AppText>
            ) : null}
          </View>
        ))}
        <View style={[styles.divider, { backgroundColor: colors.line }]} />
        <View style={[styles.waiterLine, { flexDirection: row, justifyContent: 'space-between' }]}>
          <AppText variant="subheading">{t('order.total')}</AppText>
          <AppText variant="title">{formatPrice(total)}</AppText>
        </View>
      </View>
      <Button label={t('order.close')} variant="outline" onPress={onClose} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { width: '100%', maxWidth: 560, alignSelf: 'center', gap: 16 },
  scroll: { flex: 1, marginHorizontal: -screenPadding },
  scrollContent: { gap: 12, paddingHorizontal: screenPadding },
  tableChip: { alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.pill },
  addMore: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: screenPadding,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  fullWidth: { alignSelf: 'stretch' },
  note: { alignItems: 'center', gap: 6 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingBottom: 60 },
  emptyIcon: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  emptyButton: { alignSelf: 'stretch', marginTop: 8 },
  center: { textAlign: 'center' },
  waiterCard: { padding: 20, gap: 14, borderRadius: radius.lg },
  waiterLine: { alignItems: 'center', gap: 10 },
  waiterName: { flexShrink: 1 },
  divider: { height: 1 },
});
