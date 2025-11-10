/**
 * Keyboard Shortcuts Hook for Web
 * Håndterer keyboard shortcuts for web-applikasjonen
 */

import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types';

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  action: () => void;
  description: string;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[]) => {
  const navigation = useNavigation<any>();

  useEffect(() => {
    if (Platform.OS !== 'web') {
      return; // Kun for web
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignorer hvis brukeren skriver i et input-felt
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // Sjekk hver shortcut
      for (const shortcut of shortcuts) {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrlKey ? event.ctrlKey : !event.ctrlKey;
        const shiftMatch = shortcut.shiftKey ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.altKey ? event.altKey : !event.altKey;
        const metaMatch = shortcut.metaKey ? event.metaKey : !event.metaKey;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch) {
          event.preventDefault();
          shortcut.action();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);
};

/**
 * Standard keyboard shortcuts for OsloPuls
 */
export const useAppKeyboardShortcuts = () => {
  const navigation = useNavigation();

  const shortcuts: KeyboardShortcut[] = [
    {
      key: '1',
      ctrlKey: true,
      action: () => {
        if (navigation && 'navigate' in navigation) {
          (navigation as any).navigate('Hjem' as keyof RootStackParamList);
        }
      },
      description: 'Gå til Hjem',
    },
    {
      key: '2',
      ctrlKey: true,
      action: () => {
        if (navigation && 'navigate' in navigation) {
          (navigation as any).navigate('Stem' as keyof RootStackParamList);
        }
      },
      description: 'Gå til Stem',
    },
    {
      key: '3',
      ctrlKey: true,
      action: () => {
        if (navigation && 'navigate' in navigation) {
          (navigation as any).navigate('Fellesskap' as keyof RootStackParamList);
        }
      },
      description: 'Gå til Fellesskap',
    },
    {
      key: '4',
      ctrlKey: true,
      action: () => {
        if (navigation && 'navigate' in navigation) {
          (navigation as any).navigate('Nyheter' as keyof RootStackParamList);
        }
      },
      description: 'Gå til Nyheter',
    },
    {
      key: '5',
      ctrlKey: true,
      action: () => {
        if (navigation && 'navigate' in navigation) {
          (navigation as any).navigate('Oslo' as keyof RootStackParamList);
        }
      },
      description: 'Gå til Oslo',
    },
    {
      key: '6',
      ctrlKey: true,
      action: () => {
        if (navigation && 'navigate' in navigation) {
          (navigation as any).navigate('Profil' as keyof RootStackParamList);
        }
      },
      description: 'Gå til Profil',
    },
    {
      key: 'k',
      ctrlKey: true,
      action: () => {
        if (navigation && 'navigate' in navigation) {
          (navigation as any).navigate('Kontakt' as keyof RootStackParamList);
        }
      },
      description: 'Gå til Kontakt',
    },
    {
      key: 'n',
      ctrlKey: true,
      shiftKey: true,
      action: () => {
        if (navigation && 'navigate' in navigation) {
          (navigation as any).navigate('Opprett' as keyof RootStackParamList);
        }
      },
      description: 'Opprett ny avstemning',
    },
    {
      key: '/',
      action: () => {
        // Fokus på søkefelt hvis det finnes
        const searchInput = document.querySelector('input[type="search"], input[placeholder*="Søk"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      },
      description: 'Fokus på søk',
    },
    {
      key: 'Escape',
      action: () => {
        // Lukk modaler eller drawer
        const modal = document.querySelector('[role="dialog"]');
        if (modal) {
          const closeButton = modal.querySelector('button[aria-label*="Lukk"], button[aria-label*="Close"]') as HTMLButtonElement;
          if (closeButton) {
            closeButton.click();
          }
        }
      },
      description: 'Lukk modal/drawer',
    },
  ];

  useKeyboardShortcuts(shortcuts);

  return shortcuts;
};

