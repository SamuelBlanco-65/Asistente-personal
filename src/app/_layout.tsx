import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '../state/authStore';
import { colors } from '../theme';

export default function RootLayout() {
  const { status } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const isLockScreen = segments[0] === 'lock';

    if (status === 'AUTHENTICATED' && isLockScreen) {
      // Smooth transition to tabs upon biometric authentication
      router.replace('/(tabs)');
    } else if (status !== 'AUTHENTICATED' && !isLockScreen) {
      // Lock gate: redirect to lock screen if unauthenticated
      router.replace('/lock');
    }
  }, [status, segments]);

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
