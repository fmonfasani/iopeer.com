/**
 * Iopeer API Service
 * Maneja toda la comunicación con el backend de Iopeer
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class IopeerAPIError extends Error {
  constructor(status, message, details = null) {
    super(message);
    this.name = 'IopeerAPIError';
    this.status = status;
    this.details = details;
  }
}

class IopeerAPI {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.timeout = parseInt(process.env.REACT_APP_API_TIMEOUT) || 30000;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const controller = new AbortController();
    
    // Timeout automático
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          ...options.headers,
        },
        signal: controller.signal,
        ...options,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new IopeerAPIError(
          response.status,
          errorData.message || response.statusText,
          errorData
        );
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new IopeerAPIError(408, 'Request timeout');
      }
      
      if (error instanceof IopeerAPIError) {
        throw error;
      }
      
      throw new IopeerAPIError(0, `Network error: ${error.message}`);
    }
  }

  // Health check
  async getHealth() {
    return this.request('/health');
  }

  // Agents
  async getAgents() {
    return this.request('/agents');
  }

  async getAgent(agentId) {
    return this.request(`/agents/${agentId}`);
  }

  async sendMessage(agentId, action, data = {}) {
    return this.request('/message/send', {
      method: 'POST',
      body: JSON.stringify({
        agent_id: agentId,
        action,
        data,
      }),
    });
  }

  // Workflows
  async getWorkflows() {
    return this.request('/workflows');
  }

  async startWorkflow(workflowName, data = {}) {
    return this.request('/workflow/start', {
      method: 'POST',
      body: JSON.stringify({
        workflow: workflowName,
        data,
      }),
    });
  }

  // Executions
  async getExecutions() {
    return this.request('/executions');
  }

  async getExecution(executionId) {
    return this.request(`/executions/${executionId}`);
  }

  // Stats
  async getStats() {
    return this.request('/stats');
  }
}

export const iopeerAPI = new IopeerAPI();
export { IopeerAPIError };
