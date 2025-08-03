
// front/src/components/miapp/ProjectStatusBadge.jsx
export const ProjectStatusBadge = ({ status, size = 'md' }) => {
    const statusConfig = {
      'deployed': {
        color: 'bg-green-100 text-green-800',
        text: 'Desplegado',
        icon: '🚀'
      },
      'building': {
        color: 'bg-yellow-100 text-yellow-800',
        text: 'Construyendo',
        icon: '⚙️'
      },
      'ready': {
        color: 'bg-blue-100 text-blue-800',
        text: 'Listo',
        icon: '✅'
      },
      'failed': {
        color: 'bg-red-100 text-red-800',
        text: 'Error',
        icon: '❌'
      },
      'draft': {
        color: 'bg-gray-100 text-gray-800',
        text: 'Borrador',
        icon: '📝'
      },
      'deploying': {
        color: 'bg-purple-100 text-purple-800',
        text: 'Desplegando',
        icon: '🚀'
      }
    };

    const config = statusConfig[status] || statusConfig['draft'];
    const sizeClass = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-sm';

    return (
      <span className={`inline-flex items-center ${sizeClass} rounded-full font-medium ${config.color}`}>
        <span className="mr-1">{config.icon}</span>
        {config.text}
      </span>
    );
  };
