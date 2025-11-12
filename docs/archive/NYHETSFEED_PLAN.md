# 📰 Nyhetsfeed - Planlegging

## Oversikt

Planlagt struktur for nyhetsfeed-funksjonalitet i Pulse Oslo appen.

## Firestore Struktur

### Collection: `news`

```typescript
interface NewsItem {
  id: string;
  title: string;
  content: string;
  summary?: string;
  author: string;
  publishedAt: Timestamp;
  category: 'politikk' | 'transport' | 'miljø' | 'byutvikling' | 'nyheter' | 'annonsering';
  district?: string;
  imageUrl?: string;
  linkUrl?: string;
  priority: 'normal' | 'high' | 'urgent';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## Features (Planlagt)

### Fase 1: Grunnleggende struktur
- [ ] Firestore collection `news` opprettet
- [ ] Security Rules for news collection
- [ ] Basic news service (`src/services/newsService.ts`)
- [ ] News screen component (`src/screens/NewsScreen.tsx`)
- [ ] Integrering i HomeScreen

### Fase 2: Data-kilder
- [ ] RSS feed integrasjon fra Oslo kommunes nettsider
- [ ] Manuell nyhetsredigering via admin-panel
- [ ] Automatisk oppdatering via cron job / Cloud Functions

### Fase 3: Avansert funksjonalitet
- [ ] Kategorisering med AI (OpenRouter API)
- [ ] Push-notifikasjoner for viktige nyheter
- [ ] Filtrering etter bydel
- [ ] Søk i nyheter
- [ ] Favoritt-nyheter
- [ ] Deling av nyheter

## Firestore Security Rules

```javascript
match /news/{newsId} {
  // Alle kan lese publiserte nyheter
  allow read: if resource.data.publishedAt <= request.time;
  
  // Kun autentiserte admin-brukere kan opprette/oppdatere
  allow create: if request.auth != null && 
                   request.auth.token.admin == true;
  allow update: if request.auth != null && 
                   request.auth.token.admin == true;
  allow delete: if false; // Ingen kan slette
}
```

## Implementering

### Steg 1: Opprett Firestore Collection
1. Gå til Firebase Console
2. Opprett collection `news`
3. Legg til eksempel-dokumenter for testing

### Steg 2: Implementer Service
- `src/services/newsService.ts` er allerede opprettet med struktur
- Implementer `getLatestNews()`, `getNewsByDistrict()`, etc.

### Steg 3: Opprett News Screen
- Ny screen: `src/screens/NewsScreen.tsx`
- Liste med nyheter
- Detaljvisning
- Filtrering og søk

### Steg 4: Integrer i App
- Legg til "Nyheter"-tab i navigation
- Oppdater HomeScreen med nyhets-preview
- Legg til pull-to-refresh

## Data-kilder (Fremtidig)

### Potensielle RSS-feeds:
- Oslo kommunes nyheter: https://www.oslo.kommune.no/aktuelt/
- Ruter: https://www.ruter.no/aktuelt/
- Bymiljøetaten: https://www.oslo.kommune.no/bymiljoetaten/

### Automatisering:
- Cloud Function som henter fra RSS hver time
- AI-kategorisering med OpenRouter API
- Automatisk lagring i Firestore

## Status

✅ Struktur planlagt
✅ Service-fil opprettet med interfaces
⏳ Implementering venter på prioritering

