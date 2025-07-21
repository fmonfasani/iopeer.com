#!/usr/bin/env python3
"""Manual test script for the built-in agents."""

from agenthub.agents.backend_agent import BackendAgent
from agenthub.agents.qa_agent import QAAgent
from agenthub.orchestrator import Orchestrator


def test_backend_agents() -> None:
    """Run a quick sanity check for BackendAgent and QAAgent."""

    print("🧪 Testing Backend and QA Agents...")
    print("=" * 40)

    orchestrator = Orchestrator()
    orchestrator.register_agent(BackendAgent())
    orchestrator.register_agent(QAAgent())

    # BackendAgent - analyze requirements
    print("🏗️  Testing BackendAgent.analyze_requirements...")
    result = orchestrator.send_message(
        "backend_agent",
        {
            "action": "analyze_requirements",
            "data": {"requirements": "Simple REST API for products"},
        },
    )
    if result["status"] == "success":
        print("✅ analyze_requirements: OK")
    else:
        print(f"❌ analyze_requirements: {result.get('message')}")

    # BackendAgent - generate CRUD
    print("\n🚀 Testing BackendAgent.generate_crud...")
    result = orchestrator.send_message(
        "backend_agent",
        {
            "action": "generate_crud",
            "data": {"model_name": "Product", "operations": ["create", "read"]},
        },
    )
    if result["status"] == "success":
        print("✅ generate_crud: OK")
        print(f"   Operations: {result['data']['operations']}")
    else:
        print(f"❌ generate_crud: {result.get('message')}")

    # QAAgent - security scan
    print("\n🔒 Testing QAAgent.security_scan...")
    result = orchestrator.send_message(
        "qa_agent",
        {"action": "security_scan", "data": {"target": "api", "type": "basic"}},
    )
    if result["status"] == "success":
        issues = len(result["data"]["security_issues"])
        print("✅ security_scan: OK")
        print(f"   Issues found: {issues}")
    else:
        print(f"❌ security_scan: {result.get('message')}")

    # QAAgent - generate unit tests
    print("\n🧪 Testing QAAgent.generate_tests...")
    sample_code = "def add(a, b):\n    return a + b\n"
    result = orchestrator.send_message(
        "qa_agent",
        {
            "action": "generate_tests",
            "data": {"type": "unit", "target": sample_code},
        },
    )
    if result["status"] == "success":
        print("✅ generate_tests: OK")
        print(f"   Functions found: {result['data']['functions_found']}")
    else:
        print(f"❌ generate_tests: {result.get('message')}")

    print("\n🎉 Testing completado!")


if __name__ == "__main__":
    test_backend_agents()
