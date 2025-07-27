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

  // MANTENER SOLO UNA VERSION - Eliminado el duplicado
  async createWorkflow({ name, tasks = [], parallel = false, timeout = 30 }) {
    return this.request('/workflows/register', {
      method: 'POST',
      body: JSON.stringify({ name, tasks, parallel, timeout }),
    });
  }

  async executeWorkflow(workflowName, data = {}) {
    return this.request('/workflow/start', {
      method: 'POST',
      body: JSON.stringify({
        workflow: workflowName,
        data,
      }),
    });
  }

  // Alias kept for backwards compatibility
  async startWorkflow(workflowName, data = {}) {
    return this.executeWorkflow(workflowName, data);
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

  // NUEVOS MÉTODOS AGREGADOS para compatibilidad completa
  async getFrontendConfig() {
    return this.request('/frontend/config');
  }

  async getAgentCapabilities(agentId) {
    return this.request(`/agents/${agentId}/capabilities`);
  }

  async testAgent(agentId, testData) {
    return this.request(`/agents/${agentId}/test`, {
      method: 'POST',
      body: JSON.stringify(testData)
    });
  }

  async executeWorkflowById(workflowId, data) {
    return this.request(`/workflows/${workflowId}/execute`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getWorkflowExecution(executionId) {
    return this.request(`/workflows/executions/${executionId}`);
  }

  // UI Generator específico
  async generateComponent(componentType, props) {
    return this.sendMessage('ui_generator', 'generate_component', {
      type: componentType,
      props: props
    });
  }

  async generatePage(pageType, pageData) {
    return this.sendMessage('ui_generator', 'generate_page', {
      type: pageType,
      ...pageData
    });
  }

  async getComponentTemplates() {
    return this.sendMessage('ui_generator', 'list_templates', {});
  }

  // Data Analysis
  async analyzeData(analysisType, data) {
    return this.sendMessage('data_analyst', 'analyze_metrics', {
      analysis_type: analysisType,
      data: data
    });
  }

  async generateDashboard(dashboardConfig) {
    return this.sendMessage('data_analyst', 'generate_dashboard', dashboardConfig);
  }

  // Backend Generation
  async generateAPI(apiSpec) {
    return this.sendMessage('backend_agent', 'generate_api', apiSpec);
  }

  async generateModel(modelSpec) {
    return this.sendMessage('backend_agent', 'generate_model', modelSpec);
  }

  // QA Testing
  async generateTests(testConfig) {
    return this.sendMessage('qa_agent', 'generate_tests', testConfig);
  }

  async analyzeCodeQuality(codeData) {
    return this.sendMessage('qa_agent', 'analyze_code_quality', codeData);
  }
}

export const iopeerAPI = new IopeerAPI();
export default IopeerAPI;