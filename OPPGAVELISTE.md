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
- [x] Verifisere at deploy fungerer med GitHub Secrets
- [ ] Teste at appen fungerer på GitHub Pages (krever manuell testing)

### 🏙️ Oslo-orientering
- [x] Gjennomgå alle poll-titler og beskrivelser (de fleste er allerede Oslo-orientert)
- [x] Legge til Oslo-spesifikke bydeler (Grünerløkka, Frogner, St. Hanshaugen, etc.)
- [x] Oppdatere branding og tekster i hele appen
- [x] Legge til Oslo-logo og farger

### 📰 Nyheter for Oslo
- [x] Planlegge struktur for nyhetsfunksjonalitet
- [x] Implementere nyhetsfeed-service (getLatestNews, getNewsByDistrict, getNewsByCategory)
- [ ] Identifisere datakilder (Oslo Kommune, NRK Oslo, etc.) - fremtidig
- [ ] Designe UI for nyhetsvisning - fremtidig
- [ ] Full implementering av nyhetsfeed-skjerm - fremtidig

### 🔍 Forbedringer
- [x] Legge til notifikasjons-utility
- [x] Forbedre CommunityScreen med kommentarvisning
- [x] Forbedre HomeScreen med statistikk
- [x] Implementere søk og filter i VoteScreen
- [ ] Teste at appen fungerer som web-app på mobil (krever manuell testing)
- [ ] Legge til Firestore Security Rules i Firebase Console (krever manuell handling)
- [ ] Seed initial polls data til Firestore (krever manuell handling)
- [ ] Teste autentisering og stemmefunksjonalitet (krever manuell testing)

## 📝 Notater
- Firebase project ID: pulse-oslo
- Repository: https://github.com/kasa031/pulse-experimental
- Web URL: https://kasa031.github.io/pulse-experimental/
- Prosjektet er allerede godt Oslo-orientert i seedPolls.js
- App-navn er nå oppdatert til "Pulse Oslo"
- Alle sikkerhetstiltak er på plass
