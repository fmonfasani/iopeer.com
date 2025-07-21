// Categorías de agentes
export const AGENT_CATEGORIES = {
  FEATURED: 'featured',
  DEVELOPMENT: 'development', 
  PRODUCTIVITY: 'productivity',
  RESEARCH: 'research',
  CREATIVITY: 'creativity',
  BUSINESS: 'business',
  EDUCATION: 'education',
  LIFESTYLE: 'lifestyle'
};

export const CATEGORY_LABELS = {
  [AGENT_CATEGORIES.FEATURED]: 'Agentes Destacados',
  [AGENT_CATEGORIES.DEVELOPMENT]: 'Desarrollo de Software',
  [AGENT_CATEGORIES.PRODUCTIVITY]: 'Productividad y Eficiencia',
  [AGENT_CATEGORIES.RESEARCH]: 'Investigación y Análisis',
  [AGENT_CATEGORIES.CREATIVITY]: 'Creatividad y Diseño',
  [AGENT_CATEGORIES.BUSINESS]: 'Negocios y Finanzas',
  [AGENT_CATEGORIES.EDUCATION]: 'Educación y Aprendizaje',
  [AGENT_CATEGORIES.LIFESTYLE]: 'Estilo de Vida'
};

// Datos de ejemplo de agentes para el marketplace
export const MARKETPLACE_AGENTS = [
  // Agentes de Desarrollo
  {
    id: 'code-assistant-pro',
    name: 'Code Assistant Pro',
    description: 'Asistente de programación avanzado que ayuda con código Python, JavaScript, React y más.',
    avatar: '👨‍💻',
    category: AGENT_CATEGORIES.DEVELOPMENT,
    author: 'DevTools Inc.',
    rating: 4.9,
    installs: 25000,
    price: 'Gratis',
    premium: false,
    verified: true,
    tags: ['Python', 'JavaScript', 'React', 'Debugging'],
    color: 'from-blue-400 to-purple-600',
    demo: true,
    capabilities: {
      description: 'Genera código, encuentra bugs, explica algoritmos y optimiza rendimiento'
    }
  },
  {
    id: 'api-builder',
    name: 'API Builder',
    description: 'Construye APIs REST y GraphQL automáticamente con documentación completa.',
    avatar: '🔌',
    category: AGENT_CATEGORIES.DEVELOPMENT,
    author: 'API Studios',
    rating: 4.7,
    installs: 18500,
    price: 'Premium',
    premium: true,
    verified: true,
    tags: ['API', 'REST', 'GraphQL', 'Swagger'],
    color: 'from-green-400 to-blue-500',
    demo: true
  },
  {
    id: 'database-wizard',
    name: 'Database Wizard',
    description: 'Optimiza consultas SQL, diseña esquemas y gestiona migraciones de base de datos.',
    avatar: '🗄️',
    category: AGENT_CATEGORIES.DEVELOPMENT,
    author: 'DataOps Co.',
    rating: 4.8,
    installs: 12000,
    price: 'Gratis',
    premium: false,
    verified: true,
    tags: ['SQL', 'PostgreSQL', 'MySQL', 'MongoDB'],
    color: 'from-gray-400 to-gray-600',
    demo: false
  },

  // Agentes de Productividad
  {
    id: 'email-composer',
    name: 'Email Composer',
    description: 'Redacta emails profesionales con el tono perfecto para cada situación.',
    avatar: '📧',
    category: AGENT_CATEGORIES.PRODUCTIVITY,
    author: 'Productivity Pro',
    rating: 4.6,
    installs: 42000,
    price: 'Gratis',
    premium: false,
    verified: true,
    tags: ['Email', 'Comunicación', 'Redacción'],
    color: 'from-yellow-400 to-red-500',
    demo: true
  },
  {
    id: 'meeting-summarizer',
    name: 'Meeting Summarizer',
    description: 'Convierte transcripciones de reuniones en resúmenes accionables con tareas asignadas.',
    avatar: '📋',
    category: AGENT_CATEGORIES.PRODUCTIVITY,
    author: 'MeetingBot LLC',
    rating: 4.8,
    installs: 31000,
    price: 'Premium',
    premium: true,
    verified: true,
    tags: ['Reuniones', 'Transcripción', 'Resúmenes'],
    color: 'from-purple-400 to-pink-500',
    demo: true
  },
  {
    id: 'task-planner',
    name: 'Smart Task Planner',
    description: 'Organiza tu día optimizando tiempo y prioridades usando IA.',
    avatar: '✅',
    category: AGENT_CATEGORIES.PRODUCTIVITY,
    author: 'TimeWise',
    rating: 4.5,
    installs: 28000,
    price: 'Gratis',
    premium: false,
    verified: false,
    tags: ['Planificación', 'GTD', 'Productividad'],
    color: 'from-green-400 to-cyan-500',
    demo: false
  },

  // Agentes de Investigación
  {
    id: 'research-analyst',
    name: 'Research Analyst',
    description: 'Analiza papers académicos, extrae insights y genera reportes de investigación.',
    avatar: '🔬',
    category: AGENT_CATEGORIES.RESEARCH,
    author: 'AcademicAI',
    rating: 4.9,
    installs: 15000,
    price: 'Premium',
    premium: true,
    verified: true,
    tags: ['Investigación', 'Papers', 'Análisis', 'Academia'],
    color: 'from-indigo-400 to-purple-600',
    demo: true
  },
  {
    id: 'data-explorer',
    name: 'Data Explorer',
    description: 'Explora datasets, encuentra patrones y genera visualizaciones automáticamente.',
    avatar: '📊',
    category: AGENT_CATEGORIES.RESEARCH,
    author: 'DataViz Pro',
    rating: 4.7,
    installs: 22000,
    price: 'Gratis',
    premium: false,
    verified: true,
    tags: ['Datos', 'Visualización', 'Estadísticas'],
    color: 'from-blue-400 to-indigo-600',
    demo: true
  },

  // Agentes de Creatividad
  {
    id: 'content-creator',
    name: 'Content Creator',
    description: 'Genera contenido para blogs, redes sociales y marketing con tu voz única.',
    avatar: '✍️',
    category: AGENT_CATEGORIES.CREATIVITY,
    author: 'Creative Studio',
    rating: 4.6,
    installs: 38000,
    price: 'Gratis',
    premium: false,
    verified: true,
    tags: ['Contenido', 'Blog', 'Social Media', 'Marketing'],
    color: 'from-pink-400 to-red-500',
    demo: true
  },
  {
    id: 'design-assistant',
    name: 'Design Assistant',
    description: 'Ayuda con paletas de colores, tipografías y layouts para tus diseños.',
    avatar: '🎨',
    category: AGENT_CATEGORIES.CREATIVITY,
    author: 'DesignBot Inc.',
    rating: 4.8,
    installs: 19000,
    price: 'Premium',
    premium: true,
    verified: true,
    tags: ['Diseño', 'UI/UX', 'Colores', 'Tipografía'],
    color: 'from-purple-400 to-pink-600',
    demo: true
  },

  // Agentes de Negocios
  {
    id: 'business-analyzer',
    name: 'Business Analyzer',
    description: 'Analiza métricas de negocio y proporciona insights estratégicos.',
    avatar: '💼',
    category: AGENT_CATEGORIES.BUSINESS,
    author: 'BizIntel Corp',
    rating: 4.7,
    installs: 16000,
    price: 'Premium',
    premium: true,
    verified: true,
    tags: ['Negocios', 'Métricas', 'KPIs', 'Estrategia'],
    color: 'from-gray-600 to-gray-800',
    demo: false
  },
  {
    id: 'finance-advisor',
    name: 'Finance Advisor',
    description: 'Asistente financiero para presupuestos, inversiones y planificación.',
    avatar: '💰',
    category: AGENT_CATEGORIES.BUSINESS,
    author: 'FinTech Solutions',
    rating: 4.9,
    installs: 21000,
    price: 'Premium',
    premium: true,
    verified: true,
    tags: ['Finanzas', 'Inversiones', 'Presupuestos'],
    color: 'from-green-500 to-green-700',
    demo: true
  },

  // Agentes de Educación
  {
    id: 'tutor-personal',
    name: 'Tutor Personal',
    description: 'Tutor personalizado que se adapta a tu estilo de aprendizaje.',
    avatar: '🎓',
    category: AGENT_CATEGORIES.EDUCATION,
    author: 'EduTech Plus',
    rating: 4.8,
    installs: 33000,
    price: 'Gratis',
    premium: false,
    verified: true,
    tags: ['Educación', 'Tutoría', 'Aprendizaje'],
    color: 'from-blue-500 to-indigo-600',
    demo: true
  },
  {
    id: 'language-coach',
    name: 'Language Coach',
    description: 'Practica conversación y mejora tu pronunciación en múltiples idiomas.',
    avatar: '🗣️',
    category: AGENT_CATEGORIES.EDUCATION,
    author: 'LinguaBot',
    rating: 4.6,
    installs: 27000,
    price: 'Premium',
    premium: true,
    verified: true,
    tags: ['Idiomas', 'Conversación', 'Pronunciación'],
    color: 'from-orange-400 to-red-500',
    demo: true
  },

  // Agentes de Estilo de Vida
  {
    id: 'fitness-trainer',
    name: 'Fitness Trainer',
    description: 'Planes de ejercicio personalizados y seguimiento de progreso.',
    avatar: '💪',
    category: AGENT_CATEGORIES.LIFESTYLE,
    author: 'FitLife AI',
    rating: 4.5,
    installs: 24000,
    price: 'Gratis',
    premium: false,
    verified: false,
    tags: ['Fitness', 'Ejercicio', 'Salud'],
    color: 'from-red-400 to-pink-500',
    demo: false
  },
  {
    id: 'recipe-master',
    name: 'Recipe Master',
    description: 'Genera recetas personalizadas basadas en tus ingredientes y preferencias.',
    avatar: '👨‍🍳',
    category: AGENT_CATEGORIES.LIFESTYLE,
    author: 'CookBot Pro',
    rating: 4.7,
    installs: 35000,
    price: 'Gratis',
    premium: false,
    verified: true,
    tags: ['Cocina', 'Recetas', 'Alimentación'],
    color: 'from-orange-400 to-yellow-500',
    demo: true
  }
];

// Funciones de utilidad
export const getAgentsByCategory = (category) => {
  if (category === AGENT_CATEGORIES.FEATURED) {
    return getFeaturedAgents();
  }
  return MARKETPLACE_AGENTS.filter(agent => agent.category === category);
};

export const getFeaturedAgents = () => {
  // Agentes destacados: los mejor valorados y más instalados
  return MARKETPLACE_AGENTS
    .filter(agent => agent.rating >= 4.7 || agent.installs >= 25000)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 8);
};

export const searchAgents = (query) => {
  const searchTerm = query.toLowerCase();
  return MARKETPLACE_AGENTS.filter(agent => 
    agent.name.toLowerCase().includes(searchTerm) ||
    agent.description.toLowerCase().includes(searchTerm) ||
    agent.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
    agent.author.toLowerCase().includes(searchTerm)
  );
};

export const getAgentById = (id) => {
  return MARKETPLACE_AGENTS.find(agent => agent.id === id);
};
