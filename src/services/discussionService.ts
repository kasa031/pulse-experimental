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
import { sanitizeText } from '../utils/validation';

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
 * Hent alle diskusjoner fra Firestore
 * 
 * @param limitCount - Maksimalt antall diskusjoner å hente (standard: 20)
 * @returns Array med Discussion-objekter, sortert etter opprettelsesdato (nyeste først)
 * 
 * @example
 * ```typescript
 * const discussions = await getDiscussions(10);
 * ```
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
 * Opprett en ny diskusjon i Firestore
 * 
 * @param title - Tittel på diskusjonen (maks 200 tegn, sanitized)
 * @param content - Innholdet i diskusjonen (maks 2000 tegn, sanitized)
 * @param category - Kategori for diskusjonen
 * @param district - Bydel (valgfritt)
 * @returns ID til den opprettede diskusjonen
 * @throws Error hvis bruker ikke er innlogget eller database ikke er tilgjengelig
 * 
 * @example
 * ```typescript
 * const discussionId = await createDiscussion(
 *   'Ny park i byen',
 *   'Jeg synes vi trenger en ny park...',
 *   'miljø',
 *   'Grünerløkka'
 * );
 * ```
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
      throw new Error('You must be logged in to create a discussion');
    }

    if (!db) {
      throw new Error('Database is not available');
    }

    // Get user's name
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data();
    const authorName = userData?.displayName || user.displayName || user.email?.split('@')[0] || 'Anonym';

    const discussionsRef = collection(db, 'discussions');
    const docRef = await addDoc(discussionsRef, {
      title: sanitizeText(title.trim(), 200),
      content: sanitizeText(content.trim(), 2000),
      authorId: user.uid,
      authorName: sanitizeText(authorName, 100),
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
 * Legg til en kommentar til en diskusjon
 * 
 * @param discussionId - ID til diskusjonen
 * @param content - Kommentarens innhold (maks 1000 tegn, sanitized)
 * @returns ID til den opprettede kommentaren
 * @throws Error hvis bruker ikke er innlogget eller database ikke er tilgjengelig
 * 
 * Kommentaren oppdaterer automatisk `commentCount` på diskusjonen.
 * 
 * @example
 * ```typescript
 * const commentId = await addComment('discussion123', 'Jeg er enig!');
 * ```
 */
export const addComment = async (
  discussionId: string,
  content: string
): Promise<string> => {
  try {
    const user = auth?.currentUser;
    if (!user) {
      throw new Error('You must be logged in to add a comment');
    }

    if (!db) {
      throw new Error('Database is not available');
    }

    // Get user's name
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data();
    const authorName = userData?.displayName || user.displayName || user.email?.split('@')[0] || 'Anonym';

    const commentsRef = collection(db, 'discussions', discussionId, 'comments');
    const docRef = await addDoc(commentsRef, {
      content: sanitizeText(content.trim(), 1000),
      authorId: user.uid,
      authorName: sanitizeText(authorName, 100),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Update commentCount on the discussion
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
 * Listen to real-time updates of discussions
 * 
 * @param callback - Function called when discussions are updated
 * @returns Cleanup function to unsubscribe, or empty function if db is not initialized
 * 
 * @example
 * ```ts
 * const unsubscribe = subscribeToDiscussions((discussions) => {
 *   console.log('New discussions:', discussions);
 * });
 * // When done:
 * unsubscribe();
 * ```
 * 
 * @remarks
 * Returns empty cleanup function if Firebase is not initialized.
 * This is intentional design to avoid errors when the app runs without Firebase.
 */
export const subscribeToDiscussions = (
  callback: (discussions: Discussion[]) => void
): (() => void) => {
  if (!db) {
    safeError('Database is not available');
    // Return empty cleanup function when db is not available
    // This is intentional design to avoid errors in development environment
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
 * Like a comment
 */
export const likeComment = async (discussionId: string, commentId: string): Promise<void> => {
  try {
    const user = auth?.currentUser;
    if (!user) {
      throw new Error('You must be logged in to like a comment');
    }

    if (!db) {
      throw new Error('Database is not available');
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
 * Dislike a comment
 */
export const dislikeComment = async (discussionId: string, commentId: string): Promise<void> => {
  try {
    const user = auth?.currentUser;
    if (!user) {
      throw new Error('You must be logged in to dislike a comment');
    }

    if (!db) {
      throw new Error('Database is not available');
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

