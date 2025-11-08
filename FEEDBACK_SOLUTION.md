# Feilrapportering & Tilbakemelding - Løsning

## 📧 Anbefalt Løsning: EmailJS

### Hvorfor EmailJS?
- ✅ Ingen backend nødvendig
- ✅ Fungerer på web, iOS og Android
- ✅ Gratis tier: 200 e-poster/måned
- ✅ Kan inkludere app-metadata (versjon, skjerm, brukerinfo)
- ✅ Enkel setup og implementering
- ✅ Sikker (API-nøkkel i secrets)

### Setup Instruksjoner

1. **Opprett EmailJS konto** (gratis):
   - Gå til https://www.emailjs.com/
   - Registrer deg (gratis)
   - Verifiser e-post

2. **Opprett e-post service**:
   - Gå til "Email Services"
   - Klikk "Add New Service"
   - Velg "Gmail" eller "Outlook" (eller annen)
   - Koble til din e-post (ms.tery@icloud.com)
   - Service ID opprettes automatisk

3. **Opprett e-post template**:
   - Gå til "Email Templates"
   - Klikk "Create New Template"
   - Template ID: `template_xxxxx`
   - Sett opp template med variabler:
     ```
     Fra: {{from_name}} <{{from_email}}>
     Emne: [OsloPuls Feilrapport] {{subject}}
     
     Melding:
     {{message}}
     
     ---
     App Info:
     Versjon: {{app_version}}
     Plattform: {{platform}}
     Skjerm: {{screen_name}}
     Bruker: {{user_email}}
     ```

4. **Hent API-nøkler**:
   - Gå til "Account" → "General"
   - Kopier "Public Key" (brukes i appen)
   - Service ID og Template ID fra steg 2 og 3

5. **Legg til i GitHub Secrets**:
   - `EMAILJS_PUBLIC_KEY`
   - `EMAILJS_SERVICE_ID`
   - `EMAILJS_TEMPLATE_ID`

6. **Legg til i app.json** (for lokal utvikling):
   ```json
   "extra": {
     "emailjsPublicKey": "DIN_PUBLIC_KEY",
     "emailjsServiceId": "DIN_SERVICE_ID",
     "emailjsTemplateId": "DIN_TEMPLATE_ID"
   }
   ```

## 🔄 Alternativ: Firebase Functions

Hvis du vil ha mer kontroll og allerede har Firebase Functions:
- Lagre feedback i Firestore
- Cloud Function sender e-post
- Mer kompleks setup
- Bedre for store volum

## 📝 Implementering

Se `src/services/feedbackService.ts` for implementering.


