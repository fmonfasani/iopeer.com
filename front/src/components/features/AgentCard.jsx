import React from 'react';
import { Clock, Zap } from 'lucide-react';

const AgentCard = ({ agent, onSelect, isSelected, onSendMessage }) => {
  const statusColors = {
    idle: 'bg-green-100 text-green-800',
    busy: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    offline: 'bg-gray-100 text-gray-800'
  };

  const handleTestMessage = () => {
    if (onSendMessage) {
      onSendMessage(agent.agent_id, 'ping', { test: true });
    }
  };

  return (
    <div
      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => onSelect(agent)}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-semibold text-lg">{agent.name}</h3>
          <p className="text-sm text-gray-600">{agent.agent_id}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs ${statusColors[agent.status] || statusColors.offline}`}>
          {agent.status}
        </span>
      </div>

      <p className="text-gray-700 mb-3 line-clamp-2">
        {agent.capabilities?.description || 'Sin descripción disponible'}
      </p>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
        <span>Actions: {agent.capabilities?.actions?.length || 0}</span>
        <span>Msgs: {agent.stats?.messages_processed || 0}</span>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleTestMessage();
          }}
          className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
        >
          <Zap size={12} />
          <span>Test</span>
        </button>

        <div className="flex items-center space-x-1 text-xs text-gray-500">
          <Clock size={12} />
          <span>{agent.stats?.last_activity ? 'Activo' : 'Inactivo'}</span>
        </div>
      </div>
    </div>
  );
};

export default AgentCard;
