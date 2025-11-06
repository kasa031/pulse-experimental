# 🔐 GitHub Secrets - Komplett Guide

## 📍 Direkte lenker

### GitHub Secrets (Actions)
**URL:** https://github.com/kasa031/pulse-experimental/settings/secrets/actions

Klikk her for å legge til/redigere secrets: [Settings → Secrets and variables → Actions](https://github.com/kasa031/pulse-experimental/settings/secrets/actions)

### GitHub Pages Settings
**URL:** https://github.com/kasa031/pulse-experimental/settings/pages

Klikk her for å konfigurere GitHub Pages: [Settings → Pages](https://github.com/kasa031/pulse-experimental/settings/pages)

### GitHub Actions (Deployments)
**URL:** https://github.com/kasa031/pulse-experimental/actions

Se deploy-status: [Actions](https://github.com/kasa031/pulse-experimental/actions)

---

## 🔑 Firebase Secrets du må legge til

Gå til: **https://github.com/kasa031/pulse-experimental/settings/secrets/actions**

Klikk **"New repository secret"** for hver av disse:

### 1. FIREBASE_API_KEY
- **Name:** `FIREBASE_API_KEY`
- **Value:** Din Firebase API Key (fra Firebase Console → Project Settings → General → Your apps)
- **Eksempel:** `AIzaSyBtfwQQeFo8FiKtjF_FKYo3pdVEFtll6W4`

### 2. FIREBASE_AUTH_DOMAIN
- **Name:** `FIREBASE_AUTH_DOMAIN`
- **Value:** `pulse-oslo.firebaseapp.com`
- **Note:** Dette er vanligvis `[project-id].firebaseapp.com`

### 3. FIREBASE_PROJECT_ID
- **Name:** `FIREBASE_PROJECT_ID`
- **Value:** `pulse-oslo`
- **Note:** Dette er ditt Firebase Project ID

### 4. FIREBASE_STORAGE_BUCKET
- **Name:** `FIREBASE_STORAGE_BUCKET`
- **Value:** `pulse-oslo.firebasestorage.app`
- **Note:** Dette er vanligvis `[project-id].firebasestorage.app`

### 5. FIREBASE_MESSAGING_SENDER_ID
- **Name:** `FIREBASE_MESSAGING_SENDER_ID`
- **Value:** Din Messaging Sender ID (fra Firebase Console)
- **Eksempel:** `280480706163`

### 6. FIREBASE_APP_ID
- **Name:** `FIREBASE_APP_ID`
- **Value:** Din App ID (fra Firebase Console)
- **Eksempel:** `1:280480706163:web:6d4ff51d3f07688ebe8406`

### 7. OPENROUTER_API_KEY (Valgfritt)
- **Name:** `OPENROUTER_API_KEY`
- **Value:** Din OpenRouter API Key (hvis du bruker AI-funksjonalitet)
- **Eksempel:** `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`

---

## 📋 Hvor finner du Firebase Secrets?

### Metode 1: Fra Firebase Console
1. Gå til: https://console.firebase.google.com/
2. Velg prosjektet ditt: **pulse-oslo**
3. Klikk på ⚙️ (Settings) → **Project settings**
4. Scroll ned til **"Your apps"** seksjonen
5. Klikk på web-appen din (eller opprett en hvis den ikke finnes)
6. Du vil se en `firebaseConfig` objekt med alle verdiene

### Metode 2: Fra app.local.json (lokalt)
Hvis du har `app.local.json` lokalt, kan du se verdiene der:
```json
{
  "expo": {
    "extra": {
      "firebase": {
        "apiKey": "DIN_API_KEY_HER",
        "authDomain": "pulse-oslo.firebaseapp.com",
        "projectId": "pulse-oslo",
        "storageBucket": "pulse-oslo.firebasestorage.app",
        "messagingSenderId": "DIN_SENDER_ID_HER",
        "appId": "DIN_APP_ID_HER"
      }
    }
  }
}
```

---

## ✅ Steg-for-steg: Legge til Secrets

1. **Gå til Secrets-siden:**
   - https://github.com/kasa031/pulse-experimental/settings/secrets/actions

2. **Klikk "New repository secret"**

3. **For hver secret:**
   - Skriv inn **Name** (f.eks. `FIREBASE_API_KEY`)
   - Lim inn **Value** (fra Firebase Console eller app.local.json)
   - Klikk **"Add secret"**

4. **Gjenta for alle 7 secrets**

5. **Verifiser at alle er lagt til:**
   - Du skal se alle 7 secrets i listen

---

## 🚀 Etter at Secrets er lagt til

1. **Trigger en ny deployment:**
   - Gå til: https://github.com/kasa031/pulse-experimental/actions
   - Klikk **"Deploy to GitHub Pages"**
   - Klikk **"Run workflow"** → **"Run workflow"**
   - Vent 2-3 minutter

2. **Test på mobil:**
   - Åpne: https://kasa031.github.io/pulse-experimental/
   - Appen skal nå laste riktig!

---

## ⚠️ Viktig

- **Ikke committ secrets til Git!** De skal kun være i GitHub Secrets
- **Secrets er kun synlige for repository-eiere**
- **Hvis du endrer secrets, må du trigger en ny deployment**

---

## 🔍 Sjekk at Secrets er satt riktig

Etter deployment, sjekk Actions-loggen:
1. Gå til: https://github.com/kasa031/pulse-experimental/actions
2. Klikk på siste deployment
3. Se "Setup app.json with credentials from secrets" steget
4. Hvis det står "PLACEHOLDER" i loggen, er secrets ikke satt riktig

---

## 📞 Hjelp

Hvis du har problemer:
1. Sjekk at alle 7 secrets er lagt til
2. Sjekk at verdiene er riktige (ingen mellomrom, riktig format)
3. Trigger en ny deployment
4. Sjekk Actions-loggen for feilmeldinger

