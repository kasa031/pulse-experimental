# ✅ Final Checklist - Før Produksjon

## 🔧 Setup & Konfigurasjon

### Firebase
- [ ] Alle Firebase Secrets er satt i GitHub Secrets
  - [ ] FIREBASE_API_KEY
  - [ ] FIREBASE_AUTH_DOMAIN
  - [ ] FIREBASE_PROJECT_ID
  - [ ] FIREBASE_STORAGE_BUCKET
  - [ ] FIREBASE_MESSAGING_SENDER_ID
  - [ ] FIREBASE_APP_ID
- [ ] Firestore Security Rules er konfigurert (se FIRESTORE_SECURITY_RULES_ADVANCED.txt)
- [ ] Firestore indekser er opprettet (se FIRESTORE_INDEXES.md)
- [ ] Firebase-prosjektet er aktivert og fungerer

### EmailJS (for Feilrapportering)
- [ ] EmailJS konto er opprettet
- [ ] E-post service er konfigurert (Gmail/iCloud)
- [ ] E-post template er opprettet
- [ ] EmailJS nøkler er lagt til i GitHub Secrets:
  - [ ] EMAILJS_PUBLIC_KEY
  - [ ] EMAILJS_SERVICE_ID
  - [ ] EMAILJS_TEMPLATE_ID
- [ ] Test e-post er sendt og mottatt

### Admin-brukere
- [ ] Minst én admin-bruker er opprettet i Firebase
- [ ] Admin custom claim er satt (se SETUP_ADMIN_USERS.md)
- [ ] Admin kan logge inn og opprette avstemninger

## 🧪 Testing

### Autentisering
- [ ] Login fungerer
- [ ] Logout fungerer
- [ ] Registrering fungerer
- [ ] E-post verifisering sendes ved registrering
- [ ] "Glemt passord" fungerer
- [ ] "Husk meg" fungerer og lagrer e-post
- [ ] Logout fjerner lagret "Husk meg"-data

### Avstemninger
- [ ] Aktive avstemninger vises
- [ ] Bruker kan stemme på aktiv avstemning
- [ ] Bruker kan IKKE stemme to ganger
- [ ] Stemmer oppdateres i real-time
- [ ] Søk fungerer
- [ ] Filtrering etter kategori fungerer
- [ ] Filtrering etter bydel fungerer
- [ ] Kombinert søk og filter fungerer
- [ ] Sortering fungerer

### Opprettelse av Avstemning (Admin)
- [ ] Admin kan opprette avstemning
- [ ] Ikke-admin kan IKKE opprette avstemning
- [ ] Validering fungerer (tittel, beskrivelse, datoer, alternativer)
- [ ] Dato-validering fungerer (startDate < endDate, ikke i fortiden)
- [ ] Forhåndsvisning fungerer

### Diskusjoner
- [ ] Diskusjoner vises
- [ ] Bruker kan opprette diskusjon
- [ ] Bruker kan kommentere
- [ ] Likes/dislikes fungerer
- [ ] Filtrering etter kategori fungerer

### Nyheter
- [ ] Nyheter vises
- [ ] Filtrering etter kategori fungerer
- [ ] Filtrering etter bydel fungerer
- [ ] Søk fungerer

### Profil
- [ ] Profil vises korrekt
- [ ] Statistikker vises (stemmer, kommentarer, diskusjoner)
- [ ] Bruker kan redigere profil
- [ ] Bydel kan velges og lagres

### Lokalhistorie
- [ ] Tidligere stemmer vises
- [ ] Avsluttede avstemninger vises
- [ ] Resultater vises korrekt

### Feilrapportering
- [ ] FeedbackScreen vises i navigasjonen
- [ ] Alle feedback-typer kan velges
- [ ] Validering fungerer
- [ ] E-post sendes korrekt
- [ ] Automatisk feilrapportering fungerer (ErrorBoundary)

## 🌐 Plattform Testing

### Web
- [ ] App starter uten feil
- [ ] Navigasjon fungerer
- [ ] Responsiv design fungerer (desktop, tablet, mobil)
- [ ] Alle skjermer kan nås
- [ ] Alle funksjoner fungerer

### Mobile (hvis relevant)
- [ ] iOS: App starter uten feil
- [ ] Android: App starter uten feil
- [ ] Navigasjon fungerer
- [ ] Touch targets er store nok
- [ ] Keyboard fungerer korrekt

## 🔒 Sikkerhet

- [ ] Firestore Security Rules er korrekte
- [ ] Ingen sensitive data i kode
- [ ] API-nøkler er i GitHub Secrets
- [ ] Rate limiting fungerer
- [ ] Input validering fungerer
- [ ] XSS-beskyttelse fungerer

## 📊 Ytelse

- [ ] App starter raskt
- [ ] Skjermer laster raskt
- [ ] Caching fungerer
- [ ] Ingen unødvendige re-renders
- [ ] Firestore queries er optimaliserte

## 🐛 Feilhåndtering

- [ ] ErrorBoundary fanger feil
- [ ] Feilmeldinger vises til bruker
- [ ] Automatisk feilrapportering fungerer
- [ ] Appen krasjer ikke ved feil
- [ ] Graceful degradation ved nettverksfeil

## 📱 Brukeropplevelse

- [ ] Loading states vises
- [ ] Error states vises
- [ ] Empty states vises
- [ ] Suksessmeldinger vises
- [ ] Navigasjon er intuitiv
- [ ] Design er konsistent
- [ ] Tekster er korrekte (norsk)

## 📚 Dokumentasjon

- [ ] README.md er oppdatert
- [ ] Setup-guider er komplette
- [ ] Testing TODO er oppdatert
- [ ] Alle viktige filer er dokumentert

## 🚀 Deployment

- [ ] GitHub Actions workflow fungerer
- [ ] Build fungerer uten feil
- [ ] Deployment til GitHub Pages fungerer
- [ ] App er tilgjengelig på web URL
- [ ] Alle miljøvariabler er satt

## ✅ Final Checks

- [ ] Ingen console.errors i produksjon
- [ ] TypeScript type check passerer (`tsc --noEmit`)
- [ ] Ingen linter-feil
- [ ] Alle dependencies er oppdatert
- [ ] App-versjon er korrekt i app.json

---

## 📝 Notater

- Test alle funksjoner systematisk
- Dokumenter eventuelle kjente problemer
- Sjekk at alle secrets er satt
- Verifiser at Firestore indekser er opprettet

---

**Status**: Klar for produksjon når alle punkter er krysset av ✅

