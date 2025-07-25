// src/pages/Dashboard.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserSidebar from '../components/layout/UserSidebar';
import Analytics from './Analytics';
import Reports from './Reports';
import Home from '../pages/Home';
import Agents from '../components/features/Agents/Agents';
import Marketplace from '../components/features/Marketplace/Marketplace';
import SettingsPage from '../pages/Settings';
import UIGeneratorPage from '../pages/UIGeneratorPage';

const Dashboard = () => {
  return (
    <UserSidebar>
      <Routes>
        <Route index element={<Home />} />
        <Route path="dashboard" element={<Home />} />
        <Route path="agents" element={<Agents />} />
        <Route path="ui-generator" element={<UIGeneratorPage />} />
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="reports" element={<Reports />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<SettingsPage />} />
        {/* Catch all route */}
        <Route path="*" element={<Home />} />
      </Routes>
    </UserSidebar>
  );
};

export default Dashboard;