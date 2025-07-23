import React, { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';  
import { Link, useNavigate } from 'react-router-dom';


const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout: contextLogout, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const logout = () => {
    contextLogout();  // llamamos la función logout del contexto para limpiar estado y token
    navigate('/login');  // redirigimos a login
  };

  return (
    <header className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="text-2xl font-bold text-green-400">
              Iopeer
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="¿ Que agentes buscas?"
                className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-gray-800 text-gray-300 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-white focus:ring-white focus:text-gray-900"
              />
            </div>
          </div>

          {/* Navigation Menu - Desktop */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/agents" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">
                Agentes
            </Link> 
            <a href="#" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">
              UI Generator
            </a>
            <a href="#" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">
              Marketplace
            </a>
            <a href="#" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">
              Api
            </a>
            <a href="#" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">
              Documentación
            </a>
            <a href="#" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">
              Precios
            </a>
          </nav>

          {/* Login / Logout Button */}
            <div className="hidden md:block ml-auto">
              {isLoggedIn ? (
                <button
                  onClick={logout}
                  className="border border-green-400 text-green-400 hover:bg-green-400 hover:text-gray-900 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="border border-green-400 text-green-400 hover:bg-green-400 hover:text-gray-900 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-400 hover:text-white p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-700">
              {/* Mobile Search */}
              <div className="relative mb-3">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="¿Qué quieres aprender?"
                  className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-gray-800 text-gray-300 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-white focus:ring-white focus:text-gray-900"
                />
              </div>
              
              <a href="#" className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium">
                Cursos
              </a>
              <a href="#" className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium">
                Empresas
              </a>
              <a href="#" className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium">
                Blog
              </a>
              <a href="#" className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium">
                Live
              </a>
              <a href="#" className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium">
                Conf
              </a>
              <a href="#" className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium">
                Precios
              </a>
              <div className="pt-4">
                <button className="w-full border border-green-400 text-green-400 hover:bg-green-400 hover:text-gray-900 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Acceder
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;