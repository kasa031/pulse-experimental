# Testing Guide - OsloPuls

## 📱 Hvordan teste på alle plattformer

### 1. Starte utviklingsserveren

Kjør denne kommandoen i terminalen:
```bash
npx expo start
```

Dette vil starte Expo Metro bundler og vise en QR-kode i terminalen.

---

## 🌐 Testing i nettleser (PC)

### Metode 1: Fra Expo Dev Tools
1. Når `npx expo start` kjører, trykk `w` i terminalen
2. Eller åpne nettleseren og gå til: `http://localhost:8081`
3. Klikk på "Open in web browser"

### Metode 2: Direkte URL
- Åpne nettleseren og gå til: `http://localhost:19006`

### Tips for nettleser-testing:
- Bruk Chrome eller Edge for beste kompatibilitet
- Trykk F12 for å åpne Developer Tools
- Test responsive design ved å endre nettleservinduets størrelse
- Test touch-funksjonalitet med Chrome DevTools Device Mode

---

## 📱 Testing på mobil (iPhone/Android)

### For iPhone:
1. Last ned **Expo Go** app fra App Store
2. Åpne Expo Go appen
3. Skanne QR-koden som vises i terminalen
4. Appen vil laste og kjøre på telefonen

### For Android:
1. Last ned **Expo Go** app fra Google Play Store
2. Åpne Expo Go appen
3. Skanne QR-koden som vises i terminalen
4. Appen vil laste og kjøre på telefonen

### Viktig for mobil-testing:
- **iPhone og PC må være på samme Wi-Fi nettverk**
- **Android og PC må være på samme Wi-Fi nettverk**
- Hvis QR-koden ikke fungerer, trykk `s` i terminalen for å se URL-en manuelt

---

## 📱 Testing på nettbrett (iPad/Android Tablet)

### Samme prosess som mobil:
1. Last ned **Expo Go** app på nettbrettet
2. Skanne QR-koden fra terminalen
3. Appen vil kjøre på nettbrettet

### Tips for nettbrett-testing:
- Test både portrett og liggende modus
- Sjekk at grid-layout fungerer riktig
- Test touch-gestures og navigasjon

---

## 🔧 Feilsøking

### Problem: Kan ikke koble til fra mobil
**Løsning:**
1. Sjekk at PC og mobil er på samme Wi-Fi
2. I terminalen, trykk `s` og velg "LAN" eller "Tunnel"
3. Hvis det fortsatt ikke fungerer, prøv `npx expo start --tunnel`

### Problem: Appen laster ikke
**Løsning:**
1. Stopp serveren (Ctrl+C)
2. Slett cache: `npx expo start --clear`
3. Start på nytt

### Problem: Endringer vises ikke
**Løsning:**
1. Trykk `r` i terminalen for å reload
2. Eller rist telefonen og velg "Reload" i Expo Go

---

## 🎯 Test-checkliste

### Nettleser (PC):
- [ ] Appen laster riktig
- [ ] Navigasjon fungerer
- [ ] Responsive design på ulike skjermstørrelser
- [ ] Alle skjermer er tilgjengelige
- [ ] WebNavigation fungerer (sidebar/hamburger menu)

### Mobil (iPhone/Android):
- [ ] Appen laster via Expo Go
- [ ] Tab-navigasjon fungerer
- [ ] Touch targets er store nok
- [ ] Pull-to-refresh fungerer
- [ ] Alle skjermer er tilgjengelige
- [ ] Innlogging fungerer

### Nettbrett:
- [ ] Grid-layout fungerer
- [ ] Responsive design tilpasser seg
- [ ] Både portrett og liggende modus fungerer
- [ ] Touch-gestures fungerer

---

## 🚀 Snarveier i Expo Dev Tools

Når `npx expo start` kjører, kan du trykke:
- `w` - Åpne i nettleser
- `a` - Åpne i Android emulator (hvis installert)
- `i` - Åpne i iOS simulator (hvis installert)
- `r` - Reload app
- `m` - Toggle menu
- `s` - Velg connection type (LAN/Tunnel)
- `c` - Clear cache
- `q` - Quit

---

## 📝 Notater

- For å teste på ekte enheter, bruk Expo Go app
- For rask testing i nettleser, bruk `w` i terminalen
- Alle endringer lagres automatisk og vises i appen (Hot Reload)
- Hvis du gjør store endringer, kan det være nødvendig å reload manuelt
