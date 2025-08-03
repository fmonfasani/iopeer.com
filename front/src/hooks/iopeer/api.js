const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const makeRequest = async (endpoint, options = {}) => {
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
      throw new Error(
        errorData.detail || errorData.message || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new Error('Request timeout - El servidor tardó demasiado en responder');
    }

    throw error;
  }
};

export const sendMessage = (agentId, action, data = {}) =>
  makeRequest('/message/send', {
    method: 'POST',
    body: JSON.stringify({ agent_id: agentId, action, data }),
  });

export { API_BASE_URL };
