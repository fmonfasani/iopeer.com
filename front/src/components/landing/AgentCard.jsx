// src/components/landing/AgentCard.jsx
import React, { useState } from 'react';
import { Star, Download, Loader } from 'lucide-react';

const AgentCard = ({ agent, onInstall }) => {
  const [isInstalling, setIsInstalling] = useState(false);

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      await onInstall();
    } catch (error) {
      console.error('Error installing agent:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'Gratis':
      case 'Más vendido':
        return 'bg-green-500';
      case 'Premium':
      case 'Popular':
        return 'bg-blue-500';
      case 'Enterprise':
      case 'Pro':
        return 'bg-purple-500';
      case 'Nuevo':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3">
      {/* Header del Card - Cuadrado */}
      <div className={`h-48 bg-gradient-to-br ${agent.color} relative flex items-center justify-center`}>
        <div className="text-6xl">{agent.icon}</div>
        
        {/* Badge */}
        {agent.badge && (
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getBadgeColor(agent.badge)}`}>
              {agent.badge}
            </span>
          </div>
        )}

        {/* Rating en esquina */}
        <div className="absolute bottom-4 left-4 flex items-center space-x-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
          <Star className="text-yellow-300 fill-current" size={14} />
          <span className="text-white font-medium text-sm">{agent.rating}</span>
        </div>
      </div>
      
      {/* Contenido del Card */}
      <div className="p-6 h-64 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">{agent.name}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{agent.description}</p>
          
          {/* Features Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {agent.features?.slice(0, 3).map((feature, idx) => (
              <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                {feature}
              </span>
            ))}
            {agent.features?.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                +{agent.features.length - 3}
              </span>
            )}
          </div>
        </div>
        
        {/* Footer del Card */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">{agent.downloads} descargas</span>
            <span className="font-bold text-lg text-gray-900">{agent.price}</span>
          </div>
          
          <button 
            onClick={handleInstall}
            disabled={isInstalling}
            className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 flex items-center justify-center space-x-2 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isInstalling ? (
              <>
                <Loader className="animate-spin" size={18} />
                <span>Instalando...</span>
              </>
            ) : (
              <>
                <Download size={18} className="group-hover:animate-bounce" />
                <span>Instalar Agente</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentCard;
