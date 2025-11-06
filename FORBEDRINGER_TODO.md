# 📋 Todo-liste: Forbedringer og Utvidelser for Pulse Oslo

**Opprettet:** 2025-01-27  
**Mål:** Stabil, responsiv app for mobil og nettbrett med god brukeropplevelse

---

## 🔴 Høy prioritet - Kritisk for stabilitet

### Layout og Responsivitet
- [x] **Forbedre tab-navigasjon for web med hover-meny**
  - ✅ WebNavigation-komponent opprettet med sidebar for desktop
  - ✅ Hamburger-meny for tablet/mobil
  - ✅ Hover-effekter på menyelementer
  - ✅ Integrert WebNavigation i App.tsx (kun på web)
  - [ ] Test hover-funksjonalitet

- [ ] **Responsiv layout for alle skjermer**
  - Sjekk og forbedre tablet-layout (768px+)
  - Optimaliser mobil-layout (< 768px)
  - Desktop-layout (> 1024px) med sidebar-navigasjon
  - Test på forskjellige skjermstørrelser

- [x] **Forbedre touch-targets for mobil**
  - ✅ Minimum 44x44px touch targets (touchTargets.ts constants)
  - ✅ Bedre spacing mellom klikkbare elementer (LoginScreen oppdatert)
  - [ ] Swipe-gestures hvor relevant

### Bilder og Assets
- [x] **Flytte og organisere bilder**
  - ✅ Flyttet `Bilder/toppng.com-frigg-oslo-fk-vector-logo-400x400.png` til assets/
  - ✅ Slettet tom Bilder-mappe
  - [ ] Sjekke at alle bilder i assets/ er i bruk

- [x] **Bruke ubrukte logoer**
  - ✅ `frigg-oslo-logo.png` - Lagt til i ContactScreen
  - [ ] `pul-is-logo.png` - vurdere bruk eller fjerne
  - [ ] `frigg-oslo-logo-400x400.png` - vurdere bruk eller fjerne
  - Sjekke at alle logoer har riktig størrelse og format

### Kontakt og Informasjon
- [x] **Implementer KontaktScreen**
  - ✅ Ny skjerm med kontaktinformasjon
  - ✅ Info om prosjektet og utvikler
  - ✅ E-post: ms.tery@icloud.com
  - ✅ Personlig info: 38 år, tobarnsmor, cybersikkerhetstudent (siste år bachelor)
  - ✅ Tilknyttet Høyskolen i Kristiania
  - ✅ Bor på Bislett med mann og barn
  - ✅ Lagt til i navigasjon

### Navigasjon og Meny
- [ ] **Forbedre navigasjon for web**
  - Implementer hamburger-meny for mobil
  - Sidebar-navigasjon for desktop
  - Hover-expandable meny med beskrivelser
  - Active state indikator
  - Smooth scroll behavior

- [ ] **Optimaliser tab-bar**
  - Skjul tab-bar på desktop, vis sidebar
  - Behold tab-bar på mobil
  - Legg til "Kontakt" i navigasjon
  - Reorganiser tabs for bedre flyt

---

## 🟡 Medium prioritet - Forbedringer

### Brukeropplevelse (UX)
- [x] **Forbedre innlogging**
  - ✅ Bedre feilmeldinger med konkrete løsninger
  - ✅ "Glemt passord?" funksjonalitet
  - [ ] E-post verifisering flow
  - [ ] "Husk meg" funksjonalitet
  - ✅ Loading states under innlogging

- [ ] **Forbedre onboarding**
  - Velkomstskjerm for nye brukere
  - Tutorial eller tips ved første bruk
  - Guide for hvordan man stemmer
  - Forklaring av funksjoner

- [ ] **Forbedre feilhåndtering**
  - Bedre error messages for brukere
  - Retry-funksjonalitet ved feil
  - Offline-indikator
  - Network error handling

### Layout og Design
- [ ] **Konsistent spacing og padding**
  - Standardiser spacing-system
  - Bedre padding på cards
  - Konsistent margins

- [ ] **Forbedre typografi**
  - Responsive font-sizes
  - Bedre line-height for lesbarhet
  - Optimaliser font-weights

- [ ] **Forbedre farger og kontraster**
  - Sjekk WCAG kontrast-ratio
  - Bedre fargehierarki
  - Dark mode support (fremtidig)

### Performance
- [ ] **Optimaliser bildelasting**
  - Lazy loading av bilder
  - Image optimization
  - WebP format hvor mulig
  - Placeholder images

- [ ] **Forbedre initial load**
  - Code splitting
  - Lazy load screens
  - Reduce bundle size

---

## 🟢 Lav prioritet - Nice to have

### Features
- [ ] **Dark mode**
  - Implementer dark theme
  - System preference detection
  - Toggle i settings

- [ ] **Push notifications**
  - Viktige nyheter
  - Nye avstemninger
  - Diskusjonssvar

- [ ] **Søkefunksjonalitet**
  - Global søk i appen
  - Søk i avstemninger
  - Søk i nyheter
  - Søk i diskusjoner

- [ ] **Favoritter**
  - Marker favoritt-avstemninger
  - Favoritt-diskusjoner
  - Favoritt-nyheter

### Dokumentasjon
- [ ] **Forbedre README**
  - Bedre setup-instruksjoner
  - Screenshots
  - Feature overview

- [ ] **Code documentation**
  - JSDoc comments
  - Component documentation
  - API documentation

---

## 📝 Notater

### Bildene som må sjekkes:
- ✅ `oslo-logo.png` - Brukt i LoginScreen og HomeScreen
- ❓ `frigg-oslo-logo.png` - Ikke brukt, vurdere bruk eller fjerne
- ❓ `pul-is-logo.png` - Ikke brukt, vurdere bruk eller fjerne
- ⚠️ `Bilder/toppng.com-frigg-oslo-fk-vector-logo-400x400.png` - Må flyttes til assets/

### Navigasjon struktur:
Nåværende tabs:
1. Hjem
2. Stem
3. Fellesskap
4. Nyheter
5. Profil
6. Lokalhistorie
7. Opprett (admin)

Foreslått reorganisering:
- Hjem
- Stem
- Nyheter
- Fellesskap
- Profil
- Lokalhistorie
- Kontakt (ny)
- Opprett (admin, skjult for ikke-admin)

---

## 🎯 Prioritering for implementering

**Fase 1 (Neste):**
1. Implementer KontaktScreen
2. Flytt bilder og organisere assets
3. Forbedre tab-navigasjon for web med hover

**Fase 2:**
4. Responsiv layout-forbedringer
5. Forbedre innlogging
6. Optimaliser touch-targets

**Fase 3:**
7. Performance-optimaliseringer
8. UX-forbedringer
9. Dokumentasjon

