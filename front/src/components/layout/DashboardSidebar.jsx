// front/src/components/layout/DashboardSidebar.jsx - ACTUALIZADO CON MI APP
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BarChart3,
  Users,
  Zap,
  FileText,
  TrendingUp,
  Settings,
  Activity,
  ChevronRight,
  LogOut,
  Smartphone, // ✅ NUEVO ICONO PARA MI APP
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DashboardSidebar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  const { logout, user } = useAuth();

  // ✅ NAVEGACIÓN ACTUALIZADA CON MI APP
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'MI APP', href: '/mi-app', icon: Smartphone }, // ✅ NUEVA SECCIÓN
    { name: 'Mis Agentes', href: '/agents', icon: Users },
    { name: 'Workflows', href: '/workflows', icon: Activity },
    { name: 'AI Generator', href: '/ui-generator', icon: Zap },
    { name: 'Marketplace', href: '/marketplace', icon: FileText },
    { name: 'Analytics', href: '/analytics', icon: TrendingUp },
    { name: 'Reports', href: '/reports', icon: FileText },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  // Show sidebar when mouse approaches left edge
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (e.clientX <= 50) {
        setIsVisible(true);
      } else if (e.clientX > 280 && !isHovered) {
        setIsVisible(false);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [isHovered]);

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Trigger Zone */}
      <div className="fixed left-0 top-0 w-4 h-full z-40" />
      
      {/* Sidebar */}
      <div 
        className={`fixed left-0 top-0 h-full z-50 transition-transform duration-300 ease-out ${
          isVisible ? 'translate-x-0' : '-translate-x-full'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="w-72 h-full bg-white border-r border-gray-200 shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <Link to="/dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">io</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Iopeer</h1>
                <p className="text-sm text-gray-500">AI Agent Platform</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              // Check if current route matches this nav item
              const isActive = location.pathname === item.href || 
                             (item.href === '/dashboard' && location.pathname === '/') ||
                             (item.href === '/mi-app' && location.pathname.startsWith('/mi-app'));
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-green-50 text-green-700 border-r-2 border-green-500'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon 
                    className={`mr-3 h-5 w-5 ${
                      isActive ? 'text-green-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`} 
                  />
                  {item.name}
                  {/* ✅ INDICADOR ESPECIAL PARA MI APP */}
                  {item.name === 'MI APP' && (
                    <span className="ml-auto text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      Nuevo
                    </span>
                  )}
                  {isActive && (
                    <ChevronRight className="ml-auto h-4 w-4 text-green-500" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">
                  {user?.email?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name || 'Usuario'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || 'usuario@email.com'}
                </p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isVisible && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 z-40"
          onClick={() => setIsVisible(false)}
        />
      )}
    </>
  );
};

export default DashboardSidebar;
