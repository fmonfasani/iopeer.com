import React from 'react';
import DashboardSidebar from './DashboardSidebar'; 

const UserSidebar = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar />
      
      {/* Main Content */}
      <main className="transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default UserSidebar;