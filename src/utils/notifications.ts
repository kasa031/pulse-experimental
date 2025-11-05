/**
 * Notification utility - Sentralisert håndtering av notifikasjoner og feedback
 */

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number;
  action?: {
    label: string;
    onPress: () => void;
  };
}

// Singleton pattern for global notification state
class NotificationManager {
  private listeners: Set<(notification: Notification | null) => void> = new Set();
  private currentNotification: Notification | null = null;

  subscribe(listener: (notification: Notification | null) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(notification: Notification | null) {
    this.currentNotification = notification;
    this.listeners.forEach(listener => listener(notification));
  }

  show(message: string, type: NotificationType = 'info', duration: number = 3000, action?: { label: string; onPress: () => void }) {
    const notification: Notification = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      message,
      type,
      duration,
      action,
    };
    this.notify(notification);
  }

  showSuccess(message: string, duration: number = 3000) {
    this.show(message, 'success', duration);
  }

  showError(message: string, duration: number = 5000) {
    this.show(message, 'error', duration);
  }

  showInfo(message: string, duration: number = 3000) {
    this.show(message, 'info', duration);
  }

  showWarning(message: string, duration: number = 4000) {
    this.show(message, 'warning', duration);
  }

  dismiss() {
    this.notify(null);
  }

  getCurrent(): Notification | null {
    return this.currentNotification;
  }
}

export const notificationManager = new NotificationManager();

// Note: useNotification hook kan brukes i React-komponenter
// Eksempel: const { showSuccess, showError } = useNotification();
