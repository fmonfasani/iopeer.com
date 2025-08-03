// ============================================
// src/components/features/UIGenerator/UIGenerator.jsx
// Interfaz principal para el generador de componentes UI
// ============================================

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Code, Copy, Download, Eye, Settings, Palette, 
  Layers, Zap, CheckCircle, AlertCircle, Loader
} from 'lucide-react';
import { useIopeer } from '../../../hooks/useIopeer';

const UIGenerator = () => {
  const { sendMessage } = useIopeer();
  const [selectedComponent, setSelectedComponent] = useState('button');
  const [componentProps, setComponentProps] = useState({});
  const [style, setStyle] = useState('modern');
  const [size, setSize] = useState('medium');
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [supportedComponents, setSupportedComponents] = useState([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [error, setError] = useState(null);

  // Configuraciones por defecto para cada tipo de componente - ARREGLADO con useMemo
  const defaultProps = useMemo(() => ({
    button: {
      text: 'Click me',
      variant: 'primary',
      icon: '',
      disabled: false
    },
    card: {
      title: 'Card Title',
      content: 'This is the card content. You can add any text here.',
      image: '',
      actions: [
        { text: 'Ver más', onClick: 'handleViewMore' },
        { text: 'Editar', onClick: 'handleEdit' }
      ]
    },
    modal: {
      title: 'Modal Title',
      closable: true
    },
    form: {
      fields: [
        { name: 'name', type: 'text', label: 'Nombre', required: true },
        { name: 'email', type: 'email', label: 'Email', required: true },
        { name: 'message', type: 'textarea', label: 'Mensaje', required: false }
      ],
      submit_text: 'Enviar'
    },
    hero: {
      title: 'Welcome to Our Platform',
      subtitle: 'Build amazing things with our tools',
      cta_text: 'Get Started',
      background_image: ''
    },
    dashboard: {
      title: 'Analytics Dashboard',
      metrics: [
        { label: 'Users', value: '1,234', change: '+12%' },
        { label: 'Revenue', value: '$45,678', change: '+8%' },
        { label: 'Conversion', value: '23.4%', change: '-2%' }
      ]
    }
  }), []); // Sin dependencias porque es estático

  // Cargar componentes soportados al inicializar - ARREGLADO con useCallback
  const loadSupportedComponents = useCallback(async () => {
    try {
      const response = await sendMessage('ui-generator', 'list_components', {});
      if (response.status === 'success') {
        setSupportedComponents(response.data.supported_components);
      }
    } catch (error) {
      console.error('Error loading components:', error);
      // Fallback a componentes por defecto
      setSupportedComponents(['button', 'card', 'modal', 'form', 'hero', 'dashboard']);
    }
  }, [sendMessage]); // Dependencia: sendMessage

  // ARREGLADO: Incluir dependencia loadSupportedComponents
  useEffect(() => {
    loadSupportedComponents();
  }, [loadSupportedComponents]);

  // ARREGLADO: Incluir dependencia defaultProps
  useEffect(() => {
    setComponentProps(defaultProps[selectedComponent] || {});
  }, [selectedComponent, defaultProps]);

  const generateComponent = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await sendMessage('ui-generator', 'generate_component', {
        type: selectedComponent,
        props: componentProps,
        style: style,
        size: size
      });

      if (response.status === 'success') {
        setGeneratedCode(response.data.code);
      } else {
        setError(response.error || 'Error generando componente');
      }
    } catch (error) {
      setError(error.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      // Aquí podrías mostrar una notificación de éxito
      alert('Código copiado al portapapeles!');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const downloadCode = () => {
    const blob = new Blob([generatedCode], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedComponent}Component.jsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const updateProp = (propName, value) => {
    setComponentProps(prev => ({
      ...prev,
      [propName]: value
    }));
  };

  const addArrayItem = (propName, newItem) => {
    setComponentProps(prev => ({
      ...prev,
      [propName]: [...(prev[propName] || []), newItem]
    }));
  };

  const removeArrayItem = (propName, index) => {
    setComponentProps(prev => ({
      ...prev,
      [propName]: prev[propName].filter((_, i) => i !== index)
    }));
  };

  const renderPropEditor = () => {
    const props = componentProps;
    
    return (
      <div className="space-y-4">
        {Object.entries(props).map(([propName, propValue]) => (
          <div key={propName} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 capitalize">
              {propName.replace('_', ' ')}
            </label>
            
            {Array.isArray(propValue) ? (
              <div className="space-y-2">
                {propValue.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <input
                      type="text"
                      value={typeof item === 'object' ? JSON.stringify(item) : item}
                      onChange={(e) => {
                        const newArray = [...propValue];
                        try {
                          newArray[index] = JSON.parse(e.target.value);
                        } catch {
                          newArray[index] = e.target.value;
                        }
                        updateProp(propName, newArray);
                      }}
                      className="flex-1 px-3 py-1 border border-gray-300 rounded"
                    />
                    <button
                      onClick={() => removeArrayItem(propName, index)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addArrayItem(propName, typeof propValue[0] === 'object' ? {} : '')}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                >
                  + Agregar
                </button>
              </div>
            ) : typeof propValue === 'boolean' ? (
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={propValue}
                  onChange={(e) => updateProp(propName, e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-600">
                  {propValue ? 'Activado' : 'Desactivado'}
                </span>
              </label>
            ) : (
              <textarea
                value={typeof propValue === 'object' ? JSON.stringify(propValue, null, 2) : propValue}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    updateProp(propName, parsed);
                  } catch {
                    updateProp(propName, e.target.value);
                  }
                }}
                rows={typeof propValue === 'object' ? 4 : 1}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg">
            <Code size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">UI Component Generator</h1>
            <p className="text-gray-600">Genera componentes React personalizados con IA</p>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center space-x-2">
              <Layers className="text-blue-500" size={20} />
              <span className="text-sm text-gray-600">Componentes</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{supportedComponents.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center space-x-2">
              <Palette className="text-purple-500" size={20} />
              <span className="text-sm text-gray-600">Estilos</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">6</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center space-x-2">
              <Settings className="text-green-500" size={20} />
              <span className="text-sm text-gray-600">Personalizable</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">100%</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center space-x-2">
              <Zap className="text-yellow-500" size={20} />
              <span className="text-sm text-gray-600">Generación</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">Instant</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configuration Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Configuración</h2>
            
            {/* Component Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Componente
              </label>
              <select
                value={selectedComponent}
                onChange={(e) => setSelectedComponent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {supportedComponents.map(component => (
                  <option key={component} value={component}>
                    {component.charAt(0).toUpperCase() + component.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Style */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estilo
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="modern">Moderno</option>
                <option value="minimal">Minimalista</option>
                <option value="elevated">Elevado</option>
                <option value="glass">Glass</option>
                <option value="rounded">Redondeado</option>
                <option value="sharp">Definido</option>
              </select>
            </div>

            {/* Size */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tamaño
              </label>
              <div className="flex space-x-2">
                {['small', 'medium', 'large'].map(sizeOption => (
                  <button
                    key={sizeOption}
                    onClick={() => setSize(sizeOption)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      size === sizeOption
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {sizeOption.charAt(0).toUpperCase() + sizeOption.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Component Props */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Propiedades</h3>
              <div className="max-h-96 overflow-y-auto">
                {renderPropEditor()}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateComponent}
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
              } text-white flex items-center justify-center space-x-2`}
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  <span>Generando...</span>
                </>
              ) : (
                <>
                  <Zap size={20} />
                  <span>Generar Componente</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Code Output */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Code size={20} />
                <h3 className="font-medium">
                  {selectedComponent.charAt(0).toUpperCase() + selectedComponent.slice(1)} Component
                </h3>
              </div>
              
              {generatedCode && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPreviewMode(!previewMode)}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      previewMode 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    <Eye size={16} className="inline mr-1" />
                    {previewMode ? 'Código' : 'Preview'}
                  </button>
                  <button
                    onClick={copyToClipboard}
                    className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm transition-colors"
                  >
                    <Copy size={16} className="inline mr-1" />
                    Copiar
                  </button>
                  <button
                    onClick={downloadCode}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm transition-colors"
                  >
                    <Download size={16} className="inline mr-1" />
                    Descargar
                  </button>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                  <AlertCircle className="text-red-500" size={20} />
                  <span className="text-red-700">{error}</span>
                </div>
              )}

              {!generatedCode && !loading && !error && (
                <div className="text-center py-12">
                  <Code className="mx-auto text-gray-400 mb-4" size={64} />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    Listo para generar
                  </h3>
                  <p className="text-gray-500">
                    Configura tu componente y haz clic en "Generar Componente"
                  </p>
                </div>
              )}

              {generatedCode && !previewMode && (
                <div className="relative">
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{generatedCode}</code>
                  </pre>
                </div>
              )}

              {generatedCode && previewMode && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                  <div className="text-center">
                    <Eye className="mx-auto text-gray-400 mb-4" size={64} />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                      Preview Mode
                    </h3>
                    <p className="text-gray-500 mb-4">
                      El preview visual estará disponible en la próxima versión
                    </p>
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <strong>Componente:</strong> {selectedComponent} <br />
                        <strong>Estilo:</strong> {style} <br />
                        <strong>Tamaño:</strong> {size}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Usage Instructions */}
          {generatedCode && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-3">
                <CheckCircle className="text-blue-600" size={20} />
                <h4 className="font-medium text-blue-900">¿Cómo usar este componente?</h4>
              </div>
              <div className="text-blue-800 text-sm space-y-2">
                <p>1. Copia el código generado</p>
                <p>2. Guárdalo como un archivo .jsx en tu proyecto React</p>
                <p>3. Importa el componente donde lo necesites</p>
                <p>4. ¡Úsalo con las props configuradas!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UIGenerator;
