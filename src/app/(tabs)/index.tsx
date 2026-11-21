import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { CallWaiterFab } from '@/components/home/CallWaiterFab';
import { ChefPickBanner } from '@/components/home/ChefPickBanner';
import { HomeHeader } from '@/components/home/HomeHeader';
import { SearchBar } from '@/components/home/SearchBar';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { CategoryCard } from '@/components/menu/CategoryCard';
import { Screen } from '@/components/ui/Screen';
import { sampleMainCategories } from '@/data/sample';
import { useRtl } from '@/hooks/useRtl';
import { useSettingsStore } from '@/store/useSettingsStore';
import { screenPadding } from '@/theme/spacing';

const MAX_CONTENT_WIDTH = 560;
const GRID_GAP = 12;

/** 01 · Home */
export default function HomeScreen() {
  const { t } = useTranslation();
  const { row } = useRtl();
  const language = useSettingsStore((s) => s.language);
  const { width } = useWindowDimensions();

  const contentWidth = Math.min(width, MAX_CONTENT_WIDTH) - screenPadding * 2;
  const cardWidth = (contentWidth - GRID_GAP) / 2;

  // TODO: swap sample data for useMainCategories() once the API (.env) is configured.
  const categories = sampleMainCategories;

  return (
    <View style={styles.root}>
      <Screen scroll contentStyle={styles.content}>
        <HomeHeader />
        <SearchBar />
        <ChefPickBanner />
        <SectionHeader
          title={t('home.explore')}
          actionLabel={t('home.seeAll')}
          onAction={() => router.push('/menu')}
        />
        <View style={[styles.grid, { flexDirection: row }]}>
          {categories.map((c) => (
            <CategoryCard
              key={c.id}
              title={c.title[language]}
              count={c.count[language]}
              tint={c.tint}
              imageUrl={c.imageUrl}
              width={cardWidth}
              onPress={() => router.push(`/category/${c.id}`)}
            />
          ))}
        </View>
      </Screen>
      <CallWaiterFab />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: 'center',
    paddingBottom: 96, // room for the Call waiter button
  },
  grid: { flexWrap: 'wrap', gap: GRID_GAP },
});
