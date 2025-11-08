/**
 * Admin Check Utility
 * Hjelpefunksjoner for å sjekke om bruker er admin
 */

import { auth } from '../services/firebase';
import { getIdTokenResult } from 'firebase/auth';
import { safeError } from './performance';

/**
 * Sjekk om nåværende bruker er admin
 */
export const isUserAdmin = async (): Promise<boolean> => {
  try {
    const user = auth?.currentUser;
    if (!user) return false;

    const tokenResult = await getIdTokenResult(user);
    return tokenResult.claims.admin === true;
  } catch (error) {
    safeError('Feil ved sjekk av admin-status:', error);
    return false;
  }
};

/**
 * Hent admin-status (synkron versjon basert på token)
 * NB: Dette fungerer kun hvis token er oppdatert
 */
export const getUserAdminStatus = (): boolean => {
  try {
    const user = auth?.currentUser;
    if (!user) return false;

    // Token claims kan hentes fra getIdTokenResult
    // For synkron sjekk, må vi lagre status i state
    return false; // Default til false, bruk isUserAdmin() for riktig sjekk
  } catch (error) {
    return false;
  }
};

