// src/components/landing/FeaturesSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Globe, Code, BarChart3, Zap, Shield } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Users,
      title: 'Gestión de Agentes IA',
      description: 'Orquestación centralizada con comunicación asíncrona y escalabilidad horizontal',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Globe,
      title: 'Marketplace Enterprise',
      description: 'Ecosistema completo para descubrir, instalar y monetizar agentes especializados',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Code,
      title: 'UI Generator con IA',
      description: 'Genera componentes React personalizados desde descripción natural',
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      icon: BarChart3,
      title: 'Analytics en Tiempo Real',
      description: 'Métricas avanzadas, tracking de performance y análisis predictivo',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: Zap,
      title: 'Workflows Inteligentes',
      description: 'Diseña flujos conectando agentes desde nuestro editor visual',
      gradient: 'from-yellow-500 to-orange-500',
      link: '/workflows'
    },
    {
      icon: Shield,
      title: 'Seguridad Enterprise',
      description: 'Error tracking automático, caching inteligente y arquitectura modular',
      gradient: 'from-indigo-500 to-purple-500'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Potencia sin Límites
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre las características que hacen de Iopeer la plataforma más avanzada 
            para el desarrollo con inteligencia artificial
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Wrapper = feature.link ? Link : 'div';
            const wrapperProps = feature.link ? { to: feature.link } : {};
            return (
              <Wrapper
                key={index}
                {...wrapperProps}
                className="group bg-white p-8 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </Wrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;