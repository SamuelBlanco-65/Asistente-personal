import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../components/ui/ScreenContainer';
import { Button } from '../components/ui/Button';
import { JarvisOrb } from '../components/assistant/JarvisOrb';
import { useAuthStore } from '../state/authStore';
import { colors, typography, spacing, radii } from '../theme';

export default function LockScreen() {
  const { status, errorMessage, authenticate, unlockWithPasscode } = useAuthStore();
  const [showPinInput, setShowPinInput] = useState(false);
  const [pin, setPin] = useState('');
  const hasAttemptedRef = useRef(false);
  const router = useRouter();

  useEffect(() => {
    // Delay prompt slightly to let screen transition and Android window focus stabilize
    const timer = setTimeout(async () => {
      if (status === 'LOCKED' && !hasAttemptedRef.current) {
        hasAttemptedRef.current = true;
        const success = await authenticate();
        if (success) {
          router.replace('/');
        }
      }
    }, 350);

    return () => clearTimeout(timer);
  }, []);

  const handleManualUnlock = async () => {
    const success = await authenticate();
    if (success) {
      router.replace('/');
    }
  };

  const handlePinUnlock = () => {
    if (unlockWithPasscode(pin)) {
      router.replace('/');
    }
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
          disabled={status === 'AUTHENTICATING'}
          style={styles.unlockButton}
        />

        {showPinInput ? (
          <View style={styles.pinContainer}>
            <TextInput
              style={styles.pinInput}
              placeholder="PIN de Respaldo (ej: 1234)"
              placeholderTextColor={colors.text.muted}
              secureTextEntry
              keyboardType="numeric"
              value={pin}
              onChangeText={setPin}
              onSubmitEditing={handlePinUnlock}
            />
            <Button
              title="Confirmar PIN"
              onPress={handlePinUnlock}
              variant="secondary"
              style={styles.confirmPinButton}
            />
          </View>
        ) : (
          <Button
            title="Usar PIN de respaldo (1234)"
            onPress={() => setShowPinInput(true)}
            variant="ghost"
            style={styles.fallbackButton}
            textStyle={styles.fallbackText}
          />
        )}
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
  pinContainer: {
    width: '100%',
    marginTop: spacing.lg,
  },
  pinInput: {
    backgroundColor: colors.background.card,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.background.cardBorder,
    textAlign: 'center',
    fontSize: typography.fontSize.lg,
    letterSpacing: 4,
    marginBottom: spacing.sm,
  },
  confirmPinButton: {
    width: '100%',
  },
  fallbackButton: {
    marginTop: spacing.md,
  },
  fallbackText: {
    fontSize: typography.fontSize.xs,
    color: colors.text.muted,
  },
});
