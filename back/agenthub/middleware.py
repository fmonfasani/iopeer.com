# agenthub/middleware.py
import time

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

from agenthub.metrics import metrics


class MetricsMiddleware(BaseHTTPMiddleware):
    """Middleware para recopilar métricas de API"""

    async def dispatch(self, request: Request, call_next):
        start_time = time.time()

        # Tags para métricas
        tags = {"method": request.method, "endpoint": request.url.path}

        # Incrementar contador de requests
        metrics.increment("http.requests.total", tags)

        try:
            response = await call_next(request)

            # Métricas de respuesta
            duration = time.time() - start_time
            metrics.histogram("http.request.duration", duration, tags)

            # Tag de status code
            status_tags = {**tags, "status_code": str(response.status_code)}
            metrics.increment("http.responses.total", status_tags)

            # Agregar headers de métricas
            response.headers["X-Response-Time"] = f"{duration:.3f}s"

            return response

        except Exception as e:
            # Métricas de error
            error_tags = {**tags, "error_type": type(e).__name__}
            metrics.increment("http.errors.total", error_tags)

            duration = time.time() - start_time
            metrics.histogram("http.error.duration", duration, error_tags)

            # Re-raise la excepción
            raise


class AgentMetricsMiddleware:
    """Middleware para métricas de agentes"""

    def __init__(self, agent):
        self.agent = agent

    def process_message(self, message):
        """Procesa mensaje con métricas"""
        tags = {
            "agent_id": self.agent.agent_id,
            "action": message.get("action", "unknown"),
        }

        with metrics.timer("agent.message.processing", tags):
            try:
                result = self.agent.process_message(message)

                # Métricas de éxito
                if result.get("status") == "success":
                    metrics.increment("agent.messages.success", tags)
                else:
                    metrics.increment("agent.messages.error", tags)

                return result

            except Exception as e:
                # Métricas de error
                error_tags = {**tags, "error_type": type(e).__name__}
                metrics.increment("agent.messages.exception", error_tags)
                raise
