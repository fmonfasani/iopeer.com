// src/services/workflow.service.js
// Servicio para manejar todas las operaciones de workflows


import { API_BASE_URL, WS_BASE_URL } from '../config/apiBase';


class WorkflowService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/api/v1`;
    this.timeout = 30000; // 30 segundos
  }

  /**
   * Método base para hacer requests a la API
   */
  async request(endpoint, options = {}) {
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
        throw new Error(errorData.detail || errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw new Error('Request timeout - el servidor tardó demasiado en responder');
      }

      throw error;
    }
  }

  /**
   * WORKFLOWS CRUD
   */

  // Obtener todos los workflows
  async getWorkflows() {
    try {
      const response = await this.request('/workflows');
      return {
        workflows: response.workflows || [],
        total: response.total || 0,
        status: response.status || 'success'
      };
    } catch (error) {
      console.error('Error getting workflows:', error);
      throw new Error(`Failed to load workflows: ${error.message}`);
    }
  }

  // Crear nuevo workflow
  async createWorkflow(workflowData) {
    try {
      const response = await this.request('/workflows', {
        method: 'POST',
        body: JSON.stringify(workflowData),
      });
      return response;
    } catch (error) {
      console.error('Error creating workflow:', error);
      throw new Error(`Failed to create workflow: ${error.message}`);
    }
  }

  // Obtener workflow específico
  async getWorkflow(workflowId) {
    try {
      const response = await this.request(`/workflows/${workflowId}`);
      return response.workflow;
    } catch (error) {
      console.error('Error getting workflow:', error);
      throw new Error(`Failed to load workflow: ${error.message}`);
    }
  }

  // Ejecutar workflow
  async executeWorkflow(workflowId, initialData = {}) {
    try {
      const response = await this.request(`/workflows/${workflowId}/execute`, {
        method: 'POST',
        body: JSON.stringify({ initial_data: initialData }),
      });
      return response;
    } catch (error) {
      console.error('Error executing workflow:', error);
      throw new Error(`Failed to execute workflow: ${error.message}`);
    }
  }

  // Actualizar workflow (si el backend lo soporta)
  async updateWorkflow(workflowId, workflowData) {
    try {
      const response = await this.request(`/workflows/${workflowId}`, {
        method: 'PUT',
        body: JSON.stringify(workflowData),
      });
      return response;
    } catch (error) {
      console.error('Error updating workflow:', error);
      throw new Error(`Failed to update workflow: ${error.message}`);
    }
  }

  // Eliminar workflow
  async deleteWorkflow(workflowId) {
    try {
      const response = await this.request(`/workflows/${workflowId}`, {
        method: 'DELETE',
      });
      return response;
    } catch (error) {
      console.error('Error deleting workflow:', error);
      throw new Error(`Failed to delete workflow: ${error.message}`);
    }
  }

  /**
   * AGENTES
   */

  // Obtener agentes disponibles para workflows
  async getAvailableAgents() {
    try {
      const response = await this.request('/agents/available');
      return {
        agents: response.agents || {},
        total: response.total || 0,
        categories: response.categories || []
      };
    } catch (error) {
      console.error('Error getting available agents:', error);
      throw new Error(`Failed to load available agents: ${error.message}`);
    }
  }

  /**
   * TEMPLATES
   */

  // Obtener templates de workflows
  async getWorkflowTemplates() {
    try {
      const response = await this.request('/workflows/templates');
      return {
        templates: response.templates || {},
        total: response.total || 0,
        categories: response.categories || []
      };
    } catch (error) {
      console.error('Error getting workflow templates:', error);
      throw new Error(`Failed to load workflow templates: ${error.message}`);
    }
  }

  // Crear workflow desde template
  async createFromTemplate(templateId, customizations = {}) {
    try {
      const response = await this.request(`/workflows/templates/${templateId}/create`, {
        method: 'POST',
        body: JSON.stringify(customizations),
      });
      return response;
    } catch (error) {
      console.error('Error creating from template:', error);
      throw new Error(`Failed to create workflow from template: ${error.message}`);
    }
  }

  /**
   * WEBSOCKET para tiempo real
   */

  // Crear conexión WebSocket para updates en tiempo real
  createWebSocketConnection(workflowId, onMessage, onError, onClose) {
    const wsURL = `${WS_BASE_URL}/api/v1/workflows/${workflowId}/ws`;
    
    try {
      const socket = new WebSocket(wsURL);

      socket.onopen = () => {
        console.log(`🔌 WebSocket connected for workflow: ${workflowId}`);
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (onMessage) {
            onMessage(data);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
          if (onError) {
            onError(error);
          }
        }
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        if (onError) {
          onError(error);
        }
      };

      socket.onclose = (event) => {
        console.log(`🔌 WebSocket disconnected for workflow: ${workflowId}`);
        if (onClose) {
          onClose(event);
        }
      };

      return socket;
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      if (onError) {
        onError(error);
      }
      return null;
    }
  }

  /**
   * UTILITIES
   */

  // Validar estructura de workflow antes de enviar
  validateWorkflow(workflow) {
    const errors = [];

    if (!workflow.workflow_id || typeof workflow.workflow_id !== 'string') {
      errors.push('workflow_id is required and must be a string');
    }

    if (!workflow.name || typeof workflow.name !== 'string') {
      errors.push('name is required and must be a string');
    }

    if (!workflow.nodes || !Array.isArray(workflow.nodes)) {
      errors.push('nodes is required and must be an array');
    }

    if (workflow.nodes && workflow.nodes.length === 0) {
      errors.push('workflow must have at least one node');
    }

    // Validar cada nodo
    if (workflow.nodes) {
      workflow.nodes.forEach((node, index) => {
        if (!node.id) {
          errors.push(`Node at index ${index} must have an id`);
        }
        if (!node.agent_type) {
          errors.push(`Node at index ${index} must have an agent_type`);
        }
        if (!node.position || typeof node.position.x !== 'number' || typeof node.position.y !== 'number') {
          errors.push(`Node at index ${index} must have valid position coordinates`);
        }
      });
    }

    // Validar conexiones
    if (workflow.connections && Array.isArray(workflow.connections)) {
      workflow.connections.forEach((connection, index) => {
        if (!connection.source_id) {
          errors.push(`Connection at index ${index} must have a source_id`);
        }
        if (!connection.target_id) {
          errors.push(`Connection at index ${index} must have a target_id`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Generar ID único para workflow
  generateWorkflowId(name) {
    const timestamp = Date.now();
    const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_');
    return `${cleanName}_${timestamp}`;
  }

  // Generar ID único para nodo
  generateNodeId(agentType) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 5);
    return `${agentType}_${timestamp}_${random}`;
  }

  // Exportar workflow a JSON
  exportWorkflow(workflow) {
    const exportData = {
      ...workflow,
      exported_at: new Date().toISOString(),
      exported_by: 'IOPeer Workflow Editor'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${workflow.name || 'workflow'}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Importar workflow desde archivo JSON
  async importWorkflow(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const workflowData = JSON.parse(event.target.result);
          
          // Validar estructura
          const validation = this.validateWorkflow(workflowData);
          if (!validation.isValid) {
            reject(new Error(`Invalid workflow file: ${validation.errors.join(', ')}`));
            return;
          }

          resolve(workflowData);
        } catch (error) {
          reject(new Error(`Failed to parse workflow file: ${error.message}`));
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read workflow file'));
      };

      reader.readAsText(file);
    });
  }

  /**
   * HEALTH CHECK
   */

  // Verificar conectividad con la API de workflows
  async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (response.ok) {
        const health = await response.json();
        return {
          status: 'healthy',
          workflow_engine: health.workflow_engine || 'unknown',
          total_workflows: health.total_workflows || 0,
          timestamp: new Date().toISOString()
        };
      } else {
        return {
          status: 'unhealthy',
          error: `HTTP ${response.status}`,
          timestamp: new Date().toISOString()
        };
      }
    } catch (error) {
      return {
        status: 'unreachable',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

// Crear instancia singleton
export const workflowService = new WorkflowService();

// Exportar clase para casos avanzados
export { WorkflowService };

// Export por defecto
export default workflowService;
