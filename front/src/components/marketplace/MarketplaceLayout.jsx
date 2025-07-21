import React, { useState, useMemo } from 'react';
import { Search, Filter, Grid, List, Star, Users, Zap, Crown } from 'lucide-react';
import { 
  AGENT_CATEGORIES, 
  CATEGORY_LABELS, 
  MARKETPLACE_AGENTS,
  SUBCATEGORIES,
  getAgentsByCategory,
  getFeaturedAgents,
  searchAgents
} from '../../data/agentCategories';
import AgentCard from './AgentCard';
import CategorySidebar from './CategorySidebar';

const MarketplaceLayout = () => {
  const [selectedCategory, setSelectedCategory] = useState(AGENT_CATEGORIES.FEATURED);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    premium: null, // null, true, false
    verified: null,
    rating: null,
    price: null
  });

  // Filtered and sorted agents
  const filteredAgents = useMemo(() => {
    let agents = [];
    
    // Search first
    if (searchQuery.trim()) {
      agents = searchAgents(searchQuery);
    } else if (selectedCategory === AGENT_CATEGORIES.FEATURED) {
      agents = getFeaturedAgents();
    } else if (selectedSubcategory) {
      agents = MARKETPLACE_AGENTS.filter(agent => 
        agent.category === selectedCategory && agent.subcategory === selectedSubcategory
      );
    } else {
      agents = getAgentsByCategory(selectedCategory);
    }

    // Apply filters
    if (filters.premium !== null) {
      agents = agents.filter(agent => agent.premium === filters.premium);
    }
    if (filters.verified !== null) {
      agents = agents.filter(agent => agent.verified === filters.verified);
    }
    if (filters.rating) {
      agents = agents.filter(agent => agent.rating >= filters.rating);
    }

    // Sort agents
    switch (sortBy) {
      case 'popular':
        agents.sort((a, b) => b.installs - a.installs);
        break;
      case 'rating':
        agents.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        agents.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        // Mock: reverse current order
        agents.reverse();
        break;
      default:
        break;
    }

    return agents;
  }, [selectedCategory, selectedSubcategory, searchQuery, sortBy, filters]);

  const handleCategoryChange = (category, subcategory = null) => {
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);
    setSearchQuery('');
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType] === value ? null : value
    }));
  };

  return (
    <div className="min-h-screen" style={{backgroundColor: 'var(--bg-secondary)'}}>
      {/* Marketplace Header */}
      <div className="border-b" style={{
        backgroundColor: 'var(--bg-primary)',
        borderColor: 'var(--border-color)'
      }}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{color: 'var(--text-primary)'}}>
                🏪 Iopeer Marketplace
              </h1>
              <p className="text-lg" style={{color: 'var(--text-secondary)'}}>
                Descubre y utiliza agentes IA especializados para potenciar tu trabajo
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Crown size={20} />
                  <span className="font-semibold">{MARKETPLACE_AGENTS.length} Agentes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{color: 'var(--text-tertiary)'}} size={20} />
              <input
                type="text"
                placeholder="Buscar agentes por nombre, función o tecnología..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border text-lg"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 rounded-lg border"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              >
                <option value="popular">Más Popular</option>
                <option value="rating">Mejor Valorados</option>
                <option value="name">Alfabético</option>
                <option value="newest">Más Nuevos</option>
              </select>

              {/* Filters Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg border transition-colors ${
                  showFilters ? 'bg-blue-50 border-blue-300' : ''
                }`}
                style={{
                  backgroundColor: showFilters ? 'var(--accent-primary)' : 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: showFilters ? 'white' : 'var(--text-primary)'
                }}
              >
                <Filter size={16} />
                <span>Filtros</span>
              </button>

              {/* View Mode Toggle */}
              <div className="flex border rounded-lg" style={{borderColor: 'var(--border-color)'}}>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 ${viewMode === 'grid' ? 'bg-blue-100' : ''}`}
                  style={{
                    backgroundColor: viewMode === 'grid' ? 'var(--accent-primary)' : 'transparent',
                    color: viewMode === 'grid' ? 'white' : 'var(--text-primary)'
                  }}
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 ${viewMode === 'list' ? 'bg-blue-100' : ''}`}
                  style={{
                    backgroundColor: viewMode === 'list' ? 'var(--accent-primary)' : 'transparent',
                    color: viewMode === 'list' ? 'white' : 'var(--text-primary)'
                  }}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {showFilters && (
            <div className="mt-4 p-4 rounded-lg" style={{backgroundColor: 'var(--bg-tertiary)'}}>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleFilterChange('premium', false)}
                  className={`px-3 py-1 rounded-full text-sm border ${
                    filters.premium === false ? 'bg-green-100 border-green-300' : ''
                  }`}
                  style={{
                    backgroundColor: filters.premium === false ? 'var(--success)' : 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: filters.premium === false ? 'white' : 'var(--text-primary)'
                  }}
                >
                  Gratis
                </button>
                
                <button
                  onClick={() => handleFilterChange('premium', true)}
                  className={`px-3 py-1 rounded-full text-sm border ${
                    filters.premium === true ? 'bg-yellow-100 border-yellow-300' : ''
                  }`}
                  style={{
                    backgroundColor: filters.premium === true ? 'var(--warning)' : 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: filters.premium === true ? 'white' : 'var(--text-primary)'
                  }}
                >
                  Premium
                </button>

                <button
                  onClick={() => handleFilterChange('verified', true)}
                  className={`px-3 py-1 rounded-full text-sm border ${
                    filters.verified === true ? 'bg-blue-100 border-blue-300' : ''
                  }`}
                  style={{
                    backgroundColor: filters.verified === true ? 'var(--accent-primary)' : 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: filters.verified === true ? 'white' : 'var(--text-primary)'
                  }}
                >
                  Verificados
                </button>

                <button
                  onClick={() => handleFilterChange('rating', 4.5)}
                  className={`px-3 py-1 rounded-full text-sm border ${
                    filters.rating === 4.5 ? 'bg-yellow-100 border-yellow-300' : ''
                  }`}
                  style={{
                    backgroundColor: filters.rating === 4.5 ? 'var(--warning)' : 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: filters.rating === 4.5 ? 'white' : 'var(--text-primary)'
                  }}
                >
                  ⭐ 4.5+
                </button>

                {Object.values(filters).some(f => f !== null) && (
                  <button
                    onClick={() => setFilters({ premium: null, verified: null, rating: null, price: null })}
                    className="px-3 py-1 rounded-full text-sm border border-red-300 text-red-600 hover:bg-red-50"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar */}
        <CategorySidebar
          selectedCategory={selectedCategory}
          selectedSubcategory={selectedSubcategory}
          onCategoryChange={handleCategoryChange}
        />

        {/* Agents Grid/List */}
        <div className="flex-1 p-6">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold" style={{color: 'var(--text-primary)'}}>
                {searchQuery ? `Resultados para "${searchQuery}"` : 
                 selectedSubcategory ? 
                   `${CATEGORY_LABELS[selectedCategory]} - ${SUBCATEGORIES[selectedCategory]?.find(s => s.id === selectedSubcategory)?.label}` :
                   CATEGORY_LABELS[selectedCategory]
                }
              </h2>
              <p className="text-sm mt-1" style={{color: 'var(--text-secondary)'}}>
                {filteredAgents.length} agente{filteredAgents.length !== 1 ? 's' : ''} encontrado{filteredAgents.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Agents Display */}
          {filteredAgents.length > 0 ? (
            <div className={`${
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }`}>
              {filteredAgents.map(agent => (
                <AgentCard 
                  key={agent.id} 
                  agent={agent} 
                  viewMode={viewMode}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2" style={{color: 'var(--text-primary)'}}>
                No se encontraron agentes
              </h3>
              <p className="text-gray-500">
                {searchQuery ? 
                  'Intenta con otros términos de búsqueda o ajusta los filtros' :
                  'No hay agentes en esta categoría aún'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketplaceLayout;
