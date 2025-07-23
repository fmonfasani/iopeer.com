import React from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, Activity, ArrowRight } from 'lucide-react';
import { useIopeer } from '../hooks/useIopeer';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Home = () => {
  const { connectionStatus, agents, systemHealth, loading, error, connect } = useIopeer();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Dashboard
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Plataforma de agentes IA para automatizar y potenciar tu desarrollo
        </p>
      </div>

      {/* Connection Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Estado de Conexión</h3>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-500' :
                connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' :
                'bg-red-500'
              }`}></div>
              <span className="text-sm font-medium capitalize">
                {connectionStatus === 'connected' ? 'Conectado' :
                 connectionStatus === 'connecting' ? 'Conectando...' :
                 'Desconectado'}
              </span>
            </div>
            {error && (
              <p className="text-sm text-red-600 mt-1">Error: {error}</p>
            )}
          </div>
          
          {loading && <LoadingSpinner />}
          
          {connectionStatus !== 'connected' && !loading && (
            <button
              onClick={connect}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reconectar
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      {connectionStatus === 'connected' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Agentes Activos</p>
                <p className="text-2xl font-bold text-blue-600">{agents.length}</p>
              </div>
              <Users className="text-blue-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Estado Sistema</p>
                <p className="text-2xl font-bold text-green-600">
                  {systemHealth?.status === 'healthy' ? 'Saludable' : 'Verificando'}
                </p>
              </div>
              <Activity className="text-green-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Marketplace</p>
                <p className="text-2xl font-bold text-purple-600">150+</p>
              </div>
              <BookOpen className="text-purple-500" size={32} />
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/agents"
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Users className="text-blue-500" size={24} />
              <div>
                <h4 className="font-medium text-gray-900">Gestionar Agentes</h4>
                <p className="text-sm text-gray-600">Ver y configurar tus agentes IA</p>
              </div>
            </div>
            <ArrowRight className="text-gray-400 group-hover:text-blue-500" size={20} />
          </Link>

          <Link
            to="/marketplace"
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="text-purple-500" size={24} />
              <div>
                <h4 className="font-medium text-gray-900">Explorar Marketplace</h4>
                <p className="text-sm text-gray-600">Descubre nuevos agentes de la comunidad</p>
              </div>
            </div>
            <ArrowRight className="text-gray-400 group-hover:text-purple-500" size={20} />
          </Link>
        </div>
      </div>

      {/* System Info */}
      {systemHealth && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Sistema</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Estado:</strong> {systemHealth.status}
            </div>
            <div>
              <strong>Versión:</strong> {systemHealth.version || 'N/A'}
            </div>
            {systemHealth.stats && (
              <>
                <div>
                  <strong>Agentes Registrados:</strong> {systemHealth.stats.agents || 0}
                </div>
                <div>
                  <strong>Workflows:</strong> {systemHealth.stats.workflows || 0}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
