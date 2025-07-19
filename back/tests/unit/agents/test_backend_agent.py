from agenthub.agents.backend_agent import BackendAgent


class TestBackendAgent:
    def test_agent_creation(self):
        agent = BackendAgent()
        assert agent.agent_id == "backend_agent"
        assert agent.name == "Backend Code Generator"

    def test_generate_api(self):
        agent = BackendAgent()

        message = {
            "action": "generate_api",
            "data": {
                "specification": {
                    "endpoints": [
                        {
                            "method": "GET",
                            "path": "/users",
                            "name": "get_users",
                            "description": "Get all users",
                        }
                    ]
                }
            },
        }

        result = agent.process_message(message)

        assert result["status"] == "success"
        assert "data" in result
        assert "endpoints" in result["data"]

    def test_analyze_requirements(self):
        agent = BackendAgent()

        message = {
            "action": "analyze_requirements",
            "data": {
                "requirements": "Create a REST API for CRUD operations"
            },
        }

        result = agent.process_message(message)

        assert result["status"] == "success"
        assert "analysis" in result["data"]
        assert "suggested_frameworks" in result["data"]["analysis"]

    def test_invalid_action(self):
        agent = BackendAgent()

        message = {"action": "invalid_action"}

        result = agent.process_message(message)

        assert result["status"] == "error"
