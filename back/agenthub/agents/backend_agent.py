# agenthub/agents/backend_agent.py
from typing import Any, Dict

from .base_agent import BaseAgent


class BackendAgent(BaseAgent):
    """
    Agente especializado en generación de código backend y APIs.
    Puede generar código, documentación, y configuraciones.
    """

    def __init__(self):
        super().__init__(agent_id="backend_agent", name="Backend Code Generator")
        self.templates = self._load_templates()

    def _load_templates(self) -> Dict[str, str]:
        """Carga templates para generación de código"""
        return {
            "fastapi_endpoint": '''
@app.{method}("/{path}")
def {function_name}({params}):
    """
    {description}
    """
    try:
        # Implementation here
        return {{"status": "success", "data": {{}}}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
''',
            "pydantic_model": '''
class {model_name}(BaseModel):
    """
    {description}
    """
{fields}
''',
            "database_model": """
class {model_name}(Base):
    __tablename__ = "{table_name}"

{fields}
""",
        }

    def handle(self, message: Dict[str, Any]) -> Dict[str, Any]:
        """Procesa mensajes del agente backend"""
        action = message.get("action")
        data = message.get("data", {})

        handlers = {
            "generate_api": self._generate_api,
            "generate_model": self._generate_model,
            "generate_crud": self._generate_crud,
            "analyze_requirements": self._analyze_requirements,
            "suggest_architecture": self._suggest_architecture,
        }

        handler = handlers.get(str(action))
        if not handler:
            return {
                "status": "error",
                "message": f"Action '{action}' not supported by BackendAgent",
            }

        return handler(data)

    def _generate_api(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Genera código de API basado en especificaciones"""
        spec = data.get("specification", {})

        if not spec:
            return {"status": "error", "message": "API specification required"}

        endpoints = []
        models = []

        for endpoint in spec.get("endpoints", []):
            method = endpoint.get("method", "get").lower()
            path = endpoint.get("path", "/")
            function_name = endpoint.get("name", f"{method}_{path.replace('/', '_')}")
            description = endpoint.get("description", "Generated endpoint")

            # Generar parámetros
            params = []
            for param in endpoint.get("parameters", []):
                param_str = f"{param['name']}: {param.get('type', 'str')}"
                if param.get("optional", False):
                    param_str += f" = {param.get('default', 'None')}"
                params.append(param_str)

            endpoint_code = self.templates["fastapi_endpoint"].format(
                method=method,
                path=path.lstrip("/"),
                function_name=function_name,
                params=", ".join(params),
                description=description,
            )
            endpoints.append(endpoint_code)

        # Generar modelos Pydantic
        for model in spec.get("models", []):
            fields = []
            for field in model.get("fields", []):
                field_type = field.get("type", "str")
                field_name = field.get("name")
                optional = field.get("optional", False)

                if optional:
                    field_line = f"    {field_name}: Optional[{field_type}] = None"
                else:
                    field_line = f"    {field_name}: {field_type}"

                fields.append(field_line)

            model_code = self.templates["pydantic_model"].format(
                model_name=model.get("name", "GeneratedModel"),
                description=model.get("description", "Generated model"),
                fields="\n".join(fields),
            )
            models.append(model_code)

        return {
            "status": "success",
            "data": {
                "endpoints": endpoints,
                "models": models,
                "complete_code": self._combine_code(endpoints, models),
            },
        }

    def _generate_model(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Genera modelo de datos"""
        model_type = data.get("type", "pydantic")
        model_name = data.get("name", "GeneratedModel")
        fields = data.get("fields", [])

        if model_type == "pydantic":
            field_lines = []
            for field in fields:
                field_name = field.get("name")
                field_type = field.get("type", "str")
                optional = field.get("optional", False)

                if optional:
                    line = f"    {field_name}: Optional[{field_type}] = None"
                else:
                    line = f"    {field_name}: {field_type}"

                field_lines.append(line)

            code = self.templates["pydantic_model"].format(
                model_name=model_name,
                description=data.get("description", "Generated model"),
                fields="\n".join(field_lines),
            )
        else:
            return {
                "status": "error",
                "message": f"Model type '{model_type}' not supported",
            }

        return {
            "status": "success",
            "data": {
                "model_code": code,
                "model_name": model_name,
                "model_type": model_type,
            },
        }

    def _generate_crud(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Genera operaciones CRUD"""
        model_name = data.get("model_name", "Item")
        operations = data.get("operations", ["create", "read", "update", "delete"])

        crud_code = f"# CRUD operations for {model_name}\n\n"

        if "create" in operations:
            crud_code += f'''
@app.post("/{model_name.lower()}s/", response_model={model_name})
def create_{model_name.lower()}(item: {model_name}Create):
    """Create a new {model_name}"""
    # Implementation here
    return item
'''

        if "read" in operations:
            crud_code += f'''
@app.get("/{model_name.lower()}s/{{item_id}}", response_model={model_name})
def read_{model_name.lower()}(item_id: int):
    """Get {model_name} by ID"""
    # Implementation here
    return {{"id": item_id}}

@app.get("/{model_name.lower()}s/", response_model=List[{model_name}])
def read_{model_name.lower()}s(skip: int = 0, limit: int = 100):
    """Get multiple {model_name}s"""
    # Implementation here
    return []
'''

        if "update" in operations:
            crud_code += f'''
@app.put("/{model_name.lower()}s/{{item_id}}", response_model={model_name})
def update_{model_name.lower()}(item_id: int, item: {model_name}Update):
    """Update {model_name}"""
    # Implementation here
    return item
'''

        if "delete" in operations:
            crud_code += f'''
@app.delete("/{model_name.lower()}s/{{item_id}}")
def delete_{model_name.lower()}(item_id: int):
    """Delete {model_name}"""
    # Implementation here
    return {{"message": "{model_name} deleted"}}
'''

        return {
            "status": "success",
            "data": {
                "crud_code": crud_code,
                "operations": operations,
                "model_name": model_name,
            },
        }

    def _analyze_requirements(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Analiza requerimientos y sugiere implementación"""
        requirements = data.get("requirements", "")

        if not requirements:
            return {"status": "error", "message": "Requirements text required"}

        # Análisis simple basado en palabras clave
        analysis: Dict[str, Any] = {
            "suggested_frameworks": [],
            "suggested_patterns": [],
            "complexity_score": "medium",
            "estimated_time": "1-2 weeks",
        }

        req_lower = requirements.lower()

        # Detectar frameworks
        if any(word in req_lower for word in ["api", "rest", "endpoint"]):
            analysis["suggested_frameworks"].append("FastAPI")

        if any(word in req_lower for word in ["database", "db", "storage"]):
            analysis["suggested_frameworks"].extend(["SQLAlchemy", "Alembic"])

        if any(word in req_lower for word in ["auth", "login", "user"]):
            analysis["suggested_frameworks"].append("JWT Authentication")

        # Detectar patrones
        if "crud" in req_lower:
            analysis["suggested_patterns"].append("CRUD Pattern")

        if any(word in req_lower for word in ["microservice", "service"]):
            analysis["suggested_patterns"].append("Microservices")

        # Estimar complejidad
        complexity_indicators = [
            "complex",
            "integration",
            "multiple",
            "advanced",
            "machine learning",
            "ai",
            "distributed",
        ]

        if any(indicator in req_lower for indicator in complexity_indicators):
            analysis["complexity_score"] = "high"
            analysis["estimated_time"] = "3-6 weeks"
        elif len(requirements.split()) > 100:
            analysis["complexity_score"] = "medium"
            analysis["estimated_time"] = "1-3 weeks"
        else:
            analysis["complexity_score"] = "low"
            analysis["estimated_time"] = "1-5 days"

        return {
            "status": "success",
            "data": {"analysis": analysis, "requirements": requirements},
        }

    def _suggest_architecture(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Sugiere arquitectura basada en requerimientos"""
        project_type = data.get("type", "api")
        scale = data.get("scale", "small")

        architecture: Dict[str, Any] = {
            "layers": [],
            "components": [],
            "technologies": [],
            "deployment": [],
        }

        if project_type == "api":
            architecture["layers"] = [
                "Presentation Layer (FastAPI)",
                "Business Logic Layer",
                "Data Access Layer",
                "Database Layer",
            ]

            architecture["components"] = [
                "API Router",
                "Request/Response Models",
                "Service Layer",
                "Repository Pattern",
                "Database Models",
            ]

            architecture["technologies"] = [
                "FastAPI",
                "Pydantic",
                "SQLAlchemy",
                "PostgreSQL/MySQL",
            ]

        if scale == "large":
            architecture["components"].extend(
                [
                    "Message Queue (Redis/RabbitMQ)",
                    "Caching Layer",
                    "Load Balancer",
                    "API Gateway",
                ]
            )

            architecture["deployment"] = [
                "Docker Containers",
                "Kubernetes",
                "CI/CD Pipeline",
                "Monitoring (Prometheus/Grafana)",
            ]
        else:
            architecture["deployment"] = [
                "Docker Compose",
                "Single Server Deployment",
                "Basic Monitoring",
            ]

        return {
            "status": "success",
            "data": {
                "architecture": architecture,
                "project_type": project_type,
                "scale": scale,
            },
        }

    def _combine_code(self, endpoints: list, models: list) -> str:
        """Combina código generado en un archivo completo"""
        imports = """
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, List

app = FastAPI()
"""

        models_section = "\n# Models\n" + "\n".join(models) if models else ""
        endpoints_section = (
            "\n# Endpoints\n" + "\n".join(endpoints) if endpoints else ""
        )

        return imports + models_section + endpoints_section

    def get_capabilities(self) -> Dict[str, Any]:
        """Retorna capacidades del agente backend"""
        return {
            "actions": [
                "generate_api",
                "generate_model",
                "generate_crud",
                "analyze_requirements",
                "suggest_architecture",
            ],
            "description": "Backend code generation and architecture analysis",
            "supported_frameworks": ["FastAPI", "SQLAlchemy", "Pydantic"],
            "supported_patterns": ["CRUD", "Repository", "Service Layer"],
        }
