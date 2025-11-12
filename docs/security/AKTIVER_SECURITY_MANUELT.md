# 🔒 Aktiver Security-funksjoner manuelt

## Situasjon
Filene er pushet, men GitHub har ikke aktivert Dependabot og Code scanning ennå. Her er hvordan du aktiverer dem manuelt:

---

## 1. Aktiver Dependabot Alerts

### Metode 1: Via Security-tabben (Enklest)
1. Gå til GitHub repository
2. Klikk på **"Security"**-fanen
3. I Security overview, finn **"Dependabot alerts"**
4. Klikk på **"Enable Dependabot alerts"**-knappen
5. Bekreft aktivering

### Metode 2: Via Settings
1. Gå til **Settings** → **Security**
2. Scroll ned til **"Code security and analysis"**
3. Under **"Dependabot alerts"**, klikk **"Enable"**
4. Bekreft aktivering

**Etter aktivering:**
- Dependabot vil automatisk sjekke alle dependencies
- Du vil få varsler hvis det er sårbarheter
- `.github/dependabot.yml` filen vil brukes for konfigurasjon

---

## 2. Aktiver Code Scanning Alerts

### Metode 1: Via Security-tabben (Anbefalt)
1. Gå til GitHub repository
2. Klikk på **"Security"**-fanen
3. I Security overview, finn **"Code scanning alerts"**
4. Klikk på **"Set up code scanning"**-knappen
5. Velg **"Set up with CodeQL"** eller **"Set up this workflow"**
6. Hvis du ser workflow-filen vår (`.github/workflows/code-scanning.yml`), velg **"Set up this workflow"**
7. Bekreft oppsettet

### Metode 2: Via Actions (Hvis workflow allerede eksisterer)
1. Gå til **Actions**-fanen
2. Se etter **"Code Scanning"** workflow
3. Hvis den ikke har kjørt, trykk **"Run workflow"**
4. Dette vil aktivere Code scanning

### Metode 3: Via Settings
1. Gå til **Settings** → **Security**
2. Scroll ned til **"Code security and analysis"**
3. Under **"Code scanning"**, klikk **"Set up"**
4. Velg **"Set up this workflow"** hvis du ser vår workflow
5. Bekreft oppsettet

**Etter aktivering:**
- Code scanning vil kjøre automatisk ved hver push
- Du vil se resultater i Security → Code scanning alerts
- Workflow-filen `.github/workflows/code-scanning.yml` vil brukes

---

## 3. Aktiver Private Vulnerability Reporting (Valgfritt)

1. Gå til **Settings** → **Security**
2. Scroll ned til **"Code security and analysis"**
3. Under **"Private vulnerability reporting"**, klikk **"Enable"**
4. Bekreft aktivering

**Hva gjør dette:**
- Lar eksterne personer rapportere sikkerhetsproblemer privat
- Anbefalt hvis du ønsker at andre skal kunne rapportere sårbarheter

---

## 📋 Steg-for-steg instruksjoner

### Steg 1: Aktiver Dependabot
```
1. GitHub → Security-tabben
2. Finn "Dependabot alerts"
3. Klikk "Enable Dependabot alerts"
4. ✅ Ferdig!
```

### Steg 2: Aktiver Code Scanning
```
1. GitHub → Security-tabben
2. Finn "Code scanning alerts"
3. Klikk "Set up code scanning"
4. Velg "Set up this workflow" (hvis du ser vår workflow)
5. ✅ Ferdig!
```

### Steg 3: (Valgfritt) Aktiver Private Vulnerability Reporting
```
1. GitHub → Settings → Security
2. Scroll til "Private vulnerability reporting"
3. Klikk "Enable"
4. ✅ Ferdig!
```

---

## ✅ Forventet resultat etter aktivering

Etter at du har aktivert alt, skal Security overview vise:

- ✅ **Security policy:** Enabled
- ✅ **Security advisories:** Enabled
- ✅ **Private vulnerability reporting:** Enabled (hvis aktivert)
- ✅ **Dependabot alerts:** Enabled ← **Nå aktivert!**
- ✅ **Code scanning alerts:** Enabled ← **Nå aktivert!**
- ✅ **Secret scanning alerts:** Enabled

**Tallet "2" på Security-fanen vil forsvinne!** 🎉

---

## 🔍 Verifisering

Etter aktivering, sjekk:

1. **Dependabot:**
   - Gå til Security → Dependabot
   - Du skal se en liste over dependencies (kan ta noen minutter)

2. **Code Scanning:**
   - Gå til Security → Code scanning
   - Du skal se at workflow har kjørt (sjekk Actions-tabben)

3. **Security Overview:**
   - Alle funksjoner skal nå vise "Enabled"

---

## ⚠️ Viktig

- **Dependabot:** Kan ta 5-10 minutter før den starter første sjekk
- **Code Scanning:** Workflow må kjøre minst én gang før den vises som "Enabled"
- **Private repos:** CodeQL er gratis, men kan kreve GitHub Advanced Security for noen funksjoner

---

## 🆘 Hvis det ikke fungerer

1. **Sjekk at filene eksisterer:**
   - `.github/dependabot.yml` skal finnes
   - `.github/workflows/code-scanning.yml` skal finnes

2. **Sjekk Actions:**
   - Gå til Actions-tabben
   - Se om Code Scanning workflow har kjørt
   - Hvis den feiler, sjekk feilmeldingene

3. **Sjekk repository settings:**
   - Gå til Settings → Security
   - Se om det er noen begrensninger

4. **Vent litt:**
   - Noen ganger tar det noen minutter før GitHub oppdager endringene

---

**Neste steg:** Gå til GitHub og aktiver Dependabot og Code scanning manuelt ved å følge instruksjonene over! 🚀

