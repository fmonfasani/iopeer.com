import React, { useState, useEffect } from 'react';
import {
  Search, Star, Download, Shield, Crown, Play,
  Code, BarChart3, PenTool, Palette, TrendingUp,
  ArrowRight, CheckCircle, Brain, Grid3X3, List,
  Bell, MessageCircle, BarChart
} from 'lucide-react';

// Components
import Header from './components/layout/Header';
import Footer from './components/ui/Footer';
import ConnectionStatus from './components/features/ConnectionStatus';
import AgentCard from './components/features/AgentCard';
import AgentDetail from './components/features/AgentDetail';
import SearchFilters from './components/features/SearchFilters';
import QuickActions from './components/features/QuickActions';
import StatsWidget from './components/features/StatsWidget';
import AnalyticsDashboard from './components/features/AnalyticsDashboard';
import NotificationCenter from './components/features/NotificationCenter';
import LiveChat from './components/features/LiveChat';
import {
  AgentCardSkeleton,
  CategoryCardSkeleton,
  FullPageLoader
} from './components/ui/LoadingStates';

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
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showAgentDetail, setShowAgentDetail] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [filters, setFilters] = useState({
    price: 'all',
    rating: 0,
    category: 'all',
    verified: false,
    premium: false
  });

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

  // Simular carga inicial con bienvenida
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
      addNotification('success', 'Bienvenido a AgentHub', 'Tu marketplace de agentes IA está listo');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Auto-generar notificaciones de demostración
  useEffect(() => {
    const generateNotifications = () => {
      const types = ['success', 'info', 'warning'];
      const messages = [
        { type: 'success', title: 'Agente instalado', message: 'CodeMaster Pro se instaló correctamente' },
        { type: 'info', title: 'Nueva actualización', message: 'DataViz Genius v2.1 disponible' },
        { type: 'success', title: 'Pago procesado', message: 'Suscripción premium activada' },
        { type: 'info', title: 'Nuevo agente', message: 'Design Assistant ahora disponible' },
        { type: 'warning', title: 'Mantenimiento', message: 'Mantenimiento programado mañana a las 2 AM' }
      ];

      let index = 0;
      const interval = setInterval(() => {
        if (index < messages.length) {
          const notif = messages[index];
          addNotification(notif.type, notif.title, notif.message);
          index++;
        } else {
          clearInterval(interval);
        }
      }, 30000); // cada 30 segundos

      return () => clearInterval(interval);
    };

    const cleanup = generateNotifications();
    return cleanup;
  }, []);

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
    let agents = [];

    if (searchQuery.trim()) {
      agents = searchAgents(searchQuery);
    } else if (selectedCategory === 'featured') {
      agents = getFeaturedAgents();
    } else {
      agents = getAgentsByCategory(selectedCategory);
    }

    // Aplicar filtros
    if (filters.price === 'free') {
      agents = agents.filter(agent => !agent.premium);
    } else if (filters.price === 'premium') {
      agents = agents.filter(agent => agent.premium);
    }

    if (filters.rating > 0) {
      agents = agents.filter(agent => agent.rating >= filters.rating);
    }

    if (filters.category !== 'all') {
      agents = agents.filter(agent => agent.category === filters.category);
    }

    if (filters.verified) {
      agents = agents.filter(agent => agent.verified);
    }

    if (filters.premium) {
      agents = agents.filter(agent => agent.premium);
    }

    return agents;
  };

  const filteredAgents = getFilteredAgents();

  // Manejar instalación de agente
  const handleInstallAgent = async (agent) => {
    try {
      // Si hay backend conectado, usar la API real
      if (connectionStatus === 'connected') {
        await installAgent(agent.id);
      }

      addNotification('success', `${agent.name} instalado`, 'El agente se instaló correctamente y está listo para usar');
    } catch (error) {
      addNotification('error', `Error al instalar ${agent.name}`, error.message);
    }
  };

  // Manejar demo de agente
  const handleAgentDemo = (agent) => {
    addNotification('info', `Demo de ${agent.name}`, 'Iniciando demostración interactiva del agente');
  };

  // Manejar selección de agente
  const handleAgentSelect = (agent) => {
    setSelectedAgent(agent);
    setShowAgentDetail(true);
  };

  // Limpiar filtros
  const clearFilters = () => {
    setFilters({
      price: 'all',
      rating: 0,
      category: 'all',
      verified: false,
      premium: false
    });
  };

  // Sistema de notificaciones mejorado
  const addNotification = (type, title, message) => {
    const notification = {
      id: Date.now(),
      type,
      title,
      message,
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [notification, ...prev.slice(0, 49)]);
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  if (isInitialLoading) {
    return <FullPageLoader message="Cargando AgentHub..." />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header mejorado */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAdmin(!showAdmin)}
                className="md:hidden text-slate-300 hover:text-white p-2"
              >
                <Grid3X3 size={20} />
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
              <button
                onClick={() => setShowAnalytics(true)}
                className="text-slate-300 hover:text-white transition-colors flex items-center space-x-1"
              >
                <BarChart size={16} />
                <span>Analytics</span>
              </button>
              <NotificationCenter
                notifications={notifications}
                onDismiss={dismissNotification}
                onMarkAsRead={markNotificationAsRead}
                onClearAll={clearAllNotifications}
              />
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors">
                Acceder
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Agent Detail Modal */}
      <AgentDetail
        agent={selectedAgent}
        isOpen={showAgentDetail}
        onClose={() => setShowAgentDetail(false)}
        onInstall={handleInstallAgent}
        onDemo={handleAgentDemo}
      />

      {/* Analytics Dashboard */}
      <AnalyticsDashboard
        isVisible={showAnalytics}
        onClose={() => setShowAnalytics(false)}
      />

      {/* Live Chat */}
      <LiveChat
        isOpen={showChat}
        onToggle={() => setShowChat(!showChat)}
        onClose={() => setShowChat(false)}
      />

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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <ConnectionStatus
              status={connectionStatus}
              error={error}
              health={systemHealth}
              onReconnect={connect}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <QuickActions
                connectionStatus={connectionStatus}
                onNotification={addNotification}
              />

              <StatsWidget
                agents={filteredAgents}
                systemHealth={systemHealth}
              />
            </div>

            {connectionStatus === 'connected' && backendAgents.length > 0 && (
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span>Agentes Backend Conectados ({backendAgents.length})</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {backendAgents.map(agent => (
                    <div key={agent.agent_id} className="bg-slate-700 rounded-lg p-4 hover:bg-slate-600 transition-colors">
                      <h4 className="font-medium text-white">{agent.name}</h4>
                      <p className="text-sm text-slate-400 mt-1">{agent.agent_id}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className={`w-2 h-2 rounded-full ${
                            agent.status === 'idle' ? 'bg-green-400' :
                            agent.status === 'busy' ? 'bg-yellow-400' : 'bg-red-400'
                          }`}></span>
                          <span className="text-xs text-slate-400">{agent.status}</span>
                        </div>
                        <span className="text-xs text-slate-500">
                          {agent.stats?.messages_processed || 0} msgs
                        </span>
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
            <p className="text-slate-400 max-w-2xl mx-auto">
              Desde desarrollo de software hasta marketing digital, encuentra el agente perfecto para tu proyecto
            </p>
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
                  setFilters(prev => ({ ...prev, category: 'all' }));
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
          {/* Header with filters */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                {searchQuery ? (
                  <>Resultados para "<span className="text-emerald-400">{searchQuery}</span>"</>
                ) : (
                  selectedCategory === 'featured' ? 'Agentes Destacados' :
                  categories.find(c => c.id === selectedCategory)?.name || 'Agentes'
                )}
              </h2>
              <p className="text-slate-400">
                {filteredAgents.length} agente{filteredAgents.length !== 1 ? 's' : ''} encontrado{filteredAgents.length !== 1 ? 's' : ''}
                {filteredAgents.length > 0 && ` • ${filteredAgents.filter(a => !a.premium).length} gratuitos • ${filteredAgents.filter(a => a.premium).length} premium`}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <SearchFilters
                filters={filters}
                onFiltersChange={setFilters}
                onClear={clearFilters}
              />

              <div className="flex items-center border border-slate-600 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-emerald-500 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                  title="Vista en cuadrícula"
                >
                  <Grid3X3 size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-colors ${
                    viewMode === 'list'
                      ? 'bg-emerald-500 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                  title="Vista en lista"
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6' : 'space-y-4'}`}>
              {Array.from({ length: 8 }).map((_, i) => (
                <AgentCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredAgents.length > 0 ? (
            <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6' : 'space-y-4'}`}>
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
                    onClick={() => handleAgentSelect(agent)}
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
                  'Intenta con otros términos de búsqueda o ajusta los filtros' :
                  'No hay agentes en esta categoría aún'
                }
              </p>
              {(searchQuery || filters.price !== 'all' || filters.rating > 0 || filters.verified || filters.premium) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    clearFilters();
                  }}
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
                addNotification('success', '🚀 ¡Bienvenido a AgentHub!', 'Explora nuestros agentes y encuentra el perfecto para tu proyecto');
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
