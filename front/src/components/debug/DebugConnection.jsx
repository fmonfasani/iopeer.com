// front/src/components/debug/DebugConnection.jsx
import React, { useState, useEffect } from 'react';

const DebugConnection = () => {
  const [status, setStatus] = useState('Testing...');
  const [results, setResults] = useState([]);

  const addResult = (test, success, data) => {
    setResults(prev => [...prev, { test, success, data, timestamp: new Date().toLocaleTimeString() }]);
  };

  const testConnection = async () => {
    setResults([]);
    setStatus('Running tests...');

    // Test 1: Basic fetch
    try {
      console.log('Testing basic fetch...');
      const response = await fetch('http://localhost:8000/health');
      const data = await response.json();
      addResult('Health Check', true, data);
    } catch (error) {
      addResult('Health Check', false, error.message);
    }

    // Test 2: CORS
    try {
      console.log('Testing CORS...');
      const response = await fetch('http://localhost:8000/', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      addResult('CORS Test', true, data);
    } catch (error) {
      addResult('CORS Test', false, error.message);
    }

    // Test 3: Auth endpoint
    try {
      console.log('Testing auth...');
      const response = await fetch('http://localhost:8000/auth/test');
      const data = await response.json();
      addResult('Auth Test', true, data);
    } catch (error) {
      addResult('Auth Test', false, error.message);
    }

    // Test 4: Agents
    try {
      console.log('Testing agents...');
      const response = await fetch('http://localhost:8000/agents');
      const data = await response.json();
      addResult('Agents Test', true, data);
    } catch (error) {
      addResult('Agents Test', false, error.message);
    }

    setStatus('Tests completed');
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">🔧 Debug Connection</h1>
      <p className="mb-4">Status: <strong>{status}</strong></p>
      
      <button 
        onClick={testConnection}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Run Tests Again
      </button>

      <div className="space-y-2">
        {results.map((result, index) => (
          <div 
            key={index} 
            className={`p-3 rounded border ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">
                {result.success ? '✅' : '❌'} {result.test}
              </span>
              <span className="text-sm text-gray-500">{result.timestamp}</span>
            </div>
            <pre className="text-xs mt-2 overflow-auto max-h-32">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DebugConnection;