# ============================================
# back/main.py - LIMPIO Y CORREGIDO
# ============================================

# 1. PRIMERO: Cargar variables de entorno
import os
from dotenv import load_dotenv
load_dotenv()

# 2. SEGUNDO: Imports estándar
import json
import logging
from contextlib import asynccontextmanager
from enum import Enum
from pathlib import Path
from typing import Any, Dict, List, Optional

try:
    import uvicorn
except Exception:
    uvicorn = None

# 3. TERCERO: FastAPI imports
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from sqlalchemy import text

# 4. CUARTO: Imports de agenthub (CORE)
from agenthub.agents.backend_agent import BackendAgent
from agenthub.agents.base_agent import BaseAgent
from agenthub.agents.qa_agent import QAAgent
from agenthub.config import config
from agenthub.orchestrator import orchestrator

# 5. QUINTO: Database y Auth básico
from agenthub.auth import router as auth_router
from agenthub.database.connection import SessionLocal, engine, Base

# 6. SEXTO: Workflow engine (CORREGIDO - SIN DUPLICADOS)
try:
    from workflow_engine import runtime as wf_runtime
    from workflow_engine.core.WorkflowEngine import (
        AgentRegistry, 
        EventBus, 
        WorkflowEngine
    )
    WORKFLOW_ENGINE_AVAILABLE = True
except ImportError as e:
    print(f"⚠️ Workflow engine no disponible: {e}")
    WORKFLOW_ENGINE_AVAILABLE = False

# 7. SÉPTIMO: OAuth (OPCIONAL)
try:
    from agenthub.auth.oauth_routes import router as oauth_router
    OAUTH_AVAILABLE = True
except ImportError:
    OAUTH_AVAILABLE = False
    print("⚠️ OAuth no disponible - funcionando sin OAuth")

# 8. OCTAVO: API workflows (CONDICIONAL)
try:
    from api.workflows import router as workflow_engine_router
    API_WORKFLOWS_AVAILABLE = True
except ImportError:
    API_WORKFLOWS_AVAILABLE = False
    print("⚠️ API workflows no disponible")

# ============================================
# LOGGING SETUP
# ============================================
logging.basicConfig(
    level=getattr(logging, config.get("log_level", "INFO")),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# ============================================
# EVENT BUS GLOBAL
# ============================================
if WORKFLOW_ENGINE_AVAILABLE:
    event_bus = EventBus()
else:
    event_bus = None

# ============================================
# STARTUP Y SHUTDOWN EVENTS
# ============================================

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

        # 5. Initialize workflow engine (SI ESTÁ DISPONIBLE)
        if WORKFLOW_ENGINE_AVAILABLE:
            wf_runtime.agent_registry = AgentRegistry()
            wf_runtime.event_bus = EventBus()
            wf_runtime.workflow_engine = WorkflowEngine(
                wf_runtime.agent_registry, wf_runtime.event_bus
            )
            
            # Registrar agentes en workflow engine
            for agent_id, agent in orchestrator.agent_registry.agents.items():
                definition = agent.get_capabilities()
                wf_runtime.agent_registry.register_agent(agent_id, agent, definition)
            
            logger.info("✅ Workflow engine initialized")

        logger.info("✅ IOPeer Agent Hub started successfully")

    except Exception as e:
        logger.error(f"❌ Startup failed: {e}")
        raise

async def shutdown_event():
    """Cleanup on shutdown"""
    if hasattr(orchestrator, 'shutdown'):
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

# ============================================
# INCLUDE ROUTERS (CONDICIONAL)
# ============================================

# Auth siempre disponible
app.include_router(auth_router, prefix="/auth", tags=["authentication"])

# OAuth solo si está disponible
if OAUTH_AVAILABLE:
    app.include_router(oauth_router, prefix="/auth/oauth", tags=["oauth"])
    logger.info("✅ OAuth routes included")

# Workflow engine solo si está disponible
if API_WORKFLOWS_AVAILABLE:
    app.include_router(workflow_engine_router)
    logger.info("✅ Workflow engine routes included")

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
    endpoints_list = [
        "/health",
        "/auth/signin",
        "/auth/signup",
        "/agents",
        "/message/send",
        "/workflows"
    ]
    
    if OAUTH_AVAILABLE:
        endpoints_list.append("/auth/oauth/status")
    
    if API_WORKFLOWS_AVAILABLE:
        endpoints_list.append("/workflow_engine")

    return {
        "message": "IOPeer Agent Hub API",
        "version": "1.0.0",
        "status": "running",
        "agents": len(orchestrator.agent_registry.agents),
        "workflows": len(orchestrator.workflow_registry.workflows),
        "features": {
            "oauth_enabled": OAUTH_AVAILABLE,
            "workflow_engine_enabled": WORKFLOW_ENGINE_AVAILABLE,
            "api_workflows_enabled": API_WORKFLOWS_AVAILABLE
        },
        "endpoints": endpoints_list
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
        "total_workflows": len(orchestrator.workflow_registry.workflows),
        "features": {
            "oauth_available": OAUTH_AVAILABLE,
            "workflow_engine_available": WORKFLOW_ENGINE_AVAILABLE
        }
    }

# ============================================
# AGENT ENDPOINTS
# ============================================

@app.get("/agents")
async def list_agents():
    """List all available agents with robust error handling"""
    try:
        # Asegurar que orchestrator y agent_registry existen
        if not hasattr(orchestrator, 'agent_registry') or not orchestrator.agent_registry:
            logger.warning("Agent registry not initialized")
            return {
                "agents": [], 
                "total": 0, 
                "status": "success",
                "message": "Agent registry not initialized yet"
            }
        
        # Obtener agentes de forma segura
        agent_list = []
        if hasattr(orchestrator.agent_registry, 'agents') and orchestrator.agent_registry.agents:
            try:
                for agent_id, agent in orchestrator.agent_registry.agents.items():
                    try:
                        # Obtener info del agente de forma segura
                        agent_info = agent.get_info()
                        
                        # Validar que la info tiene la estructura esperada
                        if not isinstance(agent_info, dict):
                            logger.warning(f"Agent {agent_id} returned invalid info format")
                            continue
                            
                        # Asegurar campos requeridos
                        agent_info.setdefault('agent_id', agent_id)
                        agent_info.setdefault('name', agent_id)
                        agent_info.setdefault('type', agent.__class__.__name__)
                        agent_info.setdefault('status', 'unknown')
                        agent_info.setdefault('capabilities', {})
                        agent_info.setdefault('stats', {})
                        
                        agent_list.append(agent_info)
                        
                    except Exception as e:
                        logger.error(f"Error getting info for agent {agent_id}: {e}")
                        # Agregar agente con info mínima
                        agent_list.append({
                            'agent_id': agent_id,
                            'name': agent_id,
                            'type': agent.__class__.__name__ if hasattr(agent, '__class__') else 'Unknown',
                            'status': 'error',
                            'error': f'Failed to get agent info: {str(e)}',
                            'capabilities': {},
                            'stats': {}
                        })
            except Exception as e:
                logger.error(f"Error iterating through agents: {e}")
        
        response = {
            "agents": agent_list,
            "total": len(agent_list), 
            "status": "success",
            "server_time": datetime.utcnow().isoformat(),
            "agent_registry_status": "healthy" if agent_list else "empty"
        }
        
        logger.info(f"Successfully listed {len(agent_list)} agents")
        return response
        
    except Exception as e:
        logger.error(f"Critical error in list_agents: {e}")
        
        # Retornar respuesta de error pero con estructura consistente
        return {
            "agents": [],
            "total": 0,
            "status": "error",
            "error": str(e),
            "message": "Failed to retrieve agents list",
            "server_time": datetime.utcnow().isoformat()
        }

# También agregar endpoint de healthcheck específico para agentes
@app.get("/agents/health")
async def agents_health_check():
    """Health check específico para el sistema de agentes"""
    try:
        health_status = {
            "orchestrator_available": hasattr(orchestrator, 'agent_registry'),
            "agent_registry_available": bool(getattr(orchestrator, 'agent_registry', None)),
            "total_agents": 0,
            "healthy_agents": 0,
            "failed_agents": 0,
            "agent_details": {}
        }
        
        if orchestrator.agent_registry and orchestrator.agent_registry.agents:
            health_status["total_agents"] = len(orchestrator.agent_registry.agents)
            
            for agent_id, agent in orchestrator.agent_registry.agents.items():
                try:
                    agent_health = agent.health_check() if hasattr(agent, 'health_check') else {"healthy": True}
                    health_status["agent_details"][agent_id] = agent_health
                    
                    if agent_health.get("healthy", False):
                        health_status["healthy_agents"] += 1
                    else:
                        health_status["failed_agents"] += 1
                        
                except Exception as e:
                    health_status["agent_details"][agent_id] = {
                        "healthy": False,
                        "error": str(e)
                    }
                    health_status["failed_agents"] += 1
        
        overall_status = "healthy" if health_status["failed_agents"] == 0 else "degraded"
        
        return {
            "status": overall_status,
            "timestamp": datetime.utcnow().isoformat(),
            **health_status
        }
        
    except Exception as e:
        logger.error(f"Agent health check failed: {e}")
        return {
            "status": "failed",
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat()
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
        return {"workflows": workflows, "total": len(workflows), "status": "success"}
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
# MARKETPLACE ENDPOINTS
# ============================================

@app.get("/marketplace/featured")
async def get_featured_agents():
    """Get featured agents from marketplace"""
    return {
        "agents": [
            {
                "id": "ui-generator",
                "name": "UI Component Generator",
                "description": "Genera componentes React personalizados",
                "rating": 4.8,
                "installs": 1250,
                "price": "Gratis",
            },
            {
                "id": "api-builder",
                "name": "API Builder Pro",
                "description": "Crea APIs REST completas",
                "rating": 4.9,
                "installs": 890,
                "price": "$9.99/mes",
            },
        ],
        "total": 2,
        "status": "success",
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
            "type": "server_error",
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
            "type": "http_error",
        },
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
            "features": {
                "oauth_available": OAUTH_AVAILABLE,
                "workflow_engine_available": WORKFLOW_ENGINE_AVAILABLE,
                "api_workflows_available": API_WORKFLOWS_AVAILABLE
            },
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
        "main:app",
        host=config.get("host", "0.0.0.0"),
        port=config.get("port", 8000),
        reload=config.get("debug", False),
        log_level="info",
    )

if __name__ == "__main__":
    run_server()