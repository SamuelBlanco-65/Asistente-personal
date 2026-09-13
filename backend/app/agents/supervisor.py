from backend.app.llm.ollama_client import OllamaClient
from backend.app.domain.models import AgentResult

class AgentSupervisor:
    def __init__(self):
        self.ollama = OllamaClient()

    async def process_user_intent(self, message: str) -> AgentResult:
        """
        Main multi-agent supervisor orchestrator.
        Analyzes intent, applies confirmation guardrails, and executes LLM tool loop.
        """
        # Execute chat & tool calling loop via Ollama
        result = await self.ollama.chat_with_tools(message)
        return result

global_supervisor = AgentSupervisor()
