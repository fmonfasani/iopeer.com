import useWorkflow from './useWorkflow';

import { API_BASE_URL } from '../config/apiBase';

// Hook principal de Iopeer

export const useIopeer = () => {
  const workflow = useWorkflow();

  const connection = useConnection();
  const uiState = deriveUIState(connection);


  return {
    ...connection,
    ...uiState,
    workflows: workflow.workflows,
    templates: workflow.templates,
    availableAgents: workflow.availableAgents,
    executionEvents: workflow.executionEvents,
    isExecuting: workflow.isExecuting,
    activeExecution: workflow.activeExecution,
    workflowStats: workflow.workflowStats,
    agentStats: workflow.agentStats,
    connect: connection.connect,
    retry: connection.retry,
    clearWorkflowError: workflow.clearError,
    clearExecutionEvents: workflow.clearExecutionEvents,
    createWorkflow: workflow.createWorkflow,
    executeWorkflow: workflow.executeWorkflow,
    createWorkflowFromTemplate: workflow.createFromTemplate,
    loadWorkflows: workflow.loadWorkflows,
    loadTemplates: workflow.loadTemplates,
    loadAvailableAgents: workflow.loadAvailableAgents,
    wsConnected: workflow.wsConnected,
    sendMessage,
    makeRequest,
  };
};
