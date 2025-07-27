import { useState, useCallback, useEffect } from 'react';
import { workflowService } from '../services/workflow.service';
import { useIopeer } from './useIopeer';

export const useWorkflows = () => {
  const { isConnected } = useIopeer();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [workflows, setWorkflows] = useState([]);

  const createWorkflow = useCallback(async (workflow) => {
    if (!isConnected) {
      setError('Not connected to the backend.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await workflowService.createWorkflow(workflow);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, [isConnected]);

  const executeWorkflow = useCallback(async (workflowName, data) => {
    if (!isConnected) {
      setError('Not connected to the backend.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await workflowService.executeWorkflow(workflowName, data);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, [isConnected]);

  const getWorkflows = useCallback(async () => {
    if (!isConnected) {
      setError('Not connected to the backend.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await workflowService.getWorkflows();
      setWorkflows(result);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, [isConnected]);

  useEffect(() => {
    if (isConnected) {
      getWorkflows();
    }
  }, [isConnected, getWorkflows]);

  return {
    workflows,
    loading,
    error,
    createWorkflow,
    executeWorkflow,
    getWorkflows,
  };
};
