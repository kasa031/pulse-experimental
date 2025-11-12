# 🏙️ Pulse Oslo

**Din stemme i byen** - En plattform for lokaldemokrati i Oslo

## 📱 Om appen

Pulse Oslo er en digital plattform hvor innbyggerne i Oslo kan delta i lokale avstemninger, diskutere saker og følge med på hva som skjer i byen. Appen er utviklet for å styrke lokaldemokratiet og gjøre det enklere for innbyggerne å påvirke utviklingen av Oslo.

## ✨ Funksjoner

### 🔹 Avstemninger
- Delta i lokale avstemninger om temaer som påvirker byen
- Søk og filtrer avstemninger etter kategori og bydel
- Se resultater fra tidligere avstemninger
- Stem på avstemninger som er aktive

### 🔹 Diskusjoner
- Start og delta i diskusjoner om lokale saker
- Kommenter på diskusjoner
- Filtrer etter kategori
- Se hvem som deltar og hva som diskuteres

### 🔹 Profil
- Hold oversikt over dine stemmer
- Se statistikk over din deltakelse
- Rediger profilinformasjon
- Velg din bydel

### 🔹 Lokalhistorie
- Se dine tidligere stemmer
- Se resultater fra avsluttede avstemninger
- Hold oversikt over din deltakelse

### 🔹 Oslo - Quiz og Historie
- Test din kunnskap om Oslo med interaktive quiz-spørsmål
- Legg til og les historie om gatenavn i Oslo
- Lær fun facts om byen
- Del kunnskap om Oslos historie med andre

### 🔹 Admin-funksjoner
- Opprett nye avstemninger (kun admin)
- Administrer avstemninger og resultater

### 🔹 Feilrapportering & Tilbakemelding
- Rapporter feil eller problemer
- Foreslå nye funksjoner
- Gi generell tilbakemelding
- Automatisk feilrapportering ved kritiske feil

## 🚀 Komme i gang

### Forutsetninger
- Node.js (v18 eller nyere)
- npm eller yarn
- Expo CLI
- Firebase-prosjekt

### Installasjon

1. Klon repositoryet:
```bash
git clone https://github.com/kasa031/pulse-experimental.git
cd pulse-experimental
```

2. Installer avhengigheter:
```bash
npm install
```

3. Opprett lokal konfigurasjon:
- Kopier `app.json.example` til `app.local.json`
- Legg til dine Firebase credentials i `app.local.json`
- Legg til OpenRouter API-nøkkel hvis nødvendig

4. Start appen:
```bash
npm start
```

### Firebase Setup

1. Opprett et Firebase-prosjekt på [Firebase Console](https://console.firebase.google.com/)
2. Legg til Web-app i Firebase-prosjektet
3. Kopier Firebase-konfigurasjonen til `app.local.json`
4. Opprett Firestore-database
5. Sett opp Security Rules (se `FIRESTORE_SECURITY_RULES_ADVANCED.txt`)
6. Opprett Firestore indekser (se `FIRESTORE_INDEXES.md`)
7. Seed initial data med `node seedPolls.js` (hvis du har service account key)

### EmailJS Setup (for Feilrapportering)

1. Opprett EmailJS konto på [EmailJS](https://www.emailjs.com/)
2. Følg instruksjonene i `EMAILJS_SETUP_GUIDE.md`
3. Legg til EmailJS nøkler i `app.local.json`:
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
4. For produksjon: Legg til nøkler i GitHub Secrets

## 📁 Prosjektstruktur

```
pulse-experimental/
├── assets/              # Bilder og ikoner
├── src/
│   ├── constants/       # Konstantdata (farger, bydeler, osloQuiz, etc.)
│   ├── screens/         # React Native skjermer (inkl. OsloScreen)
│   ├── services/        # Firebase og API-tjenester
│   ├── components/      # Gjenbrukbare komponenter (WebNavigation, etc.)
│   ├── hooks/           # Custom hooks (useKeyboardShortcuts, etc.)
│   └── utils/           # Hjelpefunksjoner (validation, accessibility, etc.)
├── .github/
│   └── workflows/       # GitHub Actions for deployment
├── scripts/             # Hjelpeskript
└── app.json             # Expo konfigurasjon
```

## 🔒 Sikkerhet

- API-nøkler lagres i `app.local.json` (ikke committet)
- Pre-commit hooks sjekker for sensitive data
- GitHub Secrets brukes for CI/CD
- Firestore Security Rules implementert

## 🌐 Deployment

Appen deployes automatisk til GitHub Pages ved push til `main`-branchen.

- **Web URL**: https://kasa031.github.io/pulse-experimental/
- **GitHub Actions**: Automatisk build og deploy

## 🛠️ Teknologier

- **React Native** - Cross-platform app
- **Expo** - Utviklings- og build-plattform
- **Firebase** - Backend (Authentication, Firestore)
- **EmailJS** - E-post sending (feilrapportering)
- **React Navigation** - Navigasjon
- **React Native Paper** - UI-komponenter
- **TypeScript** - Type safety

## 📝 Lisens

Private - All rights reserved

## 🤝 Bidrag

Prosjektet er for øyeblikket privat. Kontakt eier for mer informasjon.

## 📧 Kontakt

- **Repository**: https://github.com/kasa031/pulse-experimental
- **Firebase Project**: pulse-oslo

---

**Pulse Oslo** - Din stemme betyr noe! 🗳️
