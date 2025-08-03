import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Play, 
  Edit, 
  Trash2, 
  Copy, 
  Download,
  Clock,
  Users,
  Zap,
  BarChart3,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  FileText,
  Sparkles
} from 'lucide-react';
import { useIopeer } from '../hooks/useIopeer';
import WorkflowEditor from '../components/features/WorkflowEditor/WorkflowEditor';

const Workflows = () => {
  const {
    workflows: workflowList,

    templates,
    workflowStats: stats,
    loading,
    error,
    isExecuting,
    activeExecution,
    createWorkflow: create,
    executeWorkflow: execute,
    createWorkflowFromTemplate: createFromTemplate,
    loadWorkflows,
    loadTemplates,
    clearWorkflowError: clearError

  } = useIopeer();
  const [currentView, setCurrentView] = useState('list'); // 'list', 'editor', 'templates'
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [showExecutionModal, setShowExecutionModal] = useState(false);

  // Cargar datos al montar
  useEffect(() => {
    loadWorkflows();
    loadTemplates();
  }, [loadWorkflows, loadTemplates]);

  // Estados computados
  const hasWorkflows = workflowList.length > 0;
  const hasTemplates = Object.keys(templates).length > 0;

  // Funciones de manejo
  const handleCreateWorkflow = () => {
    setCurrentView('editor');
    setSelectedWorkflow(null);
  };

  const handleEditWorkflow = (workflow) => {
    setCurrentView('editor');
    setSelectedWorkflow(workflow);
  };

  const handleExecuteWorkflow = async (workflowId) => {
    try {
      setShowExecutionModal(true);
      await executeWorkflow(workflowId, {});
    } catch (error) {
      console.error('Error executing workflow:', error);
    }
  };

  const handleCreateFromTemplate = async (templateId) => {
    try {
      await createFromTemplate(templateId);
      setCurrentView('list');
    } catch (error) {
      console.error('Error creating from template:', error);
    }
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedWorkflow(null);
    loadWorkflows(); // Recargar la lista
  };

  // Componente de estadísticas
  const StatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Zap className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Workflows</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-2 bg-green-100 rounded-lg">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Completados</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.byStatus.completed || 0}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Clock className="h-6 w-6 text-yellow-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">En Ejecución</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.byStatus.running || 0}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Users className="h-6 w-6 text-purple-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Nodos</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.totalNodes}</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Componente de lista de workflows
  const WorkflowList = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Mis Workflows</h3>
          <button
            onClick={handleCreateWorkflow}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Workflow
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando workflows...</p>
          </div>
        ) : !hasWorkflows ? (
          <div className="p-8 text-center">
            <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay workflows</h3>
            <p className="text-gray-600 mb-4">Crea tu primer workflow para comenzar</p>
            <button
              onClick={handleCreateWorkflow}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Crear Workflow
            </button>
          </div>
        ) : (
          workflowList.map((workflow) => (
            <div key={workflow.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h4 className="text-lg font-medium text-gray-900">{workflow.name}</h4>
                    <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      workflow.status === 'completed' ? 'bg-green-100 text-green-800' :
                      workflow.status === 'running' ? 'bg-yellow-100 text-yellow-800' :
                      workflow.status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {workflow.status || 'pending'}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{workflow.description}</p>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{workflow.node_count} nodos</span>
                    <span className="mx-2">•</span>
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{new Date(workflow.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleExecuteWorkflow(workflow.id)}
                    disabled={isExecuting}
                    className="inline-flex items-center p-2 border border-transparent rounded-md text-green-600 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    <Play className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => handleEditWorkflow(workflow)}
                    className="inline-flex items-center p-2 border border-transparent rounded-md text-blue-600 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Edit className="h-4 w-4" />
                  </button>

                  <button className="inline-flex items-center p-2 border border-transparent rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                    <Copy className="h-4 w-4" />
                  </button>

                  <button className="inline-flex items-center p-2 border border-transparent rounded-md text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // Componente de templates
  const TemplateGallery = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Templates de Workflow
        </h3>
        <p className="mt-1 text-sm text-gray-600">
          Comienza rápido con templates predefinidos
        </p>
      </div>

      <div className="p-6">
        {!hasTemplates ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No hay templates disponibles</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(templates).map((template) => (
              <div key={template.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-900">{template.name}</h4>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {template.category}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {template.estimated_time}
                  </span>
                  <span className="flex items-center">
                    <BarChart3 className="h-4 w-4 mr-1" />
                    {template.difficulty}
                  </span>
                </div>

                <button
                  onClick={() => handleCreateFromTemplate(template.id)}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Usar Template
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <XCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error al cargar workflows</h3>
              <p className="mt-2 text-sm text-red-700">{error}</p>
              <div className="mt-4">
                <button
                  onClick={clearWorkflowError}
                  className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
                >
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Renderizado según la vista actual
  if (currentView === 'editor') {
    return (
      <div className="h-full">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center">
            <button
              onClick={handleBackToList}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowRight className="h-4 w-4 mr-1 transform rotate-180" />
              Volver a Workflows
            </button>
            <h1 className="text-xl font-semibold text-gray-900">
              {selectedWorkflow ? 'Editar Workflow' : 'Nuevo Workflow'}
            </h1>
          </div>
        </div>
        <WorkflowEditor workflow={selectedWorkflow} onSave={handleBackToList} />
      </div>
    );
  }

  // Vista principal de workflows
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workflows</h1>
          <p className="mt-1 text-sm text-gray-600">
            Crea, edita y ejecuta workflows de automatización con IA
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setCurrentView('templates')}
            className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium ${
              currentView === 'templates' 
                ? 'bg-blue-50 text-blue-700 border-blue-300' 
                : 'text-gray-700 bg-white hover:bg-gray-50'
            }`}
          >
            <FileText className="h-4 w-4 mr-2" />
            Templates
          </button>

          <button
            onClick={() => setCurrentView('list')}
            className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium ${
              currentView === 'list' 
                ? 'bg-blue-50 text-blue-700 border-blue-300' 
                : 'text-gray-700 bg-white hover:bg-gray-50'
            }`}
          >
            <Zap className="h-4 w-4 mr-2" />
            Mis Workflows
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <StatsCards />

      {/* Contenido según vista */}
      {currentView === 'templates' ? <TemplateGallery /> : <WorkflowList />}

      {/* Modal de ejecución */}
      {showExecutionModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                <Play className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-2">
                {isExecuting ? 'Ejecutando Workflow...' : 'Workflow Completado'}
              </h3>
              {isExecuting && (
                <div className="mt-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              )}
              {activeExecution && !isExecuting && (
                <p className="text-sm text-gray-600 mt-2">
                  Execution ID: {activeExecution.id}
                </p>
              )}
              <div className="mt-4">
                <button
                  onClick={() => setShowExecutionModal(false)}
                  disabled={isExecuting}
                  className="px-4 py-2 bg-blue-600 text-white text-base font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
                >
                  {isExecuting ? 'Ejecutando...' : 'Cerrar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workflows;
