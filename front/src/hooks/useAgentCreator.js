// front/src/hooks/useAgentCreator.js
import { useState, useEffect, useCallback } from 'react';
import { iopeerAPI } from '../services/iopeerAPI';
import { useIopeer } from './useIopeer';

export const useAgentCreator = () => {
  const { isConnected } = useIopeer();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [testResults, setTestResults] = useState(null);
  
  // Capacidades disponibles
  const [availableCapabilities] = useState([
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
  ]);

  // Templates de agentes
  const [agentTemplates] = useState({
    'data_processor': {
      name: 'Procesador de Datos',
      category: 'analytics',
      description: 'Agente para procesar y transformar datos',
      inputs: ['raw_data', 'transformation_rules'],
      outputs: ['processed_data', 'summary_stats'],
      capabilities: ['data_processing', 'file_handling']
    },
    'content_creator': {
      name: 'Creador de Contenido',
      category: 'content',
      description: 'Agente para generar contenido especializado',
      inputs: ['topic', 'style', 'target_audience'],
      outputs: ['generated_content', 'keywords', 'metadata'],
      capabilities: ['ai_integration', 'content_generation']
    },
    'api_integrator': {
      name: 'Integrador de APIs',
      category: 'integration',
      description: 'Agente para integrar servicios externos',
      inputs: ['api_endpoint', 'request_data', 'auth_config'],
      outputs: ['response_data', 'status_code', 'processed_result'],
      capabilities: ['api_calls', 'web_scraping']
    }
  });

  // Crear agente personalizado
  const createAgent = useCallback(async (agentData) => {
    if (!isConnected) {
      throw new Error('No está conectado al backend');
    }

    try {
      setLoading(true);
      setError(null);

      // Validar datos del agente
      const validation = validateAgentData(agentData);
      if (!validation.isValid) {
        throw new Error(`Datos inválidos: ${validation.errors.join(', ')}`);
      }

      // Preparar datos para el backend
      const agentPayload = {
        name: agentData.name,
        description: agentData.description,
        category: agentData.category || 'custom',
        agent_type: agentData.name.toLowerCase().replace(/\s+/g, '_'),
        capabilities: {
          inputs: agentData.inputs,
          outputs: agentData.outputs,
          capabilities: agentData.capabilities,
          description: agentData.description
        },
        code: agentData.generated_code,
        metadata: {
          created_by: 'user',
          created_at: agentData.created_at,
          version: '1.0.0',
          is_custom: true
        }
      };

      // En el MVP: simular creación
      // En producción: const result = await iopeerAPI.createCustomAgent(agentPayload);
      
      console.log('🤖 Creando agente personalizado:', agentPayload);
      
      // Simular delay de creación
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock response para el MVP
      const mockResult = {
        success: true,
        agent_id: `custom_${Date.now()}`,
        message: 'Agente creado exitosamente',
        agent: {
          ...agentPayload,
          agent_id: `custom_${Date.now()}`,
          status: 'active'
        }
      };

      console.log('✅ Agente creado:', mockResult);
      return mockResult;

    } catch (err) {
      console.error('❌ Error creando agente:', err);
      setError(err.message || 'Error creando agente');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isConnected]);

  // Probar agente
  const testAgent = useCallback(async (agentConfig, testData) => {
    try {
      setLoading(true);
      setError(null);
      setTestResults(null);

      console.log('🧪 Probando agente:', agentConfig.name);
      console.log('📝 Datos de prueba:', testData);

      // En el MVP: simular test
      // En producción: const result = await iopeerAPI.testCustomAgent(agentConfig, testData);

      // Simular delay de test
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock test results
      const mockResults = {
        success: true,
        execution_time: Math.random() * 2 + 0.5, // 0.5-2.5 segundos
        input_validation: {
          passed: true,
          missing_inputs: [],
          invalid_inputs: []
        },
        output_validation: {
          passed: true,
          outputs_generated: agentConfig.outputs,
          output_types_correct: true
        },
        test_outputs: agentConfig.outputs.reduce((acc, output) => {
          acc[output] = `test_result_for_${output}_${Math.random().toString(36).substr(2, 8)}`;
          return acc;
        }, {}),
        logs: [
          `[INFO] Agent ${agentConfig.name} initialized successfully`,
          `[INFO] Processing test data: ${Object.keys(testData).join(', ')}`,
          `[INFO] Generated outputs: ${agentConfig.outputs.join(', ')}`,
          `[SUCCESS] Test completed in ${(Math.random() * 2 + 0.5).toFixed(2)}s`
        ],
        performance: {
          memory_usage: `${Math.floor(Math.random() * 50 + 10)}MB`,
          cpu_usage: `${Math.floor(Math.random() * 30 + 5)}%`,
          network_requests: Math.floor(Math.random() * 5)
        }
      };

      setTestResults(mockResults);
      console.log('✅ Test completado:', mockResults);
      
      return mockResults;

    } catch (err) {
      console.error('❌ Error en test:', err);
      setError(err.message || 'Error probando agente');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Validar datos del agente
  const validateAgentData = useCallback((agentData) => {
    const errors = [];

    // Validaciones básicas
    if (!agentData.name || agentData.name.trim().length < 3) {
      errors.push('El nombre debe tener al menos 3 caracteres');
    }

    if (!agentData.description || agentData.description.trim().length < 10) {
      errors.push('La descripción debe tener al menos 10 caracteres');
    }

    if (!agentData.inputs || agentData.inputs.length === 0) {
      errors.push('Debe tener al menos un input definido');
    }

    if (!agentData.outputs || agentData.outputs.length === 0) {
      errors.push('Debe tener al menos un output definido');
    }

    if (!agentData.capabilities || agentData.capabilities.length === 0) {
      errors.push('Debe tener al menos una capacidad seleccionada');
    }

    // Validar nombres de inputs/outputs
    const nameRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
    
    agentData.inputs?.forEach(input => {
      if (!nameRegex.test(input)) {
        errors.push(`Input "${input}" tiene formato inválido. Use solo letras, números y guiones bajos.`);
      }
    });

    agentData.outputs?.forEach(output => {
      if (!nameRegex.test(output)) {
        errors.push(`Output "${output}" tiene formato inválido. Use solo letras, números y guiones bajos.`);
      }
    });

    // Validar capacidades
    const validCapabilities = availableCapabilities.map(c => c.id);
    agentData.capabilities?.forEach(cap => {
      if (!validCapabilities.includes(cap)) {
        errors.push(`Capacidad "${cap}" no es válida`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }, [availableCapabilities]);

  // Obtener agentes personalizados del usuario
  const getUserCustomAgents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // En producción: const result = await iopeerAPI.getUserCustomAgents();
      
      // Mock para el MVP
      const mockAgents = [
        {
          agent_id: 'custom_001',
          name: 'Mi Procesador de CSV',
          description: 'Agente personalizado para procesar archivos CSV',
          category: 'data',
          created_at: '2025-01-20T10:00:00Z',
          status: 'active',
          capabilities: ['data_processing', 'file_handling'],
          usage_count: 15
        },
        {
          agent_id: 'custom_002', 
          name: 'Generador de Emails',
          description: 'Agente para generar emails de marketing',
          category: 'content',
          created_at: '2025-01-18T14:30:00Z',
          status: 'active',
          capabilities: ['content_generation', 'ai_integration'],
          usage_count: 8
        }
      ];

      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockAgents;

    } catch (err) {
      setError(err.message || 'Error cargando agentes personalizados');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Eliminar agente personalizado
  const deleteCustomAgent = useCallback(async (agentId) => {
    try {
      setLoading(true);
      setError(null);

      // En producción: await iopeerAPI.deleteCustomAgent(agentId);
      
      console.log('🗑️ Eliminando agente:', agentId);
      await new Promise(resolve => setTimeout(resolve, 1000));

      return { success: true };

    } catch (err) {
      setError(err.message || 'Error eliminando agente');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualizar agente personalizado
  const updateCustomAgent = useCallback(async (agentId, updates) => {
    try {
      setLoading(true);
      setError(null);

      // En producción: await iopeerAPI.updateCustomAgent(agentId, updates);
      
      console.log('📝 Actualizando agente:', agentId, updates);
      await new Promise(resolve => setTimeout(resolve, 1000));

      return { success: true };

    } catch (err) {
      setError(err.message || 'Error actualizando agente');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Generar código de agente
  const generateAgentCode = useCallback((agentConfig) => {
    const className = agentConfig.name.replace(/\s+/g, '') + 'Agent';
    const agentType = agentConfig.name.toLowerCase().replace(/\s+/g, '_');

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
        super().__init__("${agentType}", "${agentConfig.name}")
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
  }, []);

  // Obtener estadísticas de uso
  const getAgentUsageStats = useCallback(async (agentId) => {
    try {
      // En producción: const stats = await iopeerAPI.getAgentUsageStats(agentId);
      
      // Mock stats
      const mockStats = {
        total_executions: Math.floor(Math.random() * 100 + 10),
        success_rate: (Math.random() * 20 + 80).toFixed(1), // 80-100%
        avg_execution_time: (Math.random() * 2 + 0.5).toFixed(2), // 0.5-2.5s
        last_used: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        errors_count: Math.floor(Math.random() * 5),
        most_used_inputs: ['raw_data', 'config'],
        performance_trend: 'stable' // 'improving', 'declining', 'stable'
      };

      return mockStats;

    } catch (err) {
      console.error('Error obteniendo estadísticas:', err);
      return null;
    }
  }, []);

  // Limpiar resultados de test
  const clearTestResults = useCallback(() => {
    setTestResults(null);
  }, []);

  // Limpiar errores
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Estado
    loading,
    error,
    testResults,
    availableCapabilities,
    agentTemplates,

    // Acciones principales
    createAgent,
    testAgent,
    validateAgentData,
    generateAgentCode,

    // Gestión de agentes personalizados
    getUserCustomAgents,
    deleteCustomAgent,
    updateCustomAgent,

    // Utilidades
    getAgentUsageStats,
    clearTestResults,
    clearError,

    // Estado computado
    hasTestResults: !!testResults,
    isTestSuccessful: testResults?.success === true,

    // Helpers
    getCapabilityById: (id) => availableCapabilities.find(c => c.id === id),
    getTemplateById: (id) => agentTemplates[id],
    isValidAgentName: (name) => name && name.trim().length >= 3
  };
};
