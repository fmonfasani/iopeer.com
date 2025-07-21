import React, { useState } from 'react';
import { Star, Shield, Crown, Play, Download } from 'lucide-react';

const AgentCard = ({ agent, onInstall, onDemo }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all duration-300 card-hover"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-r ${agent.color || 'from-blue-500 to-purple-600'} rounded-xl flex items-center justify-center text-2xl`}>
          {agent.avatar || '🤖'}
        </div>
        <div className="flex items-center space-x-1">
          {agent.verified && <Shield className="w-4 h-4 text-blue-400" />}
          {agent.premium && <Crown className="w-4 h-4 text-yellow-400" />}
        </div>
      </div>

      {/* Content */}
      <h3 className="text-lg font-bold text-white mb-2">{agent.name}</h3>
      
      <div className="flex items-center space-x-2 mb-3">
        <div className="flex items-center space-x-1">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-sm font-medium text-white">{agent.rating}</span>
        </div>
        <span className="text-slate-400 text-sm">
          • {typeof agent.installs === 'number' ? 
            (agent.installs > 1000 ? `${Math.floor(agent.installs/1000)}k` : agent.installs) : 
            agent.installs} instalaciones
        </span>
      </div>

      <p className="text-slate-400 text-sm mb-4 leading-relaxed line-clamp-3">
        {agent.description}
      </p>

      {/* Tags */}
      {agent.tags && (
        <div className="flex flex-wrap gap-1 mb-4">
          {agent.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded">
              {tag}
            </span>
          ))}
          {agent.tags.length > 3 && (
            <span className="bg-slate-600 text-slate-400 text-xs px-2 py-1 rounded">
              +{agent.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Price and Actions */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-lg font-bold text-emerald-400">
          {agent.price || 'Gratis'}
        </div>
        {agent.demo && isHovered && (
          <button
            onClick={() => onDemo?.(agent)}
            className="flex items-center space-x-1 text-slate-400 hover:text-white transition-colors"
          >
            <Play size={14} />
            <span className="text-sm">Demo</span>
          </button>
        )}
      </div>

      {/* Install Button */}
      <button
        onClick={() => onInstall?.(agent)}
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
      >
        <Download size={16} />
        <span>Instalar</span>
      </button>
    </div>
  );
};

export default AgentCard;
