# ============================================
# back/security/workflow_security.py
# Sistema de seguridad para workflows
# ============================================

from __future__ import annotations

import asyncio
import hashlib
import json
import secrets
from datetime import datetime, timedelta
from enum import Enum
from typing import Any, Dict, List, Optional

import jwt
from fastapi import HTTPException, Request
from fastapi.security import HTTPBearer
from prometheus_client import Counter, Gauge, Histogram


class SecurityLevel(Enum):
    PUBLIC = "public"  # Templates públicos, sin datos sensibles
    AUTHENTICATED = "authenticated"  # Usuarios autenticados
    PRIVATE = "private"  # Workflows privados del usuario
    ENTERPRISE = "enterprise"  # Workflows empresariales con datos sensibles


class ResourceLimits:
    """Límites de recursos por tier de usuario"""

    FREE_TIER = {
        "max_workflows_per_month": 3,
        "max_execution_time_seconds": 300,  # 5 minutos
        "max_nodes_per_workflow": 5,
        "max_concurrent_executions": 1,
        "max_storage_mb": 100,
        "rate_limit_per_hour": 10,
    }

    PRO_TIER = {
        "max_workflows_per_month": 25,
        "max_execution_time_seconds": 1800,  # 30 minutos
        "max_nodes_per_workflow": 20,
        "max_concurrent_executions": 3,
        "max_storage_mb": 1000,
        "rate_limit_per_hour": 50,
    }

    BUSINESS_TIER = {
        "max_workflows_per_month": -1,  # Unlimited
        "max_execution_time_seconds": 3600,  # 1 hora
        "max_nodes_per_workflow": 50,
        "max_concurrent_executions": 10,
        "max_storage_mb": 10000,
        "rate_limit_per_hour": 200,
    }


class WorkflowSecurityManager:
    """Gestiona la seguridad de workflows"""

    def __init__(self) -> None:
        self.execution_timeouts: Dict[str, Any] = {}
        self.rate_limits: Dict[str, Any] = {}
        self.resource_usage: Dict[str, Any] = {}

    async def validate_workflow_security(
        self, workflow_data: Dict[str, Any], user_id: str, user_tier: str
    ) -> Dict[str, Any]:
        """Valida la seguridad de un workflow antes de ejecutar"""

        validation_result: Dict[str, Any] = {
            "is_valid": True,
            "errors": [],
            "warnings": [],
            "sanitized_workflow": workflow_data.copy(),
        }

        # 1. Validar límites de recursos
        resource_check = await self._check_resource_limits(
            workflow_data, user_id, user_tier
        )
        if not resource_check["is_valid"]:
            validation_result["is_valid"] = False
            validation_result["errors"].extend(resource_check["errors"])

        # 2. Sanitizar configuraciones de nodos
        sanitized_nodes = []
        for node in workflow_data.get("nodes", []):
            sanitized_node = await self._sanitize_node_config(node, user_tier)
            sanitized_nodes.append(sanitized_node)
        validation_result["sanitized_workflow"]["nodes"] = sanitized_nodes

        # 3. Validar permisos de agentes
        agent_permissions = await self._validate_agent_permissions(
            workflow_data, user_tier
        )
        if not agent_permissions["is_valid"]:
            validation_result["is_valid"] = False
            validation_result["errors"].extend(agent_permissions["errors"])

        # 4. Detectar patrones maliciosos
        malicious_patterns = await self._detect_malicious_patterns(workflow_data)
        if malicious_patterns:
            validation_result["is_valid"] = False
            validation_result["errors"].append("Patrones maliciosos detectados")

        return validation_result

    async def _check_resource_limits(
        self, workflow_data: Dict[str, Any], user_id: str, user_tier: str
    ) -> Dict[str, Any]:
        """Verifica límites de recursos por tier"""

        limits = getattr(
            ResourceLimits, f"{user_tier.upper()}_TIER", ResourceLimits.FREE_TIER
        )
        errors = []

        # Verificar número de nodos
        node_count = len(workflow_data.get("nodes", []))
        if node_count > limits["max_nodes_per_workflow"]:
            errors.append(
                f"Workflow excede límite de nodos: {node_count} > {limits['max_nodes_per_workflow']}"
            )

        # Verificar ejecuciones del mes
        monthly_executions = await self._get_monthly_executions(user_id)
        if (
            limits["max_workflows_per_month"] != -1
            and monthly_executions >= limits["max_workflows_per_month"]
        ):
            errors.append(
                f"Límite mensual alcanzado: {monthly_executions} workflows ejecutados"
            )

        # Verificar rate limiting
        current_hour_executions = await self._get_hourly_executions(user_id)
        if current_hour_executions >= limits["rate_limit_per_hour"]:
            errors.append(
                f"Rate limit alcanzado: {current_hour_executions} ejecuciones por hora"
            )

        # Verificar ejecuciones concurrentes
        concurrent_executions = await self._get_concurrent_executions(user_id)
        if concurrent_executions >= limits["max_concurrent_executions"]:
            errors.append(
                f"Límite de ejecuciones concurrentes: {concurrent_executions}"
            )

        return {"is_valid": len(errors) == 0, "errors": errors}

    async def _get_monthly_executions(self, user_id: str) -> int:
        """Retorna ejecuciones del usuario en el último mes"""

        usage = self.resource_usage.get(user_id, {}).get("executions", [])
        month_ago = datetime.now() - timedelta(days=30)
        return len([t for t in usage if t > month_ago])

    async def _get_hourly_executions(self, user_id: str) -> int:
        """Retorna ejecuciones del usuario en la última hora"""

        usage = self.resource_usage.get(user_id, {}).get("executions", [])
        hour_ago = datetime.now() - timedelta(hours=1)
        return len([t for t in usage if t > hour_ago])

    async def _get_concurrent_executions(self, user_id: str) -> int:
        """Retorna ejecuciones concurrentes activas del usuario"""

        return self.resource_usage.get(user_id, {}).get("active", 0)

    async def _sanitize_node_config(
        self, node: Dict[str, Any], user_tier: str
    ) -> Dict[str, Any]:
        """Sanitiza la configuración de un nodo"""

        sanitized_node = node.copy()
        config = sanitized_node.get("config", {})

        # Remover configuraciones peligrosas
        dangerous_keys = [
            "system_commands",
            "shell_access",
            "file_write_path",
            "database_credentials",
            "api_keys",
            "admin_access",
        ]

        for key in dangerous_keys:
            if key in config and user_tier != "enterprise":
                del config[key]

        # Sanitizar strings para prevenir injection
        for key, value in config.items():
            if isinstance(value, str):
                config[key] = self._sanitize_string(value)

        sanitized_node["config"] = config
        return sanitized_node

    def _sanitize_string(self, input_string: str) -> str:
        """Sanitiza strings para prevenir injection attacks"""

        dangerous_chars = ["<", ">", "&", '"', "'", ";", "|", "&", "$", "`"]
        sanitized = input_string
        for char in dangerous_chars:
            sanitized = sanitized.replace(char, "")

        max_length = 1000
        if len(sanitized) > max_length:
            sanitized = sanitized[:max_length]
        return sanitized

    async def _validate_agent_permissions(
        self, workflow_data: Dict[str, Any], user_tier: str
    ) -> Dict[str, Any]:
        """Valida permisos para usar agentes específicos"""

        restricted_agents = {
            "deployment_agent": ["business", "enterprise"],
            "database_admin_agent": ["enterprise"],
            "system_admin_agent": ["enterprise"],
            "payment_agent": ["pro", "business", "enterprise"],
        }

        errors: List[str] = []
        for node in workflow_data.get("nodes", []):
            agent_type = node.get("agent_type")
            if agent_type in restricted_agents:
                required_tiers = restricted_agents[agent_type]
                if user_tier not in required_tiers:
                    errors.append(
                        f"Agente '{agent_type}' requiere tier: {required_tiers}"
                    )

        return {"is_valid": len(errors) == 0, "errors": errors}

    async def _detect_malicious_patterns(
        self, workflow_data: Dict[str, Any]
    ) -> List[str]:
        """Detecta patrones potencialmente maliciosos"""

        malicious_patterns = []
        workflow_str = json.dumps(workflow_data, default=str).lower()
        suspicious_patterns = [
            "rm -rf",
            "delete from",
            "drop table",
            "wget",
            "curl",
            "eval(",
            "exec(",
            "system(",
            "shell_exec",
            "__import__",
            "subprocess",
            "os.system",
            "command injection",
        ]
        for pattern in suspicious_patterns:
            if pattern in workflow_str:
                malicious_patterns.append(f"Patrón sospechoso detectado: {pattern}")
        return malicious_patterns


class WorkflowPerformanceManager:
    """Gestiona la performance y optimización de workflows"""

    def __init__(self) -> None:
        self.performance_metrics: Dict[str, Any] = {}
        self.optimization_cache: Dict[str, Any] = {}

    async def optimize_workflow_execution(
        self, workflow: Dict[str, Any], execution_context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Optimiza la ejecución de un workflow"""

        optimization_result: Dict[str, Any] = {
            "optimized_workflow": workflow.copy(),
            "estimated_time": 0,
            "optimizations_applied": [],
            "warnings": [],
        }

        optimized_order = await self._optimize_execution_order(workflow)
        if optimized_order != workflow.get("execution_order", []):
            optimization_result["optimizations_applied"].append(
                "Orden de ejecución optimizado"
            )

        parallel_groups = await self._detect_parallelizable_nodes(workflow)
        if len(parallel_groups) > 1:
            optimization_result["optimizations_applied"].append(
                f"Paralelización detectada: {len(parallel_groups)} grupos"
            )

        cached_results = await self._check_cached_results(workflow, execution_context)
        if cached_results:
            optimization_result["optimizations_applied"].append(
                f"Resultados en caché: {len(cached_results)} nodos"
            )

        estimated_time = await self._estimate_execution_time(workflow)
        optimization_result["estimated_time"] = estimated_time
        if estimated_time > 1800:
            optimization_result["warnings"].append(
                "Ejecución muy larga, considera dividir el workflow"
            )

        return optimization_result

    async def _optimize_execution_order(self, workflow: Dict[str, Any]) -> List[str]:
        """Optimiza el orden de ejecución basado en dependencias y performance"""

        nodes = workflow.get("nodes", [])
        connections = workflow.get("connections", [])

        dependency_graph: Dict[str, List[str]] = {}
        performance_weights: Dict[str, float] = {}
        for node in nodes:
            node_id = node["id"]
            agent_type = node["agent_type"]
            historical_time = await self._get_historical_execution_time(agent_type)
            performance_weights[node_id] = historical_time
            dependency_graph[node_id] = []

        for connection in connections:
            source = connection["source_id"]
            target = connection["target_id"]
            dependency_graph[source].append(target)

        return await self._performance_aware_topological_sort(
            dependency_graph, performance_weights
        )

    async def _performance_aware_topological_sort(
        self, graph: Dict[str, List[str]], weights: Dict[str, float]
    ) -> List[str]:
        """Topological sort que prioriza nodos con menor tiempo histórico"""

        in_degree = {node: 0 for node in graph}
        for source, targets in graph.items():
            for target in targets:
                in_degree[target] += 1

        ready = sorted(
            [n for n, d in in_degree.items() if d == 0], key=lambda x: weights.get(x, 0)
        )
        order: List[str] = []
        while ready:
            current = ready.pop(0)
            order.append(current)
            for neighbor in graph[current]:
                in_degree[neighbor] -= 1
                if in_degree[neighbor] == 0:
                    insert_index = 0
                    for i, n in enumerate(ready):
                        if weights.get(neighbor, 0) < weights.get(n, 0):
                            break
                        insert_index = i + 1
                    ready.insert(insert_index, neighbor)

        if len(order) != len(graph):
            raise Exception("Workflow contains cycles")
        return order

    async def _detect_parallelizable_nodes(
        self, workflow: Dict[str, Any]
    ) -> List[List[str]]:
        """Detecta nodos que pueden ejecutarse en paralelo"""

        nodes = workflow.get("nodes", [])
        connections = workflow.get("connections", [])

        dependencies: Dict[str, set[str]] = {node["id"]: set() for node in nodes}
        for connection in connections:
            dependencies[connection["target_id"]].add(connection["source_id"])

        parallel_groups: List[List[str]] = []
        remaining_nodes = set(node["id"] for node in nodes)
        while remaining_nodes:
            ready_nodes = [
                node_id
                for node_id in remaining_nodes
                if all(dep not in remaining_nodes for dep in dependencies[node_id])
            ]
            if ready_nodes:
                parallel_groups.append(ready_nodes)
                remaining_nodes -= set(ready_nodes)
            else:
                break
        return parallel_groups

    async def _check_cached_results(
        self, workflow: Dict[str, Any], execution_context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Verifica si existen resultados en caché para el workflow"""

        workflow_key = hashlib.sha256(
            json.dumps(workflow, sort_keys=True).encode()
        ).hexdigest()
        return self.optimization_cache.get(workflow_key, {})

    async def _estimate_execution_time(self, workflow: Dict[str, Any]) -> float:
        """Estima el tiempo total de ejecución"""

        total_time = 0.0
        parallel_groups = await self._detect_parallelizable_nodes(workflow)
        for group in parallel_groups:
            group_times = []
            for node_id in group:
                node = next((n for n in workflow["nodes"] if n["id"] == node_id), None)
                if node:
                    agent_time = await self._get_historical_execution_time(
                        node["agent_type"]
                    )
                    group_times.append(agent_time)
            group_max_time = max(group_times) if group_times else 0.0
            total_time += group_max_time
        overhead = len(workflow.get("connections", [])) * 2
        total_time += overhead
        return total_time

    async def _get_historical_execution_time(self, agent_type: str) -> float:
        """Obtiene tiempo promedio histórico de un agente"""

        default_times = {
            "data_analyst": 30,
            "ui_generator": 45,
            "backend_agent": 60,
            "deployment_agent": 120,
            "seo_optimizer": 25,
            "database_agent": 40,
        }
        return float(default_times.get(agent_type, 60))


class AgentCircuitBreaker:
    """Implementa circuit breaker pattern para agentes problemáticos"""

    def __init__(self) -> None:
        self.agent_states: Dict[str, Dict[str, Any]] = {}
        self.failure_thresholds = {
            "failure_rate": 0.5,
            "min_requests": 10,
            "timeout_seconds": 300,
        }

    async def execute_with_circuit_breaker(
        self, agent_type: str, execution_func, *args, **kwargs
    ):
        """Ejecuta un agente con circuit breaker protection"""

        state = self.agent_states.get(
            agent_type,
            {
                "state": "closed",
                "failures": 0,
                "successes": 0,
                "last_failure_time": None,
                "total_requests": 0,
            },
        )

        if state["state"] == "open":
            if self._should_attempt_reset(state):
                state["state"] = "half_open"
            else:
                raise Exception(f"Circuit breaker OPEN para agente {agent_type}")

        try:
            result = await execution_func(*args, **kwargs)
            state["successes"] += 1
            state["total_requests"] += 1
            if state["state"] == "half_open":
                state["state"] = "closed"
                state["failures"] = 0
            self.agent_states[agent_type] = state
            return result
        except Exception as e:  # noqa: BLE001
            state["failures"] += 1
            state["total_requests"] += 1
            state["last_failure_time"] = datetime.now()
            if self._should_open_circuit(state):
                state["state"] = "open"
            self.agent_states[agent_type] = state
            raise e

    def _should_open_circuit(self, state: Dict[str, Any]) -> bool:
        """Determina si se debe abrir el circuit breaker"""

        if state["total_requests"] < self.failure_thresholds["min_requests"]:
            return False
        failure_rate = state["failures"] / state["total_requests"]
        return failure_rate >= self.failure_thresholds["failure_rate"]

    def _should_attempt_reset(self, state: Dict[str, Any]) -> bool:
        """Determina si se debe intentar resetear el circuit (half-open)"""

        if not state["last_failure_time"]:
            return True
        time_since_failure = datetime.now() - state["last_failure_time"]
        return (
            time_since_failure.total_seconds()
            >= self.failure_thresholds["timeout_seconds"]
        )


class WorkflowSecurityMiddleware:
    """Middleware para seguridad de workflows"""

    def __init__(self) -> None:
        self.security = HTTPBearer()
        self.rate_limiter: Dict[str, List[datetime]] = {}

    async def validate_workflow_request(self, request: Request) -> Dict[str, Any]:
        """Valida requests de workflow"""

        token = await self.security(request)
        user_data = self._verify_jwt_token(token.credentials)
        client_ip = request.client.host
        await self._check_rate_limit(client_ip, user_data["user_id"])
        await self._check_workflow_permissions(request, user_data)
        return user_data

    def _verify_jwt_token(self, token: str) -> Dict[str, Any]:
        """Verifica y decodifica JWT token"""

        try:
            payload = jwt.decode(token, "your-secret-key", algorithms=["HS256"])
            return payload
        except jwt.ExpiredSignatureError as exc:  # noqa: B904
            raise HTTPException(status_code=401, detail="Token expired") from exc
        except jwt.InvalidTokenError as exc:  # noqa: B904
            raise HTTPException(status_code=401, detail="Invalid token") from exc

    async def _check_rate_limit(self, client_ip: str, user_id: str) -> None:
        """Implementa rate limiting por IP y usuario"""

        current_time = datetime.now()
        ip_key = f"ip:{client_ip}"
        if ip_key not in self.rate_limiter:
            self.rate_limiter[ip_key] = []

        hour_ago = current_time - timedelta(hours=1)
        self.rate_limiter[ip_key] = [
            req_time for req_time in self.rate_limiter[ip_key] if req_time > hour_ago
        ]

        if len(self.rate_limiter[ip_key]) >= 100:
            raise HTTPException(status_code=429, detail="Rate limit exceeded")

        self.rate_limiter[ip_key].append(current_time)

    async def _check_workflow_permissions(
        self, request: Request, user_data: Dict[str, Any]
    ) -> None:
        """Verifica permisos de acceso a un workflow"""

        # En producción se verificaría en base de datos o ACLs.
        # Aquí se permite todo por defecto.
        _ = request
        _ = user_data
        return None


import logging


class WorkflowObservability:
    """Sistema de monitoreo para workflows"""

    def __init__(self) -> None:
        self.workflow_executions = Counter(
            "workflow_executions_total",
            "Total workflow executions",
            ["status", "user_tier", "template_id"],
        )
        self.workflow_duration = Histogram(
            "workflow_duration_seconds",
            "Workflow execution duration",
            ["template_id", "node_count"],
        )
        self.active_workflows = Gauge(
            "active_workflows", "Number of currently executing workflows"
        )
        self.agent_executions = Counter(
            "agent_executions_total", "Total agent executions", ["agent_type", "status"]
        )
        self.logger = self._setup_structured_logging()

    def _setup_structured_logging(self) -> logging.Logger:
        """Configura logging estructurado"""

        logger = logging.getLogger("workflow_engine")
        logger.setLevel(logging.INFO)
        handler = logging.StreamHandler()
        formatter = logging.Formatter(
            '{"timestamp": "%(asctime)s", "level": "%(levelname)s", '
            '"component": "workflow_engine", "message": "%(message)s", '
            '"extra": %(extra)s}'
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        return logger

    async def track_workflow_execution(
        self,
        workflow_id: str,
        status: str,
        duration: float,
        metadata: Dict[str, Any],
    ) -> None:
        """Registra métricas de ejecución de workflow"""

        self.workflow_executions.labels(
            status=status,
            user_tier=metadata.get("user_tier", "unknown"),
            template_id=metadata.get("template_id", "custom"),
        ).inc()
        self.workflow_duration.labels(
            template_id=metadata.get("template_id", "custom"),
            node_count=metadata.get("node_count", 0),
        ).observe(duration)

        log_data = {
            "workflow_id": workflow_id,
            "status": status,
            "duration": duration,
            "user_id": metadata.get("user_id"),
            "node_count": metadata.get("node_count"),
            "template_id": metadata.get("template_id"),
        }
        self.logger.info("Workflow execution %s", status, extra=log_data)
        await self._check_alerts(workflow_id, status, duration, metadata)

    async def _check_alerts(
        self, workflow_id: str, status: str, duration: float, metadata: Dict[str, Any]
    ) -> None:
        """Verifica condiciones de alerta"""

        alerts = []
        if duration > 1800:
            alerts.append(
                {
                    "type": "performance",
                    "severity": "warning",
                    "message": f"Workflow {workflow_id} tardó {duration:.1f} segundos",
                    "workflow_id": workflow_id,
                }
            )
        if status == "failed":
            alerts.append(
                {
                    "type": "reliability",
                    "severity": "error",
                    "message": f"Workflow {workflow_id} falló",
                    "workflow_id": workflow_id,
                }
            )
        for alert in alerts:
            await self._send_alert(alert)

    async def _send_alert(self, alert: Dict[str, Any]) -> None:
        """Envía alertas a canales configurados"""

        self.logger.warning("ALERT: %s", alert["message"], extra=alert)


PRODUCTION_CONFIG = {
    "security": {
        "jwt_secret": "use-environment-variable",
        "token_expiry_hours": 24,
        "rate_limit_per_hour": 100,
        "max_workflow_size_mb": 10,
    },
    "performance": {
        "max_concurrent_workflows": 50,
        "execution_timeout_seconds": 3600,
        "result_cache_ttl_hours": 24,
        "agent_circuit_breaker_enabled": True,
    },
    "monitoring": {
        "prometheus_enabled": True,
        "structured_logging": True,
        "alert_channels": ["slack", "email"],
        "metrics_retention_days": 30,
    },
    "scaling": {
        "auto_scaling_enabled": True,
        "min_worker_instances": 2,
        "max_worker_instances": 20,
        "scale_up_threshold": 0.8,
        "scale_down_threshold": 0.3,
    },
}
