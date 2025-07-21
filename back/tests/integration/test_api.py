import pytest
from agenthub.main import app
from fastapi.testclient import TestClient


@pytest.fixture
def client():
    return TestClient(app)


class TestAPI:
    def test_root_endpoint(self, client):
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "AgentHub"
        assert "version" in data

    def test_health_check(self, client):
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data

    def test_list_agents(self, client):
        response = client.get("/agents")
        assert response.status_code == 200
        data = response.json()
        assert "agents" in data
        assert "total" in data

    def test_send_message(self, client):
        message_data = {
            "agent_id": "backend_agent",
            "action": "analyze_requirements",
            "data": {"requirements": "Simple API"},
        }

        response = client.post("/message/send", json=message_data)
        assert response.status_code == 200
        data = response.json()
        assert data["message_sent"] is True

    def test_list_workflows(self, client):
        response = client.get("/workflows")
        assert response.status_code == 200
        data = response.json()
        assert "workflows" in data

    def test_start_workflow(self, client):
        workflow_data = {
            "workflow": "api_development",
            "data": {"requirements": "Simple user API"},
        }

        response = client.post("/workflow/start", json=workflow_data)
        assert response.status_code == 200
        data = response.json()
        assert "execution_id" in data

    def test_send_message_unknown_agent(self, client):
        message_data = {"agent_id": "ghost", "action": "test"}
        response = client.post("/message/send", json=message_data)
        assert response.status_code == 404
        data = response.json()
        assert "ghost" in data["detail"]
        assert "Available agents" in data["detail"]
