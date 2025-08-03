// src/components/landing/TestimonialsSection.jsx
import React, { useState, useEffect } from 'react';

const TestimonialsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      text: "Iopeer transformó completamente nuestro flujo de desarrollo. Los agentes IA nos ahorran 40% del tiempo en tareas repetitivas.",
      author: "María González",
      role: "CTO",
      company: "TechStartup",
      avatar: "MG"
    },
    {
      text: "El marketplace de agentes es increíble. Encontramos exactamente lo que necesitábamos para automatizar nuestro proceso de QA.",
      author: "Carlos Mendoza", 
      role: "Lead Developer",
      company: "CodeFactory",
      avatar: "CM"
    },
    {
      text: "Las métricas enterprise y el sistema de analytics nos dieron visibilidad total sobre el rendimiento de nuestros agentes.",
      author: "Ana Rodríguez",
      role: "Engineering Manager", 
      company: "DataCorp",
      avatar: "AR"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Lo que dicen nuestros usuarios
          </h2>
          <p className="text-xl text-gray-600">
            Más de 10,000 desarrolladores confían en Iopeer para acelerar su desarrollo
          </p>
        </div>

        <div className="relative">
          <div className="bg-gray-50 rounded-2xl p-8 text-center">
            <div className="text-2xl text-gray-600 mb-6">"{testimonials[currentTestimonial].text}"</div>
            
            <div className="flex items-center justify-center space-x-4">
              <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                {testimonials[currentTestimonial].avatar}
              </div>
              <div className="text-left">
                <div className="font-bold text-gray-900">{testimonials[currentTestimonial].author}</div>
                <div className="text-gray-600">{testimonials[currentTestimonial].role}</div>
                <div className="text-gray-500 text-sm">{testimonials[currentTestimonial].company}</div>
              </div>
            </div>
          </div>

          {/* Indicadores */}
          <div className="flex justify-center space-x-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentTestimonial ? 'bg-emerald-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
