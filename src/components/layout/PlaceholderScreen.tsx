import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/ui/AppText';
import { Screen } from '@/components/ui/Screen';

/** Temporary body for screens we haven't built yet — shows which Figma frame it maps to. */
export function PlaceholderScreen({ title, figma }: { title: string; figma: string }) {
  const { t } = useTranslation();
  return (
    <Screen>
      <AppText variant="display">{title}</AppText>
      <AppText color="muted">{t('common.comingSoon')}</AppText>
      <AppText variant="caption" color="muted">
        Figma: {figma}
      </AppText>
    </Screen>
  );
}
