# back/api/routes/agents.py - VERSIÓN LIMPIA
from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from pydantic import BaseModel
import logging

# Importar orquestador simple
from core.orchestrator import orchestrator

logger = logging.getLogger(__name__)
router = APIRouter()

# Modelos de request/response
class AgentExecuteRequest(BaseModel):
    agent_id: str
    action: str
    data: Dict[str, Any] = {}

class AgentResponse(BaseModel):
    agent_id: str
    name: str
    description: str
    actions: List[str]
    status: str
    features: List[str]

@router.get("/", response_model=List[AgentResponse])
async def list_agents():
    """Lista todos los agentes disponibles"""
    try:
        agents_data = []
        
        for agent_id, agent in orchestrator.agents.items():
            capabilities = agent.get_capabilities()
            
            agent_info = AgentResponse(
                agent_id=agent_id,
                name=capabilities.get("name", agent.name),
                description=capabilities.get("description", f"Agente {agent.name}"),
                actions=capabilities.get("actions", []),
                status="active",
                features=capabilities.get("features", [])
            )
            agents_data.append(agent_info)
        
        logger.info(f"Returning {len(agents_data)} agents")
        return agents_data
        
    except Exception as e:
        logger.error(f"Error listing agents: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error al obtener agentes: {str(e)}")

@router.get("/{agent_id}")
async def get_agent_details(agent_id: str):
    """Obtiene detalles de un agente específico"""
    try:
        agent = orchestrator.get_agent(agent_id)
        if not agent:
            raise HTTPException(status_code=404, detail=f"Agente {agent_id} no encontrado")
        
        capabilities = agent.get_capabilities()
        
        return {
            "agent_id": agent_id,
            "name": agent.name,
            "capabilities": capabilities,
            "status": "active",
            "created_at": "2024-01-01T00:00:00Z",
            "last_updated": "2024-01-01T00:00:00Z"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting agent {agent_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error al obtener agente: {str(e)}")

@router.post("/{agent_id}/execute")
async def execute_agent(agent_id: str, request: AgentExecuteRequest):
    """Ejecuta una acción específica de un agente"""
    try:
        agent = orchestrator.get_agent(agent_id)
        if not agent:
            raise HTTPException(status_code=404, detail=f"Agente {agent_id} no encontrado")
        
        # Preparar mensaje
        message = {
            "action": request.action,
            "data": request.data
        }
        
        # Ejecutar agente
        result = agent.handle(message)
        
        return {
            "agent_id": agent_id,
            "action": request.action,
            "result": result,
            "timestamp": "2024-01-01T00:00:00Z"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error executing agent {agent_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error al ejecutar agente: {str(e)}")

@router.get("/{agent_id}/capabilities")
async def get_agent_capabilities(agent_id: str):
    """Obtiene las capacidades de un agente"""
    try:
        agent = orchestrator.get_agent(agent_id)
        if not agent:
            raise HTTPException(status_code=404, detail=f"Agente {agent_id} no encontrado")
        
        return agent.get_capabilities()
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting capabilities for {agent_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error al obtener capacidades: {str(e)}")