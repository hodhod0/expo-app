import { Check } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useRtl } from '@/hooks/useRtl';
import { useTheme } from '@/theme/ThemeProvider';

type Props = { checked: boolean; onChange: (checked: boolean) => void; children: ReactNode };

export function Checkbox({ checked, onChange, children }: Props) {
  const { colors } = useTheme();
  const { row } = useRtl();
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      hitSlop={6}
      onPress={() => onChange(!checked)}
      style={[styles.row, { flexDirection: row }]}>
      <View
        style={[
          styles.box,
          checked
            ? { backgroundColor: colors.primary, borderColor: colors.primary }
            : { backgroundColor: colors.surface, borderColor: colors.line },
        ]}>
        {checked && <Check size={14} color={colors.onColor} strokeWidth={3} />}
      </View>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { alignItems: 'center', gap: 10, flexShrink: 1 },
  box: { width: 20, height: 20, borderRadius: 6, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
});
