import React, { useEffect, useState } from 'react';
import { Plus, Play, Loader, Workflow } from 'lucide-react';
import { iopeerAPI } from '../services/iopeerAPI';

const Workflows = () => {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  const [name, setName] = useState('');
  const [tasks, setTasks] = useState(['']);

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await iopeerAPI.getWorkflows();
      setWorkflows(data.workflows || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkflow = async () => {
    if (!name) return;
    setCreating(true);
    setError(null);
    try {
      await iopeerAPI.createWorkflow({ name, tasks: tasks.filter(Boolean) });
      setName('');
      setTasks(['']);
      await loadWorkflows();
    } catch (e) {
      setError(e.message);
    } finally {
      setCreating(false);
    }
  };

  const handleStartWorkflow = async (wfName) => {
    try {
      await iopeerAPI.startWorkflow(wfName, {});
      alert(`Workflow '${wfName}' iniciado`);
    } catch (e) {
      setError(e.message);
    }
  };

  const onDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const onDrop = (e, index) => {
    const from = parseInt(e.dataTransfer.getData('text/plain'), 10);
    const newTasks = [...tasks];
    const [moved] = newTasks.splice(from, 1);
    newTasks.splice(index, 0, moved);
    setTasks(newTasks);
    e.preventDefault();
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Workflow /> Workflows
        </h1>
        <button
          onClick={handleCreateWorkflow}
          disabled={creating}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Plus size={16} />
          Crear
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg space-y-4">
        <input
          type="text"
          placeholder="Nombre del workflow"
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div>
          <p className="text-sm text-gray-600 mb-2">Tareas (arrastrar para reordenar)</p>
          {tasks.map((t, idx) => (
            <div
              key={idx}
              draggable
              onDragStart={(e) => onDragStart(e, idx)}
              onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, idx)}
              className="flex mb-2 gap-2 items-center border rounded px-2 py-1 bg-gray-50 cursor-move"
            >
              <input
                type="text"
                className="flex-1 bg-transparent focus:outline-none"
                placeholder="agente.accion"
                value={t}
                onChange={(e) => {
                  const newTasks = [...tasks];
                  newTasks[idx] = e.target.value;
                  setTasks(newTasks);
                }}
              />
            </div>
          ))}
          <button
            className="text-sm text-blue-600 mt-1"
            onClick={() => setTasks([...tasks, ''])}
          >
            + Añadir tarea
          </button>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        {loading ? (
          <div className="text-center py-8">
            <Loader className="animate-spin mx-auto" />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="p-2">Nombre</th>
                <th className="p-2">Tareas</th>
                <th className="p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {workflows.map((wf) => (
                <tr key={wf.name} className="border-t">
                  <td className="p-2 font-medium text-gray-900">{wf.name}</td>
                  <td className="p-2 text-gray-600">
                    {wf.tasks ? wf.tasks.join(', ') : ''}
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => handleStartWorkflow(wf.name)}
                      className="flex items-center gap-1 text-green-600 hover:text-green-800"
                    >
                      <Play size={16} /> Iniciar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Workflows;
