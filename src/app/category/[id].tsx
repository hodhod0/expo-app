import { router, useLocalSearchParams } from 'expo-router';
import { Search } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';

import { TopBar } from '@/components/layout/TopBar';
import { DishCard } from '@/components/menu/DishCard';
import { ViewOrderBar } from '@/components/order/ViewOrderBar';
import { AppText } from '@/components/ui/AppText';
import { Chip } from '@/components/ui/Chip';
import { Screen } from '@/components/ui/Screen';
import { getSampleDishes, sampleMainCategories, sampleSubCategories } from '@/data/sample';
import { useRtl } from '@/hooks/useRtl';
import { useSettingsStore } from '@/store/useSettingsStore';
import { screenPadding } from '@/theme/spacing';

const ALL = 'all';

/** 02 · Category — sub-category chips and the dish list. */
export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const { row, start } = useRtl();
  const language = useSettingsStore((s) => s.language);
  const [filter, setFilter] = useState(ALL);

  // TODO: replace sample data with useCategories() / useItems() once the API is configured.
  const category = sampleMainCategories.find((c) => c.id === id);
  const subCategories = sampleSubCategories[id] ?? [];
  const dishes = useMemo(() => {
    const all = getSampleDishes(id);
    return filter === ALL ? all : all.filter((d) => d.subCategoryId === filter);
  }, [id, filter]);

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

        <View style={{ alignItems: start }}>
          <AppText variant="caption" color="muted">
            {t('category.dishCount', { count: dishes.length })}
          </AppText>
        </View>

        <FlatList
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
          renderItem={({ item }) => (
            <DishCard
              id={item.id}
              name={item.name[language]}
              description={item.description[language]}
              price={item.price}
              prepMinutes={item.prepMinutes}
              tint={item.tint}
              imageUrl={item.imageUrl}
              onPress={() => router.push(`/dish/${item.id}`)}
            />
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
});
