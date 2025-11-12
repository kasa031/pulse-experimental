# ✅ GitHub Pages 404-fix - Checklist

## Problem
Får 404-feil når du åpner: https://kasa031.github.io/pulse-experimental/

## Steg-for-steg fix

### ✅ Steg 1: Aktiver GitHub Pages (VIKTIG!)

1. Gå til: https://github.com/kasa031/pulse-experimental/settings/pages
2. Under **"Source"**, velg **"GitHub Actions"** (IKKE "Deploy from a branch")
3. Klikk **"Save"**
4. ⚠️ **Dette er kritisk!** Uten dette vil du få 404

### ✅ Steg 2: Sjekk om deploy har kjørt

1. Gå til: https://github.com/kasa031/pulse-experimental/actions
2. Se om det er en "Deploy to GitHub Pages" workflow
3. Hvis den har feilet (rød), klikk på den og se feilmeldingen

### ✅ Steg 3: Trigger deploy manuelt

1. Gå til: https://github.com/kasa031/pulse-experimental/actions
2. Klikk på "Deploy to GitHub Pages" i venstre meny
3. Klikk **"Run workflow"** (høyre side)
4. Velg branch: `main`
5. Klikk **"Run workflow"** (grønn knapp)

### ✅ Steg 4: Vent på deploy

1. Vent 2-3 minutter
2. Se deploy-status i Actions-fanen
3. Når den er grønn (✅), prøv URL igjen

### ✅ Steg 5: Test URL

1. Åpne: https://kasa031.github.io/pulse-experimental/
2. Hvis det fortsatt ikke fungerer, sjekk Actions log

## Hvis det fortsatt ikke fungerer

### Sjekk Actions log:

1. Gå til: https://github.com/kasa031/pulse-experimental/actions
2. Klikk på siste deploy (nyeste)
3. Klikk på "deploy" jobben
4. Se gjennom alle steg:

**"Build web"** - Skal være grønn
- Hvis rød: Se feilmeldingen

**"Verify build output"** - Skal være grønn
- Hvis rød: index.html ikke funnet

**"Upload artifact"** - Skal være grønn
- Hvis rød: Artifact ikke opprettet

**"Deploy to GitHub Pages"** - Skal være grønn
- Hvis rød: Deploy feilet

### Vanlige feil og løsninger:

#### Feil 1: "GitHub Pages not enabled"
**Løsning:** Aktiver GitHub Pages i Settings → Pages → Source: GitHub Actions

#### Feil 2: "web-build not found" eller "index.html not found"
**Løsning:** Workflow er nå oppdatert til å finne både `web-build` og `dist` mappe

#### Feil 3: "Permission denied" eller "pages: write"
**Løsning:** Sjekk at repository har Pages permissions aktivert

#### Feil 4: Secrets mangler
**Løsning:** Sjekk at alle 7 secrets er lagt til i Settings → Secrets → Actions

## Test lokalt først

For å teste at build fungerer lokalt:

```bash
npm run build:web
ls web-build/
# eller
ls dist/
```

Hvis `index.html` eksisterer, skal deploy fungere.

## Hvis alt ser bra ut men fortsatt 404

1. **Tøm cache:** Prøv i inkognito-vindu eller hard refresh (Ctrl+Shift+R)
2. **Vent litt:** GitHub Pages kan ta 5-10 minutter å oppdatere
3. **Sjekk URL:** Vær sikker på at URL er: `https://kasa031.github.io/pulse-experimental/` (ikke `/pulse-experimental/index.html`)

## Kontakt

Hvis ingenting fungerer, sjekk Actions log og send meg feilmeldingen.

