# back/agenthub/agents/ui_generator_agent.py

import json
from typing import Any, Dict
from .base_agent import BaseAgent

class UIGeneratorAgent(BaseAgent):
    """UI Component Generator Agent"""
    
    def __init__(self):
        super().__init__("ui_generator", "UI Component Generator")
        self.component_templates = {
            "button": self._get_button_template(),
            "card": self._get_card_template(),
            "form": self._get_form_template(),
            "modal": self._get_modal_template(),
            "navbar": self._get_navbar_template()
        }
    
    def handle(self, message: Dict[str, Any]) -> Dict[str, Any]:
        """Handle UI generation requests"""
        action = message.get("action")
        data = message.get("data", {})
        
        try:
            if action == "generate_component":
                return self._generate_component(data)
            elif action == "generate_page":
                return self._generate_page(data)
            elif action == "list_templates":
                return self._list_templates()
            else:
                return {
                    "status": "error",
                    "error": f"Unsupported action: {action}"
                }
        except Exception as e:
            return {
                "status": "error",
                "error": str(e)
            }
    
    def _generate_component(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate a React component"""
        component_type = data.get("type", "button")
        props = data.get("props", {})
        
        if component_type not in self.component_templates:
            return {
                "status": "error",
                "error": f"Component type '{component_type}' not supported. Available: {list(self.component_templates.keys())}"
            }
        
        # Get template and render
        template = self.component_templates[component_type]
        code = self._render_template(template, props)
        
        return {
            "status": "success",
            "data": {
                "component_type": component_type,
                "component_name": props.get("name", f"{component_type.title()}Component"),
                "code": code,
                "filename": f"{props.get('name', component_type)}.jsx",
                "framework": "react",
                "ui_library": "tailwindcss",
                "dependencies": ["react"],
                "props_used": props,
                "preview_available": True,
                "download_ready": True,
                "estimated_lines": len(code.split('\n'))
            }
        }
    
    def _generate_page(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate a complete page"""
        page_type = data.get("type", "landing")
        page_name = data.get("name", "LandingPage")
        
        if page_type == "landing":
            code = self._get_landing_page_template()
        else:
            code = self._get_generic_page_template()
        
        return {
            "status": "success",
            "data": {
                "page_type": page_type,
                "page_name": page_name,
                "code": code,
                "filename": f"{page_name}.jsx",
                "components_used": ["Hero", "Features", "CTA"],
                "download_ready": True
            }
        }
    
    def _list_templates(self) -> Dict[str, Any]:
        """List all available templates"""
        return {
            "status": "success",
            "data": {
                "components": list(self.component_templates.keys()),
                "pages": ["landing", "dashboard", "profile"],
                "total_templates": len(self.component_templates) + 3
            }
        }
    
    def _get_button_template(self) -> str:
        return '''import React from 'react';

const {component_name} = ({{ 
  children = "{button_text}", 
  onClick = () => {{}}, 
  variant = "{variant}",
  size = "{size}",
  disabled = false,
  className = ""
}}) => {{
  const baseClasses = "font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {{
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500", 
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    success: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500"
  }};
  
  const sizeClasses = {{
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2 text-base", 
    large: "px-6 py-3 text-lg"
  }};
  
  return (
    <button
      onClick={{onClick}}
      disabled={{disabled}}
      className={{`${{baseClasses}} ${{variantClasses[variant]}} ${{sizeClasses[size]}} ${{disabled ? 'opacity-50 cursor-not-allowed' : ''}} ${{className}}`}}
    >
      {{children}}
    </button>
  );
}};

export default {component_name};'''

    def _get_card_template(self) -> str:
        return '''import React from 'react';

const {component_name} = ({{ 
  title = "{card_title}",
  children,
  footer = null,
  className = "",
  shadow = "{shadow_level}",
  padding = "{padding_size}"
}}) => {{
  const shadowClasses = {{
    none: "",
    small: "shadow-sm",
    medium: "shadow-md", 
    large: "shadow-lg",
    xl: "shadow-xl"
  }};

  const paddingClasses = {{
    small: "p-4",
    medium: "p-6",
    large: "p-8"
  }};

  return (
    <div className={{`bg-white rounded-lg border ${{shadowClasses[shadow]}} ${{className}}`}}>
      {{title && (
        <div className={{`${{paddingClasses[padding]}} border-b border-gray-200`}}>
          <h3 className="text-lg font-semibold text-gray-900">{{title}}</h3>
        </div>
      )}}
      
      <div className={{paddingClasses[padding]}}>
        {{children}}
      </div>
      
      {{footer && (
        <div className={{`${{paddingClasses[padding]}} border-t border-gray-200 bg-gray-50 rounded-b-lg`}}>
          {{footer}}
        </div>
      )}}
    </div>
  );
}};

export default {component_name};'''

    def _get_form_template(self) -> str:
        return '''import React, {{ useState }} from 'react';

const {component_name} = ({{ 
  onSubmit = () => {{}},
  fields = [],
  submitText = "{submit_text}",
  className = ""
}}) => {{
  const [formData, setFormData] = useState({{}});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {{
    e.preventDefault();
    setLoading(true);
    try {{
      await onSubmit(formData);
    }} finally {{
      setLoading(false);
    }}
  }};

  const handleChange = (field, value) => {{
    setFormData(prev => ({{ ...prev, [field]: value }}));
  }};

  return (
    <form onSubmit={{handleSubmit}} className={{`space-y-4 ${{className}}`}}>
      {{fields.map(field => (
        <div key={{field.name}}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {{field.label}}
          </label>
          <input
            type={{field.type || 'text'}}
            placeholder={{field.placeholder}}
            value={{formData[field.name] || ''}}
            onChange={{(e) => handleChange(field.name, e.target.value)}}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={{field.required}}
          />
        </div>
      ))}
      
      <button
        type="submit"
        disabled={{loading}}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {{loading ? 'Loading...' : submitText}}
      </button>
    </form>
  );
}};

export default {component_name};'''

    def _get_modal_template(self) -> str:
        return '''import React from 'react';

const {component_name} = ({{ 
  isOpen = false,
  onClose = () => {{}},
  title = "{modal_title}",
  children,
  size = "{modal_size}",
  className = ""
}}) => {{
  if (!isOpen) return null;

  const sizeClasses = {{
    small: "max-w-md",
    medium: "max-w-lg", 
    large: "max-w-2xl",
    xl: "max-w-4xl"
  }};

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div 
          className="fixed inset-0 bg-black opacity-50" 
          onClick={{onClose}}
        />
        
        <div className={{`relative bg-white rounded-lg shadow-xl ${{sizeClasses[size]}} w-full ${{className}}`}}>
          <div className="flex items-center justify-between p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">{{title}}</h3>
            <button
              onClick={{onClose}}
              className="text-gray-400 hover:text-gray-600"
            >
              <span className="sr-only">Close</span>
              ✕
            </button>
          </div>
          
          <div className="p-6">
            {{children}}
          </div>
        </div>
      </div>
    </div>
  );
}};

export default {component_name};'''

    def _get_navbar_template(self) -> str:
        return '''import React, {{ useState }} from 'react';

const {component_name} = ({{ 
  logo = "{logo_text}",
  links = [],
  className = ""
}}) => {{
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className={{`bg-white shadow-lg ${{className}}`}}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold text-gray-800">{{logo}}</span>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {{links.map(link => (
                <a
                  key={{link.href}}
                  href={{link.href}}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  {{link.text}}
                </a>
              ))}
            </div>
          </div>
          
          <div className="md:hidden">
            <button
              onClick={{() => setIsMobileMenuOpen(!isMobileMenuOpen)}}
              className="text-gray-600 hover:text-gray-900"
            >
              ☰
            </button>
          </div>
        </div>
        
        {{isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {{links.map(link => (
                <a
                  key={{link.href}}
                  href={{link.href}}
                  className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
                >
                  {{link.text}}
                </a>
              ))}
            </div>
          </div>
        )}}
      </div>
    </nav>
  );
}};

export default {component_name};'''

    def _get_landing_page_template(self) -> str:
        return '''import React from 'react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to Our Platform
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Transform your workflow with our innovative solution
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors">
            Get Started Free
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                🚀
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast</h3>
              <p className="text-gray-600">Lightning-fast performance</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                🔒
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure</h3>
              <p className="text-gray-600">Enterprise-grade security</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                ⭐
              </div>
              <h3 className="text-xl font-semibold mb-2">Reliable</h3>
              <p className="text-gray-600">99.9% uptime guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8">Join thousands of satisfied customers</p>
          <button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold text-lg transition-colors">
            Start Your Free Trial
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;'''

    def _render_template(self, template: str, props: Dict[str, Any]) -> str:
        """Render template with props"""
        replacements = {
            "component_name": props.get("name", "CustomComponent"),
            "button_text": props.get("text", "Click me"),
            "variant": props.get("variant", "primary"),
            "size": props.get("size", "medium"),
            "card_title": props.get("title", "Card Title"),
            "shadow_level": props.get("shadow", "medium"),
            "padding_size": props.get("padding", "medium"),
            "submit_text": props.get("submitText", "Submit"),
            "modal_title": props.get("title", "Modal Title"),
            "modal_size": props.get("size", "medium"),
            "logo_text": props.get("logo", "Brand")
        }
        
        code = template
        for key, value in replacements.items():
            code = code.replace(f"{{{key}}}", str(value))
        
        return code
    
    def get_capabilities(self) -> Dict[str, Any]:
        """Return agent capabilities"""
        return {
            "actions": ["generate_component", "generate_page", "list_templates"],
            "description": "Generate React UI components with Tailwind CSS",
            "supported_components": list(self.component_templates.keys()),
            "supported_frameworks": ["React"],
            "supported_ui_libraries": ["TailwindCSS"],
            "features": [
                "Responsive design",
                "Accessibility compliant", 
                "Customizable props",
                "Multiple variants and sizes",
                "TypeScript ready",
                "Mobile-first approach"
            ],
            "examples": [
                {
                    "action": "generate_component",
                    "data": {"type": "button", "props": {"name": "PrimaryButton", "variant": "primary"}}
                },
                {
                    "action": "generate_component", 
                    "data": {"type": "card", "props": {"name": "ProductCard", "title": "Product Title"}}
                }
            ]
        }