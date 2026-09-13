import React from 'react';
import { Stack } from 'expo-router';
import { useAuthStore } from '../state/authStore';
import { colors } from '../theme';
import LockScreen from './lock';

export default function RootLayout() {
  const { status } = useAuthStore();

  console.log(`[_layout] Render root -> status: ${status}`);

  if (status !== 'AUTHENTICATED') {
    return <LockScreen />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background.darkest },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="lock" />
    </Stack>
  );
}
