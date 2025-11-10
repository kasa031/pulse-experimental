# 🚀 Bygg og Kjør Appen på Android

## Kommandoer (kjør i rekkefølge)

### 1. Sjekk at emulatoren kjører
Først må emulatoren være startet. Hvis den ikke kjører:
- Åpne Android Studio
- Device Manager → Start emulatoren (f.eks. Pixel 5 med API 33)

### 2. Bygg og kjør appen
Kjør denne kommandoen i terminalen:

```bash
npm run android
```

Eller hvis du vil starte Expo først:

```bash
npm start
```

Deretter trykk `a` for Android.

### 3. Hva skjer?
- Expo starter Metro bundler
- Appen bygges for Android
- Appen installeres på emulatoren
- Appen starter automatisk

### 4. Hvis det feiler
Sjekk at:
- ✅ Emulatoren kjører
- ✅ `app.local.json` har riktige Firebase credentials
- ✅ Du har nok diskplass
- ✅ Internettforbindelse fungerer

### 5. Debugging
Hvis appen ikke starter, sjekk terminalen for feilmeldinger. Vanlige feil:
- Firebase ikke konfigurert → Sjekk `app.local.json`
- Emulator ikke funnet → Start emulatoren først
- Build feiler → Sjekk at alle dependencies er installert

## Alternativ: Bruk fysisk enhet

Hvis emulatoren ikke fungerer:
1. Aktiver USB debugging på telefonen
2. Koble til telefonen
3. Kjør: `npm run android`
4. Velg telefonen når Expo spør

