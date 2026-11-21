import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { PRESSED_SCALE, pressSpring } from '@/theme/motion';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
  /** How far to shrink while pressed (default 0.97). */
  pressedScale?: number;
};

/** Pressable that gently shrinks while pressed and springs back on release. */
export function PressableScale({ style, pressedScale = PRESSED_SCALE, onPressIn, onPressOut, ...rest }: Props) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));

  return (
    <AnimatedPressable
      {...rest}
      onPressIn={(e) => {
        scale.set(withSpring(pressedScale, pressSpring));
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.set(withSpring(1, pressSpring));
        onPressOut?.(e);
      }}
      style={[style, animatedStyle]}
    />
  );
}
