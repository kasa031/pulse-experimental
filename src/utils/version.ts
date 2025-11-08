/**
 * Version utilities
 */

import Constants from 'expo-constants';

/**
 * Hent app-versjon
 */
export const getAppVersion = (): string => {
  return Constants.expoConfig?.version || '1.0.0';
};

/**
 * Hent app-navn
 */
export const getAppName = (): string => {
  return Constants.expoConfig?.name || 'OsloPuls';
};
