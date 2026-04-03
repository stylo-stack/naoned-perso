import React from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { useDashboard } from '@/hooks/useDashboard';
import { DashboardContext } from '@/context/DashboardContext';
import { BRICK_REGISTRY } from '@/bricks/registry';

function BrickProviders({ children }: { children: React.ReactNode }) {
  return BRICK_REGISTRY.reduceRight<React.ReactNode>((acc, brick) => {
    if (!brick.Provider) return acc;
    const Provider = brick.Provider;
    return <Provider>{acc}</Provider>;
  }, children) as React.ReactElement;
}

export default function RootLayout() {
  const dashboard = useDashboard();

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <BrickProviders>
          <DashboardContext.Provider value={dashboard}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen
                name="catalogue"
                options={{ presentation: 'modal' }}
              />
              <Stack.Screen name="bricks/naolib" />
              <Stack.Screen name="bricks/weather" />
              <Stack.Screen name="bricks/agenda" />
              <Stack.Screen name="bricks/clock" />
            </Stack>
          </DashboardContext.Provider>
        </BrickProviders>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
