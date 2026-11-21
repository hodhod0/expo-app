import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { useRtl } from '@/hooks/useRtl';
import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/spacing';

type Props = {
  title: string;
  count: string;
  tint: string;
  imageUrl?: string;
  width: number;
  onPress: () => void;
};

/** Figma "Category Card": photo, title and item count. */
export function CategoryCard({ title, count, tint, imageUrl, width, onPress }: Props) {
  const { colors } = useTheme();
  const { start } = useRtl();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${count}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { width, backgroundColor: colors.surface, opacity: pressed ? 0.85 : 1 },
      ]}>
      <View style={[styles.photo, { backgroundColor: tint }]}>
        {imageUrl ? <Image source={imageUrl} style={StyleSheet.absoluteFill} contentFit="cover" /> : null}
      </View>
      <View style={[styles.text, { alignItems: start }]}>
        <AppText variant="subheading" numberOfLines={1}>
          {title}
        </AppText>
        <AppText variant="caption" weight="regular" color="muted">
          {count}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.xl - 6, padding: 10, paddingBottom: 14, gap: 10 },
  photo: { height: 110, borderRadius: radius.md, overflow: 'hidden' },
  text: { paddingHorizontal: 4, gap: 2 },
});
