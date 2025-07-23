import React, { useState, useEffect } from 'react';
import { TrendingUp, BarChart3, PieChart, Activity } from 'lucide-react';
import { useIopeer } from '../hooks/useIopeer';

const Analytics = () => {
  const { agents, systemHealth } = useIopeer();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [timeframe, setTimeframe] = useState('7days');

  useEffect(() => {
    // Simulate loading analytics data
    setTimeout(() => {
      setAnalyticsData({
        totalRequests: 15420,
        avgResponseTime: 1.2,
        errorRate: 2.1,
        topAgent: agents[0]?.name || 'Backend Agent',
        dailyRequests: [120, 145, 189, 167, 234, 198, 289],
        agentUsage: agents.map((agent, i) => ({
          name: agent.name,
          usage: Math.floor(Math.random() * 100) + 50
        }))
      });
    }, 1000);
  }, [agents]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Análisis detallado del uso de la plataforma</p>
        </div>
        
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
        >
          <option value="24h">Últimas 24 horas</option>
          <option value="7days">Últimos 7 días</option>
          <option value="30days">Últimos 30 días</option>
          <option value="90days">Últimos 90 días</option>
        </select>
      </div>

      {/* Key Metrics */}
      {analyticsData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.totalRequests.toLocaleString()}</p>
                <p className="text-sm text-green-600">+12% vs last period</p>
              </div>
              <TrendingUp className="text-green-500" size={32} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Response Time</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.avgResponseTime}s</p>
                <p className="text-sm text-green-600">-5% vs last period</p>
              </div>
              <Activity className="text-blue-500" size={32} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Error Rate</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.errorRate}%</p>
                <p className="text-sm text-red-600">+0.3% vs last period</p>
              </div>
              <BarChart3 className="text-red-500" size={32} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Top Agent</p>
                <p className="text-lg font-bold text-gray-900">{analyticsData.topAgent}</p>
                <p className="text-sm text-blue-600">Most active</p>
              </div>
              <PieChart className="text-purple-500" size={32} />
            </div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Requests Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Requests Diarios</h2>
          {analyticsData ? (
            <div className="space-y-3">
              {analyticsData.dailyRequests.map((requests, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600 w-16">Día {index + 1}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(requests / Math.max(...analyticsData.dailyRequests)) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12">{requests}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="animate-pulse space-y-3">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          )}
        </div>

        {/* Agent Usage */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Uso por Agente</h2>
          {analyticsData ? (
            <div className="space-y-4">
              {analyticsData.agentUsage.map((agent, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-900">{agent.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${agent.usage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{agent.usage}%</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="animate-pulse space-y-4">
              {[...Array(agents.length)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Real-time Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Actividad en Tiempo Real</h2>
        </div>
        
        <div className="p-6">
          <div className="space-y-3">
            {[
              { time: '10:45:23', agent: 'Backend Agent', action: 'Processed request', status: 'success' },
              { time: '10:45:20', agent: 'QA Agent', action: 'Generated test', status: 'success' },
              { time: '10:45:18', agent: 'Backend Agent', action: 'Database query', status: 'success' },
              { time: '10:45:15', agent: 'QA Agent', action: 'Code review', status: 'warning' },
              { time: '10:45:12', agent: 'Backend Agent', action: 'API call', status: 'success' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-900">{activity.agent}</span>
                  <span className="text-sm text-gray-600">{activity.action}</span>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;