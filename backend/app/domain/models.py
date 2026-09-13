from datetime import datetime
from typing import Literal, Any
from pydantic import BaseModel, Field

class StudentTask(BaseModel):
    id: str
    title: str
    description: str | None = None
    due_date: str | None = None
    priority: Literal["low", "medium", "high"] = "medium"
    status: Literal["pending", "completed"] = "pending"
    created_at: str = Field(default_factory=lambda: datetime.now().isoformat())

class StudentNote(BaseModel):
    id: str
    subject: str
    content: str
    tags: list[str] = []
    created_at: str = Field(default_factory=lambda: datetime.now().isoformat())

class ToolResult(BaseModel):
    success: bool
    data: dict[str, Any] = {}
    user_message: str
    error: str | None = None

class AgentResult(BaseModel):
    response_text: str
    tool_calls: list[dict[str, Any]] = []
    requires_confirmation: bool = False
    status: str = "completed"
