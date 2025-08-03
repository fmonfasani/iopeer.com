import { useState, useEffect, useCallback, useRef } from 'react';
import { makeRequest } from './api';

export const useConnection = () => {
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [agents, setAgents] = useState([]);
  const [systemHealth, setSystemHealth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const maxRetries = 3;
  const retryTimeoutRef = useRef(null);

  const clearError = useCallback(() => setError(null), []);

  const handleError = useCallback((err, context) => {
    console.error(`[${context}] Error:`, err);
    const processedError = {
      type: 'UNKNOWN_ERROR',
      message: 'Ocurrió un error inesperado. Intenta nuevamente.',
      action: 'Reintentar',
      technical: err.message,
    };
    setError(processedError);
    setConnectionStatus('failed');
    return processedError;
  }, []);

  const connect = useCallback(
    async (isRetry = false) => {
      if (!isRetry) setRetryAttempts(0);
      setConnectionStatus('connecting');
      setLoading(true);
      clearError();

      try {
        const health = await makeRequest('/health');
        setSystemHealth(health);
        try {
          const agentsResponse = await makeRequest('/agents');
          setAgents(agentsResponse.agents || []);
        } catch {
          setAgents([]);
        }
        setConnectionStatus('connected');
        setRetryAttempts(0);
        return { success: true, data: { health, agents } };
      } catch (error) {
        const processed = handleError(error, 'Connection');
        if (retryAttempts < maxRetries && !isRetry) {
          const next = retryAttempts + 1;
          setRetryAttempts(next);
          retryTimeoutRef.current = setTimeout(() => connect(true), 2000 * next);
        }
        return { success: false, error: processed };
      } finally {
        setLoading(false);
      }
    },
    [handleError, retryAttempts, maxRetries, agents, clearError]
  );

  const retry = useCallback(() => {
    if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
    connect();
  }, [connect]);

  useEffect(() => {
    connect();
    return () => {
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
    };
  }, [connect]);

  return {
    connectionStatus,
    agents,
    systemHealth,
    loading,
    error,
    retryAttempts,
    connect,
    retry,
    clearError,
  };
};
