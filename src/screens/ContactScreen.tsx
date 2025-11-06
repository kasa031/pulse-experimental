/**
 * ContactScreen - Kontaktinformasjon og om prosjektet
 */

import React from 'react';
import { View, StyleSheet, ScrollView, Linking, useWindowDimensions } from 'react-native';
import { Card, Text, Button, Surface, Divider } from 'react-native-paper';
import { theme, osloBranding } from '../constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ContactScreen = () => {
  const { width } = useWindowDimensions();
  const isTablet = width > 768;

  const handleEmailPress = () => {
    Linking.openURL('mailto:ms.tery@icloud.com?subject=Kontakt fra Pulse Oslo');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.content, isTablet && styles.contentTablet]}>
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
              mode="contained"
              icon="email"
              onPress={handleEmailPress}
              style={styles.emailButton}
            >
              Send e-post
            </Button>
          </Card.Content>
        </Card>

        {/* About Project Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Om Pulse Oslo
            </Text>
            <Divider style={styles.divider} />
            
            <Text variant="bodyMedium" style={styles.description}>
              Pulse Oslo er en digital plattform utviklet for å styrke lokaldemokratiet i Oslo. 
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
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: 16,
  },
  contentTablet: {
    padding: 24,
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  card: {
    marginBottom: 16,
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
    marginTop: 8,
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
  },
});

export default ContactScreen;

