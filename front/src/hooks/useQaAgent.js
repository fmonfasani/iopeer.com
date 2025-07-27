import { useState, useCallback } from 'react';
import { qaAgentService } from '../services/qaAgent.service';
import { useIopeer } from './useIopeer';

export const useQaAgent = () => {
  const { isConnected } = useIopeer();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateTests = useCallback(async (api) => {
    if (!isConnected) {
      setError('Not connected to the backend.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await qaAgentService.generateTests(api);
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
    generateTests,
  };
};
