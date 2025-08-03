// Global API base URL configuration
// Value can be overridden at runtime via the REACT_APP_API_URL environment variable
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export { API_BASE_URL };
export default API_BASE_URL;
