import '@/i18n';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { useDashboard } from '@/hooks/useDashboard';
import { DashboardContext } from '@/context/DashboardContext';
import { LanguageProvider, useLanguage } from '@/context/LanguageContext';
import { colors } from '@/theme';

function AppNavigator() {
  const { isLoading } = useLanguage();

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="catalogue" options={{ presentation: 'modal' }} />
      <Stack.Screen name="settings" options={{ presentation: 'modal' }} />
      <Stack.Screen name="bricks/clock" />
      <Stack.Screen name="bricks/wait-time" />
    </Stack>
  );
}

export default function RootLayout() {
  const dashboard = useDashboard();

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <LanguageProvider>
          <DashboardContext.Provider value={dashboard}>
            <AppNavigator />
          </DashboardContext.Provider>
        </LanguageProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});
