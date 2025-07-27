# ============================================
# back/main.py - ORDEN DE IMPORTS CORREGIDO
# ============================================

# 1. PRIMERO: Cargar variables de entorno
import os
from dotenv import load_dotenv
load_dotenv()  # ← CARGAR VARIABLES ANTES DE CUALQUIER IMPORT DE OAUTH

# 2. SEGUNDO: Imports estándar
import json
import logging
from contextlib import asynccontextmanager
from enum import Enum
from pathlib import Path
from typing import Any, Dict, List, Optional
import uuid
from datetime import datetime
from fastapi import HTTPException

try:
    import uvicorn  # type: ignore
except Exception:  # pragma: no cover - optional dependency
    uvicorn = None

# 3. TERCERO: FastAPI imports
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from sqlalchemy import text

# 4. CUARTO: Imports de agenthub (sin oauth)
from agenthub.agents.backend_agent import BackendAgent
from agenthub.agents.base_agent import BaseAgent
from agenthub.agents.qa_agent import QAAgent
from agenthub.config import config
from agenthub.orchestrator import orchestrator

# 5. QUINTO: Imports de auth y database (sin oauth)
from agenthub.auth import router as auth_router
from agenthub.database.connection import SessionLocal, engine, Base

# 6. ¡POR ÚLTIMO!: Import de oauth (DESPUÉS de load_dotenv)
from agenthub.auth.oauth_routes import router as oauth_router
from api.workflows import router as workflows_router

# Logging
logging.basicConfig(
    level=getattr(logging, config.get("log_level", "INFO")),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# ============================================
# STARTUP Y SHUTDOWN EVENTS
# ============================================
# Agregar estos endpoints a back/main.py


    
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 Starting IOPeer Agent Hub...")
    await startup_event()
    yield
    logger.info("🛑 Shutting down IOPeer Agent Hub...")
    await shutdown_event()

async def startup_event():
    """Initialize database and load agents"""
    try:
        # 1. Create database tables
        logger.info("📁 Creating database tables...")
        Base.metadata.create_all(bind=engine)
        logger.info("✅ Database tables created successfully")
        
        # 2. Test database connection
        test_db_connection()
        
        # 3. Load agents from registry
        await load_agents_from_registry()
        
        # 4. Load default workflows
        try:
            from agenthub.workflows.default import register_default_workflows
            register_default_workflows()
            logger.info("✅ Default workflows loaded")
        except ImportError:
            logger.warning("⚠️ Default workflows not available")
        
        logger.info("✅ IOPeer Agent Hub started successfully")
        
    except Exception as e:
        logger.error(f"❌ Startup failed: {e}")
        raise

async def shutdown_event():
    """Cleanup on shutdown"""
    orchestrator.shutdown()
    logger.info("✅ Shutdown complete")

def test_db_connection():
    """Test database connection"""
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        logger.info("✅ Database connection successful")
    except Exception as e:
        logger.error(f"❌ Database connection failed: {e}")
        raise
    finally:
        db.close()

async def load_agents_from_registry():
    """Load agents from registry file"""
    registry_file = config.get("registry_file", "registry.json")
    path = Path(registry_file)

    if not path.exists():
        await create_default_registry(path)

    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception as e:
        logger.error(f"❌ Error loading registry: {e}")
        return

    agent_classes = {
        "BackendAgent": BackendAgent, 
        "QAAgent": QAAgent
    }

    agents_loaded = 0
    for entry in data:
        agent_id = entry.get("id")
        agent_class = agent_classes.get(entry.get("class"))
        
        if not agent_class:
            logger.warning(f"⚠️ Unknown agent class: {entry.get('class')}")
            continue
            
        try:
            agent = agent_class()
            agent.agent_id = agent_id
            agent.config = entry.get("config", {})
            orchestrator.register_agent(agent)
            agents_loaded += 1
            logger.info(f"✅ Loaded agent: {agent_id}")
        except Exception as e:
            logger.error(f"❌ Failed to load agent {agent_id}: {e}")
    
    logger.info(f"✅ {agents_loaded} agents loaded successfully")

async def create_default_registry(path: Path):
    """Create default agent registry"""
    default = [
        {"id": "backend_agent", "class": "BackendAgent"},
        {"id": "qa_agent", "class": "QAAgent"},
    ]
    
    try:
        with open(path, "w", encoding="utf-8") as f:
            json.dump(default, f, indent=2)
        logger.info("✅ Default registry created")
    except Exception as e:
        logger.error(f"❌ Failed to create default registry: {e}")

# ============================================
# FASTAPI APP CONFIGURATION
# ============================================

app = FastAPI(
    title="IOPeer Agent Hub",
    description="AI Agent orchestration platform with authentication",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include auth routes
app.include_router(auth_router, prefix="/auth", tags=["authentication"])
app.include_router(workflows_router, prefix="/workflows", tags=["workflows"])

# ============================================
# PYDANTIC MODELS
# ============================================

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

# ============================================
# CORE ENDPOINTS
# ============================================

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "IOPeer Agent Hub API",
        "version": "1.0.0",
        "status": "running",
        "agents": len(orchestrator.agent_registry.agents),
        "workflows": len(orchestrator.workflow_registry.workflows),
        "endpoints": [
            "/health",
            "/auth/signin",
            "/auth/signup", 
            "/auth/oauth/status",
            "/agents",
            "/message/send",
            "/workflows"
        ]
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test database
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        db_status = "healthy"
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        db_status = "unhealthy"
    
    # Test agents
    agent_health = {}
    try:
        agent_health = {
            k: agent.health_check()
            for k, agent in orchestrator.agent_registry.agents.items()
        }
    except Exception as e:
        logger.error(f"Agent health check failed: {e}")
    
    return {
        "status": "healthy" if db_status == "healthy" else "unhealthy",
        "message": "IOPeer Agent Hub is running",
        "version": "1.0.0",
        "database": db_status,
        "agents": agent_health,
        "total_agents": len(orchestrator.agent_registry.agents),
        "total_workflows": len(orchestrator.workflow_registry.workflows)
    }

# ============================================
# AGENT ENDPOINTS
# ============================================

@app.get("/agents")
async def list_agents():
    """List all available agents"""
    try:
        agents = [agent.get_info() for agent in orchestrator.agent_registry.agents.values()]
        return {
            "agents": agents, 
            "total": len(agents),
            "status": "success"
        }
    except Exception as e:
        logger.error(f"Error listing agents: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/agents/register")
async def register_agent(req: AgentRegistrationRequest):
    """Register a new agent"""
    try:
        if orchestrator.agent_registry.get(req.agent_id):
            raise HTTPException(status_code=409, detail="Agent already exists")
        
        agent_map = {
            AgentType.BackendAgent: BackendAgent,
            AgentType.QAAgent: QAAgent,
        }
        
        agent_class = agent_map[req.agent_type]
        agent = agent_class()
        agent.agent_id = req.agent_id
        agent.config = req.config or {}
        
        orchestrator.register_agent(agent)
        
        logger.info(f"✅ Agent registered: {req.agent_id}")
        return {"status": "registered", "agent_id": req.agent_id}
        
    except Exception as e:
        logger.error(f"Error registering agent: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/message/send")
async def send_message(req: MessageRequest):
    """Send message to an agent"""
    try:
        logger.info(f"📤 Sending message to {req.agent_id}: {req.action}")
        
        result = orchestrator.send_message(
            req.agent_id, 
            {"action": req.action, "data": req.data}
        )
        
        logger.info(f"📨 Response from {req.agent_id}: {result}")
        return {"message_sent": True, "result": result, "status": "success"}

    except ValueError as e:
        logger.error(f"Agent not found: {e}")
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Error sending message: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# 1. Endpoint para agente individual
@app.get("/agents/{agent_id}")
async def get_agent_details(agent_id: str):
    """Get details of a specific agent"""
    agent = orchestrator.agent_registry.get_agent(agent_id)
    
    if not agent:
        raise HTTPException(status_code=404, detail=f"Agent {agent_id} not found")
    
    capabilities = agent.get_capabilities() if hasattr(agent, 'get_capabilities') else {}
    
    return {
        "agent_id": agent_id,
        "name": agent.name,
        "type": agent.__class__.__name__,
        "status": "active",
        "capabilities": capabilities,
        "created_at": datetime.now().isoformat(),
        "stats": {
            "messages_processed": 0,
            "errors": 0,
            "average_response_time": "1.2s",
            "last_activity": None
        },
        "health": "healthy"
    }

# 2. Endpoint para ejecutar workflow
@app.post("/workflows/{workflow_id}/execute")
async def execute_workflow(workflow_id: str, request: dict):
    """Execute a workflow"""
    if workflow_id not in orchestrator.workflow_registry.workflows:
        available_workflows = list(orchestrator.workflow_registry.workflows.keys())
        raise HTTPException(
            status_code=404, 
            detail=f"Workflow '{workflow_id}' not found. Available workflows: {available_workflows}"
        )
    
    # Generate execution ID
    execution_id = f"exec_{uuid.uuid4().hex[:8]}"
    
    try:
        workflow = orchestrator.workflow_registry.workflows[workflow_id]
        
        # For MVP: Return mock execution response
        # TODO: Implement real workflow execution
        return {
            "execution_id": execution_id,
            "workflow_id": workflow_id,
            "status": "started",
            "progress": 0,
            "estimated_completion": "2-3 minutes",
            "steps_total": len(workflow.get("tasks", [])),
            "steps_completed": 0,
            "started_at": datetime.now().isoformat(),
            "project_name": request.get("project_name", "Unnamed Project"),
            "input_data": request,
            "workflow_info": {
                "name": workflow.get("name", workflow_id),
                "tasks": workflow.get("tasks", []),
                "parallel": workflow.get("parallel", False),
                "timeout": workflow.get("timeout", 30)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to start workflow: {str(e)}")

# 3. Endpoint para status de ejecución de workflow
@app.get("/workflows/executions/{execution_id}")
async def get_execution_status(execution_id: str):
    """Get workflow execution status"""
    # For MVP: Return mock status
    # TODO: Implement real execution tracking
    
    import random
    
    # Simulate different execution states
    states = ["running", "completed", "failed"]
    weights = [0.6, 0.3, 0.1]  # Mostly running, some completed, few failed
    
    status = random.choices(states, weights=weights)[0]
    progress = random.randint(10, 90) if status == "running" else (100 if status == "completed" else 0)
    
    response = {
        "execution_id": execution_id,
        "status": status,
        "progress": progress,
        "steps_completed": progress // 20,  # Roughly 5 steps total
        "steps_total": 5,
        "started_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    }
    
    if status == "running":
        response.update({
            "current_step": "backend_agent.generate_api",
            "estimated_remaining": f"{random.randint(10, 120)} seconds",
            "results": [
                {"step": "analyze_requirements", "status": "completed", "duration": "12s"},
                {"step": "suggest_architecture", "status": "completed", "duration": "8s"},
                {"step": "generate_api", "status": "running", "duration": "25s"}
            ]
        })
    elif status == "completed":
        response.update({
            "completed_at": datetime.now().isoformat(),
            "total_duration": "2m 15s",
            "results": [
                {"step": "analyze_requirements", "status": "completed", "duration": "12s"},
                {"step": "suggest_architecture", "status": "completed", "duration": "8s"}, 
                {"step": "generate_api", "status": "completed", "duration": "45s"},
                {"step": "validate_api_spec", "status": "completed", "duration": "20s"},
                {"step": "generate_tests", "status": "completed", "duration": "50s"}
            ],
            "deliverables": {
                "api_code": "Generated FastAPI code",
                "test_suite": "Generated test files",
                "documentation": "API documentation",
                "download_url": f"/downloads/{execution_id}.zip"
            }
        })
    else:  # failed
        response.update({
            "failed_at": datetime.now().isoformat(),
            "error": "Agent backend_agent failed: Timeout during API generation",
            "error_details": {
                "step": "generate_api",
                "agent": "backend_agent",
                "reason": "Request timeout after 30 seconds"
            }
        })
    
    return response

# 4. Endpoint para capabilities de agente específico
@app.get("/agents/{agent_id}/capabilities")
async def get_agent_capabilities(agent_id: str):
    """Get detailed capabilities of a specific agent"""
    agent = orchestrator.agent_registry.get_agent(agent_id)
    
    if not agent:
        raise HTTPException(status_code=404, detail=f"Agent {agent_id} not found")
    
    capabilities = agent.get_capabilities() if hasattr(agent, 'get_capabilities') else {
        "actions": [],
        "description": "No capabilities defined"
    }
    
    return {
        "agent_id": agent_id,
        "name": agent.name,
        "capabilities": capabilities,
        "status": "active",
        "last_updated": datetime.now().isoformat()
    }

# 5. Endpoint para configuración del frontend
@app.get("/frontend/config")
async def get_frontend_config():
    """Configuration data for frontend"""
    agent_list = []
    for agent_id, agent in orchestrator.agent_registry.agents.items():
        capabilities = agent.get_capabilities() if hasattr(agent, 'get_capabilities') else {}
        
        agent_list.append({
            "id": agent_id,
            "name": agent.name,
            "description": capabilities.get("description", ""),
            "category": capabilities.get("category", "general"),
            "icon": capabilities.get("icon", "🤖"),
            "actions": capabilities.get("actions", []),
            "status": "active"
        })
    
    workflow_list = []
    for workflow_id, workflow in orchestrator.workflow_registry.workflows.items():
        workflow_list.append({
            "id": workflow_id,
            "name": workflow.get("name", workflow_id),
            "description": f"Automated workflow with {len(workflow.get('tasks', []))} steps",
            "estimated_time": f"{workflow.get('timeout', 30)}s - {workflow.get('timeout', 30)*2}s",
            "agents_involved": [task.split('.')[0] for task in workflow.get("tasks", [])],
            "parallel": workflow.get("parallel", False),
            "steps": len(workflow.get("tasks", []))
        })
    
    return {
        "api_base_url": "http://localhost:8000",
        "websocket_url": "ws://localhost:8000/ws", 
        "version": "1.0.0",
        "available_agents": agent_list,
        "available_workflows": workflow_list,
        "features": {
            "websockets_enabled": False,  # Enable when implemented
            "oauth_enabled": False,
            "real_time_updates": False,   # Enable when WebSocket ready
            "file_upload": False,
            "export_formats": ["zip", "json", "code"],
            "ui_generator": True,
            "workflows": True,
            "analytics": True
        },
        "limits": {
            "max_agents_per_user": 10,
            "max_workflows_per_day": 50,
            "max_execution_time": "5 minutes"
        }
    }

# 6. Enhanced health check
@app.get("/health")
async def enhanced_health_check():
    """Comprehensive health check"""
    
    # Check database
    db_status = "healthy"
    try:
        # Simple DB check - modify based on your database setup
        # await database.fetch_one("SELECT 1")
        pass
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"
    
    # Check agents
    agent_statuses = {}
    for agent_id, agent in orchestrator.agent_registry.agents.items():
        agent_statuses[agent_id] = {
            "healthy": True,
            "status": "idle",
            "uptime": 3600  # Mock uptime
        }
    
    agents_status = "healthy" if len(orchestrator.agent_registry.agents) > 0 else "unhealthy"
    workflows_status = "healthy" if len(orchestrator.workflow_registry.workflows) > 0 else "unhealthy"
    
    overall_status = "healthy" if all([
        db_status == "healthy",
        agents_status == "healthy", 
        workflows_status == "healthy"
    ]) else "unhealthy"
    
    return {
        "status": overall_status,
        "message": "IOPeer Agent Hub is running",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat(),
        "database": db_status,
        "agents": agent_statuses,
        "total_agents": len(orchestrator.agent_registry.agents),
        "total_workflows": len(orchestrator.workflow_registry.workflows),
        "uptime": "1h 30m",  # Mock uptime
        "memory_usage": "125MB"  # Mock memory usage
    }

# 7. Test endpoint para verificar mensaje directo a agente
@app.post("/agents/{agent_id}/test")
async def test_agent_direct(agent_id: str, request: dict):
    """Direct test endpoint for agent - useful for debugging"""
    agent = orchestrator.agent_registry.get_agent(agent_id)
    
    if not agent:
        raise HTTPException(status_code=404, detail=f"Agent {agent_id} not found")
    
    try:
        result = agent.handle(request)
        return {
            "agent_id": agent_id,
            "request": request,
            "response": result,
            "timestamp": datetime.now().isoformat(),
            "success": result.get("status") == "success"
        }
    except Exception as e:
        return {
            "agent_id": agent_id,
            "request": request,
            "error": str(e),
            "timestamp": datetime.now().isoformat(),
            "success": False
        }

# ============================================
# WORKFLOW ENDPOINTS
# ============================================

@app.get("/workflows")
async def list_workflows():
    """List all available workflows"""
    try:
        workflows = [
            {"name": name, **definition}
            for name, definition in orchestrator.workflow_registry.workflows.items()
        ]
        return {
            "workflows": workflows, 
            "total": len(workflows),
            "status": "success"
        }
    except Exception as e:
        logger.error(f"Error listing workflows: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/workflows/register")
async def register_workflow(req: WorkflowDefinitionRequest):
    """Register a new workflow"""
    try:
        orchestrator.register_workflow(
            name=req.name,
            tasks=req.tasks,
            parallel=req.parallel,
            timeout=req.timeout,
        )
        
        logger.info(f"✅ Workflow registered: {req.name}")
        return {"status": "registered", "workflow": req.name}
        
    except Exception as e:
        logger.error(f"Error registering workflow: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/workflow/start")
async def start_workflow(req: WorkflowRequest):
    """Start a workflow execution"""
    try:
        logger.info(f"🔄 Starting workflow: {req.workflow}")
        result = orchestrator.execute_workflow(req.workflow, req.data)
        logger.info(f"✅ Workflow completed: {req.workflow}")
        return result
        
    except Exception as e:
        logger.error(f"Error executing workflow: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ============================================
# MARKETPLACE ENDPOINTS (PLACEHOLDER)
# ============================================

@app.get("/marketplace/featured")
async def get_featured_agents():
    """Get featured agents from marketplace"""
    # Placeholder - en el futuro esto vendrá de una base de datos
    return {
        "agents": [
            {
                "id": "ui-generator",
                "name": "UI Component Generator",
                "description": "Genera componentes React personalizados",
                "rating": 4.8,
                "installs": 1250,
                "price": "Gratis"
            },
            {
                "id": "api-builder", 
                "name": "API Builder Pro",
                "description": "Crea APIs REST completas",
                "rating": 4.9,
                "installs": 890,
                "price": "$9.99/mes"
            }
        ],
        "total": 2,
        "status": "success"
    }

# ============================================
# ERROR HANDLERS
# ============================================

@app.exception_handler(Exception)
async def global_error_handler(request, exc):
    """Global error handler"""
    logger.error(f"❌ Unhandled error: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": "Something went wrong. Please try again.",
            "type": "server_error"
        },
    )

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc: HTTPException):
    """HTTP exception handler""" 
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail,
            "status_code": exc.status_code,
            "type": "http_error"
        }
    )

# ============================================
# DEVELOPMENT ENDPOINTS
# ============================================

@app.get("/debug/info")
async def debug_info():
    """Debug information (only in development)"""
    if config.get("debug", False):
        return {
            "config": dict(config),
            "agents": list(orchestrator.agent_registry.agents.keys()),
            "workflows": list(orchestrator.workflow_registry.workflows.keys()),
            "environment": "development"
        }
    else:
        raise HTTPException(status_code=404, detail="Not found")

# ============================================
# SERVER RUNNER
# ============================================

def run_server():
    """Run the server with uvicorn"""
    if uvicorn is None:
        raise RuntimeError("uvicorn is required to run the server")
    
    uvicorn.run(
        "main:app",  # Cambiado de "agenthub.main:app" a "main:app"
        host=config.get("host", "0.0.0.0"),
        port=config.get("port", 8000),
        reload=config.get("debug", False),
        log_level="info",
    )

if __name__ == "__main__":
    run_server()