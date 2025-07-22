import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './components/providers/AppProvider';
import { MainLayout } from './components/common';
import AppRouter from './components/common/Router/AppRouter';
import './assets/styles/global.css';

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <MainLayout>
          <AppRouter />
        </MainLayout>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
