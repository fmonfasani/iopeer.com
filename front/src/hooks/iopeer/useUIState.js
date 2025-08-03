export const deriveUIState = ({ connectionStatus, agents }) => ({
  isConnected: connectionStatus === 'connected',
  isConnecting: connectionStatus === 'connecting',
  isFailed: connectionStatus === 'failed',
  hasAgents: agents.length > 0,
});
