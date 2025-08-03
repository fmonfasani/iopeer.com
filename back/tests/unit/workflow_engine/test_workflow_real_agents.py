import asyncio

from agenthub.agents.backend_agent import BackendAgent
from workflow_engine.core.WorkflowEngine import (
    AgentRegistry,
    Workflow,
    WorkflowConnection,
    WorkflowEngine,
    WorkflowNode,
    ConnectionType,
    EventBus,
)


def test_simple_workflow_backend_agent():
    registry = AgentRegistry()
    bus = EventBus()
    registry.register_agent("backend_agent", BackendAgent(), {})

    wf = Workflow("wf_backend", "backend")
    n1 = WorkflowNode("1", "backend_agent", {"action": "analyze_requirements"})
    n2 = WorkflowNode("2", "backend_agent", {"action": "generate_crud"})
    n2.inputs.append("1")
    wf.nodes = {"1": n1, "2": n2}
    wf.connections.append(WorkflowConnection("1", "2", ConnectionType.SUCCESS))

    engine = WorkflowEngine(registry, bus)

    initial_data = {
        "requirements": "Simple API",
        "model_name": "Item",
        "operations": ["create"],
    }

    asyncio.run(engine.execute_workflow(wf, initial_data))

    assert wf.nodes["1"].status.name == "COMPLETED"
    assert wf.nodes["2"].status.name == "COMPLETED"
    assert "crud_code" in wf.nodes["2"].result.get("data", {})

