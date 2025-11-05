# Release Notes

## [1.1.0] - Sikkerhet og Stabilitet - 2025-01-XX

### 🎯 Hovedfokus
Denne versjonen fokuserer på å forbedre sikkerheten og stabiliteten til appen, samt legge til nødvendige verktøy for versjonshåndtering.

### ✨ Nye Features

#### Sikkerhet
- **Input Validering**: Alle brukerinputs valideres nå før de sendes til server
  - E-post validering
  - Passord styrke-krav (minst 8 tegn, bokstaver + tall)
  - Poll title/description validering
  - Sanitization for XSS-beskyttelse

- **Rate Limiting**: Client-side rate limiting for å forhindre spam
  - 10 stemmer per minutt
  - 5 innlogginger per 15 minutter
  - 3 registreringer per time
  - 5 poll-opprettelser per time

- **Forbedrede Security Rules**: Mer granular kontroll i Firestore
  - Admin-brukere kan kun opprette polls
  - Email verification påkrevd for å stemme
  - En stemme per bruker per poll
  - Validering av data-struktur

#### Versjonshåndtering
- **Changelog System**: Automatisk tracking av endringer
- **Semantic Versioning**: Følger semver-standard
- **Release Notes**: Detaljerte beskrivelser av hver versjon

### 🔧 Forbedringer

- Forbedret error handling i alle services
- Mer informative feilmeldinger
- Bedre brukeropplevelse ved validering

### 🔒 Security Fixes

- Input sanitization for alle tekstfelter
- Rate limiting implementert
- Forbedret Firestore Security Rules
- Password strength requirements

### 📝 Breaking Changes

Ingen breaking changes i denne versjonen.

### 🐛 Bug Fixes

- Fikset potensielle XSS-sårbarheter
- Forbedret håndtering av edge cases i validering

---

## [1.0.0] - Initial Release - 2025-01-05

### 🎉 Første offisielle versjon

#### Core Features
- Firebase autentisering (email/password)
- Firestore database integrasjon
- 24 seed-avstemninger om Oslo-temaer
- Real-time updates
- Offline-støtte

#### Design
- Oslo-branding med offisielle farger
- Responsive design for mobil og nettbrett
- Moderne UI med React Native Paper

#### Deployment
- GitHub Actions for automatisk deploy
- GitHub Pages integration
- Secure credential management

#### Performance
- React performance optimizations
- Caching strategi (5 min cache)
- Optimistic UI updates

---

## Hvordan lese Release Notes

### Versjoner
- **MAJOR.MINOR.PATCH** (f.eks. 1.1.0)
- MAJOR: Breaking changes
- MINOR: Nye features (bakoverkompatibel)
- PATCH: Bug fixes (bakoverkompatibel)

### Kategorier
- ✨ **Nye Features**: Funksjonalitet som er lagt til
- 🔧 **Forbedringer**: Forbedringer av eksisterende features
- 🔒 **Security**: Sikkerhetsforbedringer
- 🐛 **Bug Fixes**: Feil som er rettet
- 📝 **Breaking Changes**: Endringer som kan påvirke eksisterende kode

