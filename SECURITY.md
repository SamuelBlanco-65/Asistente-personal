# Especificación de Seguridad & Gestión de Secretos - JARVIS STUDENT AI

## 1. Reglas Absolutas de Seguridad de Secretos

> [!CAUTION]
> **REGLA ABSOLUTA**: NUNCA almacenar secretos sensibles (tales como `GOOGLE_CLIENT_SECRET`, `MICROSOFT_CLIENT_SECRET`, `GITHUB_PRIVATE_KEY`, tokens de actualización o claves API privadas) en el archivo `.env` del cliente móvil (`mobile/.env`).

- Un archivo `.env` de React Native no es un vault seguro; es visible en el bundle compilado.
- El cliente móvil sólo maneja variables públicas como `EXPO_PUBLIC_BACKEND_URL`.
- Todos los secretos OAuth y claves de API privadas residen **exclusivamente** en el backend Python FastAPI.

---

## 2. Gatekeeper de Seguridad Biométrica (Móvil)

```text
[ Inicio de la App ]
         │
         ▼
 ┌──────────────┐
 │    LOCKED    │ ── (Sin micrófonos, sin comandos, sin API execution)
 └──────────────┘
         │
         │ (Autenticación nativa del S.O. vía expo-local-authentication)
         ▼
 ┌──────────────┐
 │ AUTHENTICATED│ ── (Acceso habilitado al asistente JARVIS)
 └──────────────┘
```

- La huella digital o datos biométricos **nunca** son leídos ni almacenados por la app; la app únicamente recibe la señal booleana de éxito del sistema operativo.
- El estado de autenticación puede invalidarse al cerrar o tras un tiempo de inactividad.

---

## 3. Red Encriptada Tailscale

- La comunicación entre el teléfono celular Android y el backend FastAPI en la laptop se canaliza a través de un túnel VPN encriptado de punta a punta con **Tailscale**.
- Ollama escucha localmente en la laptop (`127.0.0.1:11434`) y no está expuesto directamente al teléfono celular ni a internet.
