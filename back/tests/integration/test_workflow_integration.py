import pytest
from fastapi.testclient import TestClient

from agenthub.main import app
from agenthub.orchestrator import orchestrator
from agenthub.agents.data_analyst_agent import DataAnalystAgent


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture(scope="session", autouse=True)
def register_data_analyst_agent():
    orchestrator.register_agent(DataAnalystAgent())


@pytest.fixture
def auth_headers(client):
    credentials = {"email": "test@example.com", "password": "secret"}
    response = client.post("/api/v1/auth/login", json=credentials)
    token = response.json().get("access_token", "")
    return {"Authorization": f"Bearer {token}"}


class TestWorkflowIntegration:
    def test_agent_listing(self, client, auth_headers):
        response = client.get("/agents", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "agents" in data
        assert isinstance(data["agents"], list)

    def test_create_simple_workflow(self, client, auth_headers):
        payload = {
            "name": "simple_workflow",
            "tasks": ["backend_agent.analyze_requirements"],
        }
        response = client.post("/workflows/register", json=payload, headers=auth_headers)
        assert response.status_code in {200, 201}
        assert response.json()["status"] == "registered"

    def test_create_complex_workflow(self, client, auth_headers):
        payload = {
            "name": "complex_workflow",
            "tasks": [
                "backend_agent.analyze_requirements",
                "data_analyst.analyze_metrics",
                "qa_agent.generate_tests",
            ],
            "parallel": True,
            "timeout": 120,
        }
        response = client.post("/workflows/register", json=payload, headers=auth_headers)
        assert response.status_code in {200, 201}

    def test_workflow_execution(self, client, auth_headers):
        response = client.post(
            "/workflow/start",
            json={"workflow": "simple_workflow", "data": {"foo": "bar"}},
            headers=auth_headers,
        )
        assert response.status_code == 200
        assert response.json().get("status") == "completed"

    def test_templates_and_listing(self, client, auth_headers):
        response = client.get("/workflows", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "workflows" in data

    def test_validation_error(self, client, auth_headers):
        payload = {"name": "bad_workflow", "tasks": ["invalidtask"]}
        response = client.post("/workflows/register", json=payload, headers=auth_headers)
        assert response.status_code == 422

    def test_permission_required(self, client):
        payload = {"name": "unauth_workflow", "tasks": ["backend_agent.analyze_requirements"]}
        response = client.post("/workflows/register", json=payload)
        assert response.status_code in {401, 403}

    def test_large_workflow_performance(self, client, auth_headers):
        tasks = ["backend_agent.analyze_requirements" for _ in range(50)]
        payload = {"name": "large_workflow", "tasks": tasks}
        response = client.post("/workflows/register", json=payload, headers=auth_headers)
        assert response.status_code in {200, 201}

    def test_concurrent_workflow_executions(self, client, auth_headers):
        for _ in range(3):
            client.post(
                "/workflow/start",
                json={"workflow": "large_workflow"},
                headers=auth_headers,
            )

    def test_data_analyst_agent_integration(self, client, auth_headers):
        message = {
            "agent_id": "data_analyst",
            "action": "analyze_metrics",
            "data": {"metrics": {"views": [1, 2, 3]}},
        }
        response = client.post(
            "/agents/data_analyst/execute", json=message, headers=auth_headers
        )
        assert response.status_code == 200
        assert response.json()["status"] == "success"

    def test_websocket_connection(self, client):
        with pytest.raises(Exception):
            client.websocket_connect("/ws")
