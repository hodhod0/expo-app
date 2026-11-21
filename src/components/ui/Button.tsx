import { StyleSheet, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/spacing';

import { AppText } from './AppText';
import { PressableScale } from './PressableScale';

type Props = Omit<PressableProps, 'children' | 'style'> & {
  style?: StyleProp<ViewStyle>;
  label: string;
  variant?: 'primary' | 'outline';
};

/** Figma "Button" component — Style=Primary | Outline. */
export function Button({ label, variant = 'primary', style, ...rest }: Props) {
  const { colors } = useTheme();
  const primary = variant === 'primary';
  return (
    <PressableScale
      accessibilityRole="button"
      {...rest}
      style={[
        styles.base,
        { backgroundColor: primary ? colors.primary : colors.surface, borderColor: primary ? colors.primary : colors.line },
        style,
      ]}>
      <AppText variant="subheading" color={primary ? 'onColor' : 'ink'} style={styles.label}>
        {label}
      </AppText>
    </PressableScale>
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
