import { DefaultTheme } from 'react-native-paper';
import { OSLO_COLORS } from './osloDistricts';

export const theme: typeof DefaultTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: OSLO_COLORS.primary, // Oslo blå
    background: OSLO_COLORS.background,
    surface: OSLO_COLORS.surface,
    onSurface: OSLO_COLORS.text,
    disabled: '#CCCCCC',
    placeholder: OSLO_COLORS.textSecondary,
    backdrop: 'rgba(0, 0, 0, 0.5)',
    error: '#B00020',
    notification: OSLO_COLORS.secondary,
  } as any,
  roundness: 8,
};

// Oslo-branding spesifikke stiler
export const osloBranding = {
  logo: {
    text: 'OsloPuls',
    tagline: 'Din stemme i byen',
  },
  colors: OSLO_COLORS,
};

