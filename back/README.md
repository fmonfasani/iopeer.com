# AgentHub

AgentHub is a lightweight framework for coordinating AI agents. It exposes a REST API powered by FastAPI, a CLI for common operations and an orchestrator that runs configurable workflows.

## Setup

1. Clone the repository and enter the project directory
   ```bash
   git clone <repo-url>
   cd agenthub
   ```
2. Create a Python 3.11 virtual environment and install the dependencies
   ```bash
   python3.11 -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements-dev.txt
   ```
   You can also run `make install` if you have `make` available.

3. Initialize the database tables
   ```bash
   python -m agenthub.database.create_tables
   ```

4. Configure the authentication secret key
   ```bash
   export AGENTHUB_SECRET_KEY="replace-me"
   ```
   Alternatively add `secret_key` to `config.yaml`. A development default is used if omitted.


## Running the server

Consulta la [doctrina del proyecto](docs/DOCTRINE.md) para conocer los principios fundamentales.
## 🌟 Características

- **🏗️ Arquitectura Modular**: Agentes independientes con responsabilidades específicas
- **⚡ Orquestación Inteligente**: Workflows configurables y deterministas
- **🔌 Estándares Abiertos**: Compatible con protocolos A2A, MCP y ACP
- **📊 Observabilidad**: Métricas, logging y trazabilidad completa
- **🚀 Fácil Despliegue**: Docker, Kubernetes y cloud-ready
- **🧪 Testing Integrado**: Suite completa de tests automáticos

## 🚀 Inicio Rápido

### Instalación


Start the development server with
```bash
agenthub-server
```
or
```bash
python -m agenthub.main
```
On Windows from the project root:
```cmd
set PYTHONPATH=back && python -m agenthub.main
```
You can also run `make run` from Git Bash.
The interactive API documentation will be available at [http://localhost:8000/docs](http://localhost:8000/docs).

## CLI examples

List registered agents:
```bash
python -m agenthub.main agents
```
Send a message to an agent:
```bash
python -m agenthub.main send backend_agent analyze_requirements --data '{"requirements": "Simple API"}'
```
Run a workflow:
```bash
python -m agenthub.main run api_development --data '{"requirements": "Simple API"}'
```

## API examples

Health check:
```bash
curl http://localhost:8000/health
```
Send a message via HTTP:
```bash
curl -X POST http://localhost:8000/agents/backend_agent/execute \
  -H "Content-Type: application/json" \
  -d '{"agent_id":"backend_agent","action":"analyze_requirements","data":{"requirements":"Simple API"}}'
```

## Agent registry

Agents are loaded from `registry.json` on startup. The file must contain a list
of objects with `id`, `class` and optional `config` fields:

```json
[
  {"id": "backend_agent", "class": "BackendAgent", "config": {}},
  {"id": "qa_agent", "class": "QAAgent", "config": {}}
]
```

## Development commands

Use the supplied `Makefile` for common tasks:
```bash
make test    # run tests
make lint    # run linters
make format  # format code
make run     # start the server
```

## Documentation

- Interactive API documentation: [http://localhost:8000/docs](http://localhost:8000/docs)
- Explore the `agents/` and `workflows/` directories for implementation details.
# 📚 API Documentation - Iopeer Backend

## 🚀 Base URL
```
http://localhost:8000
```

## 🔐 Autenticación

### POST `/auth/signup`
Registra un nuevo usuario en el sistema.

**Request Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

**Response (201):**
```json
{
  "message": "Usuario creado exitosamente",
  "email": "usuario@ejemplo.com"
}
```

**Response (400):**
```json
{
  "detail": "El correo ya está registrado"
}
```

---

### POST `/auth/signin`
Inicia sesión y obtiene un token de acceso.

**Request Body:**
```json
{
  "email": "usuario@ejemplo.com", 
  "password": "contraseña123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "usuario@ejemplo.com"
  }
}
```

**Response (401):**
```json
{
  "detail": "Credenciales inválidas"
}
```

---

## 🏠 Sistema Principal

### GET `/`
Información básica del sistema.

**Response (200):**
```json
{
  "name": "AgentHub",
  "version": "1.0.0", 
  "status": "running",
  "agents": 2,
  "workflows": 5
}
```

---

### GET `/health`
Health check del sistema y agentes.

**Response (200):**
```json
{
  "status": "ok",
  "database": "healthy",
  "disk_usage": {
    "total": 1000000000,
    "used": 500000000,
    "free": 500000000
  },
  "memory_usage": {
    "total": 8000000000,
    "available": 4000000000,
    "percent": 50.0
  },
  "agents": {
    "backend_agent": {
      "healthy": true,
      "status": "idle",
      "uptime": 3600.5
    },
    "qa_agent": {
      "healthy": true,
      "status": "idle",
      "uptime": 3600.5
    }
  }
}
```

---

## 🤖 Gestión de Agentes

### GET `/agents`
Lista todos los agentes registrados.

**Response (200):**
```json
{
  "agents": [
    {
      "agent_id": "backend_agent",
      "name": "Backend Code Generator",
      "type": "BackendAgent",
      "status": "idle",
      "created_at": "2025-01-24T10:00:00",
      "stats": {
        "messages_processed": 15,
        "errors": 0,
        "last_activity": "2025-01-24T11:30:00"
      },
      "capabilities": {
        "actions": [
          "generate_api",
          "generate_model", 
          "generate_crud",
          "analyze_requirements",
          "suggest_architecture"
        ],
        "description": "Backend code generation and architecture analysis"
      }
    },
    {
      "agent_id": "qa_agent",
      "name": "Quality Assurance Agent",
      "type": "QAAgent",
      "status": "idle",
      "created_at": "2025-01-24T10:00:00",
      "stats": {
        "messages_processed": 8,
        "errors": 0,
        "last_activity": "2025-01-24T11:15:00"
      },
      "capabilities": {
        "actions": [
          "test_api",
          "generate_tests",
          "analyze_code_quality",
          "validate_api_spec",
          "performance_test",
          "security_scan"
        ],
        "description": "Quality assurance, testing, and code analysis"
      }
    }
  ],
  "total": 2
}
```

---

### POST `/agents/register`
Registra un nuevo agente en el sistema.

**Request Body:**
```json
{
  "agent_id": "custom_agent",
  "agent_type": "BackendAgent",
  "config": {
    "custom_setting": "value"
  }
}
```

**Response (200):**
```json
{
  "status": "registered",
  "agent_id": "custom_agent"
}
```

**Response (409):**
```json
{
  "detail": "Agent already exists"
}
```

---

### POST `/agents/{agent_id}/execute`
Envía un mensaje a un agente específico.

**Request Body:**
```json
{
  "agent_id": "backend_agent",
  "action": "generate_api",
  "data": {
    "specification": {
      "endpoints": [
        {
          "method": "GET",
          "path": "/users",
          "description": "Get all users"
        }
      ],
      "models": [
        {
          "name": "User",
          "fields": [
            {"name": "id", "type": "int"},
            {"name": "email", "type": "str"}
          ]
        }
      ]
    }
  }
}
```

**Response (200):**
```json
{
  "result": {
    "status": "success",
    "agent_id": "backend_agent",
    "trace_id": "abc-123-def",
    "data": {
      "endpoints": ["@app.get('/users')\ndef get_users():..."],
      "models": ["class User(BaseModel):\n    id: int\n    email: str"],
      "complete_code": "from fastapi import FastAPI\n..."
    }
  }
}
```

**Response (404):**
```json
{
  "detail": "Agent backend_agent not found. Available agents: qa_agent"
}
```

**Response (500):**
```json
{
  "detail": "Internal error processing message"
}
```

---

## ⚡ Workflows

### GET `/workflows`
Lista todos los workflows registrados.

**Response (200):**
```json
{
  "workflows": [
    {
      "name": "api_development",
      "tasks": [
        "backend_agent.analyze_requirements",
        "backend_agent.suggest_architecture", 
        "backend_agent.generate_api",
        "qa_agent.validate_api_spec",
        "qa_agent.generate_tests"
      ],
      "parallel": false,
      "timeout": 30,
      "created_at": "2025-01-24T10:00:00",
      "executions": 3
    },
    {
      "name": "parallel_testing",
      "tasks": [
        "qa_agent.test_api",
        "qa_agent.performance_test",
        "qa_agent.security_scan"
      ],
      "parallel": true,
      "timeout": 60,
      "created_at": "2025-01-24T10:00:00", 
      "executions": 1
    }
  ],
  "total": 5
}
```

---

### POST `/workflows/register`
Registra un nuevo workflow.

**Request Body:**
```json
{
  "name": "custom_workflow",
  "tasks": [
    "backend_agent.generate_model",
    "qa_agent.generate_tests"
  ],
  "parallel": false,
  "timeout": 45
}
```

**Response (200):**
```json
{
  "status": "registered",
  "workflow": "custom_workflow"
}
```

---

### POST `/workflow/start`
Ejecuta un workflow.

**Request Body:**
```json
{
  "workflow": "api_development",
  "data": {
    "requirements": "I need a user management API with CRUD operations"
  }
}
```

**Response (200):**
```json
{
  "execution_id": "exec-abc-123",
  "workflow": "api_development", 
  "status": "completed",
  "execution_time": 12.34,
  "result": {
    "steps": {
      "step_1": {
        "task": "backend_agent.analyze_requirements",
        "agent_id": "backend_agent",
        "action": "analyze_requirements",
        "result": {
          "status": "success",
          "data": {
            "analysis": {
              "suggested_frameworks": ["FastAPI", "SQLAlchemy"],
              "complexity_score": "medium",
              "estimated_time": "1-3 weeks"
            }
          }
        }
      }
    },
    "final_context": {
      "analysis": {...},
      "generated_code": "..."
    }
  }
}
```

---

## 🎯 Acciones Específicas de Agentes

### Backend Agent Actions

#### `generate_api`
Genera código de API basado en especificaciones.

**Data:**
```json
{
  "specification": {
    "endpoints": [
      {
        "method": "POST",
        "path": "/users",
        "name": "create_user",
        "description": "Create a new user",
        "parameters": [
          {"name": "user", "type": "User", "required": true}
        ]
      }
    ],
    "models": [
      {
        "name": "User",
        "description": "User model",
        "fields": [
          {"name": "email", "type": "str", "optional": false},
          {"name": "name", "type": "str", "optional": true}
        ]
      }
    ]
  }
}
```

#### `generate_model`
Genera modelos de datos.

**Data:**
```json
{
  "type": "pydantic",
  "name": "Product",
  "description": "Product model for e-commerce",
  "fields": [
    {"name": "title", "type": "str", "optional": false},
    {"name": "price", "type": "float", "optional": false},
    {"name": "description", "type": "str", "optional": true}
  ]
}
```

#### `generate_crud`
Genera operaciones CRUD.

**Data:**
```json
{
  "model_name": "Product",
  "operations": ["create", "read", "update", "delete"]
}
```

#### `analyze_requirements`
Analiza requerimientos de texto.

**Data:**
```json
{
  "requirements": "I need an e-commerce API with product management, user authentication, and order processing"
}
```

#### `suggest_architecture`
Sugiere arquitectura de proyecto.

**Data:**
```json
{
  "type": "api",
  "scale": "medium"
}
```

---

### QA Agent Actions

#### `test_api`
Prueba endpoints de API.

**Data:**
```json
{
  "url": "http://localhost:8000",
  "endpoints": [
    {
      "method": "GET",
      "path": "/health",
      "expected_status": 200
    },
    {
      "method": "POST", 
      "path": "/users",
      "payload": {"email": "test@example.com"},
      "expected_status": 201
    }
  ]
}
```

#### `generate_tests`
Genera código de tests.

**Data:**
```json
{
  "type": "api",
  "target": {
    "endpoints": [
      {
        "method": "GET",
        "path": "/users",
        "expected_status": 200
      }
    ]
  }
}
```

#### `analyze_code_quality`
Analiza calidad del código.

**Data:**
```json
{
  "code": "def example_function():\n    # This is a simple function\n    return 'hello world'"
}
```

#### `validate_api_spec`
Valida especificación de API.

**Data:**
```json
{
  "spec": {
    "endpoints": [
      {
        "method": "GET",
        "path": "/users"
      }
    ]
  }
}
```

#### `performance_test`
Ejecuta test de performance.

**Data:**
```json
{
  "concurrent_users": 10,
  "duration": 30
}
```

#### `security_scan`
Ejecuta escaneo de seguridad.

**Data:**
```json
{
  "target": "http://localhost:8000",
  "type": "basic"
}
```

---

## 📊 Códigos de Estado HTTP

| Código | Descripción |
|--------|-------------|
| 200 | ✅ Éxito |
| 201 | ✅ Creado exitosamente |
| 400 | ❌ Solicitud inválida |
| 401 | ❌ No autorizado |
| 404 | ❌ Recurso no encontrado |
| 409 | ❌ Conflicto (recurso ya existe) |
| 500 | ❌ Error interno del servidor |

---

## 🛠️ Configuración de Desarrollo

### Variables de Entorno

```bash
# Backend
DATABASE_URL=postgresql://user:password@localhost/iopeer_db
AGENTHUB_HOST=0.0.0.0
AGENTHUB_PORT=8000
AGENTHUB_DEBUG=true
LOG_LEVEL=INFO

# Frontend  
REACT_APP_API_URL=http://localhost:8000
REACT_APP_ENV=development
```

### Iniciar Backend
```bash
cd back
python -m agenthub.main
# o
uvicorn agenthub.main:app --reload --host 0.0.0.0 --port 8000
```

### Iniciar Frontend
```bash
cd front
npm start
```

---

## 🧪 Testing de API con curl

### Health Check
```bash
curl http://localhost:8000/health
```

### Listar Agentes
```bash
curl http://localhost:8000/agents
```

### Enviar Mensaje a Agente
```bash
curl -X POST http://localhost:8000/agents/backend_agent/execute \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "backend_agent",
    "action": "analyze_requirements", 
    "data": {
      "requirements": "I need a simple CRUD API for blog posts"
    }
  }'
```

### Ejecutar Workflow
```bash
curl -X POST http://localhost:8000/workflow/start \
  -H "Content-Type: application/json" \
  -d '{
    "workflow": "api_development",
    "data": {
      "requirements": "User management system with authentication"
    }
  }'
```

---

## 🔍 Troubleshooting

### Backend no inicia
1. ✅ Verificar que PostgreSQL esté ejecutándose
2. ✅ Verificar DATABASE_URL en .env
3. ✅ Ejecutar `python agenthub/database/create_tables.py`

### Frontend no conecta
1. ✅ Verificar que backend esté en http://localhost:8000
2. ✅ Verificar REACT_APP_API_URL
3. ✅ Revisar CORS en el backend

### Agentes no responden
1. ✅ Verificar que los agentes estén registrados: `GET /agents`
2. ✅ Verificar logs del backend
3. ✅ Probar con curl directamente

---

## 📝 Notas de Desarrollo

- 🔄 Los agentes se auto-registran al iniciar el servidor
- 📁 Registry de agentes se guarda en `registry.json`
- 🔍 Logs detallados disponibles en modo debug
- ⚡ Hot reload habilitado en desarrollo
- 🧪 Tests automáticos pendientes de implementación

---

*Documentación actualizada: 24 Julio 2025*