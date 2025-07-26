/**
 * Iopeer API Service adaptado para AgentHub
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class IopeerAPI {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.timeout = 30000;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const controller = new AbortController();

    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      ...options.headers,
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        headers,
        signal: controller.signal,
        ...options,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || response.statusText);
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

  // Stats
  async getStats() {
    return this.request('/stats');
  }

  // Marketplace específico
  async installAgent(agentId) {
    return this.request('/marketplace/install', {
      method: 'POST',
      body: JSON.stringify({ agent_id: agentId }),
    });
  }

  async getInstalledAgents() {
    return this.request('/marketplace/installed');
  }
}

export const iopeerAPI = new IopeerAPI();
export default IopeerAPI;
