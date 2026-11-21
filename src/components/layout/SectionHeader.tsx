import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { useRtl } from '@/hooks/useRtl';

type Props = { title: string; actionLabel?: string; onAction?: () => void };

export function SectionHeader({ title, actionLabel, onAction }: Props) {
  const { row } = useRtl();
  return (
    <View style={[styles.row, { flexDirection: row }]}>
      <AppText variant="heading">{title}</AppText>
      {actionLabel ? (
        <Pressable accessibilityRole="button" hitSlop={8} onPress={onAction}>
          <AppText variant="bodySmall" weight="semibold" color="primary">
            {actionLabel}
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { alignItems: 'center', justifyContent: 'space-between' },
});
