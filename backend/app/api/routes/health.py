from fastapi import APIRouter
from backend.app.llm.ollama_client import OllamaClient
from backend.app.config.settings import settings

router = APIRouter()
ollama_client = OllamaClient()

@router.get("/health")
async def health_check():
    ollama_ok = await ollama_client.check_health()
    return {
        "status": "ok",
        "service": settings.app_name,
        "ollama": "connected" if ollama_ok else "disconnected (offline)",
        "database": "sqlite_ready",
        "model": settings.ollama_model
    }
