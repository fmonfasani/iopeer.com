// front/src/pages/AgentCreatorPage.jsx
import React, { useState, useCallback } from 'react';
import { Plus, Code, Settings, Play, Save, Eye, Zap, Brain, ArrowLeft, Copy, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorDisplay from '../components/ui/ErrorDisplay';
import { useAgentCreator } from '../hooks/useAgentCreator';

const AgentCreatorPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [agentConfig, setAgentConfig] = useState({
    name: '',
    description: '',
    category: '',
    inputs: [],
    outputs: [],
    capabilities: [],
    code_template: '',
    test_cases: []
  });

  const { 
    createAgent, 
    testAgent, 
    loading, 
    error, 
    availableCapabilities,
    agentTemplates 
  } = useAgentCreator();

  // Plantillas predefinidas de agentes
  const AGENT_TEMPLATES = {
    'data_processor': {
      name: 'Procesador de Datos',
      icon: '📊',
      description: 'Agente para procesar y transformar datos',
      inputs: ['raw_data', 'transformation_rules'],
      outputs: ['processed_data', 'summary_stats'],
      capabilities: ['data_processing', 'file_handling'],
      category: 'analytics',
      code_template: `
class CustomDataProcessor(BaseAgent):
    def handle(self, message):
        raw_data = message.get("raw_data")
        rules = message.get("transformation_rules", {})
        
        # Tu lógica aquí
        processed_data = self.process_data(raw_data, rules)
        
        return {
            "status": "success",
            "processed_data": processed_data,
            "summary_stats": self.generate_stats(processed_data)
        }
`
    },
    'content_creator': {
      name: 'Creador de Contenido',
      icon: '✍️',
      description: 'Agente para generar contenido especializado',
      inputs: ['topic', 'style', 'target_audience'],
      outputs: ['generated_content', 'keywords', 'metadata'],
      capabilities: ['ai_integration', 'content_generation'],
      category: 'content',
      code_template: `
class CustomContentCreator(BaseAgent):
    def handle(self, message):
        topic = message.get("topic")
        style = message.get("style", "professional")
        audience = message.get("target_audience", "general")
        
        # Tu lógica aquí
        content = self.generate_content(topic, style, audience)
        
        return {
            "status": "success",
            "generated_content": content,
            "keywords": self.extract_keywords(content),
            "metadata": {"word_count": len(content.split())}
        }
`
    },
    'api_integrator': {
      name: 'Integrador de APIs',
      icon: '🔗',
      description: 'Agente para integrar servicios externos',
      inputs: ['api_endpoint', 'request_data', 'auth_config'],
      outputs: ['response_data', 'status_code', 'processed_result'],
      capabilities: ['api_calls', 'web_scraping'],
      category: 'integration',
      code_template: `
class CustomAPIIntegrator(BaseAgent):
    def handle(self, message):
        endpoint = message.get("api_endpoint")
        data = message.get("request_data", {})
        auth = message.get("auth_config", {})
        
        # Tu lógica aquí
        response = self.make_api_call(endpoint, data, auth)
        
        return {
            "status": "success",
            "response_data": response,
            "status_code": response.status_code,
            "processed_result": self.process_response(response)
        }
`
    }
  };

  const CAPABILITY_OPTIONS = [
    { id: 'ai_integration', name: 'Integración IA', icon: '🧠' },
    { id: 'data_processing', name: 'Procesamiento de Datos', icon: '📊' },
    { id: 'api_calls', name: 'Llamadas API', icon: '🔗' },
    { id: 'file_handling', name: 'Manejo de Archivos', icon: '📁' },
    { id: 'database_access', name: 'Acceso a BD', icon: '🗄️' },
    { id: 'web_scraping', name: 'Web Scraping', icon: '🕷️' },
    { id: 'image_processing', name: 'Procesamiento de Imágenes', icon: '🖼️' },
    { id: 'notification_sending', name: 'Envío de Notificaciones', icon: '📧' },
    { id: 'content_generation', name: 'Generación de Contenido', icon: '✍️' },
    { id: 'automation', name: 'Automatización', icon: '⚙️' }
  ];

  const handleTemplateSelect = useCallback((templateKey) => {
    const template = AGENT_TEMPLATES[templateKey];
    setAgentConfig(prev => ({
      ...prev,
      name: template.name,
      description: template.description,
      inputs: template.inputs,
      outputs: template.outputs,
      capabilities: template.capabilities,
      category: template.category,
      code_template: template.code_template
    }));
    setCurrentStep(2);
  }, []);

  const addInput = useCallback(() => {
    const newInput = prompt('Nombre del input:');
    if (newInput) {
      setAgentConfig(prev => ({
        ...prev,
        inputs: [...prev.inputs, newInput]
      }));
    }
  }, []);

  const addOutput = useCallback(() => {
    const newOutput = prompt('Nombre del output:');
    if (newOutput) {
      setAgentConfig(prev => ({
        ...prev,
        outputs: [...prev.outputs, newOutput]
      }));
    }
  }, []);

  const toggleCapability = useCallback((capabilityId) => {
    setAgentConfig(prev => ({
      ...prev,
      capabilities: prev.capabilities.includes(capabilityId)
        ? prev.capabilities.filter(c => c !== capabilityId)
        : [...prev.capabilities, capabilityId]
    }));
  }, []);

  const generateAgentCode = useCallback(() => {
    const className = agentConfig.name.replace(/\s+/g, '') + 'Agent';
    return `
# ${agentConfig.name} - Auto-generado por IOPeer
from typing import Dict, Any
from base_agent import BaseAgent

class ${className}(BaseAgent):
    """
    ${agentConfig.description}
    
    Inputs: ${agentConfig.inputs.join(', ')}
    Outputs: ${agentConfig.outputs.join(', ')}
    Capabilities: ${agentConfig.capabilities.join(', ')}
    """
    
    def __init__(self):
        super().__init__("${agentConfig.name.toLowerCase().replace(/\s+/g, '_')}", "${agentConfig.name}")
        self.capabilities = ${JSON.stringify(agentConfig.capabilities)}
    
    def handle(self, message: Dict[str, Any]) -> Dict[str, Any]:
        """Maneja las peticiones del agente"""
        try:
            # Validar inputs requeridos
            ${agentConfig.inputs.map(input => `
            ${input} = message.get("${input}")
            if not ${input}:
                return {"status": "error", "error": "Missing required input: ${input}"}`).join('')}
            
            # Tu lógica personalizada aquí
            result = self.process_request(message)
            
            return {
                "status": "success",
                ${agentConfig.outputs.map(output => `"${output}": result.get("${output}")`).join(',\n                ')}
            }
            
        except Exception as e:
            return {"status": "error", "error": str(e)}
    
    def process_request(self, message: Dict[str, Any]) -> Dict[str, Any]:
        """Implementa tu lógica específica aquí"""
        # TODO: Implementar lógica del agente
        return {
            ${agentConfig.outputs.map(output => `"${output}": "resultado_${output}"`).join(',\n            ')}
        }
    
    def get_capabilities(self) -> Dict[str, Any]:
        """Retorna las capacidades del agente"""
        return {
            "inputs": ${JSON.stringify(agentConfig.inputs)},
            "outputs": ${JSON.stringify(agentConfig.outputs)},
            "capabilities": self.capabilities,
            "description": "${agentConfig.description}"
        }
`;
  }, [agentConfig]);

  const handleTestAgent = useCallback(async () => {
    try {
      const testData = {};
      agentConfig.inputs.forEach(input => {
        testData[input] = `test_value_for_${input}`;
      });
      
      await testAgent(agentConfig, testData);
      alert('🧪 Test completado. Revisa la consola para ver los resultados.');
    } catch (err) {
      console.error('Test failed:', err);
      alert('❌ Test falló: ' + err.message);
    }
  }, [agentConfig, testAgent]);

  const handleSaveAgent = useCallback(async () => {
    try {
      const agentData = {
        ...agentConfig,
        generated_code: generateAgentCode(),
        created_at: new Date().toISOString()
      };
      
      await createAgent(agentData);
      alert('✅ Agente guardado exitosamente!\nAhora aparecerá en tu lista de agentes personalizados.');
      navigate('/agents');
    } catch (err) {
      console.error('Save failed:', err);
      alert('❌ Error guardando agente: ' + err.message);
    }
  }, [agentConfig, generateAgentCode, createAgent, navigate]);

  if (loading) {
    return <LoadingSpinner size="xl" text="Procesando agente..." fullScreen />;
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorDisplay 
          error={error}
          onRetry={() => window.location.reload()}
          onGoHome={() => navigate('/agents')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/agents')}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Crear Agente Personalizado</h1>
                <p className="text-gray-600">Diseña tu propio agente IA especializado</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 4 && <div className={`w-16 h-1 ${currentStep > step ? 'bg-blue-600' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
          
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Plantilla</span>
            <span>Configuración</span>
            <span>Código</span>
            <span>Testing</span>
          </div>
        </div>

        {/* Step 1: Template Selection */}
        {currentStep === 1 && (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold mb-6">Selecciona una Plantilla</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(AGENT_TEMPLATES).map(([key, template]) => (
                <div 
                  key={key}
                  onClick={() => handleTemplateSelect(key)}
                  className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md cursor-pointer transition-all"
                >
                  <div className="text-4xl mb-4">{template.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{template.description}</p>
                  
                  <div className="space-y-2">
                    <div className="text-xs">
                      <span className="font-medium">Inputs:</span> {template.inputs.join(', ')}
                    </div>
                    <div className="text-xs">
                      <span className="font-medium">Outputs:</span> {template.outputs.join(', ')}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Custom Template */}
              <div 
                onClick={() => setCurrentStep(2)}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-300 cursor-pointer transition-all flex flex-col items-center justify-center"
              >
                <Plus className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Agente Personalizado</h3>
                <p className="text-gray-600 text-sm text-center">Crea un agente desde cero con tus propias especificaciones</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Configuration */}
        {currentStep === 2 && (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold mb-6">Configuración del Agente</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Basic Info */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Agente</label>
                  <input
                    type="text"
                    value={agentConfig.name}
                    onChange={(e) => setAgentConfig(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="ej: Mi Agente de Marketing"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                  <textarea
                    value={agentConfig.description}
                    onChange={(e) => setAgentConfig(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe qué hace tu agente..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                  <select
                    value={agentConfig.category}
                    onChange={(e) => setAgentConfig(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccionar categoría</option>
                    <option value="data">Procesamiento de Datos</option>
                    <option value="content">Creación de Contenido</option>
                    <option value="integration">Integración</option>
                    <option value="automation">Automatización</option>
                    <option value="analysis">Análisis</option>
                    <option value="ui">Interfaz de Usuario</option>
                  </select>
                </div>
              </div>

              {/* Inputs/Outputs */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-700">Inputs (Entradas)</label>
                    <button
                      onClick={addInput}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      + Agregar
                    </button>
                  </div>
                  <div className="space-y-2">
                    {agentConfig.inputs.map((input, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="flex-1 px-3 py-2 bg-blue-50 border border-blue-200 rounded">
                          {input}
                        </div>
                        <button
                          onClick={() => setAgentConfig(prev => ({
                            ...prev,
                            inputs: prev.inputs.filter((_, i) => i !== index)
                          }))}
                          className="text-red-600 hover:text-red-800"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-700">Outputs (Salidas)</label>
                    <button
                      onClick={addOutput}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      + Agregar
                    </button>
                  </div>
                  <div className="space-y-2">
                    {agentConfig.outputs.map((output, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="flex-1 px-3 py-2 bg-green-50 border border-green-200 rounded">
                          {output}
                        </div>
                        <button
                          onClick={() => setAgentConfig(prev => ({
                            ...prev,
                            outputs: prev.outputs.filter((_, i) => i !== index)
                          }))}
                          className="text-red-600 hover:text-red-800"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Capabilities */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Capacidades del Agente</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {CAPABILITY_OPTIONS.map((capability) => (
                  <div
                    key={capability.id}
                    onClick={() => toggleCapability(capability.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      agentConfig.capabilities.includes(capability.id)
                        ? 'bg-blue-50 border-blue-300 text-blue-800'
                        : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{capability.icon}</div>
                    <div className="text-sm font-medium">{capability.name}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-6 py-2 text-gray-600 hover:text-gray-800"
              >
                ← Atrás
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Continuar →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Code Generation */}
        {currentStep === 3 && (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold mb-6">Código Generado</h2>
            
            <div className="bg-gray-900 rounded-lg p-6 mb-6 relative">
              <button
                onClick={() => navigator.clipboard.writeText(generateAgentCode())}
                className="absolute top-4 right-4 px-3 py-1 bg-gray-700 text-white rounded text-sm hover:bg-gray-600 flex items-center space-x-1"
              >
                <Copy className="w-4 h-4" />
                <span>Copiar</span>
              </button>
              <pre className="text-green-400 text-sm overflow-x-auto pr-20">
                <code>{generateAgentCode()}</code>
              </pre>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-6 py-2 text-gray-600 hover:text-gray-800"
              >
                ← Atrás
              </button>
              <div className="space-x-4">
                <button
                  onClick={() => {
                    const blob = new Blob([generateAgentCode()], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${agentConfig.name.replace(/\s+/g, '_')}_agent.py`;
                    a.click();
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar</span>
                </button>
                <button
                  onClick={() => setCurrentStep(4)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Probar Agente →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Testing */}
        {currentStep === 4 && (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold mb-6">Probar tu Agente</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Test Input */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Datos de Prueba</h3>
                <div className="space-y-4">
                  {agentConfig.inputs.map((input, index) => (
                    <div key={index}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {input}
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={`Valor de prueba para ${input}`}
                      />
                    </div>
                  ))}
                  
                  <button
                    onClick={handleTestAgent}
                    className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2"
                  >
                    <Play className="w-5 h-5" />
                    <span>Ejecutar Prueba</span>
                  </button>
                </div>
              </div>

              {/* Test Results */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Resultados de Prueba</h3>
                <div className="bg-gray-50 rounded-lg p-6 min-h-64">
                  <div className="text-center text-gray-500">
                    <Zap className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>Ejecuta una prueba para ver los resultados aquí</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Agent Summary */}
            <div className="mt-8 bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Resumen del Agente</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-sm text-gray-600">Nombre</div>
                  <div className="font-medium">{agentConfig.name || 'Sin nombre'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Inputs</div>
                  <div className="font-medium">{agentConfig.inputs.length} entradas</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Outputs</div>
                  <div className="font-medium">{agentConfig.outputs.length} salidas</div>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="text-sm text-gray-600">Capacidades</div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {agentConfig.capabilities.map(cap => {
                    const capability = CAPABILITY_OPTIONS.find(c => c.id === cap);
                    return capability ? (
                      <span key={cap} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {capability.icon} {capability.name}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentStep(3)}
                className="px-6 py-2 text-gray-600 hover:text-gray-800"
              >
                ← Atrás
              </button>
              <div className="space-x-4">
                <button
                  onClick={handleSaveAgent}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
                >
                  <Save className="w-5 h-5" />
                  <span>Guardar Agente</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentCreatorPage;
