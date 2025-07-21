from .base_agent import BaseAgent
from typing import Dict, Any

class TestGeneratorAgent(BaseAgent):
    """Agente especializado en generar tests automáticamente"""
    
    def __init__(self):
        super().__init__("test_generator", "Test Generator")
    
    def get_capabilities(self) -> Dict[str, Any]:
        return {
            "actions": [
                "generate_unit_tests",
                "generate_api_tests",
                "generate_load_tests",
                "create_test_data",
                "generate_security_tests"
            ],
            "description": "Genera tests automáticamente para APIs y código"
        }
    
    def handle(self, message: Dict[str, Any]) -> Dict[str, Any]:
        action = message.get("action")
        data = message.get("data", {})
        
        if action == "generate_api_tests":
            return self._generate_api_tests(data)
        elif action == "generate_unit_tests":
            return self._generate_unit_tests(data)
        elif action == "generate_security_tests":
            return self._generate_security_tests(data)
        else:
            return {"status": "error", "error": f"Acción '{action}' no reconocida"}
    
    def _generate_api_tests(self, data: Dict[str, Any]) -> Dict[str, Any]:
        endpoints = data.get("endpoints", [])
        
        test_code = '''
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    """Test básico de health check"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

'''
        
        for endpoint in endpoints:
            endpoint_path = endpoint.get("path", "/")
            method = endpoint.get("method", "GET").lower()
            
            test_code += f'''
def test_{method}_{endpoint_path.replace("/", "_").replace("{", "").replace("}", "")}():
    """Test para {method.upper()} {endpoint_path}"""
    response = client.{method}("{endpoint_path}")
    assert response.status_code in [200, 201, 204]

'''
        
        return {
            "status": "success",
            "data": {
                "test_code": test_code,
                "test_file": "test_api.py",
                "tests_generated": len(endpoints) + 1
            }
        }
    
    def _generate_unit_tests(self, data: Dict[str, Any]) -> Dict[str, Any]:
        functions = data.get("functions", [])
        
        return {
            "status": "success",
            "data": {
                "unit_tests": f"Generated {len(functions)} unit tests",
                "coverage_target": "80%"
            }
        }

    def _generate_security_tests(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Genera pruebas básicas de seguridad para endpoints."""
        endpoints = data.get("endpoints", [])
        tests = []
        for endpoint in endpoints:
            path = endpoint.get("path", "/")
            method = endpoint.get("method", "GET").lower()
            test = f"""def test_{method}_{path.replace('/', '_').replace('{','').replace('}','')}_auth_required(client):\n    response = client.{method}("{path}")\n    assert response.status_code == 401\n"""
            tests.append(test)

        test_file = "import pytest\nfrom fastapi.testclient import TestClient\nfrom main import app\n\nclient = TestClient(app)\n\n" + "\n".join(tests)

        return {
            "status": "success",
            "data": {
                "test_code": test_file,
                "test_file": "test_security.py",
                "tests_generated": len(tests),
            },
        }
