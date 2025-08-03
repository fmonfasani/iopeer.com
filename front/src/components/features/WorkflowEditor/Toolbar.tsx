import React from 'react';
import { Plus, Trash2, Download, Save, Play } from 'lucide-react';

interface ToolbarProps {
  showAgentPanel: boolean;
  toggleAgentPanel: () => void;
  workflowName: string;
  setWorkflowName: (n: string) => void;
  workflowDescription: string;
  setWorkflowDescription: (d: string) => void;
  clearCanvas: () => void;
  exportWorkflow: () => void;
  saveWorkflow: () => void;
  executeWorkflow: () => void;
  saving: boolean;
  isExecuting: boolean;
  hasNodes: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
  showAgentPanel,
  toggleAgentPanel,
  workflowName,
  setWorkflowName,
  workflowDescription,
  setWorkflowDescription,
  clearCanvas,
  exportWorkflow,
  saveWorkflow,
  executeWorkflow,
  saving,
  isExecuting,
  hasNodes,
}) => (
  <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleAgentPanel}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
        <div className="flex flex-col">
          <input
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="text-xl font-semibold text-gray-900 bg-transparent border-none focus:outline-none focus:bg-gray-50 px-2 py-1 rounded"
            placeholder="Nombre del workflow"
          />
          <input
            type="text"
            value={workflowDescription}
            onChange={(e) => setWorkflowDescription(e.target.value)}
            className="text-sm text-gray-600 bg-transparent border-none focus:outline-none focus:bg-gray-50 px-2 py-1 rounded mt-1"
            placeholder="Descripción del workflow"
          />
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <button
          onClick={clearCanvas}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Limpiar
        </button>
        <button
          onClick={exportWorkflow}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          Exportar
        </button>
        <button
          onClick={saveWorkflow}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
        <button
          onClick={executeWorkflow}
          disabled={isExecuting || !hasNodes}
          className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          <Play className="w-4 h-4" />
          {isExecuting ? 'Ejecutando...' : 'Ejecutar Workflow'}
        </button>
      </div>
    </div>
  </div>
);

export default Toolbar;
