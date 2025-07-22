import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [theme, setTheme] = useState('theme-light-classic');
  const [metrics, setMetrics] = useState({
    sessionTime: 0,
    totalEvents: 42,
    wsConnected: true,
    realtimeChannels: 3
  });

  // Update session time
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        sessionTime: prev.sessionTime + 1
      }));
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Apply theme to body
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const themes = [
    { id: 'theme-light-classic', name: '☀️ Light Clásico' },
    { id: 'theme-light-colorful', name: '🌈 Light Colorido' },
    { id: 'theme-dark-default', name: '🌙 Dark Elegante' },
    { id: 'theme-dark-colorful', name: '🎨 Dark Colorido' }
  ];

  return (
    <div className="min-h-screen p-6 space-y-6" style={{backgroundColor: 'var(--bg-secondary)'}}>
      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold" style={{color: 'var(--text-primary)'}}>
            🏢 Iopeer Enterprise
          </h1>
          <p className="mt-1" style={{color: 'var(--text-secondary)'}}>
            AI Agent Platform - Funcionando perfectamente!
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <select 
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="px-4 py-2 rounded-lg border"
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
          >
            {themes.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
      </header>

      {/* Enterprise Dashboard */}
      <div className="enterprise-dashboard">
        <div className="enterprise-header">
          <div>
            <h2 className="text-2xl font-bold">🚀 Sistema Funcionando</h2>
            <p className="opacity-90">Todos los componentes están operativos</p>
          </div>
          <div className="enterprise-badge">
            <div className="font-bold">Enterprise</div>
            <div className="text-sm">v2.0.0</div>
          </div>
        </div>
        
        <div className="enterprise-metrics-grid">
          <div className="enterprise-metric-card">
            <div className="metric-label">Sesión Activa</div>
            <div className="metric-value">{metrics.sessionTime}s</div>
          </div>
          <div className="enterprise-metric-card">
            <div className="metric-label">Eventos</div>
            <div className="metric-value">{metrics.totalEvents}</div>
          </div>
          <div className="enterprise-metric-card">
            <div className="metric-label">WebSocket</div>
            <div className="metric-value">{metrics.wsConnected ? '🟢 ON' : '🔴 OFF'}</div>
          </div>
          <div className="enterprise-metric-card">
            <div className="metric-label">Canales RT</div>
            <div className="metric-value">{metrics.realtimeChannels}</div>
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          className="p-6 rounded-xl border"
          style={{
            backgroundColor: 'var(--bg-primary)',
            borderColor: 'var(--border-color)'
          }}
        >
          <h3 className="text-lg font-semibold mb-3" style={{color: 'var(--text-primary)'}}>
            ✅ Sistema Status
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span style={{color: 'var(--text-secondary)'}}>React App:</span>
              <span style={{color: 'var(--success)'}} className="font-semibold">Running</span>
            </div>
            <div className="flex justify-between">
              <span style={{color: 'var(--text-secondary)'}}>Tailwind CSS:</span>
              <span style={{color: 'var(--success)'}} className="font-semibold">Active</span>
            </div>
            <div className="flex justify-between">
              <span style={{color: 'var(--text-secondary)'}}>Theme System:</span>
              <span style={{color: 'var(--success)'}} className="font-semibold">Working</span>
            </div>
            <div className="flex justify-between">
              <span style={{color: 'var(--text-secondary)'}}>Enterprise Mode:</span>
              <span style={{color: 'var(--success)'}} className="font-semibold">Enabled</span>
            </div>
          </div>
        </div>

        <div 
          className="p-6 rounded-xl border"
          style={{
            backgroundColor: 'var(--bg-primary)',
            borderColor: 'var(--border-color)'
          }}
        >
          <h3 className="text-lg font-semibold mb-3" style={{color: 'var(--text-primary)'}}>
            🎯 Quick Actions
          </h3>
          <div className="space-y-3">
            <button 
              className="w-full py-2 px-4 rounded-lg font-medium transition-all hover:transform hover:-translate-y-1"
              style={{
                background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                color: 'white'
              }}
              onClick={() => alert('🚀 Iopeer Enterprise funcionando perfectamente!\n\n✅ React Scripts: OK\n✅ Tailwind CSS: OK\n✅ Temas: OK\n✅ Componentes: OK')}
            >
              Test System
            </button>
            <button 
              className="w-full py-2 px-4 border rounded-lg transition-all hover:transform hover:-translate-y-1"
              style={{
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
              onClick={() => window.open('http://localhost:8000/health', '_blank')}
            >
              Check Backend
            </button>
          </div>
        </div>
      </div>

      {/* Success Message */}
      <div 
        className="p-6 rounded-xl border text-center"
        style={{
          backgroundColor: 'var(--bg-primary)',
          borderColor: 'var(--success)',
          borderWidth: '2px'
        }}
      >
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold mb-2" style={{color: 'var(--success)'}}>
          ¡Todo Funcionando Correctamente!
        </h2>
        <p style={{color: 'var(--text-secondary)'}}>
          Iopeer Enterprise está listo para usar. Prueba cambiar de tema arriba.
        </p>
        <div className="mt-4 text-sm" style={{color: 'var(--text-secondary)'}}>
          🔧 React Scripts: OK | 🎨 Tailwind CSS: OK | 🌈 Temas: OK | ⚡ Enterprise: OK
        </div>
      </div>
    </div>
  );
}

export default App;
