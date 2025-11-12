# Testing Metoder - OsloPuls

## 📋 Oversikt over alle testmetoder

---

## 🌐 **TESTING I NETTLESER (PC)**

### Metode 1: Expo Dev Tools (Anbefalt)
1. Start serveren: `npx expo start`
2. I terminalen, trykk **`w`** (for web)
3. Nettleseren åpnes automatisk på `http://localhost:19006`

### Metode 2: Direkte URL
1. Start serveren: `npx expo start`
2. Åpne nettleseren manuelt
3. Gå til: `http://localhost:19006`

### Metode 3: GitHub Pages (Produksjon)
1. Appen er allerede deployet til GitHub Pages
2. Gå til: `https://kasa031.github.io/pulse-experimental/`
3. Dette er den publiserte versjonen (krever deploy)

### Hvilken nettleser?
- ✅ **Chrome** (anbefalt)
- ✅ **Edge**
- ✅ **Firefox**
- ⚠️ Safari kan ha noen begrensninger

### Testing i nettleser:
- Test responsive design ved å endre vinduets størrelse
- Trykk F12 for Developer Tools
- Test touch-funksjonalitet med Device Mode (Chrome DevTools)

---

## 📱 **TESTING PÅ MOBIL (iPhone/Android)**

### Metode 1: Expo Go App (Enklest - Anbefalt)
**For iPhone:**
1. Last ned **Expo Go** fra App Store
2. Start serveren: `npx expo start`
3. Sørg for at iPhone og PC er på samme Wi-Fi
4. Åpne Expo Go appen
5. Skanne QR-koden fra terminalen
6. Appen laster automatisk

**For Android:**
1. Last ned **Expo Go** fra Google Play Store
2. Start serveren: `npx expo start`
3. Sørg for at Android og PC er på samme Wi-Fi
4. Åpne Expo Go appen
5. Skanne QR-koden fra terminalen
6. Appen laster automatisk

### Metode 2: Manuell URL (Hvis QR-kode ikke fungerer)
1. Start serveren: `npx expo start`
2. I terminalen, trykk **`s`** (for connection options)
3. Velg "LAN" eller "Tunnel"
4. Kopier URL-en som vises (f.eks. `exp://192.168.1.100:8081`)
5. Åpne Expo Go appen
6. Trykk "Enter URL manually"
7. Lim inn URL-en

### Metode 3: Tunnel Mode (Hvis Wi-Fi ikke fungerer)
1. Start serveren: `npx expo start --tunnel`
2. Vent til tunnel er opprettet
3. Skanne QR-koden (nå med tunnel URL)
4. Fungerer selv om enheter er på forskjellige nettverk

### Metode 4: Expo Dev Client (For avanserte funksjoner)
1. Bygg en custom development build: `npx expo run:ios` eller `npx expo run:android`
2. Installer builden på enheten
3. Start serveren: `npx expo start --dev-client`
4. Åpne appen og den kobler automatisk til serveren

---

## 📱 **TESTING PÅ NETTBRETT (iPad/Android Tablet)**

### Metode 1: Expo Go App (Samme som mobil)
**For iPad:**
1. Last ned **Expo Go** fra App Store på iPad
2. Start serveren: `npx expo start`
3. Sørg for at iPad og PC er på samme Wi-Fi
4. Åpne Expo Go appen på iPad
5. Skanne QR-koden fra terminalen
6. Appen laster automatisk

**For Android Tablet:**
1. Last ned **Expo Go** fra Google Play Store på nettbrettet
2. Start serveren: `npx expo start`
3. Sørg for at nettbrettet og PC er på samme Wi-Fi
4. Åpne Expo Go appen på nettbrettet
5. Skanne QR-koden fra terminalen
6. Appen laster automatisk

### Metode 2: Responsive Design Testing i Nettleser
1. Åpne appen i nettleser (Chrome/Edge)
2. Trykk F12 for Developer Tools
3. Klikk på "Toggle device toolbar" (Ctrl+Shift+M)
4. Velg iPad eller Android Tablet fra device-listen
5. Test både portrett og liggende modus

---

## 💻 **TESTING I EMULATOR/SIMULATOR**

### iOS Simulator (Kun på Mac)
1. Installer Xcode fra App Store
2. Start serveren: `npx expo start`
3. I terminalen, trykk **`i`** (for iOS simulator)
4. Simulatoren åpnes automatisk med appen

### Android Emulator
1. Installer Android Studio
2. Opprett en Android Virtual Device (AVD)
3. Start emulatoren
4. Start serveren: `npx expo start`
5. I terminalen, trykk **`a`** (for Android)
6. Appen åpnes i emulatoren

---

## 🔧 **FEILSØKING OG ALTERNATIVER**

### Problem: Kan ikke koble til fra mobil
**Løsninger:**
1. ✅ Sjekk at PC og mobil er på samme Wi-Fi
2. ✅ Prøv Tunnel mode: `npx expo start --tunnel`
3. ✅ Prøv LAN mode: Trykk `s` og velg "LAN"
4. ✅ Sjekk firewall-innstillinger på PC
5. ✅ Prøv å deaktivere VPN hvis aktiv

### Problem: QR-kode fungerer ikke
**Løsninger:**
1. ✅ Prøv manuell URL (trykk `s` i terminalen)
2. ✅ Sjekk at Expo Go appen er oppdatert
3. ✅ Prøv Tunnel mode
4. ✅ Restart Expo serveren

### Problem: Appen laster ikke
**Løsninger:**
1. ✅ Clear cache: `npx expo start --clear`
2. ✅ Restart serveren
3. ✅ Sjekk internettforbindelse
4. ✅ Prøv å reload: Trykk `r` i terminalen

### Problem: Endringer vises ikke
**Løsninger:**
1. ✅ Trykk `r` i terminalen for reload
2. ✅ Rist telefonen og velg "Reload" i Expo Go
3. ✅ Clear cache og restart
4. ✅ Sjekk at filen er lagret

---

## 📊 **SAMMENLIGNING AV METODER**

| Metode | Hastighet | Enkelhet | Funksjonalitet | Anbefalt for |
|--------|-----------|----------|-----------------|--------------|
| **Nettleser** | ⚡⚡⚡ Rask | ⭐⭐⭐ Veldig enkelt | ⚠️ Begrenset | Rask testing, UI |
| **Expo Go (Mobil)** | ⚡⚡ Medium | ⭐⭐⭐ Veldig enkelt | ✅ Full | Ekte enhet testing |
| **Expo Go (Nettbrett)** | ⚡⚡ Medium | ⭐⭐⭐ Veldig enkelt | ✅ Full | Responsive design |
| **Tunnel Mode** | ⚡ Langsom | ⭐⭐ Middels | ✅ Full | Forskjellige nettverk |
| **Dev Client** | ⚡⚡ Medium | ⭐ Vanskelig | ✅✅✅ Fullest | Native moduler |
| **Emulator** | ⚡⚡⚡ Rask | ⭐⭐ Middels | ✅ Full | Utvikling uten enhet |

---

## 🎯 **ANBEFALTE TESTING-FLOW**

### For rask testing:
1. **Nettleser** (`w` i terminalen) - Test UI og layout
2. **Expo Go på mobil** - Test touch og responsivitet

### For grundig testing:
1. **Nettleser** - Test alle skjermer og navigasjon
2. **iPhone med Expo Go** - Test iOS-spesifikke funksjoner
3. **Android med Expo Go** - Test Android-spesifikke funksjoner
4. **iPad med Expo Go** - Test nettbrett-layout
5. **GitHub Pages** - Test produksjonsversjonen

---

## 🚀 **SNARVEIER I TERMINALEN**

Når `npx expo start` kjører:

| Tast | Handling |
|------|----------|
| **`w`** | Åpne i nettleser |
| **`a`** | Åpne i Android emulator |
| **`i`** | Åpne i iOS simulator (Mac) |
| **`r`** | Reload app |
| **`m`** | Toggle menu |
| **`s`** | Velg connection type (LAN/Tunnel) |
| **`c`** | Clear cache |
| **`q`** | Quit server |

---

## 📝 **PRAKTISK EKSEMPEL**

### Scenario: Teste på iPhone, Android og nettleser

1. **Start serveren:**
   ```bash
   npx expo start
   ```

2. **Test i nettleser:**
   - Trykk `w` i terminalen
   - Test alle skjermer og funksjoner

3. **Test på iPhone:**
   - Åpne Expo Go på iPhone
   - Skanne QR-koden
   - Test touch-funksjonalitet

4. **Test på Android:**
   - Åpne Expo Go på Android
   - Skanne QR-koden (eller bruk samme URL)
   - Test Android-spesifikke funksjoner

5. **Test på nettbrett:**
   - Åpne Expo Go på iPad/Android Tablet
   - Skanne QR-koden
   - Test responsive design og grid-layout

---

## ✅ **TEST-CHECKLISTE**

### Nettleser:
- [ ] Appen laster riktig
- [ ] Navigasjon fungerer
- [ ] Responsive design på ulike størrelser
- [ ] WebNavigation (sidebar/hamburger) fungerer
- [ ] Alle skjermer er tilgjengelige

### Mobil (iPhone/Android):
- [ ] Appen laster via Expo Go
- [ ] Tab-navigasjon fungerer
- [ ] Touch targets er store nok
- [ ] Pull-to-refresh fungerer
- [ ] Innlogging fungerer
- [ ] Alle skjermer er tilgjengelige

### Nettbrett:
- [ ] Grid-layout fungerer
- [ ] Responsive design tilpasser seg
- [ ] Både portrett og liggende modus fungerer
- [ ] Touch-gestures fungerer
- [ ] Alle skjermer er tilgjengelige

---

**Tips:** Start alltid med nettleser for rask testing, deretter test på ekte enheter for full funksjonalitet!

