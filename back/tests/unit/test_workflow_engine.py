import pytest

from workflow_engine import (
    WorkflowEngine,
    Workflow,
    WorkflowNode,
    WorkflowConnection,
    AgentRegistry,
    EventBus,
    ConnectionType,
)


class DummyAgent:
    async def handle(self, message):
        return {"echo": message.get("data")}


@pytest.fixture
def engine():
    registry = AgentRegistry()
    registry.register_agent("dummy", DummyAgent())
    bus = EventBus()
    return WorkflowEngine(registry, bus)


@pytest.mark.asyncio
async def test_workflow_creation_and_execution(engine):
    wf = Workflow("wf1", "Test")
    wf.add_node(WorkflowNode("n1", "dummy", {}))
    engine.register_workflow(wf)

    assert engine.get_workflow("wf1") is wf

    result = await engine.execute("wf1", {"value": 1})
    assert result["n1"]["echo"] == {"value": 1}


@pytest.mark.asyncio
async def test_sequential_execution(engine):
    wf = Workflow("wf2", "Chain")
    wf.add_node(WorkflowNode("a", "dummy"))
    wf.add_node(WorkflowNode("b", "dummy"))
    wf.add_connection(WorkflowConnection("a", "b", ConnectionType.SUCCESS))

    engine.register_workflow(wf)
    result = await engine.execute("wf2", {"x": 2})
    assert list(result.keys()) == ["a", "b"]
