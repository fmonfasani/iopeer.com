// src/config/api.js
const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

export const ENDPOINTS = {
  HEALTH: '/health',
  AGENTS: '/agents',
  AGENTS_REGISTER: '/agents/register',
  MESSAGE_SEND: '/message/send',
  WORKFLOWS: '/workflows',
  WORKFLOW_REGISTER: '/workflows/register',
  WORKFLOW_START: '/workflow/start',
  AUTH_LOGIN: '/auth/signin',
  AUTH_SIGNUP: '/auth/signup',
};

// Helper para hacer requests con retry automático
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  const controller = new AbortController();
  
  // Configuración por defecto
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    signal: controller.signal,
    ...options,
  };

  // Timeout
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  let lastError;
  
  // Retry logic
  for (let attempt = 0; attempt < API_CONFIG.RETRY_ATTEMPTS; attempt++) {
    try {
      const response = await fetch(url, defaultOptions);
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.detail || response.statusText);
      }

      return await response.json();
    } catch (error) {
      lastError = error;
      
      // No retry en el último intento o si es error de abort
      if (attempt === API_CONFIG.RETRY_ATTEMPTS - 1 || error.name === 'AbortError') {
        break;
      }
      
      // Esperar antes del siguiente intento
      await new Promise(resolve => 
        setTimeout(resolve, API_CONFIG.RETRY_DELAY * (attempt + 1))
      );
    }
  }

  clearTimeout(timeoutId);
  throw lastError;
};

// Helper para verificar si el backend está disponible
export const checkBackendHealth = async () => {
  try {
    await apiRequest(ENDPOINTS.HEALTH);
    return true;
  } catch (error) {
    console.warn('Backend health check failed:', error.message);
    return false;
  }
};

export default API_CONFIG;