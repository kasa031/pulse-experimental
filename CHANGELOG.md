# Changelog

Alle betydelige endringer i dette prosjektet vil bli dokumentert i denne filen.

Formatet er basert på [Keep a Changelog](https://keepachangelog.com/no/1.0.0/),
og dette prosjektet følger [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planlagt
- Nyhetsfeed-funksjonalitet
- Push-notifikasjoner
- Avanserte filtre for avstemninger

## [1.1.0] - 2025-01-XX

### Added - Sikkerhet
- ✅ Input validering og sanitization (`src/utils/validation.ts`)
- ✅ Rate limiting for API-kall (`src/utils/rateLimiter.ts`)
- ✅ Forbedrede Firestore Security Rules med granular kontroll
- ✅ Password strength requirements
- ✅ Email verification support

### Added - Funksjonalitet
- ✅ Versjonshåndtering og changelog system
- ✅ Forbedret stemmefunksjonalitet med validering
- ✅ Oslo-branding med 17 bydeler
- ✅ User profile management struktur

### Changed
- ✅ Forbedret sikkerhet i `pollsService.ts` med validering
- ✅ Oppdatert `LoginScreen` med password strength feedback
- ✅ Forbedret error handling gjennom appen

### Security
- 🔒 Input sanitization for å forhindre XSS
- 🔒 Rate limiting for å forhindre spam og DoS
- 🔒 Forbedret Firestore Security Rules
- 🔒 Password strength requirements

## [1.0.0] - 2025-01-05

### Added
- ✅ Initial release
- ✅ Firebase autentisering
- ✅ Firestore database integrasjon
- ✅ 24 seed-avstemninger om Oslo-temaer
- ✅ Real-time updates med Firestore listeners
- ✅ Offline-støtte med caching
- ✅ Responsive design for mobil og nettbrett
- ✅ Error boundaries og error handling
- ✅ Performance-optimalisering (React.memo, useMemo)
- ✅ GitHub Actions for automatisk deploy
- ✅ GitHub Pages deployment

### Security
- ✅ Firebase credentials i GitHub Secrets
- ✅ Pre-commit hooks for å forhindre credential leaks
- ✅ Firestore Security Rules implementert

---

## Versjoneringsformat

Vi bruker [Semantic Versioning](https://semver.org/):
- **MAJOR** (1.0.0): Breaking changes
- **MINOR** (0.1.0): Nye features, bakoverkompatibel
- **PATCH** (0.0.1): Bug fixes, bakoverkompatibel

## Release Notes

Se [RELEASES.md](./RELEASES.md) for detaljerte release notes.

