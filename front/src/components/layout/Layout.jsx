import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, BookOpen, Home, Settings, Code} from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Inicio', href: '/', icon: Home },
    { name: 'Agentes', href: '/agents', icon: Users },
    { name: 'UI Generator', href: '/ui-generator', icon: Code },
    { name: 'Marketplace', href: '/marketplace', icon: BookOpen },
    { name: 'Configuración', href: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">io</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Iopeer</h1>
                <p className="text-xs text-gray-500">AI Agent Platform</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-4">
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon size={20} />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
