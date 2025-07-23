import React, { useState, useEffect } from 'react';
import { FileText, Download, Filter, Calendar, TrendingUp, Users, Activity } from 'lucide-react';
import { useIopeer } from '../hooks/useIopeer';

const Reports = () => {
  const { agents, systemHealth } = useIopeer();
  const [timeRange, setTimeRange] = useState('week');
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    // Simulate loading report data
    setTimeout(() => {
      setReportData({
        totalAgents: agents.length,
        activeAgents: agents.filter(a => a.status === 'idle').length,
        totalExecutions: 1247,
        successRate: 94.2,
        avgResponseTime: '1.2s'
      });
    }, 1000);
  }, [agents]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Reportes detallados de tu plataforma</p>
        </div>
        
        <div className="flex space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="day">Último día</option>
            <option value="week">Última semana</option>
            <option value="month">Último mes</option>
            <option value="year">Último año</option>
          </select>
          
          <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            <Download size={16} />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {reportData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Agentes</p>
                <p className="text-2xl font-bold text-gray-900">{reportData.totalAgents}</p>
              </div>
              <Users className="text-green-500" size={32} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Agentes Activos</p>
                <p className="text-2xl font-bold text-gray-900">{reportData.activeAgents}</p>
              </div>
              <Activity className="text-blue-500" size={32} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ejecuciones</p>
                <p className="text-2xl font-bold text-gray-900">{reportData.totalExecutions.toLocaleString()}</p>
              </div>
              <TrendingUp className="text-purple-500" size={32} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tasa de Éxito</p>
                <p className="text-2xl font-bold text-gray-900">{reportData.successRate}%</p>
              </div>
              <FileText className="text-yellow-500" size={32} />
            </div>
          </div>
        </div>
      )}

      {/* Detailed Report */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Reporte Detallado</h2>
        </div>
        
        <div className="p-6">
          {reportData ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Rendimiento de Agentes</h3>
                  <div className="space-y-3">
                    {agents.map((agent, index) => (
                      <div key={agent.agent_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{agent.name}</p>
                          <p className="text-sm text-gray-600">{agent.stats?.messages_processed || 0} mensajes procesados</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-green-600">98.{90 + index}%</p>
                          <p className="text-xs text-gray-500">Éxito</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Métricas del Sistema</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Tiempo de respuesta promedio</span>
                      <span className="font-medium">{reportData.avgResponseTime}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Uptime</span>
                      <span className="font-medium text-green-600">99.9%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Errores totales</span>
                      <span className="font-medium">12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Última actualización</span>
                      <span className="font-medium">{new Date().toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Generando reporte...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;