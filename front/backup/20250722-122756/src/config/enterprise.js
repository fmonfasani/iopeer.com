/**
 * Configuración Enterprise de Iopeer
 */

const config = {
  app: {
    name: process.env.REACT_APP_NAME || 'Iopeer',
    version: process.env.REACT_APP_VERSION || '1.0.0',
    environment: process.env.REACT_APP_ENV || 'development',
    isEnterprise: process.env.REACT_APP_ENTERPRISE === 'true'
  },

  api: {
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
    wsURL: process.env.REACT_APP_WS_URL || 'ws://localhost:8000/ws',
    timeout: parseInt(process.env.REACT_APP_API_TIMEOUT) || 30000,
    maxRetries: parseInt(process.env.REACT_APP_MAX_RETRIES) || 3
  },

  features: {
    websocket: process.env.REACT_APP_ENABLE_WEBSOCKET === 'true',
    analytics: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
    errorTracking: process.env.REACT_APP_ENABLE_ERROR_TRACKING === 'true',
    advancedCaching: process.env.REACT_APP_ENABLE_ADVANCED_CACHING === 'true',
    realTimeMetrics: process.env.REACT_APP_ENABLE_REAL_TIME_METRICS === 'true'
  },

  performance: {
    cacheTTL: parseInt(process.env.REACT_APP_CACHE_TTL) || 300000,
    pollingInterval: parseInt(process.env.REACT_APP_POLLING_INTERVAL) || 5000,
    debounceDelay: parseInt(process.env.REACT_APP_DEBOUNCE_DELAY) || 500
  },

  endpoints: {
    analytics: process.env.REACT_APP_ANALYTICS_ENDPOINT || '/api/analytics',
    errorTracking: process.env.REACT_APP_ERROR_TRACKING_ENDPOINT || '/api/errors',
    metrics: process.env.REACT_APP_METRICS_ENDPOINT || '/api/metrics'
  },

  security: {
    enableCSP: process.env.REACT_APP_ENABLE_CSP === 'true',
    enableRateLimit: process.env.REACT_APP_ENABLE_RATE_LIMITING === 'true',
    maxRequestsPerMinute: parseInt(process.env.REACT_APP_MAX_REQUESTS_PER_MINUTE) || 100,
    sessionTimeout: parseInt(process.env.REACT_APP_SESSION_TIMEOUT) || 3600000
  }
};

export default config;
