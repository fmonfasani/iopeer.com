// Helper functions escalables
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

export const formatNumber = (num) => {
  if (num >= 1000) {
    return `${Math.floor(num / 1000)}k`;
  }
  return num.toString();
};

export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
