import { useState, useEffect } from 'react';
import { useIopeer } from './useIopeer';

export const useDashboard = () => {
  const { agents, systemHealth, connectionStatus } = useIopeer();
  const [dashboardStats, setDashboardStats] = useState({
    totalAgents: 0,
    activeAgents: 0,
    totalExecutions: 0,
    successRate: 0,
    recentActivity: []
  });

  useEffect(() => {
    if (agents.length > 0) {
      const activeCount = agents.filter(agent => agent.status === 'idle').length;
      const totalExecutions = agents.reduce((sum, agent) => 
        sum + (agent.stats?.messages_processed || 0), 0
      );

      setDashboardStats({
        totalAgents: agents.length,
        activeAgents: activeCount,
        totalExecutions,
        successRate: 98.5, // Mock data
        recentActivity: generateRecentActivity(agents)
      });
    }
  }, [agents]);

  const generateRecentActivity = (agentList) => {
    return agentList.slice(0, 5).map((agent, index) => ({
      id: index,
      agent: agent.name,
      action: 'Processed message',
      timestamp: new Date(Date.now() - index * 60000).toLocaleTimeString(),
      status: 'success'
    }));
  };

  return {
    dashboardStats,
    agents,
    systemHealth,
    connectionStatus,
    isConnected: connectionStatus === 'connected'
  };
};