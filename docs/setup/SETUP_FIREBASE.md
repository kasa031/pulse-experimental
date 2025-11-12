# 🔥 Firebase Setup - Enkel Guide

## Steg-for-steg instruksjoner

### 1. Gå til Firebase Console
Åpne: https://console.firebase.google.com/

### 2. Velg eller opprett prosjekt
- Hvis du har et prosjekt: Velg det
- Hvis ikke: Klikk "Add project" → Gi det navnet "pulse-oslo"

### 3. Hent Web App credentials
1. Klikk på ⚙️ (Settings) → "Project settings"
2. Scroll ned til "Your apps"
3. Klikk på ikonet </> (Web)
4. Hvis du ikke har en web-app: Klikk "Add app" → Velg Web
5. Gi appen navnet "Pulse Oslo" (eller hva du vil)
6. **KRYSS AV** "Also set up Firebase Hosting" (ikke nødvendig nå)
7. Klikk "Register app"

### 4. Kopier credentials
Du vil nå se en konfigurasjon som ser slik ut:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "pulse-oslo.firebaseapp.com",
  projectId: "pulse-oslo",
  storageBucket: "pulse-oslo.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

### 5. Legg til i app.json
Åpne `app.json` og erstatt disse verdiene i `extra.firebase` og individuelle felter:

- `"LEGG_TIL_DIN_FIREBASE_API_KEY"` → `apiKey` fra Firebase
- `"LEGG_TIL_DIN_MESSAGING_SENDER_ID"` → `messagingSenderId` fra Firebase  
- `"LEGG_TIL_DIN_APP_ID"` → `appId` fra Firebase

**Eksempel:**
```json
"firebase": {
  "apiKey": "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "authDomain": "pulse-oslo.firebaseapp.com",
  "projectId": "pulse-oslo",
  "storageBucket": "pulse-oslo.appspot.com",
  "messagingSenderId": "123456789012",
  "appId": "1:123456789012:web:abcdef1234567890"
}
```

### 6. Aktiver Firestore Database
1. I Firebase Console: Gå til "Firestore Database"
2. Klikk "Create database"
3. Velg "Start in test mode" (for testing)
4. Velg lokasjon (f.eks. "europe-west1")
5. Klikk "Enable"

### 7. (Valgfritt) Sett opp Authentication
1. Gå til "Authentication" → "Get started"
2. Klikk "Email/Password"
3. Aktiver "Email/Password"
4. Klikk "Save"

### 8. Test appen
```bash
npm start
```

## 🎯 Hva du trenger

Du trenger bare disse 3 verdiene fra Firebase:
1. **apiKey** - Den lange strengen som starter med "AIza..."
2. **messagingSenderId** - Et tall (f.eks. "123456789012")
3. **appId** - En streng som ser ut som "1:123456789012:web:..."

De andre verdiene (`authDomain`, `projectId`, `storageBucket`) er allerede riktig i `app.json` basert på prosjektnavnet "pulse-oslo".

## ⚠️ HUSK
- **ALDRI** committ `app.json` med ekte credentials til GitHub!
- Se `COMMIT_CHECKLIST.md` før du committer

