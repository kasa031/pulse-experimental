# 🔧 Android 14 (API 34) Fix - Pixel 5

## Problem
Appen lastet ikke på Pixel 5 med Android 14 (API 34).

## Løsninger Implementert

### 1. Android 14 Konfigurasjon
- Lagt til `compileSdkVersion: 34` og `targetSdkVersion: 34` i `app.json`
- Lagt til `minSdkVersion: 23` for bakoverkompatibilitet
- Lagt til nødvendige permissions (`INTERNET`, `ACCESS_NETWORK_STATE`)

### 2. Timeout for Firebase Initialisering
- 10 sekunder timeout for å unngå at appen henger
- Viser feilmelding hvis Firebase tar for lang tid
- Hjelper med å identifisere nettverksproblemer

### 3. Bedre Feilhåndtering
- Detaljerte feilmeldinger som forteller hva som er galt
- Logger hvilke Firebase-felter som mangler
- Bedre logging for debugging

### 4. Forbedret Logging
- Logger når Firebase initialiseres suksessfullt
- Logger platform (Android/iOS/Web)
- Logger detaljerte feilmeldinger

## Testing

1. **Bygg appen på nytt:**
   ```bash
   npm run android
   ```

2. **Sjekk logs:**
   - Åpne Android Studio → Logcat
   - Filtrer på "OsloPuls" eller "Firebase"
   - Se etter feilmeldinger

3. **Hvis appen fortsatt ikke laster:**
   - Sjekk at `app.local.json` har riktige Firebase credentials
   - Sjekk internettforbindelsen på telefonen
   - Prøv å starte appen på nytt
   - Sjekk Logcat for spesifikke feilmeldinger

## Vanlige Problemer

### Firebase ikke initialisert
**Feilmelding:** "Firebase er ikke initialisert. Sjekk at API-nøkler er satt riktig i app.local.json."

**Løsning:**
1. Sjekk at `app.local.json` eksisterer
2. Sjekk at alle Firebase-felter er fylt ut
3. Kjør `npm run setup-local` for å opprette filen

### Timeout
**Feilmelding:** "Appen tar for lang tid å laste. Prøv å starte på nytt eller sjekk internettforbindelsen."

**Løsning:**
1. Sjekk internettforbindelsen
2. Prøv å starte appen på nytt
3. Sjekk at Firebase-prosjektet er aktivt

### Auth ikke tilgjengelig
**Feilmelding:** "Firebase Auth er ikke tilgjengelig. Sjekk konfigurasjon."

**Løsning:**
1. Sjekk at Firebase Authentication er aktivert i Firebase Console
2. Sjekk at `appId` er riktig i `app.local.json`

## Neste Steg

Hvis problemet vedvarer:
1. Sjekk Logcat for spesifikke feilmeldinger
2. Sjekk at alle Firebase services er aktivert
3. Prøv å bygge en ren build: `npx expo prebuild --clean`

