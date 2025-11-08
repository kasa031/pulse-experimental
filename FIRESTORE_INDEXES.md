# Firestore Indekser - Opprettelsesguide

## ⚠️ Viktig: Disse indeksene MÅ opprettes i Firebase Console

Firestore krever composite indexes når du bruker `where()` sammen med `orderBy()` på forskjellige felt.

## 📋 Nødvendige Indekser

### 1. Polls Collection

#### Indeks 1: Aktive avstemninger sortert etter startdato
- **Collection**: `polls`
- **Fields**:
  - `isActive` (Ascending)
  - `startDate` (Descending)
- **Query**: `where('isActive', '==', true) + orderBy('startDate', 'desc')`
- **Brukt i**: `getActivePolls()`, `subscribeToPolls()`

#### Indeks 2: Avsluttede avstemninger sortert etter sluttdato
- **Collection**: `polls`
- **Fields**:
  - `endDate` (Ascending)
  - `endDate` (Descending) - for orderBy
- **Query**: `where('endDate', '<=', now) + orderBy('endDate', 'desc')`
- **Brukt i**: `getCompletedPollResults()`

### 2. Votes Collection

#### Indeks 3: Brukerens stemmehistorikk
- **Collection**: `votes`
- **Fields**:
  - `userId` (Ascending)
  - `votedAt` (Descending)
- **Query**: `where('userId', '==', userId) + orderBy('votedAt', 'desc')`
- **Brukt i**: `getUserVotingHistory()`

**Note**: Hvis `votedAt` ikke eksisterer på gamle dokumenter, bruk `timestamp` i stedet.

### 3. News Collection

#### Indeks 4: Nyheter sortert etter publiseringsdato
- **Collection**: `news`
- **Fields**:
  - `publishedAt` (Ascending)
  - `publishedAt` (Descending) - for orderBy
- **Query**: `where('publishedAt', '<=', now) + orderBy('publishedAt', 'desc')`
- **Brukt i**: `getLatestNews()`

#### Indeks 5: Nyheter for bydel
- **Collection**: `news`
- **Fields**:
  - `district` (Ascending)
  - `publishedAt` (Ascending)
  - `publishedAt` (Descending) - for orderBy
- **Query**: `where('district', '==', district) + where('publishedAt', '<=', now) + orderBy('publishedAt', 'desc')`
- **Brukt i**: `getNewsByDistrict()`

#### Indeks 6: Nyheter for kategori
- **Collection**: `news`
- **Fields**:
  - `category` (Ascending)
  - `publishedAt` (Ascending)
  - `publishedAt` (Descending) - for orderBy
- **Query**: `where('category', '==', category) + where('publishedAt', '<=', now) + orderBy('publishedAt', 'desc')`
- **Brukt i**: `getNewsByCategory()`

### 4. Discussions Collection

#### Indeks 7: Diskusjoner sortert etter opprettelsesdato
- **Collection**: `discussions`
- **Fields**:
  - `createdAt` (Descending)
- **Query**: `orderBy('createdAt', 'desc')`
- **Brukt i**: `getDiscussions()`
- **Note**: Dette trenger ikke composite index siden det bare er orderBy

#### Indeks 8: Diskusjoner for kategori
- **Collection**: `discussions`
- **Fields**:
  - `category` (Ascending)
  - `createdAt` (Descending)
- **Query**: `where('category', '==', category) + orderBy('createdAt', 'desc')`
- **Brukt i**: `getDiscussionsByCategory()`

## 🚀 Hvordan opprette indekser

### Metode 1: Automatisk (anbefalt)
1. Kjør appen og utfør en query som trenger indeks
2. Firebase vil gi deg en feilmelding med en lenke
3. Klikk på lenken for å opprette indeksen automatisk

### Metode 2: Manuelt i Firebase Console
1. Gå til [Firebase Console](https://console.firebase.google.com/)
2. Velg ditt prosjekt
3. Gå til **Firestore Database** → **Indexes**
4. Klikk **Create Index**
5. Fyll ut feltene som beskrevet over
6. Klikk **Create**

### Metode 3: firestore.indexes.json (for CI/CD)
Opprett en `firestore.indexes.json` fil i prosjektroten:

```json
{
  "indexes": [
    {
      "collectionGroup": "polls",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "isActive",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "startDate",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "polls",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "endDate",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "endDate",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "votes",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "userId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "votedAt",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "news",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "publishedAt",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "publishedAt",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "news",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "district",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "publishedAt",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "publishedAt",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "news",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "category",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "publishedAt",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "publishedAt",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "discussions",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "category",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAt",
          "order": "DESCENDING"
        }
      ]
    }
  ],
  "fieldOverrides": []
}
```

Deretter deploy:
```bash
firebase deploy --only firestore:indexes
```

## ✅ Verifisering

Etter at indeksene er opprettet, kan det ta noen minutter før de er aktive. Du kan sjekke status i Firebase Console under **Indexes** tab.

## ⚠️ Feilmeldinger å se etter

Hvis du får feilmeldinger som:
- `The query requires an index`
- `index not found`

Betyr det at indeksen mangler eller ikke er ferdig bygget. Følg instruksjonene over for å opprette den.

