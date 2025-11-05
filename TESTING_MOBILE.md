# 📱 Testing på Mobil - Guide

## Hvordan teste uten å pushe/committe credentials

### ✅ Løsning: `app.local.json` (IKKE i git)

1. **Credentials er lagret i `app.local.json`** (som er i `.gitignore`)
2. **`app.json` er safe å committe** (inneholder kun placeholder-verdier)
3. **Automatisk merge** før hver `npm start`

## Steg 1: Setup (kun første gang)

Credentials er allerede lagret i `app.local.json` - dette er gjort! ✅

## Steg 2: Teste på mobil

### Metode 1: Expo Go (Enklest - for testing)

1. **Installer Expo Go app:**
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Start utviklingsserveren:**
   ```bash
   npm start
   ```
   (Scriptet merger automatisk credentials fra `app.local.json`)

3. **Scan QR-koden:**
   - iOS: Åpne Camera app og scan QR-koden
   - Android: Åpne Expo Go app og scan QR-koden

4. **Appen laster på mobilen!** 🎉

### Metode 2: Development Build (For produksjon-lignende testing)

1. **Bygg development build:**
   ```bash
   npx expo run:android
   # eller
   npx expo run:ios
   ```

2. **Installer på mobil via USB/Simulator**

### Metode 3: Web (for rask testing)

```bash
npm run web
```

Åpner appen i nettleseren på mobil/PC.

## Hvordan det fungerer:

1. **`npm start`** kjører automatisk `prestart` script
2. Scriptet leser `app.local.json` (med dine credentials)
3. Merger credentials inn i `app.json` (bare lokalt)
4. Starter Expo server
5. Du kan scanne QR-koden med Expo Go

## Sikkerhet:

✅ **`app.local.json` er i `.gitignore`** - committes aldri  
✅ **`app.json` har placeholder-verdier** - safe å committe  
✅ **Pre-commit hook** stopper deg hvis du prøver å committe credentials  
✅ **Automatisk merge** - ingen manuell jobb

## Troubleshooting:

### "Cannot find module 'app.local.json'"
- Sjekk at `app.local.json` eksisterer i rot-mappen
- Kjør: `npm run setup-local` for å opprette den

### "Firebase not initialized"
- Sjekk at credentials i `app.local.json` er riktige
- Verifiser at `prestart` script kjører (se output)

### QR-kode fungerer ikke
- Sørg for at mobil og PC er på samme nettverk
- Prøv å bruke tunnel mode: `npm start -- --tunnel`

## Neste steg:

1. Kjør `npm start`
2. Scan QR-koden med Expo Go
3. Test appen på mobilen! 📱

