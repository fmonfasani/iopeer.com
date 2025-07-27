import { iopeerAPI } from './iopeerAPI';

/**
 * Service for interacting with the Backend Agent.
 */
class BackendAgentService {
  /**
   * Analyzes the requirements for a new backend.
   * @param {string} requirements - The requirements for the backend.
   * @returns {Promise<any>} The result of the analysis.
   */
  analyzeRequirements(requirements) {
    return iopeerAPI.sendMessage('backend_agent', 'analyze_requirements', { requirements });
  }

  /**
   * Suggests an architecture for the backend.
   * @param {string} analysis - The analysis of the requirements.
   * @returns {Promise<any>} The suggested architecture.
   */
  suggestArchitecture(analysis) {
    return iopeerAPI.sendMessage('backend_agent', 'suggest_architecture', { analysis });
  }

  /**
   * Generates the API for the backend.
   * @param {string} architecture - The architecture of the backend.
   * @returns {Promise<any>} The generated API.
   */
  generateAPI(architecture) {
    return iopeerAPI.sendMessage('backend_agent', 'generate_api', { architecture });
  }
}

export const backendAgentService = new BackendAgentService();
