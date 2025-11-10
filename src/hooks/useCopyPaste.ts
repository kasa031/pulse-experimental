/**
 * Copy/Paste Hook for Web
 * Håndterer copy/paste funksjonalitet for web
 */

import { useEffect, useCallback } from 'react';
import { Platform, Clipboard } from 'react-native';
import { safeError } from '../utils/performance';

export interface CopyPasteOptions {
  onCopy?: (text: string) => void;
  onPaste?: (text: string) => void;
  enabled?: boolean;
}

export const useCopyPaste = (options: CopyPasteOptions = {}) => {
  const { onCopy, onPaste, enabled = true } = options;

  useEffect(() => {
    if (Platform.OS !== 'web' || !enabled) {
      return;
    }

    const handleCopy = async (event: ClipboardEvent) => {
      if (onCopy && event.clipboardData) {
        const text = event.clipboardData.getData('text/plain');
        if (text) {
          onCopy(text);
        }
      }
    };

    const handlePaste = async (event: ClipboardEvent) => {
      if (onPaste && event.clipboardData) {
        const text = event.clipboardData.getData('text/plain');
        if (text) {
          onPaste(text);
        }
      }
    };

    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);

    return () => {
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
    };
  }, [onCopy, onPaste, enabled]);

  const copyToClipboard = useCallback(async (text: string) => {
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (error) {
        safeError('Failed to copy to clipboard:', error);
        return false;
      }
    } else {
      // React Native - Clipboard API is synchronous
      try {
        Clipboard.setString(text);
        return true;
      } catch (error) {
        safeError('Failed to copy to clipboard:', error);
        return false;
      }
    }
  }, []);

  const pasteFromClipboard = useCallback(async (): Promise<string | null> => {
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        const text = await navigator.clipboard.readText();
        return text;
      } catch (error) {
        safeError('Failed to paste from clipboard:', error);
        return null;
      }
    } else {
      // React Native - Clipboard API is synchronous
      try {
        const text = Clipboard.getString();
        return text;
      } catch (error) {
        safeError('Failed to paste from clipboard:', error);
        return null;
      }
    }
  }, []);

  return {
    copyToClipboard,
    pasteFromClipboard,
  };
};

