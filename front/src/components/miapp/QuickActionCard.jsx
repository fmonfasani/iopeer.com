// front/src/components/miapp/QuickActionCard.jsx
export const QuickActionCard = ({
    icon: Icon,
    title,
    description,
    action,
    color = "blue",
    onClick,
    disabled = false
  }) => (
    <div
      className={`bg-white border border-gray-200 rounded-lg p-6 transition-all cursor-pointer ${
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : `hover:shadow-md hover:border-${color}-300`
      }`}
      onClick={() => !disabled && onClick && onClick()}
    >
      <div className={`w-12 h-12 bg-${color}-100 rounded-lg flex items-center justify-center mb-4`}>
        <Icon className={`w-6 h-6 text-${color}-600`} />
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      <button
        className={`text-${color}-600 hover:text-${color}-800 font-medium text-sm ${
          disabled ? 'cursor-not-allowed opacity-50' : ''
        }`}
        disabled={disabled}
      >
        {action} →
      </button>
    </div>
  );
