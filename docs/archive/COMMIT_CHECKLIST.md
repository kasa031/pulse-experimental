# ✅ Sjekkliste før Commit

## ⚠️ KRITISK: Sjekk før du committer!

### 1. API Nøkler
- [ ] **Har du sjekket at `app.json` IKKE inneholder ekte API-nøkler?**
  - Hvis `app.json` inneholder `sk-or-v1-...`, IKKE committ den!
  - Bruk `app.json.example` for eksempel nøkler i stedet
  - Din lokale `app.json` kan ha ekte nøkler, men ikke committ den!

### 2. Sensitive Filer
- [ ] Ingen `.env*` filer i staging area
- [ ] Ingen `*firebase-adminsdk*.json` filer
- [ ] Ingen `*secrets*.json` eller `*credentials*.json` filer

### 3. Sjekk Git Status
```bash
git status
```
- [ ] Kun filer du faktisk vil committe er staged
- [ ] Ingen sensitive filer er inkludert

### 4. Sjekk Diff
```bash
git diff --cached
```
- [ ] Ingen API-nøkler synlig i diff
- [ ] Ingen hardkodede passord eller tokens

## Hvis du har committet en nøkkel ved uhell:

1. **Umiddelbart**: Gå til API-tjenesten og gjør nøkkelen ugyldig
2. **Fjern fra git**: `git reset HEAD~1` (hvis ikke pushet)
3. **Roter ut fra historikk**: Kontakt repo-admin for hjelp
4. **Opprett ny nøkkel**: Lag en ny nøkkel i API-tjenesten

## Anbefalt workflow:

1. Bruk `app.json.example` som mal
2. Kopier til `app.json` lokalt
3. Legg inn din faktiske nøkkel i lokal `app.json`
4. **Commit kun `app.json.example`** (ikke `app.json`)

