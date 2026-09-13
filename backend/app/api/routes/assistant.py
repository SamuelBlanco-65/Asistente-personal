from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.app.agents.supervisor import global_supervisor

router = APIRouter(prefix="/api/v1/assistant", tags=["assistant"])

class MessageRequest(BaseModel):
    message: str

@router.post("/message")
async def process_assistant_message(req: MessageRequest):
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="El mensaje no puede estar vacío.")

    result = await global_supervisor.process_user_intent(req.message)
    
    tool_name = None
    if result.tool_calls:
        tool_name = result.tool_calls[0].get("name")

    return {
        "response_text": result.response_text,
        "tool_executed": tool_name,
        "tool_calls": result.tool_calls,
        "status": result.status
    }
