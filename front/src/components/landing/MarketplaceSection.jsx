// src/components/landing/MarketplaceSection.jsx
import React from 'react';
import { ChevronRight } from 'lucide-react';
import AgentCard from './AgentCard';


const MarketplaceSection = ({ featuredAgents, onInstallAgent, onExploreMarketplace }) => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Marketplace de Agentes IA
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre, instala y comparte agentes especializados creados por la comunidad global de desarrolladores
          </p>
        </div>

        {/* Grid de Cards Cuadrados */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {featuredAgents.map((agent, index) => (
            <AgentCard 
              key={agent.id || index}
              agent={agent}
              onInstall={() => onInstallAgent(agent)}
            />
          ))}
        </div>

        <div className="text-center">
          <button 
            onClick={onExploreMarketplace}
            className="bg-gray-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors duration-300 flex items-center space-x-2 mx-auto"
          >
            <span>Explorar Marketplace Completo</span>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default MarketplaceSection;
