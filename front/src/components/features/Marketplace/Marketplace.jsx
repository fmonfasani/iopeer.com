import React, { useState } from 'react';
import { BookOpen, Search, Star, Download } from 'lucide-react';
import { useMarketplace } from '../../../hooks/useIopeer';
import { MarketplaceLoadingState } from '../../ui/LoadingSpinner';
import ErrorDisplay from '../../ui/ErrorDisplay';
import { useNavigate } from 'react-router-dom';

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { featuredAgents, loading, error, reload } = useMarketplace();
  const navigate = useNavigate();

  if (loading) {
    return <MarketplaceLoadingState />;
  }

  if (error) {
    return (
      <ErrorDisplay
        error={{ message: error }}
        onRetry={reload}
        onGoHome={() => navigate('/dashboard')}
      />
    );
  }

  const filteredAgents = featuredAgents.filter(agent =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Buscar agentes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-xl font-bold mb-2">Descubre Agentes IA</h2>
        <p className="text-blue-100">
          Encuentra agentes especializados creados por la comunidad para potenciar tu productividad
        </p>
      </div>

      {filteredAgents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => (
            <div key={agent.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{agent.icon}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                      {agent.badge && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{agent.badge}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="text-yellow-400 fill-current" size={14} />
                      <span className="text-sm text-gray-600">{agent.rating}</span>
                      <span className="text-sm text-gray-400">•</span>
                      <span className="text-sm text-gray-600">{agent.installs} descargas</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4">{agent.description}</p>

              <div className="flex flex-wrap gap-1 mb-4">
                {agent.tags && agent.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                <Download size={16} />
                Instalar
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No se encontraron agentes</h3>
          <p className="text-gray-500">
            {searchQuery ? 'Intenta con otros términos de búsqueda' : 'No hay agentes disponibles en este momento.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
