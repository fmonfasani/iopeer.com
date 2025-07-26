# agenthub/orchestrator.py
import logging
import re
import time
import uuid
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime
from typing import Any, Dict, List, Optional

from .agents.base_agent import BaseAgent
from .config import config

logger = logging.getLogger(__name__)


class WorkflowExecutionError(Exception):
    """Error en ejecución de workflow"""


class AgentRegistry:
    """Registry de agentes disponibles"""

    def __init__(self):
        self.agents: Dict[str, BaseAgent] = {}
        self.logger = logging.getLogger(f"{__name__}.AgentRegistry")

    def register(self, agent: BaseAgent):
        """Registra un agente"""
        self.agents[agent.agent_id] = agent
        self.logger.info(f"Agent {agent.agent_id} registered")

    def unregister(self, agent_id: str):
        """Desregistra un agente"""
        if agent_id in self.agents:
            del self.agents[agent_id]
            self.logger.info(f"Agent {agent_id} unregistered")

    def get(self, agent_id: str) -> Optional[BaseAgent]:
        """Obtiene un agente por ID"""
        agent = self.agents.get(agent_id)
        if not agent:
            self.logger.debug(
                "Agent %s not found. Available agents: %s",
                agent_id,
                ", ".join(self.list_agents()) or "none",
            )
        return agent

    def list_agents(self) -> List[str]:
        """Lista todos los agentes registrados"""
        return list(self.agents.keys())

    def get_agent_info(self, agent_id: str) -> Optional[Dict[str, Any]]:
        """Obtiene información de un agente"""
        agent = self.get(agent_id)
        return agent.get_info() if agent else None


class WorkflowRegistry:
    """Registry de workflows disponibles"""

    def __init__(self):
        self.workflows: Dict[str, Dict[str, Any]] = {}
        self.logger = logging.getLogger(f"{__name__}.WorkflowRegistry")

    def register(self, name: str, definition: Dict[str, Any]):
        """Registra un workflow"""
        self.workflows[name] = {
            **definition,
            "created_at": datetime.utcnow().isoformat(),
            "executions": 0,
        }
        self.logger.info(f"Workflow {name} registered")

    def get(self, name: str) -> Optional[Dict[str, Any]]:
        """Obtiene un workflow por nombre"""
        return self.workflows.get(name)

    def list_workflows(self) -> List[str]:
        """Lista todos los workflows registrados"""
        return list(self.workflows.keys())


class Orchestrator:
    """Orquestador central de AgentHub"""

    # Patrón para validar tareas en formato "agente.accion"
    TASK_REGEX = re.compile(r"^[^.]+\.[^.]+$")

    @classmethod
    def is_valid_task(cls, task: str) -> bool:
        """Valida que la tarea tenga formato 'agent_id.action'."""
        return bool(cls.TASK_REGEX.match(task))

    def __init__(self):
        self.agent_registry = AgentRegistry()
        self.workflow_registry = WorkflowRegistry()
        self.execution_history: Dict[str, Dict[str, Any]] = {}
        self.executor = ThreadPoolExecutor(max_workers=config.get("max_workers", 4))
        self.logger = logging.getLogger(f"{__name__}.Orchestrator")

    def register_agent(self, agent: BaseAgent):
        """Registra un agente en el orquestador"""
        self.agent_registry.register(agent)

    def register_workflow(
        self,
        name: str,
        tasks: List[str],
        parallel: bool = False,
        timeout: Optional[int] = None,
    ) -> None:
        """
        Registra un workflow

        Args:
            name: Nombre del workflow
            tasks: Lista de tareas en formato "agent_id.action"
            parallel: Si las tareas se ejecutan en paralelo
            timeout: Timeout en segundos
        """
        for task in tasks:
            if not self.is_valid_task(task):
                raise ValueError(f"Invalid task format: {task}. Use 'agent_id.action'")

        definition = {
            "tasks": tasks,
            "parallel": parallel,
            "timeout": timeout or config.get("timeout", 30),
        }
        self.workflow_registry.register(name, definition)

    def send_message(self, agent_id: str, message: Dict[str, Any]) -> Dict[str, Any]:
        """Envía un mensaje a un agente específico"""
        agent = self.agent_registry.get(agent_id)
        if not agent:
            available = ", ".join(self.agent_registry.list_agents()) or "none"
            raise ValueError(
                f"Agent {agent_id} not found. Available agents: {available}"
            )

        return agent.process_message(message)

    def execute_workflow(
        self, workflow_name: str, initial_data: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Ejecuta un workflow completo

        Args:
            workflow_name: Nombre del workflow a ejecutar
            initial_data: Datos iniciales para el workflow

        Returns:
            Resultado de la ejecución del workflow
        """
        workflow = self.workflow_registry.get(workflow_name)
        if not workflow:
            raise WorkflowExecutionError(f"Workflow {workflow_name} not found")

        execution_id = str(uuid.uuid4())
        start_time = time.time()

        self.logger.info(
            f"Starting workflow {workflow_name} (execution: {execution_id})"
        )

        try:
            if workflow.get("parallel", False):
                result = self._execute_parallel_workflow(
                    workflow, initial_data or {}, execution_id
                )
            else:
                result = self._execute_sequential_workflow(
                    workflow, initial_data or {}, execution_id
                )

            execution_time = time.time() - start_time

            # Guardar en historial
            self.execution_history[execution_id] = {
                "workflow_name": workflow_name,
                "start_time": start_time,
                "execution_time": execution_time,
                "status": "completed",
                "result": result,
            }

            # Actualizar contador
            workflow["executions"] += 1

            self.logger.info(
                f"Workflow {workflow_name} completed in {execution_time:.2f}s"
            )

            return {
                "execution_id": execution_id,
                "workflow": workflow_name,
                "status": "completed",
                "execution_time": execution_time,
                "result": result,
            }

        except Exception as e:
            execution_time = time.time() - start_time

            self.execution_history[execution_id] = {
                "workflow_name": workflow_name,
                "start_time": start_time,
                "execution_time": execution_time,
                "status": "failed",
                "error": str(e),
            }

            self.logger.error(f"Workflow {workflow_name} failed: {str(e)}")
            raise WorkflowExecutionError(f"Workflow execution failed: {str(e)}")

    def _execute_sequential_workflow(
        self, workflow: Dict[str, Any], context: Dict[str, Any], execution_id: str
    ) -> Dict[str, Any]:
        """Ejecuta workflow secuencial"""
        results = {}

        for i, task in enumerate(workflow["tasks"], 1):
            try:
                agent_id, action = task.split(".", 1)
            except ValueError:
                raise WorkflowExecutionError(f"Invalid task format: {task}")

            message = {
                "action": action,
                "data": context,
                "workflow_execution_id": execution_id,
                "step": i,
            }

            step_result = self.send_message(agent_id, message)

            results[f"step_{i}"] = {
                "task": task,
                "agent_id": agent_id,
                "action": action,
                "result": step_result,
            }

            # Actualizar contexto con el resultado
            if isinstance(step_result, dict) and "data" in step_result:
                context.update(step_result["data"])

        return {"steps": results, "final_context": context}

    def _execute_parallel_workflow(
        self, workflow: Dict[str, Any], context: Dict[str, Any], execution_id: str
    ) -> Dict[str, Any]:
        """Ejecuta workflow en paralelo"""
        tasks = []

        for i, task in enumerate(workflow["tasks"], 1):
            try:
                agent_id, action = task.split(".", 1)
            except ValueError:
                raise WorkflowExecutionError(f"Invalid task format: {task}")

            message = {
                "action": action,
                "data": context.copy(),
                "workflow_execution_id": execution_id,
                "step": i,
            }

            future = self.executor.submit(self.send_message, agent_id, message)
            tasks.append((task, agent_id, action, future))

        results = {}
        timeout = workflow.get("timeout", 30)

        for task, agent_id, action, future in tasks:
            try:
                step_result = future.result(timeout=timeout)
                results[task] = {
                    "agent_id": agent_id,
                    "action": action,
                    "result": step_result,
                }
            except Exception as e:
                results[task] = {
                    "agent_id": agent_id,
                    "action": action,
                    "error": str(e),
                }

        return {"parallel_results": results, "context": context}

    def get_execution_history(self, execution_id: str) -> Optional[Dict[str, Any]]:
        """Obtiene historial de ejecución"""
        return self.execution_history.get(execution_id)

    def list_executions(self) -> List[Dict[str, Any]]:
        """Lista todas las ejecuciones"""
        return [
            {"execution_id": eid, **details}
            for eid, details in self.execution_history.items()
        ]

    def get_stats(self) -> Dict[str, Any]:
        """Obtiene estadísticas del orquestador"""
        return {
            "agents": len(self.agent_registry.agents),
            "workflows": len(self.workflow_registry.workflows),
            "total_executions": len(self.execution_history),
            "active_threads": self.executor._threads
            and len(self.executor._threads)
            or 0,
        }

    def shutdown(self) -> None:
        """Detiene el ejecutor de hilos"""
        self.executor.shutdown(wait=False)


# Instancia global
orchestrator = Orchestrator()
