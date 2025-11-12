# TypeScript-feil som må fikses

## Feil funnet:

1. **CommunityScreen.tsx:**
   - Mangler `sortFilterRow` style
   - Mangler `filterLabel` style  
   - Mangler `sortButton` style
   - Mangler `divider` style
   - `theme.colors.border` eksisterer ikke

2. **CreatePollScreen.tsx:**
   - `auth` kan være null (linje 155)
   - `osloBranding.colors.backgroundSecondary` eksisterer ikke (linje 705)

3. **HomeScreen.tsx:**
   - `onRefresh` er ikke definert (linje 54)
   - Mangler `aboutHeader` style
   - Mangler `featureList` style

## Løsninger som må implementeres:

### CommunityScreen.tsx
- Legg til manglende stiler i StyleSheet
- Erstatt `theme.colors.border` med `osloBranding.colors.border`

### CreatePollScreen.tsx
- Legg til null-check for `auth`
- Erstatt `backgroundSecondary` med eksisterende farge

### HomeScreen.tsx
- Sjekk at `onRefresh` er definert
- Legg til manglende stiler

