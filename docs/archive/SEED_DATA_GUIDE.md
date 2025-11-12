# 🌱 Seed Data til Firestore - Guide

## Hva er seedPolls.js?

`seedPolls.js` er et script som fyller Firestore med 24 eksempel-avstemninger om Oslo-temaer.

## Krav

For å kjøre seedPolls.js trenger du:

1. ✅ **Firebase Service Account Key** (JSON-fil)
   - Filnavn: `pulse-oslo-firebase-adminsdk-fbsvc-6fa2ced435.json`
   - Denne filen er allerede i `.gitignore` (ikke committet til GitHub)

2. ✅ **Firebase Admin SDK** installert
   ```bash
   npm install firebase-admin
   ```

## Hvordan kjøre

### Steg 1: Sjekk at Service Account Key finnes

Filen skal ligge i prosjektets rot:
```
pulse-experimental/
  └── pulse-oslo-firebase-adminsdk-fbsvc-6fa2ced435.json
```

### Steg 2: Installer Firebase Admin SDK (hvis ikke allerede installert)

```bash
npm install firebase-admin
```

### Steg 3: Kjør seed-scriptet

```bash
node seedPolls.js
```

Du skal se output som:
```
La til avstemning: Burde Sofienbergparken få flere blomsterenger?
La til avstemning: Bør det innføres bompenger for elbiler i Oslo sentrum?
...
```

## Hva blir seedet?

24 avstemninger om:
- Miljø og natur
- Transport
- Byutvikling
- Politikk
- Barn og utdanning
- Lokaldemokrati
- Og mer...

## Viktig

- ⚠️ Scriptet vil **legge til** alle polls hver gang det kjøres
- Hvis du kjører det flere ganger, vil du få duplikater
- For å fjerne eksisterende polls, må du slette dem manuelt i Firebase Console

## Sjekk resultatet

Etter at scriptet har kjørt, gå til:
👉 https://console.firebase.google.com/project/pulse-oslo/firestore/data

Du skal se en `polls` collection med 24 dokumenter.

