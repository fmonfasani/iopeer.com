import { useState, useCallback, useEffect } from 'react';
import { marketplaceService } from '../services/marketplace.service';
import { useIopeer } from './useIopeer';
import ErrorService from '../services/errorService';
import useAsync from './useAsync';

export const useMarketplace = () => {
  const { isConnected } = useIopeer();
  const [featuredAgents, setFeaturedAgents] = useState([]);
  const { execute: fetchFeaturedAgents, loading, error } = useAsync(
    marketplaceService.getFeaturedAgents,
    { context: 'getFeaturedAgents' }
  );

  const loadFeaturedAgents = useCallback(async () => {
    try {
      const agents = await fetchFeaturedAgents();
      setFeaturedAgents(agents);
    } catch (err) {
      if (ErrorService.logError) {
        ErrorService.logError(err, 'loadFeaturedAgents');
      }
    }
  }, [fetchFeaturedAgents]);

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
