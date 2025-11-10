/**
 * Drag & Drop Hook for Web
 * Håndterer drag and drop funksjonalitet for web
 */

import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';

export interface DragDropOptions {
  onDragStart?: (event: DragEvent) => void;
  onDragOver?: (event: DragEvent) => void;
  onDragEnd?: (event: DragEvent) => void;
  onDrop?: (event: DragEvent) => void;
  enabled?: boolean;
  // accept?: string[]; // MIME types or file extensions - not currently used
}

export const useDragDrop = (options: DragDropOptions = {}) => {
  const {
    onDragStart,
    onDragOver,
    onDragEnd,
    onDrop,
    enabled = true,
    // accept = [], // Not currently used
  } = options;

  const [isDragging, setIsDragging] = useState(false);
  const [isOver, setIsOver] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'web' || !enabled) {
      return;
    }

    const handleDragStart = (event: DragEvent) => {
      setIsDragging(true);
      if (onDragStart) {
        onDragStart(event);
      }
    };

    const handleDragOver = (event: DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setIsOver(true);
      if (onDragOver) {
        onDragOver(event);
      }
    };

    const handleDragEnd = (event: DragEvent) => {
      setIsDragging(false);
      setIsOver(false);
      if (onDragEnd) {
        onDragEnd(event);
      }
    };

    const handleDrop = (event: DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(false);
      setIsOver(false);
      if (onDrop) {
        onDrop(event);
      }
    };

    const element = document.body;
    element.addEventListener('dragstart', handleDragStart);
    element.addEventListener('dragover', handleDragOver);
    element.addEventListener('dragend', handleDragEnd);
    element.addEventListener('drop', handleDrop);

    return () => {
      element.removeEventListener('dragstart', handleDragStart);
      element.removeEventListener('dragover', handleDragOver);
      element.removeEventListener('dragend', handleDragEnd);
      element.removeEventListener('drop', handleDrop);
    };
  }, [onDragStart, onDragOver, onDragEnd, onDrop, enabled]);

  const setDragData = useCallback((data: string, type: string = 'text/plain') => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const event = new Event('dragstart') as any;
      event.dataTransfer = {
        setData: (format: string, value: string) => {
          // Store data for later retrieval
          (window as any).__dragData = { format, value };
        },
        getData: (format: string) => {
          return (window as any).__dragData?.value || '';
        },
      };
      event.dataTransfer.setData(type, data);
    }
  }, []);

  const getDropData = useCallback((event: DragEvent): string | null => {
    if (Platform.OS === 'web' && event.dataTransfer) {
      return event.dataTransfer.getData('text/plain');
    }
    return null;
  }, []);

  const getDropFiles = useCallback((event: DragEvent): File[] => {
    if (Platform.OS === 'web' && event.dataTransfer) {
      return Array.from(event.dataTransfer.files);
    }
    return [];
  }, []);

  return {
    isDragging,
    isOver,
    setDragData,
    getDropData,
    getDropFiles,
  };
};

