import React, { useState, useMemo } from 'react';
import { Search, Filter, Grid3X3, List, Star, Shield, Crown, TrendingUp } from 'lucide-react';
import { MARKETPLACE_AGENTS, searchAgents, getAgentsByCategory, getFeaturedAgents } from '../../data/agentCategories';

const OptimizedMarketplace = () => {
  const [selectedCategory, setSelectedCategory] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('popular');
  const [filters, setFilters] = useState({ priceRange: 'all', rating: 0, verified: false });

  const categoryTabs = [
    { id: 'featured', label: 'Destacados', icon: '⭐' },
    { id: 'development', label: 'Desarrollo', icon: '👨‍💻' },
    { id: 'productivity', label: 'Productividad', icon: '📈' },
    { id: 'research', label: 'Investigación', icon: '🔬' },
    { id: 'creativity', label: 'Creatividad', icon: '🎨' },
    { id: 'business', label: 'Negocios', icon: '💼' }
  ];

  const filteredAgents = useMemo(() => {
    let agents = searchQuery ? searchAgents(searchQuery) : 
                 selectedCategory === 'featured' ? getFeaturedAgents() : 
                 getAgentsByCategory(selectedCategory);

    // Apply filters efficiently
    if (filters.priceRange !== 'all') agents = agents.filter(a => filters.priceRange === 'free' ? !a.premium : a.premium);
    if (filters.rating > 0) agents = agents.filter(a => a.rating >= filters.rating);
    if (filters.verified) agents = agents.filter(a => a.verified);

    // Sort efficiently
    const sortFns = {
      popular: (a, b) => b.installs - a.installs,
      rating: (a, b) => b.rating - a.rating,
      newest: () => Math.random() - 0.5
    };
    return agents.sort(sortFns[sortBy] || sortFns.popular);
  }, [selectedCategory, searchQuery, sortBy, filters]);

  const AgentCard = ({ agent }) => (
    <div className="agent-card" onClick={() => console.log('Install:', agent.id)}>
      <div className="card-header">
        <div className={`agent-avatar ${agent.color}`}>
          <span>{agent.avatar}</span>
        </div>
        <div className="badges">
          {agent.verified && <span className="badge verified"><Shield size={12} />Verificado</span>}
          {agent.premium && <span className="badge premium"><Crown size={12} />Premium</span>}
          {agent.installs > 10000 && <span className="badge bestseller"><TrendingUp size={12} />Top</span>}
        </div>
      </div>
      
      <h3>{agent.name}</h3>
      <p>{agent.description}</p>
      
      <div className="rating">
        <Star size={12} fill="currentColor" />
        <span>{agent.rating}</span>
        <span>({agent.installs > 1000 ? `${Math.floor(agent.installs/1000)}k` : agent.installs})</span>
      </div>
      
      <div className="tags">
        {agent.tags.slice(0, 3).map(tag => <span key={tag} className="tag">{tag}</span>)}
      </div>
      
      <button className="install-btn">
        {agent.premium ? 'Probar Premium' : 'Instalar Gratis'}
      </button>
    </div>
  );

  return (
    <div className="optimized-marketplace">
      {/* Hero compacto pero completo */}
      <div className="hero">
        <h1>🏪 Marketplace de Agentes IA</h1>
        <p>Descubre y utiliza los mejores agentes especializados</p>
        <div className="stats">
          <span>{MARKETPLACE_AGENTS.length} Agentes</span>
          <span>150K+ Instalaciones</span>
          <span>4.8★ Rating</span>
        </div>
      </div>

      {/* Search optimizada */}
      <div className="search-bar">
        <Search size={20} />
        <input
          placeholder="¿Qué agente necesitas?"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Tabs optimizados */}
      <div className="category-tabs">
        {categoryTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setSelectedCategory(tab.id); setSearchQuery(''); }}
            className={selectedCategory === tab.id ? 'active' : ''}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Controls compactos */}
      <div className="controls">
        <div className="filters">
          <select value={filters.priceRange} onChange={(e) => setFilters({...filters, priceRange: e.target.value})}>
            <option value="all">Todos</option>
            <option value="free">Gratis</option>
            <option value="premium">Premium</option>
          </select>
          
          <label>
            <input type="checkbox" checked={filters.verified} onChange={(e) => setFilters({...filters, verified: e.target.checked})} />
            Solo verificados
          </label>
        </div>

        <div className="view-controls">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="popular">Más Popular</option>
            <option value="rating">Mejor Valorados</option>
            <option value="newest">Más Nuevos</option>
          </select>
          
          <button onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
            {viewMode === 'grid' ? <List size={16} /> : <Grid3X3 size={16} />}
          </button>
        </div>
      </div>

      {/* Results optimizados */}
      <div className="results">
        <h2>{searchQuery ? `Resultados para "${searchQuery}"` : categoryTabs.find(t => t.id === selectedCategory)?.label}</h2>
        <p>{filteredAgents.length} agentes encontrados</p>
        
        <div className={`agents-grid ${viewMode}`}>
          {filteredAgents.map(agent => <AgentCard key={agent.id} agent={agent} />)}
        </div>
      </div>
    </div>
  );
};

export default OptimizedMarketplace;
