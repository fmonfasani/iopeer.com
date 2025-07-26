import { useState, useEffect, useCallback } from 'react';

import { iopeerAPI } from '../services/iopeerAPI';

export interface WorkflowDefinition {
  name: string;
  tasks: string[];
  parallel?: boolean;
  timeout?: number;
  executions?: number;
}

export interface WorkflowExecution {
  execution_id: string;
  workflow: string;
  status: string;
  execution_time: number;
  result: any;
}

export const useWorkflow = () => {
  const [workflows, setWorkflows] = useState<WorkflowDefinition[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastExecution, setLastExecution] = useState<WorkflowExecution | null>(null);


  const loadWorkflows = useCallback(async () => {
    setLoading(true);
    setError(null);


    try {
      const data = await iopeerAPI.getWorkflows();
      setWorkflows(data.workflows || []);

    } catch (err: any) {
      setError(err.message || 'Failed to load workflows');
    } finally {
      setLoading(false);
    }
  }, []);


  const startWorkflow = useCallback(async (workflowName: string, data: Record<string, any> = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await iopeerAPI.startWorkflow(workflowName, data);
      setLastExecution(result);
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to execute workflow');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = () => setError(null);


  useEffect(() => {
    loadWorkflows();
  }, [loadWorkflows]);

  return {
    workflows,
    loading,
    error,

    lastExecution,
    loadWorkflows,
    startWorkflow,
    clearError,
  };
};

export default useWorkflow;
