/**
 * Iopeer Agent Marketplace - Categorías y Agentes
 */

export const AGENT_CATEGORIES = {
  FEATURED: 'featured',
  DEVELOPMENT: 'development',
  PRODUCTIVITY: 'productivity',
  RESEARCH: 'research',
  CREATIVITY: 'creativity',
  BUSINESS: 'business',
  EDUCATION: 'education',
  LIFESTYLE: 'lifestyle',
  DATA_ANALYSIS: 'data-analysis'
};

export const CATEGORY_LABELS = {
  [AGENT_CATEGORIES.FEATURED]: 'Destacados',
  [AGENT_CATEGORIES.DEVELOPMENT]: 'Desarrollo',
  [AGENT_CATEGORIES.PRODUCTIVITY]: 'Productividad',
  [AGENT_CATEGORIES.RESEARCH]: 'Investigación',
  [AGENT_CATEGORIES.CREATIVITY]: 'Creatividad',
  [AGENT_CATEGORIES.BUSINESS]: 'Negocios',
  [AGENT_CATEGORIES.EDUCATION]: 'Educación',
  [AGENT_CATEGORIES.LIFESTYLE]: 'Estilo de Vida',
  [AGENT_CATEGORIES.DATA_ANALYSIS]: 'Análisis de Datos'
};

export const MARKETPLACE_AGENTS = [
  // ==========================================
  // FEATURED AGENTS
  // ==========================================
  {
    id: 'code-assistant-pro',
    name: 'Code Assistant Pro',
    description: 'Asistente de código avanzado con soporte para 20+ lenguajes. Refactoring automático, debugging y generación de tests.',
    category: AGENT_CATEGORIES.FEATURED,
    subcategory: 'ai-powered',
    author: 'Iopeer Team',
    avatar: '👨‍💻',
    color: 'from-blue-500 to-purple-600',
    verified: true,
    premium: true,
    rating: 4.9,
    installs: 15420,
    tags: ['Python', 'JavaScript', 'TypeScript', 'React', 'Node.js'],
    capabilities: [
      'Generación de código',
      'Refactoring automático',
      'Debugging inteligente',
      'Generación de tests'
    ],
    price: 'Premium',
    demo: true
  },
  {
    id: 'data-wizard',
    name: 'Data Wizard',
    description: 'Análisis de datos con IA. Visualizaciones automáticas, insights predictivos y reportes profesionales.',
    category: AGENT_CATEGORIES.FEATURED,
    subcategory: 'analytics',
    author: 'DataCorp',
    avatar: '📊',
    color: 'from-green-500 to-blue-500',
    verified: true,
    premium: true,
    rating: 4.8,
    installs: 12350,
    tags: ['Pandas', 'Matplotlib', 'ML', 'Statistics'],
    capabilities: [
      'Análisis exploratorio',
      'Visualizaciones automáticas',
      'Modelos predictivos',
      'Reportes ejecutivos'
    ],
    price: '$29/mes',
    demo: true
  },
  {
    id: 'content-creator',
    name: 'Content Creator AI',
    description: 'Crea contenido viral para redes sociales, blogs y marketing. Optimizado para engagement y SEO.',
    category: AGENT_CATEGORIES.FEATURED,
    subcategory: 'marketing',
    author: 'CreativeMinds',
    avatar: '✍️',
    color: 'from-pink-500 to-yellow-500',
    verified: true,
    premium: false,
    rating: 4.7,
    installs: 8920,
    tags: ['SEO', 'Social Media', 'Copywriting', 'Marketing'],
    capabilities: [
      'Generación de posts',
      'Optimización SEO',
      'Hashtags inteligentes',
      'A/B testing de contenido'
    ],
    price: 'Gratis',
    demo: true
  },

  // ==========================================
  // DEVELOPMENT AGENTS
  // ==========================================
  {
    id: 'backend-architect',
    name: 'Backend Architect',
    description: 'Diseña arquitecturas backend escalables. APIs REST, microservicios, bases de datos y DevOps.',
    category: AGENT_CATEGORIES.DEVELOPMENT,
    subcategory: 'backend',
    author: 'TechGurus',
    avatar: '🏗️',
    color: 'from-gray-600 to-blue-600',
    verified: true,
    premium: true,
    rating: 4.9,
    installs: 5430,
    tags: ['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'AWS'],
    capabilities: [
      'Diseño de APIs',
      'Arquitectura de microservicios',
      'Optimización de BD',
      'CI/CD pipelines'
    ],
    price: '$49/mes'
  },
  {
    id: 'frontend-master',
    name: 'Frontend Master',
    description: 'Especialista en React, Vue y Angular. Componentes reutilizables, optimización y UX design.',
    category: AGENT_CATEGORIES.DEVELOPMENT,
    subcategory: 'frontend',
    author: 'UIExperts',
    avatar: '🎨',
    color: 'from-purple-500 to-pink-500',
    verified: true,
    premium: false,
    rating: 4.6,
    installs: 7890,
    tags: ['React', 'Vue', 'Angular', 'TypeScript', 'Tailwind'],
    capabilities: [
      'Componentes React',
      'Estados globales',
      'Optimización performance',
      'Responsive design'
    ],
    price: 'Gratis'
  },
  {
    id: 'mobile-dev',
    name: 'Mobile Dev Assistant',
    description: 'Desarrollo mobile nativo y cross-platform. React Native, Flutter, iOS y Android.',
    category: AGENT_CATEGORIES.DEVELOPMENT,
    subcategory: 'mobile',
    author: 'MobileFirst',
    avatar: '📱',
    color: 'from-blue-500 to-green-500',
    verified: false,
    premium: true,
    rating: 4.4,
    installs: 3210,
    tags: ['React Native', 'Flutter', 'Swift', 'Kotlin'],
    capabilities: [
      'Apps nativas',
      'Cross-platform',
      'App Store deployment',
      'Push notifications'
    ],
    price: '$19/mes'
  },

  // ==========================================
  // PRODUCTIVITY AGENTS
  // ==========================================
  {
    id: 'task-master',
    name: 'Task Master Pro',
    description: 'Gestión avanzada de tareas y proyectos. Metodologías ágiles, reporting automático y sincronización.',
    category: AGENT_CATEGORIES.PRODUCTIVITY,
    subcategory: 'project-management',
    author: 'ProductivityHub',
    avatar: '✅',
    color: 'from-green-500 to-blue-500',
    verified: true,
    premium: true,
    rating: 4.8,
    installs: 9870,
    tags: ['Scrum', 'Kanban', 'JIRA', 'Trello', 'Slack'],
    capabilities: [
      'Planificación automática',
      'Seguimiento de progreso',
      'Reportes ejecutivos',
      'Integración con herramientas'
    ],
    price: '$39/mes'
  },
  {
    id: 'email-ninja',
    name: 'Email Ninja',
    description: 'Automatización de emails, templates inteligentes y seguimiento de campañas.',
    category: AGENT_CATEGORIES.PRODUCTIVITY,
    subcategory: 'communication',
    author: 'CommTools',
    avatar: '📧',
    color: 'from-yellow-500 to-red-500',
    verified: true,
    premium: false,
    rating: 4.5,
    installs: 6540,
    tags: ['Gmail', 'Outlook', 'Automation', 'Templates'],
    capabilities: [
      'Templates automáticos',
      'Programación de envíos',
      'Seguimiento de apertura',
      'Respuestas inteligentes'
    ],
    price: 'Gratis'
  },

  // ==========================================
  // RESEARCH AGENTS
  // ==========================================
  {
    id: 'research-scholar',
    name: 'Research Scholar',
    description: 'Investigación académica avanzada. Acceso a papers, citas automáticas y análisis de literatura.',
    category: AGENT_CATEGORIES.RESEARCH,
    subcategory: 'academic',
    author: 'AcademicAI',
    avatar: '🎓',
    color: 'from-indigo-500 to-purple-500',
    verified: true,
    premium: true,
    rating: 4.9,
    installs: 4320,
    tags: ['PubMed', 'arXiv', 'Citations', 'Literature Review'],
    capabilities: [
      'Búsqueda en papers',
      'Análisis de literatura',
      'Citas automáticas',
      'Resúmenes ejecutivos'
    ],
    price: '$59/mes'
  },
  {
    id: 'market-researcher',
    name: 'Market Researcher',
    description: 'Investigación de mercado con IA. Análisis de competencia, tendencias y oportunidades.',
    category: AGENT_CATEGORIES.RESEARCH,
    subcategory: 'market',
    author: 'MarketIntel',
    avatar: '📈',
    color: 'from-blue-500 to-green-500',
    verified: true,
    premium: true,
    rating: 4.7,
    installs: 2890,
    tags: ['Market Analysis', 'Competitor Research', 'Trends'],
    capabilities: [
      'Análisis de competencia',
      'Identificación de tendencias',
      'Segmentación de mercado',
      'Reportes estratégicos'
    ],
    price: '$79/mes'
  },

  // ==========================================
  // CREATIVITY AGENTS
  // ==========================================
  {
    id: 'design-genius',
    name: 'Design Genius',
    description: 'Diseño gráfico con IA. Logos, banners, presentaciones y branding completo.',
    category: AGENT_CATEGORIES.CREATIVITY,
    subcategory: 'design',
    author: 'DesignStudio',
    avatar: '🎨',
    color: 'from-pink-500 to-purple-500',
    verified: true,
    premium: true,
    rating: 4.6,
    installs: 7650,
    tags: ['Photoshop', 'Illustrator', 'Figma', 'Branding'],
    capabilities: [
      'Generación de logos',
      'Diseño de presentaciones',
      'Paletas de colores',
      'Mockups automáticos'
    ],
    price: '$29/mes'
  },
  {
    id: 'story-writer',
    name: 'Story Writer AI',
    description: 'Escritura creativa avanzada. Novelas, cuentos, guiones y desarrollo de personajes.',
    category: AGENT_CATEGORIES.CREATIVITY,
    subcategory: 'writing',
    author: 'StoryForge',
    avatar: '📚',
    color: 'from-orange-500 to-red-500',
    verified: false,
    premium: false,
    rating: 4.3,
    installs: 5210,
    tags: ['Creative Writing', 'Storytelling', 'Characters'],
    capabilities: [
      'Desarrollo de tramas',
      'Creación de personajes',
      'Diálogos naturales',
      'Editing inteligente'
    ],
    price: 'Gratis'
  },

  // ==========================================
  // BUSINESS AGENTS
  // ==========================================
  {
    id: 'business-analyst',
    name: 'Business Analyst Pro',
    description: 'Análisis empresarial completo. KPIs, forecasting, análisis financiero y estrategia.',
    category: AGENT_CATEGORIES.BUSINESS,
    subcategory: 'strategy',
    author: 'BusinessIntel',
    avatar: '💼',
    color: 'from-gray-700 to-blue-600',
    verified: true,
    premium: true,
    rating: 4.8,
    installs: 3450,
    tags: ['KPIs', 'Financial Analysis', 'Forecasting', 'Strategy'],
    capabilities: [
      'Análisis de KPIs',
      'Modelado financiero',
      'Predicciones de ventas',
      'Planes estratégicos'
    ],
    price: '$99/mes'
  },
  {
    id: 'sales-optimizer',
    name: 'Sales Optimizer',
    description: 'Optimización de ventas con IA. Lead scoring, predicción de conversión y automatización.',
    category: AGENT_CATEGORIES.BUSINESS,
    subcategory: 'sales',
    author: 'SalesForce+',
    avatar: '💰',
    color: 'from-green-500 to-yellow-500',
    verified: true,
    premium: true,
    rating: 4.7,
    installs: 6780,
    tags: ['CRM', 'Lead Generation', 'Sales Automation'],
    capabilities: [
      'Lead scoring',
      'Predicción de ventas',
      'Follow-up automático',
      'Pipeline optimization'
    ],
    price: '$69/mes'
  }
];

export const SUBCATEGORIES = {
  [AGENT_CATEGORIES.DEVELOPMENT]: [
    { id: 'backend', label: 'Backend', count: 8 },
    { id: 'frontend', label: 'Frontend', count: 12 },
    { id: 'mobile', label: 'Mobile', count: 6 },
    { id: 'devops', label: 'DevOps', count: 5 },
    { id: 'ai-ml', label: 'AI/ML', count: 9 }
  ],
  [AGENT_CATEGORIES.PRODUCTIVITY]: [
    { id: 'project-management', label: 'Project Management', count: 7 },
    { id: 'communication', label: 'Comunicación', count: 5 },
    { id: 'automation', label: 'Automatización', count: 11 },
    { id: 'time-management', label: 'Gestión del Tiempo', count: 4 }
  ],
  [AGENT_CATEGORIES.RESEARCH]: [
    { id: 'academic', label: 'Académica', count: 6 },
    { id: 'market', label: 'Mercado', count: 8 },
    { id: 'competitive', label: 'Competitiva', count: 4 },
    { id: 'trend-analysis', label: 'Análisis de Tendencias', count: 3 }
  ],
  [AGENT_CATEGORIES.CREATIVITY]: [
    { id: 'design', label: 'Diseño', count: 9 },
    { id: 'writing', label: 'Escritura', count: 7 },
    { id: 'music', label: 'Música', count: 4 },
    { id: 'video', label: 'Video', count: 5 }
  ],
  [AGENT_CATEGORIES.BUSINESS]: [
    { id: 'strategy', label: 'Estrategia', count: 6 },
    { id: 'sales', label: 'Ventas', count: 8 },
    { id: 'marketing', label: 'Marketing', count: 10 },
    { id: 'finance', label: 'Finanzas', count: 5 }
  ]
};

// Helper functions
export const getAgentsByCategory = (category) => {
  return MARKETPLACE_AGENTS.filter(agent => agent.category === category);
};

export const getAgentsBySubcategory = (category, subcategory) => {
  return MARKETPLACE_AGENTS.filter(agent => 
    agent.category === category && agent.subcategory === subcategory
  );
};

export const getFeaturedAgents = () => {
  return MARKETPLACE_AGENTS.filter(agent => 
    agent.category === AGENT_CATEGORIES.FEATURED
  );
};

export const searchAgents = (query) => {
  const normalizedQuery = query.toLowerCase();
  return MARKETPLACE_AGENTS.filter(agent =>
    agent.name.toLowerCase().includes(normalizedQuery) ||
    agent.description.toLowerCase().includes(normalizedQuery) ||
    agent.tags.some(tag => tag.toLowerCase().includes(normalizedQuery)) ||
    agent.capabilities.some(cap => cap.toLowerCase().includes(normalizedQuery))
  );
};
