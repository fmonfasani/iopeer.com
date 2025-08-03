

// front/src/components/miapp/ProjectCard.jsx
import { Globe, Play, Code, Settings, Calendar, Users } from 'lucide-react';

export const ProjectCard = ({ project, onDeploy, onGetCode, onConfigure, onViewApp }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{project.name}</h3>
          <p className="text-gray-600 text-sm">{project.description}</p>
        </div>
        <ProjectStatusBadge status={project.status} />
      </div>

      {/* Agentes utilizados */}
      <div className="mb-3">
        <div className="text-xs text-gray-500 mb-1">Agentes utilizados</div>
        <div className="flex flex-wrap gap-1">
          {project.agents_used.map((agent, index) => (
            <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
              {agent}
            </span>
          ))}
        </div>
      </div>

      {/* Metadatos */}
      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
        <div className="flex items-center">
          <Calendar className="w-3 h-3 mr-1" />
          <span>Creado: {new Date(project.created_at).toLocaleDateString()}</span>
        </div>
        {project.last_deploy && (
          <div className="flex items-center">
            <span>Deploy: {new Date(project.last_deploy).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {/* Acciones */}
      <div className="flex items-center space-x-2 pt-3 border-t border-gray-100">
        {project.url ? (
          <button
            className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 transition-colors"
            onClick={() => onViewApp && onViewApp(project)}
          >
            <Globe className="w-4 h-4" />
            <span>Ver App</span>
          </button>
        ) : (
          <button
            className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors"
            onClick={() => onDeploy && onDeploy(project.id)}
          >
            <Play className="w-4 h-4" />
            <span>Desplegar</span>
          </button>
        )}

        <button
          className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors"
          onClick={() => onGetCode && onGetCode(project.id)}
        >
          <Code className="w-4 h-4" />
          <span>Código</span>
        </button>

        <button
          className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors"
          onClick={() => onConfigure && onConfigure(project)}
        >
          <Settings className="w-4 h-4" />
          <span>Config</span>
        </button>
      </div>
    </div>
  );
};
