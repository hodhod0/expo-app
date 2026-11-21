import { Minus, Plus } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { useRtl } from '@/hooks/useRtl';
import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/spacing';

type Props = { value: number; onChange: (value: number) => void };

/** − 1 + pill. Going below 1 removes the line (handled by the store). */
export function QuantityStepper({ value, onChange }: Props) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { row } = useRtl();

  return (
    <View
      accessibilityRole="adjustable"
      accessibilityValue={{ now: value }}
      style={[styles.pill, { flexDirection: row, backgroundColor: colors.bg }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('order.decrease')}
        hitSlop={6}
        onPress={() => onChange(value - 1)}
        style={[styles.btn, { backgroundColor: colors.surface }]}>
        <Minus size={14} color={colors.ink} strokeWidth={2.5} />
      </Pressable>
      <AppText variant="bodySmall" weight="bold" style={styles.value}>
        {value}
      </AppText>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('order.increase')}
        hitSlop={6}
        onPress={() => onChange(value + 1)}
        style={[styles.btn, { backgroundColor: colors.primary }]}>
        <Plus size={14} color={colors.onColor} strokeWidth={2.5} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: { alignItems: 'center', gap: 8, padding: 4, borderRadius: radius.pill },
  btn: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  value: { minWidth: 16, textAlign: 'center' },
});
