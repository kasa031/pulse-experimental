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
 * Planlagt struktur for nyhetsfeed:
 * 
 * Firestore Collection: 'news'
 * 
 * Dokumentstruktur:
 * {
 *   title: string,
 *   content: string,
 *   summary?: string,
 *   author: string,
 *   publishedAt: Timestamp,
 *   category: 'politikk' | 'transport' | 'miljø' | 'byutvikling' | 'nyheter' | 'annonsering',
 *   district?: string,
 *   imageUrl?: string,
 *   linkUrl?: string,
 *   priority: 'normal' | 'high' | 'urgent',
 *   createdAt: Timestamp,
 *   updatedAt: Timestamp,
 * }
 * 
 * Fremtidige features:
 * - RSS feed integrasjon fra Oslo kommunes nettsider
 * - Automatisk kategorisering med AI
 * - Push-notifikasjoner for viktige nyheter
 * - Filtrering etter bydel
 * - Søk i nyheter
 */

