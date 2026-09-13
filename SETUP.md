# Guía de Instalación y Configuración - JARVIS STUDENT AI

Esta guía contiene los pasos exactos para configurar y ejecutar la solución **JARVIS STUDENT AI** en tu computadora (Windows/macOS/Linux) y tu dispositivo móvil (Android).

---

## 1. Requisitos Previos

- **Node.js**: v18+ o v20+
- **Python**: v3.11+ o v3.12+
- **Ollama**: Instalado localmente en tu laptop
- **Expo Go** o **Android Emulator / Dispositivo Físico**

---

## 2. Configuración de Ollama (LLM Local)

1. Descarga e instala Ollama desde [ollama.com](https://ollama.com).
2. Abre tu terminal de Windows (PowerShell / CMD) y descarga el modelo **`llama3.2`**:
   ```bash
   ollama pull llama3.2
   ```
3. Verifica que Ollama se esté ejecutando en segundo plano en `http://127.0.0.1:11434`:
   ```bash
   ollama list
   ```

---

## 3. Configuración del Backend (FastAPI Python)

1. Ve a la raíz del proyecto y crea un entorno virtual de Python:
   ```bash
   py -m venv venv
   ```
2. Activa el entorno virtual en Windows PowerShell:
   ```bash
   .\venv\Scripts\Activate.ps1
   ```
3. Instala las dependencias:
   ```bash
   pip install -r backend/requirements.txt
   ```
4. Inicia el servidor backend en `http://0.0.0.0:8000`:
   ```bash
   py -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
   ```
5. Comprueba el estado del sistema en tu navegador ingresando a:
   [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)

---

## 4. Configuración Paso a Paso de Tailscale (Red Encriptada Celular ↔ Laptop)

Dado que la aplicación móvil se ejecuta en tu celular Android y el backend/Ollama corre en tu laptop, **Tailscale** conecta ambos dispositivos de forma segura y encriptada sin exponer tu laptop a Internet.

### Paso A: En tu Laptop (Windows)
1. Ve a [tailscale.com](https://tailscale.com) y crea una cuenta gratuita.
2. Descarga e instala **Tailscale para Windows**.
3. Inicia sesión en la aplicación de Tailscale en tu laptop.
4. Abre PowerShell o haz clic en el icono de Tailscale en la barra de tareas y copia tu **IP de Tailscale** (comienza por `100.x.y.z`, por ejemplo `100.85.12.34`).

### Paso B: En tu Celular Android
1. Abre Google Play Store y descarga la aplicación **Tailscale**.
2. Inicia sesión con la **misma cuenta** que usaste en la laptop.
3. Activa el interruptor de conexión en la app de Tailscale en Android.

### Paso C: Conectar la App Móvil
1. Copia tu IP de Tailscale (ejemplo: `http://100.85.12.34:8000`).
2. Agrégala en tu archivo `.env` del frontend:
   ```env
   EXPO_PUBLIC_BACKEND_URL=http://100.85.12.34:8000
   ```
3. O ingrésala directamente en la pantalla de **Ajustes** de la app móvil JARVIS.

---

## 5. Configuración del Frontend Móvil (React Native / Expo)

1. Instala las dependencias de JavaScript:
   ```bash
   npm install
   ```
2. Inicia el servidor de desarrollo de Expo:
   ```bash
   npx expo start --android
   ```
3. Escanea el código QR con la app **Expo Go** en tu celular Android o presiona `a` para abrirlo en el emulador de Android.

---

## 6. Flujo de Prueba de Extremo a Extremo (E2E)

1. **Pantalla de Bloqueo Biométrico**: Al abrir la app, presiona *"Autenticar con Huella / Rostro"*. Tu celular solicitará la autenticación nativa de Android.
2. **Asistente JARVIS**: Una vez desbloqueado, presiona el botón **🎤 Hablar** o escribe un comando en el chat.
3. **Ejecución de Herramientas**: Prueba diciendo o escribiendo:
   > *"Agrega estudiar cálculo multivariable para el 15 de septiembre con prioridad alta"*
4. **Verificación**: JARVIS procesará la solicitud con `llama3.2`, llamará autónomamente a la tool `create_task`, guardará el registro en la base de datos SQLite y te responderá confirmando la tarea creada.
