# Oppgaveliste for Pulse Oslo

## ✅ Ferdig

### Sikkerhet
- [x] Firebase credentials er allerede i .gitignore
- [x] Oppdatert app-navn til "Pulse Oslo" i app.json og package.json
- [x] Verifisere at Firebase credentials-fil ikke er committet til git
- [x] Sikkerhetsguard implementert (app.local.json, pre-commit hooks)
- [x] API-nøkler lagret i GitHub Secrets

### Prosjektstruktur
- [x] Fikse manglende src-mappe og alle screens
- [x] Implementere alle manglende services (Firebase, authPersistence)
- [x] Opprette alle screens (Login, Home, Vote, Profile, Community, LocalHistory)
- [x] TypeScript konfigurasjon fikset
- [x] README.md opprettet

### Funksjonalitet
- [x] Firebase-integrasjon fullstendig implementert
- [x] Firestore-integrasjon for avstemninger
- [x] Real-time updates med Firestore listeners
- [x] Stemmefunksjonalitet med validering
- [x] Offline-støtte med caching (5 min cache)
- [x] Error boundaries og error handling
- [x] Performance-optimalisering (React.memo, useMemo)

### Ytelse og UX
- [x] Responsive design for nettbrett
- [x] Pull-to-refresh på alle screens
- [x] Optimistisk UI updates
- [x] Loading states og skeleton screens
- [x] Safe logging (console.log kun i development)

### Deployment
- [x] Konfigurere Expo for web build
- [x] Legge til GitHub Actions workflow for automatisk deploy
- [x] Setup web deployment med GitHub Secrets
- [x] Deploy til GitHub Pages konfigurert

## ⏳ Gjenstående oppgaver

### 🔒 Sikkerhet (Praktisk)
- [ ] Verifisere at deploy fungerer med GitHub Secrets
- [ ] Teste at appen fungerer på GitHub Pages

### 🏙️ Oslo-orientering
- [ ] Gjennomgå alle poll-titler og beskrivelser (de fleste er allerede Oslo-orientert)
- [ ] Legge til Oslo-spesifikke bydeler (Grünerløkka, Frogner, St. Hanshaugen, etc.)
- [ ] Oppdatere branding og tekster i hele appen
- [ ] Legge til Oslo-logo og farger (hvis relevant)

### 📰 Nyheter for Oslo (Fremtidig)
- [ ] Planlegge struktur for nyhetsfunksjonalitet
- [ ] Identifisere datakilder (Oslo Kommune, NRK Oslo, etc.)
- [ ] Designe UI for nyhetsvisning
- [ ] Implementere nyhetsfeed (kommer senere)

### 🔍 Forbedringer
- [ ] Teste at appen fungerer som web-app på mobil
- [ ] Legge til Firestore Security Rules i Firebase Console
- [ ] Seed initial polls data til Firestore
- [ ] Teste autentisering og stemmefunksjonalitet
- [ ] Legge til testing (hvis relevant)

## 📝 Notater
- Firebase project ID: pulse-oslo
- Repository: https://github.com/kasa031/pulse-experimental
- Web URL: https://kasa031.github.io/pulse-experimental/
- Prosjektet er allerede godt Oslo-orientert i seedPolls.js
- App-navn er nå oppdatert til "Pulse Oslo"
- Alle sikkerhetstiltak er på plass
