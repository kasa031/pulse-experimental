# 🔒 API Nøkkel Sikkerhet - Viktig!

## ✅ Hva er gjort:

1. **Ny Open Router API-nøkkel er lagt til i `app.local.json`**
   - ✅ Filen er i `.gitignore` - **ALDRIG committes**
   - ✅ Nøkkelen er oppdatert: `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`

2. **Open Router API er allerede implementert i prosjektet:**
   - ✅ `src/config/api.ts` - API konfigurasjon
   - ✅ `src/services/osloNewsImporter.ts` - Brukes for AI-generering av nyheter

## 🚨 KRITISK - Viktige Sikkerhetsregler:

### ❌ ALDRI gjør dette:
- ❌ **ALDRIG** committ `app.local.json`
- ❌ **ALDRIG** committ `app.json` hvis den inneholder ekte API-nøkler
- ❌ **ALDRIG** push API-nøkler til GitHub
- ❌ **ALDRIG** legg API-nøkler i dokumentasjonsfiler

### ✅ Alltid gjør dette:
- ✅ Bruk `app.local.json` for lokale nøkler (i `.gitignore`)
- ✅ Bruk placeholders i `app.json` (f.eks. `"DIN_API_NØKKEL_HER"`)
- ✅ Pre-commit hook sjekker automatisk for sensitive data
- ✅ For produksjon: Bruk GitHub Secrets

## 📋 Hvordan det fungerer:

1. **Lokalt:**
   - `app.local.json` inneholder dine ekte API-nøkler
   - `npm start` merger automatisk nøkler fra `app.local.json` til `app.json`
   - `app.json` blir IKKE committet hvis den inneholder nøkler (pre-commit hook stopper deg)

2. **Produksjon (GitHub Pages):**
   - GitHub Secrets brukes for API-nøkler
   - GitHub Actions injiserer secrets under build
   - Ingen nøkler i koden

## ✅ Verifisering:

Sjekk at alt er trygt:
```bash
# Sjekk at app.local.json er i .gitignore
git check-ignore app.local.json

# Sjekk at app.json ikke har ekte nøkler
grep -i "sk-or-v1" app.json
# Skal vise placeholder, ikke ekte nøkkel

# Sjekk git status
git status app.json
# Skal ikke være staged for commit
```

## 🔧 Hvis du må oppdatere nøkkelen:

1. Rediger `app.local.json` direkte
2. Kjør `npm run setup-local` for å merge til `app.json`
3. **ALDRIG** commit `app.json` hvis den inneholder nøkkelen
4. Pre-commit hook vil stoppe deg hvis du prøver

## 📝 Notat:

- Den gamle nøkkelen (`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`) er erstattet
- Den nye nøkkelen er nå i bruk lokalt
- For produksjon: Oppdater også GitHub Secret `OPENROUTER_API_KEY` hvis nødvendig

