import React from 'react';
import { Users, Plus, Activity, AlertCircle } from 'lucide-react';
import { useAgents } from '../../../hooks/useIopeer';
import LoadingSpinner from '../../ui/LoadingSpinner';

const Agents = () => {
  const { agents, loading, selectedAgent, selectAgent } = useAgents();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Mis Agentes</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
          <span className="ml-3 text-gray-600">Cargando agentes...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Mis Agentes</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={18} />
          Crear Agente
        </button>
      </div>

      {agents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <div
              key={agent.agent_id}
              onClick={() => selectAgent(agent)}
              className={`p-6 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                selectedAgent?.agent_id === agent.agent_id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
                <div className="flex items-center gap-1">
                  <Activity size={16} className={`${
                    agent.status === 'idle' ? 'text-green-500' : 'text-yellow-500'
                  }`} />
                  <span className="text-sm text-gray-600 capitalize">{agent.status}</span>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">
                {agent.capabilities?.description || 'Agente especializado'}
              </p>
              
              <div className="flex justify-between text-sm text-gray-500">
                <span>Acciones: {agent.capabilities?.actions?.length || 0}</span>
                <span>Mensajes: {agent.stats?.messages_processed || 0}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <Users className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay agentes disponibles</h3>
          <p className="text-gray-500 mb-6">
            Los agentes aparecerán aquí cuando el backend esté configurado
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-amber-600 bg-amber-50 px-4 py-2 rounded-lg inline-flex">
            <AlertCircle size={16} />
            <span>Verifica que el backend esté ejecutándose en http://localhost:8000</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agents;
