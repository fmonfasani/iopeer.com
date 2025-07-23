import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, RefreshCw } from 'lucide-react';

const Settings = () => {
  const [apiUrl, setApiUrl] = useState('http://localhost:8000');
  const [autoConnect, setAutoConnect] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const handleSave = () => {
    localStorage.setItem('iopeer-settings', JSON.stringify({
      apiUrl,
      autoConnect,
      notifications
    }));
    alert('Configuración guardada');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <SettingsIcon size={32} className="text-gray-700" />
        <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Conexión</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL del Backend
            </label>
            <input
              type="url"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="http://localhost:8000"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="auto-connect"
              checked={autoConnect}
              onChange={(e) => setAutoConnect(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="auto-connect" className="ml-2 text-sm text-gray-700">
              Conectar automáticamente al iniciar
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="notifications"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="notifications" className="ml-2 text-sm text-gray-700">
              Mostrar notificaciones
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Información</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Versión Frontend:</strong> 1.0.0
          </div>
          <div>
            <strong>React:</strong> {React.version}
          </div>
          <div>
            <strong>Última Actualización:</strong> {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save size={16} />
          Guardar Configuración
        </button>
        
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <RefreshCw size={16} />
          Recargar Aplicación
        </button>
      </div>
    </div>
  );
};

export default Settings;
