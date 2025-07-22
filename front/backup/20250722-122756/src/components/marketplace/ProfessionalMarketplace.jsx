import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, Grid, List, Star, Heart, ShoppingCart, Zap, Crown, Shield, TrendingUp } from 'lucide-react';
import { 
  AGENT_CATEGORIES, 
  CATEGORY_LABELS, 
  MARKETPLACE_AGENTS,
  getAgentsByCategory,
  getFeaturedAgents,
  searchAgents
} from '../../data/agentCategories';
import ProfessionalAgentCard from './ProfessionalAgentCard';

const ProfessionalMarketplace = () => {
  const [selectedCategory, setSelectedCategory] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: 'all',
    rating: 0,
    verified: false,
    premium: null
  });

  // Category tabs estilo Claude
  const categoryTabs = [
    { id: 'featured', label: 'Destacados', icon: '⭐' },
    { id: 'development', label: 'Desarrollo', icon: '👨‍💻' },
    { id: 'productivity', label: 'Productividad', icon: '📈' },
    { id: 'research', label: 'Investigación', icon: '🔬' },
    { id: 'creativity', label: 'Creatividad', icon: '🎨' },
    { id: 'business', label: 'Negocios', icon: '💼' },
    { id: 'education', label: 'Educación', icon: '🎓' },
    { id: 'lifestyle', label: 'Estilo de Vida', icon: '🌟' }
  ];

  // Filtered and sorted agents
  const filteredAgents = useMemo(() => {
    let agents = [];
    
    if (searchQuery.trim()) {
      agents = searchAgents(searchQuery);
    } else if (selectedCategory === 'featured') {
      agents = getFeaturedAgents();
    } else {
      agents = getAgentsByCategory(selectedCategory);
    }

    // Apply filters
    if (filters.priceRange === 'free') {
      agents = agents.filter(agent => !agent.premium);
    } else if (filters.priceRange === 'premium') {
      agents = agents.filter(agent => agent.premium);
    }

    if (filters.rating > 0) {
      agents = agents.filter(agent => agent.rating >= filters.rating);
    }

    if (filters.verified) {
      agents = agents.filter(agent => agent.verified);
    }

    // Sort agents
    switch (sortBy) {
      case 'popular':
        agents.sort((a, b) => b.installs - a.installs);
        break;
      case 'rating':
        agents.sort((a, b) => b.rating - a.rating);
        break;
      case 'price-low':
        agents.sort((a, b) => (a.premium ? 1 : 0) - (b.premium ? 1 : 0));
        break;
      case 'price-high':
        agents.sort((a, b) => (b.premium ? 1 : 0) - (a.premium ? 1 : 0));
        break;
      case 'newest':
        agents.reverse();
        break;
      default:
        break;
    }

    return agents;
  }, [selectedCategory, searchQuery, sortBy, filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType] === value ? (filterType === 'rating' ? 0 : null) : value
    }));
  };

  const clearFilters = () => {
    setFilters({
      priceRange: 'all',
      rating: 0,
      verified: false,
      premium: null
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== null && value !== 'all' && value !== false && value !== 0
  );

  return (
    <div className="professional-marketplace">
      {/* Hero Header */}
      <div className="marketplace-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>🏪 Marketplace de Agentes IA</h1>
            <p>Descubre y utiliza los mejores agentes especializados para potenciar tu productividad</p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">{MARKETPLACE_AGENTS.length}</span>
                <span className="stat-label">Agentes Disponibles</span>
              </div>
              <div className="stat">
                <span className="stat-number">150K+</span>
                <span className="stat-label">Instalaciones</span>
              </div>
              <div className="stat">
                <span className="stat-number">4.8</span>
                <span className="stat-label">Rating Promedio</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-cards">
              <div className="floating-card card-1">
                <div className="card-icon">🤖</div>
                <div className="card-title">Code Assistant</div>
              </div>
              <div className="floating-card card-2">
                <div className="card-icon">📊</div>
                <div className="card-title">Data Wizard</div>
              </div>
              <div className="floating-card card-3">
                <div className="card-icon">✍️</div>
                <div className="card-title">Content Creator</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-section">
        <div className="search-container">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="¿Qué tipo de agente necesitas? Ej: 'análisis de datos', 'generación de código'..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="search-button">
            Buscar
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="category-tabs">
        <div className="tabs-container">
          {categoryTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setSelectedCategory(tab.id);
                setSearchQuery('');
              }}
              className={`category-tab ${selectedCategory === tab.id ? 'active' : ''}`}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
              {tab.id === selectedCategory && (
                <div className="tab-indicator"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="controls-section">
        <div className="controls-container">
          <div className="filters-group">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`filter-button ${showFilters ? 'active' : ''}`}
            >
              <SlidersHorizontal size={16} />
              <span>Filtros</span>
              {hasActiveFilters && <div className="filter-dot"></div>}
            </button>

            {/* Quick Filters */}
            <div className="quick-filters">
              <button
                onClick={() => handleFilterChange('priceRange', 'free')}
                className={`quick-filter ${filters.priceRange === 'free' ? 'active' : ''}`}
              >
                Gratis
              </button>
              <button
                onClick={() => handleFilterChange('verified', true)}
                className={`quick-filter ${filters.verified ? 'active' : ''}`}
              >
                <Shield size={14} />
                Verificados
              </button>
              <button
                onClick={() => handleFilterChange('rating', 4.5)}
                className={`quick-filter ${filters.rating === 4.5 ? 'active' : ''}`}
              >
                <Star size={14} />
                4.5+
              </button>
            </div>

            {hasActiveFilters && (
              <button onClick={clearFilters} className="clear-filters">
                Limpiar filtros
              </button>
            )}
          </div>

          <div className="view-controls">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="popular">Más Popular</option>
              <option value="rating">Mejor Valorados</option>
              <option value="price-low">Precio: Menor a Mayor</option>
              <option value="price-high">Precio: Mayor a Menor</option>
              <option value="newest">Más Nuevos</option>
            </select>

            <div className="view-toggle">
              <button
                onClick={() => setViewMode('grid')}
                className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Extended Filters Panel */}
        {showFilters && (
          <div className="extended-filters">
            <div className="filter-group">
              <h4>Precio</h4>
              <div className="filter-options">
                <label>
                  <input
                    type="radio"
                    name="priceRange"
                    checked={filters.priceRange === 'all'}
                    onChange={() => handleFilterChange('priceRange', 'all')}
                  />
                  Todos
                </label>
                <label>
                  <input
                    type="radio"
                    name="priceRange"
                    checked={filters.priceRange === 'free'}
                    onChange={() => handleFilterChange('priceRange', 'free')}
                  />
                  Gratis
                </label>
                <label>
                  <input
                    type="radio"
                    name="priceRange"
                    checked={filters.priceRange === 'premium'}
                    onChange={() => handleFilterChange('priceRange', 'premium')}
                  />
                  Premium
                </label>
              </div>
            </div>

            <div className="filter-group">
              <h4>Rating</h4>
              <div className="rating-filters">
                {[4.5, 4.0, 3.5, 3.0].map(rating => (
                  <button
                    key={rating}
                    onClick={() => handleFilterChange('rating', rating)}
                    className={`rating-filter ${filters.rating === rating ? 'active' : ''}`}
                  >
                    <Star size={14} fill="currentColor" />
                    {rating}+
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h4>Características</h4>
              <div className="feature-filters">
                <label>
                  <input
                    type="checkbox"
                    checked={filters.verified}
                    onChange={(e) => handleFilterChange('verified', e.target.checked)}
                  />
                  Solo verificados
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="results-section">
        <div className="results-header">
          <h2>
            {searchQuery ? (
              <>Resultados para "<span className="search-term">{searchQuery}</span>"</>
            ) : (
              CATEGORY_LABELS[selectedCategory]
            )}
          </h2>
          <p className="results-count">
            {filteredAgents.length} agente{filteredAgents.length !== 1 ? 's' : ''} encontrado{filteredAgents.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Agents Grid */}
        {filteredAgents.length > 0 ? (
          <div className={`agents-container ${viewMode}`}>
            {filteredAgents.map(agent => (
              <ProfessionalAgentCard 
                key={agent.id} 
                agent={agent} 
                viewMode={viewMode}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No se encontraron agentes</h3>
            <p>
              {searchQuery ? 
                'Intenta con otros términos de búsqueda o ajusta los filtros' :
                'No hay agentes en esta categoría aún'
              }
            </p>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="clear-filters-button">
                Limpiar filtros
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalMarketplace;
