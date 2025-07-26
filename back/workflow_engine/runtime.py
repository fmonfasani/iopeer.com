from typing import Dict, Optional

from .core.WorkflowEngine import AgentRegistry, EventBus, WorkflowEngine, Workflow

# Runtime components initialized on application startup
agent_registry: Optional[AgentRegistry] = None
event_bus: Optional[EventBus] = None
workflow_engine: Optional[WorkflowEngine] = None
# In-memory storage for defined workflows
workflows: Dict[str, Workflow] = {}
