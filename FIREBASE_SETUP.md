# Firebase Setup Guide

## ⚠️ VIKTIG: Legg til dine Firebase credentials

For at appen skal fungere, må du legge til dine Firebase credentials i `app.json`.

### Steg 1: Hent Firebase credentials

1. Gå til [Firebase Console](https://console.firebase.google.com/)
2. Velg prosjektet ditt (eller opprett et nytt)
3. Gå til Project Settings (⚙️)
4. Scroll ned til "Your apps" og velg web-app (</>) eller opprett en ny
5. Kopier konfigurasjonsverdiene

### Steg 2: Legg til i app.json

Åpne `app.json` og legg til dine faktiske Firebase credentials i `extra`-seksjonen:

```json
"extra": {
  "firebase": {
    "apiKey": "DIN_API_KEY_HER",
    "authDomain": "pulse-oslo.firebaseapp.com",
    "projectId": "pulse-oslo",
    "storageBucket": "pulse-oslo.appspot.com",
    "messagingSenderId": "DIN_SENDER_ID_HER",
    "appId": "DIN_APP_ID_HER"
  },
  "firebaseApiKey": "DIN_API_KEY_HER",
  "firebaseAuthDomain": "pulse-oslo.firebaseapp.com",
  "firebaseProjectId": "pulse-oslo",
  "firebaseStorageBucket": "pulse-oslo.appspot.com",
  "firebaseMessagingSenderId": "DIN_SENDER_ID_HER",
  "firebaseAppId": "DIN_APP_ID_HER"
}
```

### Steg 3: Firebase Security Rules

Sørg for at Firestore Security Rules er satt opp riktig:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Polls - alle kan lese, kun autentiserte kan stemme
    match /polls/{pollId} {
      allow read: if true;
      allow write: if request.auth != null;
      
      // Votes - kun eier kan lese sin egen stemme
      match /votes/{voteId} {
        allow read: if request.auth != null && request.auth.uid == resource.data.userId;
        allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
        allow update, delete: if false;
      }
    }
  }
}
```

### Steg 4: Firestore Collections

Opprett følgende collections i Firestore:

1. **polls** - Avstemninger
   - Struktur: Se `seedPolls.js` for eksempel
   
2. **votes** - Stemmer
   - Struktur: `{ pollId, userId, optionIndex, timestamp }`

### Steg 5: Test

Etter at du har lagt til credentials, restart appen:

```bash
npm start
```

### ⚠️ SIKKERHET

- **ALDRI** committ `app.json` med ekte credentials til GitHub
- Bruk `app.json.example` for eksempel
- For produksjon, vurder å bruke miljøvariabler eller Expo Secrets

