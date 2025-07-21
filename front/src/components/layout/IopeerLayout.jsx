import React, { useState } from 'react';
import { Menu, Bell, Settings, Search, Store, Home, Users, Activity, BarChart3 } from 'lucide-react';
import ThemeSelector from '../ui/ThemeSelector';

const IopeerLayout = ({ children, title = "Iopeer", onSearch, notifications = [], currentView = 'dashboard' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/' },
    { id: 'marketplace', label: 'Marketplace', icon: Store, path: '/marketplace' },
    { id: 'agents', label: 'Mis Agentes', icon: Users, path: '/agents' },
    { id: 'workflows', label: 'Workflows', icon: Activity, path: '/workflows' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/analytics' }
  ];

  const handleNavigation = (item) => {
    // Emit navigation event
    window.dispatchEvent(new CustomEvent('iopeerNavigate', { 
      detail: { view: item.id, path: item.path }
    }));
  };

  return (
    <div className="min-h-screen" style={{backgroundColor: 'var(--bg-secondary)'}}>
      {/* Header */}
      <header className="shadow-sm border-b" style={{
        backgroundColor: 'var(--bg-primary)', 
        borderColor: 'var(--border-color)'
      }}>
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg transition-colors"
              style={{color: 'var(--text-primary)'}}
            >
              <Menu size={20} />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">io</span>
              </div>
              <div>
                <h1 className="font-bold text-lg" style={{color: 'var(--text-primary)'}}>{title}</h1>
                <p className="text-xs" style={{color: 'var(--text-secondary)'}}>AI Agent Platform</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{color: 'var(--text-tertiary)'}} size={16} />
              <input
                type="text"
                placeholder="Buscar en Iopeer..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 border rounded-lg transition-all w-64"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>

            {/* Theme Selector */}
            <ThemeSelector />

            {/* Notifications */}
            <div className="relative">
              <button className="p-2 rounded-lg transition-colors" style={{color: 'var(--text-primary)'}}>
                <Bell size={20} />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
            </div>

            {/* Settings */}
            <button className="p-2 rounded-lg transition-colors" style={{color: 'var(--text-primary)'}}>
              <Settings size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-64 border-r min-h-screen" style={{
            backgroundColor: 'var(--bg-primary)',
            borderColor: 'var(--border-color)'
          }}>
            <nav className="p-4">
              <div className="space-y-2">
                {navigationItems.map(item => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all ${
                        isActive ? 'font-semibold' : ''
                      }`}
                      style={{
                        backgroundColor: isActive ? 'var(--accent-primary)' : 'transparent',
                        color: isActive ? 'white' : 'var(--text-primary)'
                      }}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                      {item.id === 'marketplace' && (
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full ml-auto">
                          Nuevo
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              
              {/* Quick Stats */}
              <div className="mt-8 p-3 rounded-lg" style={{backgroundColor: 'var(--bg-secondary)'}}>
                <h3 className="text-sm font-semibold mb-2" style={{color: 'var(--text-primary)'}}>
                  🚀 Quick Stats
                </h3>
                <div className="text-xs space-y-1" style={{color: 'var(--text-secondary)'}}>
                  <div className="flex justify-between">
                    <span>Agentes Instalados:</span>
                    <span className="font-medium">5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Workflows Activos:</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ejecuciones Hoy:</span>
                    <span className="font-medium">47</span>
                  </div>
                </div>
              </div>
            </nav>
          </aside>
        )}

        {/* Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default IopeerLayout;
