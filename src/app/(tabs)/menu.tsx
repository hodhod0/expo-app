import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { SearchBar } from '@/components/home/SearchBar';
import { CategoryGrid, MAX_CONTENT_WIDTH } from '@/components/menu/CategoryGrid';
import { ViewOrderBar } from '@/components/order/ViewOrderBar';
import { AppText } from '@/components/ui/AppText';
import { Screen } from '@/components/ui/Screen';
import { useRtl } from '@/hooks/useRtl';

/** Menu tab — every main category (also opened by "See all" on Home). */
export default function MenuScreen() {
  const { t } = useTranslation();
  const { start } = useRtl();

  return (
    <View style={styles.root}>
      <Screen scroll contentStyle={styles.content}>
        <View style={{ alignItems: start, gap: 4 }}>
          <AppText variant="display">{t('menu.title')}</AppText>
          <AppText variant="bodySmall" color="muted">
            {t('menu.subtitle')}
          </AppText>
        </View>
        <SearchBar />
        <CategoryGrid />
      </Screen>
      <ViewOrderBar />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { width: '100%', maxWidth: MAX_CONTENT_WIDTH, alignSelf: 'center', paddingBottom: 96 },
});
