import { router } from 'expo-router';
import { ChevronLeft, ChevronRight, type LucideIcon } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { IconButton } from '@/components/ui/IconButton';
import { useRtl } from '@/hooks/useRtl';

type Props = {
  title: string;
  /** Round icon button on the end side… */
  action?: { icon: LucideIcon; label: string; onPress: () => void };
  /** …or a text link (e.g. "Clear"). */
  textAction?: { label: string; onPress: () => void };
};

/** Back button · centred title · optional action (Figma "Top Bar"). */
export function TopBar({ title, action, textAction }: Props) {
  const { t } = useTranslation();
  const { isRTL, row } = useRtl();

  return (
    <View style={[styles.bar, { flexDirection: row }]}>
      <IconButton
        icon={isRTL ? ChevronRight : ChevronLeft}
        size={44}
        accessibilityLabel={t('common.back')}
        onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
      />
      <AppText variant="heading" numberOfLines={1} style={styles.title}>
        {title}
      </AppText>
      {action ? (
        <IconButton icon={action.icon} size={44} accessibilityLabel={action.label} onPress={action.onPress} />
      ) : textAction ? (
        <Pressable accessibilityRole="button" hitSlop={8} onPress={textAction.onPress} style={styles.textAction}>
          <AppText variant="bodySmall" weight="semibold" color="primary" numberOfLines={1}>
            {textAction.label}
          </AppText>
        </Pressable>
      ) : (
        <View style={styles.spacer} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  title: { flex: 1, textAlign: 'center' },
  spacer: { width: 44 },
  textAction: { minWidth: 44, alignItems: 'flex-end' },
});
