# 🔐 GitHub Secrets Sjekkliste

## Hvordan sjekke GitHub Secrets

### Steg 1: Gå til GitHub Repository
1. Åpne: https://github.com/kasa031/pulse-experimental
2. Klikk på **Settings** (øverst i repository)
3. I venstre meny, klikk på **Secrets and variables** → **Actions**

### Steg 2: Sjekk at disse Secrets finnes

#### Firebase Secrets (Påkrevd)
Sjekk at alle disse eksisterer:

- [ ] `FIREBASE_API_KEY`
- [ ] `FIREBASE_AUTH_DOMAIN`
- [ ] `FIREBASE_PROJECT_ID`
- [ ] `FIREBASE_STORAGE_BUCKET`
- [ ] `FIREBASE_MESSAGING_SENDER_ID`
- [ ] `FIREBASE_APP_ID`

#### EmailJS Secrets (Valgfritt - for feedback-funksjon)
- [ ] `EMAILJS_PUBLIC_KEY`
- [ ] `EMAILJS_SERVICE_ID`
- [ ] `EMAILJS_TEMPLATE_ID`

#### AI Secrets (Valgfritt - for AI-nyhetsgenerering)
- [ ] `OPENROUTER_API_KEY`

## Hvordan legge til/oppdatere Secrets

### Hvis et Secret mangler:

1. I **Secrets and variables** → **Actions**, klikk **New repository secret**
2. Skriv inn **Name** (f.eks. `FIREBASE_API_KEY`)
3. Skriv inn **Secret** (verdien fra Firebase Console)
4. Klikk **Add secret**

### Hvor finner jeg Firebase Secrets?

1. Gå til [Firebase Console](https://console.firebase.google.com/)
2. Velg prosjektet ditt: `pulse-oslo`
3. Klikk på ⚙️ (Settings) → **Project settings**
4. Scroll ned til **Your apps** seksjonen
5. Klikk på web-app ikonet (</>) eller "Add app" hvis du ikke har en
6. Du vil se Firebase config objektet:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",           // ← FIREBASE_API_KEY
  authDomain: "...",           // ← FIREBASE_AUTH_DOMAIN
  projectId: "...",            // ← FIREBASE_PROJECT_ID
  storageBucket: "...",        // ← FIREBASE_STORAGE_BUCKET
  messagingSenderId: "...",    // ← FIREBASE_MESSAGING_SENDER_ID
  appId: "1:..."               // ← FIREBASE_APP_ID
};
```

## Verifisering

### Etter at Secrets er satt:

1. Gå til **Actions** i GitHub
2. Klikk på siste "Deploy to GitHub Pages" workflow
3. Sjekk at build ikke feiler på "Setup app.json with credentials from secrets"
4. Hvis det feiler, sjekk at alle secrets er riktig navngitt (case-sensitive!)

## Troubleshooting

### "Secret not found" feil
- Sjekk at navnet er eksakt riktig (case-sensitive)
- Sjekk at du har lagt til secret i riktig repository

### "Invalid credentials" feil
- Sjekk at secret-verdiene er riktig kopiert fra Firebase
- Ikke legg til ekstra mellomrom eller anførselstegn

### Build feiler med "PLACEHOLDER"
- Dette betyr at en secret mangler
- Sjekk at alle Firebase secrets er satt

## Quick Checklist

```
□ FIREBASE_API_KEY
□ FIREBASE_AUTH_DOMAIN
□ FIREBASE_PROJECT_ID
□ FIREBASE_STORAGE_BUCKET
□ FIREBASE_MESSAGING_SENDER_ID
□ FIREBASE_APP_ID
□ EMAILJS_PUBLIC_KEY (valgfritt)
□ EMAILJS_SERVICE_ID (valgfritt)
□ EMAILJS_TEMPLATE_ID (valgfritt)
□ OPENROUTER_API_KEY (valgfritt)
```

## Neste steg

Etter at alle secrets er satt:
1. Gå til **Actions**
2. Klikk **Run workflow** på "Deploy to GitHub Pages"
3. Vent på at build fullfører
4. Test: https://kasa031.github.io/pulse-experimental/
