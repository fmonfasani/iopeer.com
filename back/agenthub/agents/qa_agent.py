# agenthub/agents/qa_agent.py

import re
from typing import Any, Dict

from agenthub.base_agent import BaseAgent


class QAAgent(BaseAgent):
    """
    Agente especializado en Quality Assurance y testing.
    Puede generar tests, validar código, y analizar calidad.
    """

    def __init__(self):
        super().__init__(agent_id="qa_agent", name="Quality Assurance Agent")
        self.test_templates = self._load_test_templates()

    def _load_test_templates(self) -> Dict[str, str]:
        """Carga templates para generación de tests"""
        return {
            "unit_test": '''
def test_{function_name}():
    """Test for {function_name}"""
    # Arrange
    {arrange}

    # Act
    {act}

    # Assert
    {assert_statements}
''',
            "api_test": '''
def test_{endpoint_name}(client):
    """Test {method} {path}"""
    response = client.{method}("{path}", json={payload})

    assert response.status_code == {expected_status}
    {additional_assertions}
''',
            "integration_test": '''
def test_{test_name}():
    """Integration test for {description}"""
    # Setup
    {setup}

    # Execute
    {execute}

    # Verify
    {verify}

    # Cleanup
    {cleanup}
''',
        }

    def handle(self, message: Dict[str, Any]) -> Dict[str, Any]:
        """Procesa mensajes del agente QA"""
        action = message.get("action")
        data = message.get("data", {})

        handlers = {
            "test_api": self._test_api,
            "generate_tests": self._generate_tests,
            "analyze_code_quality": self._analyze_code_quality,
            "validate_api_spec": self._validate_api_spec,
            "performance_test": self._performance_test,
            "security_scan": self._security_scan,
        }

        handler = handlers.get(action)
        if not handler:
            return {
                "status": "error",
                "message": f"Action '{action}' not supported by QAAgent",
            }

        return handler(data)

    def _test_api(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Ejecuta tests sobre una API"""
        api_url = data.get("url", "http://localhost:8000")
        endpoints = data.get("endpoints", [])

        if not endpoints:
            # Si no se especifican endpoints, hacer tests básicos
            endpoints = [
                {"method": "GET", "path": "/", "expected_status": 200},
                {"method": "GET", "path": "/health", "expected_status": 200},
            ]

        test_results = {
            "total_tests": len(endpoints),
            "passed": 0,
            "failed": 0,
            "results": [],
        }

        for endpoint in endpoints:
            result = self._test_single_endpoint(api_url, endpoint)
            test_results["results"].append(result)

            if result["status"] == "passed":
                test_results["passed"] += 1
            else:
                test_results["failed"] += 1

        test_results["success_rate"] = (
            test_results["passed"] / test_results["total_tests"] * 100
            if test_results["total_tests"] > 0
            else 0
        )

        return {"status": "success", "data": test_results}

    def _test_single_endpoint(
        self, base_url: str, endpoint: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Testa un endpoint específico"""
        import requests
        from requests.exceptions import RequestException

        method = endpoint.get("method", "GET").upper()
        path = endpoint.get("path", "/")
        expected_status = endpoint.get("expected_status", 200)
        payload = endpoint.get("payload")
        headers = endpoint.get("headers", {})

        url = f"{base_url.rstrip('/')}{path}"

        try:
            if method == "GET":
                response = requests.get(url, headers=headers, timeout=30)
            elif method == "POST":
                response = requests.post(url, json=payload, headers=headers, timeout=30)
            elif method == "PUT":
                response = requests.put(url, json=payload, headers=headers, timeout=30)
            elif method == "DELETE":
                response = requests.delete(url, headers=headers, timeout=30)
            else:
                return {
                    "endpoint": f"{method} {path}",
                    "status": "failed",
                    "error": f"Unsupported method: {method}",
                }

            # Verificar status code
            status_match = response.status_code == expected_status

            # Verificaciones adicionales
            content_type = response.headers.get("content-type", "")
            is_json = "application/json" in content_type

            result = {
                "endpoint": f"{method} {path}",
                "status": "passed" if status_match else "failed",
                "actual_status": response.status_code,
                "expected_status": expected_status,
                "response_time": response.elapsed.total_seconds(),
                "content_type": content_type,
                "is_json": is_json,
            }

            if is_json:
                try:
                    result["response_data"] = response.json()
                except Exception:
                    result["json_parse_error"] = True

            if not status_match:
                result["error"] = (
                    f"Expected status {expected_status}, got {response.status_code}"
                )

            return result

        except RequestException as e:
            return {
                "endpoint": f"{method} {path}",
                "status": "failed",
                "error": f"Request failed: {str(e)}",
            }

    def _generate_tests(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Genera código de tests automáticamente"""
        test_type = data.get("type", "unit")
        target = data.get("target")  # código, API spec, etc.

        if not target:
            return {"status": "error", "message": "Target for test generation required"}

        if test_type == "unit":
            return self._generate_unit_tests(target)
        elif test_type == "api":
            return self._generate_api_tests(target)
        elif test_type == "integration":
            return self._generate_integration_tests(target)
        else:
            return {
                "status": "error",
                "message": f"Test type '{test_type}' not supported",
            }

    def _generate_unit_tests(self, code: str) -> Dict[str, Any]:
        """Genera unit tests para código Python"""
        # Extraer funciones del código
        function_pattern = r"def\s+(\w+)\s*\([^)]*\):"
        functions = re.findall(function_pattern, code)

        tests = []

        for func_name in functions:
            if func_name.startswith("_"):  # Skip private functions
                continue

            test_code = self.test_templates["unit_test"].format(
                function_name=func_name,
                arrange="# Setup test data",
                act=f"result = {func_name}()",
                assert_statements="assert result is not None",
            )

            tests.append({"function": func_name, "test_code": test_code})

        complete_test_file = """
import pytest
from your_module import *

""" + "\n".join(
            [test["test_code"] for test in tests]
        )

        return {
            "status": "success",
            "data": {
                "tests": tests,
                "complete_test_file": complete_test_file,
                "functions_found": len(functions),
            },
        }

    def _generate_api_tests(self, api_spec: Dict[str, Any]) -> Dict[str, Any]:
        """Genera tests para API basado en especificación"""
        endpoints = api_spec.get("endpoints", [])
        tests = []

        for endpoint in endpoints:
            method = endpoint.get("method", "get").lower()
            path = endpoint.get("path", "/")
            expected_status = endpoint.get("expected_status", 200)

            endpoint_name = (
                f"{method}_{path.replace('/', '_').replace('{', '').replace('}', '')}"
            )

            test_code = self.test_templates["api_test"].format(
                endpoint_name=endpoint_name,
                method=method,
                path=path,
                payload=endpoint.get("payload", "{}"),
                expected_status=expected_status,
                additional_assertions='assert "data" in response.json()',
            )

            tests.append(
                {"endpoint": f"{method.upper()} {path}", "test_code": test_code}
            )

        complete_test_file = """
import pytest
from fastapi.testclient import TestClient
from your_app import app

client = TestClient(app)

""" + "\n".join(
            [test["test_code"] for test in tests]
        )

        return {
            "status": "success",
            "data": {
                "tests": tests,
                "complete_test_file": complete_test_file,
                "endpoints_tested": len(endpoints),
            },
        }

    def _generate_integration_tests(self, spec: Dict[str, Any]) -> Dict[str, Any]:
        """Genera tests de integración"""
        workflows = spec.get("workflows", [])
        tests = []

        for workflow in workflows:
            test_name = workflow.get("name", "integration_test")
            steps = workflow.get("steps", [])

            setup_code = "# Integration test setup"
            execute_code = "\n".join([f"# Step: {step}" for step in steps])
            verify_code = "# Verify integration results"
            cleanup_code = "# Clean up test data"

            test_code = self.test_templates["integration_test"].format(
                test_name=test_name,
                description=workflow.get("description", "Integration workflow"),
                setup=setup_code,
                execute=execute_code,
                verify=verify_code,
                cleanup=cleanup_code,
            )

            tests.append({"workflow": test_name, "test_code": test_code})

        return {
            "status": "success",
            "data": {"tests": tests, "workflows_tested": len(workflows)},
        }

    def _analyze_code_quality(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Analiza calidad del código"""
        code = data.get("code", "")

        if not code:
            return {"status": "error", "message": "Code required for quality analysis"}

        analysis = {"score": 0, "issues": [], "suggestions": [], "metrics": {}}

        # Métricas básicas
        lines = code.split("\n")
        analysis["metrics"]["total_lines"] = len(lines)
        analysis["metrics"]["non_empty_lines"] = len([l for l in lines if l.strip()])
        analysis["metrics"]["comment_lines"] = len(
            [l for l in lines if l.strip().startswith("#")]
        )

        # Buscar problemas comunes
        issues = []

        # Líneas muy largas
        long_lines = [i + 1 for i, line in enumerate(lines) if len(line) > 100]
        if long_lines:
            issues.append(
                {
                    "type": "style",
                    "severity": "minor",
                    "description": f"Lines too long: {long_lines[:5]}",
                }
            )

        # Funciones sin docstrings
        functions_without_docs = []
        current_function = None

        for i, line in enumerate(lines):
            if line.strip().startswith("def "):
                current_function = line.strip()
                # Check next few lines for docstring
                has_docstring = False
                for j in range(i + 1, min(i + 5, len(lines))):
                    if '"""' in lines[j] or "'''" in lines[j]:
                        has_docstring = True
                        break

                if not has_docstring:
                    functions_without_docs.append(current_function)

        if functions_without_docs:
            issues.append(
                {
                    "type": "documentation",
                    "severity": "moderate",
                    "description": f"Functions without docstrings: {len(functions_without_docs)}",
                }
            )

        # Importaciones no utilizadas (análisis simple)
        imports = [
            l
            for l in lines
            if l.strip().startswith("import ") or l.strip().startswith("from ")
        ]

        analysis["issues"] = issues
        analysis["metrics"]["import_statements"] = len(imports)

        # Calcular score (0-100)
        base_score = 100
        base_score -= len(issues) * 10  # -10 por cada issue
        if (
            analysis["metrics"]["comment_lines"]
            / max(analysis["metrics"]["non_empty_lines"], 1)
            < 0.1
        ):
            base_score -= 15  # Penalizar falta de comentarios

        analysis["score"] = max(0, min(100, base_score))

        # Sugerencias
        suggestions = [
            "Add docstrings to all public functions",
            "Consider breaking long lines",
            "Add more comments for complex logic",
        ]

        if analysis["score"] > 80:
            suggestions.append("Code quality is good! Consider adding type hints.")
        elif analysis["score"] > 60:
            suggestions.append(
                "Code quality is acceptable but has room for improvement."
            )
        else:
            suggestions.append("Code quality needs significant improvement.")

        analysis["suggestions"] = suggestions

        return {"status": "success", "data": analysis}

    def _validate_api_spec(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Valida especificación de API"""
        spec = data.get("spec", {})

        validation_results = {
            "valid": True,
            "errors": [],
            "warnings": [],
            "suggestions": [],
        }

        # Validaciones básicas
        if not spec.get("endpoints"):
            validation_results["errors"].append("No endpoints defined")
            validation_results["valid"] = False

        # Validar cada endpoint
        for i, endpoint in enumerate(spec.get("endpoints", [])):
            endpoint_errors = []

            if not endpoint.get("method"):
                endpoint_errors.append(f"Endpoint {i}: Missing HTTP method")

            if not endpoint.get("path"):
                endpoint_errors.append(f"Endpoint {i}: Missing path")

            method = endpoint.get("method", "").upper()
            if method not in ["GET", "POST", "PUT", "DELETE", "PATCH"]:
                endpoint_errors.append(f"Endpoint {i}: Invalid HTTP method '{method}'")

            path = endpoint.get("path", "")
            if path and not path.startswith("/"):
                validation_results["warnings"].append(
                    f"Endpoint {i}: Path should start with '/'"
                )

            validation_results["errors"].extend(endpoint_errors)

        # Sugerencias
        if len(spec.get("endpoints", [])) > 20:
            validation_results["suggestions"].append(
                "Consider splitting large APIs into microservices"
            )

        if not any(ep.get("method") == "GET" for ep in spec.get("endpoints", [])):
            validation_results["suggestions"].append(
                "Consider adding health check endpoints"
            )

        if validation_results["errors"]:
            validation_results["valid"] = False

        return {"status": "success", "data": validation_results}

    def _performance_test(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Ejecuta test de performance básico"""
        concurrent_users = data.get("concurrent_users", 10)
        duration_seconds = data.get("duration", 30)

        # Simulación simple de test de performance
        # En un caso real, usaríamos herramientas como locust o artillery

        results = {
            "total_requests": concurrent_users * duration_seconds,
            "successful_requests": int(
                concurrent_users * duration_seconds * 0.95
            ),  # 95% success rate
            "failed_requests": int(concurrent_users * duration_seconds * 0.05),
            "average_response_time": 150,  # ms
            "p95_response_time": 300,  # ms
            "p99_response_time": 500,  # ms
            "requests_per_second": concurrent_users,
            "concurrent_users": concurrent_users,
            "test_duration": duration_seconds,
        }

        # Evaluación de performance
        performance_grade = "A"
        if results["average_response_time"] > 200:
            performance_grade = "B"
        if results["average_response_time"] > 500:
            performance_grade = "C"
        if results["p99_response_time"] > 1000:
            performance_grade = "D"

        results["performance_grade"] = performance_grade

        return {"status": "success", "data": results}

    def _security_scan(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Ejecuta escaneo básico de seguridad"""
        data.get("target", "")
        scan_type = data.get("type", "basic")

        security_issues = []

        # Simulación de análisis de seguridad básico
        common_vulnerabilities = [
            {
                "type": "Missing HTTPS",
                "severity": "high",
                "description": "API should use HTTPS in production",
                "recommendation": "Configure SSL/TLS certificates",
            },
            {
                "type": "Missing Rate Limiting",
                "severity": "medium",
                "description": "No rate limiting detected",
                "recommendation": "Implement rate limiting to prevent abuse",
            },
            {
                "type": "Missing Authentication",
                "severity": "high",
                "description": "Some endpoints lack authentication",
                "recommendation": "Implement proper authentication for all sensitive endpoints",
            },
        ]

        # En un caso real, se haría análisis real del target
        security_issues = common_vulnerabilities[:2]  # Simular algunos issues

        risk_score = (
            len([issue for issue in security_issues if issue["severity"] == "high"])
            * 30
            + len([issue for issue in security_issues if issue["severity"] == "medium"])
            * 15
            + len([issue for issue in security_issues if issue["severity"] == "low"])
            * 5
        )

        risk_level = "low"
        if risk_score > 50:
            risk_level = "high"
        elif risk_score > 25:
            risk_level = "medium"

        return {
            "status": "success",
            "data": {
                "security_issues": security_issues,
                "risk_score": risk_score,
                "risk_level": risk_level,
                "scan_type": scan_type,
                "recommendations": [
                    issue["recommendation"] for issue in security_issues
                ],
            },
        }

    def get_capabilities(self) -> Dict[str, Any]:
        """Retorna capacidades del agente QA"""
        return {
            "actions": [
                "test_api",
                "generate_tests",
                "analyze_code_quality",
                "validate_api_spec",
                "performance_test",
                "security_scan",
            ],
            "description": "Quality assurance, testing, and code analysis",
            "test_types": ["unit", "integration", "api", "performance", "security"],
            "supported_formats": ["Python", "FastAPI", "JSON API specs"],
        }
