/**
 * Discussion Service - Håndterer diskusjoner og kommentarer
 */

import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  orderBy, 
  limit,
  Timestamp,
  serverTimestamp,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  increment,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db } from './firebase';
import { auth } from './firebase';
import { safeError, safeLog } from '../utils/performance';

export interface Discussion {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  category: string;
  district?: string;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  commentCount: number;
  likes?: number;
}

export interface Comment {
  id: string;
  discussionId: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Timestamp | Date;
  updatedAt?: Timestamp | Date;
  likes?: number;
  dislikes?: number;
  likedBy?: string[];
  dislikedBy?: string[];
}

/**
 * Hent alle diskusjoner
 */
export const getDiscussions = async (limitCount: number = 20): Promise<Discussion[]> => {
  try {
    if (!db) {
      throw new Error('Database er ikke tilgjengelig');
    }
    const discussionsRef = collection(db, 'discussions');
    const q = query(
      discussionsRef,
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    const discussions: Discussion[] = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      discussions.push({
        id: doc.id,
        title: data.title || '',
        content: data.content || '',
        authorId: data.authorId || '',
        authorName: data.authorName || 'Anonym',
        category: data.category || 'generelt',
        district: data.district,
        createdAt: data.createdAt || Timestamp.now(),
        updatedAt: data.updatedAt || data.createdAt || Timestamp.now(),
        commentCount: data.commentCount || 0,
        likes: data.likes || 0,
      });
    });
    
    return discussions;
  } catch (error: unknown) {
    safeError('Feil ved henting av diskusjoner:', error);
    return [];
  }
};

/**
 * Hent diskusjoner for en kategori
 */
export const getDiscussionsByCategory = async (
  category: string,
  limitCount: number = 20
): Promise<Discussion[]> => {
  try {
    if (!db) {
      throw new Error('Database er ikke tilgjengelig');
    }
    const discussionsRef = collection(db, 'discussions');
    const q = query(
      discussionsRef,
      where('category', '==', category),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    const discussions: Discussion[] = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      discussions.push({
        id: doc.id,
        title: data.title || '',
        content: data.content || '',
        authorId: data.authorId || '',
        authorName: data.authorName || 'Anonym',
        category: data.category || 'generelt',
        district: data.district,
        createdAt: data.createdAt || Timestamp.now(),
        updatedAt: data.updatedAt || data.createdAt || Timestamp.now(),
        commentCount: data.commentCount || 0,
        likes: data.likes || 0,
      });
    });
    
    return discussions;
  } catch (error: unknown) {
    safeError('Feil ved henting av diskusjoner:', error);
    return [];
  }
};

/**
 * Opprett en ny diskusjon
 */
export const createDiscussion = async (
  title: string,
  content: string,
  category: string,
  district?: string
): Promise<string> => {
  try {
    const user = auth?.currentUser;
    if (!user) {
      throw new Error('Du må være logget inn for å opprette en diskusjon');
    }

    if (!db) {
      throw new Error('Database er ikke tilgjengelig');
    }

    // Hent brukerens navn
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data();
    const authorName = userData?.displayName || user.displayName || user.email?.split('@')[0] || 'Anonym';

    const discussionsRef = collection(db, 'discussions');
    const docRef = await addDoc(discussionsRef, {
      title: title.trim(),
      content: content.trim(),
      authorId: user.uid,
      authorName,
      category: category || 'generelt',
      district: district || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      commentCount: 0,
      likes: 0,
    });

    safeLog('Diskusjon opprettet:', docRef.id);
    return docRef.id;
  } catch (error: unknown) {
    safeError('Feil ved opprettelse av diskusjon:', error);
    throw error;
  }
};

/**
 * Hent kommentarer for en diskusjon
 */
export const getComments = async (discussionId: string): Promise<Comment[]> => {
  try {
    if (!db) {
      throw new Error('Database er ikke tilgjengelig');
    }
    const commentsRef = collection(db, 'discussions', discussionId, 'comments');
    const q = query(
      commentsRef,
      orderBy('createdAt', 'asc')
    );
    
    const snapshot = await getDocs(q);
    const comments: Comment[] = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      comments.push({
        id: doc.id,
        discussionId,
        content: data.content || '',
        authorId: data.authorId || '',
        authorName: data.authorName || 'Anonym',
        createdAt: data.createdAt || Timestamp.now(),
        updatedAt: data.updatedAt,
        likes: data.likes || 0,
        dislikes: data.dislikes || 0,
        likedBy: data.likedBy || [],
        dislikedBy: data.dislikedBy || [],
      });
    });
    
    return comments;
  } catch (error: unknown) {
    safeError('Feil ved henting av kommentarer:', error);
    return [];
  }
};

/**
 * Legg til en kommentar
 */
export const addComment = async (
  discussionId: string,
  content: string
): Promise<string> => {
  try {
    const user = auth?.currentUser;
    if (!user) {
      throw new Error('Du må være logget inn for å legge til en kommentar');
    }

    if (!db) {
      throw new Error('Database er ikke tilgjengelig');
    }

    // Hent brukerens navn
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data();
    const authorName = userData?.displayName || user.displayName || user.email?.split('@')[0] || 'Anonym';

    const commentsRef = collection(db, 'discussions', discussionId, 'comments');
    const docRef = await addDoc(commentsRef, {
      content: content.trim(),
      authorId: user.uid,
      authorName,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Oppdater commentCount på diskusjonen
    const { updateDoc, increment } = await import('firebase/firestore');
    const discussionRef = doc(db, 'discussions', discussionId);
    const discussionSnap = await getDoc(discussionRef);
    if (discussionSnap.exists()) {
      await updateDoc(discussionRef, {
        commentCount: increment(1),
        updatedAt: serverTimestamp(),
      });
    }

    safeLog('Kommentar lagt til:', docRef.id);
    return docRef.id;
  } catch (error: unknown) {
    safeError('Feil ved legg til kommentar:', error);
    throw error;
  }
};

/**
 * Lytt til real-time oppdateringer av diskusjoner
 */
export const subscribeToDiscussions = (
  callback: (discussions: Discussion[]) => void
): (() => void) => {
  if (!db) {
    safeError('Database er ikke tilgjengelig');
    return () => {};
  }
  const discussionsRef = collection(db, 'discussions');
  const q = query(
    discussionsRef,
    orderBy('createdAt', 'desc'),
    limit(20)
  );

  return onSnapshot(q, (snapshot) => {
    const discussions: Discussion[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      discussions.push({
        id: doc.id,
        title: data.title || '',
        content: data.content || '',
        authorId: data.authorId || '',
        authorName: data.authorName || 'Anonym',
        category: data.category || 'generelt',
        district: data.district,
        createdAt: data.createdAt || Timestamp.now(),
        updatedAt: data.updatedAt || data.createdAt || Timestamp.now(),
        commentCount: data.commentCount || 0,
        likes: data.likes || 0,
      });
    });
    callback(discussions);
  });
};

/**
 * Like en kommentar
 */
export const likeComment = async (discussionId: string, commentId: string): Promise<void> => {
  try {
    const user = auth?.currentUser;
    if (!user) {
      throw new Error('Du må være logget inn for å like en kommentar');
    }

    if (!db) {
      throw new Error('Database er ikke tilgjengelig');
    }

    const commentRef = doc(db, 'discussions', discussionId, 'comments', commentId);
    const commentSnap = await getDoc(commentRef);
    
    if (!commentSnap.exists()) {
      throw new Error('Kommentar ikke funnet');
    }

    const data = commentSnap.data();
    const likedBy = data.likedBy || [];
    const dislikedBy = data.dislikedBy || [];
    const userId = user.uid;

    // Hvis brukeren allerede har likt, fjern like
    if (likedBy.includes(userId)) {
      await updateDoc(commentRef, {
        likes: increment(-1),
        likedBy: arrayRemove(userId),
      });
    } else {
      // Hvis brukeren har disliket, fjern dislike og legg til like
      if (dislikedBy.includes(userId)) {
        await updateDoc(commentRef, {
          dislikes: increment(-1),
          likes: increment(1),
          dislikedBy: arrayRemove(userId),
          likedBy: arrayUnion(userId),
        });
      } else {
        // Legg til like
        await updateDoc(commentRef, {
          likes: increment(1),
          likedBy: arrayUnion(userId),
        });
      }
    }
  } catch (error: unknown) {
    safeError('Feil ved like av kommentar:', error);
    throw error;
  }
};

/**
 * Dislike en kommentar
 */
export const dislikeComment = async (discussionId: string, commentId: string): Promise<void> => {
  try {
    const user = auth?.currentUser;
    if (!user) {
      throw new Error('Du må være logget inn for å dislike en kommentar');
    }

    if (!db) {
      throw new Error('Database er ikke tilgjengelig');
    }

    const commentRef = doc(db, 'discussions', discussionId, 'comments', commentId);
    const commentSnap = await getDoc(commentRef);
    
    if (!commentSnap.exists()) {
      throw new Error('Kommentar ikke funnet');
    }

    const data = commentSnap.data();
    const likedBy = data.likedBy || [];
    const dislikedBy = data.dislikedBy || [];
    const userId = user.uid;

    // Hvis brukeren allerede har disliket, fjern dislike
    if (dislikedBy.includes(userId)) {
      await updateDoc(commentRef, {
        dislikes: increment(-1),
        dislikedBy: arrayRemove(userId),
      });
    } else {
      // Hvis brukeren har likt, fjern like og legg til dislike
      if (likedBy.includes(userId)) {
        await updateDoc(commentRef, {
          likes: increment(-1),
          dislikes: increment(1),
          likedBy: arrayRemove(userId),
          dislikedBy: arrayUnion(userId),
        });
      } else {
        // Legg til dislike
        await updateDoc(commentRef, {
          dislikes: increment(1),
          dislikedBy: arrayUnion(userId),
        });
      }
    }
  } catch (error: unknown) {
    safeError('Feil ved dislike av kommentar:', error);
    throw error;
  }
};

