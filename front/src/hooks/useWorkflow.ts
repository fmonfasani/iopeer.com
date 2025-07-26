import { useState, useEffect, useCallback } from 'react';
import { apiRequest, ENDPOINTS } from '../config/api';

export interface WorkflowExecution {
  workflow_id: string;
  status?: string;
  [key: string]: any;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  [key: string]: any;
}

export const useWorkflow = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWorkflows = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest(ENDPOINTS.WORKFLOWS);
      // API returns { workflows: [...] } but fallback to raw array
      setWorkflows(response.workflows ?? response);
    } catch (err: any) {
      setError(err.message || 'Failed to load workflows');
    } finally {
      setLoading(false);
    }
  }, []);

  const startWorkflow = useCallback(
    async (workflowName: string, data: Record<string, any> = {}) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiRequest(ENDPOINTS.WORKFLOW_START, {
          method: 'POST',
          body: JSON.stringify({ workflow: workflowName, data }),
        });
        // Some backends return workflow_id at root level
        const workflowId = response.workflow_id ?? response.data?.workflow_id;
        return { ...response, workflow_id: workflowId } as WorkflowExecution;
      } catch (err: any) {
        setError(err.message || 'Failed to start workflow');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    loadWorkflows();
  }, [loadWorkflows]);

  return {
    workflows,
    loading,
    error,
    reload: loadWorkflows,
    startWorkflow,
  };
};
