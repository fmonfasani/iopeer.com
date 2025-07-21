import React, { useState } from 'react';
import { Filter, X, Star, Shield, Crown, DollarSign } from 'lucide-react';

const SearchFilters = ({ filters, onFiltersChange, onClear }) => {
  const [isOpen, setIsOpen] = useState(false);

  const priceOptions = [
    { value: 'all', label: 'Todos los precios' },
    { value: 'free', label: 'Gratis' },
    { value: 'premium', label: 'Premium' }
  ];

  const ratingOptions = [
    { value: 0, label: 'Todas las valoraciones' },
    { value: 4.5, label: '4.5+ estrellas' },
    { value: 4.0, label: '4.0+ estrellas' },
    { value: 3.5, label: '3.5+ estrellas' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'Todas las categorías' },
    { value: 'development', label: 'Desarrollo' },
    { value: 'data_analysis', label: 'Análisis de Datos' },
    { value: 'content', label: 'Contenido' },
    { value: 'design', label: 'Diseño' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'productivity', label: 'Productividad' }
  ];

  const hasActiveFilters = filters.price !== 'all' || filters.rating > 0 || filters.category !== 'all' || filters.verified || filters.premium;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors ${
          hasActiveFilters 
            ? 'bg-emerald-500 text-white border-emerald-500' 
            : 'bg-slate-800 text-slate-300 border-slate-600 hover:border-slate-500'
        }`}
      >
        <Filter size={16} />
        <span>Filtros</span>
        {hasActiveFilters && (
          <span className="bg-white text-emerald-600 text-xs px-2 py-1 rounded-full font-medium">
            Activos
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-12 right-0 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 w-80 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Filtros</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Precio */}
              <div>
                <label className="block text-sm font-medium text-white mb-3">
                  <DollarSign size={16} className="inline mr-2" />
                  Precio
                </label>
                <div className="space-y-2">
                  {priceOptions.map(option => (
                    <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="price"
                        value={option.value}
                        checked={filters.price === option.value}
                        onChange={(e) => onFiltersChange({ ...filters, price: e.target.value })}
                        className="text-emerald-500 focus:ring-emerald-500"
                      />
                      <span className="text-slate-300 text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-white mb-3">
                  <Star size={16} className="inline mr-2" />
                  Valoración mínima
                </label>
                <div className="space-y-2">
                  {ratingOptions.map(option => (
                    <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        value={option.value}
                        checked={filters.rating === option.value}
                        onChange={(e) => onFiltersChange({ ...filters, rating: parseFloat(e.target.value) })}
                        className="text-emerald-500 focus:ring-emerald-500"
                      />
                      <span className="text-slate-300 text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Categoría */}
              <div>
                <label className="block text-sm font-medium text-white mb-3">Categoría</label>
                <select
                  value={filters.category}
                  onChange={(e) => onFiltersChange({ ...filters, category: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {categoryOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Características */}
              <div>
                <label className="block text-sm font-medium text-white mb-3">Características</label>
                <div className="space-y-3">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.verified}
                      onChange={(e) => onFiltersChange({ ...filters, verified: e.target.checked })}
                      className="text-emerald-500 focus:ring-emerald-500 rounded"
                    />
                    <Shield size={16} className="text-blue-400" />
                    <span className="text-slate-300 text-sm">Solo verificados</span>
                  </label>
                  
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.premium}
                      onChange={(e) => onFiltersChange({ ...filters, premium: e.target.checked })}
                      className="text-emerald-500 focus:ring-emerald-500 rounded"
                    />
                    <Crown size={16} className="text-yellow-400" />
                    <span className="text-slate-300 text-sm">Solo premium</span>
                  </label>
                </div>
              </div>

              {/* Botones */}
              <div className="flex space-x-3 pt-4 border-t border-slate-700">
                <button
                  onClick={() => {
                    onClear();
                    setIsOpen(false);
                  }}
                  className="flex-1 bg-slate-700 text-white py-2 px-4 rounded-lg hover:bg-slate-600 transition-colors"
                >
                  Limpiar
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 bg-emerald-500 text-white py-2 px-4 rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchFilters;
