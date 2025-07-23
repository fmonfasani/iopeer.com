import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const useIopeer = () => {
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [agents, setAgents] = useState([]);
  const [systemHealth, setSystemHealth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const connect = useCallback(async () => {
    setConnectionStatus('connecting');
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const health = await response.json();
      setSystemHealth(health);
      setConnectionStatus('connected');

      // Intentar cargar agentes
      try {
        const agentsResponse = await fetch(`${API_BASE_URL}/agents`);
        if (agentsResponse.ok) {
          const agentsData = await agentsResponse.json();
          setAgents(agentsData.agents || []);
        }
      } catch (agentsError) {
        console.warn('No se pudieron cargar los agentes:', agentsError);
        setAgents([]);
      }

    } catch (error) {
      setConnectionStatus('failed');
      setError(error.message);
      console.error('Connection failed:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    connect();
  }, [connect]);

  return {
    connectionStatus,
    agents,
    systemHealth,
    loading,
    error,
    connect,
    isConnected: connectionStatus === 'connected'
  };
};

export const useAgents = () => {
  const { agents, loading } = useIopeer();
  const [selectedAgent, setSelectedAgent] = useState(null);

  const selectAgent = useCallback((agent) => {
    setSelectedAgent(agent);
  }, []);

  const sendMessageToAgent = useCallback(async (agentId, action, data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/message/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent_id: agentId,
          action,
          data,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }, []);

  return {
    agents,
    selectedAgent,
    loading,
    selectAgent,
    sendMessageToAgent,
  };
};
