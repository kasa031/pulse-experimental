# 🔍 Debugging Blank Hvit Skjerm - Komplett Guide

## Problem
Blank hvit skjerm når man åpner GitHub Pages URL på mobil.

## Steg-for-steg Debugging

### Steg 1: Sjekk GitHub Actions Deployment

1. **Gå til Actions:**
   - https://github.com/kasa031/pulse-experimental/actions

2. **Sjekk siste deployment:**
   - Klikk på siste "Deploy to GitHub Pages" workflow
   - Se om alle steg er grønne (✅)

3. **Sjekk spesifikke steg:**
   - ✅ "Build web" - skal være grønn
   - ✅ "Verify build output" - skal vise filer
   - ✅ "Upload artifact" - skal være grønn
   - ✅ "Deploy to GitHub Pages" - skal være grønn

4. **Hvis noe feiler:**
   - Klikk på det feilende steget
   - Se gjennom loggen for røde feilmeldinger
   - Kopier feilmeldingene

### Steg 2: Sjekk Browser Console (KRITISK!)

#### På Desktop:
1. Åpne: https://kasa031.github.io/pulse-experimental/
2. Trykk F12 (eller høyreklikk → Inspect)
3. Gå til "Console" fanen
4. Se etter røde feilmeldinger

#### På Mobil (iPhone):
1. Settings → Safari → Advanced → Web Inspector (ON)
2. Koble iPhone til Mac med USB
3. Mac: Safari → Develop → [Din iPhone] → [URL]
4. Se Console for errors

#### På Mobil (Android):
1. Åpne Chrome på PC
2. Gå til: chrome://inspect
3. Åpne URL på mobil
4. Klikk "inspect" på PC
5. Se Console for errors

### Steg 3: Vanlige Feil og Løsninger

#### Feil 1: "Firebase is not initialized"
**Årsak:** Firebase API-nøkler mangler eller er ugyldige

**Løsning:**
1. Gå til: https://github.com/kasa031/pulse-experimental/settings/secrets/actions
2. Sjekk at alle Firebase Secrets er satt:
   - `FIREBASE_API_KEY`
   - `FIREBASE_AUTH_DOMAIN`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_STORAGE_BUCKET`
   - `FIREBASE_MESSAGING_SENDER_ID`
   - `FIREBASE_APP_ID`
3. Trigger ny deployment

#### Feil 2: "Cannot find module" eller "Module not found"
**Årsak:** Build feilet eller filer mangler

**Løsning:**
1. Sjekk GitHub Actions log for build-feil
2. Prøv å kjøre `npm run build:web` lokalt
3. Se om det er noen dependency-problemer

#### Feil 3: "Network request failed" eller CORS errors
**Årsak:** Firebase CORS-problemer eller nettverksfeil

**Løsning:**
1. Sjekk Firebase Console → Authentication → Settings → Authorized domains
2. Legg til `kasa031.github.io` hvis den ikke er der
3. Sjekk at Firebase API key har riktige restrictions

#### Feil 4: Blank skjerm uten errors
**Årsak:** Appen laster ikke eller React feiler stille

**Løsning:**
1. Sjekk Network tab i browser console
2. Se om `index.js` eller andre JS-filer laster
3. Sjekk om det er 404 errors for JS-filer
4. Prøv hard refresh (Ctrl+Shift+R eller Cmd+Shift+R)

### Steg 4: Test Lokalt

Test om appen fungerer lokalt først:

```bash
# Installer dependencies
npm install

# Bygg for web
npm run build:web

# Test lokalt
npx serve dist
# eller
npx serve web-build
```

Hvis det fungerer lokalt men ikke på GitHub Pages:
- Problem er med deployment, ikke koden
- Sjekk GitHub Actions log

Hvis det ikke fungerer lokalt:
- Problem er med koden eller dependencies
- Sjekk browser console for errors

### Steg 5: Sjekk Build Output

1. **Sjekk at build faktisk produserer filer:**
   - Gå til GitHub Actions → Siste deployment
   - Se "Verify build output" steget
   - Skal vise filer i `dist/` eller `web-build/`

2. **Sjekk at index.html eksisterer:**
   - Skal være i build output directory
   - Skal inneholde `<div id="root">`

3. **Sjekk at JavaScript bundles eksisterer:**
   - Skal være i `_expo/static/js/web/` eller `static/js/web/`
   - Skal ha `index.js` eller lignende

### Steg 6: Cache-problemer

**Tøm cache:**
- Desktop: Ctrl+Shift+Delete → Clear cache
- iPhone: Settings → Safari → Clear History and Website Data
- Android: Chrome → Settings → Privacy → Clear browsing data

**Hard refresh:**
- Desktop: Ctrl+Shift+R (Windows) eller Cmd+Shift+R (Mac)
- iPhone: Safari → Share → Request Desktop Site → tilbake
- Android: Chrome → Menu → Reload

**Prøv inkognito:**
- Åpne URL i inkognito/private vindu
- Dette bypasser cache

## Hvis ingenting fungerer

### 1. Ta screenshots av:
- Browser console (med alle errors)
- Network tab (med failed requests)
- GitHub Actions log (med build errors)

### 2. Sjekk disse tingene:
- ✅ Alle secrets er satt i GitHub
- ✅ GitHub Pages er aktivert
- ✅ Build output inneholder filer
- ✅ Ingen JavaScript syntax errors
- ✅ Firebase er konfigurert riktig

### 3. Prøv alternativ build-metode:
Hvis Metro bundler feiler, kan vi prøve:
- Webpack bundler (krever config-endringer)
- EAS Build (krever Expo account)

## Neste steg etter debugging

Når du har funnet feilen:
1. Dokumenter feilen (screenshot + error message)
2. Sjekk om det er en kjent løsning
3. Hvis ikke, rapporter problemet med:
   - Error message
   - Browser console output
   - GitHub Actions log
   - Steg for å reprodusere

