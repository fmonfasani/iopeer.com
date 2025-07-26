from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Any, Dict, List, Optional

from workflow_engine import (
    WorkflowEngine,
    Workflow,
    WorkflowNode,
    WorkflowConnection,
    ConnectionType,
    AgentRegistry,
    EventBus,
)


router = APIRouter()

# Simple global engine
agent_registry = AgentRegistry()
event_bus = EventBus()
engine = WorkflowEngine(agent_registry, event_bus)


class NodeModel(BaseModel):
    id: str
    agent_type: str
    config: Dict[str, Any] = {}


class ConnectionModel(BaseModel):
    source_id: str
    target_id: str
    type: ConnectionType = ConnectionType.SUCCESS


class WorkflowCreate(BaseModel):
    id: str
    name: str
    nodes: List[NodeModel]
    connections: List[ConnectionModel] = []


class ExecutionRequest(BaseModel):
    data: Optional[Dict[str, Any]] = None


@router.get("/")
async def list_workflows():
    return {"workflows": list(engine.workflows.keys())}


@router.post("/")
async def create_workflow(defn: WorkflowCreate):
    wf = Workflow(defn.id, defn.name)
    for node in defn.nodes:
        wf.add_node(WorkflowNode(node.id, node.agent_type, node.config))
    for conn in defn.connections:
        wf.add_connection(
            WorkflowConnection(conn.source_id, conn.target_id, conn.type)
        )
    engine.register_workflow(wf)
    return {"workflow_id": wf.id}


@router.get("/{workflow_id}")
async def get_workflow(workflow_id: str):
    wf = engine.get_workflow(workflow_id)
    if not wf:
        raise HTTPException(status_code=404, detail="Workflow not found")
    return {
        "id": wf.id,
        "name": wf.name,
        "nodes": [vars(n) for n in wf.nodes.values()],
        "connections": [vars(c) for c in wf.connections],
    }


@router.post("/{workflow_id}/run")
async def run_workflow(workflow_id: str, req: ExecutionRequest):
    try:
        result = await engine.execute(workflow_id, req.data)
        return {"result": result}
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
