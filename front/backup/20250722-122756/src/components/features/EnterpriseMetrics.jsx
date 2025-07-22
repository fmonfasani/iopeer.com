import React from 'react';
import { Activity, TrendingUp, Database, Wifi } from 'lucide-react';

const EnterpriseMetrics = ({ analytics, wsStatus, realTimeData }) => {
  const formatDuration = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Session Duration */}
      <div className="bg-white p-4 rounded-lg border card">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-700">Sesión Activa</h3>
          <Activity className="text-blue-500" size={20} />
        </div>
        <div className="text-2xl font-bold text-blue-600">
          {formatDuration(analytics.sessionDuration || 0)}
        </div>
        <div className="text-sm text-gray-500">Duración</div>
      </div>

      {/* Events Tracked */}
      <div className="bg-white p-4 rounded-lg border card">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-700">Eventos</h3>
          <TrendingUp className="text-green-500" size={20} />
        </div>
        <div className="text-2xl font-bold text-green-600">
          {analytics.totalEvents || 0}
        </div>
        <div className="text-sm text-gray-500">Rastreados</div>
      </div>

      {/* WebSocket Status */}
      <div className="bg-white p-4 rounded-lg border card">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-700">WebSocket</h3>
          <Wifi className={wsStatus === 'connected' ? 'text-green-500' : 'text-gray-400'} size={20} />
        </div>
        <div className={`text-2xl font-bold ${
          wsStatus === 'connected' ? 'text-green-600' : 'text-gray-500'
        }`}>
          {wsStatus === 'connected' ? '✓' : '⚠'}
        </div>
        <div className="text-sm text-gray-500 capitalize">{wsStatus}</div>
      </div>

      {/* Real-time Updates */}
      <div className="bg-white p-4 rounded-lg border card">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-700">Tiempo Real</h3>
          <Database className="text-purple-500" size={20} />
        </div>
        <div className="text-2xl font-bold text-purple-600">
          {Object.keys(realTimeData).length}
        </div>
        <div className="text-sm text-gray-500">Canales</div>
      </div>
    </div>
  );
};

export default EnterpriseMetrics;
