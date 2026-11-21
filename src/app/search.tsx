import { router } from 'expo-router';
import { ChevronLeft, ChevronRight, Clock, Search, SearchX, X } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { DishCard } from '@/components/menu/DishCard';
import { ViewOrderBar } from '@/components/order/ViewOrderBar';
import { AppText } from '@/components/ui/AppText';
import { Chip } from '@/components/ui/Chip';
import { IconButton } from '@/components/ui/IconButton';
import { Screen } from '@/components/ui/Screen';
import { sampleDishes, sampleMainCategories } from '@/data/sample';
import { useRtl } from '@/hooks/useRtl';
import { useSearchStore } from '@/store/useSearchStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, screenPadding } from '@/theme/spacing';
import { searchCategories, searchDishes } from '@/utils/search';

/** Search — live results across dish names, descriptions and ingredients (English and Arabic). */
export default function SearchScreen() {
  const { t } = useTranslation();
  const { colors, fonts, isRTL } = useTheme();
  const { row, start } = useRtl();
  const language = useSettingsStore((s) => s.language);
  const allergies = useSettingsStore((s) => s.allergies);
  const recent = useSearchStore((s) => s.recent);
  const addRecent = useSearchStore((s) => s.addRecent);
  const removeRecent = useSearchStore((s) => s.removeRecent);
  const clearRecent = useSearchStore((s) => s.clearRecent);
  const [query, setQuery] = useState('');

  // TODO: search API data once configured.
  const dishes = useMemo(() => searchDishes(sampleDishes, query), [query]);
  const categories = useMemo(() => searchCategories(sampleMainCategories, query), [query]);
  const hasQuery = query.trim().length > 0;
  const suggestions = t('search.suggestions', { returnObjects: true }) as string[];

  const header = hasQuery ? (
    <View style={styles.section}>
      {categories.length > 0 && (
        <View style={styles.section}>
          <SectionTitle title={t('search.categories')} />
          <View style={[styles.wrap, { flexDirection: row }]}>
            {categories.map((c) => (
              <Chip
                key={c.id}
                label={c.title[language]}
                onPress={() => {
                  addRecent(query);
                  router.push(`/category/${c.id}`);
                }}
              />
            ))}
          </View>
        </View>
      )}
      {dishes.length > 0 && (
        <View style={{ alignItems: start }}>
          <AppText variant="caption" color="muted">
            {t('search.results', { count: dishes.length })}
          </AppText>
        </View>
      )}
    </View>
  ) : (
    <View style={styles.section}>
      {recent.length > 0 && (
        <View style={styles.section}>
          <SectionTitle title={t('search.recent')} action={{ label: t('search.clearRecent'), onPress: clearRecent }} />
          {recent.map((r) => (
            <View key={r} style={[styles.recentRow, { flexDirection: row }]}>
              <Pressable
                accessibilityRole="button"
                onPress={() => setQuery(r)}
                style={[styles.recentText, { flexDirection: row }]}>
                <Clock size={16} color={colors.muted} />
                <AppText variant="body">{r}</AppText>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t('search.remove', { query: r })}
                hitSlop={10}
                onPress={() => removeRecent(r)}>
                <X size={16} color={colors.muted} />
              </Pressable>
            </View>
          ))}
        </View>
      )}
      <SectionTitle title={t('search.popular')} />
      <View style={[styles.wrap, { flexDirection: row }]}>
        {suggestions.map((s) => (
          <Chip key={s} label={s} onPress={() => setQuery(s)} />
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.root}>
      <Screen contentStyle={styles.content}>
        <View style={[styles.searchRow, { flexDirection: row }]}>
          <IconButton
            icon={isRTL ? ChevronRight : ChevronLeft}
            size={44}
            accessibilityLabel={t('common.back')}
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
          />
          <View style={[styles.box, { flexDirection: row, backgroundColor: colors.surface, borderColor: colors.ink }]}>
            <Search size={20} color={colors.muted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              autoFocus
              placeholder={t('search.placeholder')}
              placeholderTextColor={colors.muted}
              returnKeyType="search"
              onSubmitEditing={() => addRecent(query)}
              autoCorrect={false}
              accessibilityLabel={t('common.search')}
              style={[styles.input, { color: colors.ink, fontFamily: fonts.regular, textAlign: isRTL ? 'right' : 'left' }]}
            />
            {hasQuery && (
              <Pressable accessibilityRole="button" accessibilityLabel={t('search.clear')} hitSlop={8} onPress={() => setQuery('')}>
                <X size={18} color={colors.muted} />
              </Pressable>
            )}
          </View>
        </View>

        <FlatList
          data={hasQuery ? dishes : []}
          keyExtractor={(d) => d.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={header}
          ListEmptyComponent={
            hasQuery && categories.length === 0 ? (
              <View style={styles.empty}>
                <View style={[styles.emptyIcon, { backgroundColor: colors.primarySoft }]}>
                  <SearchX size={30} color={colors.primary} />
                </View>
                <AppText variant="heading" style={styles.center}>
                  {t('search.noResults', { query: query.trim() })}
                </AppText>
                <AppText color="muted" style={styles.center}>
                  {t('search.noResultsHint')}
                </AppText>
              </View>
            ) : undefined
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
              warning={item.allergens.some((a) => allergies.includes(a))}
              onPress={() => {
                addRecent(query);
                router.push(`/dish/${item.id}`);
              }}
            />
          )}
        />
      </Screen>
      <ViewOrderBar />
    </View>
  );
}

function SectionTitle({ title, action }: { title: string; action?: { label: string; onPress: () => void } }) {
  const { row } = useRtl();
  return (
    <View style={[styles.sectionTitle, { flexDirection: row }]}>
      <AppText variant="subheading">{title}</AppText>
      {action ? (
        <Pressable accessibilityRole="button" hitSlop={8} onPress={action.onPress}>
          <AppText variant="caption" weight="semibold" color="primary">
            {action.label}
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { width: '100%', maxWidth: 560, alignSelf: 'center', paddingBottom: 0, gap: 16 },
  searchRow: { alignItems: 'center', gap: 10 },
  box: { flex: 1, height: 48, alignItems: 'center', gap: 10, paddingHorizontal: 14, borderRadius: radius.md, borderWidth: 1.5 },
  input: { flex: 1, height: '100%', fontSize: 15 },
  list: { flex: 1, marginHorizontal: -screenPadding },
  listContent: { gap: 12, paddingHorizontal: screenPadding, paddingBottom: 96 },
  section: { gap: 12 },
  sectionTitle: { alignItems: 'center', justifyContent: 'space-between' },
  wrap: { flexWrap: 'wrap', gap: 8 },
  recentRow: { alignItems: 'center', justifyContent: 'space-between', paddingVertical: 4 },
  recentText: { flex: 1, alignItems: 'center', gap: 10 },
  empty: { alignItems: 'center', gap: 10, paddingTop: 48, paddingHorizontal: 12 },
  emptyIcon: { width: 68, height: 68, borderRadius: 34, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  center: { textAlign: 'center' },
});
