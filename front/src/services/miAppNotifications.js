// front/src/services/miAppNotifications.js
import toast from 'react-hot-toast';

class MiAppNotificationService {
  // Notificaciones de proyecto
  projectCreated(projectName) {
    toast.success(`🎉 Proyecto "${projectName}" creado exitosamente`, {
      duration: 4000,
      icon: '🚀',
    });
  }

  projectBuilding(projectName) {
    toast.loading(`⚙️ Construyendo "${projectName}"...`, {
      id: `building-${projectName}`,
      duration: 0, // No auto-dismiss
    });
  }

  projectBuildComplete(projectName) {
    toast.dismiss(`building-${projectName}`);
    toast.success(`✅ "${projectName}" listo para desplegar`, {
      duration: 4000,
    });
  }

  projectBuildFailed(projectName, error) {
    toast.dismiss(`building-${projectName}`);
    toast.error(`❌ Error construyendo "${projectName}": ${error}`, {
      duration: 6000,
    });
  }

  projectDeploying(projectName) {
    toast.loading(`🚀 Desplegando "${projectName}"...`, {
      id: `deploying-${projectName}`,
      duration: 0,
    });
  }

  projectDeployed(projectName, url) {
    toast.dismiss(`deploying-${projectName}`);
    toast.success(
      (t) => (
        <div>
          <div className="font-medium">🎉 "{projectName}" desplegado!</div>
          <button
            onClick={() => {
              window.open(url, '_blank');
              toast.dismiss(t.id);
            }}
            className="mt-2 text-blue-600 hover:text-blue-800 text-sm underline"
          >
            Ver aplicación →
          </button>
        </div>
      ),
      { duration: 8000 }
    );
  }

  projectDeployFailed(projectName, error) {
    toast.dismiss(`deploying-${projectName}`);
    toast.error(`❌ Error desplegando "${projectName}": ${error}`, {
      duration: 6000,
    });
  }

  codeDownloaded(projectName) {
    toast.success(`📥 Código de "${projectName}" descargado`, {
      duration: 3000,
      icon: '💾',
    });
  }

  projectDeleted(projectName) {
    toast.success(`🗑️ Proyecto "${projectName}" eliminado`, {
      duration: 3000,
    });
  }

  projectUpdated(projectName) {
    toast.success(`📝 Proyecto "${projectName}" actualizado`, {
      duration: 3000,
    });
  }

  // Notificaciones de template
  templateUsed(templateName) {
    toast.success(`📋 Usando template "${templateName}"`, {
      duration: 3000,
      icon: '⚡',
    });
  }

  // Notificaciones de error genérico
  genericError(message) {
    toast.error(`❌ ${message}`, {
      duration: 5000,
    });
  }

  // Notificaciones de conexión
  backendConnected() {
    toast.success('🔌 Conectado al backend', {
      duration: 2000,
    });
  }

  backendDisconnected() {
    toast.error('🔌 Desconectado del backend', {
      duration: 4000,
    });
  }

  // Notificaciones de límites (para versiones futuras)
  limitReached(limitType, limit) {
    toast.error(`⚠️ Límite alcanzado: ${limitType} (${limit})`, {
      duration: 6000,
    });
  }

  // Notificación de ayuda/tips
  showTip(message) {
    toast(`💡 Tip: ${message}`, {
      duration: 5000,
      icon: '💡',
    });
  }

  // Notificaciones de agentes
  agentsWorking(agentCount) {
    toast.loading(`🤖 ${agentCount} agentes trabajando...`, {
      id: 'agents-working',
      duration: 0,
    });
  }

  agentsCompleted(agentCount, results) {
    toast.dismiss('agents-working');
    toast.success(`✅ ${agentCount} agentes completaron el trabajo`, {
      duration: 4000,
    });
  }

  // Notificación personalizada con acción
  customActionNotification(message, actionText, actionCallback) {
    toast(
      (t) => (
        <div>
          <div className="font-medium">{message}</div>
          <button
            onClick={() => {
              actionCallback();
              toast.dismiss(t.id);
            }}
            className="mt-2 text-blue-600 hover:text-blue-800 text-sm underline"
          >
            {actionText}
          </button>
        </div>
      ),
      { duration: 6000 }
    );
  }

  // Notificación de progreso con barra
  progressNotification(message, progress) {
    toast.custom(
      (t) => (
        <div className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {message}
                </p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{progress}% completado</p>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        id: 'progress-notification',
        duration: progress >= 100 ? 2000 : Infinity,
      }
    );
  }
}

// Crear instancia singleton
export const miAppNotifications = new MiAppNotificationService();

// Export por defecto
export default miAppNotifications;
