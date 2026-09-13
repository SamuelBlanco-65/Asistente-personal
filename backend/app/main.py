from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from backend.app.config.settings import settings
from backend.app.infrastructure.db.db import init_db
from backend.app.tools.academic.academic_tools import register_academic_tools
from backend.app.api.routes.health import router as health_router
from backend.app.api.routes.assistant import router as assistant_router
from backend.app.api.routes.tasks import router as tasks_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup tasks
    init_db()
    register_academic_tools()
    print(f"🚀 {settings.app_name} iniciado correctamente en {settings.backend_host}:{settings.backend_port}")
    yield
    # Shutdown tasks
    print(f"🛑 {settings.app_name} detenido.")

app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    description="JARVIS Student AI Assistant Backend with Ollama, Tool Calling, and Multi-Agent Orchestration.",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(health_router)
app.include_router(assistant_router)
app.include_router(tasks_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host=settings.backend_host, port=settings.backend_port, reload=True)
