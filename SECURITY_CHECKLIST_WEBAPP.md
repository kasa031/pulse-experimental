# 🔒 Sikkerhetssjekkliste for Webapp

## ✅ Sjekkliste før Commit

### 1. API Nøkler og Credentials
- [ ] **Ingen ekte API-nøkler i `app.json`** - Kun placeholders som "DIN_OPENROUTER_API_KEY_HER"
- [ ] **`app.local.json` er i `.gitignore`** - ✅ Bekreftet
- [ ] **`app.json.backup` er i `.gitignore`** - ✅ Lagt til
- [ ] **Ingen Firebase service account keys** - ✅ Bekreftet i `.gitignore`

### 2. Nye Filer (Webapp)
- [ ] **`public/manifest.json`** - ✅ Ingen API-nøkler, kun metadata
- [ ] **`public/sw.js`** - ✅ Ingen API-nøkler, kun caching-logikk
- [ ] **`src/hooks/useDarkMode.ts`** - ✅ Ingen API-nøkler, kun localStorage

### 3. Deployment (GitHub Actions)
- [ ] **`.github/workflows/deploy.yml`** - ✅ Bruker GitHub Secrets, ikke hardkodede nøkler
- [ ] **Environment variables** - ✅ Satt opp i workflow med `${{ secrets.* }}`
- [ ] **Fallback til PLACEHOLDER** - ✅ OK for deployment (appen vil ikke fungere uten secrets, men det er forventet)

### 4. Filer som IKKE skal committes
- ❌ `app.local.json` - Lokale credentials
- ❌ `app.json.backup` - Backup av credentials
- ❌ `*.firebase-adminsdk*.json` - Firebase service account keys
- ❌ `.env*` filer - Environment variables
- ❌ `**/secrets.json` - Secrets filer
- ❌ `**/credentials.json` - Credentials filer

### 5. Filer som SKAL committes (med placeholders)
- ✅ `app.json` - Med placeholders som "DIN_OPENROUTER_API_KEY_HER"
- ✅ `app.json.example` - Eksempel med placeholders
- ✅ `public/manifest.json` - PWA metadata (ingen nøkler)
- ✅ `public/sw.js` - Service Worker (ingen nøkler)
- ✅ `.github/workflows/deploy.yml` - Bruker secrets, ikke hardkodede nøkler

## 🔍 Sjekk før hver commit

```bash
# 1. Sjekk git status
git status

# 2. Sjekk at app.json ikke inneholder ekte nøkler
grep -i "sk-or-v1\|AIzaSy" app.json
# Skal IKKE finne noe (kun placeholders)

# 3. Sjekk at sensitive filer ikke er staged
git diff --cached --name-only | grep -E "app\.local\.json|\.backup|firebase.*\.json|\.env"
# Skal IKKE finne noe

# 4. Sjekk at .gitignore fungerer
git check-ignore app.local.json
# Skal returnere "app.local.json"
```

## ⚠️ Viktige Notater

1. **`app.json` i repository** inneholder placeholders - dette er OK
2. **GitHub Secrets** brukes i deployment workflow - ikke hardkodede nøkler
3. **Lokale credentials** skal være i `app.local.json` (som er i `.gitignore`)
4. **Service Worker** (`sw.js`) inneholder ingen API-nøkler - kun caching-logikk
5. **PWA Manifest** (`manifest.json`) inneholder ingen nøkler - kun metadata

## 🐛 Kjente Problemer (fikset)

1. ✅ **sw.js linje 54**: Fikset `location.origin` → `self.location.origin` (service worker context)
2. ✅ **app.json.backup**: Lagt til i `.gitignore`

## 📝 Deployment

Når du deployer til GitHub Pages:
- GitHub Actions bruker secrets fra repository settings
- Secrets er IKKE synlige i workflow logs
- Hvis secrets mangler, brukes "PLACEHOLDER" (appen vil ikke fungere, men det er forventet)

