import { useState, useEffect, useCallback } from 'react';
import { websocketService } from '../services/websocket';

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(websocketService.getConnectionState() === 'connected');
  const [lastMessage, setLastMessage] = useState(null);

  useEffect(() => {
    const onConnected = () => setIsConnected(true);
    const onDisconnected = () => setIsConnected(false);
    const onMessage = (message) => setLastMessage(message);

    const unsubscribeConnected = websocketService.subscribe('connected', onConnected);
    const unsubscribeDisconnected = websocketService.subscribe('disconnected', onDisconnected);
    const unsubscribeMessage = websocketService.subscribe('message', onMessage);

    // Initial connection
    if (websocketService.getConnectionState() !== 'connected') {
      websocketService.connect();
    }

    return () => {
      unsubscribeConnected();
      unsubscribeDisconnected();
      unsubscribeMessage();
    };
  }, []);

  const sendMessage = useCallback((data) => {
    websocketService.send(data);
  }, []);

  return {
    isConnected,
    lastMessage,
    sendMessage,
  };
};
