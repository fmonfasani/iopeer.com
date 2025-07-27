import asyncio
import sys
import os
import json

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


async def verify_setup():
    """Verify that all components are working"""
    print("\N{left magnifying glass} Verifying IOPeer setup...")

    try:
        # Test 1: Import orchestrator
        from agenthub.orchestrator import AgentOrchestrator
        orchestrator = AgentOrchestrator()
        print("\N{check mark} Orchestrator imported successfully")

        # Test 2: Load agents
        from main import load_agents
        print("\N{check mark} Load agents function imported")

        # Test 3: Import all agents individually
        agents_to_test = [
            ("BackendAgent", "agenthub.agents.backend_agent"),
            ("QAAgent", "agenthub.agents.qa_agent"),
            ("UIGeneratorAgent", "agenthub.agents.ui_generator_agent"),
            ("DataAnalystAgent", "agenthub.agents.data_analyst_agent"),
        ]

        for agent_name, module_path in agents_to_test:
            try:
                module = __import__(module_path, fromlist=[agent_name])
                agent_class = getattr(module, agent_name)
                agent_instance = agent_class()
                print(f"\N{check mark} {agent_name} loaded successfully")

                # Test capabilities
                if hasattr(agent_instance, 'get_capabilities'):
                    caps = agent_instance.get_capabilities()
                    print(f"   \N{clipboard} Actions: {caps.get('actions', [])}")

            except Exception as e:
                print(f"\N{cross mark} {agent_name} failed: {e}")

        print("\n\N{bullseye} Setup verification complete!")
        print("Ready to start the server with: python main.py")

    except Exception as e:
        print(f"\N{cross mark} Setup verification failed: {e}")


if __name__ == "__main__":
    asyncio.run(verify_setup())
