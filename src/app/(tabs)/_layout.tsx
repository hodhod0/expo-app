import { Tabs } from 'expo-router';
import { Heart, House, Info, LayoutGrid } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@/theme/ThemeProvider';

/** Bottom tab bar from the Figma "Tab Bar": Home · Menu · Favourites · Info. */
export default function TabsLayout() {
  const { colors, fonts } = useTheme();
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.line },
        tabBarLabelStyle: { fontFamily: fonts.semibold, fontSize: 11 },
      }}>
      <Tabs.Screen
        name="index"
        options={{ title: t('tabs.home'), tabBarIcon: ({ color }) => <House color={color} size={22} /> }}
      />
      <Tabs.Screen
        name="menu"
        options={{ title: t('tabs.menu'), tabBarIcon: ({ color }) => <LayoutGrid color={color} size={22} /> }}
      />
      <Tabs.Screen
        name="favourites"
        options={{ title: t('tabs.favourites'), tabBarIcon: ({ color }) => <Heart color={color} size={22} /> }}
      />
      <Tabs.Screen
        name="info"
        options={{ title: t('tabs.info'), tabBarIcon: ({ color }) => <Info color={color} size={22} /> }}
      />
    </Tabs>
  );
}
