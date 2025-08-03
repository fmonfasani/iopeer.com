// front/src/services/miAppAPI.js - Mock API para MI APP
class MiAppAPI {
    constructor() {
      this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      this.timeout = 30000;
    }

    // Simular delay de red
    async delay(ms = 1000) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Proyectos
    async createProject(projectData) {
      await this.delay(1500);

      // Simular posible error (5% chance)
      if (Math.random() < 0.05) {
        throw new Error('Error del servidor al crear proyecto');
      }

      return {
        success: true,
        project: {
          id: Date.now(),
          ...projectData,
          status: 'draft',
          created_at: new Date().toISOString(),
          agents_used: []
        }
      };
    }

    async buildProject(projectId, template) {
      await this.delay(3000); // Simular tiempo de construcción

      if (Math.random() < 0.1) { // 10% chance de error
        throw new Error(`Error construyendo con template ${template}`);
      }

      return {
        success: true,
        status: 'ready',
        build_time: '3.2s',
        agents_used: this.getAgentsForTemplate(template)
      };
    }

    async deployProject(projectId) {
      await this.delay(2000);

      if (Math.random() < 0.05) { // 5% chance de error
        throw new Error('Error en el deployment');
      }

      return {
        success: true,
        url: `https://proyecto-${projectId}.iopeer.app`,
        deployment_time: '45s',
        status: 'deployed'
      };
    }

    async getProjectCode(projectId) {
      await this.delay(800);

      const mockCode = {
        frontend: '// React frontend code...',
        backend: '// FastAPI backend code...',
        config: '// Configuration files...'
      };

      return {
        success: true,
        code: mockCode,
        download_url: `data:application/zip;base64,${btoa(JSON.stringify(mockCode))}`
      };
    }

    async deleteProject(projectId) {
      await this.delay(500);
      return { success: true };
    }

    async updateProject(projectId, updates) {
      await this.delay(800);
      return { success: true, updated_fields: Object.keys(updates) };
    }

    // Templates
    getTemplates() {
      return [
        {
          id: 'ecommerce',
          name: "E-commerce Store",
          description: "Tienda online completa con carrito y pagos",
          agents: ["UI Generator", "Backend Agent", "Payment Agent", "SEO Agent"],
          time: "15 min",
          complexity: "Intermedio",
          category: "business"
        },
        {
          id: 'blog',
          name: "Blog/Portfolio",
          description: "Blog personal con CMS y portfolio",
          agents: ["UI Generator", "Content Agent", "SEO Agent"],
          time: "8 min",
          complexity: "Fácil",
          category: "content"
        },
        {
          id: 'saas',
          name: "SaaS MVP",
          description: "Landing + Dashboard + API básica",
          agents: ["UI Generator", "Backend Agent", "Auth Agent", "Analytics"],
          time: "25 min",
          complexity: "Avanzado",
          category: "business"
        },
        {
          id: 'mobile',
          name: "Mobile App",
          description: "App móvil con React Native",
          agents: ["Mobile UI Agent", "Backend Agent", "Push Notifications"],
          time: "30 min",
          complexity: "Avanzado",
          category: "mobile"
        }
      ];
    }

    getAgentsForTemplate(template) {
      const templateAgents = {
        'E-commerce Store': ['UI Generator', 'Backend Agent', 'Payment Agent', 'SEO Agent'],
        'Blog/Portfolio': ['UI Generator', 'Content Agent', 'SEO Agent'],
        'SaaS MVP': ['UI Generator', 'Backend Agent', 'Auth Agent', 'Analytics'],
        'Mobile App': ['Mobile UI Agent', 'Backend Agent', 'Push Notifications']
      };

      return templateAgents[template] || ['UI Generator'];
    }

    // Estadísticas
    async getProjectStats() {
      await this.delay(500);

      return {
        total_projects: Math.floor(Math.random() * 20 + 5),
        active_projects: Math.floor(Math.random() * 10 + 2),
        total_deployments: Math.floor(Math.random() * 50 + 10),
        total_agents_used: Math.floor(Math.random() * 15 + 5),
        success_rate: Math.floor(Math.random() * 10 + 90) // 90-100%
      };
    }
  }

  export const miAppAPI = new MiAppAPI();
  export default miAppAPI;
