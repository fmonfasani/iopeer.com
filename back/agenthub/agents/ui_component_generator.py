# ============================================
# agenthub/agents/ui_component_generator.py
# Agente especializado en generar componentes UI
# ============================================

import json
import re
from typing import Dict, Any, List
from datetime import datetime
from .base_agent import BaseAgent

class UIComponentGeneratorAgent(BaseAgent):
    """
    Agente especializado en generar componentes de UI React con Tailwind CSS.
    Puede crear botones, formularios, cards, modales, layouts y más.
    """
    
    def __init__(self):
        super().__init__("ui-generator", "UI Component Generator")
        self.component_templates = self._load_component_templates()
        self.supported_components = [
            "button", "card", "modal", "form", "input", "table", 
            "navbar", "sidebar", "hero", "footer", "dashboard",
            "chart", "calendar", "profile", "settings", "notification"
        ]
    
    def handle(self, message: Dict[str, Any]) -> Dict[str, Any]:
        """Maneja las peticiones de generación de componentes UI"""
        action = message.get("action")
        data = message.get("data", {})
        
        try:
            if action == "generate_component":
                return self._generate_component(data)
            elif action == "list_components":
                return self._list_supported_components()
            elif action == "get_component_preview":
                return self._get_component_preview(data)
            elif action == "customize_component":
                return self._customize_component(data)
            elif action == "generate_page":
                return self._generate_full_page(data)
            else:
                return {
                    "status": "error",
                    "error": f"Acción no soportada: {action}"
                }
        except Exception as e:
            return {
                "status": "error", 
                "error": str(e)
            }
    
    def _generate_component(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Genera un componente UI basado en las especificaciones"""
        component_type = data.get("type", "button").lower()
        props = data.get("props", {})
        style = data.get("style", "modern")
        size = data.get("size", "medium")
        
        if component_type not in self.supported_components:
            return {
                "status": "error",
                "error": f"Tipo de componente no soportado: {component_type}"
            }
        
        # Generar el componente
        component_code = self._create_component_code(component_type, props, style, size)
        
        return {
            "status": "success",
            "data": {
                "component_type": component_type,
                "code": component_code,
                "props": props,
                "style": style,
                "size": size,
                "instructions": self._get_usage_instructions(component_type),
                "preview_url": f"/preview/{component_type}",
                "generated_at": datetime.now().isoformat()
            }
        }
    
    def _create_component_code(self, component_type: str, props: Dict, style: str, size: str) -> str:
        """Crea el código del componente basado en el tipo y propiedades"""
        
        if component_type == "button":
            return self._generate_button(props, style, size)
        elif component_type == "card":
            return self._generate_card(props, style, size)
        elif component_type == "modal":
            return self._generate_modal(props, style, size)
        elif component_type == "form":
            return self._generate_form(props, style, size)
        elif component_type == "navbar":
            return self._generate_navbar(props, style, size)
        elif component_type == "hero":
            return self._generate_hero(props, style, size)
        elif component_type == "dashboard":
            return self._generate_dashboard(props, style, size)
        elif component_type == "table":
            return self._generate_table(props, style, size)
        else:
            return self._generate_generic_component(component_type, props, style, size)
    
    def _generate_button(self, props: Dict, style: str, size: str) -> str:
        """Genera un botón personalizado"""
        text = props.get("text", "Click me")
        variant = props.get("variant", "primary")
        icon = props.get("icon", None)
        disabled = props.get("disabled", False)
        
        size_classes = {
            "small": "px-3 py-1.5 text-sm",
            "medium": "px-4 py-2 text-base", 
            "large": "px-6 py-3 text-lg"
        }
        
        variant_classes = {
            "primary": "bg-blue-600 hover:bg-blue-700 text-white",
            "secondary": "bg-gray-600 hover:bg-gray-700 text-white",
            "success": "bg-green-600 hover:bg-green-700 text-white",
            "danger": "bg-red-600 hover:bg-red-700 text-white",
            "outline": "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
        }
        
        style_classes = {
            "modern": "rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl",
            "minimal": "rounded border-none font-medium transition-colors",
            "rounded": "rounded-full font-semibold transition-all duration-200",
            "sharp": "font-bold transition-all duration-200"
        }
        
        icon_import = ""
        icon_element = ""
        if icon:
            icon_import = f"import {{ {icon} }} from 'lucide-react';"
            icon_element = f"<{icon} size={{16}} className=\"mr-2\" />"
        
        disabled_class = "opacity-50 cursor-not-allowed" if disabled else ""
        
        return f"""import React from 'react';
{icon_import}

const CustomButton = ({{ onClick, children, ...props }}) => {{
  return (
    <button
      onClick={{onClick}}
      disabled={{{disabled}}}
      className="{{`{size_classes[size]} {variant_classes[variant]} {style_classes[style]} {disabled_class} flex items-center justify-center`}}"
      {{...props}}
    >
      {icon_element}
      {{children || "{text}"}}
    </button>
  );
}};

export default CustomButton;

// Ejemplo de uso:
// <CustomButton onClick={{() => console.log('Clicked!')}}>
//   {text}
// </CustomButton>"""
    
    def _generate_card(self, props: Dict, style: str, size: str) -> str:
        """Genera una card personalizada"""
        title = props.get("title", "Card Title")
        content = props.get("content", "Card content goes here...")
        image = props.get("image", None)
        actions = props.get("actions", [])
        
        size_classes = {
            "small": "p-4",
            "medium": "p-6",
            "large": "p-8"
        }
        
        style_classes = {
            "modern": "bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100",
            "minimal": "bg-white rounded-lg border border-gray-200",
            "elevated": "bg-white rounded-2xl shadow-2xl border-0",
            "glass": "bg-white/80 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg"
        }
        
        image_section = ""
        if image:
            image_section = f"""
      <div className="mb-4">
        <img src="{image}" alt="{title}" className="w-full h-48 object-cover rounded-lg" />
      </div>"""
        
        actions_section = ""
        if actions:
            action_buttons = []
            for action in actions:
                action_buttons.append(f"""
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          {action.get('text', 'Action')}
        </button>""")
            actions_section = f"""
      <div className="flex gap-2 mt-4">
        {"".join(action_buttons)}
      </div>"""
        
        return f"""import React from 'react';

const CustomCard = ({{ title, content, image, actions, children, ...props }}) => {{
  return (
    <div className="{style_classes[style]} {size_classes[size]}" {{...props}}>
      {{image && (
        <div className="mb-4">
          <img src={{image}} alt={{title}} className="w-full h-48 object-cover rounded-lg" />
        </div>
      )}}{image_section}
      
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {{title || "{title}"}}
        </h3>
        <p className="text-gray-600 mb-4">
          {{content || "{content}"}}
        </p>
        {{children}}
      </div>
      
      {{actions && actions.length > 0 && (
        <div className="flex gap-2 mt-4">
          {{actions.map((action, index) => (
            <button
              key={{index}}
              onClick={{action.onClick}}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {{action.text}}
            </button>
          ))}}
        </div>
      )}}{actions_section}
    </div>
  );
}};

export default CustomCard;

// Ejemplo de uso:
// <CustomCard 
//   title="{title}"
//   content="{content}"
//   actions={{[
//     {{ text: 'Ver más', onClick: () => console.log('Ver más') }},
//     {{ text: 'Editar', onClick: () => console.log('Editar') }}
//   ]}}
// />"""
    
    def _generate_modal(self, props: Dict, style: str, size: str) -> str:
        """Genera un modal personalizado"""
        title = props.get("title", "Modal Title")
        closable = props.get("closable", True)
        
        size_classes = {
            "small": "max-w-md",
            "medium": "max-w-lg", 
            "large": "max-w-4xl"
        }
        
        return f"""import React from 'react';
import {{ X }} from 'lucide-react';

const CustomModal = ({{ isOpen, onClose, title, children, ...props }}) => {{
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {{/* Overlay */}}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={{onClose}}
        ></div>
        
        {{/* Modal */}}
        <div className="inline-block w-full {size_classes[size]} my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {{/* Header */}}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              {{title || "{title}"}}
            </h3>
            {'{' if closable else ''}
            {'{' if closable else ''}closable && (
              <button
                onClick={{onClose}}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={{20}} />
              </button>
            ){'}}' if closable else ''}
          </div>
          
          {{/* Content */}}
          <div className="p-6">
            {{children}}
          </div>
          
          {{/* Footer (opcional) */}}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
            <button
              onClick={{onClose}}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}};

export default CustomModal;

// Ejemplo de uso:
// const [isOpen, setIsOpen] = useState(false);
// 
// <CustomModal 
//   isOpen={{isOpen}}
//   onClose={{() => setIsOpen(false)}}
//   title="{title}"
// >
//   <p>Contenido del modal aquí...</p>
// </CustomModal>"""
    
    def _generate_form(self, props: Dict, style: str, size: str) -> str:
        """Genera un formulario personalizado"""
        fields = props.get("fields", [
            {"name": "name", "type": "text", "label": "Nombre", "required": True},
            {"name": "email", "type": "email", "label": "Email", "required": True}
        ])
        submit_text = props.get("submit_text", "Enviar")
        
        field_components = []
        for field in fields:
            field_type = field.get("type", "text")
            field_name = field.get("name")
            field_label = field.get("label", field_name.title())
            required = field.get("required", False)
            
            if field_type == "select":
                options = field.get("options", [])
                option_elements = "\n".join([f'            <option value="{opt["value"]}">{opt["label"]}</option>' for opt in options])
                field_components.append(f"""
        <div>
          <label htmlFor="{field_name}" className="block text-sm font-medium text-gray-700 mb-2">
            {field_label} {"{required && <span className=\"text-red-500\">*</span>}" if required else ""}
          </label>
          <select
            id="{field_name}"
            name="{field_name}"
            required={{{str(required).lower()}}}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Seleccionar...</option>
{option_elements}
          </select>
        </div>""")
            elif field_type == "textarea":
                field_components.append(f"""
        <div>
          <label htmlFor="{field_name}" className="block text-sm font-medium text-gray-700 mb-2">
            {field_label} {"{required && <span className=\"text-red-500\">*</span>}" if required else ""}
          </label>
          <textarea
            id="{field_name}"
            name="{field_name}"
            required={{{str(required).lower()}}}
            rows={{4}}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          ></textarea>
        </div>""")
            else:
                field_components.append(f"""
        <div>
          <label htmlFor="{field_name}" className="block text-sm font-medium text-gray-700 mb-2">
            {field_label} {"{required && <span className=\"text-red-500\">*</span>}" if required else ""}
          </label>
          <input
            type="{field_type}"
            id="{field_name}"
            name="{field_name}"
            required={{{str(required).lower()}}}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>""")
        
        return f"""import React, {{ useState }} from 'react';

const CustomForm = ({{ onSubmit, children, ...props }}) => {{
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {{
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    try {{
      if (onSubmit) {{
        await onSubmit(data);
      }}
    }} catch (error) {{
      console.error('Form submission error:', error);
    }} finally {{
      setLoading(false);
    }}
  }};
  
  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <form onSubmit={{handleSubmit}} className="space-y-4" {{...props}}>
        {"".join(field_components)}
        
        {{children}}
        
        <button
          type="submit"
          disabled={{loading}}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {{loading ? 'Enviando...' : '{submit_text}'}}
        </button>
      </form>
    </div>
  );
}};

export default CustomForm;

// Ejemplo de uso:
// <CustomForm onSubmit={{(data) => console.log('Form data:', data)}}>
//   {/* Campos adicionales aquí */}
// </CustomForm>"""
    
    def _generate_dashboard(self, props: Dict, style: str, size: str) -> str:
        """Genera un dashboard completo"""
        title = props.get("title", "Dashboard")
        metrics = props.get("metrics", [
            {"label": "Usuarios", "value": "1,234", "change": "+12%"},
            {"label": "Ventas", "value": "$45,678", "change": "+8%"},
            {"label": "Conversiones", "value": "23.4%", "change": "-2%"}
        ])
        
        metric_cards = []
        for metric in metrics:
            change_color = "text-green-600" if metric.get("change", "").startswith("+") else "text-red-600"
            metric_cards.append(f"""
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{metric['label']}</p>
                <p className="text-2xl font-bold text-gray-900">{metric['value']}</p>
              </div>
              <div className="text-right">
                <p className="{change_color} text-sm font-medium">{metric.get('change', '')}</p>
              </div>
            </div>
          </div>""")
        
        return f"""import React from 'react';
import {{ BarChart3, Users, DollarSign, TrendingUp }} from 'lucide-react';

const CustomDashboard = ({{ title, metrics, children, ...props }}) => {{
  const defaultMetrics = [
    {{ label: "Usuarios", value: "1,234", change: "+12%", icon: Users }},
    {{ label: "Ventas", value: "$45,678", change: "+8%", icon: DollarSign }},
    {{ label: "Conversiones", value: "23.4%", change: "-2%", icon: TrendingUp }}
  ];
  
  const displayMetrics = metrics || defaultMetrics;
  
  return (
    <div className="min-h-screen bg-gray-50 p-6" {{...props}}>
      {{/* Header */}}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{{title || "{title}"}}</h1>
        <p className="text-gray-600">Resumen de actividad y métricas clave</p>
      </div>
      
      {{/* Metrics Grid */}}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {{displayMetrics.map((metric, index) => {{
          const Icon = metric.icon || BarChart3;
          const isPositive = metric.change?.startsWith('+');
          
          return (
            <div key={{index}} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Icon className="text-blue-600" size={{24}} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{{metric.label}}</p>
                    <p className="text-2xl font-bold text-gray-900">{{metric.value}}</p>
                  </div>
                </div>
                {{metric.change && (
                  <div className={{`text-sm font-medium ${{isPositive ? 'text-green-600' : 'text-red-600'}}`}}>
                    {{metric.change}}
                  </div>
                )}}
              </div>
            </div>
          );
        }})}}
      </div>
      
      {{/* Content Area */}}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Nuevo usuario registrado</span>
              <span className="text-xs text-gray-500 ml-auto">Hace 2 min</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Venta completada</span>
              <span className="text-xs text-gray-500 ml-auto">Hace 5 min</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Reporte generado</span>
              <span className="text-xs text-gray-500 ml-auto">Hace 10 min</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center">
              <p className="text-sm font-medium text-gray-700">Nuevo Proyecto</p>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-center">
              <p className="text-sm font-medium text-gray-700">Generar Reporte</p>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-center">
              <p className="text-sm font-medium text-gray-700">Ver Analytics</p>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors text-center">
              <p className="text-sm font-medium text-gray-700">Configuración</p>
            </button>
          </div>
        </div>
      </div>
      
      {{/* Custom Content */}}
      {{children}}
    </div>
  );
}};

export default CustomDashboard;

// Ejemplo de uso:
// <CustomDashboard 
//   title="{title}"
//   metrics={{[
//     {{ label: "Usuarios Activos", value: "2,345", change: "+15%", icon: Users }},
//     {{ label: "Ingresos", value: "$67,890", change: "+23%", icon: DollarSign }}
//   ]}}
// >
//   {/* Contenido adicional del dashboard */}
// </CustomDashboard>"""
    
    def _list_supported_components(self) -> Dict[str, Any]:
        """Lista todos los componentes soportados"""
        return {
            "status": "success",
            "data": {
                "supported_components": self.supported_components,
                "styles": ["modern", "minimal", "elevated", "glass", "rounded", "sharp"],
                "sizes": ["small", "medium", "large"],
                "total_components": len(self.supported_components)
            }
        }
    
    def _get_component_preview(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Genera un preview del componente"""
        component_type = data.get("type")
        
        if not component_type:
            return {"status": "error", "error": "Tipo de componente requerido"}
        
        preview_data = {
            "button": "Botón interactivo con múltiples estilos y tamaños",
            "card": "Tarjeta con imagen, título, contenido y acciones",
            "modal": "Modal responsivo con overlay y animaciones",
            "form": "Formulario con validación y diferentes tipos de campo",
            "navbar": "Barra de navegación responsiva con menú móvil",
            "hero": "Sección hero con call-to-action y gradientes",
            "dashboard": "Dashboard completo con métricas y gráficos",
            "table": "Tabla con ordenamiento, filtrado y paginación"
        }
        
        return {
            "status": "success",
            "data": {
                "component_type": component_type,
                "description": preview_data.get(component_type, "Componente personalizable"),
                "features": self._get_component_features(component_type),
                "preview_available": True
            }
        }
    
    def _get_component_features(self, component_type: str) -> List[str]:
        """Obtiene las características de un componente"""
        features = {
            "button": ["Múltiples variantes", "Iconos opcionales", "Estados disabled", "Diferentes tamaños"],
            "card": ["Imágenes opcionales", "Acciones personalizables", "Múltiples estilos", "Contenido flexible"],
            "modal": ["Overlay personalizable", "Tamaños variables", "Botones de acción", "Animaciones"],
            "form": ["Validación automática", "Múltiples tipos de campo", "Estados de carga", "Envío asíncrono"],
            "dashboard": ["Métricas en tiempo real", "Gráficos integrados", "Actividad reciente", "Acciones rápidas"]
        }
        return features.get(component_type, ["Personalizable", "Responsivo", "Accesible"])
    
    def _get_usage_instructions(self, component_type: str) -> str:
        """Proporciona instrucciones de uso para el componente"""
        instructions = {
            "button": "Importa el componente y úsalo con onClick, texto e iconos opcionales",
            "card": "Pasa title, content, image y actions como props",
            "modal": "Controla la visibilidad con isOpen y onClose",
            "form": "Define campos en la configuración y maneja onSubmit",
            "dashboard": "Proporciona métricas y el componente generará el layout"
        }
        return instructions.get(component_type, "Importa y usa según las props disponibles")
    
    def get_capabilities(self) -> Dict[str, Any]:
        """Retorna las capacidades del agente"""
        return {
            "actions": [
                "generate_component",
                "list_components", 
                "get_component_preview",
                "customize_component",
                "generate_page"
            ],
            "description": "Genera componentes UI React personalizados con Tailwind CSS",
            "supported_components": self.supported_components,
            "features": [
                "Componentes React modernos",
                "Estilos Tailwind CSS",
                "Múltiples variantes y tamaños",
                "Código listo para usar",
                "Responsive design",
                "Accesibilidad incluida"
            ]
        }
    
    def _load_component_templates(self) -> Dict[str, str]:
        """Carga plantillas base para componentes"""
        return {
            "base_import": "import React from 'react';",
            "base_export": "export default {component_name};",
            "tailwind_classes": {
                "button": "px-4 py-2 rounded-lg font-semibold transition-colors",
                "card": "bg-white rounded-lg shadow-lg p-6",
                "modal": "fixed inset-0 z-50 overflow-y-auto"
            }
        }

# ============================================
# Registrar el agente en el registry
# ============================================

def register_ui_generator_agent():
    """Función para registrar el agente en el sistema"""
    return {
        "agent_id": "ui-generator",
        "name": "UI Component Generator",
        "class": "UIComponentGeneratorAgent",
        "description": "Genera componentes UI React personalizados",
        "version": "1.0.0",
        "capabilities": [
            "generate_component",
            "list_components",
            "get_component_preview", 
            "customize_component",
            "generate_page"
        ],
        "supported_components": [
            "button", "card", "modal", "form", "input", "table",
            "navbar", "sidebar", "hero", "footer", "dashboard"
        ]
    }