# 🚀 Quick Deploy Guide

## Mål: Appen som nettside på mobilen

**URL:** https://kasa031.github.io/pulse-experimental/

## Hurtig oppsett (3 steg):

### 1️⃣ Sett opp GitHub Secrets (5 minutter)

1. Gå til: https://github.com/kasa031/pulse-experimental/settings/secrets/actions
2. Klikk **New repository secret** for hver:

```
OPENROUTER_API_KEY = [Hent fra app.local.json]
FIREBASE_API_KEY = [Hent fra Firebase Console]
FIREBASE_AUTH_DOMAIN = pulse-oslo.firebaseapp.com
FIREBASE_PROJECT_ID = pulse-oslo
FIREBASE_STORAGE_BUCKET = pulse-oslo.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID = [Hent fra Firebase Console]
FIREBASE_APP_ID = [Hent fra Firebase Console]
```

### 2️⃣ Aktiver GitHub Pages

1. Gå til: https://github.com/kasa031/pulse-experimental/settings/pages
2. Under **Source**, velg **GitHub Actions**
3. Klikk **Save**

### 3️⃣ Push til GitHub

```bash
git add .
git commit -m "Setup web deployment"
git push origin main
```

## ✅ Ferdig!

Etter 2-3 minutter:
- Gå til: **https://kasa031.github.io/pulse-experimental/**
- Åpne på mobilen - appen fungerer! 📱

## Fremover:

Hver gang du pusher til `main`, deployes automatisk!

**Du trenger ALDRI kjøre `npm start` igjen for å teste på mobil!** 🎉

