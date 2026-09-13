# Interoperabilidad & Especificación MCP - JARVIS STUDENT AI

## 1. Principio Fundamental de MCP

El **Model Context Protocol (MCP)** se considera una **capa de interoperabilidad y contexto** durante el desarrollo y extensión del sistema.

> [!IMPORTANT]
> **Aclaración Arquitectónica**: La interfaz móvil de React Native NO se acopla directamente a servidores MCP en runtime. La aplicación móvil funciona de forma autónoma aun cuando los servidores MCP de desarrollo estén apagados.

---

## 2. Flujo de Trabajo MCP en Desarrollo (Stitch / Figma / Filesystem)

```text
Figma / Stitch
     ↓
Figma MCP Server (Inspección de Tokens, Frames y Componentes)
     ↓
Agente IA (Antigravity)
     ↓
Código React Native Nativo & Design Tokens
```

Y:

```text
Filesystem
     ↓
Filesystem MCP Server (Inspección y Refactorización del Repositorio)
     ↓
Agente IA
     ↓
Código / Configuración / Documentación
```

---

## 3. Hoja de Ruta para Servidores MCP en Runtime (Futuro)

En fases posteriores, las herramientas nativas Python del `ToolRegistry` podrán mapearse como clientes MCP runtime:

```text
Supervisor Agent (FastAPI)
         ↓
    Tool Router
    ├── Herramientas Python Locales (SQLite)
    └── MCP Tool Clients
            ├── Calendar MCP Server
            ├── GitHub MCP Server
            └── Filesystem MCP Server
```
