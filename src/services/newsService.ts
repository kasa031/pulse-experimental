/**
 * Nyhetsfeed Service
 * Håndterer henting av nyheter fra Firestore
 */

import { db } from './firebase';
import { collection, query, where, getDocs, orderBy, limit, Timestamp } from 'firebase/firestore';
import { safeError } from '../utils/performance';

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  summary?: string;
  author: string;
  publishedAt: Timestamp | Date;
  category: 'politikk' | 'transport' | 'miljø' | 'byutvikling' | 'nyheter' | 'annonsering';
  district?: string;
  imageUrl?: string;
  linkUrl?: string;
  priority: 'normal' | 'high' | 'urgent';
}

/**
 * Hent siste nyheter fra Oslo
 */
export const getLatestNews = async (limitCount: number = 10): Promise<NewsItem[]> => {
  try {
    if (!db) {
      throw new Error('Firebase Firestore er ikke initialisert');
    }
    const newsRef = collection(db, 'news');
    const now = Timestamp.now();
    const q = query(
      newsRef,
      where('publishedAt', '<=', now),
      orderBy('publishedAt', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      publishedAt: doc.data().publishedAt || Timestamp.now(),
    } as NewsItem));
  } catch (error) {
    safeError('Feil ved henting av nyheter:', error);
    return [];
  }
};

/**
 * Hent nyheter for en spesifikk bydel
 */
export const getNewsByDistrict = async (district: string, limitCount: number = 10): Promise<NewsItem[]> => {
  try {
    if (!db) {
      throw new Error('Firebase Firestore er ikke initialisert');
    }
    const newsRef = collection(db, 'news');
    const now = Timestamp.now();
    const q = query(
      newsRef,
      where('district', '==', district),
      where('publishedAt', '<=', now),
      orderBy('publishedAt', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      publishedAt: doc.data().publishedAt || Timestamp.now(),
    } as NewsItem));
  } catch (error) {
    safeError('Feil ved henting av nyheter for bydel:', error);
    return [];
  }
};

/**
 * Hent nyheter for en kategori
 */
export const getNewsByCategory = async (category: NewsItem['category'], limitCount: number = 10): Promise<NewsItem[]> => {
  try {
    if (!db) {
      throw new Error('Firebase Firestore er ikke initialisert');
    }
    const newsRef = collection(db, 'news');
    const now = Timestamp.now();
    const q = query(
      newsRef,
      where('category', '==', category),
      where('publishedAt', '<=', now),
      orderBy('publishedAt', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      publishedAt: doc.data().publishedAt || Timestamp.now(),
    } as NewsItem));
  } catch (error) {
    safeError('Feil ved henting av nyheter for kategori:', error);
    return [];
  }
};

/**
 * Søk i nyheter
 */
export const searchNews = async (searchQuery: string, limitCount: number = 20): Promise<NewsItem[]> => {
  try {
    if (!db) {
      throw new Error('Firebase Firestore er ikke initialisert');
    }
    
    const newsRef = collection(db, 'news');
    const now = Timestamp.now();
    const q = query(
      newsRef,
      where('publishedAt', '<=', now),
      orderBy('publishedAt', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    const allNews = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      publishedAt: doc.data().publishedAt || Timestamp.now(),
    } as NewsItem));
    
    // Filtrer basert på søkeord (klient-side filtrering)
    const queryLower = searchQuery.toLowerCase();
    return allNews.filter(news => 
      news.title.toLowerCase().includes(queryLower) ||
      news.content.toLowerCase().includes(queryLower) ||
      news.summary?.toLowerCase().includes(queryLower)
    );
  } catch (error) {
    safeError('Error searching news:', error);
    return [];
  }
};

/**
 * Sorter nyheter
 */
export const sortNews = (news: NewsItem[], sortBy: 'newest' | 'oldest' | 'relevance'): NewsItem[] => {
  const sorted = [...news];
  
  switch (sortBy) {
    case 'newest':
      return sorted.sort((a, b) => {
        const aDate = a.publishedAt instanceof Timestamp ? a.publishedAt.toMillis() : new Date(a.publishedAt).getTime();
        const bDate = b.publishedAt instanceof Timestamp ? b.publishedAt.toMillis() : new Date(b.publishedAt).getTime();
        return bDate - aDate;
      });
    case 'oldest':
      return sorted.sort((a, b) => {
        const aDate = a.publishedAt instanceof Timestamp ? a.publishedAt.toMillis() : new Date(a.publishedAt).getTime();
        const bDate = b.publishedAt instanceof Timestamp ? b.publishedAt.toMillis() : new Date(b.publishedAt).getTime();
        return aDate - bDate;
      });
    case 'relevance':
      // Sorter etter priority først, deretter dato
      return sorted.sort((a, b) => {
        const priorityOrder = { urgent: 3, high: 2, normal: 1 };
        const priorityDiff = (priorityOrder[b.priority] || 1) - (priorityOrder[a.priority] || 1);
        if (priorityDiff !== 0) return priorityDiff;
        
        const aDate = a.publishedAt instanceof Timestamp ? a.publishedAt.toMillis() : new Date(a.publishedAt).getTime();
        const bDate = b.publishedAt instanceof Timestamp ? b.publishedAt.toMillis() : new Date(b.publishedAt).getTime();
        return bDate - aDate;
      });
    default:
      return sorted;
  }
};

