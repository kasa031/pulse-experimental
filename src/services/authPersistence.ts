import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from 'firebase/auth';
import { safeError } from '../utils/performance';

export interface StoredUserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

const USER_STORAGE_KEY = '@pulse_oslo_user';

/**
 * Lagre brukerdata til AsyncStorage
 */
export const saveUserToStorage = async (user: User): Promise<void> => {
  try {
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
  } catch (error) {
    safeError('Feil ved lagring av bruker:', error);
    throw error;
  }
};

/**
 * Hent lagret brukerdata fra AsyncStorage
 */
export const getUserFromStorage = async (): Promise<StoredUserData | null> => {
  try {
    const userData = await AsyncStorage.getItem(USER_STORAGE_KEY);
    if (userData) {
      return JSON.parse(userData) as StoredUserData;
    }
    return null;
  } catch (error) {
    safeError('Feil ved henting av bruker:', error);
    return null;
  }
};

/**
 * Fjern lagret brukerdata fra AsyncStorage
 */
export const clearAuthStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(USER_STORAGE_KEY);
  } catch (error) {
    safeError('Feil ved fjerning av bruker:', error);
    throw error;
  }
};

