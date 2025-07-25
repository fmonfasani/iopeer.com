import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n';

// Verificar soporte del navegador
if (!window.Promise) {
  window.location.href = '/unsupported.html';
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
