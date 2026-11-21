import { router } from 'expo-router';
import { Flame, X } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { sampleDishes } from '@/data/sample';
import { useRtl } from '@/hooks/useRtl';
import {
  ALLERGENS,
  DIETS,
  PRICE_RANGES,
  SORTS,
  SPICE_LEVELS,
  useFilterStore,
} from '@/store/useFilterStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, screenPadding } from '@/theme/spacing';
import { filterDishes } from '@/utils/filterDishes';

/** 07 · Filters & Allergies */
export default function FiltersSheet() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { row } = useRtl();
  const insets = useSafeAreaInsets();
  const filters = useFilterStore();
  const allergies = useSettingsStore((s) => s.allergies);
  const toggleAllergy = useSettingsStore((s) => s.toggleAllergy);
  const clearAllergies = useSettingsStore((s) => s.clearAllergies);

  // TODO: count against API data once configured.
  const matches = filterDishes(sampleDishes, filters).length;

  const onReset = () => {
    filters.reset();
    clearAllergies();
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { flexDirection: row }]}>
          <AppText variant="title">{t('filters.title')}</AppText>
          <Pressable accessibilityRole="button" hitSlop={8} onPress={onReset}>
            <AppText variant="bodySmall" weight="semibold" color="primary">
              {t('filters.reset')}
            </AppText>
          </Pressable>
        </View>

        <Group title={t('filters.diet')}>
          {DIETS.map((d) => (
            <Chip
              key={d}
              label={t(`filters.diets.${d}`)}
              active={filters.diets.includes(d)}
              onPress={() => filters.toggleDiet(d)}
            />
          ))}
        </Group>

        <Group title={t('filters.allergens')} hint={t('filters.allergensHint')}>
          {ALLERGENS.map((a) => {
            const on = allergies.includes(a);
            return (
              <Pressable
                key={a}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: on }}
                onPress={() => toggleAllergy(a)}
                style={[
                  styles.allergen,
                  {
                    flexDirection: row,
                    backgroundColor: on ? colors.primarySoft : colors.surface,
                    borderColor: on ? colors.primary : colors.line,
                  },
                ]}>
                {on && <X size={14} color={colors.primary} strokeWidth={2.5} />}
                <AppText variant="bodySmall" weight={on ? 'semibold' : 'medium'} color={on ? 'primary' : 'ink'}>
                  {t(`filters.allergenNames.${a}`)}
                </AppText>
              </Pressable>
            );
          })}
        </Group>

        <Group title={t('filters.spice')} wrap={false}>
          <View
            style={[
              styles.segmented,
              { flexDirection: row, backgroundColor: colors.surface, borderColor: colors.line },
            ]}>
            {SPICE_LEVELS.map((level, i) => {
              const on = filters.spice === level;
              const fg = on ? colors.onColor : colors.primary;
              return (
                <Pressable
                  key={level}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: on }}
                  onPress={() => filters.setSpice(level)}
                  style={[styles.segment, { flexDirection: row, backgroundColor: on ? colors.primary : 'transparent' }]}>
                  {Array.from({ length: i }, (_, k) => (
                    <Flame key={k} size={11} color={fg} />
                  ))}
                  <AppText variant="caption" weight="semibold" color={on ? 'onColor' : 'ink'}>
                    {t(`filters.spiceLevels.${level}`)}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </Group>

        <Group title={t('filters.price')}>
          {PRICE_RANGES.map((p) => (
            <Chip
              key={p}
              label={t(`filters.prices.${p}`)}
              active={filters.price === p}
              onPress={() => filters.setPrice(p)}
            />
          ))}
        </Group>

        <Group title={t('filters.sort')}>
          {SORTS.map((s) => (
            <Chip key={s} label={t(`filters.sorts.${s}`)} active={filters.sort === s} onPress={() => filters.setSort(s)} />
          ))}
        </Group>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: 16 + insets.bottom, borderTopColor: colors.line }]}>
        <Button
          label={matches > 0 ? t('filters.show', { count: matches }) : t('filters.showNone')}
          disabled={matches === 0}
          style={{ opacity: matches === 0 ? 0.5 : 1 }}
          onPress={() => router.back()}
        />
      </View>
    </View>
  );
}

function Group({
  title,
  hint,
  wrap = true,
  children,
}: {
  title: string;
  hint?: string;
  wrap?: boolean;
  children: ReactNode;
}) {
  const { row, start } = useRtl();
  return (
    <View style={styles.group}>
      <View style={{ alignItems: start, gap: 2 }}>
        <AppText variant="subheading">{title}</AppText>
        {hint ? (
          <AppText variant="caption" weight="regular" color="muted" style={{ fontSize: 12 }}>
            {hint}
          </AppText>
        ) : null}
      </View>
      {wrap ? <View style={[styles.wrap, { flexDirection: row }]}>{children}</View> : children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { padding: screenPadding, paddingTop: 20, gap: 22, paddingBottom: 32 },
  header: { alignItems: 'center', justifyContent: 'space-between' },
  group: { gap: 10 },
  wrap: { flexWrap: 'wrap', gap: 8 },
  allergen: {
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  segmented: { padding: 4, gap: 4, borderRadius: radius.md - 2, borderWidth: 1 },
  segment: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3, paddingVertical: 10, borderRadius: radius.sm },
  footer: { paddingHorizontal: screenPadding, paddingTop: 12, borderTopWidth: 1 },
});
