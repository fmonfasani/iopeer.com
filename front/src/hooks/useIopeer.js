// src/hooks/useIopeer.js - CON WORKFLOWS INTEGRADOS
import { useState, useEffect, useCallback, useRef } from 'react';
import { iopeerAPI } from '../services/iopeerAPI';
import { useWorkflow } from './useWorkflow';

// Hook principal de IOPeer que incluye workflows
export const useIopeer = () => {
  // Estado principal
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  
  // Estado de agentes
  const [agentStats, setAgentStats] = useState({
    total: 0,
    active: 0,
    idle: 0,
    error: 0
  });

  // Integración con workflows
  const workflowHook = useWorkflow();

  // Referencias
  const retryTimeoutRef = useRef(null);
  const maxRetries = 3;
  const retryDelay = 2000;

  // Función para cargar agentes
  const loadAgents = useCallback(async (retryCount = 0) => {
    try {
      setLoading(true);
      setError(null);

      const response = await iopeerAPI.getAgents();
      
      if (response && Array.isArray(response.agents)) {
        setAgents(response.agents);
        setIsConnected(true);
        setLastUpdate(new Date().toISOString());
        
        // Calcular estadísticas
        const stats = response.agents.reduce((acc, agent) => {
          acc.total++;
          switch (agent.status) {
            case 'idle':
              acc.idle++;
              break;
            case 'busy':
              acc.active++;
              break;
            case 'error':
              acc.error++;
              break;
            default:
              acc.idle++;
          }
          return acc;
        }, { total: 0, active: 0, idle: 0, error: 0 });
        
        setAgentStats(stats);
        
        // Limpiar retry timeout si existe
        if (retryTimeoutRef.current) {
          clearTimeout(retryTimeoutRef.current);
          retryTimeoutRef.current = null;
        }
        
      } else {
        throw new Error('Invalid response format from agents API');
      }
      
    } catch (err) {
      console.error('Error loading agents:', err);
      setIsConnected(false);
      
      const processedError = {
        type: 'CONNECTION_ERROR',
        message: 'No se pudo conectar con el backend de IOPeer',
        technical: err.message,
        retryCount
      };
      
      setError(processedError);
      
      // Auto-retry con backoff exponencial
      if (retryCount < maxRetries) {
        const delay = retryDelay * Math.pow(2, retryCount);
        retryTimeoutRef.current = setTimeout(() => {
          loadAgents(retryCount + 1);
        }, delay);
      }
      
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para enviar mensaje a agente
  const sendMessage = useCallback(async (agentId, action, data) => {
    try {
      setError(null);
      const result = await iopeerAPI.sendMessage(agentId, action, data);
      
      // Actualizar estado del agente después de enviar mensaje
      setAgents(prev => prev.map(agent => 
        agent.agent_id === agentId 
          ? { ...agent, last_activity: new Date().toISOString() }
          : agent
      ));
      
      return result;
    } catch (error) {
      const processedError = {
        type: 'MESSAGE_ERROR',
        message: `Error enviando mensaje al agente ${agentId}`,
        technical: error.message
      };
      setError(processedError);
      throw error;
    }
  }, []);

  // Función de retry manual
  const retry = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    loadAgents(0);
  }, [loadAgents]);

  // Cargar datos iniciales
  useEffect(() => {
    loadAgents();
    
    // Cleanup timeout al desmontar
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [loadAgents]);

  // Polling periódico (cada 30 segundos)
  useEffect(() => {
    if (!isConnected) return;
    
    const interval = setInterval(() => {
      loadAgents();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [isConnected, loadAgents]);

  // Funciones de utilidad
  const getAgentById = useCallback((id) => {
    return agents.find(agent => agent.agent_id === id);
  }, [agents]);

  const getAgentsByType = useCallback((type) => {
    return agents.filter(agent => agent.type === type);
  }, [agents]);

  const getActiveAgents = useCallback(() => {
    return agents.filter(agent => agent.status === 'idle');
  }, [agents]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Health check
  const healthCheck = useCallback(async () => {
    try {
      const health = await iopeerAPI.getHealth();
      return health;
    } catch (error) {
      console.error('Health check failed:', error);
      return { status: 'unhealthy', error: error.message };
    }
  }, []);

  return {
    // Datos principales
    agents,
    agentStats,
    
    // Estados
    loading,
    error,
    isConnected,
    lastUpdate,
    
    // Acciones de agentes
    sendMessage,
    loadAgents,
    retry,
    clearError,
    healthCheck,
    
    // Utilidades de agentes
    getAgentById,
    getAgentsByType,
    getActiveAgents,
    
    // Datos computados
    hasAgents: agents.length > 0,
    hasError: !!error,
    needsRetry: !!error && error.retryCount < maxRetries,
    
    // WORKFLOWS - Integración completa
    workflows: {
      // Estado
      list: workflowHook.workflows,
      templates: workflowHook.templates,
      availableAgents: workflowHook.availableAgents,
      loading: workflowHook.loading,
      error: workflowHook.error,
      isExecuting: workflowHook.isExecuting,
      executionEvents: workflowHook.executionEvents,
      activeExecution: workflowHook.activeExecution,
      
      // Estadísticas
      stats: workflowHook.workflowStats,
      agentStats: workflowHook.agentStats,
      
      // Acciones principales
      create: workflowHook.createWorkflow,
      get: workflowHook.getWorkflow,
      execute: workflowHook.executeWorkflow,
      createFromTemplate: workflowHook.createFromTemplate,
      
      // Acciones de carga
      loadWorkflows: workflowHook.loadWorkflows,
      loadAgents: workflowHook.loadAvailableAgents,
      loadTemplates: workflowHook.loadTemplates,
      
      // Utilidades
      getAgentsByCategory: workflowHook.getAgentsByCategory,
      getTemplatesByCategory: workflowHook.getTemplatesByCategory,
      clearError: workflowHook.clearError,
      clearExecutionEvents: workflowHook.clearExecutionEvents,
      
      // Estado de conexión
      isConnected: workflowHook.isConnected,
      wsConnected: workflowHook.wsConnected
    }
  };
};

// Hook específico para agentes (mantenido para compatibilidad)
export const useAgents = () => {
  const { agents, loading, error, isConnected, sendMessage, getAgentById, getAgentsByType, getActiveAgents, retry } = useIopeer();
  const [selectedAgent, setSelectedAgent] = useState(null);

  const selectAgent = useCallback((agent) => {
    setSelectedAgent(agent);
  }, []);

  return {
    // Data
    agents,
    selectedAgent,
    
    // States  
    loading,
    error,
    isConnected,
    
    // Computed
    activeAgents: getActiveAgents(),
    agentCount: agents.length,
    hasSelectedAgent: !!selectedAgent,
    
    // Actions
    selectAgent,
    sendMessage,
    retry,
    
    // Utilities
    getAgentById,
    getAgentsByType,
    filterAgentsByType: getAgentsByType,
  };
};

// Hook específico para marketplace (mantenido para compatibilidad)
export const useMarketplace = () => {
  const [featuredAgents, setFeaturedAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadFeaturedAgents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await iopeerAPI.getFeaturedAgents();
      setFeaturedAgents(response.agents || []);
      
    } catch (err) {
      setError(err.message);
      console.error('Error loading featured agents:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeaturedAgents();
  }, [loadFeaturedAgents]);

  return {
    featuredAgents,
    loading,
    error,
    loadFeaturedAgents,
    agentCount: featuredAgents.length
  };
};

// Hook específico para workflows (para uso directo)
export const useWorkflowManagement = () => {
  const { workflows } = useIopeer();
  return workflows;
};

export default useIopeer;