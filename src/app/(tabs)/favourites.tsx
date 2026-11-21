import { router } from 'expo-router';
import { Heart, Info } from 'lucide-react-native';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { DishCard } from '@/components/menu/DishCard';
import { ViewOrderBar } from '@/components/order/ViewOrderBar';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { sampleDishes } from '@/data/sample';
import { useRtl } from '@/hooks/useRtl';
import { useFavouritesStore } from '@/store/useFavouritesStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useTheme } from '@/theme/ThemeProvider';
import { listItemEntering } from '@/theme/motion';
import { radius, screenPadding } from '@/theme/spacing';

/** 04 · Favourites — saved dishes, newest first. Tapping a heart removes it. */
export default function FavouritesScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { row, start } = useRtl();
  const language = useSettingsStore((s) => s.language);
  const ids = useFavouritesStore((s) => s.ids);
  const allergies = useSettingsStore((s) => s.allergies);

  // TODO: look dishes up from the API once configured; unknown ids are skipped.
  const dishes = useMemo(
    () =>
      [...ids]
        .reverse()
        .map((id) => sampleDishes.find((d) => d.id === id))
        .filter((d) => d !== undefined),
    [ids],
  );

  if (dishes.length === 0) {
    return (
      <Screen contentStyle={styles.content}>
        <AppText variant="display">{t('favourites.title')}</AppText>
        <View style={styles.empty}>
          <Animated.View entering={ZoomIn.springify()} style={[styles.emptyIcon, { backgroundColor: colors.primarySoft }]}>
            <Heart size={32} color={colors.primary} />
          </Animated.View>
          <AppText variant="title" style={styles.center}>
            {t('favourites.emptyTitle')}
          </AppText>
          <AppText color="muted" style={styles.center}>
            {t('favourites.emptyText')}
          </AppText>
          <Button label={t('favourites.browse')} onPress={() => router.navigate('/')} style={styles.emptyButton} />
        </View>
      </Screen>
    );
  }

  return (
    <View style={styles.root}>
      <Screen contentStyle={[styles.content, { paddingBottom: 0 }]}>
        <Animated.FlatList
          data={dishes}
          keyExtractor={(d) => d.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.header}>
              <View style={{ alignItems: start, gap: 4 }}>
                <AppText variant="display">{t('favourites.title')}</AppText>
                <AppText variant="bodySmall" color="muted">
                  {t('favourites.count', { count: dishes.length })}
                </AppText>
              </View>
              <View style={[styles.tip, { flexDirection: row, backgroundColor: colors.accentSoft }]}>
                <Info size={20} color={colors.accentText} />
                <AppText variant="caption" color="accentText" style={styles.tipText}>
                  {t('favourites.tip')}
                </AppText>
              </View>
            </View>
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
  content: { width: '100%', maxWidth: 560, alignSelf: 'center' },
  list: { flex: 1, marginHorizontal: -screenPadding },
  listContent: { gap: 12, paddingHorizontal: screenPadding, paddingBottom: 96 },
  header: { gap: 16, marginBottom: 8 },
  tip: { alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14, borderRadius: radius.md },
  tipText: { flex: 1, lineHeight: 18 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingBottom: 60 },
  emptyIcon: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  emptyButton: { alignSelf: 'stretch', marginTop: 8 },
  center: { textAlign: 'center' },
});
