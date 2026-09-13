---
trigger: always_on
---

# CORE ARCHITECTURE RULES

- Inspecciona antes de modificar.
- El código existente es la fuente de verdad.
- No reconstruyas el proyecto desde cero si ya existe una implementación funcional.
- No inventes APIs, capacidades o archivos.
- No introduzcas dependencias innecesarias.
- Mantén separación entre UI, lógica, dominio e infraestructura.
- Reutiliza componentes existentes.
- No hardcodees secretos.
- No expongas Ollama públicamente.
- No acoples Figma MCP al runtime móvil.
- Valida siempre los Tool Calls.
- Ejecuta pruebas después de cambios relevantes.
- Modifica solamente lo necesario.
- No hagas refactors no relacionados con la tarea.

Antes de trabajar:
- leer docs/PROJECT_CONTEXT.md
- leer docs/PROJECT_STATUS.md

Cuando corresponda:
- arquitectura → docs/ARCHITECTURE.md
- debugging → docs/DEBUGGING.md
- integraciones → docs/INTEGRATIONS.md
- testing → docs/TESTING.md

Workflow:
Inspect → Understand → Plan → Implement → Validate → Document