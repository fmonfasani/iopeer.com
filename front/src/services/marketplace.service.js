// src/services/marketplace.service.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class MarketplaceService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || response.statusText);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error in ${endpoint}:`, error);
      throw error;
    }
  }

  // Obtener agentes featured del marketplace
  async getFeaturedAgents() {
    try {
      // Como el backend actual no tiene endpoint específico de marketplace,
      // vamos a usar los agentes del sistema y transformarlos
      const agentsResponse = await this.request('/agents');
      const agents = agentsResponse.agents || [];

      // Transformar agentes del backend a formato del marketplace
      return agents.map((agent, index) => ({
        id: agent.agent_id,
        name: agent.name,
        description: agent.capabilities?.description || 'Agente especializado en automatización',
        rating: 4.5 + (Math.random() * 0.5), // Rating simulado
        downloads: `${Math.floor(Math.random() * 50) + 10}K+`,
        price: index % 3 === 0 ? 'Gratis' : `$${(index + 1) * 19}/mes`,
        badge: this.getRandomBadge(index),
        color: this.getRandomColor(index),
        icon: this.getRandomIcon(index),
        features: agent.capabilities?.actions?.slice(0, 4) || ['AI', 'Automation'],
        capabilities: agent.capabilities
      }));
    } catch (error) {
      // Fallback a agentes estáticos si el backend no está disponible
      return this.getFallbackAgents();
    }
  }

  // Instalar un agente (simular instalación por ahora)
  async installAgent(agent) {
    try {
      // Intentar registrar el agente en el backend si no existe
      await this.request('/agents/register', {
        method: 'POST',
        body: JSON.stringify({
          agent_id: agent.id,
          agent_type: this.mapToBackendType(agent),
          config: agent.capabilities || {}
        })
      });

      return { success: true, message: 'Agente instalado correctamente' };
    } catch (error) {
      // Simular instalación exitosa si el backend no responde
      console.warn('Backend not available, simulating installation');
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simular delay
      return { success: true, message: 'Agente instalado correctamente (simulado)' };
    }
  }

  // Obtener estadísticas del marketplace
  async getMarketplaceStats() {
    try {
      const [agentsResponse, healthResponse] = await Promise.all([
        this.request('/agents'),
        this.request('/health')
      ]);

      return {
        totalAgents: agentsResponse.total || agentsResponse.agents?.length || 0,
        totalUsers: '10K+', // Hardcoded por ahora
        uptime: '99.9%', // Hardcoded por ahora
        activeAgents: agentsResponse.agents?.filter(a => a.status === 'idle').length || 0
      };
    } catch (error) {
      return {
        totalAgents: 150,
        totalUsers: '10K+',
        uptime: '99.9%',
        activeAgents: 6
      };
    }
  }

  // Métodos auxiliares
  getRandomBadge(index) {
    const badges = ['Más vendido', 'Premium', 'Enterprise', 'Nuevo', 'Popular', 'Pro'];
    return badges[index % badges.length];
  }

  getRandomColor(index) {
    const colors = [
      'from-blue-500 to-purple-600',
      'from-green-500 to-teal-600',
      'from-purple-500 to-pink-600',
      'from-orange-500 to-red-600',
      'from-cyan-500 to-blue-600',
      'from-red-500 to-pink-600'
    ];
    return colors[index % colors.length];
  }

  getRandomIcon(index) {
    const icons = ['💻', '📊', '📈', '🎨', '🔧', '🛡️'];
    return icons[index % icons.length];
  }

  mapToBackendType(agent) {
    // Mapear tipos de agentes del marketplace a tipos del backend
    if (agent.name.toLowerCase().includes('backend') || agent.name.toLowerCase().includes('code')) {
      return 'BackendAgent';
    }
    if (agent.name.toLowerCase().includes('qa') || agent.name.toLowerCase().includes('test')) {
      return 'QAAgent';
    }
    return 'BackendAgent'; // Default
  }

  getFallbackAgents() {
    return [
      {
        id: 'codemaster-pro',
        name: 'CodeMaster Pro',
        description: 'Asistente de programación avanzado con IA para múltiples lenguajes',
        rating: 4.9,
        downloads: '25K+',
        price: 'Gratis',
        badge: 'Más vendido',
        color: 'from-blue-500 to-purple-600',
        icon: '💻',
        features: ['Python', 'JavaScript', 'React', 'Debugging']
      },
      {
        id: 'dataviz-genius',
        name: 'DataViz Genius',
        description: 'Visualización de datos empresarial con análisis predictivo',
        rating: 4.8,
        downloads: '18K+',
        price: '$29/mes',
        badge: 'Premium',
        color: 'from-green-500 to-teal-600',
        icon: '📊',
        features: ['Analytics', 'Charts', 'Excel', 'SQL']
      },
      {
        id: 'marketing-optimizer',
        name: 'Marketing Optimizer',
        description: 'Optimización automática de campañas publicitarias',
        rating: 4.9,
        downloads: '15K+',
        price: '$49/mes',
        badge: 'Enterprise',
        color: 'from-purple-500 to-pink-600',
        icon: '📈',
        features: ['Google Ads', 'Facebook', 'Analytics', 'ROI']
      },
      {
        id: 'ui-generator',
        name: 'UI Generator',
        description: 'Genera componentes React automáticamente desde texto',
        rating: 4.7,
        downloads: '22K+',
        price: '$19/mes',
        badge: 'Nuevo',
        color: 'from-orange-500 to-red-600',
        icon: '🎨',
        features: ['React', 'Tailwind', 'Components', 'Export']
      },
      {
        id: 'api-builder',
        name: 'API Builder',
        description: 'Construye APIs REST completas en minutos',
        rating: 4.6,
        downloads: '19K+',
        price: '$39/mes',
        badge: 'Popular',
        color: 'from-cyan-500 to-blue-600',
        icon: '🔧',
        features: ['FastAPI', 'Database', 'Auth', 'Deploy']
      },
      {
        id: 'security-scanner',
        name: 'Security Scanner',
        description: 'Auditoría de seguridad automatizada para aplicaciones',
        rating: 4.8,
        downloads: '11K+',
        price: '$59/mes',
        badge: 'Pro',
        color: 'from-red-500 to-pink-600',
        icon: '🛡️',
        features: ['Vulnerability', 'Audit', 'Compliance', 'Reports']
      }
    ];
  }
}

export const marketplaceService = new MarketplaceService();
export default MarketplaceService;