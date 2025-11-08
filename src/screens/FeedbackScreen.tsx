/**
 * FeedbackScreen - Feilrapportering og tilbakemelding
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { 
  Card, 
  Text, 
  TextInput, 
  Button, 
  HelperText, 
  RadioButton, 
  Snackbar,
  ActivityIndicator,
  Divider
} from 'react-native-paper';
import { theme, osloBranding } from '../constants/theme';
import { sendFeedback, isEmailJSConfigured } from '../services/feedbackService';
import { auth } from '../services/firebase';
import { safeError, safeLog } from '../utils/performance';
import { validateEmail } from '../utils/validation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useResponsive, getResponsivePadding } from '../utils/useResponsive';
import { SPACING } from '../constants/spacing';
import { BUTTON_MIN_HEIGHT } from '../constants/touchTargets';

const FEEDBACK_TYPES = [
  { value: 'bug', label: 'Feilrapport', icon: 'bug', description: 'Rapporter en feil eller problem' },
  { value: 'feature', label: 'Funksjonsforespørsel', icon: 'lightbulb', description: 'Foreslå en ny funksjon' },
  { value: 'feedback', label: 'Tilbakemelding', icon: 'comment-text', description: 'Gi generell tilbakemelding' },
  { value: 'other', label: 'Annet', icon: 'help-circle', description: 'Annet' },
] as const;

const FeedbackScreen = () => {
  const { isMobile, isTablet, isDesktop, width } = useResponsive();
  const padding = getResponsivePadding(width);
  const user = auth?.currentUser;
  
  const [type, setType] = useState<'bug' | 'feature' | 'feedback' | 'other'>('bug');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [userEmail, setUserEmail] = useState(user?.email || '');
  const [userName, setUserName] = useState(user?.displayName || '');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [currentScreen, setCurrentScreen] = useState('Feedback');

  // Sjekk om EmailJS er konfigurert
  const emailJSConfigured = isEmailJSConfigured();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!subject.trim()) {
      newErrors.subject = 'Emne er påkrevd';
    } else if (subject.trim().length < 5) {
      newErrors.subject = 'Emne må være minst 5 tegn';
    }

    if (!message.trim()) {
      newErrors.message = 'Melding er påkrevd';
    } else if (message.trim().length < 10) {
      newErrors.message = 'Melding må være minst 10 tegn';
    }

    if (userEmail && !validateEmail(userEmail).valid) {
      newErrors.userEmail = 'Ugyldig e-postadresse';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setSnackbarMessage('Vennligst fyll ut alle felter korrekt');
      setSnackbarVisible(true);
      return;
    }

    if (!emailJSConfigured) {
      setSnackbarMessage('Feilrapportering er ikke konfigurert. Kontakt administrator.');
      setSnackbarVisible(true);
      return;
    }

    setLoading(true);

    try {
      await sendFeedback({
        subject: subject.trim(),
        message: message.trim(),
        type,
        screen: currentScreen,
        userEmail: userEmail.trim() || undefined,
        userName: userName.trim() || undefined,
      });

      setSnackbarMessage('Takk! Din tilbakemelding er sendt.');
      setSnackbarVisible(true);

      // Reset form
      setSubject('');
      setMessage('');
      if (!user) {
        setUserEmail('');
        setUserName('');
      }
      setErrors({});
    } catch (error: unknown) {
      safeError('Feil ved sending av feedback:', error);
      const err = error as { message?: string };
      setSnackbarMessage(err.message || 'Kunne ikke sende tilbakemelding. Prøv igjen.');
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  if (!emailJSConfigured) {
    return (
      <View style={[styles.center, { padding }]}>
        <Icon name="alert-circle" size={64} color={osloBranding.colors.textSecondary} />
        <Text variant="headlineSmall" style={styles.errorTitle}>
          Feilrapportering ikke tilgjengelig
        </Text>
        <Text variant="bodyMedium" style={styles.errorText}>
          Feilrapporteringsfunksjonen er ikke konfigurert ennå.
        </Text>
        <Text variant="bodySmall" style={styles.errorSubtext}>
          Kontakt administrator for å få dette satt opp.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { padding },
        isTablet && styles.contentTablet,
        isMobile && styles.contentMobile,
        isDesktop && styles.contentDesktop
      ]}
    >
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.headerRow}>
            <Icon name="bug" size={32} color={osloBranding.colors.primary} />
            <View style={styles.headerText}>
              <Text variant="headlineSmall" style={styles.title}>
                Rapporter feil eller gi tilbakemelding
              </Text>
              <Text variant="bodySmall" style={styles.subtitle}>
                Hjelp oss forbedre OsloPuls ved å rapportere problemer eller dele dine ideer
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Type tilbakemelding
          </Text>
          <RadioButton.Group onValueChange={(value) => setType(value as typeof type)} value={type}>
            {FEEDBACK_TYPES.map((feedbackType) => (
              <View key={feedbackType.value} style={styles.radioItem}>
                <RadioButton value={feedbackType.value} />
                <View style={styles.radioContent}>
                  <View style={styles.radioHeader}>
                    <Icon 
                      name={feedbackType.icon} 
                      size={20} 
                      color={osloBranding.colors.primary} 
                      style={styles.radioIcon}
                    />
                    <Text variant="bodyLarge" style={styles.radioLabel}>
                      {feedbackType.label}
                    </Text>
                  </View>
                  <Text variant="bodySmall" style={styles.radioDescription}>
                    {feedbackType.description}
                  </Text>
                </View>
              </View>
            ))}
          </RadioButton.Group>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <View>
            <TextInput
              label="Emne *"
              value={subject}
              onChangeText={setSubject}
              mode="outlined"
              error={!!errors.subject}
              style={styles.input}
              placeholder="Beskriv problemet kort..."
            />
            {errors.subject && (
              <HelperText type="error" visible={!!errors.subject}>
                {errors.subject}
              </HelperText>
            )}
          </View>

          <View>
            <TextInput
              label="Beskrivelse *"
              value={message}
              onChangeText={setMessage}
              mode="outlined"
              multiline
              numberOfLines={6}
              error={!!errors.message}
              style={styles.input}
              placeholder="Beskriv problemet eller ideen din i detalj..."
            />
            {errors.message && (
              <HelperText type="error" visible={!!errors.message}>
                {errors.message}
              </HelperText>
            )}
            <HelperText type="info" style={styles.hint}>
              For feilrapporter: Beskriv hva som skjedde, hva du forventet, og hva som faktisk skjedde.
            </HelperText>
          </View>

          <Divider style={styles.divider} />

          {!user && (
            <>
              <View>
                <TextInput
                  label="Ditt navn (valgfritt)"
                  value={userName}
                  onChangeText={setUserName}
                  mode="outlined"
                  style={styles.input}
                  placeholder="Ditt navn"
                />
              </View>

              <View>
                <TextInput
                  label="Din e-post (valgfritt)"
                  value={userEmail}
                  onChangeText={setUserEmail}
                  mode="outlined"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={!!errors.userEmail}
                  style={styles.input}
                  placeholder="din@epost.no"
                />
                {errors.userEmail && (
                  <HelperText type="error" visible={!!errors.userEmail}>
                    {errors.userEmail}
                  </HelperText>
                )}
                <HelperText type="info" style={styles.hint}>
                  Hvis du oppgir e-post kan vi kontakte deg for oppfølging.
                </HelperText>
              </View>
            </>
          )}

          {user && (
            <View style={styles.userInfo}>
              <Icon name="account" size={16} color={osloBranding.colors.textSecondary} />
              <Text variant="bodySmall" style={styles.userInfoText}>
                Sendt fra: {user.displayName || user.email}
              </Text>
            </View>
          )}

          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.submitButton}
            icon="send"
          >
            Send tilbakemelding
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.infoCard}>
        <Card.Content>
          <Text variant="bodySmall" style={styles.infoText}>
            <Icon name="information" size={16} color={osloBranding.colors.primary} />{' '}
            Din tilbakemelding sendes direkte til utvikleren. Vi setter pris på all feedback!
          </Text>
        </Card.Content>
      </Card>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={4000}
        action={{
          label: 'OK',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: SPACING.screenPadding.mobile,
  },
  contentMobile: {
    padding: SPACING.screenPadding.mobile,
  },
  contentTablet: {
    padding: SPACING.screenPadding.tablet,
    maxWidth: SPACING.contentMaxWidth.tablet,
    alignSelf: 'center',
    width: '100%',
  },
  contentDesktop: {
    padding: SPACING.screenPadding.desktop,
    maxWidth: SPACING.contentMaxWidth.desktop,
    alignSelf: 'center',
    width: '100%',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorText: {
    textAlign: 'center',
    color: osloBranding.colors.textSecondary,
    marginBottom: 8,
  },
  errorSubtext: {
    textAlign: 'center',
    color: osloBranding.colors.textSecondary,
  },
  card: {
    marginBottom: SPACING.cardMargin.mobile,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    color: osloBranding.colors.primary,
    marginBottom: 4,
  },
  subtitle: {
    color: osloBranding.colors.textSecondary,
    marginTop: 4,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: '600',
    color: osloBranding.colors.primary,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingVertical: 8,
  },
  radioContent: {
    flex: 1,
    marginLeft: 8,
  },
  radioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  radioIcon: {
    marginRight: 8,
  },
  radioLabel: {
    fontWeight: '500',
  },
  radioDescription: {
    color: osloBranding.colors.textSecondary,
    marginLeft: 28,
  },
  input: {
    marginBottom: 8,
  },
  hint: {
    marginTop: -8,
    marginBottom: 8,
  },
  divider: {
    marginVertical: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: osloBranding.colors.background,
    borderRadius: 8,
  },
  userInfoText: {
    marginLeft: 8,
    color: osloBranding.colors.textSecondary,
  },
  submitButton: {
    marginTop: SPACING.md,
    minHeight: BUTTON_MIN_HEIGHT,
  },
  infoCard: {
    marginBottom: SPACING.xl,
    backgroundColor: osloBranding.colors.primary + '10',
  },
  infoText: {
    color: osloBranding.colors.text,
    lineHeight: 20,
  },
});

export default FeedbackScreen;

