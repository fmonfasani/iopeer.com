// front/src/hooks/useMiApp.js
import { useState, useEffect, useCallback } from 'react';
import { iopeerAPI } from '../services/iopeerAPI';
import { useIopeer } from './useIopeer';

export const useMiApp = () => {
  const { isConnected } = useIopeer();
  const [projects, setProjects] = useState([
    // Mock data inicial
    {
      id: 1,
      name: "E-commerce Startup",
      description: "Tienda online completa con pagos",
      status: "deployed",
      agents_used: ["UI Generator", "Backend Agent", "Payment Agent"],
      created_at: "2025-01-15",
      last_deploy: "2025-01-20",
      url: "https://mi-tienda-demo.vercel.app",
      template: "E-commerce Store"
    },
    {
      id: 2,
      name: "Blog Personal",
      description: "Blog con CMS y SEO optimizado",
      status: "building",
      agents_used: ["Content Agent", "SEO Agent"],
      created_at: "2025-01-18",
      last_deploy: null,
      url: null,
      template: "Blog/Portfolio"
    }
  ]);

  const [appStats, setAppStats] = useState({
    total_projects: 5,
    active_projects: 2,
    total_deployments: 12,
    total_agents_used: 8,
    success_rate: 94
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar proyectos del usuario
  const loadProjects = useCallback(async () => {
    if (!isConnected) return;

    try {
      setLoading(true);
      setError(null);

      // En el MVP, usar datos mock. En producción conectar con el backend
      // const response = await iopeerAPI.getUserProjects();
      // setProjects(response.projects);
      
      // Simular carga
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Actualizar stats basado en proyectos
      setAppStats(prev => ({
        ...prev,
        total_projects: projects.length,
        active_projects: projects.filter(p => p.status === 'deployed' || p.status === 'building').length
      }));

    } catch (err) {
      setError(err.message || 'Error cargando proyectos');
    } finally {
      setLoading(false);
    }
  }, [isConnected, projects.length]);

  // Crear nuevo proyecto
  const createProject = useCallback(async (projectData = {}) => {
    try {
      setLoading(true);
      setError(null);

      const newProject = {
        id: Date.now(),
        name: projectData.name || `Proyecto ${projects.length + 1}`,
        description: projectData.description || 'Nuevo proyecto creado',
        status: 'draft',
        agents_used: projectData.agents || [],
        created_at: new Date().toISOString(),
        last_deploy: null,
        url: null,
        template: projectData.template || 'Custom'
      };

      // En producción: await iopeerAPI.createProject(newProject);
      
      setProjects(prev => [...prev, newProject]);
      
      // Si es un template específico, iniciar proceso de construcción
      if (projectData.template) {
        setTimeout(() => {
          buildProjectFromTemplate(newProject.id, projectData.template);
        }, 1000);
      }

      return newProject;

    } catch (err) {
      setError(err.message || 'Error creando proyecto');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [projects.length]);

  // Construir proyecto desde template
  const buildProjectFromTemplate = useCallback(async (projectId, template) => {
    try {
      // Actualizar estado a "building"
      setProjects(prev => prev.map(p => 
        p.id === projectId 
          ? { ...p, status: 'building', agents_used: getAgentsForTemplate(template) }
          : p
      ));

      // Simular proceso de construcción
      await new Promise(resolve => setTimeout(resolve, 3000));

      // En producción: await iopeerAPI.buildProjectFromTemplate(projectId, template);

      // Actualizar a "ready"
      setProjects(prev => prev.map(p => 
        p.id === projectId 
          ? { ...p, status: 'ready' }
          : p
      ));

      return { success: true };

    } catch (err) {
      // Marcar como fallido
      setProjects(prev => prev.map(p => 
        p.id === projectId 
          ? { ...p, status: 'failed' }
          : p
      ));
      
      setError(`Error construyendo proyecto: ${err.message}`);
      throw err;
    }
  }, []);

  // Desplegar proyecto
  const deployProject = useCallback(async (projectId) => {
    try {
      setLoading(true);
      setError(null);

      // Actualizar estado a "deploying"
      setProjects(prev => prev.map(p => 
        p.id === projectId 
          ? { ...p, status: 'deploying' }
          : p
      ));

      // Simular deployment
      await new Promise(resolve => setTimeout(resolve, 2000));

      // En producción: const result = await iopeerAPI.deployProject(projectId);
      
      const mockUrl = `https://proyecto-${projectId}.iopeer.app`;
      
      // Actualizar con URL de deployment
      setProjects(prev => prev.map(p => 
        p.id === projectId 
          ? { 
              ...p, 
              status: 'deployed', 
              url: mockUrl,
              last_deploy: new Date().toISOString()
            }
          : p
      ));

      return { success: true, url: mockUrl };

    } catch (err) {
      setError(`Error desplegando proyecto: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener código del proyecto
  const getProjectCode = useCallback(async (projectId) => {
    try {
      setLoading(true);
      setError(null);

      // En producción: const code = await iopeerAPI.getProjectCode(projectId);
      
      // Mock para el MVP
      const project = projects.find(p => p.id === projectId);
      const mockCode = {
        frontend: `// Frontend code for ${project?.name}
import React from 'react';

const App = () => {
  return (
    <div>
      <h1>${project?.name}</h1>
      <p>${project?.description}</p>
    </div>
  );
};

export default App;`,
        backend: `# Backend code for ${project?.name}
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello from ${project?.name}"}`,
        package: `{
  "name": "${project?.name?.toLowerCase().replace(/\s+/g, '-')}",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.0.0",
    "fastapi": "^0.104.0"
  }
}`
      };

      // Crear ZIP y descarga
      const blob = new Blob([JSON.stringify(mockCode, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project?.name?.replace(/\s+/g, '_')}_code.json`;
      a.click();

      return mockCode;

    } catch (err) {
      setError(`Error obteniendo código: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [projects]);

  // Eliminar proyecto
  const deleteProject = useCallback(async (projectId) => {
    try {
      setLoading(true);
      setError(null);

      // En producción: await iopeerAPI.deleteProject(projectId);
      
      setProjects(prev => prev.filter(p => p.id !== projectId));

      return { success: true };

    } catch (err) {
      setError(`Error eliminando proyecto: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualizar proyecto
  const updateProject = useCallback(async (projectId, updates) => {
    try {
      setLoading(true);
      setError(null);

      // En producción: await iopeerAPI.updateProject(projectId, updates);
      
      setProjects(prev => prev.map(p => 
        p.id === projectId 
          ? { ...p, ...updates }
          : p
      ));

      return { success: true };

    } catch (err) {
      setError(`Error actualizando proyecto: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Refrescar proyectos
  const refreshProjects = useCallback(() => {
    loadProjects();
  }, [loadProjects]);

  // Obtener agentes para template
  const getAgentsForTemplate = useCallback((template) => {
    const templateAgents = {
      'E-commerce Store': ['UI Generator', 'Backend Agent', 'Payment Agent', 'SEO Agent'],
      'Blog/Portfolio': ['UI Generator', 'Content Agent', 'SEO Agent'],
      'SaaS MVP': ['UI Generator', 'Backend Agent', 'Auth Agent', 'Analytics'],
      'Mobile App': ['Mobile UI Agent', 'Backend Agent', 'Push Notifications']
    };

    return templateAgents[template] || ['UI Generator'];
  }, []);

  // Obtener proyectos por estado
  const getProjectsByStatus = useCallback((status) => {
    return projects.filter(project => project.status === status);
  }, [projects]);

  // Obtener estadísticas
  const getProjectStats = useCallback(() => {
    return {
      total: projects.length,
      deployed: projects.filter(p => p.status === 'deployed').length,
      building: projects.filter(p => p.status === 'building').length,
      ready: projects.filter(p => p.status === 'ready').length,
      draft: projects.filter(p => p.status === 'draft').length,
      byTemplate: projects.reduce((acc, p) => {
        acc[p.template] = (acc[p.template] || 0) + 1;
        return acc;
      }, {}),
      mostUsedAgents: projects.reduce((acc, p) => {
        p.agents_used.forEach(agent => {
          acc[agent] = (acc[agent] || 0) + 1;
        });
        return acc;
      }, {})
    };
  }, [projects]);

  // Auto-cargar proyectos al conectar
  useEffect(() => {
    if (isConnected) {
      loadProjects();
    }
  }, [isConnected, loadProjects]);

  return {
    // Estado
    projects,
    appStats,
    loading,
    error,

    // Acciones principales
    createProject,
    deployProject,
    getProjectCode,
    updateProject,
    deleteProject,
    refreshProjects,

    // Utilidades
    getProjectsByStatus,
    getProjectStats,
    getAgentsForTemplate,
    buildProjectFromTemplate,

    // Estado computado
    hasProjects: projects.length > 0,
    deployedProjects: projects.filter(p => p.status === 'deployed'),
    buildingProjects: projects.filter(p => p.status === 'building'),
    readyProjects: projects.filter(p => p.status === 'ready'),

    // Helpers
    clearError: () => setError(null),
    isProjectDeployed: (projectId) => {
      const project = projects.find(p => p.id === projectId);
      return project?.status === 'deployed';
    },
    getProjectById: (projectId) => projects.find(p => p.id === projectId)
  };
};