# 📱 Mobile 404-fix - Detaljert Guide

## Problem
GitHub Pages er aktivert, men får fortsatt 404 på mobil.

## Mulige årsaker

### 1. SPA Routing Issue
React Navigation trenger _redirects fil for å håndtere routing på GitHub Pages.

**Løsning:** ✅ Workflow er oppdatert til å lage _redirects fil automatisk.

### 2. Cache Issue
Mobilen kan ha cachet en gammel 404-side.

**Løsning:**
- Tøm cache på mobilen
- Prøv i inkognito-vindu
- Hard refresh (iPhone: Safari → Share → Request Desktop Site → tilbake)

### 3. Build Output Issue
Build kan ha feilet eller output er tom.

**Sjekk:**
1. Gå til Actions: https://github.com/kasa031/pulse-experimental/actions
2. Klikk på siste deploy
3. Se "Verify build output" steget
4. Skal vise: "✅ Build output verified"

### 4. Timing Issue
GitHub Pages kan ta 5-10 minutter å oppdatere.

**Løsning:** Vent litt og prøv igjen.

## Steg-for-steg fix

### Steg 1: Trigger ny deploy

1. Gå til: https://github.com/kasa031/pulse-experimental/actions
2. Klikk "Deploy to GitHub Pages"
3. Klikk "Run workflow" → "Run workflow"
4. Vent 2-3 minutter

### Steg 2: Sjekk deploy log

1. Gå til Actions → siste deploy
2. Se gjennom alle steg:
   - ✅ "Build web" - skal være grønn
   - ✅ "Verify build output" - skal vise filer
   - ✅ "Upload artifact" - skal være grønn
   - ✅ "Deploy to GitHub Pages" - skal være grønn

### Steg 3: Test på mobil

1. Tøm cache på mobilen
2. Åpne: https://kasa031.github.io/pulse-experimental/
3. Hvis fortsatt 404, prøv:
   - Hard refresh
   - Inkognito-vindu
   - Annet nettleser

### Steg 4: Sjekk direkte URL

Prøv å åpne direkte:
- https://kasa031.github.io/pulse-experimental/index.html

Hvis dette fungerer, er det et routing-problem (fiksert med _redirects).

## Hvis det fortsatt ikke fungerer

### Sjekk Actions log nøye:

1. **"Build web" steget:**
   - Se om det er noen feilmeldinger
   - Se om det sier "Build completed"

2. **"Verify build output" steget:**
   - Se hvilke filer som vises
   - Skal inneholde: index.html, _s, assets, etc.

3. **"Upload artifact" steget:**
   - Se om artifact ble opplastet
   - Se størrelse på artifact

### Test build lokalt:

```bash
npm run build:web
ls -la web-build/
cat web-build/index.html
```

Hvis dette fungerer lokalt, skal det fungere på GitHub Pages også.

## Kontakt

Hvis ingenting fungerer:
1. Send meg screenshot av Actions log (feilmeldinger)
2. Send meg hva som står i "Verify build output" steget
3. Send meg om index.html eksisterer i build output

