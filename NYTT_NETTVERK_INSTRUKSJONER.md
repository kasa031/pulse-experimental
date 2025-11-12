# 🔄 Instruksjoner for Nytt Nettverk

## ✅ Hva er gjort:
- ✅ Lokal konfigurasjon er satt opp
- ✅ Expo serveren er startet

## 📱 Neste Steg:

### 1. Sjekk Terminalen
Du skal se en QR-kode og Expo Dev Tools i terminalen.

### 2. For Web Testing:
Trykk **`w`** i terminalen for å åpne i nettleseren.

### 3. For Mobil Testing (Nytt Nettverk):

**Viktig:** Siden du har byttet nettverk, må du:

#### Metode 1: Tunnel Mode (Anbefalt - Fungerer overalt)
1. I terminalen, trykk **`t`** (for tunnel)
2. Vent til tunnel er opprettet (kan ta 10-30 sekunder)
3. En ny QR-kode vises med tunnel URL
4. Skanne den nye QR-koden med Expo Go appen
5. Fungerer selv om PC og telefon er på forskjellige nettverk!

#### Metode 2: Samme Nettverk
1. Koble telefonen til samme Wi-Fi som PC-en
2. Skanne den opprinnelige QR-koden
3. Fungerer raskere, men krever samme nettverk

#### Metode 3: LAN Mode
1. I terminalen, trykk **`s`** (for connection options)
2. Velg "LAN"
3. Skanne QR-koden
4. PC og telefon må være på samme nettverk

## 🔧 Hvis Noe Ikke Fungerer:

### Serveren startet ikke?
```bash
npm start
```

### QR-koden vises ikke?
- Trykk `s` i terminalen for connection options
- Eller trykk `t` for tunnel mode

### Kan ikke koble til fra mobil?
- Prøv tunnel mode (trykk `t`)
- Eller sjekk at telefonen er på samme Wi-Fi

### Web åpner ikke?
- Trykk `w` i terminalen
- Eller gå manuelt til: `http://localhost:19006`

## 💡 Tips:
- **Tunnel mode** er best hvis du er usikker på nettverket
- **LAN mode** er raskere hvis du er på samme nettverk
- Du kan teste på både web og mobil samtidig!

