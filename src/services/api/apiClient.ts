import Constants from 'expo-constants';

const DEFAULT_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';

export interface APIErrorResponse {
  error: {
    code: string;
    message: string;
    request_id?: string;
  };
}

export class ApiClient {
  private static baseUrl: string = DEFAULT_BACKEND_URL;

  static setBaseUrl(url: string) {
    this.baseUrl = url.replace(/\/$/, '');
  }

  static getBaseUrl(): string {
    return this.baseUrl;
  }

  static async get<T>(endpoint: string, timeoutMs = 8000): Promise<T> {
    return this.request<T>('GET', endpoint, undefined, timeoutMs);
  }

  static async post<T>(endpoint: string, body?: any, timeoutMs = 15000): Promise<T> {
    return this.request<T>('POST', endpoint, body, timeoutMs);
  }

  private static async request<T>(
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    endpoint: string,
    body?: any,
    timeoutMs = 10000
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const fullUrl = `${this.baseUrl}${cleanEndpoint}`;

    try {
      const response = await fetch(fullUrl, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errData: APIErrorResponse | null = null;
        try {
          errData = await response.json();
        } catch (_) {}

        throw new Error(
          errData?.error?.message || `Error en servidor HTTP ${response.status}: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error(`Timeout: La solicitud al backend (${this.baseUrl}) excedió los ${timeoutMs / 1000}s`);
      }
      throw new Error(error.message || 'Error de conexión con el backend de JARVIS');
    }
  }
}
