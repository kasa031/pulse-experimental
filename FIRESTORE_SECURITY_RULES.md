# 🔒 Firestore Security Rules - Setup

## Lenke til Firestore Security Rules

**Gå direkte til:**
👉 https://console.firebase.google.com/project/pulse-oslo/firestore/rules

## Antall Secrets du har lagt til

Du har lagt til **7 secrets** i GitHub:
1. ✅ `OPENROUTER_API_KEY`
2. ✅ `FIREBASE_API_KEY`
3. ✅ `FIREBASE_AUTH_DOMAIN`
4. ✅ `FIREBASE_PROJECT_ID`
5. ✅ `FIREBASE_STORAGE_BUCKET`
6. ✅ `FIREBASE_MESSAGING_SENDER_ID`
7. ✅ `FIREBASE_APP_ID`

## Firestore Security Rules

Kopier og lim inn denne koden i Firestore Security Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function for å sjekke om bruker er autentisert
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function for å sjekke om bruker er eier
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Polls Collection - Avstemninger
    match /polls/{pollId} {
      // Alle kan lese aktive avstemninger
      allow read: if true;
      
      // Kun autentiserte brukere kan opprette/oppdatere avstemninger
      // (I produksjon, begrens dette til admin-brukere)
      allow create: if isAuthenticated();
      allow update: if isAuthenticated();
      allow delete: if false; // Ingen kan slette avstemninger
      
      // Votes Collection - Stemmer
      match /votes/{voteId} {
        // Kun eier kan lese sin egen stemme
        allow read: if isOwner(resource.data.userId);
        
        // Kun autentiserte kan opprette stemmer
        // Kun eier kan opprette stemme for seg selv
        allow create: if isAuthenticated() 
                      && request.resource.data.userId == request.auth.uid;
        
        // Ingen kan oppdatere eller slette stemmer
        allow update: if false;
        allow delete: if false;
      }
    }
    
    // Users Collection - Brukerdata (hvis du bruker dette)
    match /users/{userId} {
      // Brukere kan lese sin egen data
      allow read: if isOwner(userId);
      
      // Brukere kan opprette sin egen profil
      allow create: if isAuthenticated() 
                    && request.resource.data.uid == request.auth.uid;
      
      // Brukere kan oppdatere sin egen profil
      allow update: if isOwner(userId);
      
      // Ingen kan slette brukerdata
      allow delete: if false;
    }
    
    // Standard: Ingen tilgang til andre collections
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Steg-for-steg instruksjoner

1. **Gå til Firestore Rules:**
   👉 https://console.firebase.google.com/project/pulse-oslo/firestore/rules

2. **Klikk på "Edit rules"** (eller hvis det er første gang, klikk "Get started")

3. **Erstatt all eksisterende kode** med reglene over

4. **Klikk "Publish"** for å publisere reglene

5. **Vent 1-2 minutter** - reglene aktiveres automatisk

## Test Rules

Etter at reglene er publisert, kan du teste dem:
- Gå til "Rules Playground" i Firebase Console
- Test forskjellige scenarier

## Viktig

- ✅ **I test mode:** Alle kan lese/skrive (ikke anbefalt for produksjon)
- ✅ **Med disse reglene:** Kun autentiserte brukere kan stemme
- ✅ **Stemmer kan ikke endres:** Når du har stemt, kan du ikke stemme igjen

## Troubleshooting

**Hvis du får feil:**
- Sjekk at du er innlogget på riktig Firebase-prosjekt
- Verifiser at prosjekt-ID er "pulse-oslo"
- Sjekk at Firestore Database er aktivert

