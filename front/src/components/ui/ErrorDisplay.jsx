// front/src/components/ui/ErrorDisplay.jsx
import React from 'react';
import { AlertCircle, RefreshCw, Home, ArrowLeft } from 'lucide-react';

const ErrorDisplay = ({ 
  error, 
  onRetry, 
  onGoHome, 
  onGoBack, 
  showTechnical = false,
  className = ""
}) => {
  if (!error) return null;
  
  const getErrorIcon = (type) => {
    switch (type) {
      case 'CONNECTION_ERROR':
        return <RefreshCw className="text-orange-500" size={48} />;
      case 'AUTH_ERROR':
        return <AlertCircle className="text-red-500" size={48} />;
      default:
        return <AlertCircle className="text-red-500" size={48} />;
    }
  };
  
  const getErrorColor = (type) => {
    switch (type) {
      case 'CONNECTION_ERROR':
        return 'border-orange-200 bg-orange-50';
      case 'AUTH_ERROR':
        return 'border-red-200 bg-red-50';
      case 'TIMEOUT_ERROR':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };
  
  return (
    <div className={`rounded-lg border p-6 text-center ${getErrorColor(error.type)} ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        {getErrorIcon(error.type)}
        
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Oops! Algo salió mal
          </h3>
          <p className="text-gray-600 mt-2">
            {error.message}
          </p>
          
          {showTechnical && error.technical && (
            <details className="mt-3">
              <summary className="text-sm text-gray-500 cursor-pointer">
                Detalles técnicos
              </summary>
              <pre className="text-xs text-gray-400 mt-2 p-2 bg-gray-100 rounded overflow-auto">
                {error.technical}
              </pre>
            </details>
          )}
        </div>
        
        <div className="flex space-x-3">
          {onRetry && error.action === 'Reintentar' && (
            <button
              onClick={onRetry}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw size={16} />
              <span>Reintentar</span>
            </button>
          )}
          
          {onGoBack && (
            <button
              onClick={onGoBack}
              className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Volver</span>
            </button>
          )}
          
          {onGoHome && (
            <button
              onClick={onGoHome}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Home size={16} />
              <span>Inicio</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;