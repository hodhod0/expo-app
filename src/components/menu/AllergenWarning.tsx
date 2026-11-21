import { TriangleAlert } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { useRtl } from '@/hooks/useRtl';
import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/spacing';

/** Shown on a dish that contains something the guest asked to avoid. */
export function AllergenWarning({ allergens }: { allergens: string[] }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { row, start } = useRtl();
  const list = allergens.join(', ');

  return (
    <View
      accessibilityRole="alert"
      style={[styles.box, { flexDirection: row, backgroundColor: colors.primarySoft }]}>
      <TriangleAlert size={20} color={colors.primary} />
      <View style={[styles.text, { alignItems: start }]}>
        <AppText variant="bodySmall" weight="semibold" color="primary">
          {t('dish.contains', { list })}
        </AppText>
        <AppText variant="caption" weight="regular" style={styles.hint}>
          {t('dish.avoidHint', { list })}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 12, borderRadius: radius.md - 2 },
  text: { flex: 1, gap: 2 },
  hint: { fontSize: 12, lineHeight: 16 },
});
