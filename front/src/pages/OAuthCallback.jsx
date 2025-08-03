// front/src/pages/OAuthCallback.jsx - NUEVO COMPONENTE
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setIsLoggedIn, setUser, setToken } = useAuth();

  useEffect(() => {
    const handleCallback = () => {
      const token = searchParams.get('token');
      const provider = searchParams.get('provider');
      const error = searchParams.get('error');

      if (error) {
        console.error('OAuth Error:', error);
        navigate('/login?error=' + error);
        return;
      }

      if (token && provider) {
        console.log(`✅ OAuth success with ${provider}`);
        
        // Store token
        localStorage.setItem('token', token);
        
        // Try to decode user info from token
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const userData = {
            email: payload.sub,
            provider: provider,
            user_id: payload.user_id
          };
          
          // Update auth state
          setToken(token);
          setUser(userData);
          setIsLoggedIn(true);
          
          localStorage.setItem('user', JSON.stringify(userData));
          
          console.log('🎉 User authenticated successfully');
          navigate('/dashboard');
          
        } catch (e) {
          console.error('Error decoding token:', e);
          navigate('/login?error=invalid_token');
        }
      } else {
        console.error('Missing token or provider');
        navigate('/login?error=missing_params');
      }
    };

    handleCallback();
  }, [searchParams, navigate, setIsLoggedIn, setUser, setToken]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Completando autenticación...
        </h2>
        <p className="text-gray-600">
          Por favor espera mientras te redirigimos.
        </p>
      </div>
    </div>
  );
};

export default OAuthCallback;
