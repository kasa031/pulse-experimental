# 🔧 Script Loading Fix - Detaljert

## Problem Identifisert
Console viser: `scripts: ['']` - script tag har tom src-attributt!

## Løsning Implementert

### 1. Bedre Build Metode
- Bruker `expo export:web` som er mer pålitelig for web builds
- Fallback til `expo export --platform web` hvis det feiler

### 2. Forbedret JS File Detection
- Søker i flere mulige lokasjoner:
  - `_expo/static/js/web/*.js` (mest vanlig)
  - `_expo/*/js/web/*.js`
  - `_expo/index.js`
  - `_expo/*.js` (index/main/app)
  - `static/*.js`

### 3. Bedre Script Fixing
- Fikser tomme src-attributter (`src=""`)
- Fikser script tags uten src-attributt
- Beholder andre attributter på script tags

## Testing

Etter deployment:
1. Åpne: https://kasa031.github.io/pulse-experimental/
2. Trykk F12 → Console
3. Sjekk:
   ```javascript
   // I console:
   Array.from(document.scripts).map(s => s.src)
   // Skal vise: ["/pulse-experimental/_expo/static/js/web/index.js"]
   // IKKE: [""]
   ```

## Hvis Problem Vedvarer

### Sjekk Actions Logs
1. Gå til: https://github.com/kasa031/pulse-experimental/actions
2. Klikk på siste deployment
3. Sjekk "Inject error handling" step
4. Se om JS-fil ble funnet og injisert

### Debug i Browser
```javascript
// Sjekk HTML
document.documentElement.innerHTML.includes('script')

// Sjekk scripts
document.scripts

// Sjekk Network tab for 404 errors
```

### Alternativ: Manuell Fix
Hvis automatisk fix ikke fungerer, kan vi:
1. Sjekke faktisk build output
2. Manuelt injisere script tag med riktig path
3. Eller bruke annen hosting (Netlify/Vercel)

