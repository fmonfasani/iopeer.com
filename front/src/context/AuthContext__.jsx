// front/src/context/AuthContext.jsx - AJUSTADO PARA MODELO SIMPLIFICADO
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken) {
        setToken(storedToken);
        setIsLoggedIn(true);
        
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (error) {
            console.error('Error parsing stored user:', error);
            localStorage.removeItem('user');
          }
        }
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Handle OAuth callback
  useEffect(() => {
    const handleOAuthCallback = () => {
      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get('token');
      const provider = urlParams.get('provider');
      const error = urlParams.get('error');

      if (error) {
        console.error('OAuth Error:', error);
        navigate('/login?error=' + error);
        return;
      }

      if (token && provider) {
        console.log(`✅ OAuth success with ${provider}`);
        
        // Store token
        localStorage.setItem('token', token);
        setToken(token);
        setIsLoggedIn(true);

        // Try to get user info from token (basic decode)
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const userData = {
            email: payload.sub,
            provider: provider,
            // Campos simplificados - solo lo que tenemos en el modelo
            id: payload.user_id || null
          };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (e) {
          console.warn('Could not decode token:', e);
        }

        // Redirect to dashboard
        navigate('/dashboard');
      }
    };

    if (location.pathname === '/auth/callback') {
      handleOAuthCallback();
    }
  }, [location, navigate]);

  const login = async (email, password) => {
    try {
      console.log('🔄 Attempting login...');
      
      const response = await fetch('http://localhost:8000/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      console.log('📡 Login response:', data);

      if (response.ok) {
        const authToken = data.access_token;
        
        // Usar datos simplificados - solo lo que necesitamos
        const userData = {
          email: email, // Usamos el email del input
          id: data.user?.id || null,
          // No incluir campos que no existen en el modelo
        };

        // Update state
        setToken(authToken);
        setUser(userData);
        setIsLoggedIn(true);

        // Store in localStorage
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(userData));
        
        console.log('✅ Login successful');
        return { success: true, user: userData };
      } else {
        console.error('❌ Login failed:', data);
        return { success: false, error: data.detail || 'Error de autenticación' };
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      return { 
        success: false, 
        error: 'Error de conexión. Verifica que el backend esté ejecutándose.' 
      };
    }
  };

  // OAuth login functions
  const loginWithGitHub = () => {
    console.log('🔄 Iniciando login con GitHub...');
    window.location.href = 'http://localhost:8000/auth/oauth/github';
  };

  const loginWithGoogle = () => {
    console.log('🔄 Iniciando login con Google...');
    window.location.href = 'http://localhost:8000/auth/oauth/google';
  };

  const logout = () => {
    // Clear state
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);

    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    console.log('✅ User logged out');
  };

  // Check if token is valid (you can expand this to verify with backend)
  const verifyToken = async () => {
    if (!token) return false;

    try {
      const response = await fetch('http://localhost:8000/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        logout(); // Invalid token, logout
        return false;
      }

      return true;
    } catch (error) {
      // If backend is not available, assume token is valid
      console.warn('Cannot verify token, backend unavailable');
      return true;
    }
  };

  const contextValue = {
    isLoggedIn,
    user,
    token,
    loading,
    login,
    loginWithGitHub,
    loginWithGoogle,
    logout,
    verifyToken
  };

  // Show loading spinner while initializing
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};