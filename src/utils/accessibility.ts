/**
 * Accessibility Utilities
 * Hjelpefunksjoner for å forbedre tilgjengelighet
 */

import { Platform } from 'react-native';

/**
 * Legg til ARIA labels til React Native komponenter for web
 */
export const getAriaProps = (label?: string, role?: string, describedBy?: string): Record<string, string | undefined> => {
  if (Platform.OS !== 'web') {
    return {};
  }

  const props: Record<string, string | undefined> = {};
  
  if (label) {
    props['aria-label'] = label;
  }
  
  if (role) {
    // For web, role kan være string, men React Native krever spesifikk type
    // Vi returnerer som string og la React Native håndtere det
    (props as any).role = role;
  }
  
  if (describedBy) {
    props['aria-describedby'] = describedBy;
  }

  return props;
};

/**
 * Legg til keyboard navigation props
 */
export const getKeyboardProps = (
  onPress: () => void,
  disabled?: boolean
) => {
  if (Platform.OS !== 'web') {
    return {};
  }

  return {
    onKeyPress: (e: any) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!disabled) {
          onPress();
        }
      }
    },
    tabIndex: disabled ? -1 : 0,
    role: 'button',
  };
};

/**
 * Fokus management
 */
export const focusElement = (elementId: string) => {
  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    const element = document.getElementById(elementId);
    if (element) {
      (element as HTMLElement).focus();
    }
  }
};

/**
 * Announce to screen readers
 */
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }
};

/**
 * Skip to main content link (for screen readers)
 */
export const createSkipLink = () => {
  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Hopp til hovedinnhold';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 0;
      background: #000;
      color: #fff;
      padding: 8px;
      text-decoration: none;
      z-index: 100;
    `;
    
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '0';
    });
    
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
  }
};

