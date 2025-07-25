from typing import Any, Dict, List, Optional

from .base_agent import BaseAgent


class FastAPIGeneratorAgent(BaseAgent):
    """Agente que genera código base de FastAPI como endpoints CRUD."""

    def __init__(self) -> None:
        super().__init__("fastapi_generator", "FastAPI Code Generator")

    def get_capabilities(self) -> Dict[str, Any]:
        return {
            "actions": ["generate_crud_endpoint"],
            "description": "Genera código FastAPI automáticamente",
        }

    def handle(self, message: Dict[str, Any]) -> Dict[str, Any]:
        action = message.get("action")
        data = message.get("data", {})

        if action == "generate_crud_endpoint":
            return self._generate_crud_endpoint(data)

        return {"status": "error", "error": f"Acción '{action}' no reconocida"}

    def _generate_crud_endpoint(self, data: Dict[str, Any]) -> Dict[str, Any]:
        model_name: str = data.get("model_name", "Item")
        fields: List[Dict[str, Any]] = data.get("fields", [])
        include_auth: bool = data.get("include_auth", False)

        model_lines = [f"class {model_name}(BaseModel):"]
        for field in fields:
            field_name = field.get("name", "field")
            field_type = field.get("type", "str")
            optional = field.get("optional", False)
            if optional:
                model_lines.append(f"    {field_name}: Optional[{field_type}] = None")
            else:
                model_lines.append(f"    {field_name}: {field_type}")

        model_code = "\n".join(model_lines)

        endpoint_lines = [
            f"@app.post('/{model_name.lower()}s/', response_model={model_name})",
            f"def create_{model_name.lower()}(item: {model_name}):",
        ]
        if include_auth:
            endpoint_lines.append("    # TODO: validate auth")
        endpoint_lines.append("    return item")
        endpoint_code = "\n".join(endpoint_lines)

        return {
            "status": "success",
            "data": {
                "files_created": [f"{model_name.lower()}.py"],
                "model_code": model_code,
                "endpoint_code": endpoint_code,
            },
        }
