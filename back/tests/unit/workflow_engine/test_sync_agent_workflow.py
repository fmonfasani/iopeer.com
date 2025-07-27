import asyncio
import sys

sys.path.append("back")
from workflow_engine.core.WorkflowEngine import (
    AgentRegistry,
    Workflow,
    WorkflowEngine,
    WorkflowNode,
    EventBus,
)
from agenthub.agents.backend_agent import BackendAgent


def test_single_sync_agent_workflow():
    registry = AgentRegistry()
    bus = EventBus()
    registry.register_agent("backend_agent", BackendAgent(), {})

    wf = Workflow("wf_sync", "sync")
    node = WorkflowNode("1", "backend_agent", {"action": "analyze_requirements"})
    wf.nodes = {"1": node}

    engine = WorkflowEngine(registry, bus)
    asyncio.run(engine.execute_workflow(wf, {"requirements": "Simple API"}))

    assert wf.nodes["1"].status.name == "COMPLETED"
    assert wf.nodes["1"].result["status"] == "success"
    assert "analysis" in wf.nodes["1"].result["data"]
