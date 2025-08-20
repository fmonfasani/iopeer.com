import pytest

from security.workflow_security import WorkflowSecurityManager


@pytest.mark.asyncio
async def test_sanitizes_dangerous_config():
    manager = WorkflowSecurityManager()
    node = {"id": "n1", "config": {"system_commands": "rm -rf /", "safe": "ok"}}
    sanitized = await manager._sanitize_node_config(node, "free")
    assert "system_commands" not in sanitized["config"]
    assert sanitized["config"]["safe"] == "ok"


@pytest.mark.asyncio
async def test_detects_malicious_pattern():
    manager = WorkflowSecurityManager()
    workflow = {"nodes": [{"id": "n1", "agent_type": "backend_agent", "config": {"cmd": "rm -rf /"}}]}
    result = await manager.validate_workflow_security(workflow, "user1", "free")
    assert result["is_valid"] is False
    assert "Patrones maliciosos detectados" in result["errors"]
