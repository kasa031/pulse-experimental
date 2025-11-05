import React from 'react';
import { View, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { Card, Text, Button, Chip } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { theme, osloBranding } from '../constants/theme';
import { OSLO_DISTRICTS } from '../constants/osloDistricts';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();
  const isTablet = width > 768;

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.content, isTablet && styles.contentTablet]}>
        {/* Welcome Card */}
        <Card style={[styles.card, styles.welcomeCard]}>
          <Card.Content>
            <View style={styles.headerRow}>
              <Icon name="map-marker" size={32} color={osloBranding.colors.primary} />
              <View style={styles.headerText}>
                <Text variant="headlineSmall" style={styles.title}>
                  {osloBranding.logo.text}
                </Text>
                <Text variant="bodySmall" style={styles.tagline}>
                  {osloBranding.logo.tagline}
                </Text>
              </View>
            </View>
            <Text variant="bodyMedium" style={styles.description}>
              Din stemme betyr noe! Delta i lokale avstemninger og påvirk utviklingen av Oslo. 
              Hver stemme hjelper byrådet og kommunen ta bedre beslutninger for byen vår.
            </Text>
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Icon name="vote" size={20} color={osloBranding.colors.secondary} />
                <Text variant="bodySmall" style={styles.statText}>
                  Aktive avstemninger
                </Text>
              </View>
              <View style={styles.stat}>
                <Icon name="map" size={20} color={osloBranding.colors.primary} />
                <Text variant="bodySmall" style={styles.statText}>
                  {OSLO_DISTRICTS.length} bydeler
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Quick Info Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Hva er Pulse Oslo?
            </Text>
            <Text variant="bodyMedium" style={styles.infoText}>
              Pulse Oslo er en plattform hvor innbyggerne i Oslo kan delta i lokale avstemninger 
              om temaer som påvirker byen. Fra transport og miljø til byutvikling og politikk - 
              din mening betyr noe.
            </Text>
            <View style={styles.chipContainer}>
              {['Miljø', 'Transport', 'Byutvikling', 'Politikk'].map((cat) => (
                <Chip key={cat} style={styles.chip} textStyle={styles.chipText}>
                  {cat}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Active Polls Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Aktive avstemninger
            </Text>
            <Text variant="bodyMedium" style={styles.emptyText}>
              Gå til "Stem"-fanen for å se alle aktive avstemninger og delta med din stemme.
            </Text>
            <Button 
              mode="contained" 
              icon="vote" 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Stem')}
            >
              Se alle avstemninger
            </Button>
          </Card.Content>
        </Card>

        {/* News Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Nyheter fra Oslo
            </Text>
            <Text variant="bodyMedium" style={styles.emptyText}>
              Nyhetsfeed med lokale nyheter og oppdateringer kommer snart. 
              Hold deg oppdatert på hva som skjer i byen!
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
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  welcomeCard: {
    backgroundColor: theme.colors.surface,
    borderLeftWidth: 4,
    borderLeftColor: osloBranding.colors.primary,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    color: osloBranding.colors.primary,
  },
  tagline: {
    color: osloBranding.colors.textSecondary,
    marginTop: 4,
  },
  description: {
    marginTop: 12,
    marginBottom: 16,
    color: osloBranding.colors.textSecondary,
    lineHeight: 22,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border || '#E0E0E0',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  statText: {
    marginLeft: 8,
    color: osloBranding.colors.textSecondary,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: '600',
    color: osloBranding.colors.primary,
  },
  infoText: {
    marginBottom: 16,
    color: osloBranding.colors.textSecondary,
    lineHeight: 22,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: osloBranding.colors.primary + '15',
  },
  chipText: {
    color: osloBranding.colors.primary,
  },
  emptyText: {
    color: osloBranding.colors.textSecondary,
    marginBottom: 16,
    lineHeight: 22,
  },
  actionButton: {
    marginTop: 8,
  },
});

export default HomeScreen;

