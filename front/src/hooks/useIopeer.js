// src/hooks/useIopeer.js - Versión mejorada
import { useState, useEffect, useCallback } from 'react';
import { marketplaceService } from '../services/marketplace.service';

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

  // Método para enviar mensajes a agentes
  const sendMessage = useCallback(async (agentId, action, data = {}) => {
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

      const result = await response.json();
      return result.result || result;
    } catch (error) {
      console.error('Error sending message:', error);
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
    isConnected: connectionStatus === 'connected'
  };
};

export const useAgents = () => {
  const { agents, loading, sendMessage } = useIopeer();
  const [selectedAgent, setSelectedAgent] = useState(null);

  const selectAgent = useCallback((agent) => {
    setSelectedAgent(agent);
  }, []);

  const sendMessageToAgent = useCallback(async (agentId, action, data) => {
    try {
      return await sendMessage(agentId, action, data);
    } catch (error) {
      throw error;
    }
  }, [sendMessage]);

  return {
    agents,
    selectedAgent,
    loading,
    selectAgent,
    sendMessageToAgent,
  };
};

// Hook específico para el marketplace
export const useMarketplace = () => {
  const [featuredAgents, setFeaturedAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadFeaturedAgents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const agents = await marketplaceService.getFeaturedAgents();
      setFeaturedAgents(agents);
    } catch (err) {
      setError(err.message);
      console.error('Error loading featured agents:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const installAgent = useCallback(async (agent) => {
    return await marketplaceService.installAgent(agent);
  }, []);

  useEffect(() => {
    loadFeaturedAgents();
  }, [loadFeaturedAgents]);

  return {
    featuredAgents,
    loading,
    error,
    installAgent,
    reload: loadFeaturedAgents
  };
};