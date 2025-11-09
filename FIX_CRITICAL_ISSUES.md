# 🔴 Kritiske Problemer som Må Fikses

## 1. 🔐 LEKKEDE SECRETS (KRITISK!)

### Problem:
- OpenRouter API Key lekt i `SETUP_GITHUB_SECRETS.md`
- Firebase API Key lekt i `src/services/firebase.ts`

### Løsning:
1. **Fjern secrets fra filer:**
   - Erstatt med placeholders i `SETUP_GITHUB_SECRETS.md`
   - Sjekk at `src/services/firebase.ts` bruker environment variables

2. **Roter secrets:**
   - Generer nye API keys i OpenRouter
   - Generer nye Firebase credentials hvis nødvendig

3. **Oppdater GitHub Secrets:**
   - Oppdater de lekkede secrets i GitHub

## 2. 🛡️ Code Scanning Issues

### High Priority:
- **Incomplete multi-character sanitization** i `osloNewsImporter.ts:55-56`
- **Potential file system race condition** i `setup-local-config.js` (allerede fikset tidligere?)

### Løsning:
- Forbedre sanitization i `osloNewsImporter.ts`
- Sjekk race condition fixes

## 3. 📦 Dependabot

### Pull Requests:
- 3 åpne PRs for dependency updates
- Vurder å merge dem for å fikse sikkerhetsproblemer

### Security Alerts:
- 5 sikkerhetsproblemer i dependencies
- 1 kritisk (form-data)
- 1 moderat (undici)
- 3 lave

## 4. 🧹 Code Quality

### Unused Imports:
- Mange unused imports i flere filer
- Fjern dem for bedre code quality

## Neste Steg:

1. **FJERN SECRETS FØRST** (kritisk!)
2. Fiks sanitization
3. Fjern unused imports
4. Merge Dependabot PRs
5. Commit og push

