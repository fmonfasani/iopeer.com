import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Zap, Database, BarChart3, Code, Palette, Trash2 } from 'lucide-react';
import { useIopeer } from '../../../hooks/useIopeer';

import { workflowService } from '../../../services/workflowService';
import type { Agent } from '../../../hooks/useWorkflow';
import NodeList from './NodeList';
import Toolbar from './Toolbar';
import ConnectionEditor from './ConnectionEditor';

// Tipos para el workflow
export interface WorkflowNode {
  id: string;
  agent_type: string;
  name: string;
  position: { x: number; y: number };
  config: any;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

interface WorkflowConnection {
  source_id: string;
  target_id: string;
  connection_type: string;
}



const WorkflowEditor: React.FC<{ workflow?: any; onSave?: () => void }> = ({ workflow: initialWorkflow, onSave }) => {
  // Estado del workflow
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [connections, setConnections] = useState<WorkflowConnection[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [workflowName, setWorkflowName] = useState('Mi Workflow');
  const [workflowDescription, setWorkflowDescription] = useState('');
  
  // Estados de UI
  const [showAgentPanel, setShowAgentPanel] = useState(true);
  const [draggedAgent, setDraggedAgent] = useState<Agent | null>(null);
  const [saving, setSaving] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionProgress, setExecutionProgress] = useState<any>({});
  
  // Hooks

  const { availableAgents, loadAvailableAgents } = useIopeer();

  
  // Referencias
  const canvasRef = useRef<HTMLDivElement>(null);
  const wsConnection = useRef<WebSocket | null>(null);

  // Cargar agentes disponibles al montar
  useEffect(() => {
    loadAvailableAgents();
  }, [loadAvailableAgents]);

  // Cargar workflow inicial si se proporciona
  useEffect(() => {
    if (initialWorkflow) {
      setWorkflowName(initialWorkflow.name);
      setWorkflowDescription(initialWorkflow.description || '');
      
      if (initialWorkflow.nodes) {
        setNodes(initialWorkflow.nodes.map(node => ({
          ...node,
          status: 'pending'
        })));
      }
      
      if (initialWorkflow.connections) {
        setConnections(initialWorkflow.connections);
      }
    }
  }, [initialWorkflow]);

  // Convertir agentes disponibles a formato local
  const agentsList: Agent[] =
    Object.values(availableAgents as Record<string, Agent>).map((agent: Agent): Agent => ({
      id: agent.id,
      name: agent.name || agent.id,
      description: agent.description || 'No description available',
      icon: agent.icon || '🤖',
      category: agent.category || 'general',
      color: agent.color || '#6b7280'
    }));

  // Función para guardar workflow
  const saveWorkflow = useCallback(async () => {
    if (nodes.length === 0) {
      alert('Agrega al menos un nodo antes de guardar');
      return;
    }

    setSaving(true);
    
    try {
      const workflowData = {
        workflow_id: workflowService.generateWorkflowId(workflowName),
        name: workflowName,
        description: workflowDescription,
        nodes: nodes.map(node => ({
          id: node.id,
          agent_type: node.agent_type,
          name: node.name,
          position: node.position,
          config: node.config
        })),
        connections: connections.map(conn => ({
          source_id: conn.source_id,
          target_id: conn.target_id,
          connection_type: conn.connection_type
        }))
      };

      // Validar antes de enviar
      const validation = workflowService.validateWorkflow(workflowData);
      if (!validation.isValid) {
        alert(`Error de validación: ${validation.errors.join(', ')}`);
        return;
      }

      await workflowService.createWorkflow(workflowData);
      alert('Workflow guardado exitosamente!');
      
      if (onSave) {
        onSave();
      }
      
    } catch (error) {
      console.error('Error saving workflow:', error);
      alert(`Error al guardar: ${error.message}`);
    } finally {
      setSaving(false);
    }
  }, [workflowName, workflowDescription, nodes, connections, onSave]);

  // Función para ejecutar workflow
  const executeWorkflow = useCallback(async () => {
    if (nodes.length === 0) {
      alert('Agrega al menos un nodo antes de ejecutar');
      return;
    }

    // Primero guardar el workflow
    await saveWorkflow();

    setIsExecuting(true);
    setExecutionProgress({});

    try {
      const workflowId = workflowService.generateWorkflowId(workflowName);
      
      // Conectar WebSocket para updates en tiempo real
      wsConnection.current = workflowService.createWebSocketConnection(
        workflowId,
        (event) => {
          console.log('Workflow event:', event);
          
          switch (event.type) {
            case 'node_started':
              setExecutionProgress(prev => ({
                ...prev,
                [event.data.node_id]: { status: 'running', progress: 0 }
              }));
              break;
              
            case 'node_completed':
              setExecutionProgress(prev => ({
                ...prev,
                [event.data.node_id]: { status: 'completed', progress: 100 }
              }));
              setNodes(prev => prev.map(n => 
                n.id === event.data.node_id ? { ...n, status: 'completed' } : n
              ));
              break;
              
            case 'node_failed':
              setExecutionProgress(prev => ({
                ...prev,
                [event.data.node_id]: { status: 'failed', progress: 0 }
              }));
              setNodes(prev => prev.map(n => 
                n.id === event.data.node_id ? { ...n, status: 'failed' } : n
              ));
              break;
              
            case 'workflow_completed':
              setIsExecuting(false);
              alert('Workflow completado exitosamente!');
              break;
              
            case 'workflow_failed':
              setIsExecuting(false);
              alert('Error en la ejecución del workflow');
              break;
          }
        },
        (error) => {
          console.error('WebSocket error:', error);
        }
      );

      // Ejecutar workflow
      await workflowService.executeWorkflow(workflowId, {});
      
    } catch (error) {
      console.error('Error executing workflow:', error);
      alert(`Error al ejecutar: ${error.message}`);
      setIsExecuting(false);
    }
  }, [nodes, saveWorkflow, workflowName]);

  // Manejar drag & drop de agentes
  const handleAgentDragStart = (agent: Agent) => {
    setDraggedAgent(agent);
  };

  const handleCanvasDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedAgent || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newNode: WorkflowNode = {
      id: workflowService.generateNodeId(draggedAgent.id),
      agent_type: draggedAgent.id,
      name: draggedAgent.name,
      position: { x, y },
      config: {},
      status: 'pending'
    };

    setNodes(prev => [...prev, newNode]);
    setDraggedAgent(null);
  }, [draggedAgent]);

  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Limpiar canvas
  const clearCanvas = () => {
    if (nodes.length > 0 && !window.confirm('¿Estás seguro de que quieres limpiar el canvas?')) {
      return;
    }
    setNodes([]);
    setConnections([]);
    setExecutionProgress({});
    setSelectedNode(null);
  };

  // Exportar workflow
  const exportWorkflow = () => {
    const workflowData = {
      workflow_id: workflowService.generateWorkflowId(workflowName),
      name: workflowName,
      description: workflowDescription,
      nodes,
      connections
    };
    
    workflowService.exportWorkflow(workflowData);
  };

  // Obtener color del nodo según estado
  const getNodeStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'border-blue-500 bg-blue-50 shadow-blue-200';
      case 'completed': return 'border-green-500 bg-green-50 shadow-green-200';
      case 'failed': return 'border-red-500 bg-red-50 shadow-red-200';
      default: return 'border-gray-300 bg-white shadow-gray-200';
    }
  };

  // Obtener info del agente
  const getAgentInfo = (agent_type: string) => {
    return agentsList.find(a => a.id === agent_type) || {
      icon: '🤖',
      color: '#6b7280',
      name: agent_type
    };
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Frontend': return <Palette className="w-4 h-4" />;
      case 'Backend': return <Database className="w-4 h-4" />;
      case 'Analytics': return <BarChart3 className="w-4 h-4" />;
      case 'Testing': return <Code className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  // Limpiar conexiones WebSocket al desmontar
  useEffect(() => {
    return () => {
      if (wsConnection.current) {
        wsConnection.current.close();
      }
    };
  }, []);

  // Agrupar agentes por categoría
  const agentsByCategory = agentsList.reduce((acc, agent) => {
    const category = agent.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(agent);
    return acc;
  }, {} as Record<string, Agent[]>);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Panel de Agentes */}
      {showAgentPanel && (
        <NodeList
          agentsByCategory={agentsByCategory}
          getCategoryIcon={getCategoryIcon}
          onDragStart={handleAgentDragStart}
        />
      )}

      {/* Canvas Principal */}
      <div className="flex-1 flex flex-col">
        <Toolbar
          showAgentPanel={showAgentPanel}
          toggleAgentPanel={() => setShowAgentPanel(!showAgentPanel)}
          workflowName={workflowName}
          setWorkflowName={setWorkflowName}
          workflowDescription={workflowDescription}
          setWorkflowDescription={setWorkflowDescription}
          clearCanvas={clearCanvas}
          exportWorkflow={exportWorkflow}
          saveWorkflow={saveWorkflow}
          executeWorkflow={executeWorkflow}
          saving={saving}
          isExecuting={isExecuting}
          hasNodes={nodes.length > 0}
        />

        {/* Canvas */}
        <div
          ref={canvasRef}
          className="flex-1 relative bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden"
          onDrop={handleCanvasDrop}
          onDragOver={handleCanvasDragOver}
        >
          {/* Grid de fondo */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          />

          {/* Nodos del workflow */}
          {nodes.map(node => {
            const agentInfo = getAgentInfo(node.agent_type);
            return (
              <div
                key={node.id}
                className={`absolute w-56 p-4 border-2 rounded-xl shadow-lg cursor-move transition-all duration-200 ${getNodeStatusColor(node.status)} ${
                  selectedNode === node.id ? 'ring-4 ring-blue-300 ring-opacity-50 scale-105' : 'hover:scale-105'
                }`}
                style={{
                  left: node.position.x,
                  top: node.position.y,
                }}
                onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
              >
                {/* Header del nodo */}
                <div className="flex items-center space-x-3 mb-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: agentInfo.color }}
                  >
                    {agentInfo.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm">{node.name}</div>
                    <div className="text-xs text-gray-600 capitalize">{node.status}</div>
                  </div>
                  {selectedNode === node.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setNodes(prev => prev.filter(n => n.id !== node.id));
                        setSelectedNode(null);
                      }}
                      className="p-1 text-red-500 hover:bg-red-100 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Progreso si está ejecutándose */}
                {executionProgress[node.id] && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Progreso</span>
                      <span>{executionProgress[node.id].progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${executionProgress[node.id].progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Puntos de conexión */}
                <div className="flex justify-between">
                  <div className="w-3 h-3 bg-gray-400 rounded-full border-2 border-white shadow" title="Input" />
                  <div className="w-3 h-3 rounded-full border-2 border-white shadow" 
                       style={{ backgroundColor: agentInfo.color }} title="Output" />
                </div>
              </div>
            );
          })}

          {/* Mensaje si no hay nodos */}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🚀</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  ¡Crea tu primer workflow!
                </h3>
                <p className="text-gray-600 mb-6">
                  Arrastra agentes desde el panel izquierdo para comenzar
                </p>
                <button
                  onClick={() => setShowAgentPanel(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Ver Agentes Disponibles
                </button>
              </div>
            </div>
          )}
        </div>

        <ConnectionEditor
          selectedNode={selectedNode}
          nodes={nodes}
          setNodes={setNodes}
          onClose={() => setSelectedNode(null)}
        />

        {/* Status bar */}
        <div className="bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>Nodos: {nodes.length}</span>
            <span>Conexiones: {connections.length}</span>
            {isExecuting && <span className="text-blue-600 animate-pulse">🔄 Ejecutando...</span>}
          </div>
          <div className="flex items-center space-x-2">
            <span>IOPeer Workflow Editor</span>
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowEditor;
