# 📱 Guide: Bruk OsloPuls i Brave på iPhone og legg til på hjemmeskjerm

## 🎯 Mål
Få OsloPuls til å fungere perfekt i Brave nettleseren på iPhone og legge den til på hjemmeskjerm som en app.

---

## 📲 Steg-for-steg guide

### Steg 1: Åpne OsloPuls i Brave på iPhone

1. **Last ned Brave** (hvis du ikke har den):
   - Gå til App Store
   - Søk etter "Brave Browser"
   - Last ned og installer

2. **Åpne Brave** på iPhone

3. **Gå til OsloPuls**:
   - Skriv inn URL: `https://kasa031.github.io/pulse-experimental/`
   - Eller søk etter "OsloPuls" i søkemotoren

4. **Vent til siden lastes**:
   - Appen skal laste automatisk
   - Du skal se hjemmeskjermen med navigasjon

---

### Steg 2: Legg til på hjemmeskjerm

#### Metode 1: Via del-knappen (Anbefalt)

1. **Åpne del-menyen**:
   - Trykk på **del-knappen** (⬆️) nederst i Brave
   - Eller trykk på **meny-knappen** (tre prikker) og velg "Del"

2. **Finn "Legg til på hjemmeskjerm"**:
   - Scroll ned i del-menyen
   - Finn og trykk på **"Legg til på hjemmeskjerm"** eller **"Add to Home Screen"**
   - Ikonet ser ut som et kvadrat med pil oppover

3. **Tilpass ikon og navn** (valgfritt):
   - Du kan endre navnet (standard: "OsloPuls")
   - Ikonet er allerede satt opp

4. **Legg til**:
   - Trykk på **"Legg til"** øverst til høyre
   - Appen legges til på hjemmeskjermen

#### Metode 2: Via Brave-menyen

1. **Åpne Brave-menyen**:
   - Trykk på **meny-knappen** (tre prikker) øverst til høyre

2. **Velg "Legg til på hjemmeskjerm"**:
   - Scroll ned i menyen
   - Trykk på **"Legg til på hjemmeskjerm"**

3. **Bekreft**:
   - Trykk på **"Legg til"**

---

### Steg 3: Åpne appen fra hjemmeskjerm

1. **Finn app-ikonet**:
   - Gå til hjemmeskjermen på iPhone
   - Finn **OsloPuls**-ikonet

2. **Åpne appen**:
   - Trykk på ikonet
   - Appen åpnes i fullskjerm (standalone mode)
   - Ingen adresselinje eller nettleser-kontroller

3. **Første gang**:
   - Appen kan ta noen sekunder å laste første gang
   - Etterpå lastes den raskt fra cache

---

## ✨ Funksjoner når lagt til på hjemmeskjerm

### ✅ Hva fungerer:

- **Fullskjerm-opplevelse**: Ingen nettleser-kontroller
- **Offline-støtte**: Appen fungerer delvis uten internett (cached innhold)
- **Rask oppstart**: Lastes raskere enn i nettleseren
- **App-ikon**: Eget ikon på hjemmeskjermen
- **Push-notifikasjoner**: (Kan aktiveres i fremtiden)

### 📱 Responsiv design:

- **Mobil**: Optimalisert for iPhone
- **Tablet**: Fungerer også på iPad
- **Landscape/Portrait**: Støtter begge orienteringer

---

## 🔧 Feilsøking

### Problem: "Legg til på hjemmeskjerm" vises ikke

**Løsning:**
1. Sjekk at du er på riktig URL: `https://kasa031.github.io/pulse-experimental/`
2. Prøv å oppdatere siden (trekk ned for å oppdatere)
3. Sjekk at Brave er oppdatert til nyeste versjon
4. Prøv å lukke og åpne Brave på nytt

### Problem: Appen lastes ikke fra hjemmeskjerm

**Løsning:**
1. Slett app-ikonet fra hjemmeskjermen
2. Gå tilbake til Brave og åpne URL-en på nytt
3. Legg til på hjemmeskjerm igjen
4. Sjekk internettforbindelsen

### Problem: Appen ser rar ut

**Løsning:**
1. Tøm cache i Brave:
   - Gå til Brave-innstillinger
   - Velg "Rydding"
   - Velg "Tøm cache"
2. Last siden på nytt
3. Legg til på hjemmeskjerm igjen

### Problem: Service Worker feiler

**Løsning:**
1. Sjekk at du er på HTTPS (ikke HTTP)
2. Sjekk at manifest.json og sw.js er tilgjengelige
3. Åpne Developer Tools (hvis tilgjengelig) og sjekk console for feil

---

## 🚀 Deployment

### Automatisk deployment

Appen deployes automatisk når du pusher til `main`-branchen:

```bash
git add .
git commit -m "Oppdater PWA for Brave iPhone"
git push origin main
```

### Manuell deployment

1. **Bygg appen**:
   ```bash
   npm run build:web
   ```

2. **Sjekk at PWA-filer er med**:
   - `dist/manifest.json` eller `web-build/manifest.json`
   - `dist/sw.js` eller `web-build/sw.js`
   - `dist/index.html` eller `web-build/index.html`

3. **Push til GitHub**:
   ```bash
   git add .
   git commit -m "Deploy PWA"
   git push origin main
   ```

4. **Vent på GitHub Actions**:
   - Gå til GitHub repository
   - Se "Actions"-fanen
   - Vent til deployment er ferdig (2-3 minutter)

5. **Test på Brave iPhone**:
   - Gå til: `https://kasa031.github.io/pulse-experimental/`
   - Følg stegene over for å legge til på hjemmeskjerm

---

## 📋 Sjekkliste for PWA

Før du deployer, sjekk at:

- [ ] `manifest.json` er tilgjengelig på `/pulse-experimental/manifest.json`
- [ ] `sw.js` er tilgjengelig på `/pulse-experimental/sw.js`
- [ ] Ikoner er tilgjengelige på `/pulse-experimental/assets/icon.png`
- [ ] `index.html` har alle nødvendige meta tags
- [ ] Service Worker registreres korrekt (sjekk browser console)
- [ ] Appen fungerer i Brave på iPhone
- [ ] "Legg til på hjemmeskjerm" vises i del-menyen

---

## 🎨 Tilpasning

### Endre app-navn

Rediger `public/manifest.json`:
```json
{
  "name": "Ditt navn her",
  "short_name": "Kort navn"
}
```

### Endre app-ikon

1. Erstatt `assets/icon.png` med ditt eget ikon
2. Ikonet bør være minst 512x512 piksler
3. Deploy på nytt

### Endre farger

Rediger `public/manifest.json`:
```json
{
  "theme_color": "#0066cc",
  "background_color": "#ffffff"
}
```

---

## 📚 Ytterligere ressurser

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Brave Browser Support](https://brave.com/)
- [iOS PWA Support](https://webkit.org/blog/8042/progressive-web-apps/)

---

## ✅ Ferdig!

Nå kan du:
- ✅ Bruke OsloPuls i Brave på iPhone
- ✅ Legge den til på hjemmeskjermen
- ✅ Åpne den som en app
- ✅ Nytte offline-støtte

**Lykke til! 🎉**

