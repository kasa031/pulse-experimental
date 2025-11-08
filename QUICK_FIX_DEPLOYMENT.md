# ⚡ Rask Fiks - GitHub Pages

## Problem
Appen lastes ikke på https://kasa031.github.io/pulse-experimental/

## Rask Løsning (5 minutter)

### 1. Sjekk GitHub Actions
1. Gå til: https://github.com/kasa031/pulse-experimental/actions
2. Se om siste deployment feilet
3. Hvis feilet: Klikk på deployment → Se feilmeldinger

### 2. Verifiser Secrets
1. Gå til: Settings → Secrets and variables → Actions
2. Sjekk at disse secrets er satt:
   - ✅ `FIREBASE_API_KEY`
   - ✅ `FIREBASE_AUTH_DOMAIN`
   - ✅ `FIREBASE_PROJECT_ID`
   - ✅ `FIREBASE_STORAGE_BUCKET`
   - ✅ `FIREBASE_MESSAGING_SENDER_ID`
   - ✅ `FIREBASE_APP_ID`

### 3. Trigger Ny Deployment
1. Gå til Actions tab
2. Velg "Deploy to GitHub Pages"
3. Klikk "Run workflow" → "Run workflow"
4. Vent på at deployment fullfører

### 4. Sjekk Resultat
1. Vent 2-3 minutter
2. Gå til: https://kasa031.github.io/pulse-experimental/
3. Trykk F12 → Console tab
4. Se om det er nye feilmeldinger

## Hvis Det Ikke Fungerer

### Sjekk Build Logs
1. Gå til Actions → Siste deployment
2. Se "Build web" step
3. Se etter feilmeldinger
4. Kopier feilmeldinger og søk etter løsning

### Test Lokalt
```bash
# Test at build fungerer
npm run build:web

# Sjekk at dist/ eller web-build/ er opprettet
ls -la dist/ || ls -la web-build/
```

## Vanligste Årsaker

1. **Firebase secrets mangler** - 90% av tilfellene
2. **Build feiler** - Sjekk Actions logs
3. **Paths feil** - Sjekk at baseUrl er riktig

---

**Prøv dette først**: Sjekk secrets og trigger ny deployment!

