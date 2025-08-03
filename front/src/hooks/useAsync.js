import { useState, useCallback } from 'react';
import ErrorService from '../services/errorService';

/**
 * Generic hook to handle async operations.
 * @param {Function} asyncFunction - function that returns a promise.
 * @param {Object} options
 * @param {string} options.context - context string for error logging.
 * @returns {{execute: Function, loading: boolean, error: any}}
 */
export const useAsync = (asyncFunction, { context } = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      try {
        return await asyncFunction(...args);
      } catch (err) {
        const processedError = ErrorService.handleApiError
          ? ErrorService.handleApiError(err, context)
          : err;
        if (ErrorService.logError) {
          ErrorService.logError(err, context);
        }
        setError(processedError);
        throw processedError;
      } finally {
        setLoading(false);
      }
    },
    [asyncFunction, context]
  );

  return { execute, loading, error };
};

export default useAsync;
