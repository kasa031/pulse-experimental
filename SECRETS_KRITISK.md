# 🚨 KRITISK: Secrets Eksponert - Handlingsplan

## ⚠️ VIKTIG: Secrets er eksponert i GitHub!

GitHub Secret Scanning har oppdaget at API-nøkler er eksponert i repositoryet.

### Eksponerte Secrets:
1. **OpenRouter API Key** - i `SETUP_GITHUB_SECRETS.md`
2. **Firebase API Key** - i `src/services/firebase.ts` (mulig)

## 🔧 Umiddelbar handling nødvendig:

### 1. Roter API-nøkler (KRITISK!)
**Disse nøklene må gjøres ugyldige og erstattes med nye:**

#### OpenRouter API Key:
1. Gå til: https://openrouter.ai/keys
2. Slett eller deaktiver den eksponerte nøkkelen
3. Opprett en ny API key
4. Oppdater `app.local.json` med ny nøkkel

#### Firebase API Key:
1. Gå til: https://console.firebase.google.com/project/pulse-oslo/settings/general
2. Under "Your apps" → Web app
3. Du kan ikke rotere Firebase API keys direkte, men:
   - Begrens API key restrictions i Google Cloud Console
   - Vurder å opprette en ny Firebase app hvis nødvendig

### 2. Fjern eksponerte secrets fra kode
✅ Dette er allerede gjort - secrets er fjernet fra dokumentasjonsfiler

### 3. Sett opp GitHub Secrets
Gå til: **https://github.com/kasa031/pulse-experimental/settings/secrets/actions**

Legg til disse secrets (med NYE nøkler hvis du roterte):

#### Secret 1: FIREBASE_API_KEY
- **Name:** `FIREBASE_API_KEY`
- **Value:** [Fra Firebase Console → Project Settings → Your apps → Web app → apiKey]

#### Secret 2: FIREBASE_AUTH_DOMAIN
- **Name:** `FIREBASE_AUTH_DOMAIN`
- **Value:** `pulse-oslo.firebaseapp.com`

#### Secret 3: FIREBASE_PROJECT_ID
- **Name:** `FIREBASE_PROJECT_ID`
- **Value:** `pulse-oslo`

#### Secret 4: FIREBASE_STORAGE_BUCKET
- **Name:** `FIREBASE_STORAGE_BUCKET`
- **Value:** `pulse-oslo.firebasestorage.app`

#### Secret 5: FIREBASE_MESSAGING_SENDER_ID
- **Name:** `FIREBASE_MESSAGING_SENDER_ID`
- **Value:** [Fra Firebase Console → Project Settings → Your apps → Web app → messagingSenderId]

#### Secret 6: FIREBASE_APP_ID
- **Name:** `FIREBASE_APP_ID`
- **Value:** [Fra Firebase Console → Project Settings → Your apps → Web app → appId]

#### Secret 7: OPENROUTER_API_KEY (Valgfritt)
- **Name:** `OPENROUTER_API_KEY`
- **Value:** [Ny API key fra OpenRouter dashboard]

### 4. Håndter GitHub Security Alerts
1. Gå til: **https://github.com/kasa031/pulse-experimental/security**
2. Klikk på "Secret scanning alerts"
3. For hver eksponert secret:
   - Klikk på alerten
   - Velg "Mark as resolved" eller "Revoke secret"
   - Hvis du har rotert nøkkelen, velg "Revoke secret"

### 5. Sjekk git-historikk
Disse secrets kan være i git-historikken. Vurder å:
- Bruke `git filter-branch` eller `git filter-repo` for å fjerne secrets fra historikken
- Eller akseptere at de er eksponert og fokusere på å rotere nøklene

## 📋 Direkte lenker:

- **GitHub Secrets:** https://github.com/kasa031/pulse-experimental/settings/secrets/actions
- **GitHub Security:** https://github.com/kasa031/pulse-experimental/security
- **Secret Scanning Alerts:** https://github.com/kasa031/pulse-experimental/security/secret-scanning
- **Firebase Console:** https://console.firebase.google.com/project/pulse-oslo/settings/general
- **OpenRouter Keys:** https://openrouter.ai/keys

## ✅ Status:
- ✅ Secrets fjernet fra dokumentasjonsfiler
- ⚠️ Du må rotere API-nøkler
- ⚠️ Du må legge til secrets i GitHub
- ⚠️ Du må håndtere security alerts

