# ============================================
# back/workflow_engine/core/WorkflowEngine.py
# Motor de workflows visuales para IOPeer
# ============================================

from typing import Any, Dict, List, Optional
from datetime import datetime
import asyncio
import json
from enum import Enum
from fastapi import WebSocket


class NodeStatus(Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    SKIPPED = "skipped"


class ConnectionType(Enum):
    SUCCESS = "success"  # Flujo normal
    ERROR = "error"  # En caso de error
    CONDITIONAL = "conditional"  # Basado en condición


class WorkflowNode:
    """Representación de un nodo en el workflow"""

    def __init__(self, node_id: str, agent_type: str, config: Dict[str, Any]):
        self.id = node_id
        self.agent_type = agent_type  # "ui_generator", "backend_agent", etc.
        self.config = config
        self.status = NodeStatus.PENDING
        self.inputs: List[str] = []  # IDs de nodos que alimentan este
        self.outputs: List[Dict[str, Any]] = []  # Conexiones salientes
        self.result: Optional[Dict[str, Any]] = None
        self.error: Optional[str] = None
        self.started_at: Optional[datetime] = None
        self.completed_at: Optional[datetime] = None


class WorkflowConnection:
    """Conexión entre dos nodos"""

    def __init__(
        self,
        source_id: str,
        target_id: str,
        connection_type: ConnectionType = ConnectionType.SUCCESS,
        condition: Optional[str] = None,
    ):
        self.source_id = source_id
        self.target_id = target_id
        self.type = connection_type
        self.condition = condition  # Para conexiones condicionales


class Workflow:
    """Definición completa de un workflow"""

    def __init__(self, workflow_id: str, name: str):
        self.id = workflow_id
        self.name = name
        self.nodes: Dict[str, WorkflowNode] = {}
        self.connections: List[WorkflowConnection] = []
        self.status = NodeStatus.PENDING
        self.created_at = datetime.now()
        self.metadata: Dict[str, Any] = {}

    def add_node(self, node: "WorkflowNode") -> None:
        """Añade un nodo al workflow"""
        self.nodes[node.id] = node

    def add_connection(self, connection: "WorkflowConnection") -> None:
        """Registra una conexión entre nodos"""
        self.connections.append(connection)
        target = self.nodes.get(connection.target_id)
        if target and connection.source_id not in target.inputs:
            target.inputs.append(connection.source_id)


class WorkflowEngine:
    """Motor principal de ejecución de workflows"""

    def __init__(self, agent_registry, event_bus):
        self.agent_registry = agent_registry
        self.event_bus = event_bus
        self.active_executions: Dict[str, "WorkflowExecution"] = {}

    async def execute_workflow(
        self, workflow: Workflow, initial_data: Dict[str, Any] = None
    ) -> str:
        """Ejecuta un workflow completo"""

        execution_id = f"exec_{workflow.id}_{int(datetime.now().timestamp())}"

        # Crear contexto de ejecución
        execution = WorkflowExecution(
            execution_id, workflow, initial_data, self.event_bus
        )

        self.active_executions[execution_id] = execution

        try:
            # Emitir evento de inicio
            await self.event_bus.emit(
                "workflow_started",
                {
                    "execution_id": execution_id,
                    "workflow_id": workflow.id,
                    "workflow_name": workflow.name,
                },
            )

            # Ejecutar workflow
            result = await execution.run(self.agent_registry)

            # Emitir evento de finalización
            await self.event_bus.emit(
                "workflow_completed",
                {
                    "execution_id": execution_id,
                    "result": result,
                    "duration": execution.get_duration(),
                },
            )

            return execution_id

        except Exception as e:
            await self.event_bus.emit(
                "workflow_failed", {"execution_id": execution_id, "error": str(e)}
            )
            raise
        finally:
            # Limpiar ejecución activa
            if execution_id in self.active_executions:
                del self.active_executions[execution_id]


class WorkflowExecution:
    """Contexto de ejecución de un workflow específico"""

    def __init__(
        self,
        execution_id: str,
        workflow: Workflow,
        initial_data: Dict[str, Any],
        event_bus,
    ):
        self.execution_id = execution_id
        self.workflow = workflow
        self.initial_data = initial_data or {}
        self.event_bus = event_bus
        self.execution_context: Dict[str, Any] = {"initial_data": initial_data}
        self.started_at = datetime.now()
        self.completed_at: Optional[datetime] = None

    async def run(self, agent_registry) -> Dict[str, Any]:
        """Ejecuta el workflow usando topological sort"""

        # 1. Calcular orden de ejecución
        execution_order = self._calculate_execution_order()

        # 2. Ejecutar nodos en orden
        for node_id in execution_order:
            node = self.workflow.nodes[node_id]

            # Verificar si el nodo debe ejecutarse
            if not self._should_execute_node(node):
                node.status = NodeStatus.SKIPPED
                continue

            # Ejecutar nodo
            await self._execute_node(node, agent_registry)

            # Verificar si debe continuar
            if node.status == NodeStatus.FAILED:
                error_handled = await self._handle_node_error(node)
                if not error_handled:
                    break

        self.completed_at = datetime.now()

        return {
            "execution_id": self.execution_id,
            "status": self._get_overall_status(),
            "results": self._collect_results(),
            "duration": self.get_duration(),
        }

    async def _execute_node(self, node: WorkflowNode, agent_registry):
        """Ejecuta un nodo individual"""

        node.status = NodeStatus.RUNNING
        node.started_at = datetime.now()

        # Emitir evento de inicio de nodo
        await self.event_bus.emit(
            "node_started",
            {
                "execution_id": self.execution_id,
                "node_id": node.id,
                "agent_type": node.agent_type,
            },
        )

        try:
            # Obtener agente del registro
            agent = agent_registry.get_agent(node.agent_type)
            if not agent:
                raise Exception(f"Agent type '{node.agent_type}' not found")

            # Preparar datos de entrada
            input_data = self._prepare_node_input(node)


            # Ejecutar agente (sincronico o asincronico)
            message = {
                "action": node.config.get("action", "process"),
                "data": input_data,
                "config": node.config,
            }

            if asyncio.iscoroutinefunction(agent.handle):
                result = await agent.handle(message)
            else:
                result = await asyncio.to_thread(agent.handle, message)


            # Guardar resultado
            node.result = result
            node.status = NodeStatus.COMPLETED
            node.completed_at = datetime.now()

            # Actualizar contexto de ejecución
            self.execution_context[f"node_{node.id}"] = result

            # Emitir evento de nodo completado
            await self.event_bus.emit(
                "node_completed",
                {
                    "execution_id": self.execution_id,
                    "node_id": node.id,
                    "result": result,
                    "duration": (node.completed_at - node.started_at).total_seconds(),
                },
            )

        except Exception as e:
            node.status = NodeStatus.FAILED
            node.error = str(e)
            node.completed_at = datetime.now()

            await self.event_bus.emit(
                "node_failed",
                {
                    "execution_id": self.execution_id,
                    "node_id": node.id,
                    "error": str(e),
                },
            )

            raise

    def _calculate_execution_order(self) -> List[str]:
        """Calcula el orden de ejecución usando topological sort"""

        # Crear grafo de dependencias
        graph = {node_id: [] for node_id in self.workflow.nodes.keys()}
        in_degree = {node_id: 0 for node_id in self.workflow.nodes.keys()}

        # Construir grafo
        for connection in self.workflow.connections:
            if connection.type == ConnectionType.SUCCESS:
                graph[connection.source_id].append(connection.target_id)
                in_degree[connection.target_id] += 1

        # Topological sort
        queue = [node_id for node_id, degree in in_degree.items() if degree == 0]
        execution_order = []

        while queue:
            current = queue.pop(0)
            execution_order.append(current)

            for neighbor in graph[current]:
                in_degree[neighbor] -= 1
                if in_degree[neighbor] == 0:
                    queue.append(neighbor)

        # Verificar ciclos
        if len(execution_order) != len(self.workflow.nodes):
            raise Exception("Workflow contains cycles")

        return execution_order

    def _prepare_node_input(self, node: WorkflowNode) -> Dict[str, Any]:
        """Prepara los datos de entrada para un nodo"""

        input_data = {}

        # Agregar datos iniciales
        input_data.update(self.initial_data)

        # Agregar resultados de nodos predecesores
        for input_node_id in node.inputs:
            if f"node_{input_node_id}" in self.execution_context:
                node_result = self.execution_context[f"node_{input_node_id}"]
                input_data[f"from_{input_node_id}"] = node_result

        return input_data

    def _should_execute_node(self, node: WorkflowNode) -> bool:
        """Determina si un nodo debe ejecutarse"""

        # Verificar dependencias
        for input_node_id in node.inputs:
            input_node = self.workflow.nodes[input_node_id]
            if input_node.status not in [NodeStatus.COMPLETED, NodeStatus.SKIPPED]:
                return False

        # Verificar condiciones específicas del nodo
        condition = node.config.get("condition")
        if condition:
            return self._evaluate_condition(condition)

        return True

    def _evaluate_condition(self, condition: str) -> bool:
        """Evalúa una condición lógica de forma segura."""

        import ast

        def _safe_eval(expr: str, variables: Dict[str, Any]) -> bool:
            """Evalúa la expresión permitiendo solo operaciones seguras."""

            allowed_nodes = (
                ast.Expression,
                ast.BoolOp,
                ast.BinOp,
                ast.UnaryOp,
                ast.Compare,
                ast.Name,
                ast.Load,
                ast.Constant,
                ast.And,
                ast.Or,
                ast.Not,
                ast.Eq,
                ast.NotEq,
                ast.Lt,
                ast.LtE,
                ast.Gt,
                ast.GtE,
                ast.In,
                ast.NotIn,
                ast.Dict,
                ast.Subscript,
            )

            tree = ast.parse(expr, mode="eval")
            for node in ast.walk(tree):
                if not isinstance(node, allowed_nodes):
                    raise ValueError("Unsafe expression")
                if isinstance(node, ast.Name) and node.id not in variables and node.id not in {"True", "False"}:
                    raise ValueError(f"Unknown variable '{node.id}'")

            compiled = compile(tree, "<expr>", "eval")
            return bool(eval(compiled, {"__builtins__": {}}, variables))

        try:
            for key, value in self.execution_context.items():
                condition = condition.replace(f"{{{key}}}", repr(value))

            return _safe_eval(condition, self.execution_context)
        except Exception:
            # Si la expresión es maliciosa o inválida, no ejecutar el nodo
            return False

    def get_duration(self) -> float:
        """Retorna la duración de la ejecución en segundos"""
        if self.completed_at:
            return (self.completed_at - self.started_at).total_seconds()
        return (datetime.now() - self.started_at).total_seconds()

    def _get_overall_status(self) -> str:
        """Determina el estado general del workflow"""
        statuses = [node.status for node in self.workflow.nodes.values()]

        if NodeStatus.FAILED in statuses:
            return "failed"
        elif NodeStatus.RUNNING in statuses:
            return "running"
        elif all(s in [NodeStatus.COMPLETED, NodeStatus.SKIPPED] for s in statuses):
            return "completed"
        else:
            return "running"

    def _collect_results(self) -> Dict[str, Any]:
        """Recopila todos los resultados del workflow"""
        results = {}

        for node_id, node in self.workflow.nodes.items():
            if node.result:
                results[node_id] = {
                    "agent_type": node.agent_type,
                    "result": node.result,
                    "duration": (
                        (node.completed_at - node.started_at).total_seconds()
                        if node.completed_at and node.started_at
                        else 0
                    ),
                    "status": node.status.value,
                }

        return results


# ============================================
# Registro de Agentes para Workflows
# ============================================


class AgentRegistry:
    """Registro de agentes disponibles para workflows"""

    def __init__(self):
        self.agents: Dict[str, Any] = {}
        self.agent_definitions: Dict[str, Dict[str, Any]] = {}

    def register_agent(
        self, agent_type: str, agent_instance, definition: Dict[str, Any]
    ):
        """Registra un agente en el sistema"""
        self.agents[agent_type] = agent_instance
        self.agent_definitions[agent_type] = definition

    def get_agent(self, agent_type: str):
        """Obtiene una instancia de agente"""
        return self.agents.get(agent_type)

    def get_available_agents(self) -> Dict[str, Dict[str, Any]]:
        """Retorna todos los agentes disponibles con sus definiciones"""
        return self.agent_definitions

    def get_agent_definition(self, agent_type: str) -> Dict[str, Any]:
        """Retorna la definición de un agente específico"""
        return self.agent_definitions.get(agent_type, {})


# ============================================
# Event Bus para comunicación en tiempo real
# ============================================


class EventBus:
    """Sistema de eventos para comunicación en tiempo real"""

    def __init__(self):
        self.listeners: Dict[str, List[callable]] = {}
        self.websocket_connections: List[Any] = []

    def subscribe(self, event_type: str, callback: callable):
        """Suscribe un callback a un tipo de evento"""
        if event_type not in self.listeners:
            self.listeners[event_type] = []
        self.listeners[event_type].append(callback)

    async def emit(self, event_type: str, data: Dict[str, Any]):
        """Emite un evento a todos los listeners"""

        # Ejecutar callbacks locales
        if event_type in self.listeners:
            for callback in self.listeners[event_type]:
                try:
                    await callback(data)
                except Exception as e:
                    print(f"Error in event callback: {e}")

        # Enviar a conexiones WebSocket
        await self._broadcast_to_websockets(event_type, data)

    async def _broadcast_to_websockets(self, event_type: str, data: Dict[str, Any]):
        """Envía eventos a todas las conexiones WebSocket activas"""
        message = {
            "type": event_type,
            "data": data,
            "timestamp": datetime.now().isoformat(),
        }


        disconnects: List[WebSocket] = []
        for websocket in list(self.websocket_connections):
            try:
                await websocket.send_json(message)
            except Exception:
                disconnects.append(websocket)

        for websocket in disconnects:
            if websocket in self.websocket_connections:
                self.websocket_connections.remove(websocket)
