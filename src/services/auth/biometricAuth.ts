let LocalAuthModule: typeof import('expo-local-authentication') | null = null;
try {
  LocalAuthModule = require('expo-local-authentication');
} catch (error) {
  // Silent fallback on initial require
}

export type AuthStatus = 'LOCKED' | 'AUTHENTICATING' | 'AUTHENTICATED' | 'AUTH_ERROR';

export interface BiometricCapabilities {
  hasHardware: boolean;
  isEnrolled: boolean;
  supportedTypes: any[];
}

export class BiometricAuthService {
  /**
   * Check if hardware and enrolled biometrics (Fingerprint, Face ID, Iris) are available on device.
   */
  static async checkCapabilities(): Promise<BiometricCapabilities> {
    if (!LocalAuthModule) {
      return {
        hasHardware: false,
        isEnrolled: false,
        supportedTypes: [],
      };
    }
    try {
      const hasHardware = await LocalAuthModule.hasHardwareAsync();
      const isEnrolled = await LocalAuthModule.isEnrolledAsync();
      const supportedTypes = await LocalAuthModule.supportedAuthenticationTypesAsync();

      return {
        hasHardware,
        isEnrolled,
        supportedTypes,
      };
    } catch (error) {
      console.error('[BiometricAuthService] Error checking capabilities:', error);
      return {
        hasHardware: false,
        isEnrolled: false,
        supportedTypes: [],
      };
    }
  }

  /**
   * Triggers native biometric prompt (Fingerprint / Face ID / Device Passcode).
   * Returns true on success, false on failure or cancellation.
   */
  static async authenticate(promptReason = 'Desbloquear JARVIS Student Assistant'): Promise<{ success: boolean; error?: string }> {
    if (!LocalAuthModule) {
      console.warn('[BiometricAuthService] LocalAuthentication module missing. Granting access in dev fallback mode.');
      return { success: true };
    }

    try {
      const capabilities = await this.checkCapabilities();
      if (!capabilities.hasHardware || !capabilities.isEnrolled) {
        console.warn('[BiometricAuthService] Hardware/enrollment check failed. Attempting native prompt with fallback.');
      }

      // Safe clean cross-platform options compatible with Android BiometricPrompt
      console.log('[BiometricAuthService] Launching biometric prompt...');
      let timerId: any = null;

      const authPromise = LocalAuthModule.authenticateAsync({
        promptMessage: promptReason,
        cancelLabel: 'Cancelar',
        disableDeviceFallback: false,
        requireConfirmation: false,
        biometricsSecurityLevel: 'strong',
      });

      // Timeout safety net (10 seconds max to prevent promise deadlock on Android)
      const timeoutPromise = new Promise<{ success: boolean; error?: string }>((resolve) => {
        timerId = setTimeout(async () => {
          console.warn('[BiometricAuthService] Auth timeout exceeded. Canceling prompt.');
          try {
            if (LocalAuthModule?.cancelAuthenticate) {
              await LocalAuthModule.cancelAuthenticate();
            }
          } catch (cancelErr) {
            console.error('[BiometricAuthService] Error canceling authenticate:', cancelErr);
          }
          resolve({ success: false, error: 'La respuesta biométrica tardó demasiado. Intenta nuevamente.' });
        }, 10000);
      });

      const result = await Promise.race([authPromise, timeoutPromise]);
      if (timerId) {
        clearTimeout(timerId);
      }

      console.log('[BiometricAuthService] Auth result:', JSON.stringify(result));

      if (result && result.success) {
        return { success: true };
      } else {
        return {
          success: false,
          error: result?.error || 'Autenticación biométrica fallida o cancelada.',
        };
      }
    } catch (error: any) {
      console.error('[BiometricAuthService] Exception during authentication:', error);
      return {
        success: false,
        error: error?.message || 'Error inesperado durante la autenticación.',
      };
    }
  }

  static async cancelAuthentication(): Promise<void> {
    try {
      if (LocalAuthModule?.cancelAuthenticate) {
        await LocalAuthModule.cancelAuthenticate();
      }
    } catch (e) {
      console.warn('[BiometricAuthService] Error during manual cancel:', e);
    }
  }
}
