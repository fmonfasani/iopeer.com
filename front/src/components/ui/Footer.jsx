import React from 'react';
import {
  Brain, Twitter, Linkedin, Github, Mail, Phone, MapPin,
  ArrowRight, Heart
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Producto',
      links: [
        { name: 'Marketplace', href: '#marketplace' },
        { name: 'API', href: '#api' },
        { name: 'Integraciones', href: '#integraciones' },
        { name: 'Documentación', href: '#docs' },
        { name: 'Precios', href: '#precios' }
      ]
    },
    {
      title: 'Empresa',
      links: [
        { name: 'Acerca de', href: '#about' },
        { name: 'Blog', href: '#blog' },
        { name: 'Carreras', href: '#careers' },
        { name: 'Prensa', href: '#press' },
        { name: 'Socios', href: '#partners' }
      ]
    },
    {
      title: 'Soporte',
      links: [
        { name: 'Centro de ayuda', href: '#help' },
        { name: 'Documentación técnica', href: '#tech-docs' },
        { name: 'Estado del sistema', href: '#status' },
        { name: 'Contacto', href: '#contact' },
        { name: 'Comunidad', href: '#community' }
      ]
    },
    {
      title: 'Developers',
      links: [
        { name: 'API Reference', href: '#api-ref' },
        { name: 'SDKs', href: '#sdks' },
        { name: 'Webhooks', href: '#webhooks' },
        { name: 'Changelog', href: '#changelog' },
        { name: 'GitHub', href: '#github' }
      ]
    }
  ];

  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-slate-900" />
              </div>
              <span className="text-xl font-bold text-white">AgentHub</span>
            </div>

            <p className="text-slate-400 mb-6 leading-relaxed">
              El marketplace líder de agentes IA en Latinoamérica. Conectamos empresas
              con la mejor tecnología de inteligencia artificial para potenciar su productividad
              y acelerar su transformación digital.
            </p>

            {/* Newsletter Signup */}
            <div className="mb-6">
              <h4 className="text-white font-semibold mb-3">
                Mantente actualizado
              </h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-l-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
                <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-r-lg transition-colors">
                  <ArrowRight size={16} />
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Recibe las últimas noticias y actualizaciones de AgentHub
              </p>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section, index) => (
            <div key={section.title}>
              <h3 className="text-white font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-slate-400 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="border-t border-slate-800 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-white font-medium">Email</p>
                <p className="text-slate-400 text-sm">contacto@agenthub.com</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-white font-medium">Teléfono</p>
                <p className="text-slate-400 text-sm">+52 55 1234 5678</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-white font-medium">Oficina</p>
                <p className="text-slate-400 text-sm">Ciudad de México, México</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-slate-400 text-sm">
              <span>&copy; {currentYear} AgentHub. Todos los derechos reservados.</span>
              <span className="hidden md:inline">•</span>
              <span className="flex items-center space-x-1">
                <span>Hecho con</span>
                <Heart className="w-4 h-4 text-red-400 fill-current" />
                <span>en Latinoamérica</span>
              </span>
            </div>

            <div className="flex space-x-6 text-slate-400 text-sm">
              <a href="#privacy" className="hover:text-white transition-colors">
                Privacidad
              </a>
              <a href="#terms" className="hover:text-white transition-colors">
                Términos
              </a>
              <a href="#cookies" className="hover:text-white transition-colors">
                Cookies
              </a>
              <a href="#security" className="hover:text-white transition-colors">
                Seguridad
              </a>
            </div>
          </div>
        </div>

        {/* Enterprise CTA */}
        <div className="mt-12 bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 border border-emerald-500/20 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            ¿Necesitas una solución enterprise?
          </h3>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Descubre cómo AgentHub puede transformar tu empresa con integraciones personalizadas,
            soporte dedicado y la mayor biblioteca de agentes IA de Latinoamérica.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors">
              Hablar con ventas
            </button>
            <button className="border border-slate-600 hover:border-slate-500 text-white px-8 py-3 rounded-xl font-semibold transition-colors">
              Ver demo enterprise
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
