import React, { useState } from 'react';
import { Menu, Bell, Settings, Search } from 'lucide-react';
import ThemeSelector from '../ui/ThemeSelector';

const IopeerLayout = ({ children, title = "Iopeer", onSearch, notifications = [] }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
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
        {/* Sidebar placeholder */}
        {sidebarOpen && (
          <aside className="w-64 border-r min-h-screen" style={{
            backgroundColor: 'var(--bg-primary)',
            borderColor: 'var(--border-color)'
          }}>
            <nav className="p-4">
              <p className="text-sm" style={{color: 'var(--text-tertiary)'}}>Navegación próximamente...</p>
            </nav>
          </aside>
        )}

        {/* Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default IopeerLayout;
