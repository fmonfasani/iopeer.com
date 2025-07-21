import React from 'react';
import { AlertTriangle, CheckCircle, Loader, RefreshCw } from 'lucide-react';

const ConnectionStatus = ({ status, error, health, onReconnect }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          icon: <CheckCircle className="w-5 h-5 text-emerald-400" />,
          title: 'Conectado a AgentHub',
          description: 'Todos los sistemas funcionando correctamente',
          bgColor: 'bg-emerald-500/10',
          borderColor: 'border-emerald-500/20'
        };
      case 'connecting':
        return {
          icon: <Loader className="w-5 h-5 text-blue-400 animate-spin" />,
          title: 'Conectando...',
          description: 'Estableciendo conexión con el servidor',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/20'
        };
      case 'failed':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-red-400" />,
          title: 'Error de Conexión',
          description: error || 'No se pudo conectar con el servidor',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/20'
        };
      default:
        return {
          icon: <AlertTriangle className="w-5 h-5 text-slate-400" />,
          title: 'Desconectado',
          description: 'No hay conexión con el servidor',
          bgColor: 'bg-slate-500/10',
          borderColor: 'border-slate-500/20'
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className={`rounded-xl border p-6 ${statusConfig.bgColor} ${statusConfig.borderColor}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {statusConfig.icon}
          <div>
            <h3 className="font-semibold text-white">{statusConfig.title}</h3>
            <p className="text-sm text-slate-400">{statusConfig.description}</p>
          </div>
        </div>

        {status !== 'connected' && status !== 'connecting' && (
          <button
            onClick={onReconnect}
            className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <RefreshCw size={16} />
            <span>Reconectar</span>
          </button>
        )}
      </div>

      {health && status === 'connected' && (
        <div className="mt-4 pt-4 border-t border-slate-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-slate-400">Estado</div>
              <div className="text-emerald-400 font-medium">{health.status}</div>
            </div>
            <div>
              <div className="text-slate-400">Agentes</div>
              <div className="text-white font-medium">{health.stats?.agents || 0}</div>
            </div>
            <div>
              <div className="text-slate-400">Workflows</div>
              <div className="text-white font-medium">{health.stats?.workflows || 0}</div>
            </div>
            <div>
              <div className="text-slate-400">Ejecuciones</div>
              <div className="text-white font-medium">{health.stats?.total_executions || 0}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionStatus;
