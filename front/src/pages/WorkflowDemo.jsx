import React, { useState } from 'react';
import { Play, RefreshCw } from 'lucide-react';
import useWorkflow from '../hooks/useWorkflow';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const WorkflowDemo = () => {
  const { workflows, loading, error, lastExecution, loadWorkflows, startWorkflow } = useWorkflow();
  const [running, setRunning] = useState('');

  const handleRun = async (name) => {
    setRunning(name);
    try {
      await startWorkflow(name);
    } finally {
      setRunning('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Workflow Demo</h1>
        <button
          onClick={loadWorkflows}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Reload
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded">
          Error: {error}
        </div>
      )}

      {loading && workflows.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-3">
          {workflows.map((wf) => (
            <div key={wf.name} className="flex justify-between items-center border p-3 rounded-lg">
              <div>
                <div className="font-medium">{wf.name}</div>
                <div className="text-xs text-gray-600">{wf.tasks.join(' → ')}</div>
              </div>
              <button
                onClick={() => handleRun(wf.name)}
                disabled={running === wf.name || loading}
                className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                <Play size={16} />
                Run
              </button>
            </div>
          ))}
        </div>
      )}

      {lastExecution && (
        <div className="bg-gray-50 border border-gray-200 rounded p-4">
          <h2 className="font-semibold mb-2">Last Execution</h2>
          <pre className="text-xs overflow-auto max-h-64">
            {JSON.stringify(lastExecution, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default WorkflowDemo;
