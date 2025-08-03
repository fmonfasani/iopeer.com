// front/src/services/marketplace.service.js - CON FUNCIÓN FALTANTE AGREGADA
import { iopeerAPI } from './iopeerAPI';

class MarketplaceService {
  constructor() {
    this.featuredAgents = [
      {
        id: 'ui-generator',
        name: 'UI Component Generator',
        description: 'Genera componentes React personalizados con solo una descripción',
        category: 'Frontend',
        price: 'Gratis',
        rating: 4.8,
        installs: 1250,
        tags: ['React', 'UI', 'Components'],
        icon: '🎨',
        color: 'from-emerald-500 to-cyan-500',
        badge: 'Más vendido'
      },
      {
        id: 'api-builder',
        name: 'API Builder Pro',
        description: 'Crea APIs REST completas con autenticación y documentación',
        category: 'Backend',
        price: '$9.99/mes',
        rating: 4.9,
        installs: 890,
        tags: ['API', 'Node.js', 'REST'],
        icon: '⚡',
        color: 'from-purple-500 to-pink-500',
        badge: 'Popular'
      },
      {
        id: 'data-analyst',
        name: 'Data Analyst AI',
        description: 'Analiza datos y genera insights automáticamente',
        category: 'Analytics',
        price: '$19.99/mes',
        rating: 4.7,
        installs: 2100,
        tags: ['Analytics', 'AI', 'Data'],
        icon: '📊',
        color: 'from-blue-500 to-indigo-500',
        badge: 'Pro'
      },
      {
        id: 'content-writer',
        name: 'Content Writer Assistant',
        description: 'Genera contenido optimizado para SEO y engagement',
        category: 'Marketing',
        price: '$14.99/mes',
        rating: 4.6,
        installs: 1680,
        tags: ['Content', 'SEO', 'Marketing'],
        icon: '✍️',
        color: 'from-green-500 to-teal-500',
        badge: 'Nuevo'
      },
      {
        id: 'qa-tester',
        name: 'QA Test Generator',
        description: 'Genera tests automáticos para tus aplicaciones',
        category: 'Testing',
        price: '$12.99/mes',
        rating: 4.5,
        installs: 750,
        tags: ['Testing', 'QA', 'Automation'],
        icon: '🧪',
        color: 'from-orange-500 to-red-500',
        badge: 'Beta'
      },
      {
        id: 'seo-optimizer',
        name: 'SEO Optimizer',
        description: 'Optimiza tu contenido para motores de búsqueda',
        category: 'Marketing',
        price: '$8.99/mes',
        rating: 4.4,
        installs: 920,
        tags: ['SEO', 'Marketing', 'Optimization'],
        icon: '🚀',
        color: 'from-yellow-500 to-orange-500',
        badge: 'Gratis'
      }
    ];
  }

  async getFeaturedAgents() {
    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // En producción, esto vendría del backend
      // const response = await iopeerAPI.request('/marketplace/featured');
      // return response.agents;
      
      return this.featuredAgents;
    } catch (error) {
      console.error('Error loading featured agents:', error);
      throw new Error('No se pudieron cargar los agentes destacados');
    }
  }

  // ✅ FUNCIÓN FALTANTE AGREGADA
  async getMarketplaceStats() {
    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // En producción, esto vendría del backend
      // const response = await iopeerAPI.request('/marketplace/stats');
      // return response.stats;
      
      // Mock stats para la landing page
      return {
        totalAgents: 150,
        totalUsers: 12500,
        totalDownloads: 89000,
        uptime: 99.9,
        categories: [
          { name: 'Frontend', count: 45 },
          { name: 'Backend', count: 38 },
          { name: 'Analytics', count: 22 },
          { name: 'Marketing', count: 28 },
          { name: 'Testing', count: 17 }
        ],
        recentActivity: [
          { action: 'Agent installed', agent: 'UI Generator', time: '2 min ago' },
          { action: 'New agent published', agent: 'Data Sync Pro', time: '15 min ago' },
          { action: 'User registered', count: 5, time: '1 hour ago' }
        ]
      };
    } catch (error) {
      console.error('Error loading marketplace stats:', error);
      throw new Error('No se pudieron cargar las estadísticas del marketplace');
    }
  }

  async getAgentById(agentId) {
    try {
      const agents = await this.getFeaturedAgents();
      const agent = agents.find(a => a.id === agentId);
      
      if (!agent) {
        throw new Error(`Agente ${agentId} no encontrado`);
      }
      
      return agent;
    } catch (error) {
      console.error(`Error loading agent ${agentId}:`, error);
      throw error;
    }
  }

  async installAgent(agent) {
    try {
      console.log(`📦 Instalando agente: ${agent.name}`);
      
      // Simular instalación
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // En producción, esto iría al backend
      // const response = await iopeerAPI.installAgent(agent.id);
      
      console.log(`✅ Agente ${agent.name} instalado correctamente`);
      
      return {
        success: true,
        message: `${agent.name} se instaló correctamente`,
        agent: agent
      };
    } catch (error) {
      console.error(`Error installing agent ${agent.name}:`, error);
      throw new Error(`No se pudo instalar ${agent.name}`);
    }
  }

  async searchAgents(query) {
    try {
      const allAgents = await this.getFeaturedAgents();
      
      if (!query || query.trim() === '') {
        return allAgents;
      }
      
      const searchTerm = query.toLowerCase();
      return allAgents.filter(agent => 
        agent.name.toLowerCase().includes(searchTerm) ||
        agent.description.toLowerCase().includes(searchTerm) ||
        agent.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        agent.category.toLowerCase().includes(searchTerm)
      );
    } catch (error) {
      console.error('Error searching agents:', error);
      throw new Error('Error en la búsqueda de agentes');
    }
  }

  async getAgentsByCategory(category) {
    try {
      const allAgents = await this.getFeaturedAgents();
      return allAgents.filter(agent => 
        agent.category.toLowerCase() === category.toLowerCase()
      );
    } catch (error) {
      console.error(`Error loading agents for category ${category}:`, error);
      throw new Error(`Error cargando agentes de ${category}`);
    }
  }

  async healthCheck() {
    try {
      const healthResponse = await iopeerAPI.getHealth();
      return healthResponse;
    } catch (error) {
      console.error('Health check failed:', error);
      return null;
    }
  }
}

// Singleton instance
export const marketplaceService = new MarketplaceService();
export default MarketplaceService;
