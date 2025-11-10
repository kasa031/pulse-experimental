# 🔒 GitHub Branch Protection Guide

## Hva er Branch Protection?

Branch protection beskytter viktige branches (som `main`) mot utilsiktede endringer, som:
- Sletting av branch
- Force push (overskrive historikk)
- Direkte commits til main (uten pull request)

## ✅ Anbefalte Innstillinger for OsloPuls

### For Solo/Small Team Prosjekt:

**1. Basic Protection (Minimum):**
- ✅ **Require a pull request before merging**
  - ✅ Require approvals: **1** (eller 0 hvis du jobber alene)
  - ✅ Dismiss stale pull request approvals when new commits are pushed
  - ⚠️ Require review from Code Owners: **IKKE** (hvis du ikke har code owners)

- ✅ **Require status checks to pass before merging**
  - ✅ Require branches to be up to date before merging
  - ⚠️ Status checks: **Valgfritt** (hvis du har CI/CD)

- ✅ **Require conversation resolution before merging**
  - ✅ Require all conversations on code to be resolved

- ✅ **Require linear history**
  - ⚠️ **IKKE** aktiver dette hvis du jobber alene (kan være irriterende)

- ✅ **Include administrators**
  - ✅ **JA** - Du skal kunne overstyre hvis nødvendig

**2. Restrict who can push to matching branches:**
- ⚠️ **IKKE** aktiver dette hvis du jobber alene (blokkerer deg selv)

**3. Allow force pushes:**
- ❌ **NEI** - Dette er farlig og kan ødelegge historikk

**4. Allow deletions:**
- ❌ **NEI** - Beskytter mot utilsiktede slettinger

## 🎯 Praktisk Setup for Ditt Prosjekt

### Scenario 1: Jobber du alene?
**Anbefaling:** Minimal protection
- ✅ Require pull request before merging (men du kan merge dine egne PRs)
- ✅ Include administrators (du kan overstyre)
- ❌ Ikke aktiver "Require approvals" (eller sett til 0)
- ❌ Ikke aktiver "Require linear history"

### Scenario 2: Jobber du med andre?
**Anbefaling:** Standard protection
- ✅ Require pull request before merging
- ✅ Require approvals: 1
- ✅ Require conversation resolution
- ✅ Include administrators

## ⚠️ Viktig: Unngå Disse Feilene

1. **Ikke aktiver "Require linear history"** hvis du jobber alene
   - Dette krever at alle commits er rebased, noe som kan være irriterende

2. **Ikke aktiver "Restrict who can push"** uten å legge deg selv til
   - Dette kan blokkere deg fra å pushe

3. **Ikke aktiver "Require status checks"** uten å ha CI/CD
   - Dette vil blokkere alle merges

## 📋 Steg-for-Steg Instruksjoner

### 1. Gå til Settings → Rulesets → New branch ruleset

### 2. Fyll ut:
- **Ruleset Name:** `Protect main branch`
- **Enforcement status:** `Active` (ikke Disabled)

### 3. Target branches:
- Velg: `main` (eller `main, master` hvis du har begge)

### 4. Protection Rules:
- ✅ **Require a pull request before merging**
  - Require approvals: **0** (hvis alene) eller **1** (hvis team)
  - ✅ Dismiss stale approvals
  - ❌ Require review from Code Owners (hvis du ikke har dette)

- ✅ **Require status checks to pass before merging**
  - ✅ Require branches to be up to date
  - ⚠️ Status checks: Legg til hvis du har CI/CD (f.eks. "build")

- ✅ **Require conversation resolution before merging**

- ❌ **Require linear history** (ikke aktiver hvis alene)

- ✅ **Include administrators** (JA - så du kan overstyre)

### 5. Restrict who can push:
- ❌ **IKKE** aktiver (hvis du jobber alene)

### 6. Allow force pushes:
- ❌ **NEI**

### 7. Allow deletions:
- ❌ **NEI**

### 8. Klikk "Create ruleset"

## 🔄 Hvordan Jobbe med Branch Protection

### Når du skal pushe endringer:

**Metode 1: Direkte push (hvis du er administrator)**
```bash
git add .
git commit -m "Din melding"
git push origin main
```
*Dette fungerer hvis du har "Include administrators" aktivert*

**Metode 2: Pull Request (anbefalt)**
```bash
# Lag en ny branch
git checkout -b feature/din-endring

# Gjør endringene
git add .
git commit -m "Din melding"

# Push til GitHub
git push origin feature/din-endring

# Opprett Pull Request på GitHub
# Merge PR når klar
```

## ✅ Anbefalt Setup for OsloPuls

Siden du jobber på dette prosjektet alene (eller i lite team), anbefaler jeg:

1. **Aktiver basic protection:**
   - Require pull request (men du kan merge dine egne)
   - Include administrators (så du kan overstyre)
   - Ikke aktiver "Require approvals" (eller sett til 0)

2. **Beskytter mot:**
   - Force push
   - Branch deletion
   - Utilsiktede endringer

3. **Tillater deg å:**
   - Pushe direkte hvis nødvendig (som administrator)
   - Merge dine egne pull requests
   - Jobbe normalt

## 🎯 Konklusjon

**For ditt prosjekt, anbefaler jeg:**
- ✅ Minimal protection (beskytter mot force push og deletion)
- ✅ Include administrators (så du kan overstyre)
- ❌ Ikke for strenge regler (siden du jobber alene)

Dette gir deg beskyttelse uten å være for restriktivt! 🎉

