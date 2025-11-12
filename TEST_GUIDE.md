# 🧪 Test Guide - Kort Versjon

## 🚀 Rask Testing

### ✅ Kjøre på BÅDE Mobil OG Web Samtidig (Anbefalt!)

```bash
npm start
```

Dette starter Expo serveren. Deretter kan du:

1. **For Web:** Trykk `w` i terminalen
   - Åpner automatisk i nettleseren på `http://localhost:19006`
   
2. **For Mobil:** Skanne QR-koden
   - Last ned **Expo Go** app på telefonen
   - Skanne QR-koden som vises i terminalen
   - **Viktig:** PC og telefon må være på samme Wi-Fi

**Du kan nå teste på begge samtidig!** 🎉

### Alternativ: Kun Web
```bash
npm run web
```
Åpner appen i nettleseren på `http://localhost:19006`

### Alternativ: Kun Mobil
```bash
npm start
```
- Trykk IKKE `w` (la være)
- Skanne QR-koden med Expo Go app

### 3. Test Produksjon
Gå til: https://kasa031.github.io/pulse-experimental/

## ✅ Hva skal testes?

1. **Innlogging** - Logg inn og ut
2. **Avstemninger** - Se, søk, stem
3. **Diskusjoner** - Opprett og kommenter
4. **Nyheter** - Se nyhetsfeed
5. **Profil** - Se og rediger profil
6. **Oslo** - Test quiz og gatenavn-historie
7. **Responsivt design** - Test på mobil, nettbrett, desktop

## 💡 Tips

- **Test på begge samtidig:** Start med `npm start`, trykk `w` for web, og scan QR for mobil
- **Hot reload:** Endringer i koden oppdateres automatisk på både web og mobil
- **Expo Dev Tools:** Trykk `m` for å åpne Expo Dev Tools i nettleseren

## 🔧 Feilsøking

**Kan ikke koble til fra mobil?**
- Sjekk at PC og mobil er på samme Wi-Fi
- I terminalen, trykk `s` og velg "Tunnel"
- Eller trykk `t` for tunnel mode (fungerer uten samme Wi-Fi)

**Appen laster ikke?**
- Sjekk at `app.local.json` eksisterer
- Kjør `npm run setup-local`

**Web åpner ikke automatisk?**
- Gå manuelt til: `http://localhost:19006`
- Eller trykk `w` igjen i terminalen

