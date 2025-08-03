import asyncio

import pytest
from workflow_engine.core.WorkflowEngine import (
    AgentRegistry,
    Workflow,
    WorkflowConnection,
    WorkflowEngine,
    WorkflowNode,
    ConnectionType,
    EventBus,
    WorkflowExecution,
)


class DummyAgent:
    def __init__(self, result=None, fail=False):
        self.result = result or {}
        self.fail = fail

    async def handle(self, message):
        if self.fail:
            raise RuntimeError("boom")
        await asyncio.sleep(0.01)
        return {"handled": message.get("action"), **self.result}


def test_sequential_execution():
    registry = AgentRegistry()
    bus = EventBus()
    registry.register_agent("a", DummyAgent({"a": 1}), {})
    registry.register_agent("b", DummyAgent({"b": 2}), {})

    wf = Workflow("wf", "sequential")
    n1 = WorkflowNode("1", "a", {"action": "run"})
    n2 = WorkflowNode("2", "b", {"action": "run"})
    n2.inputs.append("1")
    wf.nodes = {"1": n1, "2": n2}
    wf.connections.append(WorkflowConnection("1", "2", ConnectionType.SUCCESS))

    engine = WorkflowEngine(registry, bus)
    asyncio.run(engine.execute_workflow(wf))

    assert wf.nodes["1"].status.name == "COMPLETED"
    assert wf.nodes["2"].status.name == "COMPLETED"
    assert wf.nodes["2"].result["b"] == 2


def test_parallel_execution():
    registry = AgentRegistry()
    bus = EventBus()
    registry.register_agent("a", DummyAgent({"a": 1}), {})
    registry.register_agent("b", DummyAgent({"b": 2}), {})

    wf = Workflow("wf2", "parallel")
    n1 = WorkflowNode("1", "a", {"action": "run"})
    n2 = WorkflowNode("2", "b", {"action": "run"})
    wf.nodes = {"1": n1, "2": n2}

    engine = WorkflowEngine(registry, bus)
    asyncio.run(engine.execute_workflow(wf))

    assert wf.nodes["1"].status.name == "COMPLETED"
    assert wf.nodes["2"].status.name == "COMPLETED"


def test_node_failure_handling():
    registry = AgentRegistry()
    bus = EventBus()
    registry.register_agent("a", DummyAgent(fail=True), {})
    registry.register_agent("b", DummyAgent({"b": 2}), {})

    wf = Workflow("wf3", "failure")
    n1 = WorkflowNode("1", "a", {"action": "run"})
    n2 = WorkflowNode("2", "b", {"action": "run"})
    n2.inputs.append("1")
    wf.nodes = {"1": n1, "2": n2}
    wf.connections.append(WorkflowConnection("1", "2", ConnectionType.SUCCESS))

    engine = WorkflowEngine(registry, bus)
    with pytest.raises(RuntimeError):
        asyncio.run(engine.execute_workflow(wf))

    assert wf.nodes["1"].status.name == "FAILED"
    assert wf.nodes["2"].status.name == "PENDING"


def test_condition_evaluation():
    registry = AgentRegistry()
    bus = EventBus()
    registry.register_agent("a", DummyAgent({"a": 1}), {})
    registry.register_agent("b", DummyAgent({"b": 2}), {})

    wf = Workflow("wf4", "conditions")
    n1 = WorkflowNode("1", "a", {"action": "run"})
    n2 = WorkflowNode("2", "b", {"action": "run", "condition": "False"})
    n2.inputs.append("1")
    wf.nodes = {"1": n1, "2": n2}
    wf.connections.append(WorkflowConnection("1", "2", ConnectionType.SUCCESS))

    engine = WorkflowEngine(registry, bus)
    asyncio.run(engine.execute_workflow(wf))

    assert wf.nodes["1"].status.name == "COMPLETED"
    assert wf.nodes["2"].status.name == "SKIPPED"
