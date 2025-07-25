// ============================================
// front/src/components/ui/ErrorBoundary.jsx (Mejorado)
// Error boundary mejorado con más contexto
// ============================================

import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import ErrorService from '../../services/errorService';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    return { 
      hasError: true, 
      error 
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log del error
    const errorId = ErrorService.logError(error, 'ErrorBoundary');
    
    this.setState({
      errorInfo,
      errorId
    });
    
    // En producción, reportar a servicio externo
    if (process.env.NODE_ENV === 'production') {
      // reportErrorToService(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null 
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <AlertTriangle className="mx-auto text-red-500 mb-4" size={64} />
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              ¡Ups! Algo se rompió
            </h1>
            
            <p className="text-gray-600 mb-4">
              Ha ocurrido un error inesperado en la aplicación. 
              Nuestro equipo técnico ha sido notificado automáticamente.
            </p>
            
            {this.state.errorId && (
              <p className="text-xs text-gray-400 mb-4">
                ID de Error: {this.state.errorId}
              </p>
            )}
            
            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw size={16} />
                Reintentar
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="w-full flex items-center justify-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Home size={16} />
                Ir al Inicio
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-500">
                  Detalles técnicos (Solo en desarrollo)
                </summary>
                <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">
                  {this.state.error.toString()}
                  {'\n\n'}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;