import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flame,
  Heart,
  ShoppingBag,
  Star,
  type LucideIcon,
} from 'lucide-react-native';
import { useEffect, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Extrapolation,
  FadeIn,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PlaceholderScreen } from '@/components/layout/PlaceholderScreen';
import { AllergenWarning } from '@/components/menu/AllergenWarning';
import { AppText } from '@/components/ui/AppText';
import { Chip } from '@/components/ui/Chip';
import { HeartButton } from '@/components/ui/HeartButton';
import { PressableScale } from '@/components/ui/PressableScale';
import { allergenNames, getSampleDish } from '@/data/sample';
import { useRtl } from '@/hooks/useRtl';
import { useFavouritesStore } from '@/store/useFavouritesStore';
import { useOrderStore } from '@/store/useOrderStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useTheme } from '@/theme/ThemeProvider';
import type { ColorTokens } from '@/theme/colors';
import { radius, screenPadding } from '@/theme/spacing';
import { formatPrice } from '@/utils/format';

const PHOTO_HEIGHT = 360;

/** 03 · Dish Details */
export default function DishScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { isRTL, row, start } = useRtl();
  const insets = useSafeAreaInsets();
  const language = useSettingsStore((s) => s.language);
  const avoid = useSettingsStore((s) => s.allergies);
  const saved = useFavouritesStore((s) => s.ids.includes(id));
  const toggleFavourite = useFavouritesStore((s) => s.toggle);
  const addToOrder = useOrderStore((s) => s.add);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (!justAdded) return;
    const timer = setTimeout(() => setJustAdded(false), 1600);
    return () => clearTimeout(timer);
  }, [justAdded]);

  // Parallax photo: moves at half speed when scrolling up, stretches when pulling down.
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.set(e.contentOffset.y);
  });
  const photoStyle = useAnimatedStyle(() => {
    const y = scrollY.get();
    return {
      transform: [
        { translateY: interpolate(y, [-PHOTO_HEIGHT, 0, PHOTO_HEIGHT], [-PHOTO_HEIGHT / 2, 0, PHOTO_HEIGHT / 2]) },
        { scale: interpolate(y, [-PHOTO_HEIGHT, 0], [2, 1], Extrapolation.CLAMP) },
      ],
    };
  });

  // TODO: load from the API once configured.
  const dish = getSampleDish(id);
  if (!dish) return <PlaceholderScreen title={t('dish.notFound')} figma="03 · Dish Details" />;

  const conflicts = dish.allergens.filter((a) => avoid.includes(a));
  const conflictNames = conflicts.map((a) => allergenNames[a]?.[language] ?? a);
  const Back = isRTL ? ChevronRight : ChevronLeft;

  const onAdd = () => {
    addToOrder({
      itemId: dish.id,
      name: dish.name[language],
      unitPrice: dish.price,
      imageUrl: dish.imageUrl,
      tint: dish.tint,
    });
    setJustAdded(true);
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 + insets.bottom }}>
        <Animated.View style={[styles.photo, { backgroundColor: dish.tint }, photoStyle]}>
          {dish.imageUrl ? <Image source={dish.imageUrl} style={StyleSheet.absoluteFill} contentFit="cover" /> : null}
        </Animated.View>

        <View style={[styles.sheet, { backgroundColor: colors.bg }]}>
          {dish.tags?.length ? (
            <View style={[styles.wrapRow, { flexDirection: row }]}>
              {dish.tags.map((tag) => (
                <Tag
                  key={tag}
                  label={t(`dish.${tag}`)}
                  icon={tag === 'chefsPick' ? Star : Flame}
                  bg={tag === 'chefsPick' ? 'primarySoft' : 'accentSoft'}
                  fg={tag === 'chefsPick' ? 'primary' : 'accentText'}
                  filled={tag === 'chefsPick'}
                />
              ))}
            </View>
          ) : null}

          <View style={[styles.titleRow, { flexDirection: row }]}>
            <AppText variant="display" style={styles.title}>
              {dish.name[language]}
            </AppText>
            <AppText variant="title" weight="bold" color="primary">
              {formatPrice(dish.price)}
            </AppText>
          </View>

          <View style={[styles.wrapRow, { flexDirection: row, gap: 16 }]}>
            {dish.rating ? (
              <Meta icon={Star} iconColor={colors.gold} filled>
                {`${dish.rating} ${t('dish.reviews', { count: dish.reviews ?? 0 })}`}
              </Meta>
            ) : null}
            <Meta icon={Clock} iconColor={colors.muted}>
              {t('category.minutes', { count: dish.prepMinutes })}
            </Meta>
            {dish.calories ? (
              <Meta icon={Flame} iconColor={colors.muted}>
                {t('dish.calories', { count: dish.calories })}
              </Meta>
            ) : null}
          </View>

          {conflicts.length > 0 && <AllergenWarning allergens={conflictNames} />}

          <View style={[styles.divider, { backgroundColor: colors.line }]} />

          <View style={{ alignItems: start, gap: 8 }}>
            <AppText variant="subheading">{t('dish.about')}</AppText>
            <AppText variant="bodySmall" color="muted" style={styles.paragraph}>
              {dish.description[language]}
            </AppText>
          </View>

          {dish.ingredients?.length ? (
            <View style={{ alignItems: start, gap: 10 }}>
              <AppText variant="subheading">{t('dish.ingredients')}</AppText>
              <View style={[styles.wrapRow, { flexDirection: row }]}>
                {dish.ingredients.map((ing) => (
                  <Chip key={ing.en} label={ing[language]} />
                ))}
              </View>
            </View>
          ) : null}
        </View>
      </Animated.ScrollView>

      {/* Floating buttons over the photo */}
      <View style={[styles.photoButtons, { top: insets.top + 12, flexDirection: row }]}>
        <RoundButton label={t('common.back')} onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}>
          <Back size={20} color={colors.ink} />
        </RoundButton>
        <RoundButton
          label={t(saved ? 'category.removeFavourite' : 'category.addFavourite')}
          onPress={() => toggleFavourite(dish.id)}>
          <Heart size={20} color={colors.primary} fill={saved ? colors.primary : 'transparent'} />
        </RoundButton>
      </View>

      {/* Bottom bar */}
      <View
        style={[
          styles.bottomBar,
          {
            flexDirection: row,
            paddingBottom: 16 + insets.bottom,
            backgroundColor: colors.surface,
            borderTopColor: colors.line,
          },
        ]}>
        <HeartButton
          dishId={dish.id}
          size={22}
          mutedOutline={false}
          style={[styles.favButton, { backgroundColor: colors.surface, borderColor: colors.line }]}
        />
        <PressableScale
          accessibilityRole="button"
          onPress={onAdd}
          style={[styles.addButton, { backgroundColor: justAdded ? colors.accent : colors.primary }]}>
          <Animated.View key={String(justAdded)} entering={FadeIn.duration(200)} style={[styles.addContent, { flexDirection: row }]}>
            {justAdded ? <Check size={20} color={colors.onColor} /> : <ShoppingBag size={20} color={colors.onColor} />}
            <AppText variant="subheading" color="onColor">
              {justAdded ? t('dish.added') : t('dish.addToOrder', { price: formatPrice(dish.price) })}
            </AppText>
          </Animated.View>
        </PressableScale>
      </View>
    </View>
  );
}

function Tag({
  label,
  icon: Icon,
  bg,
  fg,
  filled,
}: {
  label: string;
  icon: LucideIcon;
  bg: keyof ColorTokens;
  fg: keyof ColorTokens;
  filled?: boolean;
}) {
  const { colors } = useTheme();
  const { row } = useRtl();
  return (
    <View style={[styles.tag, { flexDirection: row, backgroundColor: colors[bg] }]}>
      <Icon size={12} color={colors[fg]} fill={filled ? colors[fg] : 'transparent'} />
      <AppText variant="tiny" weight="semibold" color={fg} style={{ fontSize: 12 }}>
        {label}
      </AppText>
    </View>
  );
}

function Meta({
  icon: Icon,
  iconColor,
  filled,
  children,
}: {
  icon: LucideIcon;
  iconColor: string;
  filled?: boolean;
  children: string;
}) {
  const { row } = useRtl();
  return (
    <View style={[styles.meta, { flexDirection: row }]}>
      <Icon size={16} color={iconColor} fill={filled ? iconColor : 'transparent'} />
      <AppText variant="caption">{children}</AppText>
    </View>
  );
}

function RoundButton({ label, onPress, children }: { label: string; onPress: () => void; children: ReactNode }) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={[styles.round, { backgroundColor: colors.surface }]}>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  photo: { height: PHOTO_HEIGHT, overflow: 'hidden' },
  sheet: {
    marginTop: -28,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: screenPadding,
    paddingTop: 28,
    gap: 16,
  },
  wrapRow: { flexWrap: 'wrap', gap: 8, alignItems: 'center' },
  tag: { alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill },
  titleRow: { alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  title: { flexShrink: 1 },
  meta: { alignItems: 'center', gap: 5 },
  divider: { height: 1 },
  paragraph: { lineHeight: 22 },
  photoButtons: { position: 'absolute', left: screenPadding, right: screenPadding, justifyContent: 'space-between' },
  round: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    gap: 12,
    paddingHorizontal: screenPadding,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  favButton: {
    width: 56,
    height: 56,
    borderRadius: radius.lg - 2,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addContent: { alignItems: 'center', gap: 8 },
  addButton: {
    flex: 1,
    height: 56,
    borderRadius: radius.lg - 2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});
