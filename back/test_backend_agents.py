#!/usr/bin/env python3
"""
Script de testing para agentes de backend
"""

import sys
import json
from agenthub.orchestrator import AgentRegistry, Orchestrator

def test_backend_agents():
    """Prueba todos los agentes de backend"""
    
    print("🧪 Testing Backend Agents...")
    print("=" * 40)
    
    # Inicializar orquestador
    orchestrator = Orchestrator()
    
    # Test Database Architect
    print("🏗️ Testing Database Architect...")
    result = orchestrator.send_message("database_architect", {
        "action": "design_schema",
        "data": {
            "entities": [
                {
                    "name": "User",
                    "fields": [
                        {"name": "email", "type": "VARCHAR(255)"},
                        {"name": "password_hash", "type": "VARCHAR(255)"},
                        {"name": "is_active", "type": "BOOLEAN", "optional": False}
                    ]
                }
            ]
        }
    })
    
    if result["status"] == "success":
        print("✅ Database Architect: OK")
        print(f"   📊 Tablas creadas: {result['data']['tables_created']}")
    else:
        print(f"❌ Database Architect: {result.get('error')}")
    
    # Test FastAPI Generator
    print("\n🚀 Testing FastAPI Generator...")
    result = orchestrator.send_message("fastapi_generator", {
        "action": "generate_crud_endpoint", 
        "data": {
            "model_name": "Product",
            "fields": [
                {"name": "title", "type": "str"},
                {"name": "price", "type": "float"},
                {"name": "description", "type": "str", "optional": True}
            ],
            "include_auth": True
        }
    })
    
    if result["status"] == "success":
        print("✅ FastAPI Generator: OK")
        print(f"   📁 Archivos: {len(result['data']['files_created'])}")
    else:
        print(f"❌ FastAPI Generator: {result.get('error')}")
    
    # Test Security Auditor
    print("\n🔒 Testing Security Auditor...")
    result = orchestrator.send_message("security_auditor", {
        "action": "scan_vulnerabilities",
        "data": {
            "code_files": ["main.py", "auth.py"]
        }
    })
    
    if result["status"] == "success":
        print("✅ Security Auditor: OK")
        print(f"   🔍 Vulnerabilidades: {result['data']['vulnerabilities_found']}")
        print(f"   📊 Score: {result['data']['security_score']}")
    else:
        print(f"❌ Security Auditor: {result.get('error')}")
    
    # Test Test Generator
    print("\n🧪 Testing Test Generator...")
    result = orchestrator.send_message("test_generator", {
        "action": "generate_api_tests",
        "data": {
            "endpoints": [
                {"path": "/users", "method": "GET"},
                {"path": "/users", "method": "POST"},
                {"path": "/users/{user_id}", "method": "GET"}
            ]
        }
    })
    
    if result["status"] == "success":
        print("✅ Test Generator: OK")
        print(f"   🧪 Tests generados: {result['data']['tests_generated']}")
    else:
        print(f"❌ Test Generator: {result.get('error')}")
    
    # Test API Documentator
    print("\n📚 Testing API Documentator...")
    result = orchestrator.send_message("api_documentator", {
        "action": "generate_openapi_spec",
        "data": {
            "api_info": {
                "title": "Test API",
                "version": "1.0.0"
            },
            "endpoints": [
                {"path": "/users", "method": "GET"},
                {"path": "/products", "method": "POST"}
            ]
        }
    })
    
    if result["status"] == "success":
        print("✅ API Documentator: OK")
        print(f"   📄 Endpoints documentados: {result['data']['endpoints_documented']}")
    else:
        print(f"❌ API Documentator: {result.get('error')}")
    
    print("\n🎉 Testing completado!")

if __name__ == "__main__":
    test_backend_agents()
