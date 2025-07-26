from __future__ import annotations

import asyncio
from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Callable, Dict, List, Optional


class ConnectionType(Enum):
    SUCCESS = "success"
    ERROR = "error"


@dataclass
class WorkflowNode:
    id: str
    agent_type: str
    config: Dict[str, Any] = field(default_factory=dict)
    inputs: List[str] = field(default_factory=list)


@dataclass
class WorkflowConnection:
    source_id: str
    target_id: str
    type: ConnectionType = ConnectionType.SUCCESS


class Workflow:
    def __init__(self, workflow_id: str, name: str) -> None:
        self.id = workflow_id
        self.name = name
        self.nodes: Dict[str, WorkflowNode] = {}
        self.connections: List[WorkflowConnection] = []

    def add_node(self, node: WorkflowNode) -> None:
        self.nodes[node.id] = node

    def add_connection(self, connection: WorkflowConnection) -> None:
        self.connections.append(connection)
        target = self.nodes.get(connection.target_id)
        if target:
            target.inputs.append(connection.source_id)


class AgentRegistry:
    def __init__(self) -> None:
        self._agents: Dict[str, Any] = {}

    def register_agent(self, agent_type: str, agent: Any) -> None:
        self._agents[agent_type] = agent

    def get_agent(self, agent_type: str) -> Any:
        return self._agents.get(agent_type)


class EventBus:
    def __init__(self) -> None:
        self._listeners: Dict[str, List[Callable[[Any], Any]]] = {}

    def subscribe(self, event: str, callback: Callable[[Any], Any]) -> None:
        self._listeners.setdefault(event, []).append(callback)

    async def emit(self, event: str, data: Any) -> None:
        for cb in self._listeners.get(event, []):
            result = cb(data)
            if asyncio.iscoroutine(result):
                await result


class WorkflowEngine:
    def __init__(self, registry: AgentRegistry, event_bus: EventBus) -> None:
        self.registry = registry
        self.event_bus = event_bus
        self.workflows: Dict[str, Workflow] = {}

    def register_workflow(self, workflow: Workflow) -> None:
        self.workflows[workflow.id] = workflow

    def get_workflow(self, workflow_id: str) -> Optional[Workflow]:
        return self.workflows.get(workflow_id)

    async def execute(self, workflow_id: str, data: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        workflow = self.get_workflow(workflow_id)
        if not workflow:
            raise ValueError("Workflow not found")
        return await self._run_workflow(workflow, data or {})

    async def _run_workflow(self, workflow: Workflow, context: Dict[str, Any]) -> Dict[str, Any]:
        order = self._topological_sort(workflow)
        results: Dict[str, Any] = {}
        for node_id in order:
            node = workflow.nodes[node_id]
            agent = self.registry.get_agent(node.agent_type)
            if not agent:
                raise ValueError(f"Agent {node.agent_type} not registered")
            message = {"action": node.config.get("action", "run"), "data": context}
            result = await agent.handle(message)
            results[node_id] = result
            context[node_id] = result
        return results

    def _topological_sort(self, workflow: Workflow) -> List[str]:
        graph: Dict[str, List[str]] = {nid: [] for nid in workflow.nodes}
        indegree: Dict[str, int] = {nid: 0 for nid in workflow.nodes}
        for c in workflow.connections:
            if c.type == ConnectionType.SUCCESS:
                graph[c.source_id].append(c.target_id)
                indegree[c.target_id] += 1
        queue = [n for n, d in indegree.items() if d == 0]
        order: List[str] = []
        while queue:
            current = queue.pop(0)
            order.append(current)
            for neigh in graph[current]:
                indegree[neigh] -= 1
                if indegree[neigh] == 0:
                    queue.append(neigh)
        if len(order) != len(workflow.nodes):
            raise ValueError("Workflow contains cycles")
        return order
