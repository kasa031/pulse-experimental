# ⚠️ KRITISK ADVARSEL - API NØKKELER I app.json

## 🚨 IKKE COMMITT app.json TIL GITHUB!

**app.json inneholder nå:**
- ✅ Firebase credentials (API keys)
- ✅ Open Router API key

**Dette er sensitive data som ALDRI skal være på GitHub!**

## Hva du må gjøre:

### Før hver commit:

1. **Sjekk git status:**
   ```bash
   git status
   ```

2. **Hvis app.json er i staging area, fjern den:**
   ```bash
   git reset HEAD app.json
   ```

3. **Bruk app.json.example i stedet:**
   - `app.json.example` er allerede i git
   - Den inneholder eksempel-verdier, ikke ekte credentials

## Alternativ løsning:

Hvis du vil committe app.json (uten credentials):

1. Kopier `app.json.example` til `app.json`
2. Legg til dine credentials lokalt
3. **Commit kun app.json.example**, ikke app.json

## Nåværende status:

- ✅ `.gitignore` er satt opp riktig
- ✅ Pre-commit hook vil advare deg
- ⚠️ **Du må selv sjekke før hver commit!**

## Test appen:

```bash
npm start
```

Appen bør nå fungere med Firebase! 🎉

