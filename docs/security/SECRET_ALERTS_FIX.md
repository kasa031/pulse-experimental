# 🔐 Secret Alerts - Hvordan Fikse

## ⚠️ Viktig: Alerts Forsvinner IKKE Automatisk

GitHub Secret Scanning beholder alerts selv etter at secrets er fjernet fordi:
1. Secrets var i git-historikken
2. De kan fortsatt være tilgjengelige i tidligere commits
3. De må markeres som "resolved" manuelt

## 🔍 Sjekk Om Secrets Er Fjernet

### 1. Sjekk Nåværende Kode
Secrets skal IKKE være i:
- `SETUP_GITHUB_SECRETS.md` - Skal bare ha instruksjoner
- `src/services/firebase.ts` - Skal bruke environment variables

### 2. Hvis Secrets Fortsatt Er Der
**KRITISK:** Fjern dem umiddelbart og roter secrets!

## ✅ Hvordan Fikse Alerts

### Metode 1: Markér som Resolved (Hvis secrets er fjernet)
1. Gå til: https://github.com/kasa031/pulse-experimental/security/secret-scanning
2. Klikk på hver alert
3. Klikk "Mark as resolved" → "Secret removed"
4. Bekreft

### Metode 2: Roter Secrets (Hvis de faktisk var lekt)
1. **OpenRouter:**
   - Gå til OpenRouter dashboard
   - Generer ny API key
   - Oppdater i GitHub Secrets

2. **Firebase:**
   - Gå til Firebase Console
   - Generer nye credentials
   - Oppdater i GitHub Secrets

### Metode 3: Fjern fra Git Historikk (Avansert)
Hvis secrets var i tidligere commits:
```bash
# Dette krever git filter-branch eller BFG Repo-Cleaner
# Vær forsiktig - dette endrer git-historikken!
```

## 📋 Sjekkliste

- [ ] Secrets er fjernet fra nåværende kode
- [ ] Secrets er rotert hvis de var lekt
- [ ] Alerts er markert som resolved i GitHub
- [ ] Nye secrets er lagt til i GitHub Secrets

## ⚠️ Viktig

**Alerts forsvinner IKKE automatisk!** Du må:
1. Fjerne secrets fra koden
2. Rotere secrets hvis de var lekt
3. Markere alerts som resolved manuelt i GitHub

