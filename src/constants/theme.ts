import { DefaultTheme, DarkTheme } from 'react-native-paper';
import { OSLO_COLORS } from './osloDistricts';

export const lightTheme: typeof DefaultTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: OSLO_COLORS.primary, // Oslo blå
    secondary: OSLO_COLORS.secondary, // Oslo oransje
    accent: OSLO_COLORS.accent, // Grønn
    background: OSLO_COLORS.background,
    surface: OSLO_COLORS.surface,
    onSurface: OSLO_COLORS.text,
    disabled: '#CCCCCC',
    placeholder: OSLO_COLORS.textSecondary,
    backdrop: 'rgba(0, 0, 0, 0.5)',
    error: OSLO_COLORS.error, // Rød
    notification: OSLO_COLORS.secondary,
    // Utvidede farger
    warning: OSLO_COLORS.warning, // Gul
    info: OSLO_COLORS.info, // Turkis
  } as any,
  roundness: 8,
};

export const darkTheme: typeof DarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: OSLO_COLORS.primary, // Oslo blå (samme)
    secondary: OSLO_COLORS.secondary, // Oslo oransje (samme)
    accent: OSLO_COLORS.accent, // Grønn (samme)
    background: OSLO_COLORS.backgroundDark, // Mørk bakgrunn
    surface: '#1E1E1E', // Mørk overflate
    onSurface: '#E0E0E0', // Lys tekst
    disabled: '#666666',
    placeholder: '#999999',
    backdrop: 'rgba(0, 0, 0, 0.8)',
    error: OSLO_COLORS.error, // Rød (samme)
    notification: OSLO_COLORS.secondary,
    // Utvidede farger
    warning: OSLO_COLORS.warning, // Gul (samme)
    info: OSLO_COLORS.info, // Turkis (samme)
  } as any,
  roundness: 8,
};

// Default theme (light)
export const theme = lightTheme;

// Oslo-branding spesifikke stiler
export const osloBranding = {
  logo: {
    text: 'OsloPuls',
    tagline: 'Din stemme i byen',
  },
  colors: OSLO_COLORS,
};

