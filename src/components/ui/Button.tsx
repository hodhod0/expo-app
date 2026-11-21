import { Pressable, StyleSheet, type PressableProps } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/spacing';

import { AppText } from './AppText';

type Props = Omit<PressableProps, 'children'> & {
  label: string;
  variant?: 'primary' | 'outline';
};

/** Figma "Button" component — Style=Primary | Outline. */
export function Button({ label, variant = 'primary', style, ...rest }: Props) {
  const { colors } = useTheme();
  const primary = variant === 'primary';
  return (
    <Pressable
      accessibilityRole="button"
      {...rest}
      style={(state) => [
        styles.base,
        {
          backgroundColor: primary ? colors.primary : colors.surface,
          borderColor: primary ? colors.primary : colors.line,
          opacity: state.pressed ? 0.85 : 1,
        },
        typeof style === 'function' ? style(state) : style,
      ]}>
      <AppText variant="subheading" color={primary ? 'onColor' : 'ink'} style={styles.label}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 56,
    borderRadius: radius.lg - 2,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  label: { textAlign: 'center' },
});
