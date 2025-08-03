// frontend/src/services/notification.service.js

class NotificationService {
  constructor() {
    this.notifications = [];
    this.listeners = [];
  }

  // Add notification
  add(notification) {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: 'info', // default type
      title: 'Notification',
      message: '',
      duration: 5000, // 5 seconds default
      timestamp: new Date().toISOString(),
      ...notification
    };

    this.notifications.unshift(newNotification);
    this.notifyListeners();

    // Auto remove after duration
    if (newNotification.duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, newNotification.duration);
    }

    return id;
  }

  // Remove notification
  remove(id) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notifyListeners();
  }

  // Clear all notifications
  clear() {
    this.notifications = [];
    this.notifyListeners();
  }

  // Get all notifications
  getAll() {
    return [...this.notifications];
  }

  // Subscribe to notifications
  subscribe(callback) {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Notify all listeners
  notifyListeners() {
    this.listeners.forEach(callback => {
      callback(this.notifications);
    });
  }

  // Convenience methods
  success(message, title = 'Success') {
    return this.add({
      type: 'success',
      title,
      message,
      duration: 3000
    });
  }

  error(message, title = 'Error') {
    return this.add({
      type: 'error',
      title,
      message,
      duration: 7000
    });
  }

  warning(message, title = 'Warning') {
    return this.add({
      type: 'warning',
      title,
      message,
      duration: 5000
    });
  }

  info(message, title = 'Info') {
    return this.add({
      type: 'info',
      title,
      message,
      duration: 4000
    });
  }

  // Agent-specific notifications
  agentStarted(agentName) {
    return this.info(`${agentName} started working`, 'Agent Started');
  }

  agentCompleted(agentName, result) {
    return this.success(`${agentName} completed successfully`, 'Agent Completed');
  }

  agentFailed(agentName, error) {
    return this.error(`${agentName} failed: ${error}`, 'Agent Failed');
  }

  workflowStarted(workflowName) {
    return this.info(`Workflow "${workflowName}" started`, 'Workflow Started');
  }

  workflowCompleted(workflowName) {
    return this.success(`Workflow "${workflowName}" completed`, 'Workflow Completed');
  }

  workflowFailed(workflowName, error) {
    return this.error(`Workflow "${workflowName}" failed: ${error}`, 'Workflow Failed');
  }
}

// Create singleton instance
const notificationService = new NotificationService();

// Export both named and default
export { notificationService };
export default notificationService;
