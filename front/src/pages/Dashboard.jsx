// src/pages/Dashboard.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../components/layout/Header';
import Home from '../pages/Home';
import Agents from '../components/features/Agents/Agents';
import Marketplace from '../components/features/Marketplace/Marketplace';
import Settings from '../pages/Settings';
import UIGeneratorPage from '../pages/UIGeneratorPage';

const Dashboard = () => {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/agents" element={<Agents />} />
        <Route path="/ui-generator" element={<UIGeneratorPage />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  );
};

export default Dashboard;