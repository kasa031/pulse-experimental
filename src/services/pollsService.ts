import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  addDoc,
  updateDoc, 
  increment,
  orderBy,
  onSnapshot,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { validatePollId, validateOptionIndex } from '../utils/validation';
import { checkRateLimit } from '../utils/rateLimiter';
import { safeError } from '../utils/performance';
import { incrementUserVoteCount } from './userService';
import { toDate } from '../utils/dateHelpers';

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
 * 
 * @returns Array med aktive Poll-objekter, sortert etter startdato (nyeste først)
 * 
 * Bruker caching (5 minutter) for å redusere Firestore-kall.
 * Fallback til cache hvis nettverk feiler.
 * 
 * @example
 * ```typescript
 * const polls = await getActivePolls();
 * ```
 */
export const getActivePolls = async (): Promise<Poll[]> => {
  try {
    // Sjekk cache først
    const cached = await getCachedPolls();
    if (cached) {
      return cached;
    }

    if (!db) {
      throw new Error('Firebase Firestore er ikke initialisert');
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
    safeError('Feil ved henting av avstemninger:', error);
    // Fallback til cache hvis nettverk feiler
    const cached = await getCachedPolls();
    return cached || [];
  }
};

/**
 * Hent en spesifikk avstemning fra Firestore
 * 
 * @param pollId - ID til avstemningen
 * @returns Poll-objekt eller null hvis ikke funnet
 * 
 * @example
 * ```typescript
 * const poll = await getPoll('poll123');
 * ```
 */
export const getPoll = async (pollId: string): Promise<Poll | null> => {
  try {
    if (!db) {
      throw new Error('Firebase Firestore er ikke initialisert');
    }
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
    safeError('Feil ved henting av avstemning:', error);
    return null;
  }
};

/**
 * Send en stemme på en avstemning
 * 
 * @param pollId - ID til avstemningen
 * @param optionIndex - Indeks til valgt alternativ (0-basert)
 * @param userId - ID til brukeren som stemmer
 * @returns true hvis stemmen ble registrert
 * @throws Error hvis validering feiler, rate limit er nådd, eller database ikke er tilgjengelig
 * 
 * Funksjonen validerer input, sjekker rate limits, og oppdaterer både poll og brukerstatistikk.
 * 
 * @example
 * ```typescript
 * const success = await submitVote('poll123', 0, 'user456');
 * ```
 */
export const submitVote = async (
  pollId: string, 
  optionIndex: number, 
  userId: string
): Promise<boolean> => {
  try {
    // Valider input
    const pollIdValidation = validatePollId(pollId);
    if (!pollIdValidation.valid) {
      throw new Error(pollIdValidation.error || 'Ugyldig avstemning ID');
    }

    // Rate limiting
    const rateLimitCheck = await checkRateLimit('vote', userId);
    if (!rateLimitCheck.allowed) {
      const remaining = rateLimitCheck.resetAt 
        ? Math.ceil((rateLimitCheck.resetAt - Date.now()) / 1000)
        : 60;
      throw new Error(`For mange stemmer. Prøv igjen om ${remaining} sekunder.`);                                                                              
    }

    if (!db) {
      throw new Error('Firebase Firestore er ikke initialisert');
    }

    const pollRef = doc(db, 'polls', pollId);
    const voteRef = doc(db, 'votes', `${pollId}_${userId}`);

    // Sjekk om brukeren allerede har stemt
    const existingVote = await getDoc(voteRef);
    if (existingVote.exists()) {
      throw new Error('Du har allerede stemt på denne avstemningen');
    }

    // Hent poll data
    const poll = await getDoc(pollRef);
    if (!poll.exists()) {
      throw new Error('Avstemning ikke funnet');
    }

    const pollData = poll.data();
    const options = pollData.options || [];
    
    // Valider option index
    const optionValidation = validateOptionIndex(optionIndex, options.length);
    if (!optionValidation.valid) {
      throw new Error(optionValidation.error || 'Ugyldig valg');
    }

    // Sjekk om poll er aktiv
    const now = new Date();
    const startDate = toDate(pollData.startDate);
    const endDate = toDate(pollData.endDate);
    
    if (!startDate || !endDate) {
      throw new Error('Ugyldig dato for avstemning');
    }
    
    if (!pollData.isActive || now < startDate || now > endDate) {
      throw new Error('Denne avstemningen er ikke lenger aktiv');
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
        votedAt: serverTimestamp(),
        timestamp: serverTimestamp(), // Behold for bakoverkompatibilitet
      }),
      updateDoc(pollRef, {
        options: updatedOptions,
        totalVotes: increment(1),
      }),
    ]);

    // Oppdater brukerens vote count
    await incrementUserVoteCount(userId);

    // Oppdater cache
    await invalidateCache();

    return true;
  } catch (error: unknown) {
    safeError('Feil ved innsending av stemme:', error);
    // Re-throw med bedre feilmelding
    const err = error as { message?: string };
    if (err.message) {
      throw error;
    }
    throw new Error('Kunne ikke sende stemme. Prøv igjen.');
  }
};

/**
 * Lytt til real-time oppdateringer av avstemninger
 */
export const subscribeToPolls = (
  callback: (polls: Poll[]) => void
): (() => void) => {
  if (!db) {
    safeError('Firebase Firestore er ikke initialisert');
    return () => {};
  }
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
    safeError('Feil ved caching av avstemninger:', error);
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
    safeError('Feil ved henting av cache:', error);
    return null;
  }
};

const invalidateCache = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(POLLS_CACHE_KEY);
  } catch (error) {
    safeError('Feil ved invalidering av cache:', error);
  }
};

/**
 * Opprett en ny avstemning (kun admin)
 */
export interface CreatePollData {
  title: string;
  description: string;
  options: { text: string }[];
  startDate: Date;
  endDate: Date;
  district: string;
  category: string;
  isActive?: boolean;
}

/**
 * Opprett en ny avstemning i Firestore
 * 
 * @param pollData - Data for den nye avstemningen (title, description, options, etc.)
 * @param userId - ID til brukeren som oppretter avstemningen
 * @param createdBy - Navn på brukeren som oppretter avstemningen
 * @returns ID til den opprettede avstemningen
 * @throws Error hvis validering feiler eller database ikke er tilgjengelig
 * 
 * Alle tekstfelter sanitizes automatisk før lagring.
 * 
 * @example
 * ```typescript
 * const pollId = await createPoll({
 *   title: 'Ny park?',
 *   description: 'Skal vi bygge en ny park?',
 *   options: [{ text: 'Ja' }, { text: 'Nei' }],
 *   startDate: new Date(),
 *   endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
 *   district: 'Grünerløkka',
 *   category: 'miljø'
 * }, 'user123', 'Ola Nordmann');
 * ```
 */
export const createPoll = async (
  pollData: CreatePollData,
  userId: string,
  createdBy: string
): Promise<string> => {
  try {
    // Valider input
    const { validatePollTitle, validatePollDescription, validatePollOption } = await import('../utils/validation');
    
    const titleValidation = validatePollTitle(pollData.title);
    if (!titleValidation.valid) {
      throw new Error(titleValidation.error || 'Ugyldig tittel');
    }

    const descValidation = validatePollDescription(pollData.description);
    if (!descValidation.valid) {
      throw new Error(descValidation.error || 'Ugyldig beskrivelse');
    }

    if (!pollData.options || pollData.options.length < 2 || pollData.options.length > 10) {
      throw new Error('Avstemning må ha mellom 2 og 10 alternativer');
    }

    // Valider alle alternativer
    for (const option of pollData.options) {
      const optionValidation = validatePollOption(option.text);
      if (!optionValidation.valid) {
        throw new Error(`Ugyldig alternativ: ${optionValidation.error}`);
      }
    }

    // Rate limiting
    const rateLimitCheck = await checkRateLimit('pollCreate', userId);
    if (!rateLimitCheck.allowed) {
      const remaining = rateLimitCheck.resetAt 
        ? Math.ceil((rateLimitCheck.resetAt - Date.now()) / 3600000)
        : 1;
      throw new Error(`For mange opprettelser. Prøv igjen om ${remaining} time(r).`);
    }

    // Sjekk datoer
    const now = new Date();
    if (pollData.startDate < now) {
      throw new Error('Startdato kan ikke være i fortiden');
    }

    if (pollData.endDate <= pollData.startDate) {
      throw new Error('Sluttdato må være etter startdato');
    }

    if (!db) {
      throw new Error('Firebase Firestore er ikke initialisert');
    }

    // Opprett poll
    const pollsRef = collection(db, 'polls');
    const pollDoc = {
      title: pollData.title.trim(),
      description: pollData.description.trim(),
      options: pollData.options.map(opt => ({
        text: opt.text.trim(),
        votes: 0,
      })),
      isActive: pollData.isActive !== false,
      startDate: Timestamp.fromDate(pollData.startDate),
      endDate: Timestamp.fromDate(pollData.endDate),
      createdBy: createdBy,
      district: pollData.district,
      category: pollData.category,
      totalVotes: 0,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(pollsRef, pollDoc);
    
    // Oppdater brukerens pollsCreated count
    try {
      const { incrementUserPollCount } = await import('./userService');
      await incrementUserPollCount(userId);
    } catch (error) {
      safeError('Feil ved oppdatering av pollsCreated:', error);
      // Ikke kast feil, dette er ikke kritisk
    }
    
    // Oppdater cache
    await invalidateCache();

    return docRef.id;
  } catch (error: unknown) {
    safeError('Feil ved opprettelse av avstemning:', error);
    const err = error as { message?: string };
    if (err.message) {
      throw error;
    }
    throw new Error('Kunne ikke opprette avstemning. Prøv igjen.');
  }
};

