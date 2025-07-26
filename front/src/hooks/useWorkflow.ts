import { useState, useEffect, useCallback } from 'react';
import { iopeerAPI } from '../services/iopeerAPI';

export interface WorkflowDefinition {
  name: string;
  tasks: string[];
  parallel?: boolean;
  timeout?: number;
  [key: string]: any;
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
  const [currentExecution, setCurrentExecution] = useState<WorkflowExecution | null>(null);

  const loadWorkflows = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await iopeerAPI.getWorkflows();
      setWorkflows(response.workflows || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load workflows');
    } finally {
      setLoading(false);
    }
  }, []);

  const startWorkflow = useCallback(async (workflowName: string, data: any = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await iopeerAPI.startWorkflow(workflowName, data);
      const execution: WorkflowExecution = {
        execution_id: response.execution_id,
        workflow: response.workflow,
        status: response.status,
        execution_time: response.execution_time,
        result: response.result,
      };
      setCurrentExecution(execution);
      return execution;
    } catch (err: any) {
      setError(err.message || 'Failed to start workflow');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWorkflows();
  }, [loadWorkflows]);

  return {
    workflows,
    loading,
    error,
    currentExecution,
    reload: loadWorkflows,
    startWorkflow,
  };
};
