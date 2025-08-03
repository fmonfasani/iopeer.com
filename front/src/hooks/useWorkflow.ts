// src/hooks/useWorkflow.js - MEJORADO para conectar con las nuevas APIs
import { useState, useEffect, useCallback, useRef } from 'react';
import { API_BASE_URL } from '../config/apiBase';

export interface Agent {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  color: string;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  category: string;
  description?: string;
}

// Configuración de la API

// Cliente de API para workflows
class WorkflowAPIClient {
  baseURL: string;
  timeout: number;

  constructor() {
    this.baseURL = `${API_BASE_URL}/api/v1`;
    this.timeout = 30000;
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
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
        throw new Error(errorData.detail || errorData.message || response.statusText);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }

      throw error;
    }
  }

  // Workflows
  async getWorkflows() {
    return this.request('/workflows');
  }

  async createWorkflow(workflow) {
    return this.request('/workflows', {
      method: 'POST',
      body: JSON.stringify(workflow),
    });
  }

  async getWorkflow(workflowId) {
    return this.request(`/workflows/${workflowId}`);
  }

  async executeWorkflow(workflowId, initialData = {}) {
    return this.request(`/workflows/${workflowId}/execute`, {
      method: 'POST',
      body: JSON.stringify({ initial_data: initialData }),
    });
  }

  // Agentes disponibles
  async getAvailableAgents() {
    return this.request('/agents/available');
  }

  // Templates
  async getWorkflowTemplates() {
    return this.request('/workflows/templates');
  }

  async createFromTemplate(templateId, customizations = {}) {
    return this.request(`/workflows/templates/${templateId}/create`, {
      method: 'POST',
      body: JSON.stringify(customizations),
    });
  }

  // WebSocket para updates en tiempo real
  createWebSocketConnection(workflowId, onMessage, onError) {
    const wsURL = `ws://localhost:8000/api/v1/workflows/${workflowId}/ws`;
    const socket = new WebSocket(wsURL);

    socket.onopen = () => {
      console.log(`🔌 WebSocket connected for workflow: ${workflowId}`);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
        onError?.(error);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      onError?.(error);
    };

    socket.onclose = () => {
      console.log(`🔌 WebSocket disconnected for workflow: ${workflowId}`);
    };

    return socket;
  }
}

// Hook principal para workflows
export const useWorkflow = () => {
  // Estado principal
  const [workflows, setWorkflows] = useState([]);
  const [availableAgents, setAvailableAgents] = useState<Record<string, Agent>>({});
  const [templates, setTemplates] = useState<Record<string, WorkflowTemplate>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Estado de ejecución
  const [executionEvents, setExecutionEvents] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeExecution, setActiveExecution] = useState(null);

  // Referencias
  const apiClient = useRef(new WorkflowAPIClient());
  const wsConnection = useRef<WebSocket | null>(null);

  // Cargar datos iniciales
  useEffect(() => {
    loadWorkflows();
    loadAvailableAgents();
    loadTemplates();
  }, []);

  // Función para cargar workflows
  const loadWorkflows = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.current.getWorkflows();
      setWorkflows(response.workflows || []);
    } catch (err) {
      setError(err.message);
      console.error('Error loading workflows:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para cargar agentes disponibles
  const loadAvailableAgents = useCallback(async () => {
    try {
      const response = await apiClient.current.getAvailableAgents();
      setAvailableAgents((response.agents || {}) as Record<string, Agent>);
    } catch (err) {
      console.error('Error loading available agents:', err);
    }
  }, []);

  // Función para cargar templates
  const loadTemplates = useCallback(async () => {
    try {
      const response = await apiClient.current.getWorkflowTemplates();
      setTemplates((response.templates || {}) as Record<string, WorkflowTemplate>);
    } catch (err) {
      console.error('Error loading templates:', err);
    }
  }, []);

  // Crear workflow
  const createWorkflow = useCallback(async (workflowData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.current.createWorkflow(workflowData);
      
      // Recargar workflows después de crear uno nuevo
      await loadWorkflows();
      
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadWorkflows]);

  // Obtener workflow específico
  const getWorkflow = useCallback(async (workflowId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.current.getWorkflow(workflowId);
      return response.workflow;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Ejecutar workflow
  const executeWorkflow = useCallback(async (workflowId, initialData = {}) => {
    try {
      setIsExecuting(true);
      setError(null);
      setExecutionEvents([]);
      
      // Conectar WebSocket para updates en tiempo real
      if (wsConnection.current) {
        wsConnection.current.close();
      }
      
      wsConnection.current = apiClient.current.createWebSocketConnection(
        workflowId,
        (event) => {
          setExecutionEvents(prev => [...prev, event]);
          
          // Manejar diferentes tipos de eventos
          switch (event.type) {
            case 'workflow_started':
              setActiveExecution({
                id: event.data.execution_id,
                workflow_id: workflowId,
                status: 'running'
              });
              break;
              
            case 'node_started':
            case 'node_completed':
            case 'node_failed':
              // Actualizar estado de nodos en tiempo real
              console.log(`Node ${event.data.node_id}: ${event.type}`);
              break;
              
            case 'workflow_completed':
              setIsExecuting(false);
              setActiveExecution(prev => prev ? { ...prev, status: 'completed' } : null);
              break;
              
            case 'workflow_failed':
              setIsExecuting(false);
              setActiveExecution(prev => prev ? { ...prev, status: 'failed' } : null);
              setError('Workflow execution failed');
              break;
              
            default:
              console.log('Unknown event type:', event.type);
          }
        },
        (error) => {
          console.error('WebSocket error:', error);
          setError('Connection error during execution');
        }
      );
      
      // Iniciar ejecución
      const response = await apiClient.current.executeWorkflow(workflowId, initialData);
      
      return response;
    } catch (err) {
      setError(err.message);
      setIsExecuting(false);
      throw err;
    }
  }, []);

  // Crear workflow desde template
  const createFromTemplate = useCallback(async (templateId, customizations = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.current.createFromTemplate(templateId, customizations);
      
      // Recargar workflows después de crear desde template
      await loadWorkflows();
      
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadWorkflows]);

  // Limpiar conexiones al desmontar
  useEffect(() => {
    return () => {
      if (wsConnection.current) {
        wsConnection.current.close();
      }
    };
  }, []);

  // Utilidades
  const getAgentsByCategory = useCallback((category: string) => {
    return Object.values(availableAgents).filter(agent =>
      agent.category === category
    );
  }, [availableAgents]);

  const getTemplatesByCategory = useCallback((category: string) => {
    return Object.values(templates).filter(template =>
      template.category === category
    );
  }, [templates]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearExecutionEvents = useCallback(() => {
    setExecutionEvents([]);
    setActiveExecution(null);
  }, []);

  // Datos computados
  const workflowStats = {
    total: workflows.length,
    byStatus: workflows.reduce((acc, wf) => {
      const status = wf.status || 'pending';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {}),
    totalNodes: workflows.reduce((acc, wf) => acc + (wf.node_count || 0), 0),
    totalConnections: workflows.reduce((acc, wf) => acc + (wf.connection_count || 0), 0)
  };

  const agentStats = {
    total: Object.keys(availableAgents).length,
    byCategory: Object.values(availableAgents).reduce((acc, agent) => {
      const category = agent.category || 'general';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {}),
    categories: Array.from(new Set(Object.values(availableAgents).map(agent => agent.category || 'general')))
  };

  return {
    // Estado principal
    workflows,
    availableAgents,
    templates,
    loading,
    error,
    
    // Estado de ejecución
    executionEvents,
    isExecuting,
    activeExecution,
    
    // Estadísticas
    workflowStats,
    agentStats,
    
    // Acciones principales
    createWorkflow,
    getWorkflow,
    executeWorkflow,
    createFromTemplate,
    
    // Acciones de carga
    loadWorkflows,
    loadAvailableAgents,
    loadTemplates,
    
    // Utilidades
    getAgentsByCategory,
    getTemplatesByCategory,
    clearError,
    clearExecutionEvents,
    
    // Estado de conexión
    isConnected: !error && !loading,
    wsConnected: !!wsConnection.current && wsConnection.current.readyState === WebSocket.OPEN
  };
};

// Hook simplificado para usar workflows específicos
export const useWorkflowExecution = (workflowId) => {
  const {
    executeWorkflow,
    executionEvents,
    isExecuting,
    activeExecution,
    error,
    clearExecutionEvents
  } = useWorkflow();

  const execute = useCallback(async (initialData = {}) => {
    if (!workflowId) {
      throw new Error('Workflow ID is required');
    }
    return executeWorkflow(workflowId, initialData);
  }, [workflowId, executeWorkflow]);

  return {
    execute,
    events: executionEvents,
    isExecuting,
    activeExecution,
    error,
    clearEvents: clearExecutionEvents
  };
};

// Hook para gestionar templates
export const useWorkflowTemplates = () => {
  const {
    templates,
    loading,
    error,
    createFromTemplate,
    loadTemplates,
    getTemplatesByCategory
  } = useWorkflow();

  return {
    templates: Object.values(templates),
    templatesById: templates,
    loading,
    error,
    createFromTemplate,
    loadTemplates,
    getTemplatesByCategory,
    categories: Array.from(new Set(Object.values(templates).map(t => t.category)))
  };
};

// Hook para gestionar agentes disponibles
export const useAvailableAgents = () => {
  const {
    availableAgents,
    loading,
    error,
    loadAvailableAgents,
    getAgentsByCategory,
    agentStats
  } = useWorkflow();

  return {
    agents: Object.values(availableAgents),
    agentsById: availableAgents,
    loading,
    error,
    loadAgents: loadAvailableAgents,
    getAgentsByCategory,
    stats: agentStats,
    categories: agentStats.categories
  };
};

export default useWorkflow;