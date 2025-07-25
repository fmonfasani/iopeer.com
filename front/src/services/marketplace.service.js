// front/src/services/marketplace.service.js - CORREGIDO
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
        icon: '🎨'
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
        icon: '⚡'
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
        icon: '📊'
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
        icon: '✍️'
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
        icon: '🧪'
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
        icon: '🚀'
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

  // ✅ FUNCIÓN ARREGLADA - Ahora está correctamente dentro de la clase
  async healthCheck() {
    try {
      const healthResponse = await iopeerAPI.getHealth();
      return healthResponse; // ✅ Variable utilizada correctamente
    } catch (error) {
      console.error('Health check failed:', error);
      return null;
    }
  }
}

// Singleton instance
export const marketplaceService = new MarketplaceService();
export default MarketplaceService;