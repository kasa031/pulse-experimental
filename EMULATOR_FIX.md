# 🔧 Android Emulator Fix - Pixel 8a API 34

## Problem
"The emulator process for AVD Pixel_8a has terminated."

## Løsninger (prøv i rekkefølge)

### 1. Sjekk System Requirements
- **RAM:** Minimum 8GB, anbefalt 16GB
- **Diskplass:** Minimum 10GB ledig plass
- **Hyper-V:** Må være aktivert på Windows

### 2. Start Emulator fra Kommandolinjen
Åpne PowerShell i Android Studio terminal og kjør:
```powershell
cd $env:LOCALAPPDATA\Android\Sdk\emulator
.\emulator -avd Pixel_8a -verbose
```

Dette vil vise detaljerte feilmeldinger.

### 3. Sjekk Hyper-V (Windows)
```powershell
# Sjekk om Hyper-V er aktivert
Get-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V-All

# Hvis ikke aktivert, aktiver det:
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V-All -NoRestart
```

### 4. Prøv Cold Boot
I Android Studio Device Manager:
1. Klikk på dropdown ved siden av Pixel 8a
2. Velg "Cold Boot Now"
3. Vent på at emulatoren starter

### 5. Slett og Opprett Ny Emulator
1. I Device Manager: Klikk på Pixel 8a → "Delete"
2. Klikk "Create Device"
3. Velg en annen enhet (f.eks. Pixel 5)
4. Velg API 33 i stedet for API 34 (mer stabil)
5. Fullfør oppsettet

### 6. Sjekk Android Studio Logs
1. I Android Studio: Help → Show Log in Explorer
2. Åpne `idea.log`
3. Søk etter "emulator" eller "AVD"
4. Se etter feilmeldinger

### 7. Prøv API 33 i Stedet
API 34 er nytt og kan ha bugs. Prøv API 33:
1. Tools → SDK Manager
2. SDK Platforms → Install Android 13.0 (API 33)
3. Opprett ny emulator med API 33

### 8. Sjekk Diskplass
```powershell
# Sjekk ledig plass på C:\
Get-PSDrive C | Select-Object Used,Free
```

### 9. Prøv WSL2 (Hvis Hyper-V ikke fungerer)
```powershell
# Sjekk om WSL2 er installert
wsl --status

# Hvis ikke, installer:
wsl --install
```

### 10. Alternativ: Bruk Fysisk Enhet
Hvis emulator fortsatt ikke fungerer:
1. Aktiver USB debugging på Pixel 5
2. Koble til telefonen
3. I Android Studio: Run → Select Device → Velg din telefon

## Rask Fix: Bruk API 33

Den raskeste løsningen er å bruke API 33 i stedet for API 34:

1. **Installér API 33:**
   - Android Studio → Tools → SDK Manager
   - SDK Platforms → Install "Android 13.0 (Tiramisu)" API 33

2. **Opprett ny emulator:**
   - Device Manager → Create Device
   - Velg Pixel 5 eller Pixel 6
   - Velg API 33 (ikke 34)
   - Fullfør oppsettet

3. **Oppdater app.json:**
   ```json
   "android": {
     "compileSdkVersion": 33,
     "targetSdkVersion": 33,
     ...
   }
   ```

## Debugging

Hvis ingenting fungerer, kjør dette for detaljerte logs:
```powershell
cd $env:LOCALAPPDATA\Android\Sdk\emulator
.\emulator -list-avds
.\emulator -avd Pixel_8a -verbose 2>&1 | Tee-Object -FilePath emulator.log
```

Send `emulator.log` for hjelp.

