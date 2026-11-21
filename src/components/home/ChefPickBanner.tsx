import { router } from 'expo-router';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { sampleChefPick } from '@/data/sample';
import { useRtl } from '@/hooks/useRtl';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/spacing';

/** Green "Chef's pick" banner with a round dish photo. */
export function ChefPickBanner() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { isRTL, row, start } = useRtl();
  const language = useSettingsStore((s) => s.language);
  const Chevron = isRTL ? ChevronLeft : ChevronRight;
  const side = isRTL ? { left: -58 } : { right: -58 };
  const photoSide = isRTL ? { left: -13 } : { right: -13 };

  return (
    <View style={[styles.card, { backgroundColor: colors.accent }]}>
      <View style={[styles.glow, side, { backgroundColor: colors.gold }]} />
      <View style={[styles.photo, photoSide, { backgroundColor: sampleChefPick.tint }]} />

      <View style={[styles.content, { alignItems: start }]}>
        <AppText variant="tiny" weight="bold" style={[styles.tag, { color: colors.gold }]}>
          {t('home.chefsPick')}
        </AppText>
        <AppText variant="title" color="onColor" style={styles.title}>
          {sampleChefPick.title[language]}
        </AppText>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push(`/dish/${sampleChefPick.dishId}`)}
          style={({ pressed }) => [
            styles.button,
            { flexDirection: row, backgroundColor: colors.surface, opacity: pressed ? 0.85 : 1 },
          ]}>
          <AppText variant="caption" weight="semibold" color="accentText">
            {t('home.viewDish')}
          </AppText>
          <Chevron size={14} color={colors.accentText} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { height: 164, borderRadius: radius.xl - 4, overflow: 'hidden', justifyContent: 'center' },
  glow: { position: 'absolute', top: -60, width: 210, height: 210, borderRadius: 105, opacity: 0.2 },
  photo: { position: 'absolute', top: 36, width: 140, height: 140, borderRadius: 70 },
  content: { paddingHorizontal: 22, gap: 8, maxWidth: '62%' },
  tag: { letterSpacing: 1.1 },
  title: { fontSize: 22, lineHeight: 28 },
  button: {
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    marginTop: 4,
  },
});
