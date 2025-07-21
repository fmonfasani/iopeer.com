import React from 'react';
import { Brain, Menu } from 'lucide-react';

const Header = ({ onMenuToggle }) => {
  return (
    <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuToggle}
              className="md:hidden text-slate-300 hover:text-white p-2"
            >
              <Menu size={20} />
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-slate-900" />
              </div>
              <span className="text-xl font-bold text-white">AgentHub</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#agentes" className="text-slate-300 hover:text-white transition-colors">
              Agentes
            </a>
            <a href="#empresas" className="text-slate-300 hover:text-white transition-colors">
              Empresas
            </a>
            <a href="#api" className="text-slate-300 hover:text-white transition-colors">
              API
            </a>
            <a href="#docs" className="text-slate-300 hover:text-white transition-colors">
              Docs
            </a>
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors">
              Acceder
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
