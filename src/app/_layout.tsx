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
      // Smooth transition to assistant tabs upon biometric authentication
      console.log('[_layout] Authenticated successfully, redirecting to /');
      router.replace('/');
    } else if (status !== 'AUTHENTICATED' && !isLockScreen) {
      // Lock gate: redirect to lock screen if unauthenticated
      console.log('[_layout] Unauthenticated access detected, redirecting to /lock');
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
