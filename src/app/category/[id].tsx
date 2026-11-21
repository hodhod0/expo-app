import { router, useLocalSearchParams } from 'expo-router';
import { Search, SlidersHorizontal } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { TopBar } from '@/components/layout/TopBar';
import { DishCard } from '@/components/menu/DishCard';
import { ViewOrderBar } from '@/components/order/ViewOrderBar';
import { AppText } from '@/components/ui/AppText';
import { Chip } from '@/components/ui/Chip';
import { Screen } from '@/components/ui/Screen';
import { getSampleDishes, sampleMainCategories, sampleSubCategories } from '@/data/sample';
import { useRtl } from '@/hooks/useRtl';
import { activeFilterCount, useFilterStore } from '@/store/useFilterStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useTheme } from '@/theme/ThemeProvider';
import { listItemEntering } from '@/theme/motion';
import { screenPadding } from '@/theme/spacing';
import { filterDishes } from '@/utils/filterDishes';

const ALL = 'all';

/** 02 · Category — sub-category chips and the dish list. */
export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const { row } = useRtl();
  const { colors } = useTheme();
  const language = useSettingsStore((s) => s.language);
  const [filter, setFilter] = useState(ALL);

  // TODO: replace sample data with useCategories() / useItems() once the API is configured.
  const category = sampleMainCategories.find((c) => c.id === id);
  const subCategories = sampleSubCategories[id] ?? [];
  const filters = useFilterStore();
  const allergies = useSettingsStore((s) => s.allergies);
  const activeFilters = activeFilterCount(filters);
  const dishes = useMemo(() => {
    const all = getSampleDishes(id);
    const bySub = filter === ALL ? all : all.filter((d) => d.subCategoryId === filter);
    return filterDishes(bySub, filters);
  }, [id, filter, filters]);

  return (
    <View style={styles.root}>
      <Screen contentStyle={styles.content}>
        <TopBar
          title={category?.title[language] ?? ''}
          action={{ icon: Search, label: t('common.search'), onPress: () => router.push('/search') }}
        />

        {subCategories.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipsScroller}
            contentContainerStyle={[styles.chips, { flexDirection: row }]}>
            <Chip label={t('category.all')} active={filter === ALL} onPress={() => setFilter(ALL)} />
            {subCategories.map((s) => (
              <Chip key={s.id} label={s.title[language]} active={filter === s.id} onPress={() => setFilter(s.id)} />
            ))}
          </ScrollView>
        )}

        <View style={[styles.countRow, { flexDirection: row }]}>
          <AppText variant="caption" color="muted">
            {t('category.dishCount', { count: dishes.length })}
          </AppText>
          <Pressable
            accessibilityRole="button"
            hitSlop={8}
            onPress={() => router.push('/filters')}
            style={[styles.filterLink, { flexDirection: row }]}>
            <SlidersHorizontal size={14} color={colors.primary} />
            <AppText variant="caption" weight="semibold" color="primary">
              {activeFilters > 0 ? `${t('filters.title')} (${activeFilters})` : t('filters.title')}
            </AppText>
          </Pressable>
        </View>

        <Animated.FlatList
          key={filter}
          data={dishes}
          keyExtractor={(d) => d.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <AppText color="muted" style={styles.empty}>
              {t('category.empty')}
            </AppText>
          }
          renderItem={({ item, index }) => (
            <Animated.View entering={listItemEntering(index)}>
              <DishCard
                id={item.id}
                name={item.name[language]}
                description={item.description[language]}
                price={item.price}
                prepMinutes={item.prepMinutes}
                tint={item.tint}
                imageUrl={item.imageUrl}
                warning={item.allergens.some((a) => allergies.includes(a))}
                onPress={() => router.push(`/dish/${item.id}`)}
              />
            </Animated.View>
          )}
        />
      </Screen>
      <ViewOrderBar />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { width: '100%', maxWidth: 560, alignSelf: 'center', paddingBottom: 0, gap: 16 },
  chipsScroller: { flexGrow: 0, marginHorizontal: -screenPadding },
  chips: { gap: 8, paddingHorizontal: screenPadding, minWidth: '100%' },
  list: { flex: 1, marginHorizontal: -screenPadding },
  listContent: { gap: 12, paddingHorizontal: screenPadding, paddingBottom: 96 },
  empty: { textAlign: 'center', paddingVertical: 40 },
  countRow: { alignItems: 'center', justifyContent: 'space-between' },
  filterLink: { alignItems: 'center', gap: 6 },
});
