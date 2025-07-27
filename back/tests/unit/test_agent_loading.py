import asyncio
import json
from agenthub.orchestrator import orchestrator

import back.main as main


def test_load_agents_from_registry(tmp_path, monkeypatch):
    registry = [
        {"id": "backend_agent", "class": "BackendAgent"},
        {"id": "qa_agent", "class": "QAAgent"},
        {"id": "content_writer", "class": "ContentWriterAgent"},
        {"id": "ui_component_generator", "class": "UIComponentGeneratorAgent"},
        {"id": "data_analyst", "class": "DataAnalystAgent"},
    ]

    registry_file = tmp_path / "registry.json"
    registry_file.write_text(json.dumps(registry))

    monkeypatch.setitem(main.config.settings, "registry_file", str(registry_file))

    orchestrator.agent_registry.agents.clear()

    asyncio.run(main.load_agents_from_registry())

    assert set(orchestrator.agent_registry.agents.keys()) == {
        "backend_agent",
        "qa_agent",
        "content_writer",
        "ui_component_generator",
        "data_analyst",
    }
