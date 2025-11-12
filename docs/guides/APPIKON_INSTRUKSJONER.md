# 📱 Appikon for OsloPuls - Instruksjoner

## ✅ Status

Appikonet er nå konfigurert med flere størrelser for bedre støtte på alle enheter!

## 📋 Hva er konfigurert:

### Ikoner i manifest.json:
- ✅ 72x72 px
- ✅ 96x96 px  
- ✅ 128x128 px
- ✅ 144x144 px
- ✅ 152x152 px
- ✅ 192x192 px (maskable)
- ✅ 384x384 px
- ✅ 512x512 px (maskable)

### Apple Touch Icons (iOS):
- ✅ Alle størrelser fra 57x57 til 180x180 px
- ✅ Konfigurert i `public/index.html`

## 🎨 For å endre appikonet:

### Hvis du vil bruke en av eksisterende logoer:

1. **Finn logo i `assets/` mappen:**
   - `oslo-logo.png`
   - `frigg-oslo-logo.png`
   - `frigg-oslo-logo-400x400.png`
   - `pul-is-logo.png`

2. **Erstatt `assets/icon.png`:**
   - Kopier ønsket logo til `assets/icon.png`
   - Anbefalt størrelse: 1024x1024 px (eller større)
   - Format: PNG med transparent bakgrunn
   - Farge: Passer til OsloPuls tema (#0066cc)

3. **Erstatt `assets/favicon.png`:**
   - Lag en mindre versjon (48x48 eller 64x64 px)
   - Bruk samme logo, bare mindre

### Hvis du vil lage et nytt ikon:

**Anbefalte krav:**
- Størrelse: 1024x1024 px (minimum)
- Format: PNG med transparent bakgrunn
- Design: Enkel, gjenkjennelig form
- Farge: Passer til OsloPuls tema
- Kontrast: Høy kontrast for lesbarhet på alle bakgrunner

**Design-forslag:**
- OsloPuls logo
- Oslo byvåpen
- Enkel "P" eller "OP" med Oslo-farger
- Kombinasjon av Oslo-symbol og "Puls"

## 📱 Hvor vises ikonet?

### iPhone/iPad:
- **Hjemmeskjerm:** Når du legger til på hjemmeskjermen
- **App switcher:** Når du bytter mellom apper
- **Siri suggestions:** Når iOS foreslår appen

### Android:
- **Hjemmeskjerm:** Når du legger til på hjemmeskjermen
- **App drawer:** I app-listen
- **Recent apps:** Når du bytter mellom apper

### Desktop/Web:
- **Browser tab:** Favicon
- **PWA installasjon:** Når du installerer som app
- **Taskbar/Dock:** Når appen er installert

## ✅ Neste steg:

1. **Velg eller lag et ikon** som passer OsloPuls
2. **Erstatt `assets/icon.png`** med ditt ikon
3. **Erstatt `assets/favicon.png`** med en mindre versjon
4. **Commit og push** endringene
5. **Test på mobil** ved å legge til på hjemmeskjermen

## 🔍 Test ikonet:

### På iPhone:
1. Gå til: `https://kasa031.github.io/pulse-experimental/`
2. Trykk på delingsknappen
3. Velg "Legg til på hjemmeskjerm"
4. Se at ikonet vises korrekt

### På Android:
1. Gå til: `https://kasa031.github.io/pulse-experimental/`
2. Trykk på meny-knappen (tre prikker)
3. Velg "Legg til på hjemmeskjerm" eller "Installer app"
4. Se at ikonet vises korrekt

---

**Alt er klart! 🎉**

Ikonet vil automatisk oppdateres når du erstatter `assets/icon.png` filen.

