/**
 * Analytics og Error Tracking for Web
 * Enkel implementasjon for å spore brukeratferd og feil
 */

import { Platform } from 'react-native';
import { safeLog, safeError } from './performance';

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp?: number;
}

export interface ErrorEvent {
  message: string;
  stack?: string;
  componentStack?: string;
  userAgent?: string;
  url?: string;
  timestamp?: number;
}

class Analytics {
  private events: AnalyticsEvent[] = [];
  private errors: ErrorEvent[] = [];
  private maxEvents = 100;
  private maxErrors = 50;
  private enabled = true;

  /**
   * Logg en analytics event
   */
  track(eventName: string, properties?: Record<string, any>) {
    if (!this.enabled || Platform.OS !== 'web') {
      return;
    }

    const event: AnalyticsEvent = {
      name: eventName,
      properties: {
        ...properties,
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        timestamp: Date.now(),
      },
      timestamp: Date.now(),
    };

    this.events.push(event);

    // Begrens antall events
    if (this.events.length > this.maxEvents) {
      this.events.shift();
    }

    // Log til console i development
    if (process.env.NODE_ENV === 'development') {
      safeLog('[Analytics]', eventName, properties);
    }

    // Her kan du legge til integrasjon med Google Analytics, Mixpanel, etc.
    // For eksempel: gtag('event', eventName, properties);
  }

  /**
   * Logg en feil
   */
  trackError(error: Error | string, componentStack?: string) {
    if (!this.enabled || Platform.OS !== 'web') {
      return;
    }

    const errorEvent: ErrorEvent = {
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'object' && error.stack ? error.stack : undefined,
      componentStack,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      timestamp: Date.now(),
    };

    this.errors.push(errorEvent);

    // Begrens antall errors
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // Log til console
    safeError('[Error Tracking]', errorEvent);

    // Her kan du legge til integrasjon med Sentry, LogRocket, etc.
    // For eksempel: Sentry.captureException(error);
  }

  /**
   * Track page view
   */
  trackPageView(pageName: string, properties?: Record<string, any>) {
    this.track('page_view', {
      page: pageName,
      ...properties,
    });
  }

  /**
   * Track navigation
   */
  trackNavigation(from: string, to: string) {
    this.track('navigation', {
      from,
      to,
    });
  }

  /**
   * Track button click
   */
  trackButtonClick(buttonName: string, location?: string) {
    this.track('button_click', {
      button: buttonName,
      location,
    });
  }

  /**
   * Track poll interaction
   */
  trackPollInteraction(action: string, pollId: string, pollTitle?: string) {
    this.track('poll_interaction', {
      action, // 'view', 'vote', 'share', etc.
      pollId,
      pollTitle,
    });
  }

  /**
   * Hent alle events (for debugging)
   */
  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  /**
   * Hent alle errors (for debugging)
   */
  getErrors(): ErrorEvent[] {
    return [...this.errors];
  }

  /**
   * Tøm events og errors
   */
  clear() {
    this.events = [];
    this.errors = [];
  }

  /**
   * Aktiver/deaktiver analytics
   */
  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  /**
   * Eksporter data (for sending til backend)
   */
  exportData() {
    return {
      events: this.events,
      errors: this.errors,
      exportedAt: Date.now(),
    };
  }
}

// Singleton instance
export const analytics = new Analytics();

// Auto-track unhandled errors
if (Platform.OS === 'web' && typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    analytics.trackError(event.error || event.message);
  });

  window.addEventListener('unhandledrejection', (event) => {
    analytics.trackError(
      event.reason instanceof Error ? event.reason : new Error(String(event.reason))
    );
  });
}

