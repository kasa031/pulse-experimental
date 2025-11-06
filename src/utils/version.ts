/**
 * Versjonshåndtering
 * Centraliseret versjonsinformasjon
 */

export const APP_VERSION = '1.1.0';
export const APP_BUILD_NUMBER = '1';

export interface VersionInfo {
  version: string;
  build: string;
  name: string;
  timestamp: string;
}

/**
 * Hent versjonsinformasjon
 */
export const getVersionInfo = (): VersionInfo => {
  return {
    version: APP_VERSION,
    build: APP_BUILD_NUMBER,
    name: 'OsloPuls',
    timestamp: new Date().toISOString(),
  };
};

/**
 * Sjekk om versjon er nyere enn en annen
 */
export const isVersionNewer = (current: string, compare: string): boolean => {
  const currentParts = current.split('.').map(Number);
  const compareParts = compare.split('.').map(Number);

  for (let i = 0; i < Math.max(currentParts.length, compareParts.length); i++) {
    const currentPart = currentParts[i] || 0;
    const comparePart = compareParts[i] || 0;

    if (comparePart > currentPart) return true;
    if (comparePart < currentPart) return false;
  }

  return false;
};

