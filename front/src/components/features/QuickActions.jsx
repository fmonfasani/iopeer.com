import React from 'react';
import { 
  ExternalLink, FileText, Activity, HelpCircle, 
  Zap, Database, Code, Settings 
} from 'lucide-react';

const QuickActions = ({ connectionStatus, onNotification }) => {
  const actions = [
    {
      id: 'api-docs',
      label: 'API Docs',
      description: 'Documentación completa de la API',
      icon: <FileText size={20} />,
      color: 'from-blue-500 to-blue-600',
      action: () => {
        window.open('http://localhost:8000/docs', '_blank');
        onNotification?.('info', '📚 Abriendo documentación de la API');
      }
    },
    {
      id: 'health-check',
      label: 'Health Check',
      description: 'Verificar estado del sistema',
      icon: <Activity size={20} />,
      color: 'from-green-500 to-green-600',
      action: () => {
        window.open('http://localhost:8000/health', '_blank');
        onNotification?.('info', '🏥 Verificando estado del sistema');
      }
    },
    {
      id: 'admin-panel',
      label: 'Panel Admin',
      description: 'Acceso al panel de administración',
      icon: <Settings size={20} />,
      color: 'from-purple-500 to-purple-600',
      action: () => {
        onNotification?.('info', '⚙️ Accediendo al panel de administración');
      }
    },
    {
      id: 'help-center',
      label: 'Centro de Ayuda',
      description: 'Soporte y documentación',
      icon: <HelpCircle size={20} />,
      color: 'from-orange-500 to-orange-600',
      action: () => {
        onNotification?.('info', '❓ Abriendo centro de ayuda');
      }
    }
  ];

  const isConnected = connectionStatus === 'connected';

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <Zap className="w-5 h-5 text-emerald-400" />
            <span>Acciones Rápidas</span>
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Herramientas y recursos para desarrolladores
          </p>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          isConnected 
            ? 'bg-emerald-500/20 text-emerald-400' 
            : 'bg-red-500/20 text-red-400'
        }`}>
          {isConnected ? 'Sistema activo' : 'Sistema inactivo'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map(action => (
          <button
            key={action.id}
            onClick={action.action}
            disabled={!isConnected && (action.id === 'api-docs' || action.id === 'health-check')}
            className={`group relative p-4 rounded-xl border transition-all duration-300 text-left ${
              isConnected || (action.id !== 'api-docs' && action.id !== 'health-check')
                ? 'border-slate-600 hover:border-slate-500 hover:scale-105 cursor-pointer' 
                : 'border-slate-700 opacity-50 cursor-not-allowed'
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity`} />
            
            <div className="relative">
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r ${action.color} text-white mb-3`}>
                {action.icon}
              </div>
              
              <h4 className="font-medium text-white mb-1">{action.label}</h4>
              <p className="text-slate-400 text-sm">{action.description}</p>
              
              <div className="mt-2 flex items-center text-slate-500 group-hover:text-slate-400 transition-colors">
                <ExternalLink size={14} />
                <span className="ml-1 text-xs">Abrir</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {!isConnected && (
        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-yellow-400 text-sm flex items-center space-x-2">
            <Database size={16} />
            <span>Conecta con el backend para acceder a todas las funciones</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default QuickActions;
