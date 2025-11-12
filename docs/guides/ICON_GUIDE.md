# 📱 Appikon Guide for OsloPuls

## ✅ Ikoner er konfigurert

Appen bruker følgende ikoner:

### Hovedikon
- **Fil:** `assets/icon.png`
- **Størrelser:** 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512
- **Brukes for:** PWA appikon, Apple Touch Icons, Android adaptive icon

### Favicon
- **Fil:** `assets/favicon.png`
- **Størrelse:** 48x48
- **Brukes for:** Browser tab icon

## 📱 Hvor vises ikonet?

### iPhone/iPad (iOS)
- **Hjemmeskjerm:** Når du legger til på hjemmeskjermen, brukes `icon.png`
- **Størrelser:** 180x180, 152x152, 144x144, 120x120, 114x114, 76x76, 72x72, 60x60, 57x57
- **Konfigurert i:** `public/index.html` (Apple Touch Icons)

### Android
- **Hjemmeskjerm:** Når du legger til på hjemmeskjermen, brukes `icon.png`
- **Størrelser:** 192x192, 512x512 (maskable)
- **Konfigurert i:** `public/manifest.json`

### Desktop/Web
- **Browser tab:** Bruker `favicon.png`
- **PWA installasjon:** Bruker `icon.png` (192x192, 512x512)

## 🎨 Forbedre ikonet

Hvis du vil endre ikonet:

1. **Erstatt filen:** `assets/icon.png`
   - Anbefalt størrelse: 1024x1024 px
   - Format: PNG med transparent bakgrunn
   - Farge: Passer til tema (#0066cc)

2. **Erstatt favicon:** `assets/favicon.png`
   - Størrelse: 48x48 px (eller større, den skal skaleres)
   - Format: PNG eller ICO

3. **Eksempel design:**
   - OsloPuls logo
   - Oslo byvåpen
   - Enkel, gjenkjennelig form
   - Høy kontrast for lesbarhet

## ✅ Status

Alle ikoner er konfigurert og klar for bruk! 🎉

