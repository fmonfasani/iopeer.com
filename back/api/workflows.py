
from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from uuid import uuid4
from typing import Dict, Any, List

from workflow_engine.core.WorkflowEngine import (

    WorkflowEngine,
    Workflow,
    WorkflowNode,
    WorkflowConnection,

    AgentRegistry,
    EventBus,
    ConnectionType,
)

from agenthub.agents import (
    backend_agent,
    qa_agent,
    content_writer_agent,
    data_analyst_agent,
    database_architect_agent,
    fastapi_generator_agent,
    api_documentator_agent,
    security_auditor_agent,
    test_generator_agent,
    ui_component_generator,
)

router = APIRouter(prefix="/api/v1/workflows")

# Global objects
_event_bus = EventBus()
_registry = AgentRegistry()
_engine = WorkflowEngine(_registry, _event_bus)
_workflows: Dict[str, Workflow] = {}


def initialize_agent_registry() -> None:
    """Register all available agents in the registry."""
    _registry.register_agent(
        "backend_agent",
        backend_agent.BackendAgent(),
        backend_agent.BackendAgent().get_capabilities(),
    )
    _registry.register_agent(
        "qa_agent",
        qa_agent.QAAgent(),
        qa_agent.QAAgent().get_capabilities(),
    )
    _registry.register_agent(
        "content_writer_agent",
        content_writer_agent.ContentWriterAgent(),
        content_writer_agent.ContentWriterAgent().get_capabilities(),
    )
    _registry.register_agent(
        "data_analyst_agent",
        data_analyst_agent.DataAnalystAgent(),
        data_analyst_agent.DataAnalystAgent().get_capabilities(),
    )
    _registry.register_agent(
        "database_architect_agent",
        database_architect_agent.DatabaseArchitectAgent(),
        database_architect_agent.DatabaseArchitectAgent().get_capabilities(),
    )
    _registry.register_agent(
        "fastapi_generator_agent",
        fastapi_generator_agent.FastAPIGeneratorAgent(),
        fastapi_generator_agent.FastAPIGeneratorAgent().get_capabilities(),
    )
    _registry.register_agent(
        "api_documentator_agent",
        api_documentator_agent.APIDocumentatorAgent(),
        api_documentator_agent.APIDocumentatorAgent().get_capabilities(),
    )
    _registry.register_agent(
        "security_auditor_agent",
        security_auditor_agent.SecurityAuditorAgent(),
        security_auditor_agent.SecurityAuditorAgent().get_capabilities(),
    )
    _registry.register_agent(
        "test_generator_agent",
        test_generator_agent.TestGeneratorAgent(),
        test_generator_agent.TestGeneratorAgent().get_capabilities(),
    )
    _registry.register_agent(
        "ui_component_generator",
        ui_component_generator.UIComponentGeneratorAgent(),
        ui_component_generator.UIComponentGeneratorAgent().get_capabilities(),
    )


initialize_agent_registry()


@router.post("/create")
async def create_workflow(payload: Dict[str, Any]):
    """Create a workflow definition."""
    workflow_id = str(uuid4())
    workflow = Workflow(workflow_id, payload.get("name", workflow_id))

    for node_data in payload.get("nodes", []):
        node = WorkflowNode(
            node_data["id"],
            node_data["agent_type"],
            node_data.get("config", {}),
        )
        workflow.add_node(node)

    for conn_data in payload.get("connections", []):
        conn = WorkflowConnection(
            conn_data["source_id"],
            conn_data["target_id"],
            ConnectionType(conn_data.get("type", "success")),
            conn_data.get("condition"),
        )
        workflow.add_connection(conn)

    _workflows[workflow_id] = workflow
    return {"workflow_id": workflow_id}


@router.post("/{workflow_id}/execute")
async def execute_workflow(workflow_id: str, payload: Dict[str, Any]):
    workflow = _workflows.get(workflow_id)
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")

    execution_id = await _engine.execute_workflow(workflow, payload.get("data", {}))
    return {"execution_id": execution_id}


@router.websocket("/events")
async def workflow_events(ws: WebSocket):
    await ws.accept()
    _event_bus.register_websocket(ws)
    try:
        while True:
            await ws.receive_text()
    except WebSocketDisconnect:
        _event_bus.unregister_websocket(ws)
        await ws.close()
