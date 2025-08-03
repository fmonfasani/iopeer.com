# ============================================
# back/main.py - WORKFLOWS INTEGRADOS CORRECTAMENTE
# ============================================

# 1. PRIMERO: Cargar variables de entorno
import os
from dotenv import load_dotenv
load_dotenv()

# 2. SEGUNDO: Imports estándar
import json
import logging
from contextlib import asynccontextmanager
from datetime import datetime
from enum import Enum
from pathlib import Path
from typing import Any, Dict, List, Optional

try:
    import uvicorn
except Exception:
    uvicorn = None

# 3. TERCERO: FastAPI imports
from fastapi import Depends, FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from sqlalchemy import text

# 4. CUARTO: Imports de agenthub
from agenthub.agents.backend_agent import BackendAgent
from agenthub.agents.base_agent import BaseAgent
from agenthub.agents.qa_agent import QAAgent
from agenthub.agents.data_analyst_agent import DataAnalystAgent
from agenthub.agents.ui_generator_agent import UIGeneratorAgent

from agenthub.config import config
from agenthub.orchestrator import orchestrator

# 5. QUINTO: Database y Auth
from agenthub.auth import router as auth_router
from agenthub.database.connection import SessionLocal, engine, Base

# 6. SEXTO: Workflow Engine CORREGIDO
from workflow_engine.core.WorkflowEngine import (
    WorkflowEngine,
    Workflow, 
    WorkflowNode,
    WorkflowConnection,
    AgentRegistry,
    EventBus,
    ConnectionType,
    NodeStatus
)

# 7. SÉPTIMO: OAuth (opcional)
try:
    from agenthub.auth.oauth_routes import router as oauth_router
    OAUTH_AVAILABLE = True
except ImportError:
    OAUTH_AVAILABLE = False

# ============================================
# CONFIGURACIÓN GLOBAL WORKFLOWS
# ============================================

# Runtime global para workflows
workflow_runtime = {
    "agent_registry": None,
    "event_bus": None, 
    "workflow_engine": None,
    "workflows": {},
    "active_executions": {},
    "websocket_connections": []
}

# ============================================
# LOGGING SETUP
# ============================================
logging.basicConfig(
    level=getattr(logging, config.get("log_level", "INFO")),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# ============================================
# STARTUP Y SHUTDOWN EVENTS
# ============================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 Starting IOPeer Agent Hub with Workflows...")
    await startup_event()
    yield
    logger.info("🛑 Shutting down IOPeer Agent Hub...")
    await shutdown_event()

async def startup_event():
    """Initialize database, agents and workflow engine"""
    try:
        # 1. Create database tables
        logger.info("📁 Creating database tables...")
        Base.metadata.create_all(bind=engine)
        logger.info("✅ Database tables created successfully")

        # 2. Test database connection
        test_db_connection()

        # 3. Initialize workflow engine FIRST
        await initialize_workflow_engine()

        # 4. Load agents from registry  
        await load_agents_from_registry()

        # 5. Load predefined workflows
        await load_predefined_workflows()

        logger.info("✅ IOPeer Agent Hub with Workflows started successfully")

    except Exception as e:
        logger.error(f"❌ Startup failed: {e}")
        raise

async def shutdown_event():
    """Cleanup on shutdown"""
    # Close all websocket connections
    for ws in workflow_runtime["websocket_connections"]:
        try:
            await ws.close()
        except:
            pass
    
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

async def initialize_workflow_engine():
    """Initialize the workflow engine system"""
    try:
        # Create workflow engine components
        workflow_runtime["agent_registry"] = AgentRegistry()
        workflow_runtime["event_bus"] = EventBus()
        workflow_runtime["workflow_engine"] = WorkflowEngine(
            workflow_runtime["agent_registry"], 
            workflow_runtime["event_bus"]
        )
        
        logger.info("✅ Workflow engine initialized")
        
    except Exception as e:
        logger.error(f"❌ Failed to initialize workflow engine: {e}")
        raise

async def load_agents_from_registry():
    """Load agents and register them in both systems"""
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

    # Agent classes disponibles
    agent_classes = {
        "BackendAgent": BackendAgent,
        "QAAgent": QAAgent,
        "DataAnalystAgent": DataAnalystAgent,
        "UIGeneratorAgent": UIGeneratorAgent,
    }

    agents_loaded = 0
    for entry in data:
        agent_id = entry.get("id")
        agent_class = agent_classes.get(entry.get("class"))

        if not agent_class:
            logger.warning(f"⚠️ Unknown agent class: {entry.get('class')}")
            continue

        try:
            # Create agent instance
            agent = agent_class()
            agent.agent_id = agent_id
            agent.config = entry.get("config", {})
            
            # Register in orchestrator (traditional system)
            orchestrator.register_agent(agent)
            
            # Register in workflow engine (new system)
            if workflow_runtime["agent_registry"]:
                definition = agent.get_capabilities()
                workflow_runtime["agent_registry"].register_agent(
                    agent_id, agent, definition
                )
            
            agents_loaded += 1
            logger.info(f"✅ Loaded agent in both systems: {agent_id}")
            
        except Exception as e:
            logger.error(f"❌ Failed to load agent {agent_id}: {e}")

    logger.info(f"✅ {agents_loaded} agents loaded in both workflow systems")

async def create_default_registry(path: Path):
    """Create default agent registry"""
    default = [
        {"id": "backend_agent", "class": "BackendAgent"},
        {"id": "qa_agent", "class": "QAAgent"},
        {"id": "data_analyst", "class": "DataAnalystAgent"},
        {"id": "ui_generator", "class": "UIGeneratorAgent"},
    ]

    try:
        with open(path, "w", encoding="utf-8") as f:
            json.dump(default, f, indent=2)
        logger.info("✅ Default registry created")
    except Exception as e:
        logger.error(f"❌ Failed to create default registry: {e}")

async def load_predefined_workflows():
    """Load predefined workflow templates"""
    try:
        # Workflow: Startup Complete
        startup_workflow = Workflow("startup_complete", "🚀 Startup Completa")
        
        # Add nodes
        startup_workflow.add_node(WorkflowNode("validate_idea", "backend_agent", {
            "action": "analyze_requirements",
            "description": "Validate business idea"
        }))
        
        startup_workflow.add_node(WorkflowNode("generate_ui", "ui_generator", {
            "action": "create_landing_page", 
            "description": "Generate landing page"
        }))
        
        startup_workflow.add_node(WorkflowNode("create_api", "backend_agent", {
            "action": "generate_api",
            "description": "Create backend API"
        }))
        
        startup_workflow.add_node(WorkflowNode("analyze_data", "data_analyst", {
            "action": "generate_dashboard",
            "description": "Create analytics dashboard"
        }))
        
        startup_workflow.add_node(WorkflowNode("qa_testing", "qa_agent", {
            "action": "test_api",
            "description": "Test complete system"
        }))
        
        # Add connections
        startup_workflow.add_connection(WorkflowConnection("validate_idea", "generate_ui"))
        startup_workflow.add_connection(WorkflowConnection("validate_idea", "create_api"))
        startup_workflow.add_connection(WorkflowConnection("create_api", "analyze_data"))
        startup_workflow.add_connection(WorkflowConnection("generate_ui", "qa_testing"))
        startup_workflow.add_connection(WorkflowConnection("analyze_data", "qa_testing"))
        
        # Register workflow
        workflow_runtime["workflows"]["startup_complete"] = startup_workflow
        
        # E-commerce Workflow
        ecommerce_workflow = Workflow("ecommerce_express", "🛒 E-commerce Express")
        
        ecommerce_workflow.add_node(WorkflowNode("design_store", "ui_generator", {
            "action": "generate_component",
            "description": "Design store layout"
        }))
        
        ecommerce_workflow.add_node(WorkflowNode("setup_backend", "backend_agent", {
            "action": "generate_crud",
            "description": "Setup product management"
        }))
        
        ecommerce_workflow.add_node(WorkflowNode("analytics_setup", "data_analyst", {
            "action": "calculate_kpis",
            "description": "Setup e-commerce analytics"
        }))
        
        ecommerce_workflow.add_connection(WorkflowConnection("design_store", "setup_backend"))
        ecommerce_workflow.add_connection(WorkflowConnection("setup_backend", "analytics_setup"))
        
        workflow_runtime["workflows"]["ecommerce_express"] = ecommerce_workflow
        
        logger.info("✅ Predefined workflows loaded")
        
    except Exception as e:
        logger.error(f"❌ Failed to load predefined workflows: {e}")

# ============================================
# FASTAPI APP CONFIGURATION
# ============================================

app = FastAPI(
    title="IOPeer Agent Hub with Workflows",
    description="AI Agent orchestration platform with visual workflows",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================
# INCLUDE ROUTERS
# ============================================

app.include_router(auth_router, prefix="/auth", tags=["authentication"])

if OAUTH_AVAILABLE:
    app.include_router(oauth_router, prefix="/auth/oauth", tags=["oauth"])

# ============================================
# PYDANTIC MODELS para WORKFLOWS
# ============================================

class WorkflowNodeRequest(BaseModel):
    id: str
    agent_type: str
    name: str = ""
    position: Dict[str, float] = Field(default_factory=lambda: {"x": 0, "y": 0})
    config: Dict[str, Any] = Field(default_factory=dict)

class WorkflowConnectionRequest(BaseModel):
    source_id: str
    target_id: str
    connection_type: str = "success"

class CreateWorkflowRequest(BaseModel):
    workflow_id: str
    name: str
    description: str = ""
    nodes: List[WorkflowNodeRequest]
    connections: List[WorkflowConnectionRequest] = Field(default_factory=list)

class ExecuteWorkflowRequest(BaseModel):
    initial_data: Dict[str, Any] = Field(default_factory=dict)

# ============================================
# WORKFLOW ENDPOINTS
# ============================================

@app.get("/api/v1/workflows")
async def list_workflows():
    """List all available workflows"""
    try:
        workflows = []
        for workflow_id, workflow in workflow_runtime["workflows"].items():
            workflows.append({
                "id": workflow.id,
                "name": workflow.name,
                "description": getattr(workflow, 'description', ''),
                "node_count": len(workflow.nodes),
                "connection_count": len(workflow.connections),
                "created_at": getattr(workflow, 'created_at', datetime.now()).isoformat()
            })
            
        return {
            "workflows": workflows,
            "total": len(workflows),
            "status": "success"
        }
        
    except Exception as e:
        logger.error(f"Error listing workflows: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/workflows", status_code=201)
async def create_workflow(request: CreateWorkflowRequest):
    """Create a new workflow"""
    try:
        if request.workflow_id in workflow_runtime["workflows"]:
            raise HTTPException(status_code=409, detail="Workflow already exists")

        # Create workflow
        workflow = Workflow(request.workflow_id, request.name)
        workflow.description = request.description
        
        # Add nodes
        for node_req in request.nodes:
            node = WorkflowNode(node_req.id, node_req.agent_type, node_req.config)
            workflow.add_node(node)
        
        # Add connections
        for conn_req in request.connections:
            connection_type = ConnectionType.SUCCESS if conn_req.connection_type == "success" else ConnectionType.ERROR
            connection = WorkflowConnection(conn_req.source_id, conn_req.target_id, connection_type)
            workflow.add_connection(connection)
        
        # Store workflow
        workflow_runtime["workflows"][request.workflow_id] = workflow
        
        logger.info(f"✅ Workflow created: {request.workflow_id}")
        
        return {
            "status": "created",
            "workflow_id": request.workflow_id,
            "message": f"Workflow '{request.name}' created successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating workflow: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/workflows/{workflow_id}")
async def get_workflow(workflow_id: str):
    """Get workflow details"""
    try:
        workflow = workflow_runtime["workflows"].get(workflow_id)
        if not workflow:
            raise HTTPException(status_code=404, detail="Workflow not found")
        
        # Convert to dict format
        nodes = []
        for node_id, node in workflow.nodes.items():
            nodes.append({
                "id": node.id,
                "agent_type": node.agent_type,
                "config": node.config,
                "status": node.status.value if hasattr(node, 'status') else 'pending',
                "inputs": getattr(node, 'inputs', []),
                "result": getattr(node, 'result', None)
            })
        
        connections = []
        for conn in workflow.connections:
            connections.append({
                "source_id": conn.source_id,
                "target_id": conn.target_id,
                "type": conn.type.value
            })
        
        return {
            "workflow": {
                "id": workflow.id,
                "name": workflow.name,
                "description": getattr(workflow, 'description', ''),
                "nodes": nodes,
                "connections": connections,
                "status": getattr(workflow, 'status', 'pending'),
                "created_at": getattr(workflow, 'created_at', datetime.now()).isoformat()
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting workflow: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/workflows/{workflow_id}/execute")
async def execute_workflow(workflow_id: str, request: ExecuteWorkflowRequest):
    """Execute a workflow"""
    try:
        workflow = workflow_runtime["workflows"].get(workflow_id)
        if not workflow:
            raise HTTPException(status_code=404, detail="Workflow not found")
        
        if not workflow_runtime["workflow_engine"]:
            raise HTTPException(status_code=500, detail="Workflow engine not initialized")
        
        # Execute workflow
        execution_id = await workflow_runtime["workflow_engine"].execute_workflow(
            workflow, request.initial_data
        )
        
        logger.info(f"✅ Workflow execution started: {execution_id}")
        
        return {
            "execution_id": execution_id,
            "workflow_id": workflow_id,
            "status": "started",
            "message": "Workflow execution started successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error executing workflow: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/agents/available")
async def get_available_agents():
    """Get all available agents for workflow creation"""
    try:
        if not workflow_runtime["agent_registry"]:
            return {"agents": {}, "total": 0}
        
        agents = workflow_runtime["agent_registry"].get_available_agents()
        
        # Add additional metadata
        enhanced_agents = {}
        for agent_type, definition in agents.items():
            enhanced_agents[agent_type] = {
                **definition,
                "id": agent_type,
                "category": definition.get("category", "general"),
                "icon": definition.get("icon", "🤖"),
                "color": definition.get("color", "#3b82f6")
            }
        
        return {
            "agents": enhanced_agents,
            "total": len(enhanced_agents),
            "categories": list(set(agent.get("category", "general") for agent in enhanced_agents.values()))
        }
        
    except Exception as e:
        logger.error(f"Error getting available agents: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/workflows/templates")
async def get_workflow_templates():
    """Get predefined workflow templates"""
    try:
        templates = {
            "startup_complete": {
                "id": "startup_complete",
                "name": "🚀 Startup Completa",
                "description": "De idea a producto funcionando: Landing + Backend + Analytics",
                "category": "Business",
                "difficulty": "Intermedio",
                "estimated_time": "15-20 minutos",
                "preview_image": "/templates/startup-complete.png",
                "expected_outputs": [
                    "✅ Landing page completa y responsive",
                    "✅ API backend con autenticación", 
                    "✅ Dashboard de analytics en tiempo real",
                    "📁 Código fuente completo descargable"
                ]
            },
            "ecommerce_express": {
                "id": "ecommerce_express",
                "name": "🛒 E-commerce Express",
                "description": "Tienda online completa con pagos, inventario y analytics",
                "category": "E-commerce",
                "difficulty": "Fácil", 
                "estimated_time": "8-12 minutos",
                "expected_outputs": [
                    "✅ Tienda online funcional",
                    "✅ Gestión de productos",
                    "✅ Sistema de pagos integrado"
                ]
            }
        }
        
        return {
            "templates": templates,
            "total": len(templates),
            "categories": list(set(t["category"] for t in templates.values()))
        }
        
    except Exception as e:
        logger.error(f"Error getting workflow templates: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/workflows/templates/{template_id}/create")
async def create_from_template(template_id: str, customizations: dict = None):
    """Create workflow from template"""
    try:
        if template_id not in workflow_runtime["workflows"]:
            raise HTTPException(status_code=404, detail="Template not found")
        
        template_workflow = workflow_runtime["workflows"][template_id]
        
        # Create new workflow ID
        new_workflow_id = f"{template_id}_{int(datetime.now().timestamp())}"
        
        # Clone workflow
        new_workflow = Workflow(new_workflow_id, f"{template_workflow.name} (Copy)")
        
        # Copy nodes and connections
        for node_id, node in template_workflow.nodes.items():
            new_node = WorkflowNode(node.id, node.agent_type, node.config.copy())
            new_workflow.add_node(new_node)
        
        for conn in template_workflow.connections:
            new_conn = WorkflowConnection(conn.source_id, conn.target_id, conn.type)
            new_workflow.add_connection(new_conn)
        
        # Store new workflow
        workflow_runtime["workflows"][new_workflow_id] = new_workflow
        
        return {
            "workflow_id": new_workflow_id,
            "status": "created",
            "message": f"Workflow created from template '{template_id}'"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating from template: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ============================================
# WEBSOCKET para TIEMPO REAL
# ============================================

@app.websocket("/api/v1/workflows/{workflow_id}/ws")
async def workflow_websocket(websocket: WebSocket, workflow_id: str):
    """WebSocket para updates en tiempo real de workflows"""
    await websocket.accept()
    workflow_runtime["websocket_connections"].append(websocket)

    if workflow_runtime.get("event_bus") is not None:

        workflow_runtime["event_bus"].websocket_connections.append(websocket)
    
    try:
        logger.info(f"WebSocket connected for workflow: {workflow_id}")
        
        # Send initial status
        await websocket.send_json({
            "type": "connected",
            "workflow_id": workflow_id,
            "timestamp": datetime.now().isoformat()
        })
        
        # Keep connection alive
        while True:
            data = await websocket.receive_text()
            # Echo back for heartbeat
            await websocket.send_json({
                "type": "heartbeat",
                "timestamp": datetime.now().isoformat()
            })
            
    except WebSocketDisconnect:
        logger.info(f"WebSocket disconnected for workflow: {workflow_id}")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        if websocket in workflow_runtime["websocket_connections"]:
            workflow_runtime["websocket_connections"].remove(websocket)

        if workflow_runtime.get("event_bus") is not None and \
                websocket in workflow_runtime["event_bus"].websocket_connections:

            workflow_runtime["event_bus"].websocket_connections.remove(websocket)

# ============================================
# ENDPOINTS ORIGINALES (mantenidos)
# ============================================

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "IOPeer Agent Hub with Visual Workflows",
        "version": "1.0.0",
        "status": "running",
        "agents": len(workflow_runtime["agent_registry"].agents) if workflow_runtime["agent_registry"] else 0,
        "workflows": len(workflow_runtime["workflows"]),
        "features": {
            "visual_workflows": True,
            "real_time_updates": True,
            "workflow_templates": True,
            "workflow_engine_enabled": workflow_runtime["workflow_engine"] is not None
        },
        "endpoints": [
            "/api/v1/workflows",
            "/api/v1/agents/available", 
            "/api/v1/workflows/templates",
            "/health"
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

    return {
        "status": "healthy" if db_status == "healthy" else "unhealthy",
        "message": "IOPeer Agent Hub with Workflows is running",
        "version": "1.0.0",
        "database": db_status,
        "workflow_engine": "healthy" if workflow_runtime["workflow_engine"] else "not_initialized",
        "total_agents": len(workflow_runtime["agent_registry"].agents) if workflow_runtime["agent_registry"] else 0,
        "total_workflows": len(workflow_runtime["workflows"]),
        "active_executions": len(workflow_runtime.get("active_executions", {})),
        "websocket_connections": len(workflow_runtime["websocket_connections"])
    }

# ============================================
# LEGACY ENDPOINTS (para compatibilidad)
# ============================================

@app.get("/agents")
async def list_agents():
    """List all available agents (legacy endpoint)"""
    try:
        if not workflow_runtime["agent_registry"]:
            return {"agents": [], "total": 0, "status": "success"}
        
        agents = []
        for agent_id, agent in workflow_runtime["agent_registry"].agents.items():
            try:
                agent_info = agent.get_info() if hasattr(agent, 'get_info') else {}
                agent_info.setdefault('agent_id', agent_id)
                agent_info.setdefault('name', agent_id)
                agent_info.setdefault('type', agent.__class__.__name__)
                agent_info.setdefault('status', 'idle')
                agents.append(agent_info)
            except Exception as e:
                logger.error(f"Error getting info for agent {agent_id}: {e}")
        
        return {
            "agents": agents,
            "total": len(agents), 
            "status": "success",
            "server_time": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error in list_agents: {e}")
        return {
            "agents": [],
            "total": 0,
            "status": "error",
            "error": str(e)
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
