import { useState, useCallback, useEffect } from 'react';
import { API_BASE_URL, sendMessage } from './api';

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

      const response = await fetch(`${API_BASE_URL}/agents`);
      if (!response.ok) {
        throw new Error(`Failed to fetch agents: ${response.status}`);
      }
      const result = await response.json();
      const agentsData = result.agents || [];
      setAgents(agentsData);
      setConnectionStatus('connected');
    } catch (err) {
      setError(err.message || 'Error desconocido');
      setConnectionStatus('failed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const getAgentDetails = useCallback(async (agentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/agents/${agentId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch agent details: ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      throw err;
    }
  }, []);

  const selectAgent = useCallback((agent) => {
    setSelectedAgent(agent);
  }, []);

  const activeAgents = agents.filter(
    (agent) => agent.status === 'idle' || agent.status === 'busy'
  );

  return {
    agents,
    selectedAgent,
    loading,
    error,
    isConnected: connectionStatus === 'connected',
    connectionStatus,
    activeAgents,
    agentCount: agents.length,
    selectAgent,
    refresh: fetchAgents,
    retry: fetchAgents,
    sendMessage,
    getAgentDetails,
  };
};
