import React, { useState, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { TextInput, Button, Text, Surface, HelperText, Checkbox } from 'react-native-paper';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { theme, osloBranding } from '../constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { validateEmail, validatePassword } from '../utils/validation';
import { checkRateLimit } from '../utils/rateLimiter';
import { safeError } from '../utils/performance';
import AsyncStorage from '@react-native-async-storage/async-storage';

const REMEMBER_ME_KEY = '@pulse_oslo_remember_me';
const REMEMBERED_EMAIL_KEY = '@pulse_oslo_remembered_email';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Hent lagret e-post ved oppstart
  useEffect(() => {
    const loadRememberedEmail = async () => {
      try {
        const remembered = await AsyncStorage.getItem(REMEMBER_ME_KEY);
        if (remembered === 'true') {
          const savedEmail = await AsyncStorage.getItem(REMEMBERED_EMAIL_KEY);
          if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
          }
        }
      } catch (err) {
        safeError('Feil ved henting av lagret e-post:', err);
      }
    };
    loadRememberedEmail();
  }, []);

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
        // Lagre e-post hvis "Husk meg" er valgt
        if (rememberMe) {
          await AsyncStorage.setItem(REMEMBER_ME_KEY, 'true');
          await AsyncStorage.setItem(REMEMBERED_EMAIL_KEY, email.trim());
        } else {
          // Fjern lagret e-post hvis "Husk meg" ikke er valgt
          await AsyncStorage.removeItem(REMEMBER_ME_KEY);
          await AsyncStorage.removeItem(REMEMBERED_EMAIL_KEY);
        }
      }
    } catch (err: unknown) {
      safeError('Auth feil:', err);
      // Forbedrede feilmeldinger med mer spesifikke beskrivelser
      let errorMessage = 'Noe gikk galt. Prøv igjen.';
      let errorTitle = 'Feil';
      const error = err as { code?: string; message?: string };
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Det finnes ingen konto med denne e-postadressen. Sjekk at e-postadressen er riktig, eller opprett en ny konto.';
        errorTitle = 'Bruker ikke funnet';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Passordet er feil. Prøv igjen eller bruk "Glemt passord" for å tilbakestille det.';
        errorTitle = 'Feil passord';
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Denne e-postadressen er allerede registrert. Prøv å logge inn i stedet, eller bruk en annen e-postadresse.';
        errorTitle = 'E-post allerede i bruk';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Passordet er for svakt. Passordet må være minst 6 tegn langt.';
        errorTitle = 'For svakt passord';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'E-postadressen er ikke gyldig. Sjekk at du har skrevet den riktig.';
        errorTitle = 'Ugyldig e-post';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'For mange mislykkede innloggingsforsøk. Vent litt før du prøver igjen, eller tilbakestill passordet.';
        errorTitle = 'For mange forsøk';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Nettverksfeil. Sjekk internettforbindelsen din og prøv igjen.';
        errorTitle = 'Nettverksfeil';
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'E-post eller passord er feil. Sjekk at du har skrevet riktig informasjon.';
        errorTitle = 'Ugyldige innloggingsdetaljer';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(`${errorTitle}: ${errorMessage}`);
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
          <Image 
            source={require('../../assets/oslo-logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
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
          <View style={styles.errorContainer}>
            <Icon name="alert-circle" size={20} color="#d32f2f" style={styles.errorIcon} />
            <Text style={styles.error} variant="bodySmall">
              {error}
            </Text>
          </View>
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

        {!isSignUp && (
          <>
            <View style={styles.rememberMeContainer}>
              <Checkbox
                status={rememberMe ? 'checked' : 'unchecked'}
                onPress={() => setRememberMe(!rememberMe)}
                disabled={loading}
              />
              <Text 
                variant="bodyMedium" 
                style={styles.rememberMeText}
                onPress={() => !loading && setRememberMe(!rememberMe)}
              >
                Husk meg
              </Text>
            </View>
            <Button
              mode="text"
              onPress={() => setShowForgotPassword(true)}
              disabled={loading}
              style={styles.forgotPasswordButton}
              compact
            >
              Glemt passord?
            </Button>
          </>
        )}

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading || !!emailError || !!passwordError || !email.trim() || !password.trim()}
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

      {/* Forgot Password Dialog */}
      <Portal>
        <Dialog visible={showForgotPassword} onDismiss={() => {
          setShowForgotPassword(false);
          setForgotPasswordEmail('');
          setForgotPasswordSent(false);
        }}>
          <Dialog.Title>Glemt passord</Dialog.Title>
          <Dialog.Content>
            {!forgotPasswordSent ? (
              <>
                <Text variant="bodyMedium" style={styles.dialogText}>
                  Skriv inn e-postadressen din, så sender vi deg en lenke for å tilbakestille passordet.
                </Text>
                <TextInput
                  label="E-post"
                  value={forgotPasswordEmail}
                  onChangeText={setForgotPasswordEmail}
                  mode="outlined"
                  style={styles.dialogInput}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={!!emailError && forgotPasswordEmail.length > 0}
                />
                {emailError && forgotPasswordEmail.length > 0 && (
                  <HelperText type="error" visible={!!emailError}>
                    {emailError}
                  </HelperText>
                )}
              </>
            ) : (
              <Text variant="bodyMedium" style={styles.dialogText}>
                Vi har sendt en e-post til {forgotPasswordEmail} med instruksjoner for å tilbakestille passordet.
              </Text>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => {
              setShowForgotPassword(false);
              setForgotPasswordEmail('');
              setForgotPasswordSent(false);
            }}>
              {forgotPasswordSent ? 'Lukk' : 'Avbryt'}
            </Button>
            {!forgotPasswordSent && (
              <Button
                mode="contained"
                onPress={async () => {
                  const emailValidation = validateEmail(forgotPasswordEmail);
                  if (!emailValidation.valid) {
                    setEmailError(emailValidation.error || 'Ugyldig e-post');
                    return;
                  }
                  
                  try {
                    await sendPasswordResetEmail(auth!, forgotPasswordEmail.trim());
                    setForgotPasswordSent(true);
                    setEmailError(null);
                  } catch (err: unknown) {
                    const error = err as { code?: string; message?: string };
                    if (error.code === 'auth/user-not-found') {
                      setEmailError('Ingen bruker funnet med denne e-postadressen');
                    } else {
                      setEmailError(error.message || 'Kunne ikke sende e-post. Prøv igjen.');
                    }
                    safeError('Feil ved sending av passord-tilbakestilling:', err);
                  }
                }}
                disabled={!forgotPasswordEmail.trim() || !!emailError}
              >
                Send
              </Button>
            )}
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
  logo: {
    width: 80,
    height: 80,
    marginBottom: 8,
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
    minHeight: BUTTON_MIN_HEIGHT,
    paddingVertical: BUTTON_PADDING_VERTICAL,
  },
  switchButton: {
    marginTop: 16,
    minHeight: BUTTON_MIN_HEIGHT,
    paddingVertical: BUTTON_PADDING_VERTICAL,
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
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 8,
  },
  rememberMeText: {
    marginLeft: 8,
    color: osloBranding.colors.text,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginTop: -8,
    marginBottom: 8,
    minHeight: BUTTON_MIN_HEIGHT,
  },
  dialogText: {
    marginBottom: 16,
    color: osloBranding.colors.text,
  },
  dialogInput: {
    marginTop: 8,
  },
});

export default LoginScreen;

