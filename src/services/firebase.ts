import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore, enableIndexedDbPersistence } from 'firebase/firestore';
import Constants from 'expo-constants';
import { FirebaseConfig } from '../types';

// Firebase konfigurasjon fra expo-constants eller miljøvariabler
const getFirebaseConfig = () => {
  const extra = Constants.expoConfig?.extra;
  
  // Prøv først expo config
  if (extra?.firebase) {
    return extra.firebase;
  }

  // Fallback til environment variables (uten mock-verdier)
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

// Valider Firebase config
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
      `Firebase konfigurasjon er ugyldig. Manglende eller ugyldige felter: ${missingFields.join(', ')}. ` +
      `Sjekk at API-nøkler er satt riktig i app.local.json eller miljøvariabler.`
    );
  }

  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    // Log successful initialization
    if (typeof console !== 'undefined' && console.log) {
      console.log('✅ Firebase initialisert suksessfullt');
    }
  } else {
    app = getApps()[0];
    if (typeof console !== 'undefined' && console.log) {
      console.log('✅ Firebase allerede initialisert');
    }
  }
} catch (error) {
  firebaseError = error as Error;
  // Log error - dette er kritisk så vi logger alltid
  if (typeof console !== 'undefined' && console.error) {
    console.error('❌ Firebase initialisering feilet:', error);
    console.error('Firebase config:', {
      hasApiKey: !!firebaseConfig.apiKey,
      hasProjectId: !!firebaseConfig.projectId,
      hasAppId: !!firebaseConfig.appId,
      apiKeyLength: firebaseConfig.apiKey?.length || 0,
    });
  }
  // App vil håndtere dette i App.tsx
}

// Eksporter Firebase services (kun hvis initialisert)
export const auth: Auth | null = app ? getAuth(app) : null;
export const db: Firestore | null = app ? getFirestore(app) : null;
export const firebaseInitialized = app !== null;
export const getFirebaseError = () => firebaseError;

// Aktiver offline persistence for Firestore (caching)
if (typeof window !== 'undefined' && db) {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Firestore persistence kan bare aktiveres i én tab om gangen');
    } else if (err.code === 'unimplemented') {
      console.warn('Firestore persistence er ikke støttet i dette miljøet');
    }
  });
}

export default app;
