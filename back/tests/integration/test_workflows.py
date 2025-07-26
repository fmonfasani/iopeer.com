import pytest
from fastapi.testclient import TestClient

from main import app

@pytest.fixture
def client():
    return TestClient(app)


def create_simple_workflow(client: TestClient):
    payload = {
        "name": "simple",
        "nodes": [
            {"id": "n1", "agent_type": "backend_agent", "config": {"action": "analyze_requirements"}},
        ],
        "connections": [],
    }
    resp = client.post("/api/v1/workflows/create", json=payload)
    assert resp.status_code == 200
    return resp.json()["workflow_id"]


def test_create_workflow(client):
    workflow_id = create_simple_workflow(client)
    assert workflow_id


def test_execute_workflow(client):
    workflow_id = create_simple_workflow(client)
    resp = client.post(f"/api/v1/workflows/{workflow_id}/execute", json={"data": {}})
    assert resp.status_code == 200
    assert "execution_id" in resp.json()


def test_event_stream(client):
    workflow_id = create_simple_workflow(client)
    with client.websocket_connect("/api/v1/workflows/events") as ws:
        exec_resp = client.post(f"/api/v1/workflows/{workflow_id}/execute", json={"data": {}})
        assert exec_resp.status_code == 200
        message = ws.receive_json()
        assert "type" in message
