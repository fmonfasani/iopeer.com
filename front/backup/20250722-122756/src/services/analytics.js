/**
 * Iopeer Analytics Service - Enterprise
 */
import config from '../config/enterprise';

class IopeerAnalyticsService {
  constructor() {
    this.enabled = config.features.analytics;
    this.events = [];
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.pageViews = new Map();
    this.userActions = new Map();
    this.performanceMetrics = new Map();

    if (this.enabled) {
      this.startSession();
    }
  }

  generateSessionId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  startSession() {
    this.track('session_start', {
      sessionId: this.sessionId,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      referrer: document.referrer,
      timestamp: this.startTime
    });
  }

  track(event, properties = {}) {
    if (!this.enabled) return;

    const eventData = {
      event,
      properties: {
        ...properties,
        sessionId: this.sessionId,
        timestamp: Date.now(),
        url: window.location.href,
        pathname: window.location.pathname,
        sessionDuration: Date.now() - this.startTime
      }
    };

    this.events.push(eventData);

    // Keep only last 1000 events in memory
    if (this.events.length > 1000) {
      this.events.splice(0, 500);
    }

    // Send to analytics service
    this.sendToAnalytics(eventData);

    return eventData;
  }

  trackPageView(page, additionalProps = {}) {
    const count = this.pageViews.get(page) || 0;
    this.pageViews.set(page, count + 1);

    return this.track('page_view', {
      page,
      viewCount: count + 1,
      ...additionalProps
    });
  }

  trackUserAction(action, context = {}) {
    const count = this.userActions.get(action) || 0;
    this.userActions.set(action, count + 1);

    return this.track('user_action', {
      action,
      context,
      actionCount: count + 1
    });
  }

  getAnalytics() {
    return {
      sessionId: this.sessionId,
      sessionDuration: Date.now() - this.startTime,
      totalEvents: this.events.length,
      pageViews: Object.fromEntries(this.pageViews),
      userActions: Object.fromEntries(this.userActions)
    };
  }

  async sendToAnalytics(eventData) {
    if (!config.endpoints.analytics) return;

    try {
      await fetch(config.endpoints.analytics, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
      });
    } catch (error) {
      if (config.app.environment === 'development') {
        console.log('📊 Analytics Event (mock):', eventData);
      }
    }
  }
}

// Export singleton instance
export const analyticsService = new IopeerAnalyticsService();
export default IopeerAnalyticsService;
