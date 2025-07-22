import { useState, useEffect, useCallback } from 'react';
import { analyticsService } from '../services/analytics';
import { MARKETPLACE_AGENTS, searchAgents } from '../data/agentCategories';

export const useMarketplace = () => {
  const [installedAgents, setInstalledAgents] = useState([]);
  const [favoriteAgents, setFavoriteAgents] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load user data from localStorage
  useEffect(() => {
    const stored = {
      installed: JSON.parse(localStorage.getItem('iopeer-installed-agents') || '[]'),
      favorites: JSON.parse(localStorage.getItem('iopeer-favorite-agents') || '[]'),
      recentlyViewed: JSON.parse(localStorage.getItem('iopeer-recently-viewed') || '[]')
    };
    
    setInstalledAgents(stored.installed);
    setFavoriteAgents(stored.favorites);
    setRecentlyViewed(stored.recentlyViewed);
  }, []);

  // Install agent
  const installAgent = useCallback(async (agentId) => {
    setLoading(true);
    
    try {
      // Simulate installation process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const agent = MARKETPLACE_AGENTS.find(a => a.id === agentId);
      if (!agent) throw new Error('Agent not found');
      
      // Add to installed agents
      const newInstalled = [...installedAgents, agentId];
      setInstalledAgents(newInstalled);
      localStorage.setItem('iopeer-installed-agents', JSON.stringify(newInstalled));
      
      // Track installation
      if (analyticsService && analyticsService.trackUserAction) {
        analyticsService.trackUserAction('agent_installed', {
          agentId,
          agentName: agent.name,
          agentCategory: agent.category,
          isPremium: agent.premium
        });
      }
      
      return { success: true, agent };
    } catch (error) {
      console.error('Installation failed:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [installedAgents]);

  // Get agent details with user context
  const getAgentDetails = useCallback((agentId) => {
    const agent = MARKETPLACE_AGENTS.find(a => a.id === agentId);
    if (!agent) return null;
    
    return {
      ...agent,
      isInstalled: installedAgents.includes(agentId),
      isFavorite: favoriteAgents.includes(agentId),
      isRecentlyViewed: recentlyViewed.includes(agentId)
    };
  }, [installedAgents, favoriteAgents, recentlyViewed]);

  return {
    // State
    installedAgents,
    favoriteAgents,
    recentlyViewed,
    loading,
    
    // Actions
    installAgent,
    
    // Computed
    getAgentDetails,
    
    // Helpers
    isAgentInstalled: (agentId) => installedAgents.includes(agentId),
    isAgentFavorite: (agentId) => favoriteAgents.includes(agentId),
    
    // Stats
    stats: {
      totalInstalled: installedAgents.length,
      totalFavorites: favoriteAgents.length,
      totalViewed: recentlyViewed.length
    }
  };
};

export default useMarketplace;
