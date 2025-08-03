// Global API base URL configuration
// Value can be overridden at runtime via the REACT_APP_API_URL environment variable
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Derive WebSocket base URL from API base URL
// Automatically switches between ws:// and wss:// based on the API protocol
const WS_BASE_URL = API_BASE_URL.replace(/^http/, 'ws');

export { API_BASE_URL, WS_BASE_URL };
export default API_BASE_URL;
