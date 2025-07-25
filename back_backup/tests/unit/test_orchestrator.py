import pytest
from agenthub.agents.base_agent import BaseAgent
from agenthub.orchestrator import AgentRegistry, Orchestrator, WorkflowRegistry


class MockAgent(BaseAgent):
    def __init__(self, agent_id="mock_agent"):
        super().__init__(agent_id)

    def handle(self, message):
        return {"status": "success", "data": "mock_response"}


class TestAgentRegistry:
    def test_register_agent(self):
        registry = AgentRegistry()
        agent = MockAgent()

        registry.register(agent)

        assert "mock_agent" in registry.agents
        assert registry.get("mock_agent") == agent

    def test_list_agents(self):
        registry = AgentRegistry()
        agent1 = MockAgent("agent1")
        agent2 = MockAgent("agent2")

        registry.register(agent1)
        registry.register(agent2)

        agents = registry.list_agents()
        assert len(agents) == 2
        assert "agent1" in agents
        assert "agent2" in agents


class TestWorkflowRegistry:
    def test_register_workflow(self):
        registry = WorkflowRegistry()

        registry.register(
            "test_workflow", {"tasks": ["agent1.action1", "agent2.action2"]}
        )

        workflow = registry.get("test_workflow")
        assert workflow is not None
        assert workflow["tasks"] == ["agent1.action1", "agent2.action2"]


class TestOrchestrator:
    def test_send_message(self):
        orchestrator = Orchestrator()
        agent = MockAgent()
        orchestrator.register_agent(agent)

        result = orchestrator.send_message(
            "mock_agent", {"action": "test_action", "data": {"test": "data"}}
        )

        assert result["status"] == "success"

    def test_send_message_unknown_agent(self):
        orchestrator = Orchestrator()

        with pytest.raises(ValueError) as exc:
            orchestrator.send_message("ghost", {"action": "test"})

        assert "ghost" in str(exc.value)
        assert "Available agents" in str(exc.value)

    def test_execute_workflow(self):
        orchestrator = Orchestrator()
        agent = MockAgent()
        orchestrator.register_agent(agent)

        orchestrator.register_workflow("test_workflow", ["mock_agent.test_action"])

        result = orchestrator.execute_workflow("test_workflow")

        assert result["status"] == "completed"
        assert "execution_id" in result
