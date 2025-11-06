/**
 * Responsive Design Hook
 * Utility hook for handling responsive design across different screen sizes
 */

import { useWindowDimensions, Platform } from 'react-native';

export interface ResponsiveBreakpoints {
  isMobile: boolean;      // < 480px
  isTablet: boolean;      // 480px - 1024px
  isDesktop: boolean;    // > 1024px
  isSmallMobile: boolean; // < 360px
  width: number;
  height: number;
}

/**
 * Hook for responsive design
 * Returns breakpoint information based on screen width
 */
export const useResponsive = (): ResponsiveBreakpoints => {
  const { width, height } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  
  return {
    isMobile: width < 768,
    isTablet: width >= 768 && width <= 1024,
    isDesktop: isWeb && width > 1024,
    isSmallMobile: width < 360,
    width,
    height,
  };
};

/**
 * Get responsive padding based on screen size
 */
export const getResponsivePadding = (width: number): number => {
  if (width < 360) return 12;  // Small mobile
  if (width < 480) return 16;  // Mobile
  if (width < 768) return 20;  // Small tablet
  if (width < 1024) return 24; // Tablet
  return 32;                    // Desktop
};

/**
 * Get responsive margin based on screen size
 */
export const getResponsiveMargin = (width: number): number => {
  if (width < 360) return 8;   // Small mobile
  if (width < 480) return 12;  // Mobile
  if (width < 768) return 16;  // Small tablet
  if (width < 1024) return 20; // Tablet
  return 24;                    // Desktop
};

/**
 * Get responsive font size multiplier
 */
export const getResponsiveFontSize = (width: number): number => {
  if (width < 360) return 0.9;  // Small mobile - slightly smaller
  if (width < 480) return 1.0;  // Mobile - normal
  if (width < 768) return 1.05; // Small tablet
  if (width < 1024) return 1.1; // Tablet
  return 1.15;                   // Desktop
};

