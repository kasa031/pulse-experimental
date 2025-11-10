/**
 * ContactScreen - Kontaktinformasjon og om prosjektet
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Linking, Image } from 'react-native';
import { Card, Text, Button, Divider, TextInput, HelperText, Snackbar } from 'react-native-paper';
import { theme, osloBranding } from '../constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useResponsive, getResponsivePadding } from '../utils/useResponsive';
import { SPACING } from '../constants/spacing';
import { BUTTON_MIN_HEIGHT } from '../constants/touchTargets';

const ContactScreen = () => {
  const { isMobile, isTablet, isDesktop, width } = useResponsive();
  const padding = getResponsivePadding(width);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactErrors, setContactErrors] = useState<Record<string, string>>({});
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleEmailPress = () => {
    Linking.openURL('mailto:ms.tery@icloud.com?subject=Kontakt fra OsloPuls');
  };

  const validateContactForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!contactName.trim()) {
      newErrors.name = 'Navn er påkrevd';
    }

    if (!contactEmail.trim()) {
      newErrors.email = 'E-post er påkrevd';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      newErrors.email = 'Ugyldig e-postadresse';
    }

    if (!contactMessage.trim()) {
      newErrors.message = 'Melding er påkrevd';
    } else if (contactMessage.trim().length < 10) {
      newErrors.message = 'Melding må være minst 10 tegn';
    }

    setContactErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitContact = () => {
    if (!validateContactForm()) {
      setSnackbarMessage('Vennligst fyll ut alle felter korrekt');
      setSnackbarVisible(true);
      return;
    }

    const subject = encodeURIComponent(`Kontakt fra ${contactName}`);
    const body = encodeURIComponent(
      `Navn: ${contactName}\nE-post: ${contactEmail}\n\nMelding:\n${contactMessage}`
    );
    Linking.openURL(`mailto:ms.tery@icloud.com?subject=${subject}&body=${body}`);

    setSnackbarMessage('E-post-klient åpnes...');
    setSnackbarVisible(true);

    // Reset form
    setContactName('');
    setContactEmail('');
    setContactMessage('');
    setContactErrors({});
  };

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
      <View>
        {/* Header Card */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.headerRow}>
              <Icon name="account-circle" size={48} color={osloBranding.colors.primary} />
              <View style={styles.headerText}>
                <Text variant="headlineSmall" style={styles.title}>
                  Kontakt
                </Text>
                <Text variant="bodyMedium" style={styles.subtitle}>
                  Ta kontakt eller les mer om prosjektet
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* About Developer Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Om utvikleren
            </Text>
            <Divider style={styles.divider} />
            
            <View style={styles.infoRow}>
              <Icon name="account" size={20} color={osloBranding.colors.primary} />
              <Text variant="bodyMedium" style={styles.infoText}>
                38 år gammel tobarnsmor
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Icon name="school" size={20} color={osloBranding.colors.primary} />
              <Text variant="bodyMedium" style={styles.infoText}>
                Cybersikkerhetstudent (siste år bachelor)
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Icon name="domain" size={20} color={osloBranding.colors.primary} />
              <Text variant="bodyMedium" style={styles.infoText}>
                Tilknyttet Høyskolen i Kristiania
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Icon name="map-marker" size={20} color={osloBranding.colors.primary} />
              <Text variant="bodyMedium" style={styles.infoText}>
                Bor på Bislett med mann og barn
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Contact Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Kontaktinformasjon
            </Text>
            <Divider style={styles.divider} />
            
            <View style={styles.contactRow}>
              <Icon name="email" size={24} color={osloBranding.colors.primary} />
              <View style={styles.contactInfo}>
                <Text variant="bodySmall" style={styles.contactLabel}>
                  E-post
                </Text>
                <Text variant="bodyLarge" style={styles.contactValue}>
                  ms.tery@icloud.com
                </Text>
              </View>
            </View>

            <Button
              mode="outlined"
              icon="email"
              onPress={handleEmailPress}
              style={styles.emailButton}
            >
              Åpne e-post-klient
            </Button>
          </Card.Content>
        </Card>

        {/* Contact Form Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Send melding
            </Text>
            <Divider style={styles.divider} />
            
            <TextInput
              label="Navn *"
              value={contactName}
              onChangeText={setContactName}
              mode="outlined"
              error={!!contactErrors.name}
              style={styles.formInput}
            />
            {contactErrors.name && (
              <HelperText type="error" visible={!!contactErrors.name}>
                {contactErrors.name}
              </HelperText>
            )}

            <TextInput
              label="E-post *"
              value={contactEmail}
              onChangeText={setContactEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              error={!!contactErrors.email}
              style={styles.formInput}
            />
            {contactErrors.email && (
              <HelperText type="error" visible={!!contactErrors.email}>
                {contactErrors.email}
              </HelperText>
            )}

            <TextInput
              label="Melding *"
              value={contactMessage}
              onChangeText={setContactMessage}
              mode="outlined"
              multiline
              numberOfLines={5}
              error={!!contactErrors.message}
              style={styles.formInput}
            />
            {contactErrors.message && (
              <HelperText type="error" visible={!!contactErrors.message}>
                {contactErrors.message}
              </HelperText>
            )}

            <Button
              mode="contained"
              icon="send"
              onPress={handleSubmitContact}
              style={styles.submitButton}
            >
              Send melding
            </Button>
          </Card.Content>
        </Card>

        {/* About Project Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Om OsloPuls
            </Text>
            <Divider style={styles.divider} />
            
            <Text variant="bodyMedium" style={styles.description}>
              OsloPuls er en digital plattform utviklet for å styrke lokaldemokratiet i Oslo. 
              Appen gir innbyggerne mulighet til å delta i lokale avstemninger, diskutere saker 
              som påvirker byen, og holde seg oppdatert på nyheter fra Oslo kommune.
            </Text>

            <View style={styles.featureList}>
              <View style={styles.featureItem}>
                <Icon name="check-circle" size={20} color={osloBranding.colors.secondary} />
                <Text variant="bodyMedium" style={styles.featureText}>
                  Delta i lokale avstemninger
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Icon name="check-circle" size={20} color={osloBranding.colors.secondary} />
                <Text variant="bodyMedium" style={styles.featureText}>
                  Diskutere lokale saker
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Icon name="check-circle" size={20} color={osloBranding.colors.secondary} />
                <Text variant="bodyMedium" style={styles.featureText}>
                  Følge med på nyheter fra Oslo
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Icon name="check-circle" size={20} color={osloBranding.colors.secondary} />
                <Text variant="bodyMedium" style={styles.featureText}>
                  Se resultater fra tidligere avstemninger
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Technology Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Teknologi
            </Text>
            <Divider style={styles.divider} />
            
            <Text variant="bodySmall" style={styles.techText}>
              Prosjektet er bygget med React Native, Expo, Firebase og TypeScript. 
              Appen er designet for å fungere på mobil, nettbrett og web.
            </Text>
            
            <View style={styles.logoContainer}>
              <Image 
                source={require('../../assets/frigg-oslo-logo.png')} 
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          </Card.Content>
        </Card>

        {/* FAQ Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Ofte stilte spørsmål (FAQ)
            </Text>
            <Divider style={styles.divider} />
            
            <View style={styles.faqItem}>
              <Text variant="titleSmall" style={styles.faqQuestion}>
                Hva er OsloPuls?
              </Text>
              <Text variant="bodyMedium" style={styles.faqAnswer}>
                OsloPuls er en digital plattform for lokaldemokrati i Oslo. 
                Innbyggere kan delta i avstemninger, diskutere lokale saker og følge med på nyheter.
              </Text>
            </View>

            <View style={styles.faqItem}>
              <Text variant="titleSmall" style={styles.faqQuestion}>
                Hvem kan delta i avstemninger?
              </Text>
              <Text variant="bodyMedium" style={styles.faqAnswer}>
                Alle innloggede brukere kan delta i aktive avstemninger. 
                Du må opprette en konto for å stemme.
              </Text>
            </View>

            <View style={styles.faqItem}>
              <Text variant="titleSmall" style={styles.faqQuestion}>
                Hvordan oppretter jeg en avstemning?
              </Text>
              <Text variant="bodyMedium" style={styles.faqAnswer}>
                Kun administratorer kan opprette avstemninger. 
                Kontakt oss hvis du har forslag til nye avstemninger.
              </Text>
            </View>

            <View style={styles.faqItem}>
              <Text variant="titleSmall" style={styles.faqQuestion}>
                Er appen gratis å bruke?
              </Text>
              <Text variant="bodyMedium" style={styles.faqAnswer}>
                Ja, OsloPuls er helt gratis å bruke. 
                Det er ingen skjulte kostnader eller abonnementer.
              </Text>
            </View>

            <View style={styles.faqItem}>
              <Text variant="titleSmall" style={styles.faqQuestion}>
                Hvor kan jeg rapportere feil eller gi tilbakemelding?
              </Text>
              <Text variant="bodyMedium" style={styles.faqAnswer}>
                Du kan bruke kontaktformularen over eller sende en e-post direkte til 
                ms.tery@icloud.com. Vi setter pris på all tilbakemelding!
              </Text>
            </View>
          </Card.Content>
        </Card>
      </View>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'Lukk',
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
  card: {
    marginBottom: SPACING.cardMargin.mobile,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 16,
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    color: osloBranding.colors.primary,
  },
  subtitle: {
    color: osloBranding.colors.textSecondary,
    marginTop: 4,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: osloBranding.colors.text,
    marginBottom: 8,
  },
  divider: {
    marginVertical: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 12,
    color: osloBranding.colors.text,
    flex: 1,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  contactInfo: {
    marginLeft: 12,
    flex: 1,
  },
  contactLabel: {
    color: osloBranding.colors.textSecondary,
    marginBottom: 4,
  },
  contactValue: {
    color: osloBranding.colors.text,
    fontWeight: '500',
  },
  emailButton: {
    marginTop: SPACING.sm,
    minHeight: BUTTON_MIN_HEIGHT,
  },
  description: {
    color: osloBranding.colors.text,
    lineHeight: 22,
    marginBottom: 16,
  },
  featureList: {
    marginTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    marginLeft: 12,
    color: osloBranding.colors.text,
    flex: 1,
  },
  techText: {
    color: osloBranding.colors.textSecondary,
    lineHeight: 20,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 16,
    padding: 16,
    backgroundColor: osloBranding.colors.background,
    borderRadius: 8,
  },
  logo: {
    width: 120,
    height: 120,
    opacity: 0.8,
  },
  formInput: {
    marginBottom: 8,
  },
  submitButton: {
    marginTop: SPACING.md,
    minHeight: BUTTON_MIN_HEIGHT,
  },
  faqItem: {
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: osloBranding.colors.border || '#E0E0E0',
  },
  faqQuestion: {
    fontWeight: '600',
    color: osloBranding.colors.primary,
    marginBottom: SPACING.sm,
  },
  faqAnswer: {
    color: osloBranding.colors.text,
    lineHeight: 22,
  },
});

export default ContactScreen;

