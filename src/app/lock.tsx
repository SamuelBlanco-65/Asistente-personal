import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenContainer } from '../components/ui/ScreenContainer';
import { Button } from '../components/ui/Button';
import { JarvisOrb } from '../components/assistant/JarvisOrb';
import { useAuthStore } from '../state/authStore';
import { colors, typography, spacing } from '../theme';

export default function LockScreen() {
  const { status, errorMessage, authenticate } = useAuthStore();
  const hasAttemptedRef = useRef(false);

  useEffect(() => {
    // Attempt biometric unlock on initial screen launch
    if (status === 'LOCKED' && !hasAttemptedRef.current) {
      hasAttemptedRef.current = true;
      authenticate();
    }
  }, []);

  const handleManualUnlock = () => {
    authenticate();
  };

  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>JARVIS STUDENT</Text>
        <Text style={styles.subtitle}>Acceso Biométrico Requerido</Text>

        <JarvisOrb state={status === 'AUTHENTICATING' ? 'PROCESSING' : status === 'AUTH_ERROR' ? 'ERROR' : 'IDLE'} size={160} />

        {errorMessage && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        <Button
          title={status === 'AUTHENTICATING' ? 'Autenticando...' : '🔓 Autenticar con Huella / Rostro'}
          onPress={handleManualUnlock}
          loading={status === 'AUTHENTICATING'}
          style={styles.unlockButton}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize.hero,
    fontWeight: typography.fontWeight.bold,
    color: colors.cyan.glow,
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    marginBottom: spacing.xl,
  },
  unlockButton: {
    marginTop: spacing.xl,
    width: '100%',
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: colors.status.error,
    padding: spacing.md,
    borderRadius: spacing.sm,
    marginTop: spacing.md,
    width: '100%',
  },
  errorText: {
    color: colors.status.error,
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
  },
});
