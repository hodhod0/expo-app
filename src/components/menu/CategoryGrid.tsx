import { router } from 'expo-router';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { sampleMainCategories } from '@/data/sample';
import { MAX_CONTENT_WIDTH } from '@/hooks/useContentInset';
import { useRtl } from '@/hooks/useRtl';
import { useSettingsStore } from '@/store/useSettingsStore';
import { listItemEntering } from '@/theme/motion';
import { screenPadding } from '@/theme/spacing';

import { CategoryCard } from './CategoryCard';

export { MAX_CONTENT_WIDTH };
const GAP = 12;

/** Two-column grid of main categories (Home and the Menu tab). */
export function CategoryGrid() {
  const { row } = useRtl();
  const language = useSettingsStore((s) => s.language);
  const { width } = useWindowDimensions();
  const cardWidth = (Math.min(width, MAX_CONTENT_WIDTH) - screenPadding * 2 - GAP) / 2;

  // TODO: swap sample data for useMainCategories() once the API (.env) is configured.
  return (
    <View style={[styles.grid, { flexDirection: row }]}>
      {sampleMainCategories.map((c, i) => (
        <Animated.View key={c.id} entering={listItemEntering(i)}>
          <CategoryCard
            title={c.title[language]}
            count={c.count[language]}
            tint={c.tint}
            imageUrl={c.imageUrl}
            width={cardWidth}
            onPress={() => router.push(`/category/${c.id}`)}
          />
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexWrap: 'wrap', gap: GAP },
});
