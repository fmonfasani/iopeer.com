// src/components/landing/HeroSection.jsx
import React, { useState, useEffect } from 'react';
import { ArrowRight, Play, Code, Zap, BarChart3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FloatingElement = ({ children, delay = 0 }) => (
  <div 
    className="animate-bounce"
    style={{ 
      animationDelay: `${delay}s`,
      animationDuration: '3s',
      animationIterationCount: 'infinite'
    }}
  >
    {children}
  </div>
);

const HeroSection = ({ onGetStarted, onWatchDemo, stats }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20">
        <FloatingElement delay={0}>
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <Code className="text-white" size={32} />
          </div>
        </FloatingElement>
      </div>
      
      <div className="absolute top-40 right-20">
        <FloatingElement delay={1}>
          <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <Zap className="text-white" size={24} />
          </div>
        </FloatingElement>
      </div>

      <div className="absolute bottom-40 left-40">
        <FloatingElement delay={2}>
          <div className="w-14 h-14 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <BarChart3 className="text-white" size={28} />
          </div>
        </FloatingElement>
      </div>

      {/* Main Content */}
      <div className={`relative z-10 text-center px-6 max-w-6xl mx-auto transform transition-all duration-1000 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}>
        {/* Logo Badge */}
        <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 mb-8">
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">io</span>
          </div>
          <span className="text-white font-medium">Iopeer Platform</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          {t('hero.titlePart1')}
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            {` ${t('hero.titleHighlight')}`}
          </span>
          <br />
          {t('hero.titlePart2')}
        </h1>

        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
          {t('hero.description', { count: stats?.totalUsers || '10,000' })}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button 
            onClick={onGetStarted}
            className="group bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-emerald-600 hover:to-cyan-600 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center space-x-2"
          >
            <span>{t('hero.getStarted')}</span>
            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
          </button>
          
          <button 
            onClick={onWatchDemo}
            className="group bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transform hover:scale-105 transition-all duration-300 border border-white/20 flex items-center space-x-2"
          >
            <Play className="group-hover:scale-110 transition-transform" size={20} />
            <span>{t('hero.watchDemo')}</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">{stats?.totalAgents || '150+'}+</div>
            <div className="text-gray-300">{t('hero.agentsLabel')}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">{stats?.totalUsers || '10K+'}+</div>
            <div className="text-gray-300">{t('hero.developersLabel')}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">{stats?.uptime || '99.9%'}%</div>
            <div className="text-gray-300">{t('hero.uptimeLabel')}</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;