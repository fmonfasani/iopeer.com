import { useState, useCallback, useEffect } from 'react';
import { marketplaceService } from '../services/marketplace.service';
import { useIopeer } from './useIopeer';

export const useMarketplace = () => {
  const { isConnected } = useIopeer();
  const [featuredAgents, setFeaturedAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadFeaturedAgents = useCallback(async () => {
    if (!isConnected) {
      setError('Not connected to the backend.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const agents = await marketplaceService.getFeaturedAgents();
      setFeaturedAgents(agents);
    } catch (err) {
      setError(err.message);
      console.error('Error loading featured agents:', err);
    } finally {
      setLoading(false);
    }
  }, [isConnected]);

  const installAgent = useCallback(async (agent) => {
    return await marketplaceService.installAgent(agent);
  }, []);

  useEffect(() => {
    if (isConnected) {
      loadFeaturedAgents();
    }
  }, [isConnected, loadFeaturedAgents]);

  return {
    featuredAgents,
    loading,
    error,
    installAgent,
    reload: loadFeaturedAgents
  };
};
