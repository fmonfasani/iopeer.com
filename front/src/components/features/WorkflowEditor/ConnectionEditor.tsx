import React from 'react';
import { Settings, Trash2 } from 'lucide-react';
import type { WorkflowNode } from './WorkflowEditor';

interface Props {
  selectedNode: string | null;
  nodes: WorkflowNode[];
  setNodes: React.Dispatch<React.SetStateAction<WorkflowNode[]>>;
  onClose: () => void;
}

const ConnectionEditor: React.FC<Props> = ({ selectedNode, nodes, setNodes, onClose }) => {
  if (!selectedNode) return null;
  const node = nodes.find((n) => n.id === selectedNode);
  if (!node) return null;

  return (
    <div className="absolute right-4 top-20 w-80 bg-white border border-gray-200 rounded-xl shadow-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Configuración del Nodo
        </h3>
        <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded">
          ✕
        </button>
      </div>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Nodo</label>
          <input
            type="text"
            value={node.name}
            onChange={(e) =>
              setNodes((prev) => prev.map((n) => (n.id === node.id ? { ...n, name: e.target.value } : n)))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Configuración</label>
          <textarea
            placeholder="Configuración JSON del agente..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
          />
        </div>
        <button
          onClick={() => {
            setNodes((prev) => prev.filter((n) => n.id !== node.id));
            onClose();
          }}
          className="flex items-center gap-2 text-red-500 hover:bg-red-100 p-2 rounded"
        >
          <Trash2 className="w-4 h-4" /> Eliminar nodo
        </button>
      </div>
    </div>
  );
};

export default ConnectionEditor;
