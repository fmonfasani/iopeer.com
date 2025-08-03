// front/src/pages/MiAppPage.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Code, Database, Globe, Settings, Play, Eye, Share, Download, Zap, Smartphone, LineChart } from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorDisplay from '../components/ui/ErrorDisplay';
import { useMiApp } from '../hooks/useMiApp';
import { useNavigate } from 'react-router-dom';

const MiAppPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  
  const {
    projects,
    appStats,
    loading,
    error,
    createProject,
    refreshProjects,
    deployProject,
    getProjectCode
  } = useMiApp();

  if (loading && projects.length === 0) {
    return (
      <div className="p-6">
        <LoadingSpinner size="xl" text="Cargando tus aplicaciones..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorDisplay 
          error={error}
          onRetry={refreshProjects}
          onGoHome={() => navigate('/dashboard')}
        />
      </div>
    );
  }

  const QuickActionCard = ({ icon: Icon, title, description, action, color = "blue", onClick }) => (
    <div 
      className={`bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all cursor-pointer hover:border-${color}-300`}
      onClick={onClick}
    >
      <div className={`w-12 h-12 bg-${color}-100 rounded-lg flex items-center justify-center mb-4`}>
        <Icon className={`w-6 h-6 text-${color}-600`} />
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      <button className={`text-${color}-600 hover:text-${color}-800 font-medium text-sm`}>
        {action} →
      </button>
    </div>
  );

  const ProjectCard = ({ project }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">{project.name}</h3>
          <p className="text-gray-600 text-sm">{project.description}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          project.status === 'deployed' ? 'bg-green-100 text-green-800' :
          project.status === 'building' ? 'bg-yellow-100 text-yellow-800' :
          project.status === 'ready' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {project.status === 'deployed' ? 'Desplegado' : 
           project.status === 'building' ? 'Construyendo' : 
           project.status === 'ready' ? 'Listo' : 'Borrador'}
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="text-xs text-gray-500 mb-1">Agentes utilizados</div>
          <div className="flex flex-wrap gap-1">
            {project.agents_used.map((agent, index) => (
              <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                {agent}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Creado: {new Date(project.created_at).toLocaleDateString()}</span>
          {project.last_deploy && (
            <span>Último deploy: {new Date(project.last_deploy).toLocaleDateString()}</span>
          )}
        </div>

        <div className="flex items-center space-x-2 pt-3 border-t border-gray-100">
          {project.url ? (
            <button 
              className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
              onClick={() => window.open(project.url, '_blank')}
            >
              <Globe className="w-4 h-4" />
              <span>Ver App</span>
            </button>
          ) : (
            <button 
              className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
              onClick={() => deployProject(project.id)}
            >
              <Play className="w-4 h-4" />
              <span>Desplegar</span>
            </button>
          )}
          
          <button 
            className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
            onClick={() => getProjectCode(project.id)}
          >
            <Code className="w-4 h-4" />
            <span>Código</span>
          </button>
          
          <button className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200">
            <Settings className="w-4 h-4" />
            <span>Config</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">MI APP</h1>
            <p className="text-gray-600">Gestiona tus aplicaciones generadas con agentes IA</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center space-x-2"
              onClick={refreshProjects}
            >
              <Download className="w-4 h-4" />
              <span>Exportar Todo</span>
            </button>
            <button 
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              onClick={() => setActiveTab('templates')}
            >
              <Plus className="w-4 h-4" />
              <span>Nueva App</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">{appStats.total_projects}</div>
            <div className="text-sm text-gray-600">Total Proyectos</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-green-600">{appStats.active_projects}</div>
            <div className="text-sm text-gray-600">Proyectos Activos</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-purple-600">{appStats.total_deployments}</div>
            <div className="text-sm text-gray-600">Deployments</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-orange-600">{appStats.total_agents_used}</div>
            <div className="text-sm text-gray-600">Agentes Usados</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-emerald-600">{appStats.success_rate}%</div>
            <div className="text-sm text-gray-600">Tasa de Éxito</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', name: 'Vista General', icon: Eye },
            { id: 'projects', name: 'Mis Proyectos', icon: Code },
            { id: 'templates', name: 'Templates', icon: Zap },
            { id: 'analytics', name: 'Analytics', icon: LineChart }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <QuickActionCard
                icon={Plus}
                title="Crear App desde Template"
                description="Inicia con plantillas predefinidas optimizadas"
                action="Explorar Templates"
                color="blue"
                onClick={() => setActiveTab('templates')}
              />
              <QuickActionCard
                icon={Zap}
                title="Workflow Automático"
                description="Deja que los agentes construyan tu app completa"
                action="Iniciar Workflow"
                color="purple"
                onClick={() => navigate('/workflows')}
              />
              <QuickActionCard
                icon={Code}
                title="Proyecto Personalizado"
                description="Configura agentes específicos para tu necesidad"
                action="Configurar Proyecto"
                color="green"
                onClick={() => createProject()}
              />
            </div>
          </div>

          {/* Recent Projects */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Proyectos Recientes</h2>
              <button 
                onClick={() => setActiveTab('projects')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Ver todos →
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {projects.slice(0, 2).map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Todos los Proyectos</h2>
            <div className="flex items-center space-x-3">
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option>Todos los estados</option>
                <option>Desplegados</option>
                <option>En construcción</option>
                <option>Listos</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option>Ordenar por fecha</option>
                <option>Ordenar por nombre</option>
                <option>Ordenar por estado</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
            
            {/* Add New Project Card */}
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center hover:border-blue-300 cursor-pointer transition-colors"
              onClick={() => createProject()}
            >
              <Plus className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">Nuevo Proyecto</h3>
              <p className="text-gray-600 text-sm text-center">Crea una nueva aplicación con agentes IA</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Templates de Aplicaciones</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "E-commerce Store",
                description: "Tienda online completa con carrito y pagos",
                agents: ["UI Generator", "Backend Agent", "Payment Agent", "SEO Agent"],
                time: "15 min",
                complexity: "Intermedio",
                icon: <Database className="w-8 h-8" />
              },
              {
                name: "Blog/Portfolio",
                description: "Blog personal con CMS y portfolio",
                agents: ["UI Generator", "Content Agent", "SEO Agent"],
                time: "8 min",
                complexity: "Fácil",
                icon: <Code className="w-8 h-8" />
              },
              {
                name: "SaaS MVP",
                description: "Landing + Dashboard + API básica",
                agents: ["UI Generator", "Backend Agent", "Auth Agent", "Analytics"],
                time: "25 min",
                complexity: "Avanzado",
                icon: <Zap className="w-8 h-8" />
              },
              {
                name: "Mobile App",
                description: "App móvil con React Native",
                agents: ["Mobile UI Agent", "Backend Agent", "Push Notifications"],
                time: "30 min",
                complexity: "Avanzado",
                icon: <Smartphone className="w-8 h-8" />
              }
            ].map((template, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg mr-4">
                    {template.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    <p className="text-gray-600 text-sm">{template.description}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
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
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>⏱️ {template.time}</span>
                    <span className={`px-2 py-1 rounded ${
                      template.complexity === 'Fácil' ? 'bg-green-100 text-green-700' :
                      template.complexity === 'Intermedio' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {template.complexity}
                    </span>
                  </div>
                  
                  <button 
                    className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    onClick={() => createProject({ template: template.name })}
                  >
                    Usar Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Analytics de Proyectos</h2>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-center text-gray-500">
              <LineChart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">Analytics Detallados</h3>
              <p className="text-sm">Esta sección mostrará métricas detalladas de tus proyectos, tiempo de construcción, agentes más utilizados, y más.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MiAppPage;
