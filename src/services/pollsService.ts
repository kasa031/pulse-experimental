import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  increment,
  orderBy,
  onSnapshot,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const POLLS_CACHE_KEY = '@pulse_oslo_polls_cache';
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutter

export interface PollOption {
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  startDate: Timestamp | Date;
  endDate: Timestamp | Date;
  createdBy: string;
  district: string;
  category: string;
  options: PollOption[];
  totalVotes?: number;
  createdAt?: Timestamp | Date;
}

/**
 * Hent alle aktive avstemninger fra Firestore
 */
export const getActivePolls = async (): Promise<Poll[]> => {
  try {
    // Sjekk cache først
    const cached = await getCachedPolls();
    if (cached) {
      return cached;
    }

    const pollsRef = collection(db, 'polls');
    const q = query(
      pollsRef,
      where('isActive', '==', true),
      orderBy('startDate', 'desc')
    );
    
    const snapshot = await getDocs(q);
    const polls: Poll[] = [];
    
    snapshot.forEach((doc) => {
      polls.push({
        id: doc.id,
        ...doc.data(),
      } as Poll);
    });

    // Cache resultatet
    await cachePolls(polls);
    
    return polls;
  } catch (error) {
    console.error('Feil ved henting av avstemninger:', error);
    // Fallback til cache hvis nettverk feiler
    const cached = await getCachedPolls();
    return cached || [];
  }
};

/**
 * Hent en spesifikk avstemning
 */
export const getPoll = async (pollId: string): Promise<Poll | null> => {
  try {
    const pollRef = doc(db, 'polls', pollId);
    const pollSnap = await getDoc(pollRef);
    
    if (pollSnap.exists()) {
      return {
        id: pollSnap.id,
        ...pollSnap.data(),
      } as Poll;
    }
    return null;
  } catch (error) {
    console.error('Feil ved henting av avstemning:', error);
    return null;
  }
};

/**
 * Send en stemme
 */
export const submitVote = async (
  pollId: string, 
  optionIndex: number, 
  userId: string
): Promise<boolean> => {
  try {
    const pollRef = doc(db, 'polls', pollId);
    const voteRef = doc(db, 'votes', `${pollId}_${userId}`);

    // Sjekk om brukeren allerede har stemt
    const existingVote = await getDoc(voteRef);
    if (existingVote.exists()) {
      throw new Error('Du har allerede stemt på denne avstemningen');
    }

    // Oppdater stemmetall
    const poll = await getDoc(pollRef);
    if (!poll.exists()) {
      throw new Error('Avstemning ikke funnet');
    }

    const pollData = poll.data();
    const options = pollData.options || [];
    
    if (optionIndex < 0 || optionIndex >= options.length) {
      throw new Error('Ugyldig valg');
    }

    // Oppdater stemmetall
    const updatedOptions = [...options];
    updatedOptions[optionIndex] = {
      ...updatedOptions[optionIndex],
      votes: (updatedOptions[optionIndex].votes || 0) + 1,
    };

    // Lagre stemme og oppdater poll
    await Promise.all([
      setDoc(voteRef, {
        pollId,
        userId,
        optionIndex,
        timestamp: serverTimestamp(),
      }),
      updateDoc(pollRef, {
        options: updatedOptions,
        totalVotes: increment(1),
      }),
    ]);

    // Oppdater cache
    await invalidateCache();

    return true;
  } catch (error) {
    console.error('Feil ved innsending av stemme:', error);
    throw error;
  }
};

/**
 * Lytt til real-time oppdateringer av avstemninger
 */
export const subscribeToPolls = (
  callback: (polls: Poll[]) => void
): (() => void) => {
  const pollsRef = collection(db, 'polls');
  const q = query(
    pollsRef,
    where('isActive', '==', true),
    orderBy('startDate', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const polls: Poll[] = [];
    snapshot.forEach((doc) => {
      polls.push({
        id: doc.id,
        ...doc.data(),
      } as Poll);
    });
    callback(polls);
    // Oppdater cache
    cachePolls(polls);
  });
};

/**
 * Cache-helper funksjoner
 */
const cachePolls = async (polls: Poll[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(POLLS_CACHE_KEY, JSON.stringify({
      data: polls,
      timestamp: Date.now(),
    }));
  } catch (error) {
    console.error('Feil ved caching av avstemninger:', error);
  }
};

const getCachedPolls = async (): Promise<Poll[] | null> => {
  try {
    const cached = await AsyncStorage.getItem(POLLS_CACHE_KEY);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    
    // Sjekk om cache er utløpt
    if (Date.now() - timestamp > CACHE_EXPIRY) {
      await AsyncStorage.removeItem(POLLS_CACHE_KEY);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Feil ved henting av cache:', error);
    return null;
  }
};

const invalidateCache = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(POLLS_CACHE_KEY);
  } catch (error) {
    console.error('Feil ved invalidering av cache:', error);
  }
};

