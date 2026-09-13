import httpx
import json
from typing import Any
from backend.app.config.settings import settings
from backend.app.tools.registry import global_tool_registry
from backend.app.domain.models import AgentResult

SYSTEM_PROMPT = """Eres JARVIS STUDENT, un asistente personal de inteligencia artificial autónomo, conciso, útil y elegante para un estudiante universitario.
Tu objetivo es ayudar al estudiante a organizar tareas, responder preguntas académicas y ejecutar herramientas cuando sea necesario.
Habla en español con tono profesional y cercano de asistente avanzado.
Si la intención del estudiante requiere crear o consultar tareas, utiliza las herramientas correspondientes. No inventes resultados de herramientas."""

class OllamaClient:
    def __init__(self, base_url: str = settings.ollama_base_url, model: str = settings.ollama_model):
        self.base_url = base_url.rstrip("/")
        self.model = model

    async def check_health(self) -> bool:
        try:
            async with httpx.AsyncClient(timeout=3.0) as client:
                res = await client.get(f"{self.base_url}/api/tags")
                return res.status_code == 200
        except Exception:
            return False

    async def chat_with_tools(self, user_message: str, max_steps: int = 5) -> AgentResult:
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_message}
        ]
        
        tools = global_tool_registry.get_tool_definitions()
        executed_tool_calls = []

        async with httpx.AsyncClient(timeout=45.0) as client:
            for _ in range(max_steps):
                payload = {
                    "model": self.model,
                    "messages": messages,
                    "stream": False,
                }
                if tools:
                    payload["tools"] = tools

                try:
                    res = await client.post(f"{self.base_url}/api/chat", json=payload)
                    if res.status_code != 200:
                        return AgentResult(
                            response_text=f"JARVIS local (Ollama) retornó error {res.status_code}.",
                            status="error"
                        )
                    
                    data = res.json()
                    msg = data.get("message", {})
                    tool_calls = msg.get("tool_calls", [])

                    # If Ollama decided to make a tool call
                    if tool_calls:
                        messages.append(msg)
                        for tc in tool_calls:
                            fn = tc.get("function", {})
                            name = fn.get("name")
                            args = fn.get("arguments", {})
                            
                            if isinstance(args, str):
                                try:
                                    args = json.loads(args)
                                except Exception:
                                    args = {}

                            tool_result = global_tool_registry.execute_tool(name, args)
                            executed_tool_calls.append({"name": name, "args": args, "result": tool_result.data})
                            
                            messages.append({
                                "role": "tool",
                                "name": name,
                                "content": json.dumps(tool_result.data)
                            })
                    else:
                        # Final natural language response from Ollama
                        content = msg.get("content", "Procesado.")
                        return AgentResult(
                            response_text=content,
                            tool_calls=executed_tool_calls,
                            status="completed"
                        )
                except httpx.ConnectError:
                    # Fallback response if Ollama is not running on localhost
                    return AgentResult(
                        response_text="Hola Samuel. JARVIS local en Ollama no está encendido en tu laptop. Puedes iniciarlo ejecutando 'ollama run llama3.2'.",
                        status="ollama_offline"
                    )
                except Exception as e:
                    return AgentResult(
                        response_text=f"Error durante el procesamiento con JARVIS: {str(e)}",
                        status="error"
                    )

        return AgentResult(
            response_text="Se alcanzó el límite máximo de pasos de herramientas.",
            tool_calls=executed_tool_calls,
            status="max_steps_exceeded"
        )
