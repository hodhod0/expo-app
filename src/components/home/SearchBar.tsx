import { router } from 'expo-router';
import { Search, SlidersHorizontal } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { useRtl } from '@/hooks/useRtl';
import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/spacing';

/** Looks like a field; opens the Search screen. The sliders icon opens Filters. */
export function SearchBar() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { row } = useRtl();

  return (
    <View
      style={[
        styles.bar,
        { flexDirection: row, backgroundColor: colors.surface, borderColor: colors.line },
      ]}>
      <Pressable
        accessibilityRole="search"
        onPress={() => router.push('/search')}
        style={[styles.field, { flexDirection: row }]}>
        <Search size={20} color={colors.muted} />
        <AppText color="muted" style={styles.placeholder} numberOfLines={1}>
          {t('home.search')}
        </AppText>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Filters"
        hitSlop={8}
        onPress={() => router.push('/filters')}>
        <SlidersHorizontal size={20} color={colors.ink} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 52,
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  field: { flex: 1, alignItems: 'center', gap: 10, height: '100%' },
  placeholder: { flex: 1 },
});
