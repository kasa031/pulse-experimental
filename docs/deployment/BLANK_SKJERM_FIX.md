# 🔧 Fix for Blank Hvit Skjerm på Mobil

## Problem
Blank hvit skjerm når man åpner GitHub Pages URL på mobil.

## Mulige årsaker

### 1. Firebase API-nøkler mangler eller er placeholders ⚠️ KRITISK
**Symptom:** Blank hvit skjerm, ingen feilmelding

**Løsning:**
- Sjekk at alle Firebase Secrets er satt i GitHub:
  - Gå til: https://github.com/kasa031/pulse-experimental/settings/secrets/actions
  - Sjekk at disse er satt:
    - `FIREBASE_API_KEY`
    - `FIREBASE_AUTH_DOMAIN`
    - `FIREBASE_PROJECT_ID`
    - `FIREBASE_STORAGE_BUCKET`
    - `FIREBASE_MESSAGING_SENDER_ID`
    - `FIREBASE_APP_ID`

### 2. Firebase initialisering feiler stille
**Symptom:** Appen starter, men Firebase feiler uten feilmelding

**Løsning:** ✅ Fikset i `src/services/firebase.ts`
- Lagt til validering av Firebase config
- Bedre error handling
- Viser feilmelding hvis Firebase ikke initialiseres

### 3. JavaScript errors i konsollen
**Symptom:** Blank skjerm, errors i browser console

**Sjekk:**
1. Åpne browser console (F12 på desktop, eller developer tools på mobil)
2. Se etter røde feilmeldinger
3. Sjekk Network tab for failed requests

### 4. Build feilet
**Symptom:** Ingen filer i dist/ eller web-build/

**Sjekk:**
1. Gå til: https://github.com/kasa031/pulse-experimental/actions
2. Se siste deployment
3. Sjekk "Build web" steget for feil

### 5. Cache problem
**Symptom:** Gammel versjon vises eller blank skjerm

**Løsning:**
- Tøm cache på mobilen
- Hard refresh (iPhone: Safari → Share → Request Desktop Site)
- Prøv i inkognito-vindu

## Implementerte fixes

### ✅ Bedre Firebase error handling
- Validerer Firebase config før initialisering
- Viser tydelig feilmelding hvis config er ugyldig
- Eksporterer `firebaseInitialized` og `getFirebaseError()` for debugging

### ✅ Error screen i App.tsx
- Viser feilmelding hvis Firebase ikke initialiseres
- Gir instruksjoner for å fikse problemet
- "Last på nytt" knapp

### ✅ Null-sjekker
- Sjekker at `auth` og `db` ikke er null før bruk
- Forhindrer crashes ved ugyldig config

## Testing

### Steg 1: Sjekk GitHub Secrets
1. Gå til: https://github.com/kasa031/pulse-experimental/settings/secrets/actions
2. Verifiser at alle Firebase Secrets er satt
3. Hvis ikke, legg dem til

### Steg 2: Trigger ny deployment
1. Gå til: https://github.com/kasa031/pulse-experimental/actions
2. Klikk "Deploy to GitHub Pages"
3. Klikk "Run workflow" → "Run workflow"
4. Vent 2-3 minutter

### Steg 3: Test på mobil
1. Tøm cache
2. Åpne: https://kasa031.github.io/pulse-experimental/
3. Hvis du ser "Konfigurasjonsfeil" → Firebase Secrets mangler
4. Hvis du ser blank skjerm → Sjekk browser console for errors

## Debugging

### Åpne console på mobil

**iPhone (Safari):**
1. Settings → Safari → Advanced → Web Inspector (ON)
2. Koble iPhone til Mac
3. Mac: Safari → Develop → [Din iPhone] → [URL]

**Android (Chrome):**
1. Åpne Chrome på PC
2. Gå til: chrome://inspect
3. Åpne URL på mobil
4. Klikk "inspect" på PC

### Sjekk for errors
- Røde feilmeldinger i console
- Failed network requests
- Firebase initialization errors

## Hvis problemet fortsatt eksisterer

1. **Sjekk browser console** for spesifikke feilmeldinger
2. **Sjekk Network tab** for failed requests
3. **Sjekk GitHub Actions log** for build errors
4. **Verifiser GitHub Secrets** er satt riktig
5. **Test lokalt** med `npm run web` for å se om problemet er deployment-spesifikt

## Neste steg

Hvis du fortsatt får blank skjerm etter å ha sjekket alt over:
1. Ta screenshot av browser console
2. Ta screenshot av Network tab
3. Ta screenshot av GitHub Actions log
4. Rapporter problemet med disse screenshots

