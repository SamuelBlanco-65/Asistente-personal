from typing import Callable, Any, Literal
from pydantic import BaseModel
from backend.app.domain.models import ToolResult

RiskLevel = Literal["low", "medium", "high", "critical"]
PermissionLevel = Literal["READ", "WRITE_LOCAL", "WRITE_EXTERNAL", "DESTRUCTIVE"]

class ToolDefinition(BaseModel):
    name: str
    description: str
    input_schema: dict[str, Any]
    risk_level: RiskLevel = "low"
    permission: PermissionLevel = "READ"
    requires_confirmation: bool = False

class ToolRegistry:
    def __init__(self):
        self._tools: dict[str, ToolDefinition] = {}
        self._handlers: dict[str, Callable[..., ToolResult]] = {}

    def register(
        self,
        name: str,
        description: str,
        input_schema: dict[str, Any],
        handler: Callable[..., ToolResult],
        permission: PermissionLevel = "READ",
        risk_level: RiskLevel = "low",
        requires_confirmation: bool = False
    ):
        tool_def = ToolDefinition(
            name=name,
            description=description,
            input_schema=input_schema,
            permission=permission,
            risk_level=risk_level,
            requires_confirmation=requires_confirmation
        )
        self._tools[name] = tool_def
        self._handlers[name] = handler

    def get_tool_definitions(self) -> list[dict[str, Any]]:
        """Return definitions in Ollama / OpenAI tool format."""
        result = []
        for tool in self._tools.values():
            result.append({
                "type": "function",
                "function": {
                    "name": tool.name,
                    "description": tool.description,
                    "parameters": tool.input_schema
                }
            })
        return result

    def execute_tool(self, name: str, kwargs: dict[str, Any]) -> ToolResult:
        if name not in self._handlers:
            return ToolResult(
                success=False,
                user_message=f"La herramienta '{name}' no está registrada en el sistema.",
                error="ToolNotFound"
            )
        
        handler = self._handlers[name]
        try:
            return handler(**kwargs)
        except Exception as e:
            return ToolResult(
                success=False,
                user_message=f"Error al ejecutar '{name}': {str(e)}",
                error=str(e)
            )

global_tool_registry = ToolRegistry()
