import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore, enableIndexedDbPersistence } from 'firebase/firestore';
import Constants from 'expo-constants';

// Firebase konfigurasjon fra expo-constants eller miljøvariabler
const getFirebaseConfig = () => {
  const extra = Constants.expoConfig?.extra;
  
  // Prøv først expo config
  if (extra?.firebase) {
    return extra.firebase;
  }

  // Fallback til environment variables
  return {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || extra?.firebaseApiKey || "your-api-key",
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || extra?.firebaseAuthDomain || "pulse-oslo.firebaseapp.com",
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || extra?.firebaseProjectId || "pulse-oslo",
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || extra?.firebaseStorageBucket || "pulse-oslo.appspot.com",
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || extra?.firebaseMessagingSenderId || "123456789",
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || extra?.firebaseAppId || "your-app-id",
  };
};

const firebaseConfig = getFirebaseConfig();

// Initialiser Firebase (kun hvis den ikke allerede er initialisert)
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Eksporter Firebase services
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

// Aktiver offline persistence for Firestore (caching)
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Firestore persistence kan bare aktiveres i én tab om gangen');
    } else if (err.code === 'unimplemented') {
      console.warn('Firestore persistence er ikke støttet i dette miljøet');
    }
  });
}

export default app;
