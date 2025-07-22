import React, { useState } from 'react';
import {
  X, Star, Download, Shield, Crown, Play, Heart, Share2,
  Clock, Users, CheckCircle, AlertCircle, ExternalLink,
  Code, Database, Palette, TrendingUp
} from 'lucide-react';

const AgentDetail = ({ agent, isOpen, onClose, onInstall, onDemo }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLiked, setIsLiked] = useState(false);

  if (!isOpen || !agent) return null;

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: <CheckCircle size={16} /> },
    { id: 'features', label: 'Características', icon: <Star size={16} /> },
    { id: 'reviews', label: 'Reseñas', icon: <Users size={16} /> },
    { id: 'changelog', label: 'Actualizaciones', icon: <Clock size={16} /> }
  ];

  const mockReviews = [
    {
      id: 1,
      user: 'Carlos M.',
      rating: 5,
      date: '2024-01-15',
      comment: 'Excelente agente, me ha ahorrado horas de trabajo en análisis de datos.',
      verified: true
    },
    {
      id: 2,
      user: 'Ana R.',
      rating: 4,
      date: '2024-01-10',
      comment: 'Muy útil para automatizar tareas repetitivas. Fácil de usar.',
      verified: true
    },
    {
      id: 3,
      user: 'Miguel S.',
      rating: 5,
      date: '2024-01-08',
      comment: 'Impresionante calidad de código generado. Lo recomiendo totalmente.',
      verified: false
    }
  ];

  const mockChangelog = [
    {
      version: '2.1.0',
      date: '2024-01-20',
      changes: [
        'Mejoras en la generación de código Python',
        'Nuevo soporte para React Hooks',
        'Corrección de bugs menores'
      ]
    },
    {
      version: '2.0.0',
      date: '2024-01-01',
      changes: [
        'Interfaz completamente rediseñada',
        'Soporte para múltiples lenguajes',
        'Integración con VS Code'
      ]
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center space-x-4">
            <div className={`w-16 h-16 bg-gradient-to-r ${agent.color || 'from-blue-500 to-purple-600'} rounded-xl flex items-center justify-center text-3xl`}>
              {agent.avatar || '🤖'}
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <h2 className="text-2xl font-bold text-white">{agent.name}</h2>
                {agent.verified && <Shield className="w-5 h-5 text-blue-400" />}
                {agent.premium && <Crown className="w-5 h-5 text-yellow-400" />}
              </div>
              <p className="text-slate-400">por {agent.author}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2 rounded-lg transition-colors ${
                isLiked ? 'bg-red-500/20 text-red-400' : 'bg-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
            </button>
            <button className="p-2 bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors">
              <Share2 size={20} />
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 border-b border-slate-700">
          <div className="p-4 text-center border-r border-slate-700">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-xl font-bold text-white">{agent.rating}</span>
            </div>
            <p className="text-xs text-slate-400">Rating</p>
          </div>
          <div className="p-4 text-center border-r border-slate-700">
            <div className="text-xl font-bold text-white">{agent.installs}</div>
            <p className="text-xs text-slate-400">Instalaciones</p>
          </div>
          <div className="p-4 text-center border-r border-slate-700">
            <div className="text-xl font-bold text-emerald-400">{agent.price}</div>
            <p className="text-xs text-slate-400">Precio</p>
          </div>
          <div className="p-4 text-center">
            <div className="text-xl font-bold text-white">v2.1</div>
            <p className="text-xs text-slate-400">Versión</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 transition-colors ${
                activeTab === tab.id
                  ? 'bg-slate-700 text-white border-b-2 border-emerald-500'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {tab.icon}
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Descripción</h3>
                <p className="text-slate-300 leading-relaxed">
                  {agent.longDescription || agent.description}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Tecnologías</h3>
                <div className="flex flex-wrap gap-2">
                  {agent.tags?.map(tag => (
                    <span key={tag} className="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {agent.capabilities && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Capacidades principales</h3>
                  <ul className="space-y-2">
                    {agent.capabilities.map((capability, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span className="text-slate-300">{capability}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'features' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Características técnicas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Code className="w-5 h-5 text-blue-400" />
                    <h4 className="font-medium text-white">Integración</h4>
                  </div>
                  <p className="text-sm text-slate-400">API REST y WebSocket</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Database className="w-5 h-5 text-green-400" />
                    <h4 className="font-medium text-white">Datos</h4>
                  </div>
                  <p className="text-sm text-slate-400">CSV, JSON, SQL compatible</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Palette className="w-5 h-5 text-purple-400" />
                    <h4 className="font-medium text-white">Personalización</h4>
                  </div>
                  <p className="text-sm text-slate-400">Configuración avanzada</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-orange-400" />
                    <h4 className="font-medium text-white">Performance</h4>
                  </div>
                  <p className="text-sm text-slate-400">Optimizado para velocidad</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Reseñas de usuarios</h3>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-white font-medium">{agent.rating}</span>
                  <span className="text-slate-400 text-sm">({mockReviews.length} reseñas)</span>
                </div>
              </div>

              <div className="space-y-4">
                {mockReviews.map(review => (
                  <div key={review.id} className="bg-slate-700/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-white">{review.user}</span>
                        {review.verified && (
                          <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-1 rounded">
                            Verificado
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-slate-600'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-300 text-sm mb-2">{review.comment}</p>
                    <p className="text-slate-500 text-xs">{new Date(review.date).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'changelog' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Historial de actualizaciones</h3>
              <div className="space-y-4">
                {mockChangelog.map(version => (
                  <div key={version.version} className="border-l-2 border-emerald-500 pl-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="bg-emerald-500/20 text-emerald-400 text-sm px-2 py-1 rounded font-mono">
                        v{version.version}
                      </span>
                      <span className="text-slate-400 text-sm">{new Date(version.date).toLocaleDateString()}</span>
                    </div>
                    <ul className="space-y-1">
                      {version.changes.map((change, index) => (
                        <li key={index} className="text-slate-300 text-sm flex items-start space-x-2">
                          <span className="text-emerald-400 mt-1">•</span>
                          <span>{change}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {agent.demo && (
                <button
                  onClick={() => onDemo?.(agent)}
                  className="flex items-center space-x-2 border border-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <Play size={16} />
                  <span>Ver demo</span>
                </button>
              )}
              <button className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors">
                <ExternalLink size={16} />
                <span>Ver documentación</span>
              </button>
            </div>

            <button
              onClick={() => onInstall?.(agent)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
            >
              <Download size={16} />
              <span>Instalar agente</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDetail;
