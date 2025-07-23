import React from 'react';
import SuperbaseSidebar from './SuperbaseSidebar';

const PlatziLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SuperbaseSidebar />
      
      {/* Main Content */}
      <main className="transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default PlatziLayout;