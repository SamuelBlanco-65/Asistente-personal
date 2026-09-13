# JARVIS STUDENT AI - Asistente Personal Académico Móvil

**JARVIS STUDENT** es un asistente personal autónomo multi-agente para estudiantes universitarios, construido con **React Native / Expo (Android/iOS)**, **FastAPI (Python)**, **Ollama (LLM Local `llama3.2`)**, **Tool Calling nativo**, **Bloqueo Biométrico nativo**, y **Tailscale**.

---

## 🌟 Características Principales

- 🔒 **Gatekeeper de Seguridad Biométrica**: Bloqueo nativo mediante `expo-local-authentication` (Huella digital, Face ID, Passcode). No permite micrófono ni API calls sin autenticación.
- 🎨 **JARVIS Design System**: Interfaz futurista con visualización dinámica del estado del asistente (`IDLE`, `LISTENING`, `PROCESSING`, `SPEAKING`, `ERROR`), Orb animado glowing, y tarjetas de información.
- 🧠 **IA Local & Tool Calling**: Backend alimentado por Ollama (`llama3.2:3b`) ejecutado en tu laptop, garantizando privacidad total.
- 🛠️ **Registro Central de Herramientas**: Gestión autónoma de tareas académicas (`create_task`, `list_tasks`, `get_academic_summary`) con esquemas Pydantic y políticas de permisos (`READ`, `WRITE_LOCAL`, `WRITE_EXTERNAL`, `DESTRUCTIVE`).
- 🤖 **Arquitectura Multi-Agente**: Orquestador Supervisor que clasifica intenciones y coordina agentes de dominio (Académico, Productividad, Comunicaciones).
- 🌐 **Red Encriptada con Tailscale**: Comunicación directa celular ↔ laptop sin exponer el backend a internet ni depender de servidores cloud costosos.

---

## 📁 Estructura del Proyecto

```text
asistentee/
├── backend/                  # Servidor Python FastAPI
│   ├── app/
│   │   ├── main.py           # Punto de entrada ASGI & Middleware
│   │   ├── api/routes/       # Rutas REST (/health, /assistant, /tasks)
│   │   ├── config/           # Pydantic Settings & variables .env
│   │   ├── domain/           # Entidades Pydantic y modelos de datos
│   │   ├── infrastructure/   # Repositorios y SQLite Database
│   │   ├── llm/              # Cliente Ollama & Tool Calling Loop
│   │   ├── tools/            # Registro central & herramientas Pydantic
│   │   └── agents/           # Orquestador Supervisor y agentes
│   ├── tests/                # Suite de pruebas Pytest
│   └── requirements.txt
│
├── src/                      # Aplicación Móvil React Native / Expo
│   ├── app/                  # Rutas de Expo Router (_layout, lock, tabs)
│   ├── components/
│   │   ├── ui/               # Primitivas visuales (Button, Card, ScreenContainer)
│   │   └── assistant/        # JarvisOrb, VoiceButton, TranscriptView, Status
│   ├── services/
│   │   ├── api/              # Cliente HTTP centralizado (Tailscale Backend)
│   │   ├── audio/            # Grabador & Reproductor de audio nativo
│   │   └── auth/             # BiometricAuthService (expo-local-authentication)
│   ├── state/                # authStore y manejador de estado de seguridad
│   └── theme/                # Design Tokens (colors, typography, spacing)
│
├── SETUP.md                  # Guía de instalación paso a paso (Ollama + Tailscale)
├── ARCHITECTURE.md           # Diagramas y especificación arquitectónica
├── SECURITY.md               # Modelo de seguridad y gestión de secretos
└── MCP.md                    # Documentación de interoperabilidad MCP
```

---

## 🚀 Inicio Rápido

Consulta [SETUP.md](file:///c:/Users/Samuel/asistentee/SETUP.md) para la guía completa paso a paso.

### Backend (Laptop)
```bash
py -m pip install -r backend/requirements.txt
py -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend Móvil (Android)
```bash
npm install
npx expo start --android
```
