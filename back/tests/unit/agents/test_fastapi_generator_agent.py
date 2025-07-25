import pytest
from agenthub.agents.fastapi_generator_agent import FastAPIGeneratorAgent


def test_generate_crud_endpoint_with_auth():
    agent = FastAPIGeneratorAgent()
    message = {
        "action": "generate_crud_endpoint",
        "data": {
            "model_name": "Item",
            "fields": [{"name": "name", "type": "str"}],
            "include_auth": True,
        },
    }
    result = agent.process_message(message)
    assert result["status"] == "success"
    endpoint_code = result["data"]["endpoint_code"]
    assert "Depends(oauth2_scheme)" in endpoint_code
