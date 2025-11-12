# 🔧 GitHub Pages Deployment Fix

## Problem
Appen laster ikke på GitHub Pages. Feilmeldingen viser:
- "could not establish connection. Receiving end does not exist"
- Scripts og stylesheets lastes ikke riktig
- Appen viser bare "Laster OsloPuls..." loading screen

## Løsning

### 1. Sjekk at GitHub Secrets er satt
Gå til: Settings → Secrets and variables → Actions

Sjekk at disse secrets er satt:
- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER_ID`
- `FIREBASE_APP_ID`
- `OPENROUTER_API_KEY` (valgfritt)

### 2. Trigger ny deployment
1. Gå til Actions i GitHub
2. Velg "Deploy to GitHub Pages" workflow
3. Klikk "Run workflow" → "Run workflow"

### 3. Sjekk build logs
Etter deployment, sjekk Actions for feilmeldinger.

### 4. Hvis problemet vedvarer
Problemet kan være at:
- Expo export genererer ikke riktig struktur
- Base path `/pulse-experimental` ikke fungerer riktig
- Script tags mangler i index.html

## Alternativ løsning: Bruk Expo EAS Build

Hvis GitHub Pages fortsatt ikke fungerer, vurder å bruke:
- Expo EAS Build for web
- Netlify
- Vercel

## Debugging

Sjekk browser console (F12) for:
- 404 errors på JS/CSS filer
- CORS errors
- Firebase initialization errors

