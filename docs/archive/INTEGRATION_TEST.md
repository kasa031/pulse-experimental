# 🔗 Integration Test - Pulse Oslo

## Oversikt

Dette dokumentet beskriver hvordan alle komponenter snakker sammen og leser hverandres input/kommandoer.

## Data Flow

### 1. Autentisering → Profil Opprettelse

**Flow:**
```
App.tsx (onAuthStateChanged)
  ↓
createOrUpdateUserProfile()
  ↓
Firestore: users/{userId}
  ↓
ProfileScreen (loadProfile)
  ↓
getUserProfile() + getUserVoteCount()
```

**Test:**
- ✅ Logg inn → Profil opprettes automatisk i Firestore
- ✅ Gå til Profil → Profil lastes fra Firestore
- ✅ Stemmetall vises korrekt

### 2. Stemme → Profil Oppdatering

**Flow:**
```
VoteScreen (submitVoteHandler)
  ↓
pollsService.submitVote()
  ↓
  - Lagrer vote i Firestore: votes/{pollId}_{userId}
  - Oppdaterer poll.options
  - incrementUserVoteCount() → users/{userId}.stats.votesCount++
  ↓
ProfileScreen (getUserVoteCount)
  ↓
  - Teller faktiske votes fra votes collection
  - Oppdaterer profil.stats.votesCount
```

**Test:**
- ✅ Stem på en poll → Vote lagres
- ✅ Gå til Profil → Vote count oppdateres
- ✅ Stem på flere polls → Count oppdateres korrekt

### 3. Poll Opprettelse → Profil Oppdatering

**Flow:**
```
CreatePollScreen (handleSubmit)
  ↓
pollsService.createPoll()
  ↓
  - Validerer input
  - Rate limiting
  - Lagrer poll i Firestore: polls/{pollId}
  - incrementUserPollCount() → users/{userId}.stats.pollsCreated++
  ↓
ProfileScreen (isAdmin)
  ↓
  - Viser pollsCreated count
```

**Test:**
- ✅ Opprett poll (som admin) → Poll lagres
- ✅ Gå til Profil → pollsCreated øker med 1

### 4. Navigation mellom Screens

**Flow:**
```
HomeScreen (Button)
  ↓
navigation.navigate('Stem')
  ↓
VoteScreen (lastes)
  ↓
getActivePolls() → Viser polls
```

**Test:**
- ✅ Klikk "Se alle avstemninger" i HomeScreen
- ✅ Navigerer til VoteScreen
- ✅ Polls lastes og vises

### 5. Real-time Updates

**Flow:**
```
VoteScreen (subscribeToPolls)
  ↓
Firestore onSnapshot listener
  ↓
  - Poll oppdateres i Firestore
  - Listener trigger callback
  - VoteScreen oppdateres automatisk
```

**Test:**
- ✅ Stem på poll
- ✅ Poll oppdateres automatisk i real-time
- ✅ Ingen refresh nødvendig

## Integrasjoner som fungerer

### ✅ Autentisering
- LoginScreen → Firebase Auth
- App.tsx → onAuthStateChanged listener
- createOrUpdateUserProfile → Firestore users collection

### ✅ Stemmefunksjonalitet
- VoteScreen → pollsService.submitVote()
- submitVote → Firestore votes collection
- submitVote → incrementUserVoteCount()
- ProfileScreen → getUserVoteCount() (teller faktiske votes)

### ✅ Poll Creation
- CreatePollScreen → pollsService.createPoll()
- createPoll → Firestore polls collection
- createPoll → incrementUserPollCount()
- Admin-sjekk → isUserAdmin()

### ✅ Navigation
- HomeScreen → navigation.navigate('Stem')
- Tab Navigator → Alle screens tilgjengelige

### ✅ Data Synkronisering
- Real-time listeners → subscribeToPolls()
- Cache oppdatering → invalidateCache()
- Profil oppdatering → updateUserProfile()

## Testing Checklist

### Basisfunksjonalitet
- [ ] App starter uten feil
- [ ] LoginScreen vises når ikke innlogget
- [ ] Kan logge inn med email/password
- [ ] Profil opprettes automatisk ved innlogging
- [ ] Hovedskjerm vises etter innlogging

### Navigation
- [ ] Alle tabs er tilgjengelige
- [ ] HomeScreen → VoteScreen navigasjon fungerer
- [ ] Kan navigere mellom alle screens

### Stemmefunksjonalitet
- [ ] Polls lastes på VoteScreen
- [ ] Kan velge alternativ
- [ ] Kan stemme
- [ ] Stemme registreres i Firestore
- [ ] Vote count oppdateres i poll
- [ ] Vote count oppdateres i profil

### Admin Funksjonalitet
- [ ] Admin-sjekk fungerer
- [ ] CreatePollScreen vises kun for admin
- [ ] Kan opprette poll (som admin)
- [ ] PollsCreated count oppdateres

### Profil
- [ ] Profil lastes korrekt
- [ ] Vote count vises korrekt
- [ ] Kan redigere profil
- [ ] Endringer lagres i Firestore
- [ ] Admin-badge vises for admin-brukere

## Kjente Issues

Ingen kjente kritiske issues.

## Forbedringsforslag

- [ ] Implementere LocalHistoryScreen med faktiske data
- [ ] Implementere CommunityScreen med diskusjoner
- [ ] Legge til push-notifikasjoner
- [ ] Implementere nyhetsfeed

