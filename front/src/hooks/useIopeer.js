// frontend/src/hooks/useIopeer.js - CORREGIDO
import { useState, useEffect, useCallback, useRef } from 'react';

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
  }, [makeRequest, handleError, retryAttempts, maxRetries, agents, clearError]);

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

  const sendMessage = useCallback(async (agentId, action, data = {}) => {
    try {
      return await makeRequest('/message/send', {
        method: 'POST',
        body: JSON.stringify({
          agent_id: agentId,
          action: action,
          data: data
        })
      });
    } catch (error) {
      console.error('Send message error:', error);
      throw error;
    }
  }, [makeRequest]);

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
    retry,
    clearError,
    sendMessage,
    
    // Utilities
    makeRequest
  };
};

// Hook useAgents - CORREGIDO COMPLETAMENTE
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
    try {
      const response = await fetch(`${API_BASE_URL}/message/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_id: agentId,
          action: action,
          data: data
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.status}`);
      }
      
      return await response.json();
    } catch (err) {
      console.error('Send message error:', err);
      throw err;
    }
  }, []);

  const getAgentDetails = useCallback(async (agentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/agents/${agentId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch agent details: ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      console.error('Get agent details error:', err);
      throw err;
    }
  }, []);

  // Función para seleccionar agente
  const selectAgent = useCallback((agent) => {
    setSelectedAgent(agent);
  }, []);

  // Calcular propiedades derivadas
  const activeAgents = agents.filter(agent => agent.status === 'idle' || agent.status === 'busy') || [];
  const agentCount = agents.length;
  const isConnected = connectionStatus === 'connected';

  return {
    // Estados básicos
    agents,
    selectedAgent,
    loading,
    error,
    
    // Estados de conexión
    isConnected,
    connectionStatus,
    
    // Propiedades calculadas
    activeAgents,
    agentCount,
    
    // Acciones
    selectAgent,
    refresh: fetchAgents,
    retry: fetchAgents, // Alias para compatibilidad
    sendMessage,
    getAgentDetails
  };
};

// Hook useMarketplace - CORREGIDO
export const useMarketplace = () => {
  const [featuredAgents, setFeaturedAgents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMarketplaceData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Primero intentar el endpoint específico de marketplace
      try {
        const response = await fetch(`${API_BASE_URL}/marketplace/featured`);
        if (response.ok) {
          const result = await response.json();
          const agents = result.agents || [];
          setFeaturedAgents(agents);
          
          // Extract unique categories
          const uniqueCategories = [...new Set(agents.map(agent => agent.category || 'general'))];
          setCategories(uniqueCategories);
          return;
        }
      } catch (marketplaceError) {
        console.warn('Marketplace endpoint not available, falling back to agents list');
      }
      
      // Fallback: usar lista de agentes
      const response = await fetch(`${API_BASE_URL}/agents`);
      if (!response.ok) {
        throw new Error(`Failed to fetch marketplace data: ${response.status}`);
      }
      
      const result = await response.json();
      const agents = result.agents || [];
      
      setFeaturedAgents(agents);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(agents.map(agent => agent.type || 'general'))];
      setCategories(uniqueCategories);
      
    } catch (err) {
      const errorMessage = err.message || 'Error desconocido';
      setError(errorMessage);
      console.error('useMarketplace error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarketplaceData();
  }, [fetchMarketplaceData]);

  const installAgent = useCallback(async (agentId) => {
    try {
      // For MVP: simulate installation
      console.log(`Installing agent: ${agentId}`);
      return { success: true, message: 'Agent installed successfully' };
    } catch (err) {
      console.error('Install agent error:', err);
      throw err;
    }
  }, []);

  const searchAgents = useCallback(async (query) => {
    try {
      if (!query) return featuredAgents;
      
      const filtered = featuredAgents.filter(agent => 
        agent.name.toLowerCase().includes(query.toLowerCase()) ||
        (agent.description && agent.description.toLowerCase().includes(query.toLowerCase()))
      );
      
      return filtered;
    } catch (err) {
      console.error('Search agents error:', err);
      throw err;
    }
  }, [featuredAgents]);

  return {
    featuredAgents,
    categories,
    loading,
    error,
    refresh: fetchMarketplaceData,
    reload: fetchMarketplaceData, // Alias para compatibilidad
    installAgent,
    searchAgents
  };
};