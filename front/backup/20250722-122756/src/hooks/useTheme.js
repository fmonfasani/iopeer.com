import { useState, useEffect, useCallback } from 'react';

const THEMES = {
  LIGHT_PROFESSIONAL: 'light-professional',
  LIGHT_OCEANIC: 'light-oceanic', 
  DARK_CORPORATE: 'dark-corporate',
  DARK_CYBERPUNK: 'dark-cyberpunk'
};

const THEME_NAMES = {
  [THEMES.LIGHT_PROFESSIONAL]: 'Light Profesional',
  [THEMES.LIGHT_OCEANIC]: 'Light Oceánico',
  [THEMES.DARK_CORPORATE]: 'Dark Corporativo', 
  [THEMES.DARK_CYBERPUNK]: 'Dark Cyberpunk'
};

export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('iopeer-theme') || THEMES.LIGHT_PROFESSIONAL;
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
      [THEMES.LIGHT_PROFESSIONAL]: {
        name: THEME_NAMES[THEMES.LIGHT_PROFESSIONAL],
        isDark: false,
        colors: {
          background: '#f8fafc',
          surface: '#ffffff',
          primary: '#2563eb',
          secondary: '#64748b',
          accent: '#0ea5e9',
          text: '#1e293b',
          textSecondary: '#475569',
          textTertiary: '#64748b',
          border: '#e2e8f0',
          success: '#059669',
          warning: '#d97706',
          error: '#dc2626',
          shadow: 'rgba(0, 0, 0, 0.1)',
          gradient: 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)'
        }
      },
      [THEMES.LIGHT_OCEANIC]: {
        name: THEME_NAMES[THEMES.LIGHT_OCEANIC],
        isDark: false,
        colors: {
          background: '#f0f9ff',
          surface: '#ffffff',
          primary: '#0284c7',
          secondary: '#0ea5e9',
          accent: '#06b6d4',
          text: '#0c4a6e',
          textSecondary: '#0369a1',
          textTertiary: '#0284c7',
          border: '#7dd3fc',
          success: '#0d9488',
          warning: '#ea580c',
          error: '#dc2626',
          shadow: 'rgba(2, 132, 199, 0.15)',
          gradient: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)'
        }
      },
      [THEMES.DARK_CORPORATE]: {
        name: THEME_NAMES[THEMES.DARK_CORPORATE],
        isDark: true,
        colors: {
          background: '#0f172a',
          surface: '#1e293b',
          primary: '#3b82f6',
          secondary: '#64748b',
          accent: '#06b6d4',
          text: '#f1f5f9',
          textSecondary: '#cbd5e1',
          textTertiary: '#94a3b8',
          border: '#334155',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          shadow: 'rgba(0, 0, 0, 0.25)',
          gradient: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
        }
      },
      [THEMES.DARK_CYBERPUNK]: {
        name: THEME_NAMES[THEMES.DARK_CYBERPUNK],
        isDark: true,
        colors: {
          background: '#0a0a0f',
          surface: '#1a1a2e',
          primary: '#00d4ff',
          secondary: '#ff6b6b',
          accent: '#4ecdc4',
          text: '#f0f8ff',
          textSecondary: '#b8c6db',
          textTertiary: '#8b94a3',
          border: '#2c2c54',
          success: '#26de81',
          warning: '#feca57',
          error: '#ff3838',
          shadow: 'rgba(0, 212, 255, 0.2)',
          gradient: 'linear-gradient(135deg, #00d4ff 0%, #4ecdc4 100%)'
        }
      }
    };
    
    return configs[theme] || configs[THEMES.LIGHT_PROFESSIONAL];
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
