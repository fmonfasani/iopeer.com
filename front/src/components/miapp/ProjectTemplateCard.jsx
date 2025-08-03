// front/src/components/miapp/ProjectTemplateCard.jsx
import React from 'react';
import { Clock, Zap, Code, Database, Smartphone } from 'lucide-react';

const ProjectTemplateCard = ({ template, onUse, disabled = false }) => {
  const getTemplateIcon = (templateName) => {
    const icons = {
      'E-commerce Store': <Database className="w-8 h-8" />,
      'Blog/Portfolio': <Code className="w-8 h-8" />,
      'SaaS MVP': <Zap className="w-8 h-8" />,
      'Mobile App': <Smartphone className="w-8 h-8" />
    };
    return icons[templateName] || <Code className="w-8 h-8" />;
  };

  const getComplexityColor = (complexity) => {
    switch(complexity) {
      case 'Fácil': return 'bg-green-100 text-green-700';
      case 'Intermedio': return 'bg-yellow-100 text-yellow-700';
      case 'Avanzado': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all ${
      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-blue-300'
    }`}>
      <div className="flex items-center mb-4">
        <div className="p-3 bg-blue-100 rounded-lg mr-4">
          {getTemplateIcon(template.name)}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{template.name}</h3>
          <p className="text-gray-600 text-sm">{template.description}</p>
        </div>
      </div>

      <div className="space-y-3">
        {/* Agentes incluidos */}
        <div>
          <div className="text-xs text-gray-500 mb-1">Agentes incluidos</div>
          <div className="flex flex-wrap gap-1">
            {template.agents.map((agent, i) => (
              <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                {agent}
              </span>
            ))}
          </div>
        </div>

        {/* Tiempo y complejidad */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center text-gray-500">
            <Clock className="w-3 h-3 mr-1" />
            <span>{template.time}</span>
          </div>
          <span className={`px-2 py-1 rounded text-xs ${getComplexityColor(template.complexity)}`}>
            {template.complexity}
          </span>
        </div>

        {/* Botón de acción */}
        <button
          className={`w-full mt-4 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            disabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
          onClick={() => !disabled && onUse(template)}
          disabled={disabled}
        >
          {disabled ? 'No disponible' : 'Usar Template'}
        </button>
      </div>
    </div>
  );
};
