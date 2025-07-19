import React from 'react';
import { Wifi, WifiOff, RefreshCw, AlertTriangle } from 'lucide-react';

const ConnectionStatus = ({ status, error, health, onReconnect }) => {
  const getStatusInfo = () => {
    switch (status) {
      case 'connected':
        return {
          icon: <Wifi className="text-green-500" size={20} />,
          text: 'Conectado a Iopeer',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      case 'connecting':
        return {
          icon: <RefreshCw className="text-yellow-500 animate-spin" size={20} />,
          text: 'Conectando...',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200'
        };
      case 'failed':
        return {
          icon: <AlertTriangle className="text-red-500" size={20} />,
          text: 'Error de conexión',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      default:
        return {
          icon: <WifiOff className="text-gray-500" size={20} />,
          text: 'Desconectado',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className={`p-4 rounded-lg border ${statusInfo.bgColor} ${statusInfo.borderColor}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {statusInfo.icon}
          <div>
            <h3 className="font-semibold text-gray-900">Estado de Conexión</h3>
            <p className={`text-sm ${statusInfo.color}`}>
              {statusInfo.text}
            </p>
            {error && (
              <p className="text-red-600 text-xs mt-1">
                Error: {error}
              </p>
            )}
          </div>
        </div>

        {status !== 'connected' && status !== 'connecting' && (
          <button
            onClick={onReconnect}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw size={16} />
            <span>Reconectar</span>
          </button>
        )}
      </div>

      {health && status === 'connected' && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="font-semibold text-blue-600">
                {health.stats?.agents || 0}
              </div>
              <div className="text-gray-500">Agentes</div>
            </div>
            <div>
              <div className="font-semibold text-green-600">
                {health.stats?.workflows || 0}
              </div>
              <div className="text-gray-500">Workflows</div>
            </div>
            <div>
              <div className="font-semibold text-purple-600">
                {health.status === 'healthy' ? '✓' : '⚠'}
              </div>
              <div className="text-gray-500">Estado</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionStatus;
