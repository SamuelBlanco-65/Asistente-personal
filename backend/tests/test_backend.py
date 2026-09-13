import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.tools.registry import global_tool_registry, ToolResult
from backend.app.infrastructure.db.db import init_db

client = TestClient(app)

def setup_module(module):
    init_db()

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "ollama" in data

def test_tool_registry_execution():
    def mock_tool(name: str) -> ToolResult:
        return ToolResult(success=True, data={"greeting": f"Hola {name}"}, user_message="Exito")

    global_tool_registry.register(
        name="mock_test_tool",
        description="Test tool",
        input_schema={"type": "object"},
        handler=mock_tool,
        permission="READ"
    )

    res = global_tool_registry.execute_tool("mock_test_tool", {"name": "Samuel"})
    assert res.success is True
    assert res.data["greeting"] == "Hola Samuel"

def test_create_and_list_tasks_api():
    create_res = client.post("/api/v1/tasks", json={
        "title": "Examen final de Inteligencia Artificial",
        "due_date": "2026-09-20",
        "priority": "high"
    })
    assert create_res.status_code == 200
    assert create_res.json()["status"] == "created"

    list_res = client.get("/api/v1/tasks")
    assert list_res.status_code == 200
    tasks = list_res.json()["tasks"]
    assert len(tasks) > 0
    assert any(t["title"] == "Examen final de Inteligencia Artificial" for t in tasks)
