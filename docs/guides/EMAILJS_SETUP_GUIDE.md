# EmailJS Setup Guide - Feilrapportering

## 📧 Steg-for-steg Setup

### 1. Opprett EmailJS Konto (Gratis)
1. Gå til https://www.emailjs.com/
2. Klikk "Sign Up" (gratis)
3. Registrer deg med e-post
4. Verifiser e-posten din

### 2. Opprett E-post Service
1. Logg inn på EmailJS
2. Gå til **Email Services** i menyen
3. Klikk **Add New Service**
4. Velg **Gmail** (eller Outlook/iCloud hvis du foretrekker)
5. Følg instruksjonene for å koble til din e-post (ms.tery@icloud.com)
6. **Service ID** opprettes automatisk - kopier denne!

### 3. Opprett E-post Template
1. Gå til **Email Templates** i menyen
2. Klikk **Create New Template**
3. Sett opp template med følgende variabler:

**Template Innhold:**
```
Fra: {{from_name}} <{{from_email}}>
Emne: [OsloPuls {{feedback_type}}] {{subject}}

Melding:
{{message}}

---
App Informasjon:
Versjon: {{app_version}}
Plattform: {{platform}}
Skjerm: {{screen_name}}
Bruker E-post: {{user_email}}
Bruker ID: {{user_id}}
Tidspunkt: {{timestamp}}
```

4. **Template ID** vises øverst - kopier denne!

### 4. Hent Public Key
1. Gå til **Account** → **General**
2. Finn **Public Key** (starter med "user_")
3. Kopier denne!

### 5. Legg til i GitHub Secrets
Gå til GitHub Repository → Settings → Secrets and variables → Actions

Legg til:
- `EMAILJS_PUBLIC_KEY` = Din Public Key
- `EMAILJS_SERVICE_ID` = Din Service ID
- `EMAILJS_TEMPLATE_ID` = Din Template ID

### 6. Legg til i app.local.json (Lokal Utvikling)
```json
{
  "expo": {
    "extra": {
      "emailjsPublicKey": "din-public-key-her",
      "emailjsServiceId": "din-service-id-her",
      "emailjsTemplateId": "din-template-id-her"
    }
  }
}
```

### 7. Test
1. Start appen
2. Gå til "Rapporter"-fanen
3. Fyll ut skjemaet
4. Send tilbakemelding
5. Sjekk din e-post (ms.tery@icloud.com)

## ✅ Verifisering

Etter setup, sjekk at:
- [ ] FeedbackScreen vises i navigasjonen
- [ ] Skjemaet kan fylles ut
- [ ] "Send tilbakemelding" knappen fungerer
- [ ] E-post mottas på ms.tery@icloud.com
- [ ] Automatisk feilrapportering fungerer (ErrorBoundary)

## 🔧 Troubleshooting

### "EmailJS er ikke konfigurert"
- Sjekk at alle tre nøkler er satt i GitHub Secrets
- For lokal utvikling: Sjekk `app.local.json`
- Kjør `npm run setup-local` for å oppdatere

### "Kunne ikke sende tilbakemelding"
- Sjekk at Service ID er korrekt
- Sjekk at Template ID er korrekt
- Sjekk at e-post service er aktivert i EmailJS
- Sjekk at template variabler matcher

### E-post kommer ikke frem
- Sjekk spam-mappen
- Sjekk at e-post service er korrekt koblet
- Sjekk EmailJS dashboard for feilmeldinger

## 📊 EmailJS Limits (Gratis Tier)

- **200 e-poster per måned** (gratis)
- Nok for de fleste bruksområder
- Kan oppgraderes hvis nødvendig

## 🔒 Sikkerhet

- Public Key er trygg å bruke i frontend
- Service ID og Template ID er også trygge
- Ingen sensitive data eksponeres
- Rate limiting håndteres av EmailJS

