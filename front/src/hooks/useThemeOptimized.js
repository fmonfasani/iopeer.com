import { useState, useEffect, useCallback } from 'react';

const THEMES = {
  LIGHT_CLASSIC: 'light-classic',
  LIGHT_COLORFUL: 'light-colorful', 
  DARK_DEFAULT: 'dark-default',
  DARK_COLORFUL: 'dark-colorful'
};

const THEME_CONFIGS = {
  [THEMES.LIGHT_CLASSIC]: { name: 'Light Clásico', isDark: false, colors: { background: '#ffffff', surface: '#f8fafc', primary: '#3b82f6', text: '#1e293b' }},
  [THEMES.LIGHT_COLORFUL]: { name: 'Light Colorido', isDark: false, colors: { background: '#fefcbf', surface: '#fef3c7', primary: '#8b5cf6', text: '#1e293b' }},
  [THEMES.DARK_DEFAULT]: { name: 'Dark Elegante', isDark: true, colors: { background: '#0f172a', surface: '#1e293b', primary: '#3b82f6', text: '#f1f5f9' }},
  [THEMES.DARK_COLORFUL]: { name: 'Dark Colorido', isDark: true, colors: { background: '#1a1a2e', surface: '#16213e', primary: '#e94560', text: '#eee' }}
};

export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState(() => 
    localStorage.getItem('iopeer-theme') || THEMES.LIGHT_CLASSIC
  );

  const changeTheme = useCallback((newTheme) => {
    setCurrentTheme(newTheme);
    localStorage.setItem('iopeer-theme', newTheme);
    document.body.className = `theme-${newTheme}`;
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: newTheme } }));
  }, []);

  const getThemeConfig = useCallback((theme = currentTheme) => 
    THEME_CONFIGS[theme] || THEME_CONFIGS[THEMES.LIGHT_CLASSIC]
  , [currentTheme]);

  useEffect(() => {
    document.body.className = `theme-${currentTheme}`;
  }, [currentTheme]);

  return {
    currentTheme, changeTheme, getThemeConfig, themes: THEMES,
    themeNames: Object.fromEntries(Object.entries(THEME_CONFIGS).map(([k,v]) => [k, v.name])),
    availableThemes: Object.values(THEMES),
    isDarkTheme: getThemeConfig().isDark
  };
};

export { THEMES };
