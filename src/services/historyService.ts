/**
 * History Service - Håndterer lokalhistorikk og tidligere avstemninger
 */

import { db } from './firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit, 
  Timestamp,
  doc,
  getDoc
} from 'firebase/firestore';
import { auth } from './firebase';
import { Poll } from './pollsService';
import { safeError } from '../utils/performance';
import { toDate } from '../utils/dateHelpers';

export interface UserVote {
  pollId: string;
  pollTitle: string;
  selectedOption: string;
  optionIndex: number;
  votedAt: Timestamp | Date;
}

export interface PollResult {
  poll: Poll;
  totalVotes: number;
  optionCounts: Record<number, number>;
  userVote?: UserVote;
}

/**
 * Hent alle avstemninger brukeren har stemt på
 */
export const getUserVotingHistory = async (userId: string): Promise<UserVote[]> => {
  try {
    if (!db) {
      throw new Error('Database er ikke tilgjengelig');
    }
    const votesRef = collection(db, 'votes');
    const q = query(
      votesRef,
      where('userId', '==', userId),
      orderBy('votedAt', 'desc'),
      limit(50)
    );
    
    const snapshot = await getDocs(q);
    const votes: UserVote[] = [];
    
    for (const voteDoc of snapshot.docs) {
      const voteData = voteDoc.data();
      const pollDoc = await getDoc(doc(db, 'polls', voteData.pollId));
      
      if (pollDoc.exists()) {
        const pollData = pollDoc.data();
        votes.push({
          pollId: voteData.pollId,
          pollTitle: pollData.title || 'Ukjent avstemning',
          selectedOption: pollData.options?.[voteData.optionIndex] || 'Ukjent',
          optionIndex: voteData.optionIndex,
          votedAt: voteData.votedAt || voteData.timestamp || voteData.createdAt || Timestamp.now(),
        });
      }
    }
    
    return votes;
  } catch (error: unknown) {
    safeError('Feil ved henting av stemmehistorikk:', error);
    return [];
  }
};

/**
 * Hent resultater for avsluttede avstemninger
 */
export const getCompletedPollResults = async (limitCount: number = 10): Promise<PollResult[]> => {
  try {
    if (!db) {
      throw new Error('Database er ikke tilgjengelig');
    }
    const pollsRef = collection(db, 'polls');
    const now = Timestamp.now();
    const q = query(
      pollsRef,
      where('endDate', '<=', now),
      orderBy('endDate', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    const results: PollResult[] = [];
    const currentUser = auth?.currentUser;
    
    for (const pollDoc of snapshot.docs) {
      const pollData = pollDoc.data();
      const poll: Poll = {
        id: pollDoc.id,
        title: pollData.title,
        description: pollData.description,
        options: pollData.options || [],
        startDate: toDate(pollData.startDate) || new Date(),
        endDate: toDate(pollData.endDate) || new Date(),
        category: pollData.category || 'generelt',
        district: pollData.district,
        createdAt: toDate(pollData.createdAt) || new Date(),
        createdBy: pollData.createdBy,
        isActive: pollData.isActive !== undefined ? pollData.isActive : true,
      };
      
      // Hent stemmer for denne avstemningen
      const votesRef = collection(db, 'votes');
      const votesQuery = query(
        votesRef,
        where('pollId', '==', pollDoc.id)
      );
      const votesSnapshot = await getDocs(votesQuery);
      
      const optionCounts: Record<number, number> = {};
      let totalVotes = 0;
      let userVote: UserVote | undefined;
      
      votesSnapshot.docs.forEach(voteDoc => {
        const voteData = voteDoc.data();
        const optionIndex = voteData.optionIndex;
        
        if (!optionCounts[optionIndex]) {
          optionCounts[optionIndex] = 0;
        }
        optionCounts[optionIndex]++;
        totalVotes++;
        
        // Sjekk om dette er brukerens stemme
        if (currentUser && voteData.userId === currentUser.uid) {
          const selectedOption = poll.options[optionIndex];
          userVote = {
            pollId: pollDoc.id,
            pollTitle: poll.title,
            selectedOption: typeof selectedOption === 'string' ? selectedOption : selectedOption?.text || '',
            optionIndex,
            votedAt: voteData.votedAt || voteData.timestamp || voteData.createdAt || Timestamp.now(), 
          };
        }
      });
      
      results.push({
        poll,
        totalVotes,
        optionCounts,
        userVote,
      });
    }
    
    return results;
  } catch (error: unknown) {
    safeError('Feil ved henting av avsluttede avstemninger:', error);
    return [];
  }
};

/**
 * Hent resultater for en spesifikk avstemning
 */
export const getPollResult = async (pollId: string): Promise<PollResult | null> => {
  try {
    if (!db) {
      throw new Error('Database er ikke tilgjengelig');
    }
    const pollDoc = await getDoc(doc(db, 'polls', pollId));
    
    if (!pollDoc.exists()) {
      return null;
    }
    
    const pollData = pollDoc.data();
    const poll: Poll = {
      id: pollDoc.id,
      title: pollData.title,
      description: pollData.description,
      options: pollData.options || [],
      startDate: toDate(pollData.startDate) || new Date(),
      endDate: toDate(pollData.endDate) || new Date(),
      category: pollData.category || 'generelt',
      district: pollData.district,
      createdAt: toDate(pollData.createdAt) || new Date(),
      createdBy: pollData.createdBy,
      isActive: pollData.isActive !== undefined ? pollData.isActive : true,
    };
    
    // Hent stemmer
    const votesRef = collection(db, 'votes');
    const votesQuery = query(
      votesRef,
      where('pollId', '==', pollId)
    );
    const votesSnapshot = await getDocs(votesQuery);
    
    const optionCounts: Record<number, number> = {};
    let totalVotes = 0;
    const currentUser = auth?.currentUser;
    let userVote: UserVote | undefined;
    
    votesSnapshot.docs.forEach(voteDoc => {
      const voteData = voteDoc.data();
      const optionIndex = voteData.optionIndex;
      
      if (!optionCounts[optionIndex]) {
        optionCounts[optionIndex] = 0;
      }
      optionCounts[optionIndex]++;
      totalVotes++;
      
      if (currentUser && voteData.userId === currentUser.uid) {
        const selectedOption = poll.options[optionIndex];
        userVote = {
          pollId,
          pollTitle: poll.title,
          selectedOption: typeof selectedOption === 'string' ? selectedOption : selectedOption?.text || '',
          optionIndex,
          votedAt: voteData.votedAt || voteData.timestamp || voteData.createdAt || Timestamp.now(),   
        };
      }
    });
    
    return {
      poll,
      totalVotes,
      optionCounts,
      userVote,
    };
  } catch (error: unknown) {
    safeError('Feil ved henting av avstemningsresultat:', error);
    return null;
  }
};

