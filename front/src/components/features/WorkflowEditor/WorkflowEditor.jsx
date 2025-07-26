import React, { useEffect, useState } from 'react';
import { Play, RefreshCw } from 'lucide-react';
import { iopeerAPI } from '../../../services/iopeerAPI';
import LoadingSpinner from '../../ui/LoadingSpinner';
import ErrorDisplay from '../../ui/ErrorDisplay';

const WorkflowEditor = () => {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadWorkflows = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await iopeerAPI.getWorkflows();
      setWorkflows(data.workflows || []);
    } catch (err) {
      setError(err.message || 'Error loading workflows');
    } finally {
      setLoading(false);
    }
  };

  const startWorkflow = async (name) => {
    try {
      await iopeerAPI.startWorkflow(name, {});
    } catch (err) {
      console.error('Error starting workflow', err);
    }
  };

  useEffect(() => {
    loadWorkflows();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay error={{ message: error }} onRetry={loadWorkflows} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Workflows</h1>
        <button
          onClick={loadWorkflows}
          className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>
      <div className="space-y-4">
        {workflows.map((wf) => (
          <div key={wf.name} className="border p-4 rounded-lg bg-white">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold text-gray-800">{wf.name}</h2>
              <button
                onClick={() => startWorkflow(wf.name)}
                className="flex items-center gap-2 text-sm text-white bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
              >
                <Play size={14} /> Run
              </button>
            </div>
            <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
{JSON.stringify(wf.tasks, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkflowEditor;
