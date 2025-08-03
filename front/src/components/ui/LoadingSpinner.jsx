// front/src/components/ui/LoadingSpinner.jsx (Corregido)
import React, { useState, useEffect, useCallback } from 'react';

const LoadingSpinner = ({ 
  size = 'md', 
  className = '', 
  color = 'blue',
  text = null,
  fullScreen = false,
  overlay = false 
}) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
    '2xl': 'w-16 h-16'
  };

  const colorClasses = {
    blue: 'border-blue-200 border-t-blue-600',
    green: 'border-green-200 border-t-green-600',
    red: 'border-red-200 border-t-red-600',
    gray: 'border-gray-200 border-t-gray-600',
    white: 'border-white/30 border-t-white'
  };

  const spinner = (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className={`animate-spin rounded-full border-2 ${colorClasses[color]}`}></div>
    </div>
  );

  const content = (
    <div className={`flex flex-col items-center justify-center ${text ? 'space-y-3' : ''}`}>
      {spinner}
      {text && (
        <p className="text-sm text-gray-600 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        {content}
      </div>
    );
  }

  if (overlay) {
    return (
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
};

// Componentes especializados de loading
export const PageLoader = ({ message = "Cargando..." }) => (
  <LoadingSpinner 
    size="xl" 
    fullScreen 
    text={message} 
    color="blue"
  />
);

export const ComponentLoader = ({ message = null, overlay = true }) => (
  <LoadingSpinner 
    size="lg" 
    overlay={overlay}
    text={message}
    color="blue"
  />
);

export const ButtonLoader = () => (
  <LoadingSpinner 
    size="sm" 
    color="white"
  />
);

export const InlineLoader = ({ message = "Cargando..." }) => (
  <div className="flex items-center space-x-2 text-gray-600">
    <LoadingSpinner size="sm" color="gray" />
    <span className="text-sm">{message}</span>
  </div>
);

// Estados de loading específicos para diferentes contextos
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

// Hook para estados de loading
export const useLoading = (initialState = false) => {
  const [loading, setLoading] = useState(initialState);
  const [error, setError] = useState(null);

  const startLoading = useCallback(() => {
    setLoading(true);
    setError(null);
  }, []);

  const stopLoading = useCallback(() => {
    setLoading(false);
  }, []);

  const setLoadingError = useCallback((err) => {
    setLoading(false);
    setError(err);
  }, []);

  const withLoading = useCallback(async (asyncFunction) => {
    startLoading();
    try {
      const result = await asyncFunction();
      stopLoading();
      return result;
    } catch (err) {
      setLoadingError(err);
      throw err;
    }
  }, [startLoading, stopLoading, setLoadingError]);

  return {
    loading,
    error,
    startLoading,
    stopLoading,
    setLoadingError,
    withLoading
  };
};

// Hook para loading inteligente
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

export default LoadingSpinner;
