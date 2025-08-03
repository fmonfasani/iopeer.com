import React from 'react';
import type { Agent } from '../../../hooks/useWorkflow';

interface NodeListProps {
  agentsByCategory: Record<string, Agent[]>;
  getCategoryIcon: (category: string) => React.ReactNode;
  onDragStart: (agent: Agent) => void;
}

const NodeList: React.FC<NodeListProps> = ({ agentsByCategory, getCategoryIcon, onDragStart }) => (
  <div className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-lg">
    <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Agentes Disponibles</h2>
      <p className="text-sm text-gray-600">Arrastra agentes al canvas</p>
    </div>
    <div className="flex-1 overflow-y-auto">
      {Object.entries(agentsByCategory).map(([category, agents]) => (
        <div key={category} className="p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            {getCategoryIcon(category)}
            {category}
          </h3>
          <div className="space-y-2">
            {agents.map(agent => (
              <div
                key={agent.id}
                draggable
                onDragStart={() => onDragStart(agent)}
                className="p-3 bg-white border border-gray-200 rounded-lg cursor-move hover:shadow-md transition-all duration-200 transform hover:scale-105 hover:border-blue-300"
                style={{ borderLeftColor: agent.color, borderLeftWidth: '4px' }}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{agent.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{agent.name}</div>
                    <div className="text-xs text-gray-600">{agent.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default NodeList;
