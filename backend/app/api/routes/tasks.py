from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.app.infrastructure.db.task_repository import TaskRepository

router = APIRouter(prefix="/api/v1/tasks", tags=["tasks"])

class CreateTaskDto(BaseModel):
    title: str
    description: str | None = None
    due_date: str | None = None
    priority: str = "medium"

@router.get("")
async def list_student_tasks():
    tasks = TaskRepository.list_tasks()
    return {"tasks": [t.model_dump() for t in tasks]}

@router.post("")
async def create_student_task(dto: CreateTaskDto):
    if not dto.title.strip():
        raise HTTPException(status_code=400, detail="El título de la tarea es requerido.")
    task = TaskRepository.create_task(
        title=dto.title,
        description=dto.description,
        due_date=dto.due_date,
        priority=dto.priority
    )
    return {"status": "created", "task": task.model_dump()}
