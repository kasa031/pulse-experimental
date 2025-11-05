# Pulse Oslo

En React Native app for lokal demokrati og deltakelse i Oslo.

## 🔒 Sikkerhet - API Nøkler

**VIKTIG**: `app.json` inneholder nå Open Router API-nøkkelen. 

### Før du committer til GitHub:

**Metode 1: Bruk app.json.example (Anbefalt)**
1. Kopier `app.json.example` til `app.json`
2. Legg inn din faktiske API-nøkkel i `app.json`
3. **Commit kun `app.json.example`** (ikke `app.json` med ekte nøkkel)

**Metode 2: Legg app.json i .gitignore (Ikke anbefalt)**
- Dette kan skape problemer for andre utviklere
- Bedre å bruke eksempel-filer

### Hvordan bruke API-nøkkelen i koden:

```typescript
import { OPENROUTER_CONFIG, getOpenRouterHeaders } from './config/api';

// API-nøkkelen hentes automatisk fra app.json
const response = await fetch('https://openrouter.ai/api/v1/...', {
  headers: getOpenRouterHeaders(),
});
```

## Installasjon

```bash
npm install
```

## Kjøre appen

```bash
npm start
```

## Sikkerhetspraksis

Se [SECURITY.md](./SECURITY.md) for detaljerte sikkerhetsretningslinjer.

