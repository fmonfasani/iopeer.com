import React, { useState, useEffect } from 'react';
import './App.css';
import ErrorBoundary from './components/ui/ErrorBoundary';
import IopeerLayout from './components/layout/IopeerLayout';
import MarketplaceApp from './components/marketplace/MarketplaceApp';
import ConnectionStatus from './components/features/ConnectionStatus';
import AgentCard from './components/features/AgentCard';
import LoadingSpinner from './components/ui/LoadingSpinner';
import { useIopeer, useAgents } from './hooks/useIopeer';
import { useEnterprise } from './hooks/useEnterprise';
import { useTheme } from './hooks/useTheme';
import { useMarketplace } from './hooks/useMarketplace';
import { CONNECTION_STATES } from './utils/constants';

// Importar servicios enterprise
import { analyticsService } from './services/analytics';
import { websocketService } from './services/websocket';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [notifications, setNotifications] = useState([]);

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

  // 🛒 MARKETPLACE
  const marketplace = useMarketplace();

  const [enterpriseStats, setEnterpriseStats] = useState({});

  // Navigation handler
  useEffect(() => {
    const handleNavigation = (event) => {
      setCurrentView(event.detail.view);
      if (trackUserAction) {
        trackUserAction('navigation', { 
          from: currentView, 
          to: event.detail.view,
          theme: currentTheme 
        });
      }
    };

    const handleNotification = (event) => {
      setNotifications(prev => [...prev, {
        id: Date.now(),
        ...event.detail,
        timestamp: new Date().toISOString()
      }]);
    };

    window.addEventListener('iopeerNavigate', handleNavigation);
    window.addEventListener('showNotification', handleNotification);

    return () => {
      window.removeEventListener('iopeerNavigate', handleNavigation);
      window.removeEventListener('showNotification', handleNotification);
    };
  }, [currentView, trackUserAction, currentTheme]);

  // 🏢 Enterprise Analytics Tracking
  useEffect(() => {
    if (trackUserAction) {
      trackUserAction('app_loaded', { mode: 'enterprise', theme: currentTheme });
    }
    
    // Update enterprise stats every 5 seconds
    const interval = setInterval(() => {
      setEnterpriseStats({
        sessionTime: Date.now() - (analytics.sessionDuration || 0),
        totalEvents: analytics.totalEvents || 0,
        wsConnected: wsStatus === 'connected',
        realtimeChannels: Object.keys(realTimeData).length,
        installedAgents: marketplace.stats.totalInstalled
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [analytics, wsStatus, realTimeData, trackUserAction, currentTheme, marketplace.stats]);

  const handleSendMessage = async (agentId, action, data) => {
    try {
      if (trackUserAction) {
        trackUserAction('agent_message_sent', { agentId, action, theme: currentTheme });
      }
      
      const result = await sendMessageToAgent(agentId, action, data);
      
      setNotifications(prev => [...prev, {
        id: Date.now(),
        type: 'success',
        title: '✅ Enterprise',
        message: `Mensaje enviado a ${agentId}`,
        timestamp: new Date().toISOString()
      }]);
      
      console.log('🏢 Enterprise Message Result:', result);
    } catch (error) {
      setNotifications(prev => [...prev, {
        id: Date.now(),
        type: 'error',
        title: '❌ Enterprise Error',
        message: error.message,
        timestamp: new Date().toISOString()
      }]);
    }
  };

  const handleSearch = (query) => {
    if (trackUserAction) {
      trackUserAction('enterprise_search', { 
        query, 
        timestamp: new Date().toISOString(),
        theme: currentTheme,
        currentView
      });
    }
    console.log('🏢 Enterprise Search:', query);
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Auto-dismiss notifications
  useEffect(() => {
    notifications.forEach(notification => {
      if (notification.type !== 'error') {
        setTimeout(() => {
          dismissNotification(notification.id);
        }, 5000);
      }
    });
  }, [notifications]);

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
            <div className="metric-label">Agentes Instalados</div>
            <div className="metric-value">
              {enterpriseStats.installedAgents || 0}
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
        <h3>🔔 Notificaciones Enterprise</h3>
        <div>
          {notifications.slice(-3).map(notification => (
            <div 
              key={notification.id}
              className={`notification-item ${notification.type}`}
            >
              <div className="notification-header">
                <span className="notification-title">{notification.title}</span>
                <button 
                  onClick={() => dismissNotification(notification.id)}
                  className="notification-close"
                >
                  ×
                </button>
              </div>
              <div className="notification-message">{notification.message}</div>
              <div className="notification-time">
                {new Date(notification.timestamp).toLocaleTimeString()} • Enterprise Mode • {getThemeConfig().name}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  );

  // Render different views based on currentView
  const renderContent = () => {
    switch (currentView) {
      case 'marketplace':
        return <MarketplaceApp />;
      
      case 'agents':
        return (
          <div className="p-6 space-y-6">
            <EnterpriseMetrics />
            <EnterpriseNotifications />
            
            {/* Enterprise Agents Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold mb-4" style={{color: 'var(--text-primary)'}}>
                🤖 Agentes Enterprise ({agents.length})
              </h2>
              
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
                          if (trackUserAction) {
                            trackUserAction('enterprise_agent_selected', { 
                              agentId: agent.agent_id,
                              agentName: agent.name,
                              timestamp: new Date().toISOString(),
                              theme: currentTheme
                            });
                          }
                        }}
                        onSendMessage={handleSendMessage}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🤖</div>
                  <h3 className="text-xl font-semibold mb-2">No hay agentes backend conectados</h3>
                  <p className="text-gray-500 mb-4">
                    Verifica que el backend de Iopeer esté ejecutándose
                  </p>
                  <button
                    onClick={() => setCurrentView('marketplace')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    🏪 Explorar Marketplace
                  </button>
                </div>
              )}
            </div>
          </div>
        );
        
      case 'workflows':
        return (
          <div className="p-6">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Workflows</h3>
              <p className="text-gray-500">Gestión de workflows próximamente...</p>
            </div>
          </div>
        );
        
      case 'analytics':
        return (
          <div className="p-6">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Analytics Avanzado</h3>
              <p className="text-gray-500">Dashboard de analytics próximamente...</p>
            </div>
          </div>
        );
        
      default: // dashboard
        return (
          <div className="p-6 space-y-6">
            <EnterpriseMetrics />
            <EnterpriseNotifications />
            
            {/* Connection Status */}
            <div className="enterprise-layout-grid">
              <ConnectionStatus
                status={connectionStatus}
                error={error}
                health={systemHealth}
                onReconnect={connect}
              />
              
              {/* WebSocket Status */}
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

            {/* Enterprise Quick Actions */}
            {isConnected && (
              <div className="enterprise-actions">
                <h2>⚡ Enterprise Quick Actions</h2>
                <div className="enterprise-actions-grid">
                  <button 
                    onClick={() => {
                      if (trackUserAction) {
                        trackUserAction('enterprise_marketplace_opened', { theme: currentTheme });
                      }
                      setCurrentView('marketplace');
                    }}
                    className="enterprise-action-button btn-blue"
                  >
                    <div className="action-icon">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <span>🏪 Marketplace</span>
                  </button>
                  
                  <button 
                    onClick={() => {
                      if (trackUserAction) {
                        trackUserAction('enterprise_docs_opened', { theme: currentTheme });
                      }
                      window.open('http://localhost:8000/docs', '_blank');
                    }}
                    className="enterprise-action-button btn-green"
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
                      if (trackUserAction) {
                        trackUserAction('enterprise_websocket_test', { theme: currentTheme });
                      }
                      if (websocketService && websocketService.send) {
                        websocketService.send({ type: 'test', data: { timestamp: Date.now(), theme: currentTheme } });
                      }
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
                      if (trackUserAction) {
                        trackUserAction('enterprise_analytics_viewed', { theme: currentTheme });
                      }
                      console.log('🏢 Enterprise Analytics:', analytics);
                      alert(`Analytics:\n- Eventos: ${analytics.totalEvents}\n- Sesión: ${Math.floor((Date.now() - analytics.sessionDuration) / 1000)}s\n- Tema: ${getThemeConfig().name}\n- Agentes instalados: ${marketplace.stats.totalInstalled}`);
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

            {/* Enterprise Welcome Message */}
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
                      if (trackUserAction) {
                        trackUserAction('enterprise_connection_attempted', { theme: currentTheme });
                      }
                      connect();
                    }}
                    disabled={connectionStatus === CONNECTION_STATES.CONNECTING}
                    className="enterprise-welcome-button"
                  >
                    {connectionStatus === CONNECTION_STATES.CONNECTING ? '🔄 Conectando...' : '🚀 Conectar a Iopeer Enterprise'}
                  </button>
                  <div className="enterprise-welcome-features">
                    ✅ Analytics • ✅ WebSocket • ✅ 4 Temas • ✅ Marketplace • ✅ {getThemeConfig().name}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <ErrorBoundary>
      <div className="App">
        <IopeerLayout 
          title="🏢 Iopeer Enterprise Platform"
          onSearch={handleSearch}
          notifications={notifications}
          currentView={currentView}
        >
          {renderContent()}
        </IopeerLayout>
      </div>
    </ErrorBoundary>
  );
}

export default App;
