// src/hooks/useLanding.js
import { useState, useEffect, useCallback } from 'react';
import { marketplaceService } from '../services/marketplace.service';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const useLanding = () => {
  const [featuredAgents, setFeaturedAgents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // Cargar datos iniciales
  useEffect(() => {
    loadLandingData();
  }, []);

  const loadLandingData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [agents, marketplaceStats] = await Promise.all([
        marketplaceService.getFeaturedAgents(),
        marketplaceService.getMarketplaceStats()
      ]);

      setFeaturedAgents(agents);
      setStats(marketplaceStats);
    } catch (err) {
      setError(err.message);
      console.error('Error loading landing data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Manejar instalación de agente
  const handleInstallAgent = useCallback(async (agent) => {
    if (!isLoggedIn) {
      // Redirigir a login si no está autenticado
      navigate('/login');
      return;
    }

    try {
      const result = await marketplaceService.installAgent(agent);
      
      if (result.success) {
        // Mostrar notificación de éxito
        console.log('✅ Agente instalado:', agent.name);
        
        // Opcional: actualizar estado local
        setFeaturedAgents(prev => 
          prev.map(a => 
            a.id === agent.id 
              ? { ...a, isInstalled: true }
              : a
          )
        );
        
        return { success: true, message: result.message };
      } else {
        throw new Error(result.message || 'Error instalando agente');
      }
    } catch (error) {
      console.error('Error installing agent:', error);
      return { success: false, error: error.message };
    }
  }, [isLoggedIn, navigate]);

  // Manejar botón "Comenzar Gratis"
  const handleGetStarted = useCallback(() => {
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  // Manejar botón "Ver Demo"
  const handleWatchDemo = useCallback(() => {
    // Aquí podrías abrir un modal con video o navegar a una página de demo
    console.log('Showing demo...');
    // navigate('/demo');
  }, []);

  // Manejar "Explorar Marketplace"
  const handleExploreMarketplace = useCallback(() => {
    if (isLoggedIn) {
      navigate('/marketplace');
    } else {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  // Obtener estado de conexión del backend
  const checkBackendConnection = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }, []);

  return {
    // Data
    featuredAgents,
    stats,
    loading,
    error,
    
    // States
    isLoggedIn,
    
    // Actions
    handleInstallAgent,
    handleGetStarted,
    handleWatchDemo,
    handleExploreMarketplace,
    loadLandingData,
    checkBackendConnection,
    
    // Utils
    reload: loadLandingData
  };
};