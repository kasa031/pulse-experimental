# 📱 OsloPuls - Komplett Guide

## 🎯 Hva er OsloPuls?

OsloPuls er en webapplikasjon for demokratisk deltakelse i Oslo. Appen lar innbyggere:
- **Stemme** på lokale avstemninger
- **Lese** nyheter fra Oslo kommune
- **Delta** i fellesskapsdiskusjoner
- **Følge** sin stemmehistorikk
- **Opprette** nye avstemninger (admin)

---

## 📋 Oversikt over alle funksjoner

### 🏠 **Hjem (HomeScreen)**
- Oversikt over aktive avstemninger
- Antall aktive polls
- Preview av 3 nyeste polls
- Preview av 3 nyeste nyheter
- Pull-to-refresh for å oppdatere
- Responsive design (mobil, tablet, desktop)

### 🗳️ **Stem (VoteScreen)**
- Se alle aktive avstemninger
- Stemme på polls med radio buttons
- Filtrere etter kategori og bydel
- Søke i polls
- Sortere etter: nyeste, mest populære, slutter snart
- Se resultater i sanntid
- Optimistic UI (umiddelbar feedback)
- Responsive design

### 📰 **Nyheter (NewsScreen)**
- Nyhetsfeed fra Oslo kommune
- Filtrere etter kategori (politikk, miljø, transport, etc.)
- Filtrere etter bydel
- Les full artikkel i dialog
- Dele nyheter
- Åpne eksterne lenker
- Prioriterte nyheter (urgent, high, normal)
- Responsive design

### 👥 **Fellesskap (CommunityScreen)**
- Diskusjoner om lokale saker
- Opprette nye diskusjoner
- Kommentere på diskusjoner
- Filtrere etter kategori og bydel
- Se popularitet (likes)
- Responsive design

### 📊 **Lokalhistorie (LocalHistoryScreen)**
- Se dine egne stemmer
- Se resultater fra avsluttede polls
- Eksportere stemmehistorikk som CSV
- Statistikk over deltakelse
- Filtrere etter kategori og bydel
- Responsive design

### 👤 **Profil (ProfileScreen)**
- Se og redigere profil
- Endre visningsnavn
- Velge bydel
- Se statistikk (antall stemmer, kommentarer, diskusjoner)
- Admin-status (hvis admin)
- Logge ut
- Dark mode toggle
- Responsive design

### ➕ **Opprett (CreatePollScreen)** - Admin only
- Opprette nye avstemninger
- Legge til tittel, beskrivelse
- Legge til alternativer
- Velge kategori og bydel
- Sette start- og sluttdato
- Forhåndsvisning
- Validering av input

### 📝 **Rapporter (FeedbackScreen)**
- Sende tilbakemelding
- Rapportere problemer
- Foreslå forbedringer
- Kontaktformular

### 📞 **Kontakt (ContactScreen)**
- Kontaktinformasjon
- Om prosjektet
- Send melding
- Lenker til sosiale medier

### 🔐 **Innlogging (LoginScreen)**
- Logge inn med e-post og passord
- Registrere ny bruker
- Glemt passord
- Firebase Authentication

---

## 🚀 Hvordan starte applikasjonen

### 💻 **På PC (Windows/Mac/Linux)**

#### Metode 1: Lokal utviklingsserver (for testing)

1. **Åpne terminal/kommandolinje** i prosjektmappen:
   ```bash
   cd C:\Users\Karina\Desktop\Egenlagde_programmer\pulse-experimental
   ```

2. **Installer dependencies** (hvis ikke allerede gjort):
   ```bash
   npm install
   ```

3. **Start web-serveren**:
   ```bash
   npm run web
   ```
   eller
   ```bash
   npm start
   ```
   Deretter trykk `w` for web

4. **Åpne nettleseren**:
   - Appen åpnes automatisk på `http://localhost:8081`
   - Eller gå manuelt til: `http://localhost:8081`

#### Metode 2: Deployet versjon (produksjon)

1. **Gå til GitHub Pages URL**:
   ```
   https://kasa031.github.io/pulse-experimental/
   ```

2. **Appen lastes automatisk** i nettleseren

---

### 📱 **På iPhone**

#### Metode 1: Via nettleser (Safari/Chrome)

1. **Åpne Safari eller Chrome** på iPhone

2. **Gå til URL**:
   ```
   https://kasa031.github.io/pulse-experimental/
   ```

3. **Legg til på hjemmeskjerm** (valgfritt):
   - Trykk på del-knappen (⬆️)
   - Velg "Legg til på hjemmeskjerm"
   - Appen vises som en app-ikon

#### Metode 2: Lokal utvikling (hvis du er på samme nettverk)

1. **Start web-serveren på PC**:
   ```bash
   npm run web
   ```

2. **Finn PC-ens IP-adresse**:
   - Windows: `ipconfig` i terminal
   - Mac/Linux: `ifconfig` i terminal
   - Se etter IPv4-adresse (f.eks. `192.168.1.100`)

3. **Åpne Safari på iPhone**:
   - Gå til: `http://[PC-IP]:8081`
   - F.eks.: `http://192.168.1.100:8081`

---

## 🎨 Funksjoner og forbedringer

### ✅ **Implementerte forbedringer:**

1. **Performance**
   - Lazy loading av screens (kun på web)
   - Code splitting
   - Image optimization
   - Skeleton loaders

2. **Accessibility**
   - ARIA labels
   - Keyboard navigation
   - Skip links
   - Screen reader support

3. **Responsive Design**
   - Mobil-first design
   - Tablet-optimalisert
   - Desktop-optimalisert
   - Touch-friendly (minst 44x44px touch targets)

4. **Dark Mode**
   - Automatisk deteksjon
   - Manuell toggle
   - System preference sync

5. **Keyboard Shortcuts** (kun web)
   - `Alt + H` - Gå til Hjem
   - `Alt + V` - Gå til Stem
   - `Alt + N` - Gå til Nyheter
   - `Alt + F` - Gå til Fellesskap
   - `Alt + P` - Gå til Profil

6. **Analytics & Error Tracking**
   - Page view tracking
   - Navigation tracking
   - Button click tracking
   - Error reporting

7. **PWA Features**
   - Installerbar som app
   - Offline support (service worker)
   - App manifest

8. **Copy/Paste Support**
   - Cross-platform clipboard API
   - Web: Clipboard API
   - Mobile: React Native Clipboard

9. **Drag & Drop**
   - Basic drag & drop support

---

## 🔧 Tekniske detaljer

### **Teknologier:**
- **React Native** (cross-platform)
- **Expo** (utviklingsverktøy)
- **Firebase** (autentisering og database)
- **React Navigation** (navigasjon)
- **React Native Paper** (UI-komponenter)
- **TypeScript** (type safety)

### **Struktur:**
```
src/
├── screens/          # Alle skjermer
├── components/       # Gjenbrukbare komponenter
├── services/         # Firebase, API-kall
├── utils/            # Hjelpefunksjoner
├── hooks/            # Custom React hooks
├── constants/        # Konstanter og tema
└── types/            # TypeScript typer
```

---

## 📝 Testing av funksjoner

### **Sjekkliste for testing:**

#### ✅ Autentisering
- [ ] Logge inn med e-post/passord
- [ ] Registrere ny bruker
- [ ] Logge ut
- [ ] Session persistence (forblir innlogget)

#### ✅ Avstemninger
- [ ] Se aktive polls
- [ ] Stemme på poll
- [ ] Se resultater
- [ ] Filtrere polls
- [ ] Søke i polls
- [ ] Sortere polls

#### ✅ Nyheter
- [ ] Se nyhetsfeed
- [ ] Filtrere nyheter
- [ ] Les full artikkel
- [ ] Dele nyhet
- [ ] Åpne ekstern lenke

#### ✅ Profil
- [ ] Se profil
- [ ] Redigere profil
- [ ] Se statistikk
- [ ] Toggle dark mode

#### ✅ Responsive Design
- [ ] Test på mobil (iPhone)
- [ ] Test på tablet (iPad)
- [ ] Test på desktop (PC)
- [ ] Test i ulike nettlesere

#### ✅ Performance
- [ ] Rask lasting
- [ ] Smooth scrolling
- [ ] Ingen lag ved navigering

#### ✅ Accessibility
- [ ] Keyboard navigation fungerer
- [ ] Screen reader support
- [ ] ARIA labels er til stede

---

## 🐛 Feilsøking

### **Problem: Appen laster ikke**
- Sjekk at Firebase credentials er satt opp
- Sjekk nettverkstilkobling
- Sjekk browser console for feil

### **Problem: Kan ikke logge inn**
- Sjekk at Firebase Authentication er aktivert
- Sjekk at e-post/passord er korrekt
- Sjekk browser console for feil

### **Problem: Data vises ikke**
- Sjekk Firebase Firestore rules
- Sjekk at du er innlogget
- Sjekk browser console for feil

### **Problem: Styling ser rar ut**
- Tøm browser cache
- Sjekk at alle dependencies er installert
- Sjekk browser console for feil

---

## 📚 Neste steg

1. **Test alle funksjoner** systematisk
2. **Sjekk at alt fungerer** på både mobil og PC
3. **Rapporter eventuelle bugs**
4. **Forbedre basert på feedback**

---

## 🎉 Ferdig!

Appen er nå klar for bruk! Du kan:
- Teste lokalt med `npm run web`
- Deploye til GitHub Pages automatisk
- Bruke appen på både mobil og PC

**Lykke til med testing! 🚀**

