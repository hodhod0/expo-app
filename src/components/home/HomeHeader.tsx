import { router } from 'expo-router';
import { Globe, Moon, Sun } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { IconButton } from '@/components/ui/IconButton';
import { restaurantName } from '@/data/sample';
import { useRtl } from '@/hooks/useRtl';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/spacing';

/** Welcome + restaurant name, theme toggle and language switch. */
export function HomeHeader() {
  const { t } = useTranslation();
  const { colors, scheme } = useTheme();
  const { row, start } = useRtl();
  const language = useSettingsStore((s) => s.language);
  const setLanguage = useSettingsStore((s) => s.setLanguage);
  const setTheme = useSettingsStore((s) => s.setTheme);

  return (
    <View style={[styles.header, { flexDirection: row }]}>
      <View style={{ alignItems: start, flexShrink: 1 }}>
        <AppText variant="bodySmall" color="muted">
          {t('home.welcome')}
        </AppText>
        <AppText variant="display" numberOfLines={1}>
          {restaurantName[language]}
        </AppText>
      </View>

      <View style={[styles.actions, { flexDirection: row }]}>
        <IconButton
          icon={scheme === 'dark' ? Sun : Moon}
          accessibilityLabel={t('appearance.title')}
          onPress={() => setTheme(scheme === 'dark' ? 'light' : 'dark')}
          onLongPress={() => router.push('/appearance')}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Change language"
          onPress={() => setLanguage(language === 'en' ? 'ar' : 'en')}
          style={({ pressed }) => [
            styles.lang,
            {
              flexDirection: row,
              backgroundColor: colors.surface,
              borderColor: colors.line,
              opacity: pressed ? 0.7 : 1,
            },
          ]}>
          <Globe size={16} color={colors.ink} strokeWidth={1.8} />
          <AppText variant="caption" weight="semibold">
            {language === 'en' ? 'EN / AR' : 'EN / عربي'}
          </AppText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  actions: { alignItems: 'center', gap: 8 },
  lang: {
    alignItems: 'center',
    gap: 6,
    height: 36,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
});
