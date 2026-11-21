import { Heart } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring } from 'react-native-reanimated';

import { useFavouritesStore } from '@/store/useFavouritesStore';
import { useTheme } from '@/theme/ThemeProvider';

type Props = { dishId: string; size?: number; style?: StyleProp<ViewStyle>; mutedOutline?: boolean };

/** Favourite toggle whose heart "pops" when a dish is saved. */
export function HeartButton({ dishId, size = 18, style, mutedOutline = true }: Props) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const saved = useFavouritesStore((s) => s.ids.includes(dishId));
  const toggle = useFavouritesStore((s) => s.toggle);
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));

  const onPress = () => {
    if (!saved) {
      scale.set(withSequence(withSpring(1.35, { damping: 6, stiffness: 400 }), withSpring(1, { damping: 10 })));
    }
    toggle(dishId);
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t(saved ? 'category.removeFavourite' : 'category.addFavourite')}
      accessibilityState={{ selected: saved }}
      hitSlop={8}
      onPress={onPress}
      style={style}>
      <Animated.View style={animatedStyle}>
        <Heart
          size={size}
          color={saved || !mutedOutline ? colors.primary : colors.muted}
          fill={saved ? colors.primary : 'transparent'}
        />
      </Animated.View>
    </Pressable>
  );
}
