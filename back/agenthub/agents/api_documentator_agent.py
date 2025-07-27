from typing import Any, Dict

from agenthub.agents.base_agent import BaseAgent


class APIDocumentatorAgent(BaseAgent):
    """Agente especializado en documentación automática de APIs"""

    def __init__(self):
        super().__init__("api_documentator", "API Documentator")

    def get_capabilities(self) -> Dict[str, Any]:
        return {
            "actions": [
                "generate_openapi_spec",
                "create_postman_collection",
                "generate_readme",
                "create_integration_guide",
            ],
            "description": "Genera documentación automática para APIs",
        }

    def handle(self, message: Dict[str, Any]) -> Dict[str, Any]:
        action = message.get("action")
        data = message.get("data", {})

        if action == "generate_openapi_spec":
            return self._generate_openapi_spec(data)
        elif action == "create_postman_collection":
            return self._create_postman_collection(data)
        else:
            return {"status": "error", "error": f"Acción '{action}' no reconocida"}

    def _generate_openapi_spec(self, data: Dict[str, Any]) -> Dict[str, Any]:
        api_info = data.get("api_info", {})
        endpoints = data.get("endpoints", [])

        openapi_spec = {
            "openapi": "3.0.0",
            "info": {
                "title": api_info.get("title", "Mi API"),
                "version": api_info.get("version", "1.0.0"),
                "description": api_info.get(
                    "description", "API generada automáticamente"
                ),
            },
            "paths": {},
        }

        for endpoint in endpoints:
            path = endpoint.get("path", "/")
            method = endpoint.get("method", "GET").lower()

            if path not in openapi_spec["paths"]:
                openapi_spec["paths"][path] = {}

            openapi_spec["paths"][path][method] = {
                "summary": f"{method.upper()} {path}",
                "responses": {"200": {"description": "Successful response"}},
            }

        return {
            "status": "success",
            "data": {
                "openapi_spec": openapi_spec,
                "endpoints_documented": len(endpoints),
                "spec_file": "openapi.json",
            },
        }

    def _create_postman_collection(self, data: Dict[str, Any]) -> Dict[str, Any]:
        endpoints = data.get("endpoints", [])

        collection = {
            "info": {
                "name": "API Collection",
                "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
            },
            "item": [],
        }

        for endpoint in endpoints:
            item = {
                "name": f"{endpoint.get('method', 'GET')} {endpoint.get('path', '/')}",
                "request": {
                    "method": endpoint.get("method", "GET"),
                    "url": "{{base_url}}" + endpoint.get("path", "/"),
                },
            }
            collection["item"].append(item)

        return {
            "status": "success",
            "data": {
                "postman_collection": collection,
                "collection_file": "api_collection.json",
                "requests_included": len(endpoints),
            },
        }
