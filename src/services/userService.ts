/**
 * User Service
 * Håndterer brukerprofil-data i Firestore
 */

import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  query,
  where,
  getDocs,
  increment,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { auth } from './firebase';
import { safeError } from '../utils/performance';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  district?: string;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  stats?: {
    votesCount: number;
    pollsCreated?: number;
  };
}

/**
 * Hent brukerprofil fra Firestore
 */
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    if (!db) {
      throw new Error('Firebase Firestore is not initialized');
    }
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return {
        ...userSnap.data(),
      } as UserProfile;
    }
    
    return null;
  } catch (error) {
    safeError('Feil ved henting av brukerprofil:', error);
    return null;
  }
};

/**
 * Opprett eller oppdater brukerprofil
 */
export const createOrUpdateUserProfile = async (
  user: { uid: string; email: string | null; displayName?: string | null; photoURL?: string | null },
  additionalData?: { district?: string }
): Promise<void> => {
  try {
    if (!user.email) {
      throw new Error('Email is required');
    }

    if (!db) {
      throw new Error('Firebase Firestore is not initialized');
    }

    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      // Oppdater eksisterende profil
      await updateDoc(userRef, {
        email: user.email,
        displayName: user.displayName || null,
        photoURL: user.photoURL || null,
        ...(additionalData?.district && { district: additionalData.district }),
        updatedAt: serverTimestamp(),
      });
    } else {
      // Opprett ny profil
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || null,
        photoURL: user.photoURL || null,
        ...(additionalData?.district && { district: additionalData.district }),
        stats: {
          votesCount: 0,
          pollsCreated: 0,
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    safeError('Feil ved opprettelse/oppdatering av brukerprofil:', error);
    throw error;
  }
};

/**
 * Oppdater brukerprofil
 */
export const updateUserProfile = async (
  userId: string,
  updates: Partial<Pick<UserProfile, 'displayName' | 'district'>>
): Promise<void> => {
  try {
    const user = auth?.currentUser;
    if (!user || user.uid !== userId) {
      throw new Error('Not authorized to update this profile');       
    }

    if (!db) {
      throw new Error('Firebase Firestore is not initialized');
    }

    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    safeError('Feil ved oppdatering av brukerprofil:', error);
    throw error;
  }
};

/**
 * Hent antall stemmer for en bruker (teller faktiske votes fra votes collection)
 */
export const getUserVoteCount = async (userId: string): Promise<number> => {
  try {
    if (!db) {
      throw new Error('Firebase Firestore is not initialized');
    }
    // Telle faktiske votes fra votes collection
    const votesQuery = query(
      collection(db, 'votes'),
      where('userId', '==', userId)
    );
    const votesSnapshot = await getDocs(votesQuery);
    const count = votesSnapshot.size;
    
    // Oppdater profil med faktisk antall
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      await updateDoc(userRef, {
        'stats.votesCount': count,
        updatedAt: serverTimestamp(),
      });
    }
    
    return count;
  } catch (error) {
    safeError('Feil ved henting av stemmetall:', error);
    // Fallback til profil
    try {
      const profile = await getUserProfile(userId);
      return profile?.stats?.votesCount || 0;
    } catch {
      return 0;
    }
  }
};

/**
 * Oppdater vote count i brukerprofil (kalles når bruker stemmer)
 */
export const incrementUserVoteCount = async (userId: string): Promise<void> => {
  try {
    if (!db) {
      return; // Ikke kritisk, bare returner
    }
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      await updateDoc(userRef, {
        'stats.votesCount': increment(1),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    safeError('Feil ved oppdatering av vote count:', error);
    // Ikke kast feil, dette er ikke kritisk
  }
};

/**
 * Oppdater pollsCreated count i brukerprofil (kalles når admin oppretter poll)
 */
export const incrementUserPollCount = async (userId: string): Promise<void> => {
  try {
    if (!db) {
      return; // Ikke kritisk, bare returner
    }
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      await updateDoc(userRef, {
        'stats.pollsCreated': increment(1),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    safeError('Feil ved oppdatering av pollsCreated:', error);
    // Ikke kast feil, dette er ikke kritisk
  }
};

/**
 * Hent antall kommentarer for en bruker
 */
export const getUserCommentCount = async (userId: string): Promise<number> => {
  try {
    if (!db) {
      return 0;
    }
    const commentsQuery = query(
      collection(db, 'comments'),
      where('authorId', '==', userId)
    );
    const commentsSnapshot = await getDocs(commentsQuery);
    return commentsSnapshot.size;
  } catch (error) {
    safeError('Feil ved henting av kommentartall:', error);
    return 0;
  }
};

/**
 * Hent antall diskusjoner opprettet av en bruker
 */
export const getUserDiscussionCount = async (userId: string): Promise<number> => {
  try {
    if (!db) {
      return 0;
    }
    const discussionsQuery = query(
      collection(db, 'discussions'),
      where('authorId', '==', userId)
    );
    const discussionsSnapshot = await getDocs(discussionsQuery);
    return discussionsSnapshot.size;
  } catch (error) {
    safeError('Feil ved henting av diskusjonstall:', error);
    return 0;
  }
};

