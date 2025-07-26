// ============================================
// front/src/components/debug/IntegrationTest.jsx
// Componente para probar el flujo completo
// ============================================

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Play, 
  RefreshCw,
  User,
  Server,
  Bot,
  Workflow,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useIopeer } from '../../hooks/useIopeer';
import LoadingSpinner from '../ui/LoadingSpinner';

const IntegrationTest = () => {
  const { isLoggedIn, user, login } = useAuth();
  const { 
    connectionStatus, 
    agents, 
    sendMessage, 
    isConnected,
    loading,
    error,
    retry 
  } = useIopeer();

  const [testResults, setTestResults] = useState({});
  const [currentTest, setCurrentTest] = useState(null);
  const [allTestsPassed, setAllTestsPassed] = useState(false);

  // Definir tests
  const tests = [
    {
      id: 'auth',
      name: 'Autenticación',
      description: 'Verificar que el usuario esté autenticado',
      icon: User,
      test: () => Promise.resolve(isLoggedIn)
    },
    {
      id: 'backend_connection',
      name: 'Conexión Backend',
      description: 'Verificar conexión con el servidor',
      icon: Server,
      test: async () => {
        try {
          const response = await fetch('http://localhost:8000/health');
          return response.ok;
        } catch {
          return false;
        }
      }
    },
    {
      id: 'agents_loaded',
      name: 'Agentes Cargados',
      description: 'Verificar que los agentes estén disponibles',
      icon: Bot,
      test: () => Promise.resolve(agents.length > 0)
    },
    {
      id: 'agent_communication',
      name: 'Comunicación con Agentes',
      description: 'Probar envío de mensaje a un agente',
      icon: Workflow,
      test: async () => {
        if (agents.length === 0) return false;
        try {
          const result = await sendMessage(agents[0].agent_id, 'get_capabilities', {});
          return result && result.status === 'success';
        } catch {
          return false;
        }
      }
    }
  ];

  // Ejecutar un test individual
  const runTest = async (test) => {
    setCurrentTest(test.id);
    setTestResults(prev => ({
      ...prev,
      [test.id]: { status: 'running', startTime: Date.now() }
    }));

    try {
      const result = await test.test();
      const duration = Date.now() - testResults[test.id]?.startTime || 0;
      
      setTestResults(prev => ({
        ...prev,
        [test.id]: {
          status: result ? 'passed' : 'failed',
          duration,
          result
        }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [test.id]: {
          status: 'error',
          duration: Date.now() - (testResults[test.id]?.startTime || Date.now()),
          error: error.message
        }
      }));
    }
    
    setCurrentTest(null);
  };

  // Ejecutar todos los tests
  const runAllTests = async () => {
    setTestResults({});
    setAllTestsPassed(false);
    
    for (const test of tests) {
      await runTest(test);
      // Pequeña pausa entre tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Verificar si todos pasaron
    const allPassed = tests.every(test => 
      testResults[test.id]?.status === 'passed'
    );
    setAllTestsPassed(allPassed);
  };

  // Auto-run tests when component mounts
  useEffect(() => {
    if (isLoggedIn && isConnected) {
      setTimeout(runAllTests, 1000);
    }
  }, [isLoggedIn, isConnected]);

  // Función para login de prueba
  const testLogin = async () => {
    try {
      await login('test@iopeer.com', 'test123');
    } catch (error) {
      console.error('Test login failed:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🧪 Test de Integración Iopeer
        </h1>
        <p className="text-gray-600">
          Verifica que el flujo completo Login → Dashboard → Agentes funcione correctamente
        </p>
      </div>

      {/* Estado General */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Estado del Sistema</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatusCard
            label="Usuario"
            value={isLoggedIn ? 'Autenticado' : 'No autenticado'}
            status={isLoggedIn ? 'success' : 'error'}
            detail={user?.email}
          />
          <StatusCard
            label="Backend"
            value={connectionStatus}
            status={isConnected ? 'success' : 'error'}
            detail="localhost:8000"
          />
          <StatusCard
            label="Agentes"
            value={`${agents.length} disponibles`}
            status={agents.length > 0 ? 'success' : 'warning'}
            detail={agents.map(a => a.name).join(', ')}
          />
          <StatusCard
            label="Sistema"
            value={allTestsPassed ? 'Funcionando' : 'Con errores'}
            status={allTestsPassed ? 'success' : 'warning'}
          />
        </div>
      </div>

      {/* Acciones Rápidas */}
      {!isLoggedIn && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="text-yellow-600" size={20} />
            <span className="font-medium text-yellow-800">Usuario no autenticado</span>
          </div>
          <p className="text-yellow-700 text-sm mb-3">
            Para probar el flujo completo, necesitas estar autenticado.
          </p>
          <button
            onClick={testLogin}
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors"
          >
            Hacer Login de Prueba
          </button>
        </div>
      )}

      {/* Tests */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Tests de Integración</h2>
          <button
            onClick={runAllTests}
            disabled={currentTest !== null}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Play size={16} />
            Ejecutar Tests
          </button>
        </div>

        <div className="p-6 space-y-4">
          {tests.map((test) => (
            <TestRow
              key={test.id}
              test={test}
              result={testResults[test.id]}
              isRunning={currentTest === test.id}
              onRun={() => runTest(test)}
            />
          ))}
        </div>
      </div>

      {/* Resumen */}
      {Object.keys(testResults).length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Resumen de Resultados</h2>
          <TestSummary results={testResults} tests={tests} />
        </div>
      )}

      {/* Debugging Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-gray-50 rounded-lg p-4">
          <details>
            <summary className="cursor-pointer font-medium text-gray-700">
              Debug Info (Solo en desarrollo)
            </summary>
            <pre className="mt-2 text-xs text-gray-600 overflow-auto">
              {JSON.stringify({
                isLoggedIn,
                user,
                connectionStatus,
                agentCount: agents.length,
                error: error?.message,
                testResults
              }, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
};

// Componente de estado individual
const StatusCard = ({ label, value, status, detail }) => {
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
      {detail && (
        <div className="text-xs opacity-75 mt-1 truncate" title={detail}>
          {detail}
        </div>
      )}
    </div>
  );
};

// Componente de fila de test
const TestRow = ({ test, result, isRunning, onRun }) => {
  const getStatusIcon = () => {
    if (isRunning) return <LoadingSpinner size="sm" />;
    if (!result) return <Clock className="text-gray-400" size={16} />;
    
    switch (result.status) {
      case 'passed':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'failed':
      case 'error':
        return <XCircle className="text-red-500" size={16} />;
      default:
        return <Clock className="text-gray-400" size={16} />;
    }
  };

  const getStatusText = () => {
    if (isRunning) return 'Ejecutando...';
    if (!result) return 'Pendiente';
    
    switch (result.status) {
      case 'passed': return `Pasó (${result.duration}ms)`;
      case 'failed': return 'Falló';
      case 'error': return `Error: ${result.error}`;
      default: return 'Desconocido';
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
      <div className="flex items-center gap-3">
        <test.icon className="text-gray-600" size={20} />
        <div>
          <div className="font-medium">{test.name}</div>
          <div className="text-sm text-gray-600">{test.description}</div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm">
          {getStatusIcon()}
          <span>{getStatusText()}</span>
        </div>
        
        <button
          onClick={onRun}
          disabled={isRunning}
          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors disabled:opacity-50"
        >
          <RefreshCw size={14} />
        </button>
      </div>
    </div>
  );
};

// Componente de resumen
const TestSummary = ({ results, tests }) => {
  const passed = Object.values(results).filter(r => r.status === 'passed').length;
  const failed = Object.values(results).filter(r => r.status === 'failed').length;
  const errors = Object.values(results).filter(r => r.status === 'error').length;
  const total = tests.length;

  const avgDuration = Object.values(results)
    .filter(r => r.duration)
    .reduce((sum, r) => sum + r.duration, 0) / Object.keys(results).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="text-center">
        <div className="text-2xl font-bold text-green-600">{passed}</div>
        <div className="text-sm text-gray-600">Pasaron</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-red-600">{failed + errors}</div>
        <div className="text-sm text-gray-600">Fallaron</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-blue-600">{Math.round(avgDuration)}ms</div>
        <div className="text-sm text-gray-600">Tiempo Promedio</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-purple-600">{Math.round((passed / total) * 100)}%</div>
        <div className="text-sm text-gray-600">Éxito</div>
      </div>
    </div>
  );
};

export default IntegrationTest;

