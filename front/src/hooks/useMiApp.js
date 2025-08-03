// front/src/hooks/useMiApp.js - VERSIÓN MEJORADA
import { useState, useEffect, useCallback } from 'react';
import { useIopeer } from './useIopeer';
import { miAppNotifications } from '../services/miAppNotifications';
import { miAppAPI } from '../services/miAppAPI';

export const useMiApp = () => {
  const { isConnected } = useIopeer();

  // Estado principal
  const [projects, setProjects] = useState([]);
  const [appStats, setAppStats] = useState({
    total_projects: 0,
    active_projects: 0,
    total_deployments: 0,
    total_agents_used: 0,
    success_rate: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estado de operaciones en progreso
  const [operationsInProgress, setOperationsInProgress] = useState({
    creating: new Set(),
    building: new Set(),
    deploying: new Set(),
    deleting: new Set()
  });

  // Templates disponibles
  const [templates] = useState(miAppAPI.getTemplates());

  // Cargar proyectos del usuario
  const loadProjects = useCallback(async () => {
    if (!isConnected) return;

    try {
      setLoading(true);
      setError(null);

      // En producción: await miAppAPI.getUserProjects();
      // Simular carga
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock data inicial si no hay proyectos
      if (projects.length === 0) {
        const mockProjects = [
          {
            id: 1,
            name: "Mi E-commerce",
            description: "Tienda online de productos artesanales",
            status: "deployed",
            agents_used: ["UI Generator", "Backend Agent", "Payment Agent"],
            created_at: "2025-01-15T10:00:00Z",
            last_deploy: "2025-01-20T14:30:00Z",
            url: "https://mi-tienda-demo.iopeer.app",
            template: "E-commerce Store"
          },
          {
            id: 2,
            name: "Blog Personal",
            description: "Mi blog de tecnología y desarrollo",
            status: "ready",
            agents_used: ["UI Generator", "Content Agent", "SEO Agent"],
            created_at: "2025-01-18T09:15:00Z",
            last_deploy: null,
            url: null,
            template: "Blog/Portfolio"
          }
        ];
        setProjects(mockProjects);
      }

      // Cargar estadísticas
      const stats = await miAppAPI.getProjectStats();
      setAppStats(stats);

    } catch (err) {
      setError(err.message || 'Error cargando proyectos');
      miAppNotifications.genericError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isConnected, projects.length]);

  // Crear nuevo proyecto
  const createProject = useCallback(async (projectData = {}) => {
    try {
      setLoading(true);
      setError(null);

      const newProjectData = {
        name: projectData.name || `Proyecto ${projects.length + 1}`,
        description: projectData.description || 'Nuevo proyecto creado',
        template: projectData.template || null,
        ...projectData
      };

      // Mostrar notificación de creación
      miAppNotifications.projectCreated(newProjectData.name);

      // Marcar como creando
      setOperationsInProgress(prev => ({
        ...prev,
        creating: new Set([...prev.creating, newProjectData.name])
      }));

      // Crear proyecto
      const response = await miAppAPI.createProject(newProjectData);

      const newProject = response.project;
      setProjects(prev => [...prev, newProject]);

      // Limpiar estado de progreso
      setOperationsInProgress(prev => ({
        ...prev,
        creating: new Set([...prev.creating].filter(name => name !== newProjectData.name))
      }));

      // Si es un template específico, iniciar construcción automáticamente
      if (projectData.template) {
        miAppNotifications.templateUsed(projectData.template);
        setTimeout(() => {
          buildProjectFromTemplate(newProject.id, projectData.template);
        }, 1000);
      }

      return newProject;

    } catch (err) {
      setError(err.message || 'Error creando proyecto');
      miAppNotifications.projectBuildFailed(projectData.name || 'Proyecto', err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [projects.length]);

  // Construir proyecto desde template
  const buildProjectFromTemplate = useCallback(async (projectId, template) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    try {
      // Mostrar notificación de construcción
      miAppNotifications.projectBuilding(project.name);

      // Marcar como construyendo
      setOperationsInProgress(prev => ({
        ...prev,
        building: new Set([...prev.building, projectId])
      }));

      // Actualizar estado a "building"
      setProjects(prev => prev.map(p =>
        p.id === projectId
          ? { ...p, status: 'building' }
          : p
      ));

      // Simular construcción con progreso
      for (let progress = 0; progress <= 100; progress += 20) {
        miAppNotifications.progressNotification(
          `Construyendo ${project.name}`,
          progress
        );
        await new Promise(resolve => setTimeout(resolve, 600));
      }

      // Llamar API de construcción
      const buildResult = await miAppAPI.buildProject(projectId, template);

      // Actualizar proyecto con resultado
      setProjects(prev => prev.map(p =>
        p.id === projectId
          ? {
              ...p,
              status: buildResult.status,
              agents_used: buildResult.agents_used,
              build_time: buildResult.build_time
            }
          : p
      ));

      // Notificar éxito
      miAppNotifications.projectBuildComplete(project.name);

      return { success: true };

    } catch (err) {
      // Marcar como fallido
      setProjects(prev => prev.map(p =>
        p.id === projectId
          ? { ...p, status: 'failed' }
          : p
      ));

      miAppNotifications.projectBuildFailed(project.name, err.message);
      throw err;

    } finally {
      // Limpiar estado de progreso
      setOperationsInProgress(prev => ({
        ...prev,
        building: new Set([...prev.building].filter(id => id !== projectId))
      }));
    }
  }, [projects]);

  // Desplegar proyecto
  const deployProject = useCallback(async (projectId) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    try {
      setLoading(true);
      setError(null);

      // Mostrar notificación de deployment
      miAppNotifications.projectDeploying(project.name);

      // Marcar como desplegando
      setOperationsInProgress(prev => ({
        ...prev,
        deploying: new Set([...prev.deploying, projectId])
      }));

      // Actualizar estado a "deploying"
      setProjects(prev => prev.map(p =>
        p.id === projectId
          ? { ...p, status: 'deploying' }
          : p
      ));

      // Simular progreso de deployment
      for (let progress = 0; progress <= 100; progress += 25) {
        miAppNotifications.progressNotification(
          `Desplegando ${project.name}`,
          progress
        );
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Llamar API de deployment
      const deployResult = await miAppAPI.deployProject(projectId);

      // Actualizar con URL de deployment
      setProjects(prev => prev.map(p =>
        p.id === projectId
          ? {
              ...p,
              status: deployResult.status,
              url: deployResult.url,
              last_deploy: new Date().toISOString(),
              deployment_time: deployResult.deployment_time
            }
          : p
      ));

      // Notificar éxito con acción
      miAppNotifications.projectDeployed(project.name, deployResult.url);

      return { success: true, url: deployResult.url };

    } catch (err) {
      miAppNotifications.projectDeployFailed(project.name, err.message);
      setError(`Error desplegando proyecto: ${err.message}`);
      throw err;

    } finally {
      setLoading(false);
      setOperationsInProgress(prev => ({
        ...prev,
        deploying: new Set([...prev.deploying].filter(id => id !== projectId))
      }));
    }
  }, [projects]);

  // Obtener código del proyecto
  const getProjectCode = useCallback(async (projectId) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    try {
      setLoading(true);
      setError(null);

      const codeResult = await miAppAPI.getProjectCode(projectId);

      // Crear archivo ZIP y descargar
      const projectName = project.name.replace(/\s+/g, '_');
      const blob = new Blob([JSON.stringify(codeResult.code, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectName}_codigo.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Notificar descarga
      miAppNotifications.codeDownloaded(project.name);

      return codeResult;

    } catch (err) {
      setError(`Error obteniendo código: ${err.message}`);
      miAppNotifications.genericError(`Error obteniendo código: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [projects]);

  // Eliminar proyecto
  const deleteProject = useCallback(async (projectId) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    try {
      setLoading(true);
      setError(null);

      // Marcar como eliminando
      setOperationsInProgress(prev => ({
        ...prev,
        deleting: new Set([...prev.deleting, projectId])
      }));

      await miAppAPI.deleteProject(projectId);

      setProjects(prev => prev.filter(p => p.id !== projectId));

      miAppNotifications.projectDeleted(project.name);

      return { success: true };

    } catch (err) {
      setError(`Error eliminando proyecto: ${err.message}`);
      miAppNotifications.genericError(`Error eliminando proyecto: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
      setOperationsInProgress(prev => ({
        ...prev,
        deleting: new Set([...prev.deleting].filter(id => id !== projectId))
      }));
    }
  }, [projects]);

  // Actualizar proyecto
  const updateProject = useCallback(async (projectId, updates) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    try {
      setLoading(true);
      setError(null);

      await miAppAPI.updateProject(projectId, updates);

      setProjects(prev => prev.map(p =>
        p.id === projectId
          ? { ...p, ...updates }
          : p
      ));

      miAppNotifications.projectUpdated(project.name);

      return { success: true };

    } catch (err) {
      setError(`Error actualizando proyecto: ${err.message}`);
      miAppNotifications.genericError(`Error actualizando proyecto: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [projects]);

  // Funciones de utilidad
  const getProjectsByStatus = useCallback((status) => {
    return projects.filter(project => project.status === status);
  }, [projects]);

  const getProjectStats = useCallback(() => {
    return {
      total: projects.length,
      deployed: projects.filter(p => p.status === 'deployed').length,
      building: projects.filter(p => p.status === 'building').length,
      ready: projects.filter(p => p.status === 'ready').length,
      draft: projects.filter(p => p.status === 'draft').length,
      byTemplate: projects.reduce((acc, p) => {
        const template = p.template || 'Custom';
        acc[template] = (acc[template] || 0) + 1;
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

  const isProjectInProgress = useCallback((projectId, operation) => {
    return operationsInProgress[operation]?.has(projectId) || false;
  }, [operationsInProgress]);

  // Auto-cargar proyectos al conectar
  useEffect(() => {
    if (isConnected) {
      loadProjects();
    }
  }, [isConnected, loadProjects]);

  // Notificar cuando se conecta/desconecta
  useEffect(() => {
    if (isConnected) {
      miAppNotifications.backendConnected();
    } else {
      miAppNotifications.backendDisconnected();
    }
  }, [isConnected]);

  return {
    // Estado principal
    projects,
    templates,
    appStats,
    loading,
    error,
    operationsInProgress,

    // Acciones principales
    createProject,
    deployProject,
    getProjectCode,
    updateProject,
    deleteProject,
    buildProjectFromTemplate,
    loadProjects,

    // Utilidades
    getProjectsByStatus,
    getProjectStats,
    isProjectInProgress,

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
    getProjectById: (projectId) => projects.find(p => p.id === projectId),
    getTemplateById: (templateId) => templates.find(t => t.id === templateId),

    // Estado de conexión
    isConnected
  };
};
