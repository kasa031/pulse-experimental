/**
 * Image Optimization Utilities for Web
 * Hjelpefunksjoner for bildoptimalisering
 */

import { Platform } from 'react-native';

/**
 * Sjekk om nettleseren støtter WebP
 */
export const supportsWebP = (): boolean => {
  if (Platform.OS !== 'web' || typeof document === 'undefined') {
    return false;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
};

/**
 * Get optimal image format based on browser support
 */
export const getOptimalImageFormat = (): 'webp' | 'jpg' | 'png' => {
  if (Platform.OS === 'web' && supportsWebP()) {
    return 'webp';
  }
  return 'jpg';
};

/**
 * Lazy load image component props for web
 */
export const getLazyImageProps = () => {
  if (Platform.OS !== 'web') {
    return {};
  }

  return {
    loading: 'lazy' as const,
    decoding: 'async' as const,
  };
};

/**
 * Get responsive image sizes
 */
export const getResponsiveImageSizes = (width: number): string => {
  if (width < 480) {
    return '100vw'; // Full width on mobile
  } else if (width < 768) {
    return '50vw'; // Half width on tablet
  } else {
    return '33vw'; // Third width on desktop
  }
};

/**
 * Generate srcset for responsive images
 */
export const generateSrcSet = (
  baseUrl: string,
  sizes: number[] = [320, 640, 960, 1280, 1920]
): string => {
  return sizes
    .map((size) => `${baseUrl}?w=${size} ${size}w`)
    .join(', ');
};

