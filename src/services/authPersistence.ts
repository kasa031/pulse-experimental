import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from 'firebase/auth';

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
    console.error('Feil ved lagring av bruker:', error);
    throw error;
  }
};

/**
 * Hent lagret brukerdata fra AsyncStorage
 */
export const getUserFromStorage = async (): Promise<any | null> => {
  try {
    const userData = await AsyncStorage.getItem(USER_STORAGE_KEY);
    if (userData) {
      return JSON.parse(userData);
    }
    return null;
  } catch (error) {
    console.error('Feil ved henting av bruker:', error);
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
    console.error('Feil ved fjerning av bruker:', error);
    throw error;
  }
};

