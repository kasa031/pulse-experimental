# 🔐 Sett opp GitHub Secrets - Steg-for-steg

## ⚠️ Jeg kan ikke gjøre dette automatisk for deg, men her er enkel guide:

### Steg 1: Gå til Secrets-siden

**Klikk på denne lenken:**
👉 https://github.com/kasa031/pulse-experimental/settings/secrets/actions

### Steg 2: Legg til hver secret

Klikk **"New repository secret"** for hver av disse:

#### Secret 1: OPENROUTER_API_KEY
- **Name:** `OPENROUTER_API_KEY`
- **Secret:** [Hent fra app.local.json eller OpenRouter dashboard - IKKE lim inn her, dette er kun en guide]
- Klikk **Add secret**

#### Secret 2: FIREBASE_API_KEY
- **Name:** `FIREBASE_API_KEY`
- **Secret:** [Hent fra Firebase Console → Project Settings → Your apps]
- Klikk **Add secret**

#### Secret 3: FIREBASE_AUTH_DOMAIN
- **Name:** `FIREBASE_AUTH_DOMAIN`
- **Secret:** `pulse-oslo.firebaseapp.com`
- Klikk **Add secret**

#### Secret 4: FIREBASE_PROJECT_ID
- **Name:** `FIREBASE_PROJECT_ID`
- **Secret:** `pulse-oslo`
- Klikk **Add secret**

#### Secret 5: FIREBASE_STORAGE_BUCKET
- **Name:** `FIREBASE_STORAGE_BUCKET`
- **Secret:** `pulse-oslo.firebasestorage.app`
- Klikk **Add secret**

#### Secret 6: FIREBASE_MESSAGING_SENDER_ID
- **Name:** `FIREBASE_MESSAGING_SENDER_ID`
- **Secret:** [Hent fra Firebase Console → Project Settings → Your apps]
- Klikk **Add secret**

#### Secret 7: FIREBASE_APP_ID
- **Name:** `FIREBASE_APP_ID`
- **Secret:** [Hent fra Firebase Console → Project Settings → Your apps]
- Klikk **Add secret**

### Steg 3: Aktiver GitHub Pages

**Klikk på denne lenken:**
👉 https://github.com/kasa031/pulse-experimental/settings/pages

1. Under **Source**, velg **"GitHub Actions"**
2. Klikk **Save**

### Steg 4: Push til GitHub

Etter at secrets er satt opp, kjør:

```bash
git add .
git commit -m "Setup web deployment with GitHub Actions"
git push origin main
```

### Steg 5: Vent på deploy

1. Gå til: https://github.com/kasa031/pulse-experimental/actions
2. Se deploy-prosessen kjøre
3. Når den er ferdig (2-3 minutter), åpne:
   **https://kasa031.github.io/pulse-experimental/**

## ✅ Ferdig!

Appen vil nå være tilgjengelig som nettside på mobilen! 📱

