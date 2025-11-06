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
          votedAt: voteData.votedAt || voteData.createdAt || Timestamp.now(),
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
    const currentUser = auth.currentUser;
    
    for (const pollDoc of snapshot.docs) {
      const pollData = pollDoc.data();
      const poll: Poll = {
        id: pollDoc.id,
        title: pollData.title,
        description: pollData.description,
        options: pollData.options || [],
        startDate: pollData.startDate?.toDate() || new Date(),
        endDate: pollData.endDate?.toDate() || new Date(),
        category: pollData.category || 'generelt',
        district: pollData.district,
        createdAt: pollData.createdAt?.toDate() || new Date(),
        createdBy: pollData.createdBy,
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
          userVote = {
            pollId: pollDoc.id,
            pollTitle: poll.title,
            selectedOption: poll.options[optionIndex],
            optionIndex,
            votedAt: voteData.votedAt || voteData.createdAt || Timestamp.now(),
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
      startDate: pollData.startDate?.toDate() || new Date(),
      endDate: pollData.endDate?.toDate() || new Date(),
      category: pollData.category || 'generelt',
      district: pollData.district,
      createdAt: pollData.createdAt?.toDate() || new Date(),
      createdBy: pollData.createdBy,
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
    const currentUser = auth.currentUser;
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
        userVote = {
          pollId,
          pollTitle: poll.title,
          selectedOption: poll.options[optionIndex],
          optionIndex,
          votedAt: voteData.votedAt || voteData.createdAt || Timestamp.now(),
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

