/**
 * Date Helper Utilities
 * Konsistent håndtering av Firestore Timestamp og Date objekter
 */

import { Timestamp } from 'firebase/firestore';

/**
 * Konverter Firestore Timestamp eller Date til Date objekt
 */
export const toDate = (date: Date | Timestamp | any): Date | null => {
  try {
    if (!date) return null;
    
    if (date instanceof Date) {
      return date;
    }
    
    if (typeof date === 'object') {
      // Firestore Timestamp
      if ('toDate' in date && typeof date.toDate === 'function') {
        return date.toDate();
      }
      
      // Firestore Timestamp med toMillis
      if ('toMillis' in date && typeof date.toMillis === 'function') {
        return new Date(date.toMillis());
      }
      
      // Timestamp object med seconds og nanoseconds
      if ('seconds' in date && typeof date.seconds === 'number') {
        return new Date(date.seconds * 1000);
      }
    }
    
    // String date
    if (typeof date === 'string') {
      const parsed = new Date(date);
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
    }
    
    return null;
  } catch {
    return null;
  }
};

/**
 * Konverter til timestamp (milliseconds)
 */
export const toTimestamp = (date: Date | Timestamp | any): number => {
  const dateObj = toDate(date);
  if (!dateObj) return 0;
  return dateObj.getTime();
};

/**
 * Sjekk om dato er gyldig
 */
export const isValidDate = (date: Date | Timestamp | any): boolean => {
  const dateObj = toDate(date);
  return dateObj !== null && !isNaN(dateObj.getTime());
};

/**
 * Formater dato til norsk format
 */
export const formatDateNorwegian = (date: Date | Timestamp | any): string => {
  const dateObj = toDate(date);
  if (!dateObj) return 'Ukjent dato';
  
  try {
    return dateObj.toLocaleDateString('nb-NO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return 'Ukjent dato';
  }
};

/**
 * Formater dato til relativ tid (f.eks. "2 timer siden")
 */
export const formatRelativeTime = (date: Date | Timestamp | any): string => {
  const dateObj = toDate(date);
  if (!dateObj) return 'Ukjent dato';
  
  try {
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    
    if (diffMins < 1) return 'Nettopp';
    if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minutt' : 'minutter'} siden`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'time' : 'timer'} siden`;
    if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'dag' : 'dager'} siden`;
    if (diffWeeks < 4) return `${diffWeeks} ${diffWeeks === 1 ? 'uke' : 'uker'} siden`;
    if (diffMonths < 12) return `${diffMonths} ${diffMonths === 1 ? 'måned' : 'måneder'} siden`;
    
    return formatDateNorwegian(dateObj);
  } catch {
    return 'Ukjent dato';
  }
};

