# 🚀 Quick Start Guide - Pulse Oslo

## ⚡ Rask Oppstart (5 minutter)

### 1. Klon og Installer
```bash
git clone https://github.com/kasa031/pulse-experimental.git
cd pulse-experimental
npm install
```

### 2. Lokal Konfigurasjon
```bash
# Kopier eksempel-fil
cp app.json.example app.local.json

# Rediger app.local.json og legg til:
# - Firebase credentials
# - EmailJS nøkler (valgfritt)
# - OpenRouter API key (hvis nødvendig)
```

### 3. Start Appen
```bash
npm start
# eller
npm run web    # For web
npm run android # For Android
npm run ios     # For iOS
```

## 🔧 Full Setup (Før Produksjon)

### Steg 1: Firebase Setup
1. Opprett Firebase-prosjekt på [Firebase Console](https://console.firebase.google.com/)
2. Legg til Web-app
3. Kopier konfigurasjon til `app.local.json`
4. Sett opp Firestore Database
5. Konfigurer Security Rules (se `FIRESTORE_SECURITY_RULES_ADVANCED.txt`)
6. Opprett indekser (se `FIRESTORE_INDEXES.md`)

### Steg 2: EmailJS Setup (for Feilrapportering)
1. Opprett konto på [EmailJS](https://www.emailjs.com/)
2. Følg `EMAILJS_SETUP_GUIDE.md`
3. Legg til nøkler i `app.local.json`:
```json
{
  "expo": {
    "extra": {
      "emailjsPublicKey": "din-public-key",
      "emailjsServiceId": "din-service-id",
      "emailjsTemplateId": "din-template-id"
    }
  }
}
```

### Steg 3: GitHub Secrets (for Produksjon)
Legg til i GitHub Repository → Settings → Secrets:
- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER_ID`
- `FIREBASE_APP_ID`
- `EMAILJS_PUBLIC_KEY` (valgfritt)
- `EMAILJS_SERVICE_ID` (valgfritt)
- `EMAILJS_TEMPLATE_ID` (valgfritt)

### Steg 4: Admin-brukere
1. Opprett bruker i Firebase Authentication
2. Sett admin custom claim (se `SETUP_ADMIN_USERS.md`)

### Steg 5: Test
1. Start appen: `npm start`
2. Test login/logout
3. Test alle funksjoner (se `TESTING_TODO.md`)
4. Gå gjennom `FINAL_CHECKLIST.md`

## 📋 Viktige Filer

### Konfigurasjon
- `app.json` - Expo konfigurasjon
- `app.local.json` - Lokal konfigurasjon (ikke committet)
- `package.json` - Avhengigheter

### Dokumentasjon
- `README.md` - Hoveddokumentasjon
- `EMAILJS_SETUP_GUIDE.md` - EmailJS setup
- `FIREBASE_SETUP_CHECKLIST.md` - Firebase setup
- `FIRESTORE_INDEXES.md` - Firestore indekser
- `TESTING_TODO.md` - Testing guide
- `FINAL_CHECKLIST.md` - Sjekkliste før produksjon

### Kode
- `src/App.tsx` - Hovedapplikasjon
- `src/services/` - Services (Firebase, polls, users, etc.)
- `src/screens/` - Skjermer
- `src/utils/` - Utility-funksjoner

## 🐛 Troubleshooting

### Appen starter ikke
- Sjekk at `app.local.json` eksisterer
- Sjekk at Firebase credentials er korrekte
- Kjør `npm run setup-local`

### Firebase feil
- Sjekk at alle secrets er satt
- Sjekk Firebase Console for feilmeldinger
- Verifiser at Firestore er aktivert

### EmailJS feil
- Sjekk at nøkler er korrekte
- Sjekk EmailJS dashboard for feilmeldinger
- Verifiser at template er korrekt konfigurert

### Navigasjon feil
- Sjekk at alle skjermer er importert
- Sjekk at navigasjonsstrukturen er korrekt

## 🎯 Neste Steg

1. ✅ Klon og installer
2. ✅ Sett opp lokal konfigurasjon
3. ⏳ Sett opp Firebase
4. ⏳ Sett opp EmailJS (valgfritt)
5. ⏳ Test appen
6. ⏳ Deploy til produksjon

## 📞 Hjelp

- Se `README.md` for detaljert dokumentasjon
- Se `COMPLETE_SUMMARY.md` for komplett oversikt
- Se `FINAL_CHECKLIST.md` for sjekkliste

---

**Lykke til! 🚀**

