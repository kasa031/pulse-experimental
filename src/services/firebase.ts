import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore, enableIndexedDbPersistence } from 'firebase/firestore';
import Constants from 'expo-constants';
import { FirebaseConfig } from '../types';
import { safeLog, safeError, safeWarn } from '../utils/performance';

// Firebase configuration from expo-constants or environment variables
const getFirebaseConfig = () => {
  const extra = Constants.expoConfig?.extra;
  
  // Try expo config first
  if (extra?.firebase) {
    return extra.firebase;
  }

  // Fallback to environment variables (without mock values)
  return {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || extra?.firebaseApiKey || "",
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || extra?.firebaseAuthDomain || "",
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || extra?.firebaseProjectId || "",
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || extra?.firebaseStorageBucket || "",
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || extra?.firebaseMessagingSenderId || "",
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || extra?.firebaseAppId || "",
  };
};

const firebaseConfig = getFirebaseConfig();

// Validate Firebase config
const isValidConfig = (config: FirebaseConfig | Record<string, unknown>): boolean => {
  if (!config || !config.apiKey || !config.projectId) {
    return false;
  }
  
  const invalidKeys = [
    'your-api-key',
    'DIN_FIREBASE_API_KEY_HER',
    'PLACEHOLDER',
    'DIN_MESSAGING_SENDER_ID_HER',
    'DIN_APP_ID_HER'
  ];
  
  return !invalidKeys.some(key => 
    config.apiKey === key || 
    config.messagingSenderId === key || 
    config.appId === key
  );
};

// Initialiser Firebase (kun hvis den ikke allerede er initialisert)
let app: FirebaseApp | null = null;
let firebaseError: Error | null = null;

try {
  if (!isValidConfig(firebaseConfig)) {
    const missingFields: string[] = [];
    if (!firebaseConfig.apiKey || firebaseConfig.apiKey.includes('DIN_')) missingFields.push('apiKey');
    if (!firebaseConfig.projectId || firebaseConfig.projectId.includes('DIN_')) missingFields.push('projectId');
    if (!firebaseConfig.appId || firebaseConfig.appId.includes('DIN_')) missingFields.push('appId');
    
    throw new Error(
      `Firebase configuration is invalid. Missing or invalid fields: ${missingFields.join(', ')}. ` +
      `Check that API keys are set correctly in app.local.json or environment variables.`
    );
  }

  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    // Log successful initialization
    safeLog('✅ Firebase initialisert suksessfullt');
  } else {
    app = getApps()[0];
    safeLog('✅ Firebase allerede initialisert');
  }
} catch (error) {
  firebaseError = error as Error;
  // Log error - this is critical so we always log
  safeError('❌ Firebase initialization failed:', error);
  safeError('Firebase config:', {
    hasApiKey: !!firebaseConfig.apiKey,
    hasProjectId: !!firebaseConfig.projectId,
    hasAppId: !!firebaseConfig.appId,
    apiKeyLength: firebaseConfig.apiKey?.length || 0,
  });
  // App will handle this in App.tsx
}

// Export Firebase services (only if initialized)
export const auth: Auth | null = app ? getAuth(app) : null;
export const db: Firestore | null = app ? getFirestore(app) : null;
export const firebaseInitialized = app !== null;
export const getFirebaseError = () => firebaseError;

// Enable offline persistence for Firestore (caching)
if (typeof window !== 'undefined' && db) {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      safeWarn('Firestore persistence can only be enabled in one tab at a time');
    } else if (err.code === 'unimplemented') {
      safeWarn('Firestore persistence is not supported in this environment');
    }
  });
}

export default app;
