# 🌐 Deploy til Web - GitHub Pages

## Mål: Appen som nettside på mobilen

Etter deploy kan du åpne appen direkte på mobilen som en nettside:
**https://kasa031.github.io/pulse-experimental/**

## Steg 1: Sett opp GitHub Secrets (kun første gang)

For at GitHub Actions skal kunne bygge med dine credentials:

1. Gå til GitHub repository: https://github.com/kasa031/pulse-experimental
2. Klikk **Settings** → **Secrets and variables** → **Actions**
3. Klikk **New repository secret**
4. Legg til disse secrets:

### Secrets du trenger:

| Secret Name | Verdi | Hvor finner du det |
|------------|-------|-------------------|
| `OPENROUTER_API_KEY` | [Hent fra app.local.json] | app.local.json |
| `FIREBASE_API_KEY` | [Hent fra Firebase Console] | Firebase Console |
| `FIREBASE_AUTH_DOMAIN` | `pulse-oslo.firebaseapp.com` | Firebase Console |
| `FIREBASE_PROJECT_ID` | `pulse-oslo` | Firebase Console |
| `FIREBASE_STORAGE_BUCKET` | `pulse-oslo.firebasestorage.app` | Firebase Console |
| `FIREBASE_MESSAGING_SENDER_ID` | [Hent fra Firebase Console] | Firebase Console |
| `FIREBASE_APP_ID` | [Hent fra Firebase Console] | Firebase Console |

**⚠️ VIKTIG:** Disse secrets er kun tilgjengelige for GitHub Actions, ikke synlige i koden!

## Steg 2: Aktiver GitHub Pages

1. Gå til repository **Settings** → **Pages**
2. Under **Source**, velg **GitHub Actions**
3. Klikk **Save**

## Steg 3: Push til GitHub

```bash
git add .
git commit -m "Setup web deployment"
git push origin main
```

## Steg 4: Vent på deploy

1. Gå til **Actions**-fanen på GitHub
2. Se deploy-prosessen kjøre
3. Når den er ferdig, åpne: **https://kasa031.github.io/pulse-experimental/**

## Steg 5: Test på mobil

1. Åpne nettleseren på iPhone
2. Gå til: **https://kasa031.github.io/pulse-experimental/**
3. Appen laster! 🎉

## Automatisk deploy

Hver gang du pusher til `main`-branchen, deployes appen automatisk!

## Lokal test før deploy

Test bygget lokalt først:

```bash
npm run build:web
```

Dette lager en `web-build/` mappe som du kan teste lokalt.

## Troubleshooting

### "Build failed" i GitHub Actions
- Sjekk at alle secrets er satt riktig
- Se Actions-loggen for feilmeldinger

### Appen fungerer ikke på GitHub Pages
- Sjekk at GitHub Pages er aktivert
- Vent 1-2 minutter etter deploy
- Hard refresh nettleseren (Ctrl+Shift+R / Cmd+Shift+R)

### Credentials fungerer ikke
- Verifiser at secrets er satt riktig i GitHub
- Sjekk at secret-navnene matcher nøyaktig (case-sensitive)

## Fordeler med denne løsningen:

✅ **Ingen npm start nødvendig** - appen er alltid tilgjengelig  
✅ **Credentials er sikre** - lagret i GitHub Secrets, ikke i kode  
✅ **Automatisk deploy** - hver gang du pusher  
✅ **Tilgjengelig på mobil** - åpne nettleser og gå til URL  
✅ **Ingen server nødvendig** - statisk hosting via GitHub Pages

