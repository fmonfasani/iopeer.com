import pytest
from fastapi.testclient import TestClient

from main import app


@pytest.fixture
def client():
    return TestClient(app)


def test_duplicate_workflow_creation(client):
    payload = {
        "name": "simple",
        "nodes": [
            {"id": "n1", "agent_type": "backend_agent", "config": {"action": "analyze_requirements"}},
        ],
        "connections": [],
    }
    resp1 = client.post("/api/v1/workflows/create", json=payload)
    assert resp1.status_code == 200
    resp2 = client.post("/api/v1/workflows/create", json=payload)
    assert resp2.status_code == 409


def test_execute_nonexistent_workflow(client):
    resp = client.post("/api/v1/workflows/does-not-exist/execute", json={"data": {}})
    assert resp.status_code == 404
