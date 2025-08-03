import { useState, useEffect, useCallback } from 'react';
import useWorkflow from './useWorkflow';
import { useConnection } from './iopeer/useConnection';
import { deriveUIState } from './iopeer/useUIState';
import { iopeerAPI } from '../services/iopeerAPI';

// Hook principal de Iopeer
export const useIopeer = () => {
  const workflow = useWorkflow();
  const connection = useConnection();
  const uiState = deriveUIState(connection);

  const sendMessage = ({ agent_id, action, data = {} }) =>
    iopeerAPI.sendMessage(agent_id, action, data);

  return {
    ...connection,
    ...uiState,
    connection,
    uiState,
    workflows: workflow.workflows,
    templates: workflow.templates,
    availableAgents: workflow.availableAgents,
    executionEvents: workflow.executionEvents,
    isExecuting: workflow.isExecuting,
    activeExecution: workflow.activeExecution,
    workflowStats: workflow.workflowStats,
    agentStats: workflow.agentStats,
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
  };
};

// Hook useAgents
export const useAgents = () => {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  const fetchAgents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setConnectionStatus('connecting');

      const result = await iopeerAPI.getAgents();
      const agentsData = result.agents || [];
      setAgents(agentsData);
      setConnectionStatus('connected');

      console.log(`✅ useAgents: ${agentsData.length} agentes cargados`);
    } catch (err) {
      const errorMessage = err.message || 'Error desconocido';
      setError(errorMessage);
      setConnectionStatus('failed');
      console.error('useAgents error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const sendMessage = useCallback(async (agentId, action, data) => {
    return iopeerAPI.sendMessage(agentId, action, data);
  }, []);

  const getAgentDetails = useCallback(async (agentId) => {
    try {
      return await iopeerAPI.getAgent(agentId);
    } catch (err) {
      console.error('Get agent details error:', err);
      throw err;
    }
  }, []);

  const selectAgent = useCallback((agent) => {
    setSelectedAgent(agent);
  }, []);

  const activeAgents = agents.filter(agent => agent.status === 'idle' || agent.status === 'busy') || [];
  const agentCount = agents.length;
  const isConnected = connectionStatus === 'connected';

  return {
    agents,
    selectedAgent,
    loading,
    error,
    isConnected,
    connectionStatus,
    activeAgents,
    agentCount,
    selectAgent,
    refresh: fetchAgents,
    retry: fetchAgents,
    sendMessage,
  };
};
