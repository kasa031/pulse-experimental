# 🚀 Deployment Guide - OsloPuls PWA

## 📋 Oversikt

Denne guiden viser hvordan du deployer OsloPuls som en PWA (Progressive Web App) som fungerer perfekt i Brave på iPhone og kan legges til på hjemmeskjerm.

---

## ✅ Forutsetninger

- [ ] GitHub repository er satt opp
- [ ] GitHub Secrets er konfigurert (Firebase credentials)
- [ ] GitHub Pages er aktivert
- [ ] PWA-filer er på plass (`manifest.json`, `sw.js`)

---

## 🔧 Steg 1: Sjekk PWA-konfigurasjon

### Sjekk at filene eksisterer:

```bash
# Sjekk manifest
ls -la public/manifest.json

# Sjekk service worker
ls -la public/sw.js

# Sjekk index.html
ls -la public/index.html
```

### Verifiser innhold:

1. **manifest.json** skal inneholde:
   - `name` og `short_name`
   - `start_url` med riktig base path
   - `display: "standalone"`
   - `icons` med riktige paths
   - `theme_color` og `background_color`

2. **sw.js** skal:
   - Være tilgjengelig på `/pulse-experimental/sw.js`
   - Håndtere caching korrekt
   - Være registrert i `index.html`

3. **index.html** skal:
   - Ha `<link rel="manifest">` tag
   - Ha service worker registrering
   - Ha Apple meta tags for iOS

---

## 🚀 Steg 2: Deploy til GitHub Pages

### Automatisk deployment (Anbefalt)

1. **Commit endringene**:
   ```bash
   git add .
   git commit -m "Forbedre PWA for Brave iPhone"
   git push origin main
   ```

2. **Vent på GitHub Actions**:
   - Gå til: `https://github.com/kasa031/pulse-experimental/actions`
   - Se at workflow "Deploy to GitHub Pages" kjører
   - Vent til den er ferdig (2-3 minutter)

3. **Verifiser deployment**:
   - Gå til: `https://kasa031.github.io/pulse-experimental/`
   - Sjekk at siden laster
   - Åpne Developer Tools (F12) og sjekk console for service worker

### Manuell deployment (Hvis nødvendig)

1. **Bygg appen**:
   ```bash
   npm run build:web
   ```

2. **Sjekk output**:
   - Output skal være i `dist/` eller `web-build/`
   - Sjekk at `manifest.json` og `sw.js` er kopiert

3. **Push til GitHub**:
   ```bash
   git add .
   git commit -m "Deploy PWA"
   git push origin main
   ```

---

## 📱 Steg 3: Test på Brave iPhone

### Test i nettleseren:

1. **Åpne Brave** på iPhone
2. **Gå til**: `https://kasa031.github.io/pulse-experimental/`
3. **Sjekk at**:
   - Siden laster korrekt
   - Ingen feil i console
   - Service worker registreres (sjekk i Developer Tools hvis tilgjengelig)

### Test "Legg til på hjemmeskjerm":

1. **Trykk på del-knappen** (⬆️) i Brave
2. **Scroll ned** og finn "Legg til på hjemmeskjerm"
3. **Trykk på det** og bekreft
4. **Sjekk at**:
   - Ikonet vises på hjemmeskjermen
   - Navnet er korrekt ("OsloPuls")
   - Ikonet ser riktig ut

### Test standalone mode:

1. **Åpne appen** fra hjemmeskjermen
2. **Sjekk at**:
   - Appen åpnes i fullskjerm (ingen adresselinje)
   - Navigasjon fungerer
   - Alle funksjoner fungerer som normalt

---

## 🔍 Steg 4: Verifiser PWA

### Sjekkliste:

- [ ] Manifest.json er tilgjengelig
- [ ] Service Worker registreres
- [ ] Ikoner lastes korrekt
- [ ] "Legg til på hjemmeskjerm" vises i Brave
- [ ] Appen fungerer i standalone mode
- [ ] Offline-støtte fungerer (delvis)
- [ ] Responsive design fungerer på iPhone

### Test offline-støtte:

1. **Legg appen til på hjemmeskjerm**
2. **Åpne appen** fra hjemmeskjermen
3. **Slå av internett** (Airplane Mode)
4. **Sjekk at**:
   - Appen fortsatt åpnes
   - Cached innhold vises
   - Nye data ikke lastes (som forventet)

---

## 🐛 Feilsøking

### Problem: Service Worker registreres ikke

**Løsning:**
1. Sjekk at `sw.js` er tilgjengelig på riktig path
2. Sjekk at du er på HTTPS (ikke HTTP)
3. Sjekk browser console for feilmeldinger
4. Prøv å tømme cache og last på nytt

### Problem: "Legg til på hjemmeskjerm" vises ikke

**Løsning:**
1. Sjekk at `manifest.json` er tilgjengelig
2. Sjekk at alle required felter er fylt ut
3. Sjekk at du er på riktig URL
4. Prøv å oppdatere siden

### Problem: Appen ser rar ut i standalone mode

**Løsning:**
1. Sjekk viewport meta tag i `index.html`
2. Sjekk at CSS fungerer korrekt
3. Sjekk at responsive design er implementert
4. Test i ulike orienteringer

### Problem: Ikonet ser rar ut

**Løsning:**
1. Sjekk at `assets/icon.png` eksisterer
2. Sjekk at ikonet er minst 192x192 piksler
3. Sjekk at path i `manifest.json` er korrekt
4. Prøv å bruke et PNG-ikon med transparent bakgrunn

---

## 📊 Monitoring

### Sjekk deployment status:

1. **GitHub Actions**:
   - Gå til: `https://github.com/kasa031/pulse-experimental/actions`
   - Se siste deployment

2. **GitHub Pages**:
   - Gå til: `https://github.com/kasa031/pulse-experimental/settings/pages`
   - Se deployment status

3. **Live site**:
   - Gå til: `https://kasa031.github.io/pulse-experimental/`
   - Test funksjonalitet

---

## 🎯 Best Practices

### For beste PWA-opplevelse:

1. **Optimaliser bilder**:
   - Bruk WebP-format når mulig
   - Komprimer bilder
   - Bruk lazy loading

2. **Optimaliser caching**:
   - Cache statiske assets
   - Bruk network-first for API-kall
   - Oppdater cache-version ved endringer

3. **Test regelmessig**:
   - Test på ulike enheter
   - Test i ulike nettlesere
   - Test offline-funksjonalitet

4. **Oppdater manifest**:
   - Hold `name` og `description` oppdatert
   - Oppdater ikoner ved behov
   - Legg til nye shortcuts ved behov

---

## ✅ Ferdig!

Når alt er deployet og testet:

- ✅ Appen fungerer i Brave på iPhone
- ✅ Kan legges til på hjemmeskjerm
- ✅ Fungerer i standalone mode
- ✅ Har offline-støtte
- ✅ Er optimalisert for mobil

**Gratulerer! 🎉**

---

## 📚 Ytterligere ressurser

- [PWA Best Practices](https://web.dev/pwa-checklist/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Brave Browser Documentation](https://brave.com/)

