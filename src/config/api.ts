/**
 * API Configuration
 * 
 * ⚠️ SIKKERHET: API-nøkler hentes fra miljøvariabler
 * ALDRI hardkod nøkler i kildekoden!
 */

import Constants from 'expo-constants';

// Hent API-nøkler fra miljøvariabler
// For Expo/React Native bruker vi Constants.expoConfig.extra
const getApiKey = (keyName: string): string => {
  // Prøv først expo config
  const expoConfig = Constants.expoConfig?.extra;
  if (expoConfig && expoConfig[keyName]) {
    return expoConfig[keyName];
  }

  // Fallback til environment variable (for development)
  if (process.env[keyName]) {
    return process.env[keyName];
  }

  // Hvis ingen nøkkel funnet, kast en feil
  throw new Error(
    `API-nøkkel "${keyName}" ikke funnet. ` +
    `Sjekk at den er satt i app.json (extra.${keyName}) eller miljøvariabler.`
  );
};

// Open Router API Configuration
export const OPENROUTER_CONFIG = {
  apiKey: getApiKey('openrouterApiKey'),
  baseUrl: 'https://openrouter.ai/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'HTTP-Referer': 'https://github.com/kasa031/pulse-experimental', // Optional
    'X-Title': 'Pulse Oslo', // Optional
  },
};

/**
 * Get Open Router API headers
 */
export const getOpenRouterHeaders = () => ({
  ...OPENROUTER_CONFIG.headers,
  'Authorization': `Bearer ${OPENROUTER_CONFIG.apiKey}`,
});

/**
 * Make a request to Open Router API
 */
export const openRouterRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const url = `${OPENROUTER_CONFIG.baseUrl}${endpoint}`;
  
  return fetch(url, {
    ...options,
    headers: {
      ...getOpenRouterHeaders(),
      ...options.headers,
    },
  });
};

