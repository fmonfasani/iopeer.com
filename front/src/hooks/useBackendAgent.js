import { useState, useCallback } from 'react';
import { backendAgentService } from '../services/backendAgent.service';
import { useIopeer } from './useIopeer';

export const useBackendAgent = () => {
  const { isConnected } = useIopeer();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeRequirements = useCallback(async (requirements) => {
    if (!isConnected) {
      setError('Not connected to the backend.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await backendAgentService.analyzeRequirements(requirements);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, [isConnected]);

  const suggestArchitecture = useCallback(async (analysis) => {
    if (!isConnected) {
      setError('Not connected to the backend.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await backendAgentService.suggestArchitecture(analysis);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, [isConnected]);

  const generateAPI = useCallback(async (architecture) => {
    if (!isConnected) {
      setError('Not connected to the backend.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await backendAgentService.generateAPI(architecture);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, [isConnected]);

  return {
    loading,
    error,
    analyzeRequirements,
    suggestArchitecture,
    generateAPI,
  };
};
