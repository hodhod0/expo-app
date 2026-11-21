import { Image } from 'expo-image';
import { Heart } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { useRtl } from '@/hooks/useRtl';
import { useFavouritesStore } from '@/store/useFavouritesStore';
import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/spacing';
import { formatPrice } from '@/utils/format';

type Props = {
  id: string;
  name: string;
  description: string;
  price: number;
  prepMinutes?: number;
  tint: string;
  imageUrl?: string;
  onPress: () => void;
};

/** Figma "Dish Card": photo, name, short description, price, prep time, favourite heart. */
export function DishCard({ id, name, description, price, prepMinutes, tint, imageUrl, onPress }: Props) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { row, start } = useRtl();
  const saved = useFavouritesStore((s) => s.ids.includes(id));
  const toggle = useFavouritesStore((s) => s.toggle);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${name}, ${formatPrice(price)}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { flexDirection: row, backgroundColor: colors.surface, opacity: pressed ? 0.9 : 1 },
      ]}>
      <View style={[styles.photo, { backgroundColor: tint }]}>
        {imageUrl ? <Image source={imageUrl} style={StyleSheet.absoluteFill} contentFit="cover" /> : null}
      </View>

      <View style={[styles.info, { alignItems: start }]}>
        <AppText variant="subheading" numberOfLines={1}>
          {name}
        </AppText>
        <AppText variant="caption" weight="regular" color="muted" numberOfLines={2} style={styles.desc}>
          {description}
        </AppText>
        <View style={[styles.meta, { flexDirection: row }]}>
          <AppText variant="body" weight="bold" color="primary">
            {formatPrice(price)}
          </AppText>
          {prepMinutes ? (
            <AppText variant="caption" color="muted">
              {t('category.minutes', { count: prepMinutes })}
            </AppText>
          ) : null}
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t(saved ? 'category.removeFavourite' : 'category.addFavourite')}
        accessibilityState={{ selected: saved }}
        hitSlop={8}
        onPress={() => toggle(id)}
        style={[styles.heart, { backgroundColor: colors.bg }]}>
        <Heart
          size={18}
          color={saved ? colors.primary : colors.muted}
          fill={saved ? colors.primary : 'transparent'}
        />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { alignItems: 'center', gap: 14, padding: 12, borderRadius: radius.lg },
  photo: { width: 84, height: 84, borderRadius: radius.md, overflow: 'hidden' },
  info: { flex: 1, gap: 4 },
  desc: { lineHeight: 18 },
  meta: { alignItems: 'center', gap: 8, paddingTop: 2 },
  heart: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
});
