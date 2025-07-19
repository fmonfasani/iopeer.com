/**
 * Hook principal para características enterprise de Iopeer
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { websocketService } from '../services/websocket';
import { analyticsService } from '../services/analytics';
import config from '../config/enterprise';

export const useEnterprise = () => {
  const [wsStatus, setWsStatus] = useState('disconnected');
  const [analytics, setAnalytics] = useState({});
  const [realTimeData, setRealTimeData] = useState({});
  const unsubscribeRef = useRef([]);

  // Initialize enterprise services
  useEffect(() => {
    // Track page view
    analyticsService.trackPageView('enterprise_dashboard');

    // Setup WebSocket if enabled
    if (config.features.websocket) {
      initializeWebSocket();
    }

    // Setup periodic updates
    const interval = setInterval(() => {
      updateMetrics();
    }, config.performance.pollingInterval);

    return () => {
      clearInterval(interval);
      cleanup();
    };
  }, []);

  const initializeWebSocket = useCallback(() => {
    // Subscribe to WebSocket events
    const unsubscribes = [
      websocketService.subscribe('connected', () => {
        setWsStatus('connected');
        analyticsService.trackUserAction('websocket_connected');
      }),

      websocketService.subscribe('disconnected', () => {
        setWsStatus('disconnected');
        analyticsService.trackUserAction('websocket_disconnected');
      }),

      websocketService.subscribe('error', (error) => {
        setWsStatus('error');
        console.error('WebSocket error:', error);
      }),

      websocketService.subscribe('message', (data) => {
        handleRealTimeMessage(data);
      })
    ];

    unsubscribeRef.current = unsubscribes;

    // Connect to WebSocket
    websocketService.connect().catch(error => {
      console.error('WebSocket connection failed:', error);
    });
  }, []);

  const handleRealTimeMessage = useCallback((data) => {
    setRealTimeData(prev => ({
      ...prev,
      [data.type]: data,
      lastUpdate: Date.now()
    }));

    // Track real-time events
    analyticsService.trackUserAction('realtime_message_received', {
      messageType: data.type,
      dataSize: JSON.stringify(data).length
    });
  }, []);

  const updateMetrics = useCallback(() => {
    try {
      setAnalytics(analyticsService.getAnalytics());
    } catch (error) {
      console.error('Failed to update metrics:', error);
    }
  }, []);

  const sendRealTimeMessage = useCallback((message) => {
    try {
      const sent = websocketService.send(message);
      
      if (sent) {
        analyticsService.trackUserAction('realtime_message_sent', {
          messageType: message.type
        });
      }
      
      return sent;
    } catch (error) {
      console.error('Failed to send message:', error);
      return false;
    }
  }, []);

  const trackEvent = useCallback((event, properties) => {
    analyticsService.track(event, properties);
  }, []);

  const trackUserAction = useCallback((action, context) => {
    analyticsService.trackUserAction(action, context);
  }, []);

  const getWebSocketStats = useCallback(() => {
    return websocketService.getStats();
  }, []);

  const reconnectWebSocket = useCallback(() => {
    if (config.features.websocket) {
      setWsStatus('connecting');
      websocketService.connect().catch(error => {
        console.error('Manual reconnect failed:', error);
      });
    }
  }, []);

  const cleanup = useCallback(() => {
    // Unsubscribe from WebSocket events
    unsubscribeRef.current.forEach(unsubscribe => unsubscribe());
    
    // Disconnect WebSocket
    websocketService.disconnect();
  }, []);

  return {
    // WebSocket
    wsStatus,
    realTimeData,
    sendRealTimeMessage,
    reconnectWebSocket,
    getWebSocketStats,

    // Analytics
    analytics,
    trackEvent,
    trackUserAction,

    // General
    isEnterpriseMode: config.app.isEnterprise,
    config,
    updateMetrics
  };
};

export default useEnterprise;
