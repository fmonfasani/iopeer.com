# agenthub/main.py
import json
import logging
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Any, Dict, List, Optional

import uvicorn
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

from .agents.backend_agent import BackendAgent
from .agents.base_agent import BaseAgent
from .agents.qa_agent import QAAgent
from .config import config
from .orchestrator import orchestrator

# Configurar logging
logging.basicConfig(
    level=getattr(logging, config.get("log_level", "INFO")),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


# Modelos Pydantic para la API
class MessageRequest(BaseModel):
    agent_id: str = Field(..., description="ID del agente destinatario")
    action: str = Field(..., description="Acción a ejecutar")
    data: Optional[Dict[str, Any]] = Field(None, description="Datos para la acción")


class WorkflowRequest(BaseModel):
    workflow: str = Field(..., description="Nombre del workflow")
    data: Optional[Dict[str, Any]] = Field(None, description="Datos iniciales")


class AgentRegistrationRequest(BaseModel):
    agent_id: str = Field(..., description="ID único del agente")
    agent_type: str = Field(..., description="Tipo de agente (clase)")
    config: Optional[Dict[str, Any]] = Field(
        None, description="Configuración del agente"
    )


class WorkflowDefinitionRequest(BaseModel):
    name: str = Field(..., description="Nombre del workflow")
    tasks: List[str] = Field(..., description="Lista de tareas (agent_id.action)")
    parallel: bool = Field(False, description="Ejecutar en paralelo")
    timeout: Optional[int] = Field(None, description="Timeout en segundos")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Gestiona el ciclo de vida de la aplicación"""
    # Startup
    logger.info("Starting AgentHub...")
    await startup_event()

    yield

    # Shutdown
    logger.info("Shutting down AgentHub...")
    await shutdown_event()


# Crear aplicación FastAPI
app = FastAPI(
    title="AgentHub",
    description="Plataforma de orquestación de agentes IA",
    version="1.0.0",
    lifespan=lifespan,
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especificar orígenes exactos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def startup_event():
    """Evento de inicio de la aplicación"""
    try:
        # Cargar y registrar agentes desde registry.json
        await load_agents_from_registry()

        # Importar workflows predefinidos
        try:
            pass

            logger.info("Default workflows loaded")
        except ImportError as e:
            logger.warning(f"Could not load default workflows: {e}")

        logger.info("AgentHub startup completed successfully")

    except Exception as e:
        logger.error(f"Error during startup: {e}")
        raise


async def shutdown_event():
    """Evento de cierre de la aplicación"""
    logger.info("AgentHub shutdown completed")


async def load_agents_from_registry():
    """Carga agentes desde el archivo registry.json"""
    registry_file = config.get("registry_file", "registry.json")
    registry_path = Path(registry_file)

    if not registry_path.exists():
        logger.warning(
            f"Registry file {registry_file} not found, creating default registry"
        )
        await create_default_registry(registry_path)

    try:
        with open(registry_path, "r", encoding="utf-8") as f:
            agent_registry = json.load(f)
    except json.JSONDecodeError as e:
        logger.error(f"Invalid JSON in registry file: {e}")
        return
    except Exception as e:
        logger.error(f"Error reading registry file: {e}")
        return

    # Mapeo de tipos de agentes a clases
    agent_classes = {"BackendAgent": BackendAgent, "QAAgent": QAAgent}

    for entry in agent_registry:
        try:
            agent_id = entry.get("id")
            agent_class_name = entry.get("class")
            agent_config = entry.get("config", {})

            if not agent_id or not agent_class_name:
                logger.warning(f"Invalid agent entry: {entry}")
                continue

            agent_class = agent_classes.get(agent_class_name)
            if not agent_class:
                logger.warning(f"Unknown agent class: {agent_class_name}")
                continue

            # Instanciar y registrar agente
            agent_instance = agent_class()
            agent_instance.agent_id = agent_id
            if agent_config:
                existing_config = getattr(agent_instance, "config", {})
                if isinstance(existing_config, dict):
                    existing_config.update(agent_config)
                    agent_instance.config = existing_config
                else:
                    agent_instance.config = agent_config

            orchestrator.register_agent(agent_instance)

            logger.info(
                f"Agent {agent_id} ({agent_class_name}) registered successfully"
            )

        except Exception as e:
            logger.error(f"Error registering agent from entry {entry}: {e}")


async def create_default_registry(registry_path: Path):
    """Crea un registry por defecto"""
    default_registry = [
        {"id": "backend_agent", "class": "BackendAgent", "config": {}},
        {"id": "qa_agent", "class": "QAAgent", "config": {}},
    ]

    with open(registry_path, "w", encoding="utf-8") as f:
        json.dump(default_registry, f, indent=2)

    logger.info(f"Created default registry at {registry_path}")


# Dependency para validar agentes
def get_agent(agent_id: str) -> BaseAgent:
    """Dependency para obtener un agente validado"""
    agent = orchestrator.agent_registry.get(agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail=f"Agent {agent_id} not found")
    return agent


# Endpoints de la API


@app.get("/")
async def root():
    """Endpoint raíz con información básica"""
    return {
        "name": "AgentHub",
        "version": "1.0.0",
        "description": "Plataforma de orquestación de agentes IA",
        "status": "running",
        "agents": len(orchestrator.agent_registry.agents),
        "workflows": len(orchestrator.workflow_registry.workflows),
    }


@app.get("/health")
async def health_check():
    """Health check del sistema"""
    try:
        stats = orchestrator.get_stats()

        # Verificar health de cada agente
        agent_health = {}
        for agent_id, agent in orchestrator.agent_registry.agents.items():
            try:
                health = agent.health_check()
                agent_health[agent_id] = health
            except Exception as e:
                agent_health[agent_id] = {"healthy": False, "error": str(e)}

        overall_health = all(
            health.get("healthy", False) for health in agent_health.values()
        )

        return {
            "status": "healthy" if overall_health else "degraded",
            "timestamp": "2024-01-01T00:00:00Z",  # En producción usar datetime.utcnow()
            "stats": stats,
            "agents": agent_health,
        }

    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=500, detail="Health check failed")


@app.get("/agents")
async def list_agents():
    """Lista todos los agentes registrados"""
    agents_info = []

    for agent_id in orchestrator.agent_registry.list_agents():
        agent_info = orchestrator.agent_registry.get_agent_info(agent_id)
        if agent_info:
            agents_info.append(agent_info)

    return {"agents": agents_info, "total": len(agents_info)}


@app.get("/agents/{agent_id}")
async def get_agent_info(agent: BaseAgent = Depends(get_agent)):
    """Obtiene información detallada de un agente"""
    return agent.get_info()


@app.get("/agents/{agent_id}/capabilities")
async def get_agent_capabilities(agent: BaseAgent = Depends(get_agent)):
    """Obtiene las capacidades de un agente"""
    return agent.get_capabilities()


@app.post("/agents/register")
async def register_agent_endpoint(request: AgentRegistrationRequest):
    """Registra un nuevo agente dinámicamente"""
    try:
        # En esta implementación simplificada, solo soportamos tipos conocidos
        agent_classes = {"BackendAgent": BackendAgent, "QAAgent": QAAgent}

        agent_class = agent_classes.get(request.agent_type)
        if not agent_class:
            raise HTTPException(
                status_code=400, detail=f"Unknown agent type: {request.agent_type}"
            )

        # Verificar que el agente no exista ya
        if orchestrator.agent_registry.get(request.agent_id):
            raise HTTPException(
                status_code=409, detail=f"Agent {request.agent_id} already exists"
            )

        # Crear y registrar agente
        agent_instance = agent_class()
        agent_instance.agent_id = request.agent_id  # Override ID if provided

        orchestrator.register_agent(agent_instance)

        return {
            "status": "registered",
            "agent_id": request.agent_id,
            "agent_type": request.agent_type,
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error registering agent: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/message/send")
async def send_message(request: MessageRequest):
    """Envía un mensaje a un agente específico"""
    try:
        result = orchestrator.send_message(
            request.agent_id, {"action": request.action, "data": request.data}
        )

        return {
            "message_sent": True,
            "agent_id": request.agent_id,
            "action": request.action,
            "result": result,
        }

    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Error sending message: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/workflows")
async def list_workflows():
    """Lista todos los workflows disponibles"""
    workflows = []

    for workflow_name in orchestrator.workflow_registry.list_workflows():
        workflow = orchestrator.workflow_registry.get(workflow_name)
        if workflow:
            workflows.append({"name": workflow_name, **workflow})

    return {"workflows": workflows, "total": len(workflows)}


@app.get("/workflows/{workflow_name}")
async def get_workflow(workflow_name: str):
    """Obtiene información de un workflow específico"""
    workflow = orchestrator.workflow_registry.get(workflow_name)
    if not workflow:
        raise HTTPException(
            status_code=404, detail=f"Workflow {workflow_name} not found"
        )

    return {"name": workflow_name, **workflow}


@app.post("/workflows/register")
async def register_workflow(request: WorkflowDefinitionRequest):
    """Registra un nuevo workflow"""
    try:
        orchestrator.register_workflow(
            name=request.name,
            tasks=request.tasks,
            parallel=request.parallel,
            timeout=request.timeout,
        )

        return {
            "status": "registered",
            "workflow": request.name,
            "tasks": request.tasks,
        }

    except Exception as e:
        logger.error(f"Error registering workflow: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/workflow/start")
async def start_workflow(request: WorkflowRequest):
    """Inicia la ejecución de un workflow"""
    try:
        result = orchestrator.execute_workflow(request.workflow, request.data)

        return result

    except Exception as e:
        logger.error(f"Error executing workflow: {e}")
        if "not found" in str(e).lower():
            raise HTTPException(status_code=404, detail=str(e))
        else:
            raise HTTPException(status_code=500, detail=str(e))


@app.get("/executions")
async def list_executions():
    """Lista el historial de ejecuciones"""
    executions = orchestrator.list_executions()
    return {"executions": executions, "total": len(executions)}


@app.get("/executions/{execution_id}")
async def get_execution(execution_id: str):
    """Obtiene detalles de una ejecución específica"""
    execution = orchestrator.get_execution_history(execution_id)
    if not execution:
        raise HTTPException(
            status_code=404, detail=f"Execution {execution_id} not found"
        )

    return {"execution_id": execution_id, **execution}


@app.get("/stats")
async def get_stats():
    """Obtiene estadísticas del sistema"""
    try:
        return orchestrator.get_stats()
    except Exception as e:
        logger.error(f"Error getting stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# Manejador de errores global
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Manejador global de excepciones"""
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": "An unexpected error occurred",
        },
    )


# Función principal para ejecutar la aplicación
def run_server():
    """Ejecuta el servidor AgentHub"""
    uvicorn.run(
        "agenthub.main:app",
        host=config.get("host", "0.0.0.0"),
        port=config.get("port", 8000),
        reload=config.get("debug", False),
        log_level=config.get("log_level", "info").lower(),
    )


if __name__ == "__main__":
    run_server()
