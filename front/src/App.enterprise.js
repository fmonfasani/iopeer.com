import React, { useState } from 'react';
import './App.css';
import ErrorBoundary from './components/ui/ErrorBoundary';
import IopeerLayout from './components/layout/IopeerLayout';
import ConnectionStatus from './components/features/ConnectionStatus';
import AgentCard from './components/features/AgentCard';
import EnterpriseMetrics from './components/features/EnterpriseMetrics';
import LoadingSpinner from './components/ui/LoadingSpinner';
import { useIopeer, useAgents } from './hooks/useIopeer';
import { useEnterprise } from './hooks/useEnterprise';
import { CONNECTION_STATES } from './utils/constants';
import config from './config/enterprise';

function App() {
  const {
    connectionStatus,
    systemHealth,
    loading,
    error,
    connect,
    isConnected
  } = useIopeer();

  const {
    agents,
    selectedAgent,
    selectAgent,
    sendMessageToAgent
  } = useAgents();

  // Enterprise features
  const {
    wsStatus,
    analytics,
    realTimeData,
    trackUserAction,
    isEnterpriseMode
  } = useEnterprise();

  const [notifications, setNotifications] = useState([]);

  const handleSendMessage = async (agentId, action, data) => {
    try {
      trackUserAction('agent_message_sent', { agentId, action });

      const result = await sendMessageToAgent(agentId, action, data);

      setNotifications(prev => [...prev, {
        id: Date.now(),
        type: 'success',
        message: `Mensaje enviado a ${agentId}: ${result.status}`
      }]);

      console.log('Message result:', result);
    } catch (error) {
      setNotifications(prev => [...prev, {
        id: Date.now(),
        type: 'error',
        message: `Error enviando mensaje: ${error.message}`
      }]);

      console.error('Message error:', error);
    }
  };

  const handleSearch = (query) => {
    trackUserAction('search_performed', { query });
    console.log('Search query:', query);
  };

  return (
    <ErrorBoundary>
      <div className="App">
        <IopeerLayout
          title={isEnterpriseMode ? "Iopeer Enterprise" : "Iopeer Dashboard"}
          onSearch={handleSearch}
          notifications={notifications}
        >
          <div className="space-y-6">
            {/* Enterprise Badge */}
            {isEnterpriseMode && (
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">E</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Modo Enterprise Activo</h3>
                    <p className="text-sm text-blue-100">
                      WebSocket: {wsStatus} • Analytics: {analytics.totalEvents || 0} eventos
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Enterprise Metrics */}
            {isEnterpriseMode && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Métricas Enterprise</h2>
                <EnterpriseMetrics
                  analytics={analytics}
                  wsStatus={wsStatus}
                  realTimeData={realTimeData}
                />
              </div>
            )}

            {/* Connection Status */}
            <ConnectionStatus
              status={connectionStatus}
              error={error}
              health={systemHealth}
              onReconnect={connect}
            />

            {/* Loading State */}
            {loading && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-center space-x-3">
                  <LoadingSpinner />
                  <span className="text-gray-600">Cargando datos de Iopeer...</span>
                </div>
              </div>
            )}

            {/* Agents Section */}
            {isConnected && !loading && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Agentes Disponibles ({agents.length})
                  </h2>
                  {agents.length > 0 && (
                    <div className="text-sm text-gray-500">
                      {selectedAgent ? `Seleccionado: ${selectedAgent.name}` : 'Selecciona un agente'}
                    </div>
                  )}
                </div>

                {agents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {agents.map((agent) => (
                      <AgentCard
                        key={agent.agent_id}
                        agent={agent}
                        isSelected={selectedAgent?.agent_id === agent.agent_id}
                        onSelect={(agent) => {
                          selectAgent(agent);
                          trackUserAction('agent_selected', { agentId: agent.agent_id });
                        }}
                        onSendMessage={handleSendMessage}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay agentes disponibles</h3>
                    <p className="text-gray-500">
                      Los agentes aparecerán aquí una vez que el backend esté configurado correctamente.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Quick Actions */}
            {isConnected && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Acciones Rápidas</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => {
                      trackUserAction('docs_opened');
                      window.open('http://localhost:8000/docs', '_blank');
                    }}
                    className="btn btn-primary"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Ver API Docs</span>
                  </button>

                  <button
                    onClick={() => {
                      trackUserAction('health_checked');
                      window.open('http://localhost:8000/health', '_blank');
                    }}
                    className="btn btn-success"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Health Check</span>
                  </button>

                  <button
                    onClick={() => {
                      trackUserAction('connection_refreshed');
                      connect();
                    }}
                    className="btn btn-purple"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Refrescar Conexión</span>
                  </button>
                </div>
              </div>
            )}

            {/* Welcome Message */}
            {!isConnected && !loading && (
              <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">io</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Bienvenido a Iopeer {isEnterpriseMode ? 'Enterprise' : ''}
                </h2>
                <p className="text-gray-600 mb-6">
                  Plataforma de agentes IA para automatizar tu desarrollo
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      trackUserAction('connection_attempted');
                      connect();
                    }}
                    disabled={connectionStatus === CONNECTION_STATES.CONNECTING}
                    className="btn btn-primary"
                  >
                    {connectionStatus === CONNECTION_STATES.CONNECTING ? 'Conectando...' : 'Conectar a Iopeer'}
                  </button>
                  <p className="text-sm text-gray-500">
                    Asegúrate de que el backend esté ejecutándose en http://localhost:8000
                  </p>
                </div>
              </div>
            )}
          </div>
        </IopeerLayout>
      </div>
    </ErrorBoundary>
  );
}

export default App;
