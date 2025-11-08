# Omfattende Testing TODO-liste før endelig utfall

## 🔥 Firebase & Konfigurasjon

- [ ] Verifiser at alle Firebase Secrets er satt i GitHub Secrets
  - [ ] API Key
  - [ ] Auth Domain
  - [ ] Project ID
  - [ ] Storage Bucket
  - [ ] Messaging Sender ID
  - [ ] App ID
- [ ] Test Firebase initialisering på alle plattformer (web, iOS, Android)
- [ ] Sjekk at Firestore security rules er korrekt konfigurert
- [ ] Verifiser at Firestore indekser er opprettet for alle queries
  - [ ] `votes` collection: `userId` + `orderBy('votedAt')`
  - [ ] `polls` collection: `isActive` + `orderBy('startDate')`
  - [ ] `news` collection: `publishedAt` + `orderBy('publishedAt')`
  - [ ] `discussions` collection: `category` + `orderBy('createdAt')`
- [ ] Test at setup-local-config.js script fungerer korrekt
- [ ] Sjekk at app.json har riktig konfigurasjon for alle plattformer

## 🔐 Autentisering & Brukerhåndtering

- [ ] Test fullstendig login/logout flow på alle plattformer
- [ ] Test registrering av ny bruker med e-post verifisering
- [ ] Test "Glemt passord" funksjonalitet
- [ ] Test "Husk meg" funksjonalitet i LoginScreen
- [ ] Test at brukerprofil opprettes automatisk ved første innlogging
- [ ] Test at brukerdata lagres korrekt i AsyncStorage
- [ ] Test at brukerdata fjernes ved logout

## 📊 Avstemninger (Polls)

- [ ] Test opprettelse av avstemning som admin (CreatePollScreen)
  - [ ] Validering av alle felter
  - [ ] Dato-validering (startDate < endDate, ikke i fortiden)
  - [ ] Alternativer (2-10 alternativer)
  - [ ] Forhåndsvisning fungerer
- [ ] Test at ikke-admin brukere ikke kan opprette avstemninger
- [ ] Test stemmefunksjonalitet
  - [ ] Bruker kan stemme på aktiv avstemning
  - [ ] Bruker kan IKKE stemme to ganger
  - [ ] Stemmer oppdateres i real-time (subscribeToPolls)
  - [ ] Optimistisk oppdatering fungerer
- [ ] Test søk og filtrering i VoteScreen
  - [ ] Søk etter tekst
  - [ ] Filtrer etter kategori
  - [ ] Filtrer etter bydel
  - [ ] Kombinert søk og filter
- [ ] Test sortering i VoteScreen
  - [ ] Nyeste først
  - [ ] Mest populære først
  - [ ] Slutter snart først
- [ ] Test at avstemninger med utløpt endDate ikke vises som aktive
- [ ] Test rate limiting for stemmer (maks 10 per minutt)

## 💬 Diskusjoner & Kommentarer

- [ ] Test opprettelse av diskusjon i CommunityScreen
  - [ ] Validering av tittel og innhold
  - [ ] Kategori-valg
- [ ] Test legg til kommentar i diskusjon
  - [ ] Kommentar lagres korrekt
  - [ ] commentCount oppdateres
- [ ] Test like/dislike funksjonalitet for kommentarer
  - [ ] Like fungerer
  - [ ] Dislike fungerer
  - [ ] Kan ikke like og dislike samtidig
  - [ ] Kan fjerne like/dislike
- [ ] Test filtrering og sortering av diskusjoner
  - [ ] Filtrer etter kategori
  - [ ] Sorter: Nyeste, Eldste, Mest kommentarer

## 📰 Nyheter

- [ ] Test henting av nyheter
  - [ ] getLatestNews
  - [ ] getNewsByCategory
  - [ ] getNewsByDistrict
- [ ] Test filtrering av nyheter etter kategori og bydel
- [ ] Test deling av nyheter (Share funksjonalitet)
  - [ ] Web: navigator.share eller clipboard
  - [ ] Mobil: Share API
- [ ] Test åpning av eksterne lenker fra nyheter
- [ ] Test visning av full nyhet i dialog

## 👤 Profil

- [ ] Test oppdatering av brukerprofil
  - [ ] displayName
  - [ ] district
  - [ ] Endringer lagres i Firestore
- [ ] Test at statistikker vises korrekt
  - [ ] Antall stemmer
  - [ ] Antall kommentarer
  - [ ] Antall diskusjoner
  - [ ] Antall opprettede avstemninger (admin)
- [ ] Test admin-badge visning for admin-brukere
- [ ] Test innstillinger
  - [ ] Push-varsler toggle (lagre til AsyncStorage)
  - [ ] E-post-varsler toggle
  - [ ] Privatlivsinnstillinger (TODO: implementer navigasjon)

## 📜 Historikk

- [ ] Test henting av brukerens stemmehistorikk
  - [ ] Viser alle stemmer
  - [ ] Sortert etter dato
- [ ] Test visning av avsluttede avstemninger med resultater
  - [ ] Viser alle alternativer med prosent
  - [ ] Marker brukerens stemme
  - [ ] Progress bars fungerer
- [ ] Test eksport av historikk
  - [ ] CSV eksport (mine stemmer)
  - [ ] JSON eksport (resultater)
  - [ ] Web: download fungerer
  - [ ] Mobil: Share fungerer
- [ ] Test filtrering av resultater etter kategori

## 🎨 UI/UX

- [ ] Test responsivt design
  - [ ] Mobil (< 768px)
  - [ ] Nettbrett (768px - 1024px)
  - [ ] Desktop (> 1024px)
- [ ] Test WebNavigation komponent
  - [ ] Sidebar på desktop
  - [ ] Hamburger-meny på mobil/nettbrett
  - [ ] Navigasjon fungerer
- [ ] Test alle skjermer for konsistent styling
  - [ ] Spacing (SPACING konstanter)
  - [ ] Farger (osloBranding)
  - [ ] Touch targets (min 44x44px)
- [ ] Test loading states på alle skjermer
  - [ ] ActivityIndicator vises
  - [ ] Tekst er informativ
- [ ] Test error states
  - [ ] Feilmeldinger vises
  - [ ] Retry-funksjonalitet
- [ ] Test pull-to-refresh der det er implementert
  - [ ] HomeScreen
  - [ ] VoteScreen
  - [ ] CommunityScreen
  - [ ] NewsScreen
  - [ ] LocalHistoryScreen
- [ ] Test snackbar/feilmeldinger
  - [ ] Vises korrekt
  - [ ] Forsvinner automatisk
  - [ ] Kan lukkes manuelt

## ⚠️ Feilhåndtering

- [ ] Test ErrorBoundary håndterer feil korrekt
- [ ] Test nettverksfeil håndtering
  - [ ] Offline scenario
  - [ ] Treg nettverk
  - [ ] Timeout
- [ ] Test at appen ikke krasjer ved ugyldig Firebase konfigurasjon
- [ ] Test rate limiting
  - [ ] For mange stemmer
  - [ ] For mange login-forsøk
  - [ ] For mange registreringer
  - [ ] For mange poll-opprettelser
- [ ] Test at feilmeldinger er brukervenlige og informative

## ⚡ Ytelse

- [ ] Test caching av polls (AsyncStorage cache)
  - [ ] Cache lagres
  - [ ] Cache hentes ved offline
  - [ ] Cache utløper etter 5 minutter
- [ ] Test at appen håndterer store lister
  - [ ] 50+ avstemninger
  - [ ] 100+ nyheter
  - [ ] 50+ diskusjoner
- [ ] Test optimistisk oppdatering i VoteScreen
- [ ] Test at appen ikke lag under navigering
- [ ] Test minnebruk (sjekk for memory leaks)

## 🔒 Sikkerhet

- [ ] Test input validering
  - [ ] XSS forsøk
  - [ ] SQL injection forsøk (selv om vi bruker Firestore)
  - [ ] Lange strenger
  - [ ] Spesialtegn
- [ ] Test at admin-funksjoner kun er tilgjengelige for admin-brukere
  - [ ] CreatePollScreen
  - [ ] Admin-badge
- [ ] Test at brukere ikke kan manipulere votes client-side
- [ ] Verifiser at sensitive data ikke logges i produksjon
- [ ] Test at API-nøkler ikke er hardkodet i koden

## 📦 Data & Database

- [ ] Test at votedAt og timestamp felter fungerer korrekt
- [ ] Test at user stats oppdateres korrekt
  - [ ] votesCount
  - [ ] pollsCreated
  - [ ] commentCount (via getUserCommentCount)
- [ ] Test at commentCount oppdateres når kommentarer legges til
- [ ] Test at totalVotes oppdateres når noen stemmer
- [ ] Test at poll options votes oppdateres korrekt

## 🔍 Edge Cases

- [ ] Test edge cases
  - [ ] Tomme lister (ingen polls, nyheter, diskusjoner)
  - [ ] Null-verdier
  - [ ] Manglende data
  - [ ] Ugyldig data fra Firestore
- [ ] Test med lange tekster
  - [ ] Tittel (200 tegn)
  - [ ] Beskrivelse (2000 tegn)
  - [ ] Kommentarer (1000 tegn)
- [ ] Test med spesialtegn
  - [ ] Emojis
  - [ ] Unicode
  - [ ] HTML tags (skal sanitizes)
- [ ] Test at appen håndterer rask navigering mellom skjermer
- [ ] Test med flere brukere samtidig (concurrent voting)

## 👑 Admin Funksjonalitet

- [ ] Test admin claim setup script (setAdminClaim.js)
- [ ] Verifiser at admin-brukere har riktig claim i Firebase
- [ ] Test at isUserAdmin() returnerer korrekt verdi
- [ ] Test at admin kan opprette avstemninger
- [ ] Test at ikke-admin ikke kan opprette avstemninger

## 🖼️ Assets & Ressurser

- [ ] Verifiser at alle assets eksisterer
  - [ ] oslo-logo.png
  - [ ] frigg-oslo-logo.png
  - [ ] icon.png
  - [ ] splash-icon.png
  - [ ] adaptive-icon.png
  - [ ] favicon.png
- [ ] Test at alle assets lastes korrekt
- [ ] Test at bilder vises riktig på alle plattformer

## 🌐 Web-spesifikk

- [ ] Test web-versjon på forskjellige nettlesere
  - [ ] Chrome
  - [ ] Firefox
  - [ ] Safari
  - [ ] Edge
- [ ] Test at web-versjon fungerer med GitHub Pages deployment
- [ ] Test at baseUrl er korrekt satt (/pulse-experimental)
- [ ] Test at routing fungerer på web
- [ ] Test at localStorage fungerer (rate limiting)

## 📱 Mobil-spesifikk

- [ ] Test på iOS
  - [ ] Simulator
  - [ ] Fysisk enhet
- [ ] Test på Android
  - [ ] Emulator
  - [ ] Fysisk enhet
- [ ] Test at touch targets er store nok (min 44x44px)
- [ ] Test at keyboard ikke dekker input-felter
- [ ] Test DateTimePicker på iOS og Android
- [ ] Test at AsyncStorage fungerer på mobil

## 🔄 Integrasjonstester

- [ ] Test full brukerflow
  1. Registrering
  2. E-post verifisering
  3. Login
  4. Stem på avstemning
  5. Se resultat
  6. Opprett diskusjon
  7. Legg til kommentar
  8. Se profil
  9. Logout
- [ ] Test full admin flow
  1. Login som admin
  2. Opprett avstemning
  3. Se at avstemning vises
  4. Stem som vanlig bruker
  5. Se resultater
- [ ] Test diskusjon flow
  1. Opprett diskusjon
  2. Legg til kommentar
  3. Like kommentar
  4. Dislike kommentar
  5. Se oppdatert commentCount

## 🧹 Kodekvalitet

- [ ] Fjern eller implementer TODO kommentarer
  - [ ] errorBoundary.tsx: Error reporting service
  - [ ] ProfileScreen.tsx: Privatlivsinnstillinger navigasjon
- [ ] Sjekk for ubrukte imports
- [ ] Verifiser at alle console.log er erstattet med safeLog eller safeError
- [ ] Sjekk for console.error som bør bruke safeError
- [ ] Verifiser TypeScript types er korrekte
- [ ] Sjekk for any types som bør være mer spesifikke

## 🐛 Feilrapportering & Tilbakemelding

- [ ] Sett opp EmailJS konto (se EMAILJS_SETUP_GUIDE.md)
- [ ] Legg til EmailJS nøkler i GitHub Secrets
  - [ ] EMAILJS_PUBLIC_KEY
  - [ ] EMAILJS_SERVICE_ID
  - [ ] EMAILJS_TEMPLATE_ID
- [ ] Legg til EmailJS nøkler i app.local.json for lokal utvikling
- [ ] Test FeedbackScreen
  - [ ] Skjermen vises i navigasjonen
  - [ ] Alle feedback-typer kan velges (bug, feature, feedback, other)
  - [ ] Validering fungerer (emne, melding)
  - [ ] E-post sendes korrekt til ms.tery@icloud.com
  - [ ] Bekreftelsesmelding vises
  - [ ] Feilmelding vises hvis EmailJS ikke er konfigurert
- [ ] Test automatisk feilrapportering fra ErrorBoundary
  - [ ] Feilrapport sendes automatisk når feil oppstår
  - [ ] Error stack trace inkluderes
  - [ ] App-metadata inkluderes (versjon, plattform, skjerm)
- [ ] Test at brukerinfo inkluderes hvis innlogget
- [ ] Test at anonyme brukere kan rapportere feil

## 📚 Dokumentasjon

- [ ] Oppdater README.md med instruksjoner for testing
- [ ] Dokumenter hvordan man setter opp admin-brukere
- [ ] Dokumenter hvordan man legger til testdata
  - [ ] Polls
  - [ ] News
  - [ ] Discussions
- [ ] Dokumenter deployment prosess
- [ ] Oppdater CHANGELOG.md med endringer

## ✅ Final Checks

- [ ] Kjør `npm run lint` og fiks alle feil
- [ ] Kjør TypeScript type check (`tsc --noEmit`)
- [ ] Test at alle skjermer kan navigeres til
- [ ] Test at alle knapper fungerer
- [ ] Test at alle forms kan submittes
- [ ] Test at alle dialogs kan åpnes og lukkes
- [ ] Verifiser at ingen console errors i produksjon
- [ ] Test at appen starter uten feil
- [ ] Test at appen håndterer refresh/reload korrekt

---

## Testprioritering

### Høy prioritet (må fungere før testing):
1. Firebase konfigurasjon og initialisering
2. Login/logout
3. Stemmefunksjonalitet
4. Opprettelse av avstemning (admin)
5. Grunnleggende navigasjon

### Medium prioritet:
1. Diskusjoner og kommentarer
2. Nyheter
3. Profil og statistikker
4. Historikk
5. Feilrapportering og tilbakemelding

### Lav prioritet (nice to have):
1. Eksport av historikk
2. Deling av nyheter
3. Avanserte filtre
4. Privatlivsinnstillinger

