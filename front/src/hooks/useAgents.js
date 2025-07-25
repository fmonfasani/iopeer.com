

// ============================================
// front/src/hooks/useAgents.js (Mejorado)
// Hook específico para manejo de agentes
// ============================================

export const useAgents = () => {
  const { agents, loading, sendMessage, error, isConnected } = useIopeer();
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
      const result = await sendMessage(agentId, action, data);
      return result;
    } catch (error) {
      const processedError = ErrorService.handleApiError(error, `Agent:${agentId}`);
      setAgentError(processedError);
      throw error;
    } finally {
      setAgentLoading(false);
    }
  }, [sendMessage]);

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
    clearError: () => setAgentError(null),
    
    // Agent utilities
    findAgentById: (id) => agents.find(agent => agent.agent_id === id),
    filterAgentsByType: (type) => agents.filter(agent => agent.type === type),
  };
};

