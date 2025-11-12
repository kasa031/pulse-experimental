# 🔐 Setup Admin-brukere - Full Guide

## Steg 1: Oppdater Firestore Security Rules

1. Gå til Firebase Console:
   👉 https://console.firebase.google.com/project/pulse-oslo/firestore/rules

2. Kopier ALLE reglene fra `FIRESTORE_SECURITY_RULES_ADVANCED.txt`

3. Erstatt ALLE eksisterende regler med de nye

4. Klikk "Publish"

## Steg 2: Sett opp Admin-brukere

### Metode 1: Via Firebase Console (Enklest for testing)

⚠️ **NB:** Dette krever Firebase Admin SDK. Se Metode 2 for enklere løsning.

### Metode 2: Via Node.js Script (Anbefalt)

Vi oppretter et script som setter admin-brukere automatisk.

#### Steg 2.1: Opprett script

Scriptet `scripts/setAdminClaim.js` er allerede opprettet.

#### Steg 2.2: Kjør scriptet

```bash
node scripts/setAdminClaim.js <email>
```

For eksempel:
```bash
node scripts/setAdminClaim.js din-email@example.com
```

## Steg 3: Test Admin-tilgang

1. Logg inn med admin-brukeren
2. Prøv å opprette en poll (skal fungere)
3. Logg inn med vanlig bruker (skal IKKE kunne opprette polls)

## Hvordan sjekke om bruker er admin

Admin-brukere har custom claim `admin: true` i Firebase Auth token.

## Viktig

- ⚠️ Kun admin-brukere kan opprette/oppdatere polls
- ⚠️ Vanlige brukere kan fortsatt stemme (hvis de har verifisert e-post)
- ⚠️ Email verification er påkrevd for å stemme

## Troubleshooting

**Problem:** Kan ikke opprette polls etter oppdatering
- **Løsning:** Sjekk at du har satt admin-claim på brukeren

**Problem:** Kan ikke stemme
- **Løsning:** Sjekk at e-posten er verifisert i Firebase Authentication

