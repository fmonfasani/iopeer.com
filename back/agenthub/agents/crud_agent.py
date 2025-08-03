# ============================================
# back/agenthub/agents/crud_agent.py
# Agente CRUD Automatizado para IOPeer
# Basado en el análisis del Framework Dynamus
# ============================================

import json
import re
from datetime import datetime
from typing import Any, Dict, List, Optional, Union

from jinja2 import Template

from .base_agent import BaseAgent


class CRUDAgent(BaseAgent):
    """
    Agente CRUD automatizado que genera código completo de operaciones
    Create, Read, Update, Delete para entidades específicas.

    Basado en el Framework Dynamus, genera código FastAPI + Pydantic + SQLAlchemy
    listo para producción con validaciones, documentación y tests.
    """

    def __init__(self):
        super().__init__("crud_agent", "CRUD Generator AI")
        self.supported_frameworks = ["fastapi", "django", "flask"]
        self.supported_databases = ["postgresql", "mysql", "sqlite", "mongodb"]
        self.code_templates = self._initialize_templates()

    def handle(self, message: Dict[str, Any]) -> Dict[str, Any]:
        """Maneja las peticiones de generación CRUD"""
        action = message.get("action")
        data = message.get("data", {})

        try:
            if action == "generate_crud":
                return self._generate_crud(data)
            elif action == "generate_api":
                return self._generate_api(data)
            elif action == "generate_models":
                return self._generate_models(data)
            elif action == "generate_repository":
                return self._generate_repository(data)
            elif action == "generate_service":
                return self._generate_service(data)
            elif action == "generate_tests":
                return self._generate_tests(data)
            elif action == "analyze_entity":
                return self._analyze_entity(data)
            elif action == "validate_schema":
                return self._validate_schema(data)
            elif action == "generate_complete_module":
                return self._generate_complete_module(data)
            else:
                return {"status": "error", "error": f"Acción no soportada: {action}"}
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "details": "Error en el agente CRUD",
            }

    def _generate_crud(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Genera operaciones CRUD completas para una entidad"""

        # Validar entrada
        validation = self._validate_crud_input(data)
        if not validation["is_valid"]:
            return {
                "status": "error",
                "error": "Entrada inválida",
                "validation_errors": validation["errors"],
            }

        # Extraer datos
        entity_name = data.get("entity_name", "Item")
        fields = data.get("fields", [])
        operations = data.get("operations", ["create", "read", "update", "delete"])
        framework = data.get("framework", "fastapi")
        include_auth = data.get("include_auth", False)
        include_pagination = data.get("include_pagination", True)

        # Generar modelos
        models_result = self._generate_pydantic_models(entity_name, fields)

        # Generar endpoints
        endpoints_result = self._generate_crud_endpoints(
            entity_name, fields, operations, include_auth, include_pagination
        )

        # Generar SQLAlchemy models
        sqlalchemy_result = self._generate_sqlalchemy_model(entity_name, fields)

        # Generar código completo
        complete_code = self._combine_crud_code(
            models_result["code"],
            endpoints_result["code"],
            sqlalchemy_result["code"],
            entity_name,
        )

        return {
            "status": "success",
            "data": {
                "entity_name": entity_name,
                "operations": operations,
                "framework": framework,
                "models_code": models_result["code"],
                "endpoints_code": endpoints_result["code"],
                "sqlalchemy_code": sqlalchemy_result["code"],
                "complete_code": complete_code,
                "files_structure": {
                    f"models/{entity_name.lower()}.py": models_result["code"],
                    f"api/{entity_name.lower()}.py": endpoints_result["code"],
                    f"db/{entity_name.lower()}.py": sqlalchemy_result["code"],
                    f"schemas/{entity_name.lower()}.py": models_result["schemas_code"],
                },
                "generated_at": datetime.now().isoformat(),
                "metadata": {
                    "field_count": len(fields),
                    "operations_count": len(operations),
                    "estimated_lines": len(complete_code.split("\n")),
                    "includes_auth": include_auth,
                    "includes_pagination": include_pagination,
                },
            },
        }

    def _generate_api(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Genera API completa con múltiples endpoints personalizados"""

        endpoints = data.get("endpoints", [])
        models = data.get("models", [])
        global_config = data.get("config", {})

        generated_endpoints = []
        generated_models = []
        imports = set()

        # Generar modelos
        for model_spec in models:
            model_code = self._generate_custom_model(model_spec)
            generated_models.append(model_code)
            imports.update(model_code.get("imports", []))

        # Generar endpoints
        for endpoint_spec in endpoints:
            endpoint_code = self._generate_custom_endpoint(endpoint_spec, global_config)
            generated_endpoints.append(endpoint_code)
            imports.update(endpoint_code.get("imports", []))

        # Combinar todo
        complete_api_code = self._combine_api_code(
            list(imports), generated_models, generated_endpoints
        )

        return {
            "status": "success",
            "data": {
                "endpoints": [ep["code"] for ep in generated_endpoints],
                "models": [m["code"] for m in generated_models],
                "complete_code": complete_api_code,
                "imports": list(imports),
                "endpoints_count": len(generated_endpoints),
                "models_count": len(generated_models),
                "files_created": [
                    "main.py",  # Archivo principal con toda la API
                    "models.py",  # Solo modelos
                    "routes.py",  # Solo endpoints
                ],
            },
        }

    def _generate_complete_module(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Genera un módulo completo con arquitectura en capas"""

        entity_name = data.get("entity_name")
        fields = data.get("fields", [])
        config = data.get("config", {})

        architecture = config.get("architecture", "simple")  # simple, layered, clean
        include_tests = config.get("include_tests", True)
        include_docs = config.get("include_docs", True)

        module_files = {}

        # 1. Modelos (Entities/Models)
        models_code = self._generate_comprehensive_models(
            entity_name, fields, architecture
        )
        module_files[f"app/models/{entity_name.lower()}.py"] = models_code

        # 2. Esquemas (DTOs/Schemas)
        schemas_code = self._generate_comprehensive_schemas(entity_name, fields)
        module_files[f"app/schemas/{entity_name.lower()}.py"] = schemas_code

        # 3. Repository Layer (si arquitectura layered/clean)
        if architecture in ["layered", "clean"]:
            repository_code = self._generate_repository_layer(entity_name, fields)
            module_files[f"app/repositories/{entity_name.lower()}_repository.py"] = (
                repository_code
            )

        # 4. Service Layer (si arquitectura layered/clean)
        if architecture in ["layered", "clean"]:
            service_code = self._generate_service_layer(
                entity_name, fields, architecture
            )
            module_files[f"app/services/{entity_name.lower()}_service.py"] = (
                service_code
            )

        # 5. API Layer (Controllers/Routes)
        api_code = self._generate_api_layer(entity_name, fields, architecture)
        module_files[f"app/api/{entity_name.lower()}.py"] = api_code

        # 6. Tests (si incluido)
        if include_tests:
            tests_code = self._generate_comprehensive_tests(
                entity_name, fields, architecture
            )
            module_files[f"tests/test_{entity_name.lower()}.py"] = tests_code

        # 7. Documentación (si incluido)
        if include_docs:
            docs_code = self._generate_documentation(entity_name, fields)
            module_files[f"docs/{entity_name.lower()}.md"] = docs_code

        # 8. Archivos de configuración
        config_files = self._generate_config_files(entity_name, config)
        module_files.update(config_files)

        # 9. Migration (Alembic)
        migration_code = self._generate_migration(entity_name, fields)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        module_files[
            f"alembic/versions/{timestamp}_create_{entity_name.lower()}.py"
        ] = migration_code

        return {
            "status": "success",
            "data": {
                "entity_name": entity_name,
                "architecture": architecture,
                "module_files": module_files,
                "file_count": len(module_files),
                "structure": self._generate_directory_structure(module_files),
                "installation_guide": self._generate_installation_guide(entity_name),
                "usage_examples": self._generate_usage_examples(entity_name, fields),
                "metadata": {
                    "total_lines": sum(
                        len(code.split("\n")) for code in module_files.values()
                    ),
                    "architecture_pattern": architecture,
                    "includes_tests": include_tests,
                    "includes_docs": include_docs,
                    "generated_at": datetime.now().isoformat(),
                },
            },
        }

    def _initialize_templates(self) -> Dict[str, Template]:
        """Inicializa las plantillas Jinja2 para generación de código"""

        templates = {}

        # Template para modelo Pydantic
        templates["pydantic_model"] = Template(
            """
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class {{ model_name }}(BaseModel):
    \"\"\"{{ model_description }}\"\"\"
    {%- for field in fields %}
    {{ field.name }}: {{ field.type }}{% if field.description %} = Field(..., description="{{ field.description }}"){% endif %}
    {%- endfor %}

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                {%- for field in fields %}
                "{{ field.name }}": {{ field.example }},
                {%- endfor %}
            }
        }

class {{ model_name }}Create(BaseModel):
    \"\"\"Schema para crear {{ model_name }}\"\"\"
    {%- for field in fields if not field.auto_generated %}
    {{ field.name }}: {{ field.type }}{% if field.description %} = Field(..., description="{{ field.description }}"){% endif %}
    {%- endfor %}

class {{ model_name }}Update(BaseModel):
    \"\"\"Schema para actualizar {{ model_name }}\"\"\"
    {%- for field in fields if not field.auto_generated %}
    {{ field.name }}: Optional[{{ field.type }}] = None
    {%- endfor %}
"""
        )

        # Template para endpoints FastAPI
        templates["fastapi_endpoints"] = Template(
            """
from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from sqlalchemy.orm import Session
from app.core.database import get_db
{%- if include_auth %}
from app.core.security import get_current_user
{%- endif %}
from app.schemas.{{ model_name.lower() }} import {{ model_name }}, {{ model_name }}Create, {{ model_name }}Update
from app.services.{{ model_name.lower() }}_service import {{ model_name }}Service

router = APIRouter()

@router.post("/{{ model_name.lower() }}/", response_model={{ model_name }})
def create_{{ model_name.lower() }}(
    {{ model_name.lower() }}: {{ model_name }}Create,
    db: Session = Depends(get_db){% if include_auth %},
    current_user = Depends(get_current_user){% endif %}
):
    \"\"\"Crear nuevo {{ model_name }}\"\"\"
    service = {{ model_name }}Service(db)
    return service.create({{ model_name.lower() }})

@router.get("/{{ model_name.lower() }}/{item_id}", response_model={{ model_name }})
def get_{{ model_name.lower() }}(
    item_id: int,
    db: Session = Depends(get_db){% if include_auth %},
    current_user = Depends(get_current_user){% endif %}
):
    \"\"\"Obtener {{ model_name }} por ID\"\"\"
    service = {{ model_name }}Service(db)
    item = service.get_by_id(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="{{ model_name }} no encontrado")
    return item

{%- if include_pagination %}
@router.get("/{{ model_name.lower() }}/", response_model=List[{{ model_name }}])
def list_{{ model_name.lower() }}(
    skip: int = Query(0, ge=0, description="Elementos a omitir"),
    limit: int = Query(100, ge=1, le=1000, description="Límite de elementos"),
    db: Session = Depends(get_db){% if include_auth %},
    current_user = Depends(get_current_user){% endif %}
):
    \"\"\"Listar {{ model_name }}s con paginación\"\"\"
    service = {{ model_name }}Service(db)
    return service.get_multi(skip=skip, limit=limit)
{%- endif %}

@router.put("/{{ model_name.lower() }}/{item_id}", response_model={{ model_name }})
def update_{{ model_name.lower() }}(
    item_id: int,
    {{ model_name.lower() }}_update: {{ model_name }}Update,
    db: Session = Depends(get_db){% if include_auth %},
    current_user = Depends(get_current_user){% endif %}
):
    \"\"\"Actualizar {{ model_name }}\"\"\"
    service = {{ model_name }}Service(db)
    item = service.get_by_id(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="{{ model_name }} no encontrado")
    return service.update(item_id, {{ model_name.lower() }}_update)

@router.delete("/{{ model_name.lower() }}/{item_id}")
def delete_{{ model_name.lower() }}(
    item_id: int,
    db: Session = Depends(get_db){% if include_auth %},
    current_user = Depends(get_current_user){% endif %}
):
    \"\"\"Eliminar {{ model_name }}\"\"\"
    service = {{ model_name }}Service(db)
    if not service.get_by_id(item_id):
        raise HTTPException(status_code=404, detail="{{ model_name }} no encontrado")
    service.delete(item_id)
    return {"message": "{{ model_name }} eliminado exitosamente"}
"""
        )

        # Template para modelo SQLAlchemy
        templates["sqlalchemy_model"] = Template(
            """
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text
from sqlalchemy.sql import func
from app.core.database import Base

class {{ model_name }}(Base):
    __tablename__ = "{{ table_name }}"

    {%- for field in fields %}
    {{ field.name }} = Column({{ field.sql_type }}{% if field.primary_key %}, primary_key=True{% endif %}{% if field.index %}, index=True{% endif %}{% if field.unique %}, unique=True{% endif %}{% if field.nullable == False %}, nullable=False{% endif %}{% if field.default %}, default={{ field.default }}{% endif %})
    {%- endfor %}

    # Timestamps automáticos
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<{{ model_name }}(id={self.id})>"
"""
        )

        # Template para Service Layer
        templates["service_layer"] = Template(
            """
from typing import List, Optional, Type, TypeVar, Generic
from sqlalchemy.orm import Session
from app.repositories.{{ model_name.lower() }}_repository import {{ model_name }}Repository
from app.schemas.{{ model_name.lower() }} import {{ model_name }}Create, {{ model_name }}Update
from app.models.{{ model_name.lower() }} import {{ model_name }}

class {{ model_name }}Service:
    \"\"\"Servicio para manejar lógica de negocio de {{ model_name }}\"\"\"

    def __init__(self, db: Session):
        self.repository = {{ model_name }}Repository(db)

    def create(self, obj_in: {{ model_name }}Create) -> {{ model_name }}:
        \"\"\"Crear nuevo {{ model_name }}\"\"\"
        # Aquí puedes agregar validaciones de negocio
        return self.repository.create(obj_in)

    def get_by_id(self, id: int) -> Optional[{{ model_name }}]:
        \"\"\"Obtener {{ model_name }} por ID\"\"\"
        return self.repository.get(id)

    def get_multi(self, skip: int = 0, limit: int = 100) -> List[{{ model_name }}]:
        \"\"\"Obtener múltiples {{ model_name }}s\"\"\"
        return self.repository.get_multi(skip=skip, limit=limit)

    def update(self, id: int, obj_in: {{ model_name }}Update) -> {{ model_name }}:
        \"\"\"Actualizar {{ model_name }}\"\"\"
        db_obj = self.repository.get(id)
        if not db_obj:
            raise ValueError("{{ model_name }} no encontrado")
        return self.repository.update(db_obj, obj_in)

    def delete(self, id: int) -> bool:
        \"\"\"Eliminar {{ model_name }}\"\"\"
        return self.repository.delete(id)

    # Métodos de negocio específicos pueden agregarse aquí
    {%- for method in business_methods %}
    {{ method }}
    {%- endfor %}
"""
        )

        return templates

    def _validate_crud_input(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Valida la entrada para generación CRUD"""

        errors = []

        # Validar nombre de entidad
        entity_name = data.get("entity_name")
        if not entity_name:
            errors.append("entity_name es requerido")
        elif not re.match(r"^[A-Za-z][A-Za-z0-9_]*$", entity_name):
            errors.append("entity_name debe ser un identificador válido")

        # Validar campos
        fields = data.get("fields", [])
        if not fields:
            errors.append("Se requiere al menos un campo")

        for i, field in enumerate(fields):
            if not isinstance(field, dict):
                errors.append(f"Campo {i} debe ser un objeto")
                continue

            if "name" not in field:
                errors.append(f"Campo {i} requiere 'name'")
            if "type" not in field:
                errors.append(f"Campo {i} requiere 'type'")

        # Validar operaciones
        operations = data.get("operations", [])
        valid_operations = {"create", "read", "update", "delete", "list"}
        for op in operations:
            if op not in valid_operations:
                errors.append(
                    f"Operación '{op}' no válida. Válidas: {valid_operations}"
                )

        return {"is_valid": len(errors) == 0, "errors": errors}

    def _generate_pydantic_models(
        self, entity_name: str, fields: List[Dict]
    ) -> Dict[str, Any]:
        """Genera modelos Pydantic para la entidad"""

        # Procesar campos
        processed_fields = []
        for field in fields:
            processed_field = {
                "name": field["name"],
                "type": self._map_type_to_python(field["type"]),
                "description": field.get("description", ""),
                "example": self._generate_example_value(field["type"]),
                "auto_generated": field.get("auto_generated", False),
            }
            processed_fields.append(processed_field)

        # Renderizar template
        template = self.code_templates["pydantic_model"]
        code = template.render(
            model_name=entity_name,
            model_description=f"Modelo de datos para {entity_name}",
            fields=processed_fields,
        )

        return {
            "code": code,
            "schemas_code": code,  # Para compatibilidad
            "field_count": len(processed_fields),
        }

    def _generate_crud_endpoints(
        self,
        entity_name: str,
        fields: List[Dict],
        operations: List[str],
        include_auth: bool,
        include_pagination: bool,
    ) -> Dict[str, Any]:
        """Genera endpoints CRUD para FastAPI"""

        template = self.code_templates["fastapi_endpoints"]
        code = template.render(
            model_name=entity_name,
            operations=operations,
            include_auth=include_auth,
            include_pagination=include_pagination,
        )

        return {"code": code, "operations_count": len(operations)}

    def _generate_sqlalchemy_model(
        self, entity_name: str, fields: List[Dict]
    ) -> Dict[str, Any]:
        """Genera modelo SQLAlchemy para la entidad"""

        # Procesar campos para SQLAlchemy
        processed_fields = []
        for field in fields:
            processed_field = {
                "name": field["name"],
                "sql_type": self._map_type_to_sqlalchemy(field["type"]),
                "primary_key": field.get("primary_key", False),
                "index": field.get("index", False),
                "unique": field.get("unique", False),
                "nullable": field.get("nullable", True),
                "default": field.get("default"),
            }
            processed_fields.append(processed_field)

        # Agregar ID si no existe
        if not any(f["primary_key"] for f in processed_fields):
            id_field = {
                "name": "id",
                "sql_type": "Integer",
                "primary_key": True,
                "index": True,
                "nullable": False,
            }
            processed_fields.insert(0, id_field)

        template = self.code_templates["sqlalchemy_model"]
        code = template.render(
            model_name=entity_name,
            table_name=entity_name.lower() + "s",
            fields=processed_fields,
        )

        return {"code": code, "table_name": entity_name.lower() + "s"}

    def _combine_crud_code(
        self,
        models_code: str,
        endpoints_code: str,
        sqlalchemy_code: str,
        entity_name: str,
    ) -> str:
        """Combina todo el código CRUD en un archivo completo"""

        complete_code = f"""# ============================================
# Módulo CRUD completo para {entity_name}
# Generado automáticamente por IOPeer CRUD Agent
# ============================================

# Imports
from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

from app.core.database import Base, get_db

{sqlalchemy_code}

{models_code}

{endpoints_code}

# Configuración del router
router = APIRouter(
    prefix="/{entity_name.lower()}",
    tags=["{entity_name}"],
    responses={{404: {{"description": "No encontrado"}}}}
)
"""

        return complete_code

    def _map_type_to_python(self, field_type: str) -> str:
        """Mapea tipos de campo a tipos Python/Pydantic"""

        type_mapping = {
            "string": "str",
            "text": "str",
            "integer": "int",
            "float": "float",
            "boolean": "bool",
            "datetime": "datetime",
            "date": "date",
            "email": "str",  # EmailStr requiere email-validator
            "url": "str",
            "json": "dict",
        }

        return type_mapping.get(field_type.lower(), "str")

    def _map_type_to_sqlalchemy(self, field_type: str) -> str:
        """Mapea tipos de campo a tipos SQLAlchemy"""

        type_mapping = {
            "string": "String(255)",
            "text": "Text",
            "integer": "Integer",
            "float": "Float",
            "boolean": "Boolean",
            "datetime": "DateTime",
            "date": "Date",
            "email": "String(255)",
            "url": "String(255)",
            "json": "JSON",
        }

        return type_mapping.get(field_type.lower(), "String(255)")

    def _generate_example_value(self, field_type: str) -> str:
        """Genera valores de ejemplo para documentación"""

        examples = {
            "string": '"Ejemplo"',
            "text": '"Texto largo de ejemplo"',
            "integer": "123",
            "float": "123.45",
            "boolean": "true",
            "datetime": '"2024-01-01T00:00:00Z"',
            "date": '"2024-01-01"',
            "email": '"usuario@ejemplo.com"',
            "url": '"https://ejemplo.com"',
        }

        return examples.get(field_type.lower(), '"ejemplo"')

    def get_capabilities(self) -> Dict[str, Any]:
        """Retorna las capacidades del agente CRUD"""

        return {
            "actions": [
                "generate_crud",
                "generate_api",
                "generate_models",
                "generate_repository",
                "generate_service",
                "generate_tests",
                "analyze_entity",
                "validate_schema",
                "generate_complete_module",
            ],
            "description": "Agente CRUD automatizado basado en Framework Dynamus",
            "supported_frameworks": self.supported_frameworks,
            "supported_databases": self.supported_databases,
            "features": [
                "Generación de código FastAPI + Pydantic + SQLAlchemy",
                "Arquitectura en capas (Repository, Service, API)",
                "Validaciones automáticas y documentación",
                "Tests unitarios automáticos",
                "Migraciones de base de datos",
                "Autenticación y autorización",
                "Paginación automática",
                "Swagger/OpenAPI documentation",
                "Código listo para producción",
            ],
            "input_schema": {
                "entity_name": "string (required)",
                "fields": "array of field objects (required)",
                "operations": "array of CRUD operations",
                "framework": "target framework (fastapi, django, flask)",
                "include_auth": "boolean",
                "include_pagination": "boolean",
                "architecture": "simple, layered, clean",
            },
            "output_formats": [
                "Complete module files",
                "Separate component files",
                "Combined single file",
                "Migration scripts",
                "Test files",
                "Documentation",
            ],
            "examples": [
                {
                    "name": "Simple Product CRUD",
                    "input": {
                        "entity_name": "Product",
                        "fields": [
                            {
                                "name": "name",
                                "type": "string",
                                "description": "Nombre del producto",
                            },
                            {
                                "name": "price",
                                "type": "float",
                                "description": "Precio del producto",
                            },
                            {
                                "name": "stock",
                                "type": "integer",
                                "description": "Stock disponible",
                            },
                        ],
                        "operations": ["create", "read", "update", "delete"],
                    },
                    "description": "Genera CRUD completo para entidad Product",
                },
                {
                    "name": "User Management with Auth",
                    "input": {
                        "entity_name": "User",
                        "fields": [
                            {"name": "email", "type": "email", "unique": True},
                            {"name": "username", "type": "string", "unique": True},
                            {"name": "is_active", "type": "boolean", "default": True},
                        ],
                        "include_auth": True,
                        "architecture": "layered",
                    },
                    "description": "Sistema de usuarios con autenticación y arquitectura en capas",
                },
            ],
        }


# ============================================
# Extensiones del CRUD Agent
# ============================================


class AdvancedCRUDFeatures:
    """Características avanzadas del CRUD Agent"""

    @staticmethod
    def generate_repository_layer(entity_name: str, fields: List[Dict]) -> str:
        """Genera capa de repositorio (patrón Repository)"""

        return f"""
from typing import List, Optional, Type, TypeVar, Generic
from sqlalchemy.orm import Session
from app.models.{entity_name.lower()} import {entity_name}
from app.schemas.{entity_name.lower()} import {entity_name}Create, {entity_name}Update

class {entity_name}Repository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, obj_in: {entity_name}Create) -> {entity_name}:
        db_obj = {entity_name}(**obj_in.dict())
        self.db.add(db_obj)
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj

    def get(self, id: int) -> Optional[{entity_name}]:
        return self.db.query({entity_name}).filter({entity_name}.id == id).first()

    def get_multi(self, skip: int = 0, limit: int = 100) -> List[{entity_name}]:
        return self.db.query({entity_name}).offset(skip).limit(limit).all()

    def update(self, db_obj: {entity_name}, obj_in: {entity_name}Update) -> {entity_name}:
        update_data = obj_in.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj

    def delete(self, id: int) -> bool:
        obj = self.db.query({entity_name}).filter({entity_name}.id == id).first()
        if obj:
            self.db.delete(obj)
            self.db.commit()
            return True
        return False
"""

    @staticmethod
    def generate_advanced_service_layer(entity_name: str, fields: List[Dict]) -> str:
        """Genera capa de servicio avanzada con lógica de negocio"""

        return f"""
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from app.repositories.{entity_name.lower()}_repository import {entity_name}Repository
from app.schemas.{entity_name.lower()} import {entity_name}Create, {entity_name}Update, {entity_name}
from app.core.exceptions import ValidationError, NotFoundError

class {entity_name}Service:
    def __init__(self, db: Session):
        self.repository = {entity_name}Repository(db)
        self.db = db

    def create(self, obj_in: {entity_name}Create) -> {entity_name}:
        # Validaciones de negocio antes de crear
        self._validate_create(obj_in)

        try:
            result = self.repository.create(obj_in)
            # Logs, eventos, etc.
            self._log_creation(result)
            return result
        except Exception as e:
            self.db.rollback()
            raise ValidationError(f"Error creando {entity_name}: {{str(e)}}")

    def get_by_id(self, id: int) -> {entity_name}:
        obj = self.repository.get(id)
        if not obj:
            raise NotFoundError(f"{entity_name} con ID {{id}} no encontrado")
        return obj

    def get_multi_filtered(self,
                          filters: Dict[str, Any] = None,
                          skip: int = 0,
                          limit: int = 100) -> List[{entity_name}]:
        # Implementar filtros avanzados
        return self.repository.get_multi(skip=skip, limit=limit)

    def update(self, id: int, obj_in: {entity_name}Update) -> {entity_name}:
        db_obj = self.get_by_id(id)  # Lanza excepción si no existe

        # Validaciones de negocio para actualización
        self._validate_update(db_obj, obj_in)

        try:
            result = self.repository.update(db_obj, obj_in)
            self._log_update(result)
            return result
        except Exception as e:
            self.db.rollback()
            raise ValidationError(f"Error actualizando {entity_name}: {{str(e)}}")

    def delete(self, id: int) -> bool:
        # Verificar que existe
        obj = self.get_by_id(id)

        # Validaciones de negocio para eliminación
        self._validate_delete(obj)

        try:
            success = self.repository.delete(id)
            if success:
                self._log_deletion(obj)
            return success
        except Exception as e:
            self.db.rollback()
            raise ValidationError(f"Error eliminando {entity_name}: {{str(e)}}")

    # Métodos de validación de negocio
    def _validate_create(self, obj_in: {entity_name}Create):
        # Implementar validaciones específicas
        pass

    def _validate_update(self, db_obj: {entity_name}, obj_in: {entity_name}Update):
        # Implementar validaciones específicas
        pass

    def _validate_delete(self, obj: {entity_name}):
        # Implementar validaciones específicas
        pass

    # Métodos de logging/auditoría
    def _log_creation(self, obj: {entity_name}):
        pass

    def _log_update(self, obj: {entity_name}):
        pass

    def _log_deletion(self, obj: {entity_name}):
        pass
"""

    # ============================================
    # Extensiones adicionales del CRUD Agent
    # ============================================

    def _generate_comprehensive_tests(
        self, entity_name: str, fields: List[Dict], architecture: str
    ) -> str:
        """Genera tests comprehensivos para el módulo CRUD"""

        return f"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.main import app
from app.core.database import get_db
from app.models.{entity_name.lower()} import {entity_name}
from app.schemas.{entity_name.lower()} import {entity_name}Create, {entity_name}Update

client = TestClient(app)

class Test{entity_name}CRUD:

    def test_create_{entity_name.lower()}(self, db: Session):
        \"\"\"Test crear {entity_name}\"\"\"
        {entity_name.lower()}_data = {{
            {', '.join([f'"{field["name"]}": {self._generate_test_value(field["type"])}' for field in fields if not field.get("auto_generated")])}
        }}

        response = client.post("/{entity_name.lower()}/", json={entity_name.lower()}_data)
        assert response.status_code == 200

        created = response.json()
        assert created["id"] is not None
        {chr(10).join([f'        assert created["{field["name"]}"] == {entity_name.lower()}_data["{field["name"]}"]' for field in fields if not field.get("auto_generated")])}

    def test_get_{entity_name.lower()}_by_id(self, db: Session):
        \"\"\"Test obtener {entity_name} por ID\"\"\"
        # Crear {entity_name} de prueba
        {entity_name.lower()}_data = {{
            {', '.join([f'"{field["name"]}": {self._generate_test_value(field["type"])}' for field in fields if not field.get("auto_generated")])}
        }}

        create_response = client.post("/{entity_name.lower()}/", json={entity_name.lower()}_data)
        created_id = create_response.json()["id"]

        # Obtener por ID
        response = client.get(f"/{entity_name.lower()}/{{created_id}}")
        assert response.status_code == 200

        retrieved = response.json()
        assert retrieved["id"] == created_id

    def test_get_nonexistent_{entity_name.lower()}(self):
        \"\"\"Test obtener {entity_name} que no existe\"\"\"
        response = client.get("/{entity_name.lower()}/99999")
        assert response.status_code == 404

    def test_update_{entity_name.lower()}(self, db: Session):
        \"\"\"Test actualizar {entity_name}\"\"\"
        # Crear {entity_name} de prueba
        {entity_name.lower()}_data = {{
            {', '.join([f'"{field["name"]}": {self._generate_test_value(field["type"])}' for field in fields if not field.get("auto_generated")])}
        }}

        create_response = client.post("/{entity_name.lower()}/", json={entity_name.lower()}_data)
        created_id = create_response.json()["id"]

        # Datos para actualizar
        update_data = {{
            {', '.join([f'"{field["name"]}": {self._generate_test_value(field["type"], variant=True)}' for field in fields[:2] if not field.get("auto_generated")])}
        }}

        # Actualizar
        response = client.put(f"/{entity_name.lower()}/{{created_id}}", json=update_data)
        assert response.status_code == 200

        updated = response.json()
        for key, value in update_data.items():
            assert updated[key] == value

    def test_delete_{entity_name.lower()}(self, db: Session):
        \"\"\"Test eliminar {entity_name}\"\"\"
        # Crear {entity_name} de prueba
        {entity_name.lower()}_data = {{
            {', '.join([f'"{field["name"]}": {self._generate_test_value(field["type"])}' for field in fields if not field.get("auto_generated")])}
        }}

        create_response = client.post("/{entity_name.lower()}/", json={entity_name.lower()}_data)
        created_id = create_response.json()["id"]

        # Eliminar
        response = client.delete(f"/{entity_name.lower()}/{{created_id}}")
        assert response.status_code == 200

        # Verificar que ya no existe
        get_response = client.get(f"/{entity_name.lower()}/{{created_id}}")
        assert get_response.status_code == 404

    def test_list_{entity_name.lower()}s(self, db: Session):
        \"\"\"Test listar {entity_name}s con paginación\"\"\"
        # Crear varios {entity_name}s de prueba
        for i in range(5):
            {entity_name.lower()}_data = {{
                {', '.join([f'"{field["name"]}": {self._generate_test_value(field["type"], index="i")}' for field in fields if not field.get("auto_generated")])}
            }}
            client.post("/{entity_name.lower()}/", json={entity_name.lower()}_data)

        # Listar con paginación
        response = client.get("/{entity_name.lower()}/?skip=0&limit=3")
        assert response.status_code == 200

        items = response.json()
        assert len(items) <= 3

@pytest.fixture
def db():
    # Configurar base de datos de prueba
    from app.core.database import SessionLocal
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
"""

    def _generate_test_value(
        self, field_type: str, variant: bool = False, index: str = ""
    ) -> str:
        """Genera valores de prueba para tests"""

        if variant:
            values = {
                "string": '"Texto Actualizado"',
                "text": '"Descripción actualizada"',
                "integer": "456",
                "float": "678.90",
                "boolean": "false",
                "email": '"nuevo@ejemplo.com"',
            }
        elif index:
            values = {
                "string": f'"Texto {{{{ {index} }}}}"',
                "text": f'"Descripción {{{{ {index} }}}}"',
                "integer": f"100 + {index}",
                "float": f"100.0 + {index}",
                "boolean": "True",
                "email": f'"test{{{{ {index} }}}}@ejemplo.com"',
            }
        else:
            values = {
                "string": '"Texto de Prueba"',
                "text": '"Descripción de prueba"',
                "integer": "123",
                "float": "123.45",
                "boolean": "True",
                "email": '"test@ejemplo.com"',
            }

        return values.get(field_type.lower(), '"test"')

    def _generate_migration(self, entity_name: str, fields: List[Dict]) -> str:
        """Genera migración Alembic para la entidad"""

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

        return f"""\"\"\"create {entity_name.lower()} table

Revision ID: {timestamp}
Revises:
Create Date: {datetime.now().isoformat()}

\"\"\"
from alembic import op
import sqlalchemy as sa

# revision identifiers
revision = '{timestamp}'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.create_table('{entity_name.lower()}s',
        sa.Column('id', sa.Integer(), nullable=False),
        {chr(10).join([f"        sa.Column('{field['name']}', {self._map_type_to_sqlalchemy(field['type'])}, nullable={field.get('nullable', True)})," for field in fields])}
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_{entity_name.lower()}s_id'), '{entity_name.lower()}s', ['id'], unique=False)

def downgrade():
    op.drop_index(op.f('ix_{entity_name.lower()}s_id'), table_name='{entity_name.lower()}s')
    op.drop_table('{entity_name.lower()}s')
"""

    def _generate_documentation(self, entity_name: str, fields: List[Dict]) -> str:
        """Genera documentación automática para la entidad"""

        return f"""# {entity_name} Module Documentation

## Descripción
Módulo CRUD completo para la entidad {entity_name}, generado automáticamente por IOPeer CRUD Agent.

## Estructura de la Entidad

### Campos

| Campo | Tipo | Descripción | Requerido |
|-------|------|-------------|-----------|
{chr(10).join([f"| {field['name']} | {field['type']} | {field.get('description', 'Sin descripción')} | {'Sí' if not field.get('nullable', True) else 'No'} |" for field in fields])}

## API Endpoints

### Crear {entity_name}
- **POST** `/{entity_name.lower()}/`
- **Body**: JSON con los campos de {entity_name}
- **Response**: {entity_name} creado con ID asignado

```json
{{
  {', '.join([f'"{field["name"]}": {self._generate_example_value(field["type"])}' for field in fields if not field.get("auto_generated")])}
}}
```

### Obtener {entity_name} por ID
- **GET** `/{entity_name.lower()}/{{id}}`
- **Response**: {entity_name} encontrado o 404

### Listar {entity_name}s
- **GET** `/{entity_name.lower()}/`
- **Query Params**:
  - `skip`: Elementos a omitir (default: 0)
  - `limit`: Máximo elementos (default: 100)
- **Response**: Array de {entity_name}s

### Actualizar {entity_name}
- **PUT** `/{entity_name.lower()}/{{id}}`
- **Body**: JSON con campos a actualizar (todos opcionales)
- **Response**: {entity_name} actualizado

### Eliminar {entity_name}
- **DELETE** `/{entity_name.lower()}/{{id}}`
- **Response**: Mensaje de confirmación

## Arquitectura

```
app/
├── models/{entity_name.lower()}.py          # Modelo SQLAlchemy
├── schemas/{entity_name.lower()}.py         # Esquemas Pydantic
├── api/{entity_name.lower()}.py             # Endpoints FastAPI
├── repositories/{entity_name.lower()}_repository.py  # Capa de datos
├── services/{entity_name.lower()}_service.py         # Lógica de negocio
└── tests/test_{entity_name.lower()}.py      # Tests unitarios
```

## Uso

### Registrar rutas en main.py
```python
from app.api.{entity_name.lower()} import router as {entity_name.lower()}_router

app.include_router({entity_name.lower()}_router, prefix="/api/v1")
```

### Crear migración
```bash
alembic revision --autogenerate -m "create {entity_name.lower()} table"
alembic upgrade head
```

### Ejecutar tests
```bash
pytest tests/test_{entity_name.lower()}.py -v
```

## Validaciones de Negocio

Las validaciones de negocio específicas pueden agregarse en:
- `{entity_name}Service._validate_create()`
- `{entity_name}Service._validate_update()`
- `{entity_name}Service._validate_delete()`

## Personalización

Este código fue generado automáticamente y puede modificarse según necesidades específicas:

1. **Agregar campos**: Modificar modelo y esquemas
2. **Validaciones custom**: Implementar en service layer
3. **Endpoints adicionales**: Agregar en router
4. **Relaciones**: Configurar en modelo SQLAlchemy

---
*Generado por IOPeer CRUD Agent el {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}*
"""

    def _generate_installation_guide(self, entity_name: str) -> str:
        """Genera guía de instalación para el módulo"""

        return f"""
# Guía de Instalación - Módulo {entity_name}

## 1. Instalación de Dependencias
```bash
pip install fastapi uvicorn sqlalchemy alembic pydantic pytest
```

## 2. Configuración de Base de Datos
```python
# app/core/database.py
DATABASE_URL = "postgresql://user:password@localhost/dbname"
```

## 3. Ejecutar Migraciones
```bash
alembic upgrade head
```

## 4. Registrar Rutas
```python
# app/main.py
from app.api.{entity_name.lower()} import router
app.include_router(router, prefix="/api/v1")
```

## 5. Iniciar Servidor
```bash
uvicorn app.main:app --reload
```

## 6. Verificar Instalación
Visitar: http://localhost:8000/docs
"""

    def _generate_usage_examples(
        self, entity_name: str, fields: List[Dict]
    ) -> List[Dict]:
        """Genera ejemplos de uso del módulo"""

        return [
            {
                "title": f"Crear {entity_name}",
                "method": "POST",
                "url": f"/{entity_name.lower()}/",
                "body": {
                    field["name"]: self._generate_example_value(field["type"]).strip(
                        '"'
                    )
                    for field in fields
                    if not field.get("auto_generated")
                },
                "description": f"Crear un nuevo {entity_name}",
            },
            {
                "title": f"Listar {entity_name}s",
                "method": "GET",
                "url": f"/{entity_name.lower()}/?skip=0&limit=10",
                "description": f"Obtener lista paginada de {entity_name}s",
            },
            {
                "title": f"Actualizar {entity_name}",
                "method": "PUT",
                "url": f"/{entity_name.lower()}/1",
                "body": {fields[0]["name"]: "Valor actualizado"} if fields else {},
                "description": f"Actualizar {entity_name} existente",
            },
        ]

    def _generate_directory_structure(
        self, module_files: Dict[str, str]
    ) -> Dict[str, Any]:
        """Genera estructura de directorios del módulo"""

        structure = {}
        for file_path in module_files.keys():
            parts = file_path.split("/")
            current = structure

            for part in parts[:-1]:
                if part not in current:
                    current[part] = {}
                current = current[part]

            current[parts[-1]] = "file"

        return structure

    def _analyze_entity(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Analiza una entidad y sugiere mejoras"""

        entity_name = data.get("entity_name")
        fields = data.get("fields", [])

        analysis = {
            "entity_name": entity_name,
            "field_count": len(fields),
            "recommendations": [],
            "potential_issues": [],
            "suggested_relationships": [],
            "performance_considerations": [],
        }

        # Análisis de campos
        has_primary_key = any(f.get("primary_key") for f in fields)
        if not has_primary_key:
            analysis["recommendations"].append("Agregar campo ID como clave primaria")

        has_timestamps = any(f["name"] in ["created_at", "updated_at"] for f in fields)
        if not has_timestamps:
            analysis["recommendations"].append(
                "Agregar campos de timestamp (created_at, updated_at)"
            )

        # Detectar posibles relaciones
        for field in fields:
            if field["name"].endswith("_id"):
                related_entity = field["name"][:-3].title()
                analysis["suggested_relationships"].append(
                    {
                        "type": "foreign_key",
                        "field": field["name"],
                        "related_entity": related_entity,
                    }
                )

        # Consideraciones de performance
        string_fields = [f for f in fields if f["type"] == "string"]
        if len(string_fields) > 5:
            analysis["performance_considerations"].append(
                "Considerar índices para campos de búsqueda frecuente"
            )

        return {"status": "success", "data": analysis}

    def _validate_schema(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Valida el esquema de una entidad"""

        fields = data.get("fields", [])
        validation_result = {
            "is_valid": True,
            "errors": [],
            "warnings": [],
            "suggestions": [],
        }

        # Validar nombres de campos
        field_names = [f["name"] for f in fields]
        if len(field_names) != len(set(field_names)):
            validation_result["is_valid"] = False
            validation_result["errors"].append("Nombres de campos duplicados")

        # Validar tipos
        valid_types = {
            "string",
            "text",
            "integer",
            "float",
            "boolean",
            "datetime",
            "date",
            "email",
            "url",
        }
        for field in fields:
            if field.get("type") not in valid_types:
                validation_result["warnings"].append(
                    f"Tipo '{field.get('type')}' no estándar para campo '{field.get('name')}'"
                )

        # Sugerencias
        if not any(f.get("primary_key") for f in fields):
            validation_result["suggestions"].append(
                "Considerar agregar campo ID como clave primaria"
            )

        return {"status": "success", "data": validation_result}
