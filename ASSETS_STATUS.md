# 📸 Assets Status - Oversikt over bilder og logoer

## ✅ Brukte bilder

### Logoer
- ✅ `oslo-logo.png` 
  - Brukt i: `LoginScreen.tsx`, `HomeScreen.tsx`
  - Status: Aktivt i bruk
  - Størrelse: 80x80px (LoginScreen), 48x48px (HomeScreen)

- ✅ `frigg-oslo-logo.png`
  - Brukt i: `ContactScreen.tsx`
  - Status: Aktivt i bruk
  - Størrelse: 120x120px

## ❓ Ubrukte bilder (vurder bruk eller fjerne)

### Logoer
- ❓ `pul-is-logo.png`
  - Status: Ikke brukt
  - Anbefaling: Vurder å bruke i en av skjermene eller fjern hvis ikke nødvendig
  - Mulige bruksområder:
    - ProfilScreen (som alternativ logo)
    - About/Info-seksjon
    - Footer i ContactScreen

- ❓ `frigg-oslo-logo-400x400.png`
  - Status: Ikke brukt (duplikat av `frigg-oslo-logo.png`)
  - Anbefaling: Fjern hvis `frigg-oslo-logo.png` er tilstrekkelig
  - Eller: Bruk denne hvis større versjon trengs

## 📋 System-bilder (ikke endre)

- `icon.png` - App-ikon (Expo)
- `adaptive-icon.png` - Android adaptive icon
- `splash-icon.png` - Splash screen
- `favicon.png` - Web favicon

## 🎯 Anbefalinger

### For å fjerne ubrukte bilder:
1. Sjekk om `pul-is-logo.png` skal brukes
2. Hvis ikke, fjern fra `assets/` mappen
3. Hvis `frigg-oslo-logo-400x400.png` er duplikat, fjern den

### For å bruke ubrukte bilder:
1. `pul-is-logo.png` kan legges til i:
   - ProfilScreen som alternativ logo
   - About-seksjon i ContactScreen
   - Footer eller header

2. `frigg-oslo-logo-400x400.png` kan brukes hvis større versjon trengs:
   - Større visning i ContactScreen
   - Hero-bilde på HomeScreen

## 📝 Notater

- Alle bilder er organisert i `assets/` mappen
- Bilder er ekskludert fra `.gitignore` hvis de inneholder sensitive data
- Logoer er generelt trygge å committe (ikke sensitive)

