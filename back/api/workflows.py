
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from workflow_engine import runtime
from workflow_engine.core.WorkflowEngine import (
    Workflow,
    WorkflowNode,
    WorkflowConnection,
    ConnectionType,
)

router = APIRouter(prefix="/workflow_engine", tags=["workflow_engine"])


class WorkflowNodeSchema(BaseModel):
    id: str
    agent_type: str
    config: Dict[str, Any] = Field(default_factory=dict)
    inputs: List[str] = Field(default_factory=list)


class WorkflowConnectionSchema(BaseModel):
    source_id: str
    target_id: str
    type: ConnectionType = ConnectionType.SUCCESS
    condition: Optional[str] = None


class WorkflowDefinitionSchema(BaseModel):
    workflow_id: str
    name: str
    nodes: List[WorkflowNodeSchema]
    connections: List[WorkflowConnectionSchema] = Field(default_factory=list)


class ExecutionRequest(BaseModel):
    data: Dict[str, Any] = Field(default_factory=dict)


@router.get("/")
async def list_workflows():
    workflows = [
        {"id": wf.id, "name": wf.name, "nodes": list(wf.nodes.keys())}
        for wf in runtime.workflows.values()
    ]
    return {"workflows": workflows, "total": len(workflows)}


@router.post("/", status_code=201)
async def create_workflow(definition: WorkflowDefinitionSchema):
    if definition.workflow_id in runtime.workflows:
        raise HTTPException(status_code=409, detail="Workflow already exists")

    wf = Workflow(definition.workflow_id, definition.name)
    for node in definition.nodes:
        wf_node = WorkflowNode(node.id, node.agent_type, node.config)
        wf_node.inputs = node.inputs
        wf.nodes[node.id] = wf_node

    for conn in definition.connections:
        wf.connections.append(
            WorkflowConnection(
                conn.source_id, conn.target_id, conn.type, conn.condition
            )
        )

    runtime.workflows[wf.id] = wf
    return {"status": "created", "id": wf.id}


@router.post("/{workflow_id}/execute")
async def execute_workflow(workflow_id: str, req: ExecutionRequest):
    if runtime.workflow_engine is None:
        raise HTTPException(status_code=500, detail="Workflow engine not initialised")

    workflow = runtime.workflows.get(workflow_id)
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")

    execution_id = await runtime.workflow_engine.execute_workflow(workflow, req.data)
    return {"execution_id": execution_id}

