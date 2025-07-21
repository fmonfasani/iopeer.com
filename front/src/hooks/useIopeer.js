import { useState, useEffect, useCallback } from 'react';
import { iopeerAPI } from '../services/iopeerAPI';

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
      const health = await iopeerAPI.getHealth();
      setSystemHealth(health);
      setConnectionStatus('connected');
      
      // Cargar agentes
      const agentsData = await iopeerAPI.getAgents();
      setAgents(agentsData.agents || []);
      
    } catch (error) {
      setConnectionStatus('failed');
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (agentId, action, data) => {
    try {
      const result = await iopeerAPI.sendMessage(agentId, action, data);
      return result;
    } catch (error) {
      throw error;
    }
  }, []);

  const installAgent = useCallback(async (agentId) => {
    try {
      const result = await iopeerAPI.installAgent(agentId);
      
      // Actualizar lista de agentes instalados
      const agentsData = await iopeerAPI.getAgents();
      setAgents(agentsData.agents || []);
      
      return result;
    } catch (error) {
      throw error;
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
    sendMessage,
    installAgent,
    isConnected: connectionStatus === 'connected'
  };
};

export default useIopeer;
