// src/components/landing/UIGeneratorSection.jsx
import React, { useState } from 'react';
import { CheckCircle, Download } from 'lucide-react';

const UIGeneratorSection = () => {
  const [activeTab, setActiveTab] = useState('code');

  const features = [
    'Generación desde lenguaje natural',
    'Preview en tiempo real',
    'Múltiples estilos disponibles',
    'Exportación directa de código',
    'Soporte para componentes complejos'
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              UI Generator Revolucionario
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Genera componentes React personalizados desde descripción natural. 
              Múltiples estilos, preview en tiempo real y exportación directa de código.
            </p>

            {/* Feature List */}
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="text-emerald-500" size={20} />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex space-x-2 mb-6">
              {['code', 'design', 'export'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab === 'code' ? 'Código' : tab === 'design' ? 'Diseño' : 'Exportar'}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 rounded-2xl p-6 text-white">
            <div className="bg-gray-800 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              
              {activeTab === 'code' && (
                <div className="font-mono text-sm">
                  <div className="text-blue-300">const</div>
                  <div className="text-yellow-300 ml-2">Button = (props) => (</div>
                  <div className="text-pink-300 ml-4">&lt;button</div>
                  <div className="text-green-300 ml-6">className="px-4 py-2 bg-blue-500"</div>
                  <div className="text-pink-300 ml-4">&gt;</div>
                  <div className="text-white ml-6">{'{props.children}'}</div>
                  <div className="text-pink-300 ml-4">&lt;/button&gt;</div>
                  <div className="text-yellow-300 ml-2">);</div>
                </div>
              )}
              
              {activeTab === 'design' && (
                <div className="space-y-3">
                  <div className="bg-blue-500 px-4 py-2 rounded text-center">
                    Botón Generado
                  </div>
                  <div className="bg-emerald-500 px-4 py-2 rounded text-center">
                    Botón Verde
                  </div>
                  <div className="bg-purple-500 px-4 py-2 rounded text-center">
                    Botón Morado
                  </div>
                </div>
              )}
              
              {activeTab === 'export' && (
                <div className="text-center py-8">
                  <Download className="mx-auto mb-3 text-emerald-400" size={32} />
                  <div className="text-emerald-400">Exportando componente...</div>
                  <div className="text-gray-400 text-sm mt-2">Button.jsx</div>
                </div>
              )}
            </div>
            
            <button className="w-full bg-emerald-500 py-3 rounded-lg font-semibold hover:bg-emerald-600 transition-colors">
              Probar UI Generator
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UIGeneratorSection;