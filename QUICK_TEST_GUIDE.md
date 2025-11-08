# Rask Test Guide

## 🚀 Start Testing

### 1. Forberedelser
```bash
# Installer dependencies
npm install

# For lokal utvikling, sett opp konfigurasjon
npm run setup-local

# Start appen
npm start
```

### 2. Test Firebase Konfigurasjon
- [ ] Åpne appen
- [ ] Sjekk at ingen Firebase-feil vises
- [ ] Login-skjermen skal vises

### 3. Test Registrering
1. Klikk "Ingen konto? Opprett en"
2. Fyll ut:
   - E-post: `test@example.com`
   - Passord: `Test1234` (minst 8 tegn, bokstaver og tall)
3. Klikk "Opprett konto"
4. **Forventet**: 
   - Dialog om e-post verifisering vises
   - E-post sendes (sjekk spam hvis ikke mottatt)
   - Du logges inn automatisk

### 4. Test Login
1. Logg ut (hvis innlogget)
2. Fyll ut e-post og passord
3. Klikk "Husk meg" checkbox
4. Klikk "Logg inn"
5. **Forventet**:
   - Du logges inn
   - E-post huskes ved neste besøk

### 5. Test Glemt Passord
1. Klikk "Glemt passord?"
2. Skriv inn e-post
3. Klikk "Send"
4. **Forventet**:
   - Bekreftelsesmelding vises
   - E-post sendes med reset-lenke

### 6. Test Stemmefunksjonalitet
1. Gå til "Stem"-fanen
2. Velg en avstemning
3. Velg et alternativ
4. Klikk "Stem"
5. **Forventet**:
   - Stemme registreres
   - Resultat oppdateres umiddelbart
   - Du kan ikke stemme igjen

### 7. Test Opprettelse av Avstemning (Admin)
1. Logg inn som admin
2. Gå til "Opprett"-fanen
3. Fyll ut alle felter
4. Klikk "Forhåndsvisning"
5. Klikk "Bekreft og opprett"
6. **Forventet**:
   - Avstemning opprettes
   - Avstemning vises i "Stem"-fanen

### 8. Test Diskusjoner
1. Gå til "Fellesskap"-fanen
2. Klikk "Start ny diskusjon"
3. Fyll ut tittel og innhold
4. Velg kategori
5. Klikk "Opprett"
6. **Forventet**:
   - Diskusjon opprettes
   - Diskusjon vises i listen
7. Klikk på diskusjonen
8. Skriv en kommentar
9. Klikk "Legg til"
10. **Forventet**:
    - Kommentar legges til
    - commentCount oppdateres

### 9. Test Profil
1. Gå til "Profil"-fanen
2. Klikk "Rediger profil"
3. Endre visningsnavn
4. Velg bydel
5. Klikk "Lagre"
6. **Forventet**:
   - Profil oppdateres
   - Endringer vises umiddelbart
   - Statistikker vises korrekt

### 10. Test Historikk
1. Gå til "Lokalhistorie"-fanen
2. Sjekk "Mine stemmer"-tab
3. **Forventet**:
   - Alle stemmer vises
   - Sortert etter dato
4. Bytt til "Resultater"-tab
5. **Forventet**:
   - Avsluttede avstemninger vises
   - Resultater med prosent
   - Din stemme markert

## ⚠️ Vanlige Problemer

### "Firebase er ikke konfigurert"
- Sjekk `app.local.json` (lokal utvikling)
- Sjekk GitHub Secrets (produksjon)

### "The query requires an index"
- Se `FIRESTORE_INDEXES.md`
- Klikk på lenken i feilmeldingen

### "Permission denied"
- Sjekk at brukeren er logget inn
- Sjekk Firestore security rules

### "Kun admin kan opprette avstemninger"
- Kjør: `node scripts/setAdminClaim.js <din-email>`
- Logg ut og inn igjen

## 📝 Test Data

For å teste med data, kan du:
1. Opprette avstemninger som admin
2. Legge til nyheter i Firestore (manuelt eller via script)
3. Opprette diskusjoner via appen

## ✅ Success Criteria

Alle disse skal fungere:
- [ ] Registrering og login
- [ ] Stemmefunksjonalitet
- [ ] Opprettelse av avstemning (admin)
- [ ] Diskusjoner og kommentarer
- [ ] Profiloppdatering
- [ ] Historikk

