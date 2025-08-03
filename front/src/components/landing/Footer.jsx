// src/components/landing/Footer.jsx
import React from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const productLinks = [
    { name: 'Marketplace', href: '/marketplace' },
    { name: 'UI Generator', href: '/ui-generator' },
    { name: 'Analytics', href: '/analytics' },
    { name: 'Enterprise', href: '/enterprise' }
  ];

  const resourceLinks = [
    { name: 'Documentación', href: '/docs' },
    { name: 'API Reference', href: '/api' },
    { name: 'Tutoriales', href: '/tutorials' },
    { name: 'Soporte', href: '/support' }
  ];

  const legalLinks = [
    { name: 'Privacidad', href: '/privacy' },
    { name: 'Términos', href: '/terms' },
    { name: 'Cookies', href: '/cookies' }
  ];

  const socialLinks = [
    { icon: Github, href: 'https://github.com/iopeer', label: 'GitHub' },
    { icon: Twitter, href: 'https://twitter.com/iopeer', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com/company/iopeer', label: 'LinkedIn' }
  ];

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo y descripción */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">io</span>
              </div>
              <span className="text-2xl font-bold">Iopeer</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              La plataforma definitiva para crear, gestionar y monetizar agentes de inteligencia artificial.
              Únete al futuro del desarrollo.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white cursor-pointer transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={24} />
                </a>
              ))}
            </div>
          </div>

          {/* Links de producto */}
          <div>
            <h4 className="font-semibold mb-4">Producto</h4>
            <ul className="space-y-2">
              {productLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links de recursos */}
          <div>
            <h4 className="font-semibold mb-4">Recursos</h4>
            <ul className="space-y-2">
              {resourceLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">© {currentYear} Iopeer. Todos los derechos reservados.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {legalLinks.map((link, index) => (
              <a 
                key={index}
                href={link.href} 
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
