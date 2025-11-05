# 🚀 Quick Deploy Guide

## Mål: Appen som nettside på mobilen

**URL:** https://kasa031.github.io/pulse-experimental/

## Hurtig oppsett (3 steg):

### 1️⃣ Sett opp GitHub Secrets (5 minutter)

1. Gå til: https://github.com/kasa031/pulse-experimental/settings/secrets/actions
2. Klikk **New repository secret** for hver:

```
OPENROUTER_API_KEY = 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
FIREBASE_API_KEY = AIzaSyBtfwQQeFo8FiKtjF_FKYo3pdVEFtll6W4
FIREBASE_AUTH_DOMAIN = pulse-oslo.firebaseapp.com
FIREBASE_PROJECT_ID = pulse-oslo
FIREBASE_STORAGE_BUCKET = pulse-oslo.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID = 280480706163
FIREBASE_APP_ID = 1:280480706163:web:6d4ff51d3f07688ebe8406
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

