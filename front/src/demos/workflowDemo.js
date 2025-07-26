// front/src/demos/workflowDemo.js
// Simple workflow demo runner and UI manager
import { iopeerAPI } from '../services/iopeerAPI';

// Demo step constants
export const DEMO_STARTUP_COMPLETE = 'startup_complete';
export const DEMO_AGENTS_LOADED = 'agents_loaded';
export const DEMO_WORKFLOW_FINISHED = 'workflow_finished';

// Basic UI manager that shows demo status on screen
export class DemoUIManager {
  constructor() {
    this.container = null;
    this.steps = {};
  }

  init() {
    if (this.container) return;
    this.container = document.createElement('div');
    this.container.id = 'workflow-demo';
    this.container.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/60';

    const box = document.createElement('div');
    box.className = 'bg-white rounded-lg shadow-xl p-6 space-y-4 max-w-sm text-center';
    this.list = document.createElement('ul');
    box.appendChild(this.list);
    this.container.appendChild(box);
    document.body.appendChild(this.container);
  }

  update(step, message) {
    if (!this.container) this.init();
    let item = this.steps[step];
    if (!item) {
      item = document.createElement('li');
      item.className = 'text-gray-700 flex items-center gap-2';
      item.textContent = message;
      this.list.appendChild(item);
      this.steps[step] = item;
    } else {
      item.textContent = message;
    }
  }

  error(message) {
    this.update('error', `❌ ${message}`);
  }

  complete() {
    this.update(DEMO_WORKFLOW_FINISHED, '✅ Demo completada');
    setTimeout(() => {
      if (this.container) {
        document.body.removeChild(this.container);
        this.container = null;
      }
    }, 2000);
  }
}

// Runner that performs simple workflow calls
export class WorkflowDemoRunner {
  constructor(api = iopeerAPI, uiManager = new DemoUIManager(), workflow = 'api_development') {
    this.api = api;
    this.ui = uiManager;
    this.workflow = workflow;
  }

  async start() {
    this.ui.init();
    try {
      this.ui.update(DEMO_STARTUP_COMPLETE, '⏳ Verificando backend...');
      await this.api.getHealth();
      this.ui.update(DEMO_STARTUP_COMPLETE, '✅ Backend conectado');

      this.ui.update(DEMO_AGENTS_LOADED, '⏳ Cargando agentes...');
      const agents = await this.api.getAgents();
      this.ui.update(DEMO_AGENTS_LOADED, `✅ ${agents.agents?.length || 0} agentes listos`);

      this.ui.update('workflow', '⏳ Ejecutando workflow de ejemplo...');
      await this.api.startWorkflow(this.workflow, { demo: true });
      this.ui.update('workflow', '✅ Workflow finalizado');

      this.ui.complete();
    } catch (err) {
      console.error('Demo error:', err);
      this.ui.error(err.message);
    }
  }
}

// Helper to start demo easily
export const startWorkflowDemo = () => {
  const runner = new WorkflowDemoRunner();
  runner.start();
  return runner;
};

export default startWorkflowDemo;
