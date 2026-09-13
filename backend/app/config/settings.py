import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "JARVIS Student AI Backend"
    environment: str = "development"
    backend_host: str = "0.0.0.0"
    backend_port: int = 8000
    
    # Ollama Local LLM Config
    ollama_base_url: str = "http://127.0.0.1:11434"
    ollama_model: str = "llama3.2"
    
    # Database
    db_path: str = "jarvis_student.db"
    
    # Security & Tailscale
    tailscale_host: str | None = None
    
    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
