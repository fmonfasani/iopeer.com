import pytest
from fastapi.testclient import TestClient

from back.main import app


@pytest.fixture
def client():
    return TestClient(app)


def test_create_and_execute_workflow(client):
    workflow_def = {
        "workflow_id": "wf_test",
        "name": "Test Workflow",
        "nodes": [
            {
                "id": "n1",
                "agent_type": "backend_agent",
                "config": {"action": "analyze_requirements"},
                "inputs": [],
            }
        ],
    }
    res = client.post("/workflow_engine/", json=workflow_def)
    assert res.status_code == 201

    list_res = client.get("/workflow_engine/")
    assert list_res.status_code == 200
    assert any(wf["id"] == "wf_test" for wf in list_res.json()["workflows"])

    exec_res = client.post("/workflow_engine/wf_test/execute", json={"data": {}})
    assert exec_res.status_code == 200
    assert "execution_id" in exec_res.json()
