import type { LucideIcon } from 'lucide-react-native';
import { Pressable, type PressableProps } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';

type Props = Omit<PressableProps, 'children' | 'style'> & {
  icon: LucideIcon;
  size?: number;
  accessibilityLabel: string;
};

/** Round outlined button (theme toggle, back, search…). */
export function IconButton({ icon: Icon, size = 36, ...rest }: Props) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      hitSlop={6}
      {...rest}
      style={({ pressed }) => ({
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 1,
        borderColor: colors.line,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: pressed ? 0.7 : 1,
      })}>
      <Icon size={Math.round(size * 0.5)} color={colors.ink} strokeWidth={1.8} />
    </Pressable>
  );
}
