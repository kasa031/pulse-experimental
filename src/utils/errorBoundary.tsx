import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Text, Button, Surface } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme, osloBranding } from '../constants/theme';
import { safeError } from './performance';
import { reportBug } from '../services/feedbackService';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error med safe error logging
    safeError('ErrorBoundary caught an error:', error);
    safeError('Error info:', errorInfo);
    
    // Lagre errorInfo for visning
    this.setState({ errorInfo });
    
    // Kall custom error handler hvis den er satt
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    // Send automatisk feilrapport (hvis EmailJS er konfigurert)
    try {
      const componentStack = errorInfo.componentStack || '';
      const additionalInfo = `Component Stack:\n${componentStack.substring(0, 500)}`;
      reportBug(error, 'ErrorBoundary', additionalInfo).catch((reportError) => {
        safeError('Kunne ikke sende automatisk feilrapport:', reportError);
      });
    } catch (reportError) {
      safeError('Feil ved automatisk feilrapportering:', reportError);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReload = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.location.reload();
    } else {
      this.handleReset();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <Surface style={styles.surface} elevation={4}>
            <Icon 
              name="alert-circle" 
              size={64} 
              color="#d32f2f"
            />
            <Text variant="headlineSmall" style={styles.title}>
              Noe gikk galt
            </Text>
            <Text variant="bodyMedium" style={styles.message}>
              {this.state.error?.message || 'En uventet feil oppstod'}
            </Text>
            {this.state.errorInfo && __DEV__ && (
              <Text variant="bodySmall" style={styles.errorDetails}>
                {this.state.errorInfo.componentStack?.split('\n')[0]}
              </Text>
            )}
            <Text variant="bodySmall" style={styles.hint}>
              En automatisk feilrapport er sendt. Du kan også rapportere dette manuelt i "Rapporter"-fanen.
            </Text>
            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={this.handleReset}
                style={styles.button}
                icon="refresh"
              >
                Prøv igjen
              </Button>
              {Platform.OS === 'web' && (
                <Button
                  mode="outlined"
                  onPress={this.handleReload}
                  style={styles.button}
                  icon="reload"
                >
                  Last på nytt
                </Button>
              )}
            </View>
          </Surface>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: theme.colors.background,
    ...(Platform.OS === 'web' ? { flex: 1 } : {}),
  },
  surface: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    maxWidth: 500,
    width: '100%',
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    marginBottom: 12,
    fontWeight: 'bold',
    color: '#d32f2f',
    textAlign: 'center',
  },
  message: {
    marginBottom: 16,
    textAlign: 'center',
    color: osloBranding.colors.textSecondary,
    lineHeight: 22,
  },
  errorDetails: {
    marginBottom: 16,
    textAlign: 'center',
    color: osloBranding.colors.textSecondary,
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'monospace',
    fontSize: 12,
  },
  hint: {
    marginBottom: 16,
    textAlign: 'center',
    color: osloBranding.colors.textSecondary,
    fontSize: 11,
    fontStyle: 'italic',
    paddingHorizontal: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    justifyContent: 'center',
  },
  button: {
    minWidth: 120,
  },
});

