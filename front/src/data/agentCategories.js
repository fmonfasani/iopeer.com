// Categorías de agentes
export const AGENT_CATEGORIES = {
  DEVELOPMENT: 'development',
  DATA_ANALYSIS: 'data_analysis',
  CONTENT: 'content',
  DESIGN: 'design',
  MARKETING: 'marketing',
  BUSINESS: 'business',
  EDUCATION: 'education',
  PRODUCTIVITY: 'productivity'
};

export const CATEGORY_LABELS = {
  [AGENT_CATEGORIES.DEVELOPMENT]: 'Desarrollo',
  [AGENT_CATEGORIES.DATA_ANALYSIS]: 'Análisis de Datos',
  [AGENT_CATEGORIES.CONTENT]: 'Contenido',
  [AGENT_CATEGORIES.DESIGN]: 'Diseño',
  [AGENT_CATEGORIES.MARKETING]: 'Marketing',
  [AGENT_CATEGORIES.BUSINESS]: 'Negocios',
  [AGENT_CATEGORIES.EDUCATION]: 'Educación',
  [AGENT_CATEGORIES.PRODUCTIVITY]: 'Productividad'
};

// Datos de agentes del marketplace
export const MARKETPLACE_AGENTS = [
  // Desarrollo
  {
    id: 'codemaster-pro',
    name: 'CodeMaster Pro',
    category: AGENT_CATEGORIES.DEVELOPMENT,
    avatar: '💻',
    description: 'Asistente de programación avanzado especializado en Python, JavaScript y React. Genera código, encuentra bugs y optimiza rendimiento.',
    longDescription: 'CodeMaster Pro es tu compañero perfecto para el desarrollo de software. Utiliza los últimos modelos de IA para generar código limpio, detectar bugs sutiles y optimizar el rendimiento de tus aplicaciones.',
    author: 'DevStudio',
    rating: 4.9,
    installs: 25000,
    price: 'Gratis',
    premium: false,
    verified: true,
    tags: ['Python', 'JavaScript', 'React', 'Debugging', 'Code Review'],
    capabilities: [
      'Generación de código en múltiples lenguajes',
      'Detección automática de bugs',
      'Optimización de rendimiento',
      'Code review inteligente',
      'Refactoring automático'
    ],
    demo: true,
    featured: true,
    color: 'from-blue-500 to-purple-600'
  },
  {
    id: 'api-architect',
    name: 'API Architect',
    category: AGENT_CATEGORIES.DEVELOPMENT,
    avatar: '🏗️',
    description: 'Diseña y documenta APIs RESTful perfectas. Genera documentación OpenAPI automáticamente.',
    author: 'TechFlow',
    rating: 4.7,
    installs: 12000,
    price: '$19/mes',
    premium: true,
    verified: true,
    tags: ['API', 'REST', 'OpenAPI', 'Documentation'],
    demo: true,
    featured: false,
    color: 'from-green-500 to-blue-600'
  },
  {
    id: 'test-genius',
    name: 'Test Genius',
    category: AGENT_CATEGORIES.DEVELOPMENT,
    avatar: '🧪',
    description: 'Genera casos de prueba automatizados y tests unitarios para tu código.',
    author: 'QualityLabs',
    rating: 4.6,
    installs: 8500,
    price: 'Gratis',
    premium: false,
    verified: true,
    tags: ['Testing', 'Unit Tests', 'Automation'],
    demo: true,
    featured: false,
    color: 'from-purple-500 to-pink-600'
  },

  // Análisis de Datos
  {
    id: 'dataviz-genius',
    name: 'DataViz Genius',
    category: AGENT_CATEGORIES.DATA_ANALYSIS,
    avatar: '📊',
    description: 'Crea visualizaciones impactantes y análisis profundos de tus datos. Integración con Excel, CSV y bases de datos.',
    longDescription: 'Transforma tus datos en insights accionables con visualizaciones profesionales y análisis estadísticos avanzados.',
    author: 'DataPro',
    rating: 4.8,
    installs: 18000,
    price: '$29/mes',
    premium: true,
    verified: true,
    tags: ['Visualización', 'Excel', 'SQL', 'Charts', 'Analytics'],
    capabilities: [
      'Visualizaciones interactivas',
      'Análisis estadístico',
      'Integración con múltiples fuentes',
      'Reportes automatizados',
      'Predicciones con ML'
    ],
    demo: true,
    featured: true,
    color: 'from-green-500 to-teal-600'
  },
  {
    id: 'sql-master',
    name: 'SQL Master',
    category: AGENT_CATEGORIES.DATA_ANALYSIS,
    avatar: '🗄️',
    description: 'Genera consultas SQL complejas y optimiza bases de datos automáticamente.',
    author: 'DatabasePro',
    rating: 4.7,
    installs: 15000,
    price: '$39/mes',
    premium: true,
    verified: true,
    tags: ['SQL', 'Database', 'Optimization'],
    demo: true,
    featured: false,
    color: 'from-indigo-500 to-purple-600'
  },

  // Contenido
  {
    id: 'content-creator-ai',
    name: 'Content Creator AI',
    category: AGENT_CATEGORIES.CONTENT,
    avatar: '✍️',
    description: 'Genera contenido para blogs, redes sociales y marketing. Adaptado al tono de tu marca con SEO optimizado.',
    longDescription: 'Crea contenido que conecte con tu audiencia. Desde posts de blog hasta copys publicitarios, todo optimizado para SEO.',
    author: 'ContentHub',
    rating: 4.7,
    installs: 32000,
    price: 'Gratis',
    premium: false,
    verified: true,
    tags: ['Copywriting', 'SEO', 'Social Media', 'Blog', 'Marketing'],
    capabilities: [
      'Generación de contenido multicanal',
      'Optimización SEO automática',
      'Adaptación al tono de marca',
      'Calendarios de contenido',
      'Análisis de engagement'
    ],
    demo: true,
    featured: true,
    color: 'from-orange-500 to-red-600'
  },
  {
    id: 'social-scheduler',
    name: 'Social Scheduler',
    category: AGENT_CATEGORIES.CONTENT,
    avatar: '📱',
    description: 'Programa y optimiza publicaciones en redes sociales para máximo engagement.',
    author: 'SocialPro',
    rating: 4.5,
    installs: 22000,
    price: '$15/mes',
    premium: true,
    verified: true,
    tags: ['Social Media', 'Scheduling', 'Engagement'],
    demo: true,
    featured: false,
    color: 'from-pink-500 to-rose-600'
  },

  // Diseño
  {
    id: 'design-assistant',
    name: 'Design Assistant',
    category: AGENT_CATEGORIES.DESIGN,
    avatar: '🎨',
    description: 'Crea mockups, paletas de colores y elementos de diseño profesionales.',
    author: 'CreativeStudio',
    rating: 4.6,
    installs: 14000,
    price: '$25/mes',
    premium: true,
    verified: true,
    tags: ['UI/UX', 'Mockups', 'Colors', 'Design'],
    demo: true,
    featured: false,
    color: 'from-purple-500 to-pink-600'
  },

  // Marketing
  {
    id: 'marketing-optimizer',
    name: 'Marketing Optimizer',
    category: AGENT_CATEGORIES.MARKETING,
    avatar: '📈',
    description: 'Optimiza campañas publicitarias, analiza audiencias y mejora ROI. Integración con Google Ads y Facebook.',
    longDescription: 'Maximiza el retorno de tus campañas publicitarias con análisis inteligente y optimización automática.',
    author: 'MarketingPro',
    rating: 4.9,
    installs: 15000,
    price: '$49/mes',
    premium: true,
    verified: true,
    tags: ['Google Ads', 'Facebook', 'ROI', 'Analytics', 'Optimization'],
    capabilities: [
      'Optimización de campañas',
      'Análisis de audiencias',
      'A/B testing automático',
      'Reportes de ROI',
      'Predicción de performance'
    ],
    demo: true,
    featured: true,
    color: 'from-purple-500 to-pink-600'
  },
  {
    id: 'email-master',
    name: 'Email Master',
    category: AGENT_CATEGORIES.MARKETING,
    avatar: '📧',
    description: 'Crea campañas de email marketing efectivas con personalización avanzada.',
    author: 'EmailPro',
    rating: 4.4,
    installs: 11000,
    price: '$19/mes',
    premium: true,
    verified: true,
    tags: ['Email', 'Automation', 'Personalization'],
    demo: true,
    featured: false,
    color: 'from-blue-500 to-purple-600'
  },

  // Productividad
  {
    id: 'task-organizer',
    name: 'Task Organizer',
    category: AGENT_CATEGORIES.PRODUCTIVITY,
    avatar: '📋',
    description: 'Organiza tareas, gestiona proyectos y optimiza tu flujo de trabajo.',
    author: 'ProductivityHub',
    rating: 4.5,
    installs: 19000,
    price: 'Gratis',
    premium: false,
    verified: true,
    tags: ['Tasks', 'Projects', 'Workflow', 'Organization'],
    demo: true,
    featured: false,
    color: 'from-emerald-500 to-cyan-600'
  }
];

// Funciones de utilidad
export const getAgentsByCategory = (category) => {
  return MARKETPLACE_AGENTS.filter(agent => agent.category === category);
};

export const getFeaturedAgents = () => {
  return MARKETPLACE_AGENTS.filter(agent => agent.featured);
};

export const searchAgents = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return MARKETPLACE_AGENTS.filter(agent =>
    agent.name.toLowerCase().includes(lowercaseQuery) ||
    agent.description.toLowerCase().includes(lowercaseQuery) ||
    agent.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

export const getAgentById = (id) => {
  return MARKETPLACE_AGENTS.find(agent => agent.id === id);
};

export const getAgentStats = () => {
  return {
    totalAgents: MARKETPLACE_AGENTS.length,
    totalInstalls: MARKETPLACE_AGENTS.reduce((sum, agent) => sum + agent.installs, 0),
    averageRating: MARKETPLACE_AGENTS.reduce((sum, agent) => sum + agent.rating, 0) / MARKETPLACE_AGENTS.length,
    categoryCounts: Object.values(AGENT_CATEGORIES).reduce((counts, category) => {
      counts[category] = getAgentsByCategory(category).length;
      return counts;
    }, {})
  };
};
