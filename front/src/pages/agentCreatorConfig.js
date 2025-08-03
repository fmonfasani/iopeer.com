// src/pages/agentCreatorConfig.js

export const AGENT_TEMPLATES = {
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

export const CAPABILITY_OPTIONS = [
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

