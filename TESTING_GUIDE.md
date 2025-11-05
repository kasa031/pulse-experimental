# 🧪 Testing Guide - Pulse Oslo

## Teste appen lokalt

### 1. Start appen
```bash
npm start
```

### 2. Test på forskjellige plattformer
- **Web**: Åpne browser og trykk `w`
- **Expo Go (iOS)**: Skann QR-kode med iPhone
- **Expo Go (Android)**: Skann QR-kode med Android

## Teste autentisering

### Steg 1: Opprett test-konto
1. Gå til LoginScreen
2. Klikk "Ingen konto? Opprett en"
3. Skriv inn:
   - E-post: `test@example.com`
   - Passord: `test123456`
4. Klikk "Opprett konto"

### Steg 2: Test innlogging
1. Logg ut (hvis du er logget inn)
2. Prøv å logge inn med samme credentials
3. Verifiser at du blir logget inn

### Steg 3: Test utlogging
1. Gå til Profil-fanen
2. Klikk "Logg ut"
3. Verifiser at du blir sendt til LoginScreen

## Teste stemmefunksjonalitet

### Steg 1: Se aktive avstemninger
1. Gå til "Stem"-fanen
2. Verifiser at du ser 24 avstemninger
3. Scroll ned og se at alle lastes

### Steg 2: Stem på en avstemning
1. Velg en avstemning
2. Velg et alternativ (radio button)
3. Klikk "Stem"
4. Verifiser at:
   - Stemme blir registrert
   - Snackbar vises med "Stemme registrert!"
   - Progress bar vises med oppdaterte stemmer
   - Du kan ikke stemme igjen

### Steg 3: Test offline-støtte
1. Slå av internett (på mobil) eller WiFi (på PC)
2. Prøv å se avstemninger
3. Verifiser at cachede data vises
4. Slå på internett igjen
5. Dra ned for å oppdatere (pull-to-refresh)

## Teste responsive design

### Tablet/Desktop (>768px)
1. Åpne appen i browser
2. Juster vinduet til >768px bredde
3. Verifiser at:
   - Cards er sentrert med max-width
   - Padding er større
   - Layout er mer luftig

### Mobil (<768px)
1. Åpne appen i browser
2. Juster vinduet til <768px bredde
3. Verifiser at:
   - Cards tar full bredde
   - Padding er mindre
   - Layout er kompakt

## Teste på GitHub Pages

### URL
https://kasa031.github.io/pulse-experimental/

### Hva skal fungere:
- ✅ Appen laster
- ✅ Firebase autentisering fungerer
- ✅ Avstemninger lastes fra Firestore
- ✅ Stemmefunksjonalitet fungerer
- ✅ Responsive design fungerer

### Hva som ikke fungerer ennå:
- ⏳ Nyhetsfeed (kommer senere)

## Sjekke deploy-status

1. Gå til: https://github.com/kasa031/pulse-experimental/actions
2. Se om siste deploy har status "✅ green"
3. Hvis "❌ red", sjekk feilmeldinger

## Teste feilhåndtering

### Test 1: Ingen internett
- Slå av internett
- Prøv å laste avstemninger
- Forvent: Cache vises eller feilmelding

### Test 2: Ugyldig e-post ved innlogging
- Skriv inn ugyldig e-post
- Forvent: Feilmelding vises

### Test 3: Stemme uten innlogging
- Logg ut
- Prøv å stemme
- Forvent: Feilmelding "Du må være innlogget"

## Teste på mobil (via GitHub Pages)

### Steg 1: Åpne på mobil
1. Åpne browser på mobil
2. Gå til: https://kasa031.github.io/pulse-experimental/
3. Appen skal laste automatisk

### Steg 2: Test funksjonalitet
- Test autentisering
- Test stemmefunksjonalitet
- Test scrolling og touch
- Test responsive design

## Kjente issues

- Ingen kjente kritiske issues per nå

## Rapportere bugs

Hvis du finner bugs:
1. Noter ned:
   - Hva skjedde?
   - Hva forventet du?
   - Hvilken plattform (web/mobil)?
   - Hvilken browser/OS?
2. Opprett issue på GitHub eller kontakt utvikler

