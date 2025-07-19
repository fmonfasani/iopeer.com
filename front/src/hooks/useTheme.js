import { useState, useEffect, useCallback } from 'react';

const THEMES = {
  LIGHT_CLASSIC: 'light-classic',
  LIGHT_COLORFUL: 'light-colorful', 
  DARK_DEFAULT: 'dark-default',
  DARK_COLORFUL: 'dark-colorful'
};

const THEME_NAMES = {
  [THEMES.LIGHT_CLASSIC]: 'Light Clásico',
  [THEMES.LIGHT_COLORFUL]: 'Light Colorido',
  [THEMES.DARK_DEFAULT]: 'Dark Elegante', 
  [THEMES.DARK_COLORFUL]: 'Dark Colorido'
};

export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    // Cargar tema desde localStorage o usar light-classic por defecto
    return localStorage.getItem('iopeer-theme') || THEMES.LIGHT_CLASSIC;
  });

  const changeTheme = useCallback((newTheme) => {
    setCurrentTheme(newTheme);
    localStorage.setItem('iopeer-theme', newTheme);
    
    // Aplicar clase al body
    document.body.className = `theme-${newTheme}`;
    
    // Dispatch evento personalizado para analytics
    window.dispatchEvent(new CustomEvent('themeChanged', { 
      detail: { theme: newTheme } 
    }));
  }, []);

  const getThemeConfig = useCallback((theme = currentTheme) => {
    const configs = {
      [THEMES.LIGHT_CLASSIC]: {
        name: THEME_NAMES[THEMES.LIGHT_CLASSIC],
        isDark: false,
        colors: {
          background: '#ffffff',
          surface: '#f8fafc',
          primary: '#3b82f6',
          secondary: '#64748b',
          accent: '#06b6d4',
          text: '#1e293b',
          textSecondary: '#64748b',
          border: '#e2e8f0',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444'
        }
      },
      [THEMES.LIGHT_COLORFUL]: {
        name: THEME_NAMES[THEMES.LIGHT_COLORFUL],
        isDark: false,
        colors: {
          background: '#fefcbf',
          surface: '#fef3c7',
          primary: '#8b5cf6',
          secondary: '#ec4899',
          accent: '#06b6d4',
          text: '#1e293b',
          textSecondary: '#7c2d12',
          border: '#f59e0b',
          success: '#84cc16',
          warning: '#f97316',
          error: '#ef4444'
        }
      },
      [THEMES.DARK_DEFAULT]: {
        name: THEME_NAMES[THEMES.DARK_DEFAULT],
        isDark: true,
        colors: {
          background: '#0f172a',
          surface: '#1e293b',
          primary: '#3b82f6',
          secondary: '#64748b',
          accent: '#06b6d4',
          text: '#f1f5f9',
          textSecondary: '#94a3b8',
          border: '#334155',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444'
        }
      },
      [THEMES.DARK_COLORFUL]: {
        name: THEME_NAMES[THEMES.DARK_COLORFUL],
        isDark: true,
        colors: {
          background: '#1a1a2e',
          surface: '#16213e',
          primary: '#e94560',
          secondary: '#f39c12',
          accent: '#0f3460',
          text: '#eee',
          textSecondary: '#f39c12',
          border: '#e94560',
          success: '#27ae60',
          warning: '#f39c12',
          error: '#e74c3c'
        }
      }
    };
    
    return configs[theme] || configs[THEMES.LIGHT_CLASSIC];
  }, [currentTheme]);

  // Aplicar tema al cargar
  useEffect(() => {
    document.body.className = `theme-${currentTheme}`;
  }, [currentTheme]);

  return {
    currentTheme,
    changeTheme,
    getThemeConfig,
    themes: THEMES,
    themeNames: THEME_NAMES,
    availableThemes: Object.values(THEMES),
    isDarkTheme: getThemeConfig().isDark
  };
};

export { THEMES };
