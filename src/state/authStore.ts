import { useState, useEffect } from 'react';
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
    globalStatus = 'AUTHENTICATING';
    globalErrorMessage = null;
    notify();

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
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = authStore.subscribe(() => {
      setTick((t) => t + 1);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return {
    status: authStore.getStatus(),
    errorMessage: authStore.getErrorMessage(),
    authenticate: authStore.authenticate,
    lock: authStore.lock,
  };
}
