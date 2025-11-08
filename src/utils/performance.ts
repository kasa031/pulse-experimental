/**
 * Performance utilities
 * Fjerner console.log i produksjon og tilbyr debugging verktøy
 */

const isDevelopment = __DEV__;

/**
 * Safe console.log - kun i development
 */
export const safeLog = (...args: unknown[]) => {
  if (isDevelopment) {
    console.log(...args);
  }
};

/**
 * Safe console.error - alltid logg errors
 */
export const safeError = (...args: unknown[]) => {
  console.error(...args);
  // Her kan du legge til error reporting (Sentry, etc.)
};

/**
 * Safe console.warn - kun i development
 */
export const safeWarn = (...args: unknown[]) => {
  if (isDevelopment) {
    console.warn(...args);
  }
};

/**
 * Memoize funksjon for performance
 */
export const memoize = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  keyGenerator?: (...args: Parameters<T>) => string
): T => {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>) => {
    const key = keyGenerator 
      ? keyGenerator(...args)
      : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args) as ReturnType<T>;
    cache.set(key, result);
    return result;
  }) as T;
};

