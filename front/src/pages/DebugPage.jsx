// ============================================
// front/src/pages/DebugPage.jsx
// Página para debugging y testing
// ============================================

import React from 'react';
import IntegrationTest from '../components/debug/IntegrationTest';

const DebugPage = () => {
  // Solo mostrar en desarrollo
  if (process.env.NODE_ENV !== 'development') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Página Solo para Desarrollo
          </h1>
          <p className="text-gray-600">
            Esta página solo está disponible en modo desarrollo.
          </p>
        </div>
      </div>
    );
  }

  return <IntegrationTest />;
};

export default DebugPage;

// ============================================
// Agregar ruta en App.js o Dashboard.jsx
// ============================================

/*
En Dashboard.jsx, agregar:

import DebugPage from '../pages/DebugPage';

// En las Routes:
<Route path="debug" element={<DebugPage />} />

// En el sidebar (solo en desarrollo):
{process.env.NODE_ENV === 'development' && (
  <Link to="/debug" className="nav-link">
    🧪 Debug
  </Link>
)}
*/
