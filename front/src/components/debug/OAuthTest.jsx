// front/src/components/debug/OAuthTest.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const OAuthTest = () => {
  const [oauthStatus, setOauthStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { loginWithGitHub, loginWithGoogle, isLoggedIn, user } = useAuth();

  useEffect(() => {
    checkOAuthStatus();
  }, []);

  const checkOAuthStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/auth/oauth/status`);
      
      if (response.ok) {
        const data = await response.json();
        setOauthStatus(data);
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error checking OAuth status:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2">Verificando OAuth...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🔐 OAuth Test - IOPeer
        </h1>
        <p className="text-gray-600">
          Prueba la autenticación con Google y GitHub
        </p>
      </div>

      {/* Estado del Sistema */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Estado del Sistema</h2>
        
        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <strong>Error:</strong> {error}
            <br />
            <small>Asegúrate de que el backend esté ejecutándose en puerto 8000</small>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatusCard
              label="OAuth Habilitado"
              value={oauthStatus?.oauth_enabled ? 'Sí' : 'No'}
              status={oauthStatus?.oauth_enabled ? 'success' : 'error'}
            />
            <StatusCard
              label="Google OAuth"
              value={oauthStatus?.google_configured ? 'Configurado' : 'No configurado'}
              status={oauthStatus?.google_configured ? 'success' : 'warning'}
            />
            <StatusCard
              label="GitHub OAuth"
              value={oauthStatus?.github_configured ? 'Configurado' : 'No configurado'}
              status={oauthStatus?.github_configured ? 'success' : 'warning'}
            />
          </div>
        )}
        
        <button
          onClick={checkOAuthStatus}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          🔄 Actualizar Estado
        </button>
      </div>

      {/* Estado del Usuario */}
      {isLoggedIn && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-green-800 mb-4">
            ✅ Usuario Autenticado
          </h2>
          <div className="space-y-2">
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Nombre:</strong> {user?.name}</p>
            <p><strong>Proveedor:</strong> {user?.provider}</p>
            {user?.avatar_url && (
              <div className="flex items-center gap-2">
                <strong>Avatar:</strong>
                <img src={user.avatar_url} alt="Avatar" className="w-8 h-8 rounded-full" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pruebas de Login */}
      {!isLoggedIn && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Probar Autenticación OAuth</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Google OAuth Test */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">G</span>
                </div>
                <div>
                  <h3 className="font-semibold">Google OAuth</h3>
                  <p className="text-sm text-gray-600">
                    Estado: {oauthStatus?.google_configured ? 
                      <span className="text-green-600">✅ Configurado</span> : 
                      <span className="text-red-600">❌ No configurado</span>
                    }
                  </p>
                </div>
              </div>
              
              <button
                onClick={loginWithGoogle}
                disabled={!oauthStatus?.google_configured}
                className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🚀 Probar Login con Google
              </button>
            </div>

            {/* GitHub OAuth Test */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">GH</span>
                </div>
                <div>
                  <h3 className="font-semibold">GitHub OAuth</h3>
                  <p className="text-sm text-gray-600">
                    Estado: {oauthStatus?.github_configured ? 
                      <span className="text-green-600">✅ Configurado</span> : 
                      <span className="text-red-600">❌ No configurado</span>
                    }
                  </p>
                </div>
              </div>
              
              <button
                onClick={loginWithGitHub}
                disabled={!oauthStatus?.github_configured}
                className="w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🚀 Probar Login con GitHub
              </button>
            </div>
          </div>

          {(!oauthStatus?.google_configured || !oauthStatus?.github_configured) && (
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Configuración Pendiente</h4>
              <p className="text-yellow-700 text-sm mb-3">
                Para que funcione OAuth, necesitas configurar las aplicaciones en Google/GitHub.
              </p>
              <details className="text-sm">
                <summary className="cursor-pointer font-medium text-yellow-800">
                  Ver instrucciones de configuración
                </summary>
                <div className="mt-2 space-y-2 text-yellow-700">
                  <p><strong>Google:</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Ve a Google Cloud Console</li>
                    <li>Crea OAuth 2.0 Client ID</li>
                    <li>Redirect URI: http://localhost:8000/auth/oauth/google/callback</li>
                  </ul>
                  
                  <p><strong>GitHub:</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Ve a GitHub Developer Settings</li>
                    <li>Crea nueva OAuth App</li>
                    <li>Callback URL: http://localhost:8000/auth/oauth/github/callback</li>
                  </ul>
                  
                  <p><strong>Variables .env:</strong></p>
                  <code className="block bg-yellow-100 p-2 rounded text-xs">
                    GOOGLE_CLIENT_ID=tu_client_id<br/>
                    GOOGLE_CLIENT_SECRET=tu_secret<br/>
                    GITHUB_CLIENT_ID=tu_client_id<br/>
                    GITHUB_CLIENT_SECRET=tu_secret<br/>
                    JWT_SECRET=tu_jwt_secret
                  </code>
                </div>
              </details>
            </div>
          )}
        </div>
      )}

      {/* Debug Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <details>
          <summary className="cursor-pointer font-medium text-gray-700">
            🐛 Debug Info
          </summary>
          <pre className="mt-2 text-xs text-gray-600 overflow-auto">
            {JSON.stringify({
              oauthStatus,
              isLoggedIn,
              user,
              frontendUrl: window.location.origin,
              backendUrl: process.env.REACT_APP_API_URL || 'http://localhost:8000'
            }, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
};

// Componente helper para mostrar estado
const StatusCard = ({ label, value, status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`p-3 rounded-lg border ${getStatusColor(status)}`}>
      <div className="font-medium text-sm">{label}</div>
      <div className="text-xs mt-1">{value}</div>
    </div>
  );
};

export default OAuthTest;