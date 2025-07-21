import React, { useState, useEffect } from 'react';
import { 
  Search, Star, Download, Shield, Crown, Play, 
  Code, BarChart3, PenTool, Palette, TrendingUp,
  ArrowRight, CheckCircle, Brain
} from 'lucide-react';

// Components
import Header from './components/layout/Header';
import Footer from './components/ui/Footer';
import ConnectionStatus from './components/features/ConnectionStatus';
import AgentCard from './components/features/AgentCard';

// Hooks
import { useIopeer } from './hooks/useIopeer';

// Data
import { 
  MARKETPLACE_AGENTS, 
  getAgentsByCategory, 
  getFeaturedAgents,
  searchAgents,
  getAgentStats 
} from './data/agentCategories';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('featured');
  const [showAdmin, setShowAdmin] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Iopeer hooks para mantener funcionalidad backend
  const {
    connectionStatus,
    agents: backendAgents,
    systemHealth,
    loading,
    error,
    connect,
    installAgent
  } = useIopeer();

  // Categorías con iconos y colores
  const categories = [
    {
      id: 'featured',
      name: 'Destacados',
      icon: '⭐',
      description: 'Los agentes más populares y mejor valorados',
      count: getFeaturedAgents().length,
      color: 'from-yellow-500 to-orange-600'
    },
    {
      id: 'development',
      name: 'Desarrollo',
      icon: '👨‍💻',
      description: 'Agentes especializados en programación, debugging y arquitectura',
      count: getAgentsByCategory('development').length,
      color: 'from-blue-500 to-purple-600'
    },
    {
      id: 'data_analysis',
      name: 'Análisis de Datos',
      icon: '📊',
      description: 'Visualización, estadísticas y business intelligence',
      count: getAgentsByCategory('data_analysis').length,
      color: 'from-green-500 to-teal-600'
    },
    {
      id: 'content',
      name: 'Contenido',
      icon: '✍️',
      description: 'Redacción, copywriting y creación de contenido',
      count: getAgentsByCategory('content').length,
      color: 'from-orange-500 to-red-600'
    },
    {
      id: 'design',
      name: 'Diseño',
      icon: '🎨',
      description: 'UI/UX, branding y creatividad visual',
      count: getAgentsByCategory('design').length,
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: 'marketing',
      name: 'Marketing',
      icon: '📈',
      description: 'SEO, publicidad y optimización de conversiones',
      count: getAgentsByCategory('marketing').length,
      color: 'from-cyan-500 to-blue-600'
    }
  ];

  // Estadísticas del marketplace
  const stats = [
    { number: '5,000+', label: 'agentes especializados' },
    { number: '1,200+', label: 'empresas' },
    { number: '98%', label: 'satisfacción' },
    { number: '24/7', label: 'soporte' }
  ];

  // Obtener agentes filtrados
  const getFilteredAgents = () => {
    if (searchQuery.trim()) {
      return searchAgents(searchQuery);
    } else if (selectedCategory === 'featured') {
      return getFeaturedAgents();
    } else {
      return getAgentsByCategory(selectedCategory);
    }
  };

  const filteredAgents = getFilteredAgents();

  // Manejar instalación de agente
  const handleInstallAgent = async (agent) => {
    try {
      // Si hay backend conectado, usar la API real
      if (connectionStatus === 'connected') {
        await installAgent(agent.id);
      }
      
      addNotification('success', `✅ ${agent.name} instalado correctamente`);
    } catch (error) {
      addNotification('error', `❌ Error al instalar ${agent.name}: ${error.message}`);
    }
  };

  // Manejar demo de agente
  const handleAgentDemo = (agent) => {
    addNotification('info', `🚀 Iniciando demo de ${agent.name}`);
  };

  // Sistema de notificaciones
  const addNotification = (type, message) => {
    const notification = {
      id: Date.now(),
      type,
      message,
      timestamp: new Date()
    };
    setNotifications(prev => [notification, ...prev.slice(0, 4)]);
    
    // Auto remove después de 5 segundos
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <Header onMenuToggle={() => setShowAdmin(!showAdmin)} />

      {/* Notificaciones */}
      {notifications.length > 0 && (
        <div className="fixed top-20 right-4 space-y-2 z-50">
          {notifications.map(notification => (
            <div
              key={notification.id}
              className={`notification p-4 rounded-lg border backdrop-blur-sm max-w-sm ${
                notification.type === 'success' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-100' :
                notification.type === 'error' ? 'bg-red-500/20 border-red-500/30 text-red-100' :
                'bg-blue-500/20 border-blue-500/30 text-blue-100'
              }`}
            >
              <p className="text-sm">{notification.message}</p>
            </div>
          ))}
        </div>
      )}

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 bg-pattern"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8 animate-fadeIn">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              El marketplace de agentes IA
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                de Latinoamérica
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Más de <span className="text-emerald-400 font-semibold">5,000 agentes especializados</span> y más
              <br />
              de <span className="text-cyan-400 font-semibold">1,200 empresas</span> potencian su productividad con AgentHub
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="bg-slate-800 border border-slate-600 rounded-2xl p-2 shadow-2xl">
                <div className="flex items-center">
                  <Search className="w-6 h-6 text-slate-400 ml-4" />
                  <input
                    type="text"
                    placeholder="¿Qué agente necesitas? Ej: 'análisis de datos', 'generación de código'..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent border-0 text-white placeholder-slate-400 px-4 py-4 text-lg focus:outline-none"
                  />
                  <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-semibold transition-colors btn-hover-glow">
                    Buscar agente
                  </button>
                </div>
              </div>
              
              <p className="text-slate-400 text-sm mt-4">
                Prueba cualquier agente gratis.
                <br />
                O adquiere <button 
                  onClick={() => setShowAdmin(true)}
                  className="text-cyan-400 hover:underline"
                >
                  AgentHub para tu empresa
                </button>
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center animate-fadeIn" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-slate-400 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Admin Panel Toggle */}
      {showAdmin && (
        <section className="py-8 bg-slate-800/50 border-b border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ConnectionStatus
              status={connectionStatus}
              error={error}
              health={systemHealth}
              onReconnect={connect}
            />
            
            {connectionStatus === 'connected' && backendAgents.length > 0 && (
              <div className="mt-6 bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span>Agentes Backend Conectados</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {backendAgents.map(agent => (
                    <div key={agent.agent_id} className="bg-slate-700 rounded-lg p-4">
                      <h4 className="font-medium text-white">{agent.name}</h4>
                      <p className="text-sm text-slate-400 mt-1">{agent.agent_id}</p>
                      <div className="mt-2 flex items-center space-x-2">
                        <span className={`w-2 h-2 rounded-full ${
                          agent.status === 'idle' ? 'bg-green-400' :
                          agent.status === 'busy' ? 'bg-yellow-400' : 'bg-red-400'
                        }`}></span>
                        <span className="text-xs text-slate-400">{agent.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fadeIn">
            <h2 className="text-4xl font-bold mb-4">
              Todas las categorías de agentes que
              <br />
              necesitas en 6 especialidades
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className={`bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-slate-600 transition-all duration-300 cursor-pointer card-hover animate-fadeIn`}
                style={{animationDelay: `${index * 0.1}s`}}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setSearchQuery('');
                  document.getElementById('marketplace')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <div className="text-center">
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{category.name}</h3>
                  <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                    {category.description}
                  </p>
                  <div className="inline-block bg-emerald-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                    {category.count}+ agentes
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marketplace Section */}
      <section id="marketplace" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-4">
              {searchQuery ? (
                <>Resultados para "<span className="text-emerald-400">{searchQuery}</span>"</>
              ) : (
                selectedCategory === 'featured' ? 'Agentes Destacados' : 
                categories.find(c => c.id === selectedCategory)?.name || 'Agentes'
              )}
            </h2>
            <p className="text-slate-400">
              {filteredAgents.length} agente{filteredAgents.length !== 1 ? 's' : ''} encontrado{filteredAgents.length !== 1 ? 's' : ''}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl p-6 animate-pulse">
                  <div className="w-12 h-12 bg-slate-700 rounded-xl mb-4"></div>
                  <div className="h-4 bg-slate-700 rounded mb-2"></div>
                  <div className="h-3 bg-slate-700 rounded mb-4 w-3/4"></div>
                  <div className="h-8 bg-slate-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredAgents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredAgents.map((agent, index) => (
                <div 
                  key={agent.id} 
                  className="animate-fadeIn"
                  style={{animationDelay: `${index * 0.05}s`}}
                >
                  <AgentCard
                    agent={agent}
                    onInstall={handleInstallAgent}
                    onDemo={handleAgentDemo}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-white mb-2">No se encontraron agentes</h3>
              <p className="text-slate-400 mb-6">
                {searchQuery ? 
                  'Intenta con otros términos de búsqueda' :
                  'No hay agentes en esta categoría aún'
                }
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Ver todos los agentes
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-cyan-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fadeIn">
          <h2 className="text-4xl font-bold mb-6">
            Transforma tu empresa con IA
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Únete a miles de empresas que ya potencian su productividad con AgentHub
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => {
                addNotification('success', '🚀 ¡Bienvenido a AgentHub! Explora nuestros agentes.');
                document.getElementById('marketplace')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-white text-emerald-600 px-8 py-4 rounded-xl font-semibold hover:bg-slate-100 transition-colors flex items-center justify-center space-x-2 btn-hover-scale"
            >
              <span>Empezar gratis</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setShowAdmin(true)}
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-emerald-600 transition-colors btn-hover-scale"
            >
              Ver panel admin
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
