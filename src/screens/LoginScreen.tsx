import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Surface, HelperText } from 'react-native-paper';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { theme, osloBranding } from '../constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { validateEmail, validatePassword } from '../utils/validation';
import { checkRateLimit } from '../utils/rateLimiter';
import { safeError } from '../utils/performance';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(null);

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (text.length > 0) {
      const validation = validateEmail(text);
      setEmailError(validation.error || null);
    } else {
      setEmailError(null);
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (isSignUp && text.length > 0) {
      const validation = validatePassword(text);
      setPasswordError(validation.error || null);
      setPasswordStrength(validation.strength || null);
    } else {
      setPasswordError(null);
      setPasswordStrength(null);
    }
  };

  const handleSubmit = async () => {
    // Valider input
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      setEmailError(emailValidation.error || 'Ugyldig e-post');
      return;
    }

    if (isSignUp) {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        setPasswordError(passwordValidation.error || 'Ugyldig passord');
        return;
      }
    }

    // Rate limiting
    const rateLimitType = isSignUp ? 'signup' : 'login';
    const rateLimitCheck = await checkRateLimit(rateLimitType);
    if (!rateLimitCheck.allowed) {
      const remainingMinutes = rateLimitCheck.resetAt 
        ? Math.ceil((rateLimitCheck.resetAt - Date.now()) / 60000)
        : 15;
      setError(`For mange forsøk. Prøv igjen om ${remainingMinutes} minutter.`);
      return;
    }

    setLoading(true);
    setError(null);
    setEmailError(null);
    setPasswordError(null);

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
    } catch (err: any) {
      safeError('Auth feil:', err);
      // Bedre feilmeldinger
      let errorMessage = 'Noe gikk galt';
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'Bruker ikke funnet';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Feil passord';
      } else if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'E-post er allerede i bruk';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Passordet er for svakt';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Ugyldig e-postadresse';
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Surface style={styles.surface}>
        <View style={styles.header}>
          <Icon name="map-marker" size={48} color={osloBranding.colors.primary} />
          <Text variant="headlineMedium" style={styles.title}>
            {osloBranding.logo.text}
          </Text>
          <Text variant="bodySmall" style={styles.tagline}>
            {osloBranding.logo.tagline}
          </Text>
        </View>
        <Text variant="bodyMedium" style={styles.subtitle}>
          {isSignUp ? 'Opprett konto' : 'Logg inn'}
        </Text>

        {error && (
          <Text style={styles.error} variant="bodySmall">
            {error}
          </Text>
        )}

        <View>
          <TextInput
            label="E-post"
            value={email}
            onChangeText={handleEmailChange}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            disabled={loading}
            error={!!emailError}
          />
          {emailError && (
            <HelperText type="error" visible={!!emailError}>
              {emailError}
            </HelperText>
          )}
        </View>

        <View>
          <TextInput
            label="Passord"
            value={password}
            onChangeText={handlePasswordChange}
            mode="outlined"
            secureTextEntry
            style={styles.input}
            disabled={loading}
            error={!!passwordError}
          />
          {passwordError && (
            <HelperText type="error" visible={!!passwordError}>
              {passwordError}
            </HelperText>
          )}
          {isSignUp && password.length > 0 && !passwordError && passwordStrength && (
            <HelperText type={passwordStrength === 'strong' ? 'info' : 'warning'}>
              Passord styrke: {passwordStrength === 'strong' ? 'Sterk' : passwordStrength === 'medium' ? 'Middels' : 'Svak'}
            </HelperText>
          )}
          {isSignUp && (
            <HelperText type="info" style={styles.passwordHint}>
              Minst 8 tegn, både bokstaver og tall
            </HelperText>
          )}
        </View>

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
          style={styles.button}
        >
          {isSignUp ? 'Opprett konto' : 'Logg inn'}
        </Button>

        <Button
          mode="text"
          onPress={() => setIsSignUp(!isSignUp)}
          disabled={loading}
          style={styles.switchButton}
        >
          {isSignUp ? 'Har du allerede konto? Logg inn' : 'Ingen konto? Opprett en'}
        </Button>
      </Surface>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: theme.colors.background,
  },
  surface: {
    padding: 24,
    borderRadius: 12,
    elevation: 4,
    backgroundColor: theme.colors.surface,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 4,
    fontWeight: 'bold',
    color: osloBranding.colors.primary,
  },
  tagline: {
    textAlign: 'center',
    color: osloBranding.colors.textSecondary,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    color: osloBranding.colors.textSecondary,
    fontWeight: '500',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    paddingVertical: 4,
  },
  switchButton: {
    marginTop: 16,
  },
  error: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
  passwordHint: {
    fontSize: 12,
    marginTop: -8,
  },
});

export default LoginScreen;

