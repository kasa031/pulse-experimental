# Firebase Setup Checklist

## ✅ Før Testing - Sjekkliste

### 1. GitHub Secrets
Sjekk at følgende secrets er satt i GitHub repository:
- [ ] `FIREBASE_API_KEY`
- [ ] `FIREBASE_AUTH_DOMAIN`
- [ ] `FIREBASE_PROJECT_ID`
- [ ] `FIREBASE_STORAGE_BUCKET`
- [ ] `FIREBASE_MESSAGING_SENDER_ID`
- [ ] `FIREBASE_APP_ID`

**Hvor**: GitHub Repository → Settings → Secrets and variables → Actions

### 2. Lokal Utvikling (app.local.json)
For lokal utvikling, sjekk at `app.local.json` eksisterer og har riktige verdier:
- [ ] Filen eksisterer
- [ ] `firebase.apiKey` er satt
- [ ] `firebase.authDomain` er satt
- [ ] `firebase.projectId` er satt
- [ ] `firebase.storageBucket` er satt
- [ ] `firebase.messagingSenderId` er satt
- [ ] `firebase.appId` er satt

**Note**: `app.local.json` er i `.gitignore` og skal ikke committes.

### 3. Firestore Security Rules
Sjekk at security rules er konfigurert i Firebase Console:
- [ ] Rules tillater lesing for autentiserte brukere
- [ ] Rules tillater skriving kun for autentiserte brukere
- [ ] Admin-funksjoner er beskyttet
- [ ] Votes kan kun opprettes, ikke endres eller slettes

**Hvor**: Firebase Console → Firestore Database → Rules

### 4. Firestore Indekser
Se `FIRESTORE_INDEXES.md` for detaljert liste. Sjekk at følgende indekser eksisterer:
- [ ] `polls`: `isActive` + `startDate` (descending)
- [ ] `polls`: `endDate` (descending)
- [ ] `votes`: `userId` + `votedAt` (descending)
- [ ] `news`: `publishedAt` (descending)
- [ ] `news`: `district` + `publishedAt` (descending)
- [ ] `news`: `category` + `publishedAt` (descending)
- [ ] `discussions`: `category` + `createdAt` (descending)

**Hvor**: Firebase Console → Firestore Database → Indexes

### 5. Firebase Authentication
Sjekk at følgende er konfigurert:
- [ ] E-post/Passord autentisering er aktivert
- [ ] E-post verifisering er konfigurert (valgfritt)
- [ ] Passord reset er aktivert

**Hvor**: Firebase Console → Authentication → Sign-in method

### 6. Admin Claims
For å sette opp admin-brukere:
- [ ] Kjør `node scripts/setAdminClaim.js <email>` for hver admin-bruker
- [ ] Verifiser at claim er satt: `isUserAdmin()` returnerer `true`

**Script**: `scripts/setAdminClaim.js`

### 7. Test Data
For testing, sjekk at du har:
- [ ] Minst 1 aktiv avstemning i `polls` collection
- [ ] Minst 1 nyhet i `news` collection (valgfritt)
- [ ] Minst 1 diskusjon i `discussions` collection (valgfritt)

### 8. Validering
Test at Firebase initialisering fungerer:
```bash
npm start
```

Sjekk at:
- [ ] Ingen feilmeldinger om manglende API-nøkler
- [ ] Appen starter uten Firebase-feil
- [ ] Login-skjermen vises

## 🚨 Vanlige Problemer

### Problem: "Firebase er ikke konfigurert riktig"
**Løsning**: 
- Sjekk at alle secrets er satt i GitHub
- For lokal utvikling: Sjekk `app.local.json`
- Kjør `npm run setup-local` for å oppdatere konfigurasjon

### Problem: "The query requires an index"
**Løsning**: 
- Se `FIRESTORE_INDEXES.md`
- Klikk på lenken i feilmeldingen for å opprette indeks automatisk
- Eller opprett manuelt i Firebase Console

### Problem: "Permission denied"
**Løsning**: 
- Sjekk Firestore security rules
- Sjekk at brukeren er autentisert
- Sjekk at admin-claims er satt riktig

### Problem: "Auth domain mismatch"
**Løsning**: 
- Sjekk at `authDomain` matcher Firebase prosjektet
- Format: `<project-id>.firebaseapp.com`

