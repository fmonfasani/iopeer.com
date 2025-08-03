

// ============================================
// front/src/components/ui/LoadingStates.jsx
// Estados de loading específicos para diferentes contextos
// ============================================

import React from 'react';
import { Users, Database, Zap, Settings } from 'lucide-react';

export const AgentsLoadingState = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold text-gray-900">Mis Agentes</h1>
      <div className="w-32 h-10 bg-gray-200 animate-pulse rounded"></div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="p-6 border rounded-lg bg-gray-50 animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="w-32 h-6 bg-gray-200 rounded"></div>
            <div className="w-16 h-4 bg-gray-200 rounded"></div>
          </div>
          <div className="w-full h-4 bg-gray-200 rounded mb-2"></div>
          <div className="w-3/4 h-4 bg-gray-200 rounded mb-4"></div>
          <div className="flex justify-between">
            <div className="w-20 h-4 bg-gray-200 rounded"></div>
            <div className="w-24 h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const DashboardLoadingState = () => (
  <div className="space-y-8">
    <div className="text-center">
      <div className="w-48 h-10 bg-gray-200 animate-pulse rounded mx-auto mb-4"></div>
      <div className="w-96 h-6 bg-gray-200 animate-pulse rounded mx-auto"></div>
    </div>

    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="w-32 h-6 bg-gray-200 animate-pulse rounded mb-2"></div>
          <div className="w-24 h-4 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-full"></div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="w-20 h-4 bg-gray-200 animate-pulse rounded mb-2"></div>
              <div className="w-16 h-8 bg-gray-200 animate-pulse rounded"></div>
            </div>
            <div className="w-8 h-8 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
      ))}
    </div>

    <div className="bg-white rounded-lg shadow p-6">
      <div className="w-32 h-6 bg-gray-200 animate-pulse rounded mb-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="p-4 border border-gray-200 rounded-lg">
            <div className="w-full h-4 bg-gray-200 animate-pulse rounded mb-2"></div>
            <div className="w-3/4 h-4 bg-gray-200 animate-pulse rounded"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const MarketplaceLoadingState = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div className="w-32 h-8 bg-gray-200 animate-pulse rounded"></div>
      <div className="w-48 h-10 bg-gray-200 animate-pulse rounded"></div>
    </div>

    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6">
      <div className="w-48 h-6 bg-white/20 animate-pulse rounded mb-2"></div>
      <div className="w-96 h-4 bg-white/20 animate-pulse rounded"></div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 animate-pulse rounded"></div>
              <div>
                <div className="w-24 h-5 bg-gray-200 animate-pulse rounded mb-1"></div>
                <div className="w-20 h-3 bg-gray-200 animate-pulse rounded"></div>
              </div>
            </div>
          </div>
          <div className="w-full h-4 bg-gray-200 animate-pulse rounded mb-4"></div>
          <div className="flex flex-wrap gap-1 mb-4">
            {[1, 2, 3].map((j) => (
              <div key={j} className="w-12 h-5 bg-gray-200 animate-pulse rounded-full"></div>
            ))}
          </div>
          <div className="w-full h-10 bg-gray-200 animate-pulse rounded"></div>
        </div>
      ))}
    </div>
  </div>
);

// ============================================
// Hook para loading inteligente
// ============================================

export const useSmartLoading = (loadingTime = 500) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    let timer;
    
    if (isLoading) {
      // Solo mostrar loading si toma más tiempo del esperado
      timer = setTimeout(() => {
        setShowLoading(true);
      }, loadingTime);
    } else {
      setShowLoading(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isLoading, loadingTime]);

  return {
    isLoading,
    showLoading,
    startLoading: () => setIsLoading(true),
    stopLoading: () => setIsLoading(false)
  };
};
