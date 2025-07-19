# agenthub/agents/base_agent.py
import logging
import uuid
from abc import ABC, abstractmethod
from datetime import datetime
from typing import Any, Dict, Optional

logger = logging.getLogger(__name__)


class BaseAgent(ABC):
    """Clase base para todos los agentes IA en el hub"""

    def __init__(self, agent_id: str, name: Optional[str] = None):
        self.agent_id = agent_id
        self.name = name or agent_id
        self.created_at = datetime.utcnow()
        self.status = "idle"
        self.stats = {"messages_processed": 0, "errors": 0, "last_activity": None}
        self.logger = logging.getLogger(f"{__name__}.{agent_id}")

    @abstractmethod
    def handle(self, message: Dict[str, Any]) -> Dict[str, Any]:
        """
        Maneja una petición entrante. Debe ser implementado por subclases.

        Args:
            message: Dict con al menos la clave 'action' y opcionalmente 'data'

        Returns:
            Dict con la respuesta del agente
        """
        pass

    def _validate_message(self, message: Dict[str, Any]) -> bool:
        """Valida formato básico del mensaje"""
        if not isinstance(message, dict):
            return False
        return "action" in message

    def _update_stats(self, success: bool = True):
        """Actualiza estadísticas del agente"""
        self.stats["messages_processed"] += 1
        self.stats["last_activity"] = datetime.utcnow().isoformat()
        if not success:
            self.stats["errors"] += 1

    def process_message(self, message: Dict[str, Any]) -> Dict[str, Any]:
        """
        Punto de entrada principal para procesar mensajes.
        Incluye validación, logging y manejo de errores.
        """
        trace_id = str(uuid.uuid4())

        try:
            self.status = "busy"
            self.logger.info(f"Processing message {trace_id}: {message.get('action')}")

            if not self._validate_message(message):
                raise ValueError("Invalid message format")

            # Agregar metadata al mensaje
            message_with_metadata = {
                **message,
                "metadata": {
                    "trace_id": trace_id,
                    "agent_id": self.agent_id,
                    "timestamp": datetime.utcnow().isoformat(),
                },
            }

            result = self.handle(message_with_metadata)

            # Asegurar formato consistente de respuesta
            if not isinstance(result, dict):
                result = {"data": result}

            result.setdefault("status", "success")
            result.setdefault("agent_id", self.agent_id)
            result.setdefault("trace_id", trace_id)

            self._update_stats(success=True)
            self.logger.info(f"Message {trace_id} processed successfully")

            return result

        except Exception as e:
            self._update_stats(success=False)
            self.logger.error(f"Error processing message {trace_id}: {str(e)}")

            return {
                "status": "error",
                "error": str(e),
                "error_type": type(e).__name__,
                "agent_id": self.agent_id,
                "trace_id": trace_id,
            }
        finally:
            self.status = "idle"

    def get_info(self) -> Dict[str, Any]:
        """Retorna información del agente"""
        return {
            "agent_id": self.agent_id,
            "name": self.name,
            "type": self.__class__.__name__,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
            "stats": self.stats.copy(),
            "capabilities": self.get_capabilities(),
        }

    def get_capabilities(self) -> Dict[str, Any]:
        """
        Retorna las capacidades del agente.
        Debe ser sobrescrito por subclases para documentar acciones soportadas.
        """
        return {
            "actions": [],
            "description": self.__doc__ or "No description available",
        }

    def health_check(self) -> Dict[str, Any]:
        """Health check del agente"""
        return {
            "healthy": True,
            "status": self.status,
            "uptime": (datetime.utcnow() - self.created_at).total_seconds(),
        }
