// front/src/components/miapp/index.js
// Archivo de exportación principal para componentes de MI APP

// Componentes principales
export { default as ProjectTemplateCard } from './ProjectTemplateCard';
export { ProjectCard } from './ProjectCard';
export { ProjectStatusBadge } from './ProjectStatusBadge';
export { QuickActionCard } from './QuickActionCard';

// También exportar como objeto para imports destructurados
export default {
  ProjectTemplateCard: require('./ProjectTemplateCard').default,
  ProjectCard: require('./ProjectCard').ProjectCard,
  ProjectStatusBadge: require('./ProjectStatusBadge').ProjectStatusBadge,
  QuickActionCard: require('./QuickActionCard').QuickActionCard,
};

// Tipos/constantes útiles para MI APP
export const PROJECT_STATUSES = {
  DRAFT: 'draft',
  BUILDING: 'building',
  READY: 'ready',
  DEPLOYING: 'deploying',
  DEPLOYED: 'deployed',
  FAILED: 'failed'
};

export const PROJECT_STATUS_LABELS = {
  [PROJECT_STATUSES.DRAFT]: 'Borrador',
  [PROJECT_STATUSES.BUILDING]: 'Construyendo',
  [PROJECT_STATUSES.READY]: 'Listo',
  [PROJECT_STATUSES.DEPLOYING]: 'Desplegando',
  [PROJECT_STATUSES.DEPLOYED]: 'Desplegado',
  [PROJECT_STATUSES.FAILED]: 'Error'
};

export const TEMPLATE_CATEGORIES = {
  BUSINESS: 'business',
  CONTENT: 'content',
  MOBILE: 'mobile',
  ECOMMERCE: 'ecommerce'
};

export const AGENT_TYPES = {
  UI_GENERATOR: 'UI Generator',
  BACKEND_AGENT: 'Backend Agent',
  CONTENT_AGENT: 'Content Agent',
  SEO_AGENT: 'SEO Agent',
  PAYMENT_AGENT: 'Payment Agent',
  MOBILE_UI_AGENT: 'Mobile UI Agent',
  AUTH_AGENT: 'Auth Agent',
  ANALYTICS: 'Analytics',
  PUSH_NOTIFICATIONS: 'Push Notifications'
};

// Utilidades para componentes
export const getStatusColor = (status) => {
  const colors = {
    [PROJECT_STATUSES.DEPLOYED]: 'green',
    [PROJECT_STATUSES.BUILDING]: 'yellow',
    [PROJECT_STATUSES.READY]: 'blue',
    [PROJECT_STATUSES.DEPLOYING]: 'purple',
    [PROJECT_STATUSES.FAILED]: 'red',
    [PROJECT_STATUSES.DRAFT]: 'gray'
  };
  return colors[status] || 'gray';
};

export const getComplexityColor = (complexity) => {
  const colors = {
    'Fácil': 'green',
    'Intermedio': 'yellow',
    'Avanzado': 'red'
  };
  return colors[complexity] || 'gray';
};

export const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

  if (diffInHours < 1) return 'Hace unos minutos';
  if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;

  return date.toLocaleDateString();
};
