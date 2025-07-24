// src/components/landing/PricingSection.jsx
import React from 'react';
import { CheckCircle } from 'lucide-react';

const PricingSection = ({ onGetStarted }) => {
  const plans = [
    {
      name: 'Starter',
      price: 'Gratis',
      description: 'Perfecto para comenzar',
      features: ['5 agentes IA', 'Marketplace básico', 'Analytics básico', 'Soporte comunidad'],
      cta: 'Comenzar Gratis',
      popular: false,
      action: () => onGetStarted()
    },
    {
      name: 'Pro',
      price: '$29/mes',
      description: 'Para desarrolladores profesionales',
      features: ['Agentes ilimitados', 'UI Generator avanzado', 'Analytics completo', 'Soporte prioritario', 'Temas personalizados'],
      cta: 'Prueba 14 días gratis',
      popular: true,
      action: () => onGetStarted()
    },
    {
      name: 'Enterprise',
      price: 'Contactar',
      description: 'Para equipos y empresas',
      features: ['Todo de Pro', 'SSO & SAML', 'SLA 99.9%', 'Soporte dedicado', 'On-premise disponible'],
      cta: 'Contactar Ventas',
      popular: false,
      action: () => {
        // Aquí podrías abrir un modal de contacto o redirigir
        console.log('Contact sales clicked');
      }
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Planes para cada necesidad
          </h2>
          <p className="text-xl text-gray-600">
            Desde desarrolladores individuales hasta empresas multinacionales
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div key={index} className={`bg-white rounded-2xl p-8 shadow-lg relative ${
              plan.popular ? 'border-2 border-emerald-500 transform scale-105' : 'border border-gray-200'
            }`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Más Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">{plan.price}</div>
                <p className="text-gray-600">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center space-x-3">
                    <CheckCircle className="text-emerald-500" size={20} />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={plan.action}
                className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                  plan.popular 
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;