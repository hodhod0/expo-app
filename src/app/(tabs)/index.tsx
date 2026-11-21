import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { CallWaiterFab } from '@/components/home/CallWaiterFab';
import { ChefPickBanner } from '@/components/home/ChefPickBanner';
import { HomeHeader } from '@/components/home/HomeHeader';
import { SearchBar } from '@/components/home/SearchBar';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { CategoryGrid, MAX_CONTENT_WIDTH } from '@/components/menu/CategoryGrid';
import { Screen } from '@/components/ui/Screen';

/** 01 · Home */
export default function HomeScreen() {
  const { t } = useTranslation();

  return (
    <View style={styles.root}>
      <Screen scroll contentStyle={styles.content}>
        <HomeHeader />
        <SearchBar />
        <ChefPickBanner />
        <SectionHeader
          title={t('home.explore')}
          actionLabel={t('home.seeAll')}
          onAction={() => router.navigate('/menu')}
        />
        <CategoryGrid />
      </Screen>
      <CallWaiterFab />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: 'center',
    paddingBottom: 96, // room for the Call waiter button
  },
});
