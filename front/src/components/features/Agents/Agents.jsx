// front/src/components/features/Agents/Agents.jsx - ACTUALIZADO CON CREAR AGENTE
import React, { useEffect } from 'react';
import { Users, Plus, Activity, AlertCircle, RefreshCw, Brain } from 'lucide-react';
import { useAgents } from '../../../hooks/useIopeer';
import LoadingSpinner, { AgentsLoadingState } from '../../ui/LoadingSpinner';
import ErrorDisplay from '../../ui/ErrorDisplay';
import { useNavigate } from 'react-router-dom';

const Agents = () => {
  const { 
    agents, 
    selectedAgent, 
    selectAgent, 
    loading, 
    error, 
    isConnected,
    activeAgents,
    agentCount,
    retry,
  } = useAgents();
  
  const navigate = useNavigate();

  // Efecto para logging
  useEffect(() => {
    console.log('📊 Agents Component State:', {
      isConnected,
      agentCount,
      loading,
      hasError: !!error
    });
  }, [isConnected, agentCount, loading, error]);

  // Si está cargando, mostrar skeleton
  if (loading && agents.length === 0) {
    return <AgentsLoadingState />;
  }

  // Si hay error, mostrar error display
  if (error && !loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Mis Agentes</h1>
        </div>
        
        <ErrorDisplay
          error={error}
          onRetry={retry}
          onGoHome={() => navigate('/dashboard')}
          showTechnical={process.env.NODE_ENV === 'development'}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con indicadores de estado */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Agentes</h1>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className="text-sm text-gray-600">
                {isConnected ? 'Conectado' : 'Desconectado'}
              </span>
            </div>
            
            <div className="text-sm text-gray-600">
              {agentCount} agente{agentCount !== 1 ? 's' : ''} • {activeAgents.length} activo{activeAgents.length !== 1 ? 's' : ''}
            </div>
            
            {loading && (
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <LoadingSpinner size="xs" color="blue" />
                <span>Sincronizando...</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={retry}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Actualizar
          </button>

          {/* ✅ NUEVO BOTÓN CREAR AGENTE */}
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            onClick={() => navigate('/crear-agente')}
          >
            <Brain size={18} />
            Crear Agente
          </button>
          
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => navigate('/marketplace')}
          >
            <Plus size={18} />
            Instalar Agente
          </button>
        </div>
      </div>

      {/* Lista de agentes o estado vacío */}
      {agents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <AgentCard
              key={agent.agent_id}
              agent={agent}
              isSelected={selectedAgent?.agent_id === agent.agent_id}
              onSelect={() => selectAgent(agent)}
            />
          ))}
        </div>
      ) : (
        <EmptyAgentsState 
          onInstallAgent={() => navigate('/marketplace')}
          onCreateAgent={() => navigate('/crear-agente')} // ✅ NUEVA ACCIÓN
        />
      )}
    </div>
  );
};

// Componente individual de agente
const AgentCard = ({ agent, isSelected, onSelect }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'idle':
        return 'text-green-500';
      case 'busy':
        return 'text-yellow-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'idle':
        return 'Disponible';
      case 'busy':
        return 'Ocupado';
      case 'error':
        return 'Error';
      default:
        return 'Desconocido';
    }
  };

  return (
    <div
      onClick={onSelect}
      className={`p-6 border rounded-lg cursor-pointer transition-all hover:shadow-md transform hover:-translate-y-1 ${
        isSelected
          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
          : 'border-gray-200 hover:border-gray-300 bg-white'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
          {/* ✅ INDICADOR PARA AGENTES PERSONALIZADOS */}
          {agent.metadata?.is_custom && (
            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
              Custom
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Activity size={16} className={getStatusColor(agent.status)} />
          <span className="text-sm text-gray-600">{getStatusText(agent.status)}</span>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-4">
        {agent.capabilities?.description || 'Agente especializado en automatización'}
      </p>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Acciones:</span>
          <span className="font-medium">{agent.capabilities?.actions?.length || 0}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Mensajes:</span>
          <span className="font-medium">{agent.stats?.messages_processed || 0}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Tipo:</span>
          <span className="font-medium text-blue-600">{agent.type}</span>
        </div>
      </div>
      
      {isSelected && (
        <div className="mt-4 pt-4 border-t border-blue-200">
          <div className="flex gap-2">
            <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
              Configurar
            </button>
            <button className="flex-1 px-3 py-2 border border-blue-600 text-blue-600 text-sm rounded hover:bg-blue-50 transition-colors">
              Probar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Estado vacío cuando no hay agentes - ✅ ACTUALIZADO
const EmptyAgentsState = ({ onInstallAgent, onCreateAgent }) => (
  <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
    <Users className="mx-auto text-gray-400 mb-4" size={64} />
    <h3 className="text-xl font-semibold text-gray-700 mb-2">
      No hay agentes instalados
    </h3>
    <p className="text-gray-500 mb-6">
      Instala agentes desde el marketplace o crea tu propio agente personalizado
    </p>
    
    {/* ✅ BOTONES ACTUALIZADOS */}
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <button 
        onClick={onInstallAgent}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
      >
        <Plus size={20} />
        Explorar Marketplace
      </button>
      
      <button 
        onClick={onCreateAgent}
        className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
      >
        <Brain size={20} />
        Crear Mi Agente
      </button>
    </div>
    
    <div className="mt-6 flex items-center justify-center gap-2 text-sm text-amber-600 bg-amber-50 px-4 py-2 rounded-lg">
      <AlertCircle size={16} />
      <span>Tip: El backend debe estar ejecutándose en http://localhost:8000</span>
    </div>
  </div>
);

export default Agents;
