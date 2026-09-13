import { useSyncExternalStore } from 'react';
import { BiometricAuthService, AuthStatus } from '../services/auth/biometricAuth';

export interface AuthState {
  status: AuthStatus;
  errorMessage: string | null;
  authenticate: () => Promise<boolean>;
  lock: () => void;
}

let globalStatus: AuthStatus = 'LOCKED';
let globalErrorMessage: string | null = null;
const listeners = new Set<() => void>();

function notify() {
  console.log(`[authStore] State changed -> status: ${globalStatus}`);
  listeners.forEach((listener) => listener());
}

export const authStore = {
  getStatus(): AuthStatus {
    return globalStatus;
  },

  getErrorMessage(): string | null {
    return globalErrorMessage;
  },

  async authenticate(): Promise<boolean> {
    if (globalStatus === 'AUTHENTICATING') {
      console.warn('[authStore] Authentication already in progress, skipping concurrent call.');
      return false;
    }

    globalStatus = 'AUTHENTICATING';
    globalErrorMessage = null;
    notify();

    try {
      const result = await BiometricAuthService.authenticate();
      if (result.success) {
        globalStatus = 'AUTHENTICATED';
        globalErrorMessage = null;
        notify();
        return true;
      } else {
        globalStatus = 'AUTH_ERROR';
        globalErrorMessage = result.error || 'Autenticación no superada.';
        notify();
        return false;
      }
    } catch (err: any) {
      globalStatus = 'AUTH_ERROR';
      globalErrorMessage = err?.message || 'Error inesperado.';
      notify();
      return false;
    }
  },

  unlockWithPasscode(passcode: string): boolean {
    // Student emergency passcode fallback: '0000' or '1234'
    if (passcode === '0000' || passcode === '1234') {
      globalStatus = 'AUTHENTICATED';
      globalErrorMessage = null;
      notify();
      return true;
    } else {
      globalStatus = 'AUTH_ERROR';
      globalErrorMessage = 'PIN incorrecto.';
      notify();
      return false;
    }
  },

  unlockDirectly() {
    globalStatus = 'AUTHENTICATED';
    globalErrorMessage = null;
    notify();
  },

  lock() {
    globalStatus = 'LOCKED';
    globalErrorMessage = null;
    notify();
  },

  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

export function useAuthStore() {
  const status = useSyncExternalStore(
    authStore.subscribe,
    authStore.getStatus
  );
  const errorMessage = useSyncExternalStore(
    authStore.subscribe,
    authStore.getErrorMessage
  );

  return {
    status,
    errorMessage,
    authenticate: authStore.authenticate,
    unlockWithPasscode: authStore.unlockWithPasscode,
    unlockDirectly: authStore.unlockDirectly,
    lock: authStore.lock,
  };
}
