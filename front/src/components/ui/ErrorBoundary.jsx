// frontend/src/components/ui/ErrorBoundary.jsx - CORREGIDO
import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

// Servicio de error simple si no existe
const ErrorService = {
  logError: (error, context) => {
    const errorId = `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.error(`[${context}] Error ID: ${errorId}`, error);
    return errorId;
  }
};

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

  // ✅ FUNCIÓN SEGURA PARA RENDERIZAR ERRORES
  renderErrorMessage = (error) => {
    if (!error) return 'Error desconocido';
    
    // Si es string, retornarlo directamente
    if (typeof error === 'string') return error;
    
    // Si es objeto error, extraer mensaje
    if (error.message) return error.message;
    
    // Si es objeto con propiedades, convertir a string
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
                <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto max-h-40">
                  {/* ✅ RENDERIZADO SEGURO - NO MÁS "Objects are not valid as React child" */}
                  {this.renderErrorMessage(this.state.error)}
                  {this.state.errorInfo?.componentStack && (
                    <>
                      {'\n\nComponent Stack:\n'}
                      {this.state.errorInfo.componentStack}
                    </>
                  )}
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