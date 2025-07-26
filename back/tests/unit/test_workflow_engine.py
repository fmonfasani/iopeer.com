import pytest

from workflow_engine.core.WorkflowEngine import Workflow, WorkflowExecution, EventBus


class DummyEventBus(EventBus):
    async def emit(self, event_type: str, data):
        pass


def create_execution(context=None):
    workflow = Workflow("wf", "Test")
    bus = DummyEventBus()
    return WorkflowExecution("exec", workflow, context or {}, bus)


def test_valid_condition():
    exec_ctx = create_execution({"value": 5})
    cond = "'value' in {initial_data} and {initial_data}['value'] > 3"
    assert exec_ctx._evaluate_condition(cond) is True


def test_malicious_condition_blocked():
    exec_ctx = create_execution({})
    assert exec_ctx._evaluate_condition("__import__('os').system('echo hi')") is False
