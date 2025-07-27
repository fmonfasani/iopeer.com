import { useState, useCallback } from 'react';
import { useIopeer } from './useIopeer';
import { iopeerAPI } from '../services/iopeerAPI';

// Hook específico para agentes
export const useAgents = () => {
  const { agents, loading, error, isConnected, retry } = useIopeer();
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [agentLoading, setAgentLoading] = useState(false);
  const [agentError, setAgentError] = useState(null);

  const selectAgent = useCallback((agent) => {
    setSelectedAgent(agent);
    setAgentError(null);
  }, []);

  const sendMessageToAgent = useCallback(async (agentId, action, data) => {
    setAgentLoading(true);
    setAgentError(null);

    try {
      const result = await iopeerAPI.sendMessage(agentId, action, data);
      return result;
    } catch (error) {
      const processedError = {
        type: 'AGENT_ERROR',
        message: `Error comunicándose con el agente ${agentId}`,
        technical: error.message
      };
      setAgentError(processedError);
      throw error;
    } finally {
      setAgentLoading(false);
    }
  }, []);

  const getAgentCapabilities = useCallback(async (agentId) => {
    try {
      return await sendMessageToAgent(agentId, 'get_capabilities', {});
    } catch (error) {
      console.error(`Error getting capabilities for ${agentId}:`, error);
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
    clearError: () => setAgentError(null),
    
    // Agent utilities
    findAgentById: (id) => agents.find(agent => agent.agent_id === id),
    filterAgentsByType: (type) => agents.filter(agent => agent.type === type),
  };
};
