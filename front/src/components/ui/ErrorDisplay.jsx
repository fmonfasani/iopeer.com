// frontend/src/components/ui/ErrorDisplay.jsx - CORREGIDO
import React from 'react';
import { AlertTriangle, RefreshCw, Home, Wifi, WifiOff } from 'lucide-react';

const ErrorDisplay = ({ 
  error, 
  onRetry, 
  onGoHome, 
  showTechnical = false,
  className = ""
}) => {
  // ✅ FUNCIÓN SEGURA PARA RENDERIZAR ERRORES
  const renderErrorMessage = (error) => {
    if (!error) return 'Error desconocido';
    
    // Si es string, retornarlo directamente  
    if (typeof error === 'string') return error;
    
    // Si es objeto con mensaje
    if (error.message) return error.message;
    
    // Si es objeto estructurado de nuestro sistema
    if (error.type && error.message) {
      return error.message;
    }
    
    // Si es objeto, convertir a string de forma segura
    if (typeof error === 'object') {
      try {
        return JSON.stringify(error, null, 2);
      } catch {
        return 'Error complejo no serializable';
      }
    }
    
    // Fallback
    return String(error);
  };

  const getErrorIcon = (error) => {
    if (typeof error === 'object' && error.type) {
      switch (error.type) {
        case 'CONNECTION_ERROR':
          return <WifiOff className="text-red-500" size={48} />;
        case 'TIMEOUT_ERROR':
          return <Wifi className="text-orange-500" size={48} />;
        default:
          return <AlertTriangle className="text-red-500" size={48} />;
      }
    }
    return <AlertTriangle className="text-red-500" size={48} />;
  };

  const getErrorTitle = (error) => {
    if (typeof error === 'object' && error.type) {
      switch (error.type) {
        case 'CONNECTION_ERROR':
          return 'Error de Conexión';
        case 'TIMEOUT_ERROR':
          return 'Tiempo de Espera Agotado';
        default:
          return 'Error del Sistema';
      }
    }
    return 'Ha ocurrido un error';
  };

  const getRetryButtonText = (error) => {
    if (typeof error === 'object' && error.action) {
      return error.action;
    }
    return 'Reintentar';
  };

  return (
    <div className={`bg-white border border-red-200 rounded-lg p-6 text-center ${className}`}>
      <div className="mb-4">
        {getErrorIcon(error)}
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {getErrorTitle(error)}
      </h3>
      
      <p className="text-gray-600 mb-4">
        {/* ✅ RENDERIZADO SEGURO - NO MÁS "Objects are not valid as React child" */}
        {renderErrorMessage(error)}
      </p>
      
      <div className="space-y-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw size={16} />
            {getRetryButtonText(error)}
          </button>
        )}
        
        {onGoHome && (
          <button
            onClick={onGoHome}
            className="w-full flex items-center justify-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Home size={16} />
            Ir al Dashboard
          </button>
        )}
      </div>
      
      {showTechnical && error && typeof error === 'object' && error.technical && (
        <details className="mt-4 text-left">
          <summary className="cursor-pointer text-sm text-gray-500">
            Detalles técnicos
          </summary>
          <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto max-h-32">
            {/* ✅ RENDERIZADO SEGURO */}
            {error.technical}
          </pre>
        </details>
      )}
    </div>
  );
};

export default ErrorDisplay;
