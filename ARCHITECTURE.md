# Especificación Arquitectónica - JARVIS STUDENT AI

## 1. Visión General de Arquitectura

El sistema **JARVIS STUDENT** aplica una separación estricta de capas tanto en el frontend móvil como en el backend Python.

```text
Presentation Layer (React Native / Expo UI Components & Design System)
        ↓
Application Services (AuthGuard, AudioRecorder, ApiClient, AuthStore)
        ↓
FastAPI Gateway & Supervisor Multi-Agent Router (Python)
        ↓
Domain Layer & Tool Registry Contracts (Pydantic Schemas & Permisos)
        ↓
Infrastructure Layer (SQLite Database, Ollama Local LLM, Native Audio Providers)
```

---

## 2. Flujo de Datos & Secuencia de Ejecución

```text
[ Usuario Celular Android ]
         │
         │ (1) Autenticación Biométrica (expo-local-authentication)
         ▼
┌──────────────────┐
│   Lock Screen    │ ── (Éxito) ──►  [ JARVIS Interactive Screen ]
└──────────────────┘                            │
                                                │ (2) Entrada de Voz / Texto
                                                ▼
                                    ┌───────────────────────┐
                                    │  ApiClient (Tailscale)│
                                    └───────────────────────┘
                                                │
                                                │ (3) HTTP POST /api/v1/assistant/message
                                                ▼
                                    ┌───────────────────────┐
                                    │ FastAPI Supervisor    │
                                    └───────────────────────┘
                                                │
                                                │ (4) Ollama Chat + Tools (llama3.2)
                                                ▼
                                    ┌───────────────────────┐
                                    │  Tool Registry        │
                                    └───────────────────────┘
                                                │
                                                │ (5) Valida Pydantic & Ejecuta Handler
                                                ▼
                                    ┌───────────────────────┐
                                    │ SQLite TaskRepo DB    │
                                    └───────────────────────┘
                                                │
                                                │ (6) Respuesta estructurada
                                                ▼
                                    [ JARVIS Transcript & Audio Response ]
```

---

## 3. Arquitectura Multi-Agente & Registro de Herramientas

1. **Supervisor Agent**: Responsable de analizar la intención del usuario, aplicar políticas de confirmación según el nivel de riesgo (`READ`, `WRITE_LOCAL`, `WRITE_EXTERNAL`, `DESTRUCTIVE`) y coordinar los agentes especializados.
2. **Academic Agent**: Especializado en tareas, exámenes, notas y resúmenes de estudio.
3. **Productivity Agent**: Especializado en disponibilidad, agenda y recordatorios.
4. **Communication Agent**: Especializado en notificaciones e integraciones.

---

## 4. Evolución Futurible

- **SQLite ➔ PostgreSQL**: Los repositorios abstraen el acceso a datos permitiendo migración transparente.
- **In-process Tools ➔ MCP Servers**: `ToolRegistry` está diseñado para envolver servidores de herramientas MCP externos sin modificar el orquestador.
