# main.py
import json
import logging
from contextlib import asynccontextmanager
from enum import Enum
from pathlib import Path
from typing import Any, Dict, List, Optional

import uvicorn
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

from agenthub.agents.backend_agent import BackendAgent
from agenthub.agents.base_agent import BaseAgent
from agenthub.agents.qa_agent import QAAgent
from agenthub.config import config
from agenthub.orchestrator import orchestrator
from agenthub.auth import router as auth_router

# Logging
logging.basicConfig(
    level=getattr(logging, config.get("log_level", "INFO")),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# FastAPI app
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting AgentHub...")
    await startup_event()
    yield
    logger.info("Shutting down AgentHub...")
    await shutdown_event()

app = FastAPI(
    title="AgentHub",
    description="Plataforma de orquestación de agentes IA",
    version="1.0.0",
    lifespan=lifespan,
)
app.include_router(auth_router, prefix="/auth")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Enums y modelos
class AgentType(str, Enum):
    BackendAgent = "BackendAgent"
    QAAgent = "QAAgent"

class AgentRegistrationRequest(BaseModel):
    agent_id: str
    agent_type: AgentType
    config: Optional[Dict[str, Any]] = None

class MessageRequest(BaseModel):
    agent_id: str
    action: str
    data: Optional[Dict[str, Any]] = None

class WorkflowDefinitionRequest(BaseModel):
    name: str
    tasks: List[str]
    parallel: bool = False
    timeout: Optional[int] = None

class WorkflowRequest(BaseModel):
    workflow: str
    data: Optional[Dict[str, Any]] = None

# Ciclo de vida
async def startup_event():
    await load_agents_from_registry()
    try:
        from agenthub.workflows.default import register_default_workflows
        register_default_workflows()
        logger.info("Default workflows loaded")
    except ImportError:
        pass

async def shutdown_event():
    logger.info("Shutdown complete")

async def load_agents_from_registry():
    registry_file = config.get("registry_file", "registry.json")
    path = Path(registry_file)

    if not path.exists():
        await create_default_registry(path)

    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception as e:
        logger.error(f"Error loading registry: {e}")
        return

    agent_classes = {"BackendAgent": BackendAgent, "QAAgent": QAAgent}

    for entry in data:
        agent_id = entry.get("id")
        agent_class = agent_classes.get(entry.get("class"))
        if not agent_class:
            continue
        agent = agent_class()
        agent.agent_id = agent_id
        agent.config = entry.get("config", {})
        orchestrator.register_agent(agent)

async def create_default_registry(path: Path):
    default = [
        {"id": "backend_agent", "class": "BackendAgent"},
        {"id": "qa_agent", "class": "QAAgent"},
    ]
    with open(path, "w", encoding="utf-8") as f:
        json.dump(default, f, indent=2)

# Endpoints
@app.get("/")
async def root():
    return {
        "name": "AgentHub",
        "version": "1.0.0",
        "status": "running",
        "agents": len(orchestrator.agent_registry.agents),
        "workflows": len(orchestrator.workflow_registry.workflows),
    }

@app.post("/auth/test")
async def test_auth():
    return {"message": "auth working"}

@app.get("/health")
async def health_check():
    agent_health = {
        k: agent.health_check()
        for k, agent in orchestrator.agent_registry.agents.items()
    }
    return {"status": "ok", "agents": agent_health}

@app.post("/agents/register")
async def register_agent(req: AgentRegistrationRequest):
    agent_map = {
        AgentType.BackendAgent: BackendAgent,
        AgentType.QAAgent: QAAgent,
    }
    if orchestrator.agent_registry.get(req.agent_id):
        raise HTTPException(status_code=409, detail="Agent already exists")
    agent_class = agent_map[req.agent_type]
    agent = agent_class()
    agent.agent_id = req.agent_id
    agent.config = req.config or {}
    orchestrator.register_agent(agent)
    return {"status": "registered", "agent_id": req.agent_id}

@app.post("/message/send")
async def send_message(req: MessageRequest):
    try:
        result = orchestrator.send_message(
            req.agent_id, {"action": req.action, "data": req.data}
        )
        return {"result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/workflows/register")
async def register_workflow(req: WorkflowDefinitionRequest):
    orchestrator.register_workflow(
        name=req.name,
        tasks=req.tasks,
        parallel=req.parallel,
        timeout=req.timeout,
    )
    return {"status": "registered", "workflow": req.name}

@app.post("/workflow/start")
async def start_workflow(req: WorkflowRequest):
    return orchestrator.execute_workflow(req.workflow, req.data)

# Error handler
@app.exception_handler(Exception)
async def global_error_handler(_, exc):
    logger.error(f"Unhandled error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error"},
    )

# Run app
def run_server():
    uvicorn.run(
        "agenthub.main:app",
        host=config.get("host", "0.0.0.0"),
        port=config.get("port", 8000),
        reload=config.get("debug", False),
    )

if __name__ == "__main__":
    run_server()
