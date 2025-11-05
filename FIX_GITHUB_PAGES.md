# 🔧 Fix GitHub Pages 404 Error

## Problem
Du får 404-feil når du åpner: https://kasa031.github.io/pulse-experimental/

## Mulige årsaker og løsninger

### 1. GitHub Pages er ikke aktivert

**Sjekk:**
1. Gå til: https://github.com/kasa031/pulse-experimental/settings/pages
2. Under **"Source"**, skal det stå **"GitHub Actions"**
3. Hvis ikke, velg **"GitHub Actions"** og klikk **"Save"**

### 2. Deploy workflow har ikke kjørt eller feilet

**Sjekk:**
1. Gå til: https://github.com/kasa031/pulse-experimental/actions
2. Se om det er en deploy workflow som har kjørt
3. Hvis den feilet, klikk på den og se feilmeldingen

**Manuell deploy:**
1. Gå til: https://github.com/kasa031/pulse-experimental/actions
2. Klikk på "Deploy to GitHub Pages" workflow
3. Klikk "Run workflow" → "Run workflow" (manuell trigger)

### 3. Build output er feil

**Sjekk:**
- Workflow bruker nå `--output-dir web-build` for å sikre riktig output
- Verifiserer at `index.html` eksisterer før deploy

### 4. Repository navn stemmer ikke

**Sjekk:**
- Repository navn: `pulse-experimental`
- URL skal være: `https://kasa031.github.io/pulse-experimental/`
- Hvis repository navn er annerledes, oppdater URL

## Steg-for-steg fix

### Steg 1: Aktiver GitHub Pages (hvis ikke gjort)

1. Gå til: https://github.com/kasa031/pulse-experimental/settings/pages
2. Under **"Source"**, velg **"GitHub Actions"**
3. Klikk **"Save"**

### Steg 2: Trigger deploy manuelt

1. Gå til: https://github.com/kasa031/pulse-experimental/actions
2. Klikk på "Deploy to GitHub Pages" workflow
3. Klikk "Run workflow" (høyre side)
4. Velg branch: `main`
5. Klikk "Run workflow"

### Steg 3: Vent på deploy

1. Vent 2-3 minutter
2. Se deploy-status i Actions-fanen
3. Når den er grønn (✅), prøv å åpne URL igjen

### Steg 4: Test URL

1. Åpne: https://kasa031.github.io/pulse-experimental/
2. Hvis det fortsatt ikke fungerer, sjekk Actions log for feil

## Hvis det fortsatt ikke fungerer

### Sjekk Actions log:

1. Gå til Actions-fanen
2. Klikk på siste deploy
3. Se gjennom alle steg for feilmeldinger
4. Spesielt sjekk:
   - "Build web" steget
   - "Verify build output" steget
   - "Upload artifact" steget

### Vanlige feil:

**Feil 1: "web-build not found"**
- Løsning: Workflow er oppdatert med `--output-dir web-build`

**Feil 2: "index.html not found"**
- Løsning: Verifisering er lagt til i workflow

**Feil 3: "GitHub Pages not enabled"**
- Løsning: Aktiver GitHub Pages i Settings → Pages

## Test lokalt først

```bash
npm run build:web
ls web-build/
```

Hvis `web-build/index.html` eksisterer, skal deploy fungere.

