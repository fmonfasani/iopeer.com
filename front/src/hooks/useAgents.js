import { useState, useCallback } from 'react';
import { useIopeer } from './useIopeer';
import { iopeerAPI } from '../services/iopeerAPI';
import ErrorService from '../services/errorService';
import useAsync from './useAsync';

// Hook específico para agentes
export const useAgents = () => {
  const { agents, loading, error, isConnected, retry } = useIopeer();
  const [selectedAgent, setSelectedAgent] = useState(null);
  const {
    execute: sendMessageToAgent,
    loading: agentLoading,
    error: agentError
  } = useAsync((agentId, action, data) => iopeerAPI.sendMessage(agentId, action, data), {
    context: 'sendMessageToAgent'
  });

  const selectAgent = useCallback((agent) => {
    setSelectedAgent(agent);
  }, []);

  const getAgentCapabilities = useCallback(async (agentId) => {
    try {
      return await sendMessageToAgent(agentId, 'get_capabilities', {});
    } catch (error) {
      if (ErrorService.logError) {
        ErrorService.logError(error, 'getAgentCapabilities');
      }
      return null;
    }
  }, [sendMessageToAgent]);

  return {
    // Data
    agents,
    selectedAgent,
    
    // States
    loading: loading || agentLoading,
    error: error || agentError,
    isConnected,
    
    // Computed
    activeAgents: agents.filter(agent => agent.status === 'idle'),
    agentCount: agents.length,
    hasSelectedAgent: !!selectedAgent,
    
    // Actions
    selectAgent,
    sendMessageToAgent,
    getAgentCapabilities,
    retry,
    
    // Agent utilities
    findAgentById: (id) => agents.find(agent => agent.agent_id === id),
    filterAgentsByType: (type) => agents.filter(agent => agent.type === type),
  };
};
