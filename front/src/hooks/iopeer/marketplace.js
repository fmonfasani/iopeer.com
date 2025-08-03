import { useState, useCallback, useEffect } from 'react';
import { API_BASE_URL } from './api';

export const useMarketplace = () => {
  const [featuredAgents, setFeaturedAgents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMarketplaceData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/marketplace/featured`);
        if (response.ok) {
          const result = await response.json();
          const agents = result.agents || [];
          setFeaturedAgents(agents);
          const uniqueCategories = [
            ...new Set(agents.map((agent) => agent.category || 'general')),
          ];
          setCategories(uniqueCategories);
          return;
        }
      } catch {
        console.warn('Marketplace endpoint not available, falling back to agents list');
      }
      const response = await fetch(`${API_BASE_URL}/agents`);
      if (!response.ok) {
        throw new Error(`Failed to fetch marketplace data: ${response.status}`);
      }
      const result = await response.json();
      const agents = result.agents || [];
      setFeaturedAgents(agents);
      const uniqueCategories = [
        ...new Set(agents.map((agent) => agent.type || 'general')),
      ];
      setCategories(uniqueCategories);
    } catch (err) {
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarketplaceData();
  }, [fetchMarketplaceData]);

  const installAgent = useCallback(async (agentId) => {
    try {
      console.log(`Installing agent: ${agentId}`);
      return { success: true, message: 'Agent installed successfully' };
    } catch (err) {
      throw err;
    }
  }, []);

  const searchAgents = useCallback(
    async (query) => {
      if (!query) return featuredAgents;
      return featuredAgents.filter(
        (agent) =>
          agent.name.toLowerCase().includes(query.toLowerCase()) ||
          (agent.description &&
            agent.description.toLowerCase().includes(query.toLowerCase()))
      );
    },
    [featuredAgents]
  );

  return {
    featuredAgents,
    categories,
    loading,
    error,
    refresh: fetchMarketplaceData,
    reload: fetchMarketplaceData,
    installAgent,
    searchAgents,
  };
};
