import React, { useState, useEffect } from 'react';
import './App.css';
import ErrorBoundary from './components/ui/ErrorBoundary';
import IopeerLayout from './components/layout/IopeerLayout';
import ConnectionStatus from './components/features/ConnectionStatus';
import AgentCard from './components/features/AgentCard';
import LoadingSpinner from './components/ui/LoadingSpinner';
import { useIopeer, useAgents } from './hooks/useIopeer';
import { useEnterprise } from './hooks/useEnterprise';
import { useTheme } from './hooks/useTheme';
import { CONNECTION_STATES } from './utils/constants';

// Importar servicios enterprise
import { analyticsService } from './services/analytics';
import { websocketService } from './services/websocket';

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

  // 🏢 ENTERPRISE FEATURES
  const {
    wsStatus,
    analytics,
    realTimeData,
    trackUserAction
  } = useEnterprise();

  // 🎨 THEME SYSTEM
  const { currentTheme, getThemeConfig, isDarkTheme } = useTheme();

  const [notifications, setNotifications] = useState([]);
  const [enterpriseStats, setEnterpriseStats] = useState({});

  // 🏢 Enterprise Analytics Tracking
  useEffect(() => {
    trackUserAction('app_loaded', { mode: 'enterprise', theme: currentTheme });

    // Update enterprise stats every 5 seconds
    const interval = setInterval(() => {
      setEnterpriseStats({
        sessionTime: Date.now() - (analytics.sessionDuration || 0),
        totalEvents: analytics.totalEvents || 0,
        wsConnected: wsStatus === 'connected',
        realtimeChannels: Object.keys(realTimeData).length
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [analytics, wsStatus, realTimeData, trackUserAction, currentTheme]);

  // Track theme changes
  useEffect(() => {
    const handleThemeChange = (event) => {
      trackUserAction('theme_changed', {
        newTheme: event.detail.theme,
        previousTheme: currentTheme
      });
    };

    window.addEventListener('themeChanged', handleThemeChange);
    return () => window.removeEventListener('themeChanged', handleThemeChange);
  }, [currentTheme, trackUserAction]);

  const handleSendMessage = async (agentId, action, data) => {
    try {
      trackUserAction('agent_message_sent', { agentId, action, theme: currentTheme });

      const result = await sendMessageToAgent(agentId, action, data);

      setNotifications(prev => [...prev, {
        id: Date.now(),
        type: 'success',
        message: `✅ Enterprise: Mensaje enviado a ${agentId}`
      }]);

      console.log('🏢 Enterprise Message Result:', result);
    } catch (error) {
      setNotifications(prev => [...prev, {
        id: Date.now(),
        type: 'error',
        message: `❌ Enterprise Error: ${error.message}`
      }]);
    }
  };

  const handleSearch = (query) => {
    trackUserAction('enterprise_search', {
      query,
      timestamp: new Date().toISOString(),
      theme: currentTheme
    });
    console.log('🏢 Enterprise Search:', query);
  };

  // 🏢 Enterprise Metrics Component with Theme
  const EnterpriseMetrics = () => {
    const themeConfig = getThemeConfig();

    return (
      <div className="enterprise-dashboard">
        <div className="enterprise-header">
          <div>
            <h2>🏢 Iopeer Enterprise Dashboard</h2>
            <p>Modo empresarial con tema {themeConfig.name}</p>
          </div>
          <div className="enterprise-badge">
            <div style={{fontSize: '1.125rem', fontWeight: '700'}}>Enterprise</div>
            <div style={{fontSize: '0.875rem'}}>v2.0.0</div>
          </div>
        </div>

        <div className="enterprise-metrics-grid">
          <div className="enterprise-metric-card">
            <div className="metric-label">Sesión Activa</div>
            <div className="metric-value">
              {Math.floor((enterpriseStats.sessionTime || 0) / 1000)}s
            </div>
          </div>
          <div className="enterprise-metric-card">
            <div className="metric-label">Eventos Analytics</div>
            <div className="metric-value">{enterpriseStats.totalEvents || 0}</div>
          </div>
          <div className="enterprise-metric-card">
            <div className="metric-label">WebSocket</div>
            <div className="metric-value">
              {enterpriseStats.wsConnected ? '🟢 ON' : '🔴 OFF'}
            </div>
          </div>
          <div className="enterprise-metric-card">
            <div className="metric-label">Tema Actual</div>
            <div className="metric-value" style={{fontSize: '0.875rem'}}>
              {isDarkTheme ? '🌙' : '☀️'} {themeConfig.name}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 🏢 Enterprise Notifications Component
  const EnterpriseNotifications = () => (
    notifications.length > 0 && (
      <div className="enterprise-notifications">
        <h3>🔔 Enterprise Notifications</h3>
        <div>
          {notifications.slice(-3).map(notification => (
            <div
              key={notification.id}
              className={`notification-item ${notification.type}`}
            >
              <div className="notification-message">{notification.message}</div>
              <div className="notification-time">
                {new Date().toLocaleTimeString()} • Enterprise Mode • {getThemeConfig().name}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  );

  return (
    <ErrorBoundary>
      <div className="App">
        <IopeerLayout
          title="🏢 Iopeer Enterprise Platform"
          onSearch={handleSearch}
          notifications={notifications}
        >
          <div className="space-y-6">
            {/* 🏢 ENTERPRISE METRICS DASHBOARD */}
            <EnterpriseMetrics />

            {/* 🏢 ENTERPRISE NOTIFICATIONS */}
            <EnterpriseNotifications />

            {/* 🏢 Enterprise Connection Status */}
            <div className="enterprise-layout-grid">
              <ConnectionStatus
                status={connectionStatus}
                error={error}
                health={systemHealth}
                onReconnect={connect}
              />

              {/* 🏢 WebSocket Status */}
              <div className="websocket-status">
                <h3>🌐 Enterprise WebSocket</h3>
                <div className="websocket-status-content">
                  <div className="websocket-status-info">
                    <div className={`status-text ${wsStatus === 'connected' ? 'connected' : 'disconnected'}`}>
                      Estado: {wsStatus.toUpperCase()}
                    </div>
                    <div className="status-details">
                      Tiempo real: {Object.keys(realTimeData).length} canales activos
                    </div>
                  </div>
                  <div className={`websocket-indicator ${wsStatus === 'connected' ? 'connected' : 'disconnected'}`}></div>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-center space-x-3">
                  <LoadingSpinner />
                  <span className="text-gray-600">🏢 Cargando datos Enterprise...</span>
                </div>
              </div>
            )}

            {/* 🏢 ENTERPRISE AGENTS SECTION */}
            {isConnected && !loading && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="enterprise-agent-section">
                  <h2>🤖 Agentes Enterprise ({agents.length})</h2>
                  <p>Con analytics avanzado y tracking en tiempo real • Tema: {getThemeConfig().name}</p>

                  {agents.length > 0 && selectedAgent && (
                    <div className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded mb-4 inline-block">
                      ✅ Seleccionado: {selectedAgent.name}
                    </div>
                  )}
                </div>

                {agents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {agents.map((agent, index) => (
                      <div key={agent.agent_id} className="relative">
                        <div className="agent-badge">#{index + 1}</div>

                        <AgentCard
                          agent={agent}
                          isSelected={selectedAgent?.agent_id === agent.agent_id}
                          onSelect={(agent) => {
                            selectAgent(agent);
                            trackUserAction('enterprise_agent_selected', {
                              agentId: agent.agent_id,
                              agentName: agent.name,
                              timestamp: new Date().toISOString(),
                              theme: currentTheme
                            });
                          }}
                          onSendMessage={handleSendMessage}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">🏢 Modo Enterprise</h3>
                    <p className="text-gray-500">
                      No hay agentes disponibles en este momento.<br/>
                      Verifica que el backend esté ejecutándose.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 🏢 ENTERPRISE QUICK ACTIONS */}
            {isConnected && (
              <div className="enterprise-actions">
                <h2>⚡ Enterprise Quick Actions</h2>
                <div className="enterprise-actions-grid">
                  <button
                    onClick={() => {
                      trackUserAction('enterprise_docs_opened', { theme: currentTheme });
                      window.open('http://localhost:8000/docs', '_blank');
                    }}
                    className="enterprise-action-button btn-blue"
                  >
                    <div className="action-icon">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <span>API Docs</span>
                  </button>

                  <button
                    onClick={() => {
                      trackUserAction('enterprise_health_checked', { theme: currentTheme });
                      window.open('http://localhost:8000/health', '_blank');
                    }}
                    className="enterprise-action-button btn-green"
                  >
                    <div className="action-icon">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span>Health Check</span>
                  </button>

                  <button
                    onClick={() => {
                      trackUserAction('enterprise_websocket_test', { theme: currentTheme });
                      websocketService.send({ type: 'test', data: { timestamp: Date.now(), theme: currentTheme } });
                    }}
                    className="enterprise-action-button btn-purple"
                  >
                    <div className="action-icon">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <span>Test WebSocket</span>
                  </button>

                  <button
                    onClick={() => {
                      trackUserAction('enterprise_analytics_viewed', { theme: currentTheme });
                      console.log('🏢 Enterprise Analytics:', analytics);
                      alert(`Analytics:\n- Eventos: ${analytics.totalEvents}\n- Sesión: ${Math.floor((Date.now() - analytics.sessionDuration) / 1000)}s\n- Tema: ${getThemeConfig().name}`);
                    }}
                    className="enterprise-action-button btn-orange"
                  >
                    <div className="action-icon">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <span>Ver Analytics</span>
                  </button>
                </div>
              </div>
            )}

            {/* 🏢 ENTERPRISE WELCOME MESSAGE */}
            {!isConnected && !loading && (
              <div className="enterprise-welcome">
                <div className="enterprise-welcome-icon">
                  {isDarkTheme ? '🌙' : '☀️'}
                </div>
                <h2>Bienvenido a Iopeer Enterprise</h2>
                <p>
                  Plataforma empresarial con tema {getThemeConfig().name}
                </p>
                <div>
                  <button
                    onClick={() => {
                      trackUserAction('enterprise_connection_attempted', { theme: currentTheme });
                      connect();
                    }}
                    disabled={connectionStatus === CONNECTION_STATES.CONNECTING}
                    className="enterprise-welcome-button"
                  >
                    {connectionStatus === CONNECTION_STATES.CONNECTING ? '🔄 Conectando...' : '🚀 Conectar a Iopeer Enterprise'}
                  </button>
                  <div className="enterprise-welcome-features">
                    ✅ Analytics • ✅ WebSocket • ✅ 4 Temas • ✅ {getThemeConfig().name}
                  </div>
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
