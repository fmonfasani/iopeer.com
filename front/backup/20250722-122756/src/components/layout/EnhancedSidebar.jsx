import React from 'react';
import { 
  BarChart3, Users, Play, Activity, Settings, 
  Search, ShoppingBag, Zap, Database, Shield,
  Brain, Workflow, Bot, MessageCircle, Calendar,
  FileText, TrendingUp, Globe, Layers, Monitor
} from 'lucide-react';

const EnhancedSidebar = ({ activeTab, onTabChange, isCollapsed }) => {
  const menuSections = [
    {
      title: "Principal",
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart3, badge: null },
        { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag, badge: 'new' },
        { id: 'agents', label: 'Mis Agentes', icon: Users, badge: '5' },
      ]
    },
    {
      title: "Automatización",
      items: [
        { id: 'workflows', label: 'Workflows', icon: Workflow, badge: '3' },
        { id: 'executions', label: 'Ejecuciones', icon: Play, badge: '47' },
        { id: 'scheduling', label: 'Programación', icon: Calendar, badge: null },
        { id: 'monitoring', label: 'Monitoreo', icon: Monitor, badge: 'live' },
      ]
    },
    {
      title: "Inteligencia",
      items: [
        { id: 'ai-chat', label: 'AI Chat', icon: MessageCircle, badge: 'beta' },
        { id: 'knowledge', label: 'Base Conocimiento', icon: Brain, badge: null },
        { id: 'training', label: 'Entrenamiento', icon: Bot, badge: 'pro' },
      ]
    },
    {
      title: "Analytics",
      items: [
        { id: 'analytics', label: 'Analytics', icon: TrendingUp, badge: null },
        { id: 'reports', label: 'Reportes', icon: FileText, badge: '12' },
        { id: 'insights', label: 'Insights', icon: Layers, badge: 'ai' },
      ]
    },
    {
      title: "Sistema",
      items: [
        { id: 'database', label: 'Base de Datos', icon: Database, badge: null },
        { id: 'security', label: 'Seguridad', icon: Shield, badge: 'ok' },
        { id: 'integrations', label: 'Integraciones', icon: Globe, badge: '8' },
        { id: 'settings', label: 'Configuración', icon: Settings, badge: null },
      ]
    }
  ];

  const getBadgeStyle = (badge) => {
    const styles = {
      'new': 'bg-green-500 text-white',
      'beta': 'bg-yellow-500 text-white',
      'pro': 'bg-purple-500 text-white',
      'live': 'bg-red-500 text-white animate-pulse',
      'ai': 'bg-blue-500 text-white',
      'ok': 'bg-green-400 text-white',
      default: 'bg-gray-500 text-white'
    };
    
    if (badge && !isNaN(badge)) {
      return 'bg-blue-500 text-white'; // Numbers
    }
    
    return styles[badge] || styles.default;
  };

  return (
    <div className={`enhanced-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-content">
        {menuSections.map((section, sectionIndex) => (
          <div key={section.title} className="sidebar-section">
            {!isCollapsed && (
              <div className="section-title">
                {section.title}
              </div>
            )}
            
            <div className="section-items">
              {section.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`sidebar-item ${activeTab === item.id ? 'active' : ''}`}
                  title={isCollapsed ? item.label : ''}
                >
                  <div className="item-icon">
                    <item.icon size={20} />
                  </div>
                  
                  {!isCollapsed && (
                    <>
                      <span className="item-label">{item.label}</span>
                      {item.badge && (
                        <span className={`item-badge ${getBadgeStyle(item.badge)}`}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  
                  {activeTab === item.id && <div className="active-indicator"></div>}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Quick Stats en sidebar */}
      <div className="sidebar-footer">
        {!isCollapsed && (
          <div className="quick-stats-mini">
            <div className="mini-stat">
              <span className="stat-label">Agentes:</span>
              <span className="stat-value">5</span>
            </div>
            <div className="mini-stat">
              <span className="stat-label">Activos:</span>
              <span className="stat-value">3</span>
            </div>
            <div className="mini-stat">
              <span className="stat-label">Hoy:</span>
              <span className="stat-value">47</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedSidebar;
