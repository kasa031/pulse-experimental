/**
 * Oslo News Importer Service
 * Håndterer import av nyheter om Oslo fra RSS-feeds og AI-generering
 */

import { db } from './firebase';
import { collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { safeError, safeLog } from '../utils/performance';
import { NewsItem } from './newsService';
import Constants from 'expo-constants';

// Oslo kommunes RSS feeds
const OSLO_RSS_FEEDS = [
  'https://www.oslo.kommune.no/rss/nyheter/',
  'https://www.oslo.kommune.no/rss/politikk-og-administrasjon/',
  'https://www.oslo.kommune.no/rss/byutvikling/',
  'https://www.oslo.kommune.no/rss/helse-og-omsorg/',
  'https://www.oslo.kommune.no/rss/kultur-og-fritid/',
];

interface RSSItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  category?: string;
}

/**
 * Parse RSS feed XML
 */
const parseRSSFeed = async (feedUrl: string): Promise<RSSItem[]> => {
  try {
    const response = await fetch(feedUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const xmlText = await response.text();
    
    // Simple XML parsing (kan forbedres med en XML parser)
    const items: RSSItem[] = [];
    const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;
    const matches = xmlText.matchAll(itemRegex);
    
    for (const match of matches) {
      const itemContent = match[1];
      const titleMatch = itemContent.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      const descMatch = itemContent.match(/<description[^>]*>([\s\S]*?)<\/description>/i);
      const linkMatch = itemContent.match(/<link[^>]*>([\s\S]*?)<\/link>/i);
      const dateMatch = itemContent.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i);
      const categoryMatch = itemContent.match(/<category[^>]*>([\s\S]*?)<\/category>/i);
      
      if (titleMatch && descMatch && linkMatch) {
        items.push({
          title: titleMatch[1].trim().replace(/<[^>]*>/g, ''),
          description: descMatch[1].trim().replace(/<[^>]*>/g, ''),
          link: linkMatch[1].trim(),
          pubDate: dateMatch ? dateMatch[1].trim() : new Date().toISOString(),
          category: categoryMatch ? categoryMatch[1].trim() : undefined,
        });
      }
    }
    
    return items;
  } catch (error) {
    safeError('Feil ved parsing av RSS feed:', error);
    return [];
  }
};

/**
 * Kategoriser nyhet basert på innhold
 */
const categorizeNews = (title: string, description: string): NewsItem['category'] => {
  const text = (title + ' ' + description).toLowerCase();
  
  if (text.includes('transport') || text.includes('kollektiv') || text.includes('buss') || text.includes('trikk') || text.includes('t-bane')) {
    return 'transport';
  }
  if (text.includes('miljø') || text.includes('klima') || text.includes('grønn') || text.includes('utslipp')) {
    return 'miljø';
  }
  if (text.includes('byutvikling') || text.includes('bygge') || text.includes('utbygging') || text.includes('plan')) {
    return 'byutvikling';
  }
  if (text.includes('politikk') || text.includes('byråd') || text.includes('kommune')) {
    return 'politikk';
  }
  return 'nyheter';
};

/**
 * Generer nyhet med AI (hvis API key er tilgjengelig)
 */
const generateNewsWithAI = async (topic: string): Promise<Partial<NewsItem> | null> => {
  try {
    const extra = Constants.expoConfig?.extra;
    const apiKey = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY || extra?.openrouterApiKey;
    
    if (!apiKey || apiKey === 'DIN_OPENROUTER_API_KEY_HER') {
      safeLog('OpenRouter API key ikke konfigurert. Hopper over AI-generering.');
      return null;
    }
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://github.com/pulse-oslo',
        'X-Title': 'OsloPuls News Generator',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Du er en nyhetsjournalist som skriver om Oslo. Skriv korte, informative nyheter basert på emnet. Fokuser på fakta og relevans for Oslo-borgere.',
          },
          {
            role: 'user',
            content: `Skriv en kort nyhet om: ${topic}. Maks 200 ord. Inkluder tittel, innhold og et kort sammendrag.`,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`);
    }
    
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      return null;
    }
    
    // Parse AI response (enkel parsing)
    const lines = content.split('\n').filter(l => l.trim());
    const title = lines[0]?.replace(/^#+\s*/, '') || topic;
    const summary = lines[1] || '';
    const fullContent = lines.slice(2).join('\n') || content;
    
    return {
      title: title.substring(0, 200),
      content: fullContent.substring(0, 2000),
      summary: summary.substring(0, 300),
      author: 'OsloPuls AI',
    };
  } catch (error) {
    safeError('Feil ved AI-generering av nyhet:', error);
    return null;
  }
};

/**
 * Importer nyheter fra RSS feeds
 */
export const importNewsFromRSS = async (): Promise<number> => {
  try {
    if (!db) {
      throw new Error('Firebase Firestore er ikke initialisert');
    }
    
    let importedCount = 0;
    const newsRef = collection(db, 'news');
    
    // Sjekk eksisterende nyheter for å unngå duplikater
    const existingNews = await getDocs(newsRef);
    const existingLinks = new Set(
      existingNews.docs.map(doc => doc.data().linkUrl).filter(Boolean)
    );
    
    for (const feedUrl of OSLO_RSS_FEEDS) {
      try {
        const items = await parseRSSFeed(feedUrl);
        
        for (const item of items) {
          // Sjekk om nyheten allerede finnes
          if (existingLinks.has(item.link)) {
            continue;
          }
          
          const category = categorizeNews(item.title, item.description);
          const publishedAt = new Date(item.pubDate);
          
          // Lag nyhet
          const newsItem: Omit<NewsItem, 'id'> = {
            title: item.title.substring(0, 200),
            content: item.description.substring(0, 2000),
            summary: item.description.substring(0, 300),
            author: 'Oslo kommune',
            publishedAt: Timestamp.fromDate(publishedAt),
            category,
            linkUrl: item.link,
            priority: 'normal',
          };
          
          await addDoc(newsRef, {
            ...newsItem,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          });
          
          importedCount++;
          safeLog(`Importert nyhet: ${item.title.substring(0, 50)}...`);
        }
      } catch (error) {
        safeError(`Feil ved import fra ${feedUrl}:`, error);
      }
    }
    
    return importedCount;
  } catch (error) {
    safeError('Feil ved import av nyheter:', error);
    throw error;
  }
};

/**
 * Generer og importer AI-genererte nyheter om Oslo
 */
export const generateAndImportAINews = async (topics: string[]): Promise<number> => {
  try {
    if (!db) {
      throw new Error('Firebase Firestore er ikke initialisert');
    }
    
    let importedCount = 0;
    const newsRef = collection(db, 'news');
    
    for (const topic of topics) {
      try {
        const aiNews = await generateNewsWithAI(topic);
        
        if (!aiNews || !aiNews.title) {
          continue;
        }
        
        // Sjekk om nyheten allerede finnes
        const existingQuery = query(
          newsRef,
          where('title', '==', aiNews.title)
        );
        const existing = await getDocs(existingQuery);
        
        if (!existing.empty) {
          continue;
        }
        
        const category = categorizeNews(aiNews.title, aiNews.content || '');
        
        const newsItem: Omit<NewsItem, 'id'> = {
          title: aiNews.title,
          content: aiNews.content || '',
          summary: aiNews.summary,
          author: aiNews.author || 'OsloPuls AI',
          publishedAt: Timestamp.now(),
          category,
          priority: 'normal',
        };
        
        await addDoc(newsRef, {
          ...newsItem,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
        
        importedCount++;
        safeLog(`Generert og importert AI-nyhet: ${aiNews.title.substring(0, 50)}...`);
      } catch (error) {
        safeError(`Feil ved generering av nyhet om ${topic}:`, error);
      }
    }
    
    return importedCount;
  } catch (error) {
    safeError('Feil ved AI-generering og import av nyheter:', error);
    throw error;
  }
};

/**
 * Foreslåtte emner for AI-generering basert på Oslo-nyheter
 */
export const getSuggestedTopics = (): string[] => {
  return [
    'Oslo byutvikling og nye prosjekter',
    'Kollektivtransport i Oslo',
    'Miljøtiltak i Oslo',
    'Kulturarrangementer i Oslo',
    'Helse og omsorg i Oslo',
    'Lokaldemokrati i Oslo',
    'Bydelsutvikling i Oslo',
    'Grønn omstilling i Oslo',
  ];
};

