# ARCHITECTURAL DECISIONS

## ADR-001 — FastAPI

Decision:
Use FastAPI.

Reason:
Async API, OpenAPI, straightforward Python architecture.

Do not replace with Flask without architectural reason.

---

## ADR-002 — Ollama

Decision:
Use Ollama as primary local LLM provider.

Reason:
Local execution and reduced external dependency.

---

## ADR-003 — Tailscale

Decision:
Mobile communicates with backend through Tailscale.

Reason:
Private network without public backend exposure.

---

## ADR-004 — SQLite

Decision:
Use SQLite for MVP.

Reason:
Single-user/local laptop deployment.

Future:
PostgreSQL.

---

## ADR-005 — Native Tool Registry

Decision:
Use native Python tools initially.

Reason:
Lower complexity than MCP runtime for MVP.

Future:
MCP adapters.

---

## ADR-006 — Expo Development Build

Decision:
Use Development Build when required by native functionality.

Reason:
Some native modules are unavailable in Expo Go.