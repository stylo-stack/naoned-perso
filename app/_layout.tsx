import '@/i18n';
import React from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { useDashboard } from '@/hooks/useDashboard';
import { DashboardContext } from '@/context/DashboardContext';

export default function RootLayout() {
  const dashboard = useDashboard();

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <DashboardContext.Provider value={dashboard}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen
              name="catalogue"
              options={{ presentation: 'modal' }}
            />
            <Stack.Screen name="bricks/clock" />
            <Stack.Screen name="bricks/wait-time" />
          </Stack>
        </DashboardContext.Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
