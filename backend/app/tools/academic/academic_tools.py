from pydantic import BaseModel, Field
from typing import Literal
from backend.app.domain.models import ToolResult
from backend.app.infrastructure.db.task_repository import TaskRepository
from backend.app.tools.registry import global_tool_registry

class CreateTaskInput(BaseModel):
    title: str = Field(..., description="Título o descripción breve de la tarea del estudiante")
    due_date: str | None = Field(None, description="Fecha de entrega aproximada (YYYY-MM-DD)")
    priority: Literal["low", "medium", "high"] = Field("medium", description="Prioridad de la tarea")

def create_task_handler(title: str, due_date: str | None = None, priority: str = "medium") -> ToolResult:
    task = TaskRepository.create_task(title=title, due_date=due_date, priority=priority)
    return ToolResult(
        success=True,
        data=task.model_dump(),
        user_message=f"Tarea '{task.title}' creada exitosamente con prioridad '{task.priority}'."
    )

def list_tasks_handler() -> ToolResult:
    tasks = TaskRepository.list_tasks()
    task_list = [t.model_dump() for t in tasks]
    return ToolResult(
        success=True,
        data={"tasks": task_list, "total": len(task_list)},
        user_message=f"Se encontraron {len(task_list)} tareas registradas."
    )

def register_academic_tools():
    global_tool_registry.register(
        name="create_task",
        description="Crea una tarea académica para el estudiante.",
        input_schema=CreateTaskInput.model_json_schema(),
        handler=create_task_handler,
        permission="WRITE_LOCAL",
        risk_level="low"
    )
    
    global_tool_registry.register(
        name="list_tasks",
        description="Obtiene la lista completa de tareas pendientes del estudiante.",
        input_schema={"type": "object", "properties": {}},
        handler=list_tasks_handler,
        permission="READ",
        risk_level="low"
    )
