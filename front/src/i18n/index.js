// front/src/i18n/index.js - CONFIGURACIÓN MEJORADA
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './en.json';
import es from './es.json';

const resources = {
  en: { translation: en },
  es: { translation: es },
};

i18n
  .use(LanguageDetector) // Detecta idioma del navegador
  .use(initReactI18next) // Pasa i18n a react-i18next
  .init({
    resources,
    
    // Idioma por defecto si no se detecta
    fallbackLng: 'en',
    
    // Idiomas soportados
    supportedLngs: ['en', 'es'],
    
    // Configuración de detección
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false, // React ya escapa por defecto
    },

    // Configuración de desarrollo
    debug: process.env.NODE_ENV === 'development',
    
    // Configuración de recursos
    react: {
      useSuspense: false, // Evita problemas de suspense
    },
  });

export default i18n;
