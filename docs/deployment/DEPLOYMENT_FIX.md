# 🔧 GitHub Pages Deployment Fix

## Problem
Appen laster ikke på GitHub Pages. Feilmeldingen viser:
- Scripts og stylesheets lastes ikke (tomme arrays)
- "could not establish connection. Receiving end does not exist"
- Appen viser bare "Laster OsloPuls..." loading screen

## Løsning Implementert

### 1. Oppdatert public/index.html
- Fjernet hardkodede script tags
- La Expo generere script tags automatisk under build
- Beholdt loading screen for bedre UX

### 2. Oppdatert deploy.yml
- Fjernet midlertidig flytting av index.html
- La Expo bruke public/index.html som template
- Expo vil automatisk injisere script tags

## Neste Steg

### 1. Commit og Push
```bash
git add .
git commit -m "Fix GitHub Pages deployment - let Expo generate script tags"
git push
```

### 2. Trigger Deployment
1. Gå til GitHub → Actions
2. Velg "Deploy to GitHub Pages" workflow
3. Klikk "Run workflow" → "Run workflow"

### 3. Vent på Build
- Build tar ca. 5-10 minutter
- Sjekk Actions for progress

### 4. Test
Etter deployment, test:
- https://kasa031.github.io/pulse-experimental/
- Sjekk browser console (F12) for errors

## Hvis Problem Vedvarer

### Sjekk GitHub Secrets
Gå til: Settings → Secrets and variables → Actions

Sjekk at disse er satt:
- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER_ID`
- `FIREBASE_APP_ID`

### Debugging
1. Sjekk Actions logs for build errors
2. Sjekk browser console (F12) for:
   - 404 errors på JS/CSS filer
   - CORS errors
   - Firebase initialization errors

### Alternativ: Bruk Expo EAS
Hvis GitHub Pages fortsatt ikke fungerer:
```bash
npx eas build --platform web
```

Eller bruk:
- Netlify
- Vercel
- Firebase Hosting
