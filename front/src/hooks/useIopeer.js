import { useState, useEffect, useCallback } from 'react';
import { iopeerAPI } from '../services/iopeerAPI';

/**
 * Hook principal para interactuar con Iopeer
 */
export const useIopeer = () => {
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [agents, setAgents] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [systemHealth, setSystemHealth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar datos iniciales
  const loadInitialData = useCallback(async () => {
    setLoading(true);

    try {
      const [agentsData, workflowsData] = await Promise.all([
        iopeerAPI.getAgents(),
        iopeerAPI.getWorkflows()
      ]);

      setAgents(agentsData.agents || []);
      setWorkflows(workflowsData.workflows || []);

    } catch (error) {
      console.error('Failed to load initial data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Conectar con Iopeer backend
  const connect = useCallback(async () => {
    setConnectionStatus('connecting');
    setError(null);

    try {
      const health = await iopeerAPI.getHealth();
      setSystemHealth(health);
      setConnectionStatus('connected');

      // Cargar datos iniciales
      await loadInitialData();

    } catch (error) {
      setConnectionStatus('failed');
      setError(error.message);
      console.error('Iopeer connection failed:', error);
    }
  }, [loadInitialData]);

  // Enviar mensaje a agente
  const sendMessage = useCallback(async (agentId, action, data) => {
    try {
      const result = await iopeerAPI.sendMessage(agentId, action, data);
      return result;
    } catch (error) {
      throw error;
    }
  }, []);

  // Ejecutar workflow
  const executeWorkflow = useCallback(async (workflowName, data) => {
    try {
      const result = await iopeerAPI.startWorkflow(workflowName, data);
      return result;
    } catch (error) {
      throw error;
    }
  }, []);

  // Auto-reconexión
  useEffect(() => {
    if (connectionStatus === 'failed' && process.env.REACT_APP_AUTO_RECONNECT === 'true') {
      const timer = setTimeout(() => {
        connect();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [connectionStatus, connect]);

  // Conexión inicial
  useEffect(() => {
    connect();
  }, [connect]);

  return {
    // Estado
    connectionStatus,
    agents,
    workflows,
    systemHealth,
    loading,
    error,

    // Acciones
    connect,
    sendMessage,
    executeWorkflow,
    loadInitialData,

    // Utilidades
    isConnected: connectionStatus === 'connected',
    isLoading: loading,
    hasError: !!error,
  };
};

/**
 * Hook para manejar agentes específicamente
 */
export const useAgents = () => {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadAgents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await iopeerAPI.getAgents();
      setAgents(data.agents || []);
    } catch (error) {
      console.error('Failed to load agents:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const selectAgent = useCallback((agent) => {
    setSelectedAgent(agent);
  }, []);

  const sendMessageToAgent = useCallback(async (agentId, action, data) => {
    try {
      return await iopeerAPI.sendMessage(agentId, action, data);
    } catch (error) {
      throw error;
    }
  }, []);

  useEffect(() => {
    loadAgents();
  }, [loadAgents]);

  return {
    agents,
    selectedAgent,
    loading,
    selectAgent,
    sendMessageToAgent,
    refreshAgents: loadAgents,
  };
};
