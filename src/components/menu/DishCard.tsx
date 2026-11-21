import { Image } from 'expo-image';
import { TriangleAlert } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { HeartButton } from '@/components/ui/HeartButton';
import { PressableScale } from '@/components/ui/PressableScale';
import { useRtl } from '@/hooks/useRtl';
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
  /** Contains an allergen the guest asked to avoid. */
  warning?: boolean;
  onPress: () => void;
};

/** Figma "Dish Card": photo, name, short description, price, prep time, favourite heart. */
export function DishCard({ id, name, description, price, prepMinutes, tint, imageUrl, warning, onPress }: Props) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { row, start } = useRtl();

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={`${name}, ${formatPrice(price)}`}
      onPress={onPress}
      style={[styles.card, { flexDirection: row, backgroundColor: colors.surface }]}>
      <View style={[styles.photo, { backgroundColor: tint }]}>
        {imageUrl ? <Image source={imageUrl} style={StyleSheet.absoluteFill} contentFit="cover" /> : null}
      </View>

      <View style={[styles.info, { alignItems: start }]}>
        <View style={[styles.nameRow, { flexDirection: row }]}>
          {warning ? <TriangleAlert size={15} color={colors.primary} accessibilityLabel="Allergen warning" /> : null}
          <AppText variant="subheading" numberOfLines={1} style={styles.name}>
            {name}
          </AppText>
        </View>
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

      <HeartButton dishId={id} style={[styles.heart, { backgroundColor: colors.bg }]} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: { alignItems: 'center', gap: 14, padding: 12, borderRadius: radius.lg },
  photo: { width: 84, height: 84, borderRadius: radius.md, overflow: 'hidden' },
  info: { flex: 1, gap: 4 },
  nameRow: { alignItems: 'center', gap: 6, alignSelf: 'stretch' },
  name: { flexShrink: 1 },
  desc: { lineHeight: 18 },
  meta: { alignItems: 'center', gap: 8, paddingTop: 2 },
  heart: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
});
