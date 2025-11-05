/**
 * Nyhetsfeed Service - Planlagt struktur for fremtidig implementering
 * 
 * Dette er en planleggingsfil for nyhetsfeed-funksjonalitet.
 * Implementeringen vil komme i en senere fase.
 */

import { db } from './firebase';
import { collection, query, where, getDocs, orderBy, limit, Timestamp } from 'firebase/firestore';

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
 * 
 * TODO: Implementer når nyhetsfeed er klar
 */
export const getLatestNews = async (limitCount: number = 10): Promise<NewsItem[]> => {
  // TODO: Implementer når Firestore collection 'news' er opprettet
  // const newsRef = collection(db, 'news');
  // const q = query(
  //   newsRef,
  //   where('publishedAt', '<=', Timestamp.now()),
  //   orderBy('publishedAt', 'desc'),
  //   limit(limitCount)
  // );
  // const snapshot = await getDocs(q);
  // return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewsItem));
  
  return [];
};

/**
 * Hent nyheter for en spesifikk bydel
 * 
 * TODO: Implementer når nyhetsfeed er klar
 */
export const getNewsByDistrict = async (district: string, limitCount: number = 10): Promise<NewsItem[]> => {
  // TODO: Implementer
  return [];
};

/**
 * Hent nyheter for en kategori
 * 
 * TODO: Implementer når nyhetsfeed er klar
 */
export const getNewsByCategory = async (category: NewsItem['category'], limitCount: number = 10): Promise<NewsItem[]> => {
  // TODO: Implementer
  return [];
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

