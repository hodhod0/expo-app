import { router } from 'expo-router';
import { BellRing } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { useContentInset } from '@/hooks/useContentInset';
import { useRtl } from '@/hooks/useRtl';
import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/spacing';

/** Floating "Call waiter" pill — bottom corner, above the tab bar. */
export function CallWaiterFab() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { isRTL, row } = useRtl();
  const inset = useContentInset();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push('/call-waiter')}
      style={({ pressed }) => [
        styles.fab,
        isRTL ? { left: inset } : { right: inset },
        { flexDirection: row, backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 },
      ]}>
      <BellRing size={18} color={colors.onColor} />
      <AppText variant="bodySmall" weight="semibold" color="onColor">
        {t('waiter.call')}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 16,
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: radius.pill,
    boxShadow: '0 8px 20px rgba(30, 25, 20, 0.25)',
  },
});
