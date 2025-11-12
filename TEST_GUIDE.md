# 🧪 Test Guide - Kort Versjon

## 🚀 Rask Testing

### 1. Start Appen
```bash
npm run web
```
Åpner appen i nettleseren på `http://localhost:19006`

### 2. Test på Mobil
```bash
npm start
```
- Last ned **Expo Go** app på telefonen
- Skanne QR-koden som vises i terminalen
- **Viktig:** PC og telefon må være på samme Wi-Fi

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

## 🔧 Feilsøking

**Kan ikke koble til fra mobil?**
- Sjekk at PC og mobil er på samme Wi-Fi
- I terminalen, trykk `s` og velg "Tunnel"

**Appen laster ikke?**
- Sjekk at `app.local.json` eksisterer
- Kjør `npm run setup-local`

