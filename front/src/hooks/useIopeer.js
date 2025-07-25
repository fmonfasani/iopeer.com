// front/src/hooks/useIopeer.js (Corregido)
import { useState, useEffect, useCallback, useRef } from 'react';
import { marketplaceService } from '../services/marketplace.service';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Hook principal de Iopeer
export const useIopeer = () => {
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [agents, setAgents] = useState([]);
  const [systemHealth, setSystemHealth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const maxRetries = 3;
  const retryTimeoutRef = useRef(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleError = useCallback((err, context) => {
    console.error(`[${context}] Error:`, err);
    
    let processedError = {
      type: 'UNKNOWN_ERROR',
      message: 'Ocurrió un error inesperado. Intenta nuevamente.',
      action: 'Reintentar',
      technical: err.message
    };

    // Determinar tipo de error
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      processedError = {
        type: 'CONNECTION_ERROR',
        message: 'No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose.',
        action: 'Reintentar',
        technical: err.message
      };
    } else if (err.message.includes('timeout')) {
      processedError = {
        type: 'TIMEOUT_ERROR', 
        message: 'La solicitud tardó demasiado. Intenta nuevamente.',
        action: 'Reintentar',
        technical: err.message
      };
    }

    setError(processedError);
    setConnectionStatus('failed');
    return processedError;
  }, []);

  const makeRequest = useCallback(async (endpoint, options = {}) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        signal: controller.signal,
        ...options,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - El servidor tardó demasiado en responder');
      }
      
      throw error;
    }
  }, []);

  const connect = useCallback(async (isRetry = false) => {
    if (!isRetry) {
      setRetryAttempts(0);
    }
    
    setConnectionStatus('connecting');
    setLoading(true);
    clearError();

    try {
      // 1. Verificar salud del sistema
      console.log('🔍 Verificando conexión con el backend...');
      const health = await makeRequest('/health');
      setSystemHealth(health);
      console.log('✅ Backend conectado:', health);

      // 2. Cargar agentes disponibles
      console.log('🤖 Cargando agentes...');
      try {
        const agentsResponse = await makeRequest('/agents');
        setAgents(agentsResponse.agents || []);
        console.log(`✅ ${agentsResponse.agents?.length || 0} agentes cargados`);
      } catch (agentsError) {
        console.warn('⚠️ Error cargando agentes (continuando):', agentsError.message);
        setAgents([]);
      }

      setConnectionStatus('connected');
      setRetryAttempts(0);
      
      return { success: true, data: { health, agents: agents } };

    } catch (error) {
      console.error('❌ Error de conexión:', error);
      
      const processedError = handleError(error, 'Connection');
      
      // Auto-retry logic
      if (retryAttempts < maxRetries && !isRetry) {
        const nextAttempt = retryAttempts + 1;
        setRetryAttempts(nextAttempt);
        
        console.log(`🔄 Reintentando conexión (${nextAttempt}/${maxRetries}) en 2 segundos...`);
        
        retryTimeoutRef.current = setTimeout(() => {
          connect(true);
        }, 2000 * nextAttempt);
      }
      
      return { success: false, error: processedError };
    } finally {
      setLoading(false);
    }
  }, [makeRequest, handleError, retryAttempts, maxRetries, agents]);

  const sendMessage = useCallback(async (agentId, action, data = {}) => {
    if (connectionStatus !== 'connected') {
      throw new Error('No hay conexión con el backend. Intenta reconectar.');
    }

    setLoading(true);
    clearError();

    try {
      console.log(`📤 Enviando mensaje a ${agentId}:`, { action, data });
      
      const response = await makeRequest('/message/send', {
        method: 'POST',
        body: JSON.stringify({
          agent_id: agentId,
          action,
          data,
        }),
      });

      console.log(`📨 Respuesta de ${agentId}:`, response);
      return response.result || response;

    } catch (error) {
      console.error(`❌ Error enviando mensaje a ${agentId}:`, error);
      handleError(error, `SendMessage:${agentId}:${action}`);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [connectionStatus, makeRequest, handleError, clearError]); 

  const retry = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
    connect();
  }, [connect]);

  // Auto-connect on mount
  useEffect(() => {
    connect();
    
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [connect]); // Solo ejecutar una vez al montar

  return {
    // States
    connectionStatus,
    agents,
    systemHealth,
    loading,
    error,
    retryAttempts,
    
    // Computed
    isConnected: connectionStatus === 'connected',
    isConnecting: connectionStatus === 'connecting',
    isFailed: connectionStatus === 'failed',
    hasAgents: agents.length > 0,
    
    // Actions
    connect,
    sendMessage,
    retry,
    clearError,
    
    // Utilities
    makeRequest
  };
};

// Hook específico para agentes
export const useAgents = () => {
  const { agents, loading, sendMessage, error, isConnected, retry } = useIopeer();
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
    retry,
    clearError: () => setAgentError(null),
    
    // Agent utilities
    findAgentById: (id) => agents.find(agent => agent.agent_id === id),
    filterAgentsByType: (type) => agents.filter(agent => agent.type === type),
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