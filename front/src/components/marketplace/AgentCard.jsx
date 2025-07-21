import React, { useState } from 'react';
import { 
  Star, Download, Shield, Crown, Users, 
  Play, Eye, Heart, Share2, MoreHorizontal 
} from 'lucide-react';

const AgentCard = ({ agent, viewMode = 'grid' }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  const handleInstall = () => {
    console.log('Installing agent:', agent.id);
    // TODO: Implement agent installation
  };

  const handleDemo = () => {
    setShowDemo(true);
    console.log('Starting demo for:', agent.id);
    // TODO: Implement agent demo
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // TODO: Implement like functionality
  };

  if (viewMode === 'list') {
    return (
      <div className="flex items-center p-4 rounded-lg border hover:shadow-md transition-all" style={{
        backgroundColor: 'var(--bg-primary)',
        borderColor: 'var(--border-color)'
      }}>
        {/* Avatar */}
        <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br ${agent.color} text-white mr-4`}>
          {agent.avatar}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg truncate" style={{color: 'var(--text-primary)'}}>
              {agent.name}
            </h3>
            {agent.verified && <Shield className="text-blue-500" size={16} />}
            {agent.premium && <Crown className="text-yellow-500" size={16} />}
          </div>
          
          <p className="text-sm mb-2 line-clamp-2" style={{color: 'var(--text-secondary)'}}>
            {agent.description}
          </p>

          <div className="flex items-center gap-4 text-xs" style={{color: 'var(--text-tertiary)'}}>
            <div className="flex items-center gap-1">
              <Star className="text-yellow-400" size={12} fill="currentColor" />
              <span>{agent.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={12} />
              <span>{agent.installs.toLocaleString()}</span>
            </div>
            <span className="text-gray-400">por {agent.author}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-4">
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            agent.premium 
              ? 'bg-yellow-100 text-yellow-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {agent.price}
          </span>
          
          <button
            onClick={handleInstall}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Instalar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative rounded-xl border overflow-hidden hover:shadow-xl transition-all duration-300" style={{
      backgroundColor: 'var(--bg-primary)',
      borderColor: 'var(--border-color)'
    }}>
      {/* Header with gradient */}
      <div className={`h-24 bg-gradient-to-br ${agent.color} relative`}>
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        
        {/* Agent Avatar */}
        <div className="absolute -bottom-6 left-4">
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${agent.color} flex items-center justify-center text-xl border-4 border-white shadow-lg`}>
            {agent.avatar}
          </div>
        </div>

        {/* Actions overlay */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleLike}
            className={`p-2 rounded-full ${isLiked ? 'bg-red-500 text-white' : 'bg-white text-gray-600'} shadow-md hover:scale-110 transition-all`}
          >
            <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
          </button>
          <button className="p-2 bg-white text-gray-600 rounded-full shadow-md hover:scale-110 transition-all">
            <Share2 size={14} />
          </button>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1">
          {agent.verified && (
            <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
              <Shield size={10} />
              <span>Verificado</span>
            </div>
          )}
          {agent.premium && (
            <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
              <Crown size={10} />
              <span>Premium</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pt-8">
        <div className="mb-3">
          <h3 className="font-semibold text-lg mb-1 line-clamp-1" style={{color: 'var(--text-primary)'}}>
            {agent.name}
          </h3>
          <p className="text-sm mb-2 line-clamp-2" style={{color: 'var(--text-secondary)'}}>
            {agent.description}
          </p>
          <p className="text-xs" style={{color: 'var(--text-tertiary)'}}>
            por {agent.author}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {agent.tags.slice(0, 3).map(tag => (
            <span 
              key={tag}
              className="px-2 py-1 rounded text-xs"
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-secondary)'
              }}
            >
              {tag}
            </span>
          ))}
          {agent.tags.length > 3 && (
            <span className="text-xs" style={{color: 'var(--text-tertiary)'}}>
              +{agent.tags.length - 3} más
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-4 text-sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Star className="text-yellow-400" size={14} fill="currentColor" />
              <span className="font-medium">{agent.rating}</span>
            </div>
            <div className="flex items-center gap-1" style={{color: 'var(--text-tertiary)'}}>
              <Download size={14} />
              <span>{agent.installs > 1000 ? `${Math.floor(agent.installs/1000)}k` : agent.installs}</span>
            </div>
          </div>
          
          <div className={`px-2 py-1 rounded text-xs font-medium ${
            agent.premium 
              ? 'bg-yellow-100 text-yellow-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {agent.price}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleInstall}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:shadow-lg transition-all"
          >
            Instalar
          </button>
          
          {agent.demo && (
            <button
              onClick={handleDemo}
              className="px-3 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
              style={{
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
            >
              <Play size={16} />
            </button>
          )}
          
          <button 
            className="px-3 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
            style={{
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
          >
            <Eye size={16} />
          </button>
        </div>
      </div>

      {/* Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full m-4">
            <h3 className="text-lg font-semibold mb-3">🚀 Demo de {agent.name}</h3>
            <p className="text-gray-600 mb-4">
              Prueba las capacidades de este agente en tiempo real.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDemo(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setShowDemo(false);
                  handleInstall();
                }}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg"
              >
                Iniciar Demo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentCard;
