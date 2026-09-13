import uuid
from backend.app.infrastructure.db.db import get_db_connection
from backend.app.domain.models import StudentTask

class TaskRepository:
    @staticmethod
    def create_task(title: str, description: str | None = None, due_date: str | None = None, priority: str = "medium") -> StudentTask:
        task_id = str(uuid.uuid4())
        task = StudentTask(
            id=task_id,
            title=title,
            description=description,
            due_date=due_date,
            priority=priority,
            status="pending"
        )
        
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO tasks (id, title, description, due_date, priority, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (task.id, task.title, task.description, task.due_date, task.priority, task.status, task.created_at)
        )
        conn.commit()
        conn.close()
        return task

    @staticmethod
    def list_tasks() -> list[StudentTask]:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id, title, description, due_date, priority, status, created_at FROM tasks ORDER BY created_at DESC")
        rows = cursor.fetchall()
        conn.close()
        
        return [
            StudentTask(
                id=r["id"],
                title=r["title"],
                description=r["description"],
                due_date=r["due_date"],
                priority=r["priority"],
                status=r["status"],
                created_at=r["created_at"]
            )
            for r in rows
        ]
