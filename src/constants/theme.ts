import { DefaultTheme } from 'react-native-paper';

export const theme: typeof DefaultTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0066CC', // Oslo blå
    accent: '#FF6B35', // Oslo oransje
    background: '#F5F5F5',
    surface: '#FFFFFF',
    text: '#1A1A1A',
    onSurface: '#1A1A1A',
    disabled: '#CCCCCC',
    placeholder: '#999999',
    backdrop: 'rgba(0, 0, 0, 0.5)',
  },
  roundness: 8,
};

