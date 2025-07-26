class WorkflowAPIClient {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    this.timeout = 30000;
  }

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

  async createWorkflow(payload) {
    return this.request('/workflows/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // New method for updating an existing workflow
  async updateWorkflow(id, payload) {
    return this.request(`/workflows/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  async saveWorkflow(workflow) {
    if (workflow.id) {
      return this.updateWorkflow(workflow.id, workflow);
    }
    return this.createWorkflow(workflow);
  }
}

export const workflowAPIClient = new WorkflowAPIClient();
export default WorkflowAPIClient;
