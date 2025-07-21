import React, { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, Users, Download, Eye, Heart,
  ArrowUp, ArrowDown, Calendar, Clock, Globe, Zap
} from 'lucide-react';

const AnalyticsDashboard = ({ isVisible, onClose }) => {
  const [timeRange, setTimeRange] = useState('7d');
  const [activeMetric, setActiveMetric] = useState('overview');
  const [realTimeData, setRealTimeData] = useState({
    activeUsers: 1247,
    sessionsToday: 3892,
    newSignups: 156,
    agentInstalls: 2341
  });

  // Simular datos en tiempo real
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 20) - 10,
        sessionsToday: prev.sessionsToday + Math.floor(Math.random() * 50),
        newSignups: prev.newSignups + Math.floor(Math.random() * 5),
        agentInstalls: prev.agentInstalls + Math.floor(Math.random() * 30)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [isVisible]);

  const metrics = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <BarChart3 size={16} />,
      data: [
        { label: 'Usuarios Activos', value: realTimeData.activeUsers, change: '+12%', trend: 'up' },
        { label: 'Sesiones Hoy', value: realTimeData.sessionsToday, change: '+8%', trend: 'up' },
        { label: 'Nuevos Registros', value: realTimeData.newSignups, change: '+23%', trend: 'up' },
        { label: 'Instalaciones', value: realTimeData.agentInstalls, change: '+15%', trend: 'up' }
      ]
    },
    {
      id: 'agents',
      label: 'Agentes',
      icon: <Zap size={16} />,
      data: [
        { label: 'Más Popular', value: 'CodeMaster Pro', change: '2.1k installs', trend: 'up' },
        { label: 'Mejor Rating', value: 'Marketing Optimizer', change: '4.9 ⭐', trend: 'up' },
        { label: 'Más Nuevo', value: 'Design Assistant', change: 'Hace 2 días', trend: 'new' },
        { label: 'Trending', value: 'DataViz Genius', change: '+45% esta semana', trend: 'up' }
      ]
    },
    {
      id: 'users',
      label: 'Usuarios',
      icon: <Users size={16} />,
      data: [
        { label: 'Usuarios Totales', value: '47,523', change: '+18%', trend: 'up' },
        { label: 'Usuarios Premium', value: '12,847', change: '+25%', trend: 'up' },
        { label: 'Retención 30d', value: '68%', change: '+3%', trend: 'up' },
        { label: 'Tiempo Promedio', value: '24 min', change: '+12%', trend: 'up' }
      ]
    }
  ];

  const timeRanges = [
    { value: '1d', label: 'Último día' },
    { value: '7d', label: 'Últimos 7 días' },
    { value: '30d', label: 'Últimos 30 días' },
    { value: '90d', label: 'Últimos 90 días' }
  ];

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden border border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
              <BarChart3 className="w-6 h-6 text-emerald-400" />
              <span>Analytics Dashboard</span>
            </h2>
            <p className="text-slate-400 mt-1">Métricas en tiempo real de AgentHub</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm"
            >
              {timeRanges.map(range => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
            
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700">
          {metrics.map(metric => (
            <button
              key={metric.id}
              onClick={() => setActiveMetric(metric.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 transition-colors ${
                activeMetric === metric.id 
                  ? 'bg-slate-700 text-white border-b-2 border-emerald-500' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {metric.icon}
              <span className="text-sm font-medium">{metric.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.find(m => m.id === activeMetric)?.data.map((item, index) => (
              <div key={index} className="bg-slate-700/30 rounded-xl p-4 border border-slate-600">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-slate-300 text-sm">{item.label}</h3>
                  <div className={`flex items-center space-x-1 ${
                    item.trend === 'up' ? 'text-emerald-400' : 
                    item.trend === 'down' ? 'text-red-400' : 'text-blue-400'
                  }`}>
                    {item.trend === 'up' && <ArrowUp size={12} />}
                    {item.trend === 'down' && <ArrowDown size={12} />}
                    {item.trend === 'new' && <Zap size={12} />}
                    <span className="text-xs">{item.change}</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-white">
                  {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
                </div>
              </div>
            ))}
          </div>

          {/* Chart Area */}
          <div className="bg-slate-700/20 rounded-xl p-6 border border-slate-600">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Tendencia - {timeRange}</h3>
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span>Datos en tiempo real</span>
              </div>
            </div>
            
            {/* Mock Chart */}
            <div className="h-64 flex items-end space-x-2">
              {Array.from({ length: 24 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-emerald-500/50 to-emerald-400/80 rounded-t transition-all duration-1000"
                  style={{
                    height: `${Math.random() * 80 + 20}%`,
                    animationDelay: `${i * 0.05}s`
                  }}
                />
              ))}
            </div>
            
            <div className="flex justify-between text-xs text-slate-500 mt-4">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>23:59</span>
            </div>
          </div>

          {/* Real-time Feed */}
          <div className="mt-6 bg-slate-700/20 rounded-xl p-6 border border-slate-600">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <Globe className="w-5 h-5 text-cyan-400" />
              <span>Actividad en Tiempo Real</span>
            </h3>
            
            <div className="space-y-3 max-h-32 overflow-y-auto">
              {[
                { user: 'Carlos M.', action: 'instaló', agent: 'CodeMaster Pro', time: 'hace 2s' },
                { user: 'Ana R.', action: 'valoró', agent: 'DataViz Genius', time: 'hace 15s' },
                { user: 'Miguel S.', action: 'descargó', agent: 'Content Creator AI', time: 'hace 32s' },
                { user: 'Laura P.', action: 'instaló', agent: 'Marketing Optimizer', time: 'hace 1m' },
                { user: 'David L.', action: 'favoreó', agent: 'Design Assistant', time: 'hace 2m' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-white font-medium">{activity.user}</span>
                    <span className="text-slate-400">{activity.action}</span>
                    <span className="text-emerald-400">{activity.agent}</span>
                  </div>
                  <span className="text-slate-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
