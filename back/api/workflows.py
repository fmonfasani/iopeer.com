
import logging
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

logger = logging.getLogger(__name__)


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

    data = {
        "workflow_id": definition.workflow_id,
        "name": definition.name,
        "nodes": [n.model_dump() for n in definition.nodes],
        "connections": [c.model_dump() for c in definition.connections],
    }

    security = getattr(runtime, "security_manager", None)
    if security:
        validation = await security.validate_workflow_security(
            data, user_id="anonymous", user_tier="free"
        )
        for warning in validation.get("warnings", []):
            logger.warning(f"Workflow security warning: {warning}")
        metrics = validation.get("metrics")
        if metrics:
            logger.info(f"Workflow security metrics: {metrics}")
        if not validation.get("is_valid", False):
            raise HTTPException(status_code=400, detail="Workflow failed security validation")
        data = validation.get("sanitized_workflow", data)

    wf = Workflow(data["workflow_id"], data.get("name", ""))
    for node in data.get("nodes", []):
        wf_node = WorkflowNode(node.get("id"), node.get("agent_type"), node.get("config", {}))
        wf_node.inputs = node.get("inputs", [])
        wf.nodes[node.get("id")] = wf_node

    for conn in data.get("connections", []):
        conn_type = conn.get("type", ConnectionType.SUCCESS)
        if isinstance(conn_type, str):
            conn_type = ConnectionType(conn_type)
        wf.connections.append(
            WorkflowConnection(
                conn.get("source_id"), conn.get("target_id"), conn_type, conn.get("condition")
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

    security = getattr(runtime, "security_manager", None)
    if security:
        workflow_data = {
            "workflow_id": workflow.id,
            "name": workflow.name,
            "nodes": [
                {"id": n.id, "agent_type": n.agent_type, "config": n.config}
                for n in workflow.nodes.values()
            ],
            "connections": [
                {
                    "source_id": c.source_id,
                    "target_id": c.target_id,
                    "type": c.type.value,
                    "condition": getattr(c, "condition", None),
                }
                for c in workflow.connections
            ],
        }
        validation = await security.validate_workflow_security(
            workflow_data, user_id="anonymous", user_tier="free"
        )
        for warning in validation.get("warnings", []):
            logger.warning(f"Workflow security warning: {warning}")
        metrics = validation.get("metrics")
        if metrics:
            logger.info(f"Workflow security metrics: {metrics}")
        if not validation.get("is_valid", False):
            raise HTTPException(status_code=400, detail="Workflow failed security validation")

    execution_id = await runtime.workflow_engine.execute_workflow(workflow, req.data)
    return {"execution_id": execution_id}

