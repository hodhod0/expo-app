import { router } from 'expo-router';
import { Check } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { useSettingsStore, type ThemePreference } from '@/store/useSettingsStore';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, screenPadding } from '@/theme/spacing';

const OPTIONS: ThemePreference[] = ['light', 'dark', 'system'];

/** 13 · Appearance — Light / Dark / System. */
export default function AppearanceSheet() {
  const { t } = useTranslation();
  const { colors, isRTL } = useTheme();
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <AppText variant="title">{t('appearance.title')}</AppText>
      <AppText variant="bodySmall" color="muted">
        {t('appearance.subtitle')}
      </AppText>

      <View style={[styles.row, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        {OPTIONS.map((option) => {
          const selected = option === theme;
          return (
            <Pressable
              key={option}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => setTheme(option)}
              style={[
                styles.card,
                {
                  backgroundColor: colors.surface,
                  borderColor: selected ? colors.primary : colors.line,
                  borderWidth: selected ? 2 : 1,
                },
              ]}>
              <View
                style={[
                  styles.radio,
                  selected
                    ? { backgroundColor: colors.primary, borderColor: colors.primary }
                    : { borderColor: colors.line },
                ]}>
                {selected && <Check size={12} color={colors.onColor} strokeWidth={3} />}
              </View>
              <AppText variant="bodySmall" weight={selected ? 'semibold' : 'medium'}>
                {t(`appearance.${option}`)}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      <AppText variant="caption" color="muted">
        {t('appearance.systemHint')}
      </AppText>
      <Button label={t('appearance.done')} onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: screenPadding, gap: 16 },
  row: { gap: 12 },
  card: {
    flex: 1,
    alignItems: 'center',
    gap: 10,
    paddingVertical: 18,
    borderRadius: radius.lg - 2,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
