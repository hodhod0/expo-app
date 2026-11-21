import '@/i18n';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useSettingsStore } from '@/store/useSettingsStore';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';
import { fontAssets } from '@/theme/typography';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 5 * 60 * 1000, retry: 1 } },
});

function RootStack() {
  const { colors, scheme } = useTheme();
  const language = useSettingsStore((s) => s.language);
  const { i18n } = useTranslation();

  useEffect(() => {
    if (i18n.language !== language) i18n.changeLanguage(language);
  }, [language, i18n]);

  return (
    <>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="category/[id]" />
        <Stack.Screen name="dish/[id]" />
        <Stack.Screen name="order" />
        <Stack.Screen name="search" />
        <Stack.Screen name="scan" options={{ presentation: 'fullScreenModal' }} />
        <Stack.Screen
          name="(sheets)/filters"
          options={{ presentation: 'formSheet', sheetAllowedDetents: [0.9], sheetGrabberVisible: true }}
        />
        <Stack.Screen
          name="(sheets)/call-waiter"
          options={{ presentation: 'formSheet', sheetAllowedDetents: [0.75], sheetGrabberVisible: true }}
        />
        <Stack.Screen
          name="(sheets)/appearance"
          options={{ presentation: 'formSheet', sheetAllowedDetents: [0.55], sheetGrabberVisible: true }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts(fontAssets);

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <RootStack />
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
