// src/pages/LandingPage.jsx
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import HeroSection from '../components/landing/HeroSection';
import MarketplaceSection from '../components/landing/MarketplaceSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import UIGeneratorSection from '../components/landing/UIGeneratorSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import PricingSection from '../components/landing/PricingSection';
import Footer from '../components/landing/Footer';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useLanding } from '../hooks/useLanding';

const LandingPage = () => {
  const {
    featuredAgents,
    stats,
    loading,
    error,
    handleInstallAgent,
    handleGetStarted,
    handleWatchDemo,
    handleExploreMarketplace,
    reload
  } = useLanding();

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Cargando Iopeer...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error de Conexión
          </h2>
          <p className="text-gray-600 mb-4">
            No se pudo conectar con el backend. Verifica que esté ejecutándose en http://localhost:8000
          </p>
          <div className="space-y-2">
            <button
              onClick={reload}
              className="flex items-center gap-2 mx-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <RefreshCw size={16} />
              Reintentar
            </button>
            <button
              onClick={handleGetStarted}
              className="block mx-auto text-blue-600 hover:text-blue-700 text-sm"
            >
              Continuar sin conexión
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <HeroSection 
        stats={stats}
        onGetStarted={handleGetStarted}
        onWatchDemo={handleWatchDemo}
      />
      
      <FeaturesSection />
      
      <MarketplaceSection 
        featuredAgents={featuredAgents}
        onInstallAgent={handleInstallAgent}
        onExploreMarketplace={handleExploreMarketplace}
      />
      
      <UIGeneratorSection />
      
      <TestimonialsSection />
      
      <PricingSection onGetStarted={handleGetStarted} />
      
      <Footer />
    </div>
  );
};

export default LandingPage;
