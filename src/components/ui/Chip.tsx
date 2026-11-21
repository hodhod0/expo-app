import { Pressable, StyleSheet } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/spacing';

import { AppText } from './AppText';

type Props = { label: string; active?: boolean; onPress?: () => void };

/** Figma "Chip" — State=Active (dark fill) | Default (outlined). */
export function Chip({ label, active = false, onPress }: Props) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: active ? colors.ink : colors.surface,
          borderColor: active ? colors.ink : colors.line,
          opacity: pressed ? 0.8 : 1,
        },
      ]}>
      <AppText variant="bodySmall" weight={active ? 'semibold' : 'medium'} color={active ? 'surface' : 'ink'}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: radius.pill, borderWidth: 1 },
});
