// src/App.js - CORREGIDO CON OAUTH
import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ui/ErrorBoundary';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import OAuthCallback from './pages/OAuthCallback'; // 🆕 Callback OAuth
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }
  
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }
  
  return !isLoggedIn ? children : <Navigate to="/" replace />;
};

function AppContent() {
  return (
    <ErrorBoundary>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/landing" 
            element={
              <PublicRoute>
                <LandingPage />
              </PublicRoute>
            } 
          />
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          
          {/* 🆕 OAuth Callback Route - DEBE SER PÚBLICO */}
          <Route 
            path="/auth/callback" 
            element={<OAuthCallback />} 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/*" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Default Route */}
          <Route 
            path="/" 
            element={<RootRedirect />} 
          />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

// Component to handle root redirect logic
const RootRedirect = () => {
  const { isLoggedIn, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando Iopeer...</p>
        </div>
      </div>
    );
  }
  
  // If logged in, go to dashboard, otherwise go to landing page
  return <Navigate to={isLoggedIn ? "/dashboard" : "/landing"} replace />;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;