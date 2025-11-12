# 🔒 Sikkerhetsguide for Pulse Oslo

## API Nøkler og Sensitive Data

### ⚠️ VIKTIG: ALDRI committ API-nøkler til GitHub!

Dette prosjektet har opplevd at API-nøkler har blitt eksponert på GitHub. For å unngå dette i fremtiden, følg disse retningslinjene:

## Hvordan API-nøkler lagres

### For Development (Lokalt)
API-nøkler lagres i `app.json` under `extra`-seksjonen. Dette er OK for lokal utvikling, men **VIKTIG**: 
- Sjekk at `.gitignore` er oppdatert
- **ALDRI** committ `app.json` hvis den inneholder ekte nøkler
- Bruk `app.json.example` for eksempel nøkler

### For Production
For produksjon, bruk miljøvariabler eller secure storage:
- Expo Secure Store
- Environment variables i CI/CD
- Server-side proxy (anbefalt for sensitive API-kall)

## Nåværende API-nøkler

### Open Router API
- **Lokasjon**: `app.json` → `extra.openrouterApiKey`
- **Status**: ✅ Ny nøkkel implementert (gammel nøkkel er ugyldig)
- **⚠️ ADVARSEL**: Nøkkelen er lagret i `app.json`. **ALDRI committ denne filen hvis den inneholder ekte nøkler!**

## .gitignore Regler

Følgende filer/mønstre er ekskludert fra git:
- `.env*` filer
- `**/*firebase-adminsdk*.json`
- `**/*-config.json`
- `**/secrets.json`
- `**/credentials.json`
- Alle filer med API-nøkler

## Hvis en nøkkel er eksponert

1. **Umiddelbart**: Gå til API-tjenesten og gjør nøkkelen ugyldig
2. **Sjekk git-historikk**: Se om nøkkelen er i tidligere commits
3. **Roter ut**: Bruk `git filter-branch` eller `git filter-repo` for å fjerne nøkkelen fra historikken
4. **Opprett ny nøkkel**: Lag en ny nøkkel i API-tjenesten
5. **Oppdater kode**: Oppdater koden med ny nøkkel på sikker måte

## Best Practices

1. ✅ Bruk miljøvariabler for sensitive data
2. ✅ Sjekk `.gitignore` før hver commit
3. ✅ Bruk `git status` for å se hva som skal committes
4. ✅ Bruk eksempel-filer (`.example`) for dokumentasjon
5. ❌ ALDRI hardkod nøkler i kildekode
6. ❌ ALDRI committ `.env` filer
7. ❌ ALDRI del nøkler i chat/kode-deling uten kryptering

## Sjekkliste før commit

- [ ] Har jeg sjekket `git status`?
- [ ] Er alle sensitive filer i `.gitignore`?
- [ ] Har jeg fjernet hardkodede nøkler fra koden?
- [ ] Bruker jeg miljøvariabler eller secure storage?
- [ ] Har jeg testet at appen fungerer med nye nøkler?

