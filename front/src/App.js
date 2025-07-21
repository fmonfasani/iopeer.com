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

  // 🎨 PROFESSIONAL THEME SYSTEM
  const { currentTheme, getThemeConfig, isDarkTheme } = useTheme();

  const [notifications, setNotifications] = useState([]);
  const [enterpriseStats, setEnterpriseStats] = useState({});

  // 🏢 Enterprise Analytics Tracking
  useEffect(() => {
    trackUserAction('app_loaded', {
      mode: 'enterprise_professional',
      theme: currentTheme
    });

    // Update enterprise stats every 3 seconds
    const interval = setInterval(() => {
      setEnterpriseStats({
        sessionTime: Date.now() - (analytics.sessionDuration || 0),
        totalEvents: analytics.totalEvents || 0,
        wsConnected: wsStatus === 'connected',
        realtimeChannels: Object.keys(realTimeData).length,
        cacheHitRate: '94.2%', // Mock data
        errorRate: '0.1%'      // Mock data
      });
    }, 3000);

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
      trackUserAction('agent_message_sent', {
        agentId,
        action,
        theme: currentTheme
      });

      const result = await sendMessageToAgent(agentId, action, data);

      setNotifications(prev => [...prev, {
        id: Date.now(),
        type: 'success',
        message: `✅ Enterprise: Mensaje enviado a ${agentId}`,
        timestamp: new Date().toISOString()
      }]);

      console.log('🏢 Enterprise Message Result:', result);
    } catch (error) {
      setNotifications(prev => [...prev, {
        id: Date.now(),
        type: 'error',
        message: `❌ Enterprise Error: ${error.message}`,
        timestamp: new Date().toISOString()
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

  // 🏢 Enterprise Metrics Component with Professional Theme
  const ProfessionalMetricsDashboard = () => {
    const themeConfig = getThemeConfig();

    return (
      <div className="enterprise-dashboard">
        <div className="enterprise-header">
          <div>
            <h2>🏢 Iopeer Enterprise Platform</h2>
            <p>Plataforma profesional con tema {themeConfig.name}</p>
          </div>
          <div className="enterprise-badge">
            <div style={{fontSize: '1.125rem', fontWeight: '700'}}>Enterprise</div>
            <div style={{fontSize: '0.875rem'}}>v2.1.0</div>
          </div>
        </div>

        <div className="enterprise-metrics-grid">
          <div className="enterprise-metric-card">
            <div className="metric-label">Tiempo de Sesión</div>
            <div className="metric-value">
              {Math.floor((enterpriseStats.sessionTime || 0) / 1000)}s
            </div>
          </div>
          <div className="enterprise-metric-card">
            <div className="metric-label">Eventos Analytics</div>
            <div className="metric-value">{enterpriseStats.totalEvents || 0}</div>
          </div>
          <div className="enterprise-metric-card">
            <div className="metric-label">WebSocket Status</div>
            <div className="metric-value">
              {enterpriseStats.wsConnected ? '🟢 LIVE' : '🔴 OFF'}
            </div>
          </div>
          <div className="enterprise-metric-card">
            <div className="metric-label">Cache Hit Rate</div>
            <div className="metric-value" style={{fontSize: '1.5rem'}}>
              {enterpriseStats.cacheHitRate || '0%'}
            </div>
          </div>
          <div className="enterprise-metric-card">
            <div className="metric-label">Error Rate</div>
            <div className="metric-value" style={{fontSize: '1.5rem'}}>
              {enterpriseStats.errorRate || '0%'}
            </div>
          </div>
          <div className="enterprise-metric-card">
            <div className="metric-label">Tema Actual</div>
            <div className="metric-value" style={{fontSize: '1rem'}}>
              {isDarkTheme ? '🌙' : '☀️'} {themeConfig.name}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 🏢 Professional Notifications Component
  const ProfessionalNotifications = () => (
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
                {new Date(notification.timestamp).toLocaleTimeString()} •
                Enterprise Mode • {getThemeConfig().name}
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
            {/* 🏢 PROFESSIONAL METRICS DASHBOARD */}
            <ProfessionalMetricsDashboard />

            {/* 🏢 PROFESSIONAL NOTIFICATIONS */}
            <ProfessionalNotifications />

            {/* 🏢 Professional Connection Status */}
            <div className="enterprise-layout-grid">
              <div className="professional-card" style={{padding: '1.5rem'}}>
                <h3 style={{
                  margin: '0 0 1rem 0',
                  color: 'var(--text-primary)',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  🌐 Connection Status
                </h3>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div className={`status-text ${connectionStatus === CONNECTION_STATES.CONNECTED ? 'connected' : 'disconnected'}`}>
                      Estado: {connectionStatus.toUpperCase()}
                    </div>
                    <div className="status-details">
                      {connectionStatus === CONNECTION_STATES.CONNECTED ?
                        `Conectado a ${systemHealth?.stats?.agents || 0} agentes` :
                        'Desconectado del sistema'
                      }
                    </div>
                  </div>
                  <div className={`websocket-indicator ${connectionStatus === CONNECTION_STATES.CONNECTED ? 'connected' : 'disconnected'}`}></div>
                </div>

                {error && (
                  <div style={{
                    marginTop: '1rem',
                    padding: '0.75rem',
                    background: 'color-mix(in srgb, var(--error) 10%, var(--bg-secondary))',
                    borderLeft: '4px solid var(--error)',
                    borderRadius: '6px'
                  }}>
                    <strong>Error:</strong> {error}
                  </div>
                )}
              </div>

              {/* 🏢 Professional WebSocket Status */}
              <div className="websocket-status">
                <h3>⚡ Enterprise WebSocket</h3>
                <div className="websocket-status-content">
                  <div className="websocket-status-info">
                    <div className={`status-text ${wsStatus === 'connected' ? 'connected' : 'disconnected'}`}>
                      Estado: {wsStatus.toUpperCase()}
                    </div>
                    <div className="status-details">
                      Real-time: {Object.keys(realTimeData).length} canales activos
                    </div>
                  </div>
                  <div className={`websocket-indicator ${wsStatus === 'connected' ? 'connected' : 'disconnected'}`}></div>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="professional-card" style={{padding: '2rem', textAlign: 'center'}}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem'}}>
                  <LoadingSpinner />
                  <span style={{color: 'var(--text-secondary)'}}>
                    🏢 Cargando datos Enterprise Professional...
                  </span>
                </div>
              </div>
            )}

            {/* 🏢 PROFESSIONAL AGENTS SECTION */}
            {isConnected && !loading && (
              <div className="professional-card" style={{padding: '2rem'}}>
                <div className="enterprise-agent-section">
                  <h2>🤖 Agentes Enterprise ({agents.length})</h2>
                  <p>
                    Con analytics profesional y tracking en tiempo real •
                    Tema: {getThemeConfig().name} •
                    Cache: {enterpriseStats.cacheHitRate}
                  </p>

                  {agents.length > 0 && selectedAgent && (
                    <div style={{
                      fontSize: '0.875rem',
                      color: 'var(--accent-primary)',
                      background: 'color-mix(in srgb, var(--accent-primary) 10%, var(--bg-secondary))',
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      marginBottom: '1rem',
                      display: 'inline-block',
                      border: '1px solid color-mix(in srgb, var(--accent-primary) 20%, transparent)'
                    }}>
                      ✅ Seleccionado: {selectedAgent.name}
                    </div>
                  )}
                </div>

                {agents.length > 0 ? (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '1.5rem'
                  }}>
                    {agents.map((agent, index) => (
                      <div key={agent.agent_id} style={{position: 'relative'}}>
                        <div className="agent-badge">#{index + 1}</div>

                        <div
                          className="professional-card"
                          style={{
                            padding: '1.5rem',
                            cursor: 'pointer',
                            border: selectedAgent?.agent_id === agent.agent_id ?
                              '2px solid var(--accent-primary)' :
                              '1px solid var(--border-color)',
                            background: selectedAgent?.agent_id === agent.agent_id ?
                              'color-mix(in srgb, var(--accent-primary) 5%, var(--bg-primary))' :
                              'var(--bg-primary)'
                          }}
                          onClick={() => {
                            selectAgent(agent);
                            trackUserAction('enterprise_agent_selected', {
                              agentId: agent.agent_id,
                              agentName: agent.name,
                              timestamp: new Date().toISOString(),
                              theme: currentTheme
                            });
                          }}
                        >
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: '1rem'
                          }}>
                            <div>
                              <h3 style={{
                                fontWeight: '600',
                                fontSize: '1.125rem',
                                color: 'var(--text-primary)',
                                margin: '0 0 0.25rem 0'
                              }}>
                                {agent.name}
                              </h3>
                              <p style={{
                                fontSize: '0.875rem',
                                color: 'var(--text-secondary)',
                                margin: 0
                              }}>
                                {agent.agent_id}
                              </p>
                            </div>
                            <span style={{
                              padding: '0.25rem 0.75rem',
                              borderRadius: '12px',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              background: agent.status === 'idle' ?
                                'color-mix(in srgb, var(--success) 15%, var(--bg-secondary))' :
                                agent.status === 'busy' ?
                                'color-mix(in srgb, var(--warning) 15%, var(--bg-secondary))' :
                                'color-mix(in srgb, var(--error) 15%, var(--bg-secondary))',
                              color: agent.status === 'idle' ? 'var(--success)' :
                                agent.status === 'busy' ? 'var(--warning)' : 'var(--error)'
                            }}>
                              {agent.status}
                            </span>
                          </div>

                          <p style={{
                            color: 'var(--text-secondary)',
                            marginBottom: '1rem',
                            fontSize: '0.875rem',
                            lineHeight: '1.4'
                          }}>
                            {agent.capabilities?.description || 'Agente especializado en IA'}
                          </p>

                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '0.75rem',
                            color: 'var(--text-tertiary)'
                          }}>
                            <span>Actions: {agent.capabilities?.actions?.length || 0}</span>
                            <span>Msgs: {agent.stats?.messages_processed || 0}</span>
                            <span>Errors: {agent.stats?.errors || 0}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{textAlign: 'center', padding: '3rem 0'}}>
                    <div style={{
                      fontSize: '3rem',
                      marginBottom: '1rem',
                      color: 'var(--text-tertiary)'
                    }}>
                      🤖
                    </div>
                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      marginBottom: '0.5rem'
                    }}>
                      🏢 Modo Enterprise Professional
                    </h3>
                    <p style={{color: 'var(--text-secondary)'}}>
                      No hay agentes disponibles en este momento.<br/>
                      Verifica que el backend esté ejecutándose.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 🏢 PROFESSIONAL ENTERPRISE ACTIONS */}
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
                      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span>Health Check</span>
                  </button>

                  <button
                    onClick={() => {
                      trackUserAction('enterprise_websocket_test', { theme: currentTheme });
                      websocketService.send({
                        type: 'test',
                        data: {
                          timestamp: Date.now(),
                          theme: currentTheme,
                          mode: 'enterprise_professional'
                        }
                      });
                    }}
                    className="enterprise-action-button btn-purple"
                  >
                    <div className="action-icon">
                      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <span>Test WebSocket</span>
                  </button>

                  <button
                    onClick={() => {
                      trackUserAction('enterprise_analytics_viewed', { theme: currentTheme });
                      console.log('🏢 Enterprise Analytics:', analytics);
                      const analyticsData = {
                        eventos: analytics.totalEvents,
                        sesion: Math.floor((Date.now() - analytics.sessionDuration) / 1000),
                        tema: getThemeConfig().name,
                        cache: enterpriseStats.cacheHitRate,
                        errores: enterpriseStats.errorRate
                      };
                      alert(`📊 Analytics Enterprise:\n${JSON.stringify(analyticsData, null, 2)}`);
                    }}
                    className="enterprise-action-button btn-orange"
                  >
                    <div className="action-icon">
                      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <span>Ver Analytics</span>
                  </button>
                </div>
              </div>
            )}

            {/* 🏢 PROFESSIONAL ENTERPRISE WELCOME MESSAGE */}
            {!isConnected && !loading && (
              <div className="enterprise-welcome">
                <div className="enterprise-welcome-icon">
                  {isDarkTheme ? '🌙' : '☀️'}
                </div>
                <h2>Bienvenido a Iopeer Enterprise Professional</h2>
                <p>
                  Plataforma empresarial profesional con tema {getThemeConfig().name}
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
                    {connectionStatus === CONNECTION_STATES.CONNECTING ?
                      '🔄 Conectando...' :
                      '🚀 Conectar a Iopeer Enterprise'
                    }
                  </button>
                  <div className="enterprise-welcome-features">
                    ✅ Analytics Profesional • ✅ WebSocket Real-time • ✅ 4 Temas • ✅ {getThemeConfig().name}
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
