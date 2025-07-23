import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ui/ErrorBoundary';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';

function AppContent() {
  const { isLoggedIn } = useAuth();
  
  return (
    <ErrorBoundary>
      <BrowserRouter>
        {!isLoggedIn ? (
          <Routes>
            <Route path="*" element={<Login />} />
          </Routes>
        ) : (
          <Dashboard />
        )}
      </BrowserRouter>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
export default App;
