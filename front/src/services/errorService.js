// ============================================
// front/src/services/errorService.js
// Servicio centralizado para manejo de errores
// ============================================

class ErrorService {
  static handleApiError(error, context = '') {
    if (process.env.NODE_ENV !== 'production') {
      console.error(`[${context}] API Error:`, error);
    }
    
    // Determinar tipo de error
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return {
        type: 'CONNECTION_ERROR',
        message: 'No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose.',
        action: 'Reintentar',
        technical: error.message
      };
    }
    
    if (error.message.includes('timeout')) {
      return {
        type: 'TIMEOUT_ERROR', 
        message: 'La solicitud tardó demasiado. Intenta nuevamente.',
        action: 'Reintentar',
        technical: error.message
      };
    }
    
    if (error.message.includes('401')) {
      return {
        type: 'AUTH_ERROR',
        message: 'Tu sesión ha expirado. Inicia sesión nuevamente.',
        action: 'Ir a Login',
        technical: error.message
      };
    }
    
    if (error.message.includes('404')) {
      return {
        type: 'NOT_FOUND_ERROR',
        message: 'El recurso solicitado no fue encontrado.',
        action: 'Volver',
        technical: error.message
      };
    }
    
    if (error.message.includes('500')) {
      return {
        type: 'SERVER_ERROR',
        message: 'Error interno del servidor. El equipo técnico ha sido notificado.',
        action: 'Reportar',
        technical: error.message
      };
    }
    
    // Error genérico
    return {
      type: 'UNKNOWN_ERROR',
      message: 'Ocurrió un error inesperado. Intenta nuevamente.',
      action: 'Reintentar',
      technical: error.message
    };
  }
  
  static logError(error, context, userId = null) {
    const errorLog = {
      timestamp: new Date().toISOString(),
      context,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      userId,
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    // En producción, enviar a servicio de logging
    if (process.env.NODE_ENV === 'production') {
      // sendToLoggingService(errorLog);
    } else {
      // Solo mostrar en consola en desarrollo
      console.error('Error Log:', errorLog);
    }
    return errorLog;
  }
}

export default ErrorService;

