import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Agents from './components/features/Agents/Agents';
import Marketplace from './components/features/Marketplace/Marketplace';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/agents" element={<Agents />} />
        <Route path="/marketplace" element={<Marketplace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
