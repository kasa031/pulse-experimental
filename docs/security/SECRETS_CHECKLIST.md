# ✅ GitHub Secrets Sjekkliste

## 📍 Hvor sjekke
**URL**: https://github.com/kasa031/pulse-experimental/settings/secrets/actions

## 🔐 Påkrevde Secrets

Sjekk at alle disse eksisterer i GitHub Secrets:

- [ ] `FIREBASE_API_KEY`
- [ ] `FIREBASE_AUTH_DOMAIN`
- [ ] `FIREBASE_PROJECT_ID`
- [ ] `FIREBASE_STORAGE_BUCKET`
- [ ] `FIREBASE_MESSAGING_SENDER_ID`
- [ ] `FIREBASE_APP_ID`

## 📋 Valgfrie Secrets (for ekstra funksjoner)

- [ ] `EMAILJS_PUBLIC_KEY` (for feedback-funksjon)
- [ ] `EMAILJS_SERVICE_ID` (for feedback-funksjon)
- [ ] `EMAILJS_TEMPLATE_ID` (for feedback-funksjon)
- [ ] `OPENROUTER_API_KEY` (for AI-nyhetsgenerering)

## 🔍 Hvor finner jeg Firebase Secrets?

1. Gå til: https://console.firebase.google.com/
2. Velg prosjekt: **pulse-oslo**
3. Klikk ⚙️ **Settings** → **Project settings**
4. Scroll ned til **Your apps**
5. Klikk på web-app ikonet (</>)
6. Kopier verdiene fra `firebaseConfig` objektet

## ⚠️ Viktig

- Secrets er **case-sensitive** (FIREBASE_API_KEY ≠ firebase_api_key)
- Du kan ikke se verdien til eksisterende secrets
- Hvis du må oppdatere, slett den gamle og lag en ny

## ✅ Neste steg

Når alle secrets er satt:
1. Gå til: https://github.com/kasa031/pulse-experimental/actions
2. Klikk **Run workflow** på "Deploy to GitHub Pages"
3. Vent på at build fullfører
4. Test: https://kasa031.github.io/pulse-experimental/

