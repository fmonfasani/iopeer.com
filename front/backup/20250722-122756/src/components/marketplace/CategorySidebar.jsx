import React from 'react';
import { 
  Star, Code, Briefcase, Search, Palette, 
  TrendingUp, GraduationCap, Coffee, BarChart3 
} from 'lucide-react';
import { 
  AGENT_CATEGORIES, 
  CATEGORY_LABELS, 
  SUBCATEGORIES,
  getAgentsByCategory 
} from '../../data/agentCategories';

const CategorySidebar = ({ selectedCategory, selectedSubcategory, onCategoryChange }) => {
  const categoryIcons = {
    [AGENT_CATEGORIES.FEATURED]: Star,
    [AGENT_CATEGORIES.DEVELOPMENT]: Code,
    [AGENT_CATEGORIES.PRODUCTIVITY]: Briefcase,
    [AGENT_CATEGORIES.RESEARCH]: Search,
    [AGENT_CATEGORIES.CREATIVITY]: Palette,
    [AGENT_CATEGORIES.BUSINESS]: TrendingUp,
    [AGENT_CATEGORIES.EDUCATION]: GraduationCap,
    [AGENT_CATEGORIES.LIFESTYLE]: Coffee,
    [AGENT_CATEGORIES.DATA_ANALYSIS]: BarChart3
  };

  return (
    <div className="w-64 border-r min-h-screen p-6" style={{
      backgroundColor: 'var(--bg-primary)',
      borderColor: 'var(--border-color)'
    }}>
      <div className="space-y-1">
        {Object.values(AGENT_CATEGORIES).map(category => {
          const Icon = categoryIcons[category];
          const isSelected = selectedCategory === category;
          const agentCount = getAgentsByCategory(category).length;

          return (
            <div key={category}>
              <button
                onClick={() => onCategoryChange(category)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all ${
                  isSelected ? 'font-semibold' : 'hover:bg-gray-50'
                }`}
                style={{
                  backgroundColor: isSelected ? 'var(--accent-primary)' : 'transparent',
                  color: isSelected ? 'white' : 'var(--text-primary)'
                }}
              >
                <div className="flex items-center space-x-3">
                  <Icon size={18} />
                  <span>{CATEGORY_LABELS[category]}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  isSelected ? 'bg-white bg-opacity-20' : 'bg-gray-100'
                }`} style={{
                  backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : 'var(--bg-tertiary)',
                  color: isSelected ? 'white' : 'var(--text-secondary)'
                }}>
                  {agentCount}
                </span>
              </button>

              {/* Subcategories */}
              {isSelected && SUBCATEGORIES[category] && (
                <div className="mt-2 ml-6 space-y-1">
                  {SUBCATEGORIES[category].map(subcategory => (
                    <button
                      key={subcategory.id}
                      onClick={() => onCategoryChange(category, subcategory.id)}
                      className={`w-full flex items-center justify-between px-3 py-1 rounded text-sm text-left transition-colors ${
                        selectedSubcategory === subcategory.id 
                          ? 'font-medium' 
                          : 'hover:bg-gray-50'
                      }`}
                      style={{
                        backgroundColor: selectedSubcategory === subcategory.id ? 'var(--bg-tertiary)' : 'transparent',
                        color: selectedSubcategory === subcategory.id ? 'var(--accent-primary)' : 'var(--text-secondary)'
                      }}
                    >
                      <span>{subcategory.label}</span>
                      <span className="text-xs" style={{color: 'var(--text-tertiary)'}}>
                        {subcategory.count}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Marketplace Stats */}
      <div className="mt-8 p-4 rounded-lg" style={{backgroundColor: 'var(--bg-secondary)'}}>
        <h3 className="font-semibold mb-3" style={{color: 'var(--text-primary)'}}>
          📊 Estadísticas
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span style={{color: 'var(--text-secondary)'}}>Total Agentes:</span>
            <span className="font-medium" style={{color: 'var(--text-primary)'}}>24</span>
          </div>
          <div className="flex justify-between">
            <span style={{color: 'var(--text-secondary)'}}>Verificados:</span>
            <span className="font-medium" style={{color: 'var(--text-primary)'}}>18</span>
          </div>
          <div className="flex justify-between">
            <span style={{color: 'var(--text-secondary)'}}>Gratuitos:</span>
            <span className="font-medium" style={{color: 'var(--text-primary)'}}>8</span>
          </div>
          <div className="flex justify-between">
            <span style={{color: 'var(--text-secondary)'}}>Premium:</span>
            <span className="font-medium" style={{color: 'var(--text-primary)'}}>16</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6">
        <button className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all">
          ➕ Publicar Agente
        </button>
        <button className="w-full mt-2 border border-gray-300 py-2 px-4 rounded-lg text-sm hover:bg-gray-50 transition-colors" style={{
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)'
        }}>
          📚 Guía de Desarrollo
        </button>
      </div>
    </div>
  );
};

export default CategorySidebar;
