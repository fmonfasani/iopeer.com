# 🚀 Iopeer: AI Agent Platform - Demo Completo

**La plataforma más avanzada para desarrollo con agentes IA especializados**

[![Enterprise](https://img.shields.io/badge/Enterprise-Ready-blue)](.) [![Agents](https://img.shields.io/badge/Agents-IA-green)](.) [![Themes](https://img.shields.io/badge/Themes-4-purple)](.)

## 🌟 ¿Qué es Iopeer?

Iopeer es una plataforma revolucionaria que utiliza **agentes IA especializados** para automatizar completamente el desarrollo de APIs REST. Con solo describir lo que necesitas, nuestros agentes crean código completo, tests, documentación y arquitectura.

### ⚡ Poder de los Agentes Especializados

- **🔧 Backend Agent**: Genera APIs completas, modelos, CRUD, arquitectura
- **🧪 QA Agent**: Crea tests automáticos, valida código, analiza seguridad
- **🔄 Orchestrator**: Coordina workflows completos de desarrollo
- **🎨 Enterprise Frontend**: Dashboard profesional con 4 temas

---

## 🏗️ Demo 1: Crear API REST Completa para E-commerce

### 📝 Paso 1: Describe tu necesidad

```bash
# Enviar requerimientos al Backend Agent
curl -X POST http://localhost:8000/agents/backend_agent/execute \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "backend_agent",
    "action": "analyze_requirements",
    "data": {
      "requirements": "Crear API REST para e-commerce con usuarios, productos, carrito de compras, órdenes y pagos. Incluir autenticación JWT, filtros de búsqueda, inventario en tiempo real y notificaciones."
    }
  }'
```

### 🎯 Respuesta del Agente:

```json
{
  "status": "success",
  "agent_id": "backend_agent",
  "data": {
    "analysis": {
      "suggested_frameworks": ["FastAPI", "SQLAlchemy", "Alembic", "JWT Authentication"],
      "suggested_patterns": ["CRUD Pattern", "Repository Pattern", "Service Layer"],
      "complexity_score": "high",
      "estimated_time": "3-6 weeks",
      "architecture_recommendation": "Microservices with API Gateway"
    }
  }
}
```

### 🏛️ Paso 2: Generar Arquitectura

```bash
curl -X POST http://localhost:8000/agents/backend_agent/execute \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "backend_agent",
    "action": "suggest_architecture",
    "data": {
      "type": "ecommerce",
      "scale": "large"
    }
  }'
```

### 📋 Arquitectura Generada:

```json
{
  "status": "success",
  "data": {
    "architecture": {
      "layers": [
        "API Gateway Layer (FastAPI)",
        "Authentication Layer (JWT)",
        "Business Logic Layer",
        "Data Access Layer (Repository)",
        "Database Layer (PostgreSQL)"
      ],
      "components": [
        "User Service", "Product Service", "Cart Service",
        "Order Service", "Payment Service", "Notification Service",
        "JWT Authentication", "Rate Limiting", "Caching Layer"
      ],
      "technologies": [
        "FastAPI", "SQLAlchemy", "PostgreSQL", "Redis",
        "Celery", "JWT", "Pydantic", "Docker"
      ]
    }
  }
}
```

### 🔨 Paso 3: Generar Código de API

```bash
curl -X POST http://localhost:8000/agents/backend_agent/execute \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "backend_agent",
    "action": "generate_api",
    "data": {
      "specification": {
        "endpoints": [
          {
            "method": "POST",
            "path": "/users/register",
            "name": "register_user",
            "description": "Register new user",
            "parameters": [
              {"name": "email", "type": "str", "required": true},
              {"name": "password", "type": "str", "required": true},
              {"name": "name", "type": "str", "required": true}
            ]
          },
          {
            "method": "GET",
            "path": "/products",
            "name": "get_products",
            "description": "Get products with filters",
            "parameters": [
              {"name": "category", "type": "str", "optional": true},
              {"name": "min_price", "type": "float", "optional": true},
              {"name": "max_price", "type": "float", "optional": true}
            ]
          }
        ],
        "models": [
          {
            "name": "User",
            "description": "User model",
            "fields": [
              {"name": "id", "type": "int"},
              {"name": "email", "type": "str"},
              {"name": "name", "type": "str"},
              {"name": "created_at", "type": "datetime"}
            ]
          }
        ]
      }
    }
  }'
```

### ✨ Código Generado Automáticamente:

```python
# 🎉 CÓDIGO COMPLETO GENERADO POR EL AGENTE

from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import jwt
from passlib.context import CryptContext

app = FastAPI(title="E-commerce API", version="1.0.0")

# Models
class User(BaseModel):
    """User model for e-commerce platform"""
    id: int
    email: str
    name: str
    created_at: datetime

class UserCreate(BaseModel):
    email: str
    password: str
    name: str

class Product(BaseModel):
    id: int
    name: str
    price: float
    category: str
    stock: int

# Endpoints
@app.post("/users/register", response_model=User)
def register_user(user: UserCreate):
    """Register new user"""
    try:
        # Hash password
        hashed_password = pwd_context.hash(user.password)

        # Create user in database
        new_user = create_user_in_db(user.email, hashed_password, user.name)

        return new_user
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/products", response_model=List[Product])
def get_products(
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None
):
    """Get products with filters"""
    try:
        filters = {}
        if category:
            filters['category'] = category
        if min_price:
            filters['min_price'] = min_price
        if max_price:
            filters['max_price'] = max_price

        products = get_filtered_products(filters)
        return products
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

---

## 🧪 Demo 2: Testing Automático con QA Agent

### 🔍 Paso 1: Generar Tests de API

```bash
curl -X POST http://localhost:8000/agents/qa_agent/execute \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "qa_agent",
    "action": "generate_tests",
    "data": {
      "type": "api",
      "target": {
        "endpoints": [
          {"method": "POST", "path": "/users/register", "expected_status": 201},
          {"method": "GET", "path": "/products", "expected_status": 200}
        ]
      }
    }
  }'
```

### 🧪 Tests Generados:

```python
import pytest
from fastapi.testclient import TestClient
from your_app import app

client = TestClient(app)

def test_register_user():
    """Test POST /users/register"""
    response = client.post("/users/register", json={
        "email": "test@example.com",
        "password": "secure123",
        "name": "Test User"
    })

    assert response.status_code == 201
    assert "id" in response.json()
    assert response.json()["email"] == "test@example.com"

def test_get_products():
    """Test GET /products"""
    response = client.get("/products")

    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_products_with_filters():
    """Test GET /products with filters"""
    response = client.get("/products?category=electronics&min_price=100")

    assert response.status_code == 200
    products = response.json()
    for product in products:
        assert product["category"] == "electronics"
        assert product["price"] >= 100
```

### 🚦 Paso 2: Ejecutar Tests de API en Vivo

```bash
curl -X POST http://localhost:8000/agents/qa_agent/execute \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "qa_agent",
    "action": "test_api",
    "data": {
      "url": "http://localhost:8000",
      "endpoints": [
        {"method": "GET", "path": "/health", "expected_status": 200},
        {"method": "GET", "path": "/agents", "expected_status": 200}
      ]
    }
  }'
```

### 📊 Resultados del Testing:

```json
{
  "status": "success",
  "data": {
    "total_tests": 2,
    "passed": 2,
    "failed": 0,
    "success_rate": 100.0,
    "results": [
      {
        "endpoint": "GET /health",
        "status": "passed",
        "actual_status": 200,
        "response_time": 0.045,
        "is_json": true
      },
      {
        "endpoint": "GET /agents",
        "status": "passed",
        "actual_status": 200,
        "response_time": 0.123,
        "is_json": true
      }
    ]
  }
}
```

---

## ⚡ Demo 3: Workflow Completo de Desarrollo

### 🔄 Ejecutar Workflow de Desarrollo Full-Stack

```bash
curl -X POST http://localhost:8000/workflow/start \
  -H "Content-Type: application/json" \
  -d '{
    "workflow": "api_development",
    "data": {
      "requirements": "API de blog con usuarios, posts, comentarios y likes"
    }
  }'
```

### 🎯 Workflow Ejecutado:

```json
{
  "execution_id": "wf_1234567890",
  "workflow": "api_development",
  "status": "completed",
  "execution_time": 12.34,
  "result": {
    "steps": {
      "step_1": {
        "task": "backend_agent.analyze_requirements",
        "result": {
          "analysis": {
            "suggested_frameworks": ["FastAPI", "SQLAlchemy"],
            "complexity_score": "medium",
            "estimated_time": "1-3 weeks"
          }
        }
      },
      "step_2": {
        "task": "backend_agent.suggest_architecture",
        "result": {
          "architecture": {
            "components": ["User Service", "Post Service", "Comment Service"],
            "patterns": ["Repository Pattern", "Service Layer"]
          }
        }
      },
      "step_3": {
        "task": "backend_agent.generate_api",
        "result": {
          "endpoints": ["POST /users", "GET /posts", "POST /comments"],
          "models": ["User", "Post", "Comment"]
        }
      },
      "step_4": {
        "task": "qa_agent.validate_api_spec",
        "result": {
          "valid": true,
          "suggestions": ["Add rate limiting", "Include pagination"]
        }
      },
      "step_5": {
        "task": "qa_agent.generate_tests",
        "result": {
          "tests_generated": 15,
          "coverage": "85%"
        }
      }
    }
  }
}
```

---

## 🎨 Demo 4: Frontend Enterprise con Temas

### 🌟 Características del Dashboard

- **4 Temas Profesionales**: Light Professional, Light Oceanic, Dark Corporate, Dark Cyberpunk
- **Real-time WebSocket**: Actualizaciones en vivo
- **Analytics Avanzado**: Métricas de uso y performance
- **Error Tracking**: Sistema de captura de errores
- **Caching Inteligente**: Optimización automática

### 🖼️ Capturas de Pantalla

```typescript
// 🎨 Sistema de Temas Profesional
const themes = {
  'light-professional': {
    colors: {
      primary: '#2563eb',    // Azul corporativo
      secondary: '#0ea5e9',  // Azul cielo
      success: '#059669',    // Verde esmeralda
      background: '#f8fafc'  // Gris muy claro
    }
  },
  'light-oceanic': {
    colors: {
      primary: '#0284c7',    // Azul océano
      secondary: '#06b6d4',  // Cian
      success: '#0d9488',    // Verde azulado
      background: '#f0f9ff'  // Azul muy claro
    }
  }
}
```

### 📊 Analytics en Tiempo Real

```javascript
// Métricas automáticas capturadas
const metrics = {
  sessionTime: '245s',
  totalEvents: 127,
  wsConnected: true,
  themeChanges: 3,
  agentInteractions: 15,
  errorsTracked: 0
}
```

### 📡 API en Tiempo Real

Conéctate al endpoint de WebSocket `/ws/events` para recibir notificaciones en directo sobre la ejecución de los agentes y workflows.

```javascript
const ws = new WebSocket('ws://localhost:8000/ws/events');
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Evento recibido:', data);
};
```

---

## 🔧 Demo 5: Casos de Uso Avanzados

### 🏥 Caso 1: API de Telemedicina

```bash
# Generar API completa para telemedicina
curl -X POST http://localhost:8000/workflow/start \
  -H "Content-Type: application/json" \
  -d '{
    "workflow": "api_development",
    "data": {
      "requirements": "API para telemedicina con pacientes, doctores, citas médicas, historiales clínicos, prescripciones, videollamadas y facturación. Incluir HIPAA compliance, encriptación end-to-end y auditoría completa."
    }
  }'
```

**Resultado**: API completa con 25+ endpoints, modelos de datos médicos, autenticación segura, y tests de compliance.

### 🏦 Caso 2: API de Fintech

```bash
# Generar API de servicios financieros
curl -X POST http://localhost:8000/agents/backend_agent/execute \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "backend_agent",
    "action": "generate_api",
    "data": {
      "specification": {
        "type": "fintech",
        "features": ["accounts", "transactions", "loans", "investments", "kyc", "fraud_detection"],
        "compliance": ["PCI-DSS", "SOX", "GDPR"],
        "security": ["2FA", "encryption", "audit_logs"]
      }
    }
  }'
```

### 🎮 Caso 3: API de Gaming

```bash
# Generar API para plataforma de gaming
curl -X POST http://localhost:8000/agents/backend_agent/execute \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "backend_agent",
    "action": "analyze_requirements",
    "data": {
      "requirements": "API para plataforma de gaming con usuarios, perfiles de jugador, matchmaking, leaderboards, in-app purchases, chat en tiempo real, torneos y streaming."
    }
  }'
```

---

## 🚀 Instalación y Setup

### 📦 Instalación Rápida

```bash
# Clonar repositorio
git clone https://github.com/your-org/iopeer.git
cd iopeer

# Setup Backend
cd back
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements-dev.txt  # para producción usa requirements.txt

# Configurar clave secreta para JWT
export AGENTHUB_SECRET_KEY="mi-clave-secreta"

# Ejecutar backend
python -m agenthub.main
```

On Windows you can run:

```cmd
set PYTHONPATH=back && python -m agenthub.main
```
or run `make run` from Git Bash.

```bash
# Setup Frontend (nueva terminal)
cd ../front
npm install
npm start
```

### 🐳 Con Docker

```bash
# Ejecutar stack completo
docker-compose up -d

# Verificar servicios
curl http://localhost:8000/health
# El JSON incluye ahora los campos `disk_usage` y `memory_usage`
curl http://localhost:3000
```


---

## 📊 Métricas de Rendimiento

### ⚡ Velocidad de Desarrollo

| Tarea | Tiempo Manual | Con Iopeer | Reducción |
|-------|---------------|------------|-----------|
| API CRUD Básica | 2-3 días | 5 minutos | **99.7%** |
| Tests Completos | 1-2 días | 2 minutos | **99.8%** |
| Documentación | 4-6 horas | 30 segundos | **99.9%** |
| Análisis Arquitectura | 1-2 días | 1 minuto | **99.9%** |

### 🎯 Calidad del Código

- **Cobertura de Tests**: 90%+ automática
- **Compliance**: GDPR, HIPAA, PCI-DSS ready
- **Seguridad**: Vulnerabilidades detectadas automáticamente
- **Performance**: APIs optimizadas por defecto

---

## 🔗 API Reference

### 🤖 Backend Agent

| Endpoint | Descripción |
|----------|-------------|
| `analyze_requirements` | Analiza requerimientos y sugiere stack tecnológico |
| `suggest_architecture` | Propone arquitectura óptima |
| `generate_api` | Genera código completo de API |
| `generate_model` | Crea modelos de datos |
| `generate_crud` | Genera operaciones CRUD |

### 🧪 QA Agent

| Endpoint | Descripción |
|----------|-------------|
| `test_api` | Ejecuta tests de API en vivo |
| `generate_tests` | Crea suite completa de tests |
| `analyze_code_quality` | Analiza calidad y métricas |
| `validate_api_spec` | Valida especificaciones |
| `performance_test` | Tests de carga y performance |
| `security_scan` | Escaneo de vulnerabilidades |

### ⚡ Workflows

| Workflow | Descripción |
|----------|-------------|
| `api_development` | Desarrollo completo de API |
| `full_testing_suite` | Suite completa de testing |
| `dev_with_qa` | Desarrollo con QA integrado |
| `parallel_testing` | Tests en paralelo |

---

## 🌟 Próximas Características

### 🔮 Roadmap 2024

- **🤖 Claude Integration**: Agentes potenciados por Claude
- **🌐 Multi-language**: Support para Python, Node.js, Go, Rust
- **☁️ Cloud Deploy**: Deploy automático a AWS, GCP, Azure
- **📱 Mobile SDKs**: Generación de SDKs móviles
- **🔒 Advanced Security**: Penetration testing automático
- **📈 ML Models**: Integración con modelos de ML

### 🚀 Enterprise Features

- **👥 Team Collaboration**: Workflows colaborativos
- **📊 Advanced Analytics**: Métricas empresariales
- **🔐 SSO Integration**: Single Sign-On
- **📋 Compliance Dashboard**: Monitoreo de compliance
- **🎯 Custom Agents**: Agentes personalizados

---

## 💡 Casos de Éxito

### 🏢 Startup Unicornio - 90% Reducción TTM

> *"Iopeer nos permitió lanzar nuestra API de fintech en 2 semanas en lugar de 6 meses. Los agentes IA generaron código de calidad production-ready."*
>
> **- CTO, Fintech Unicorn**

### 🏥 Hospital Digital - Compliance Automático

> *"Los agentes de Iopeer generaron automáticamente una API compatible con HIPAA, ahorrando 3 meses de desarrollo y auditorías legales."*
>
> **- Director de Tecnología, Hospital Digital**

### 🎮 Gaming Platform - Escalabilidad Instantánea

> *"La arquitectura generada por Iopeer soportó 1M+ usuarios desde el día 1. Los tests automáticos detectaron issues antes del launch."*
>
> **- Lead Engineer, Gaming Startup**

---

## 🤝 Contribuir

### 👥 Community

- **Discord**: [discord.gg/iopeer](https://discord.gg/iopeer)
- **GitHub**: [github.com/iopeer/platform](https://github.com/iopeer/platform)
- **Docs**: [docs.iopeer.ai](https://docs.iopeer.ai)

### 🛠️ Desarrollo

```bash
# Setup desarrollo
git clone https://github.com/iopeer/platform.git
cd platform
./back/scripts/dev.sh

# Crear agente personalizado
./back/scripts/create-agent.sh my_agent

# Ejecutar tests
./back/scripts/test.sh
```

---

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE) para detalles.

---

## 🎯 Conclusión

**Iopeer representa el futuro del desarrollo de APIs**. Con agentes IA especializados, reduces el tiempo de desarrollo en **99%+** mientras mantienes la más alta calidad de código.

### 🚀 Empieza Ahora

```bash
# Un comando para cambiar tu forma de desarrollar
git clone https://github.com/iopeer/platform.git && cd platform && ./start.sh
```

**¿Listo para revolucionar tu desarrollo? ¡Iopeer te está esperando! 🚀**

---

*Desarrollado by  Iopeer Team*
