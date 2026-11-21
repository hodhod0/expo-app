import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { useRtl } from '@/hooks/useRtl';
import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/spacing';
import { formatPrice } from '@/utils/format';

type Props = { subtotal: number; service: number; total: number };

/** Subtotal · Service (10%) · Total card. */
export function OrderSummary({ subtotal, service, total }: Props) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { row } = useRtl();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <SummaryLine label={t('order.subtotal')} value={subtotal} />
      <SummaryLine label={t('order.service')} value={service} />
      <View style={[styles.divider, { backgroundColor: colors.line }]} />
      <View style={[styles.line, { flexDirection: row }]}>
        <AppText variant="subheading">{t('order.total')}</AppText>
        <AppText variant="title">{formatPrice(total)}</AppText>
      </View>
    </View>
  );
}

function SummaryLine({ label, value }: { label: string; value: number }) {
  const { row } = useRtl();
  return (
    <View style={[styles.line, { flexDirection: row }]}>
      <AppText variant="bodySmall" color="muted">
        {label}
      </AppText>
      <AppText variant="bodySmall" weight="medium">
        {formatPrice(value)}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, gap: 10, borderRadius: radius.lg },
  line: { alignItems: 'center', justifyContent: 'space-between' },
  divider: { height: 1 },
});
