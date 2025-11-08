# 🔧 Fiks GitHub Pages Deployment

## Problem
Appen lastes ikke på GitHub Pages. Feilmelding: "Appen lastet ikke" etter 10 sekunder.

## Mulige Årsaker

1. **Build feilet** - GitHub Actions workflow feilet
2. **JavaScript-filer lastes ikke** - Feil paths i index.html
3. **BaseUrl ikke riktig** - Paths er ikke korrekt konfigurert
4. **Firebase secrets mangler** - Appen kan ikke initialisere

## Løsning

### Steg 1: Sjekk GitHub Actions
1. Gå til GitHub repository
2. Klikk på "Actions" tab
3. Sjekk siste deployment
4. Se om det er noen feilmeldinger

### Steg 2: Verifiser Secrets
Sjekk at alle Firebase secrets er satt i GitHub:
- Settings → Secrets and variables → Actions
- Sjekk at disse er satt:
  - `FIREBASE_API_KEY`
  - `FIREBASE_AUTH_DOMAIN`
  - `FIREBASE_PROJECT_ID`
  - `FIREBASE_STORAGE_BUCKET`
  - `FIREBASE_MESSAGING_SENDER_ID`
  - `FIREBASE_APP_ID`

### Steg 3: Trigger Ny Deployment
1. Gå til "Actions"
2. Velg "Deploy to GitHub Pages" workflow
3. Klikk "Run workflow"
4. Velg "main" branch
5. Klikk "Run workflow"

### Steg 4: Sjekk Build Output
Etter deployment, sjekk:
1. Gå til "Actions" → Siste deployment
2. Se "Build web" step
3. Sjekk om det er noen feilmeldinger
4. Se "Verify build output" step

### Steg 5: Sjekk Browser Console
1. Åpne https://kasa031.github.io/pulse-experimental/
2. Trykk F12 (Developer Tools)
3. Gå til Console tab
4. Se etter feilmeldinger:
   - 404 errors for JS/CSS filer
   - Firebase initialisering feil
   - Network errors

## Vanlige Problemer

### Problem 1: JavaScript-filer lastes ikke
**Symptom**: 404 errors for `/_expo/static/js/web/index.js`

**Løsning**: 
- Sjekk at baseUrl er `/pulse-experimental` i app.json
- Sjekk at GitHub Actions workflow fikser paths i index.html

### Problem 2: Firebase ikke initialisert
**Symptom**: "Firebase er ikke konfigurert" feil

**Løsning**:
- Sjekk at alle Firebase secrets er satt
- Sjekk at secrets har riktige verdier

### Problem 3: Build feiler
**Symptom**: GitHub Actions workflow feiler

**Løsning**:
- Sjekk build logs i Actions tab
- Se etter spesifikke feilmeldinger
- Prøv å kjøre build lokalt: `npm run build:web`

## Test Lokalt

Test at build fungerer lokalt:

```bash
# Bygg for web
npm run build:web

# Sjekk at dist/ eller web-build/ mappen er opprettet
ls -la dist/ || ls -la web-build/

# Sjekk at index.html eksisterer
cat dist/index.html || cat web-build/index.html
```

## Hvis Alt Feiler

1. **Sjekk GitHub Pages Settings**:
   - Settings → Pages
   - Source: "GitHub Actions"
   - Branch: "main"

2. **Prøv å bygge manuelt**:
   ```bash
   npm run build:web
   # Push dist/ eller web-build/ til gh-pages branch
   ```

3. **Kontakt support** hvis problemet vedvarer

## Debug Info

Hvis appen fortsatt ikke laster, sjekk console for:
- Network tab: Se hvilke filer som feiler å laste
- Console tab: Se JavaScript errors
- Application tab: Se om Firebase er initialisert

---

**Status**: Klar for fiksing
**Neste steg**: Sjekk GitHub Actions og secrets
