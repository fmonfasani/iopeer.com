import React, { useState } from 'react';
import { Palette, Check } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const ThemeSelector = ({ className = '' }) => {
  const { currentTheme, changeTheme, themeNames, availableThemes, getThemeConfig } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const getThemePreview = (theme) => {
    const config = getThemeConfig(theme);
    return (
      <div className="theme-preview">
        <div className="theme-preview-header" style={{backgroundColor: config.colors.surface}}>
          <div className="theme-preview-dots">
            <span style={{backgroundColor: '#ef4444'}}></span>
            <span style={{backgroundColor: '#f59e0b'}}></span>
            <span style={{backgroundColor: '#10b981'}}></span>
          </div>
        </div>
        <div className="theme-preview-body" style={{backgroundColor: config.colors.background}}>
          <div className="theme-preview-element" style={{backgroundColor: config.colors.primary}}></div>
          <div className="theme-preview-element secondary" style={{backgroundColor: config.colors.secondary}}></div>
        </div>
      </div>
    );
  };

  return (
    <div className={`theme-selector ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="theme-selector-trigger"
        title="Cambiar tema"
      >
        <Palette size={20} />
        <span className="theme-selector-label">
          {themeNames[currentTheme]}
        </span>
      </button>

      {isOpen && (
        <>
          <div className="theme-selector-overlay" onClick={() => setIsOpen(false)} />
          <div className="theme-selector-dropdown">
            <div className="theme-selector-header">
              <h3>Seleccionar Tema</h3>
              <p>Elige el estilo visual que prefieras</p>
            </div>

            <div className="theme-options-grid">
              {availableThemes.map(theme => (
                <button
                  key={theme}
                  onClick={() => {
                    changeTheme(theme);
                    setIsOpen(false);
                  }}
                  className={`theme-option ${currentTheme === theme ? 'active' : ''}`}
                >
                  {getThemePreview(theme)}
                  <div className="theme-option-info">
                    <span className="theme-option-name">{themeNames[theme]}</span>
                    {currentTheme === theme && (
                      <Check size={16} className="theme-option-check" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSelector;
