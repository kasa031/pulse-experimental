/**
 * Date Helper Utilities
 * Consistent handling of Firestore Timestamp and Date objects
 */

import { Timestamp } from 'firebase/firestore';

/**
 * Convert Firestore Timestamp or Date to Date object
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
      
      // Firestore Timestamp with toMillis
      if ('toMillis' in date && typeof date.toMillis === 'function') {
        return new Date(date.toMillis());
      }
      
      // Timestamp object with seconds and nanoseconds
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
 * Convert to timestamp (milliseconds)
 */
export const toTimestamp = (date: Date | Timestamp | any): number => {
  const dateObj = toDate(date);
  if (!dateObj) return 0;
  return dateObj.getTime();
};

/**
 * Check if date is valid
 */
export const isValidDate = (date: Date | Timestamp | any): boolean => {
  const dateObj = toDate(date);
  return dateObj !== null && !isNaN(dateObj.getTime());
};

/**
 * Format date to Norwegian format
 */
export const formatDateNorwegian = (date: Date | Timestamp | any): string => {
  const dateObj = toDate(date);
  if (!dateObj) return 'Unknown date';
  
  try {
    return dateObj.toLocaleDateString('nb-NO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return 'Unknown date';
  }
};

/**
 * Format date to relative time (e.g. "2 hours ago")
 */
export const formatRelativeTime = (date: Date | Timestamp | any): string => {
  const dateObj = toDate(date);
  if (!dateObj) return 'Unknown date';
  
  try {
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    if (diffWeeks < 4) return `${diffWeeks} ${diffWeeks === 1 ? 'week' : 'weeks'} ago`;
    if (diffMonths < 12) return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
    
    return formatDateNorwegian(dateObj);
  } catch {
    return 'Unknown date';
  }
};

