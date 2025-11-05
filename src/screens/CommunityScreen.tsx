import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import { theme } from '../constants/theme';

const CommunityScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.title}>
              Fellesskap
            </Text>
            <Text variant="bodyMedium" style={styles.description}>
              Diskuter med andre innbyggere i Oslo og del dine meninger om lokale saker.
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Aktive diskusjoner
            </Text>
            <Text variant="bodyMedium" style={styles.emptyText}>
              Ingen aktive diskusjoner for øyeblikket.
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button mode="outlined" onPress={() => {}}>
              Start ny diskusjon
            </Button>
          </Card.Actions>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Populære emner
            </Text>
            <View style={styles.topicRow}>
              <Text variant="bodyMedium">• Transport og infrastruktur</Text>
            </View>
            <View style={styles.topicRow}>
              <Text variant="bodyMedium">• Miljø og klima</Text>
            </View>
            <View style={styles.topicRow}>
              <Text variant="bodyMedium">• Utdanning og skoler</Text>
            </View>
            <View style={styles.topicRow}>
              <Text variant="bodyMedium">• Byutvikling og boliger</Text>
            </View>
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
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  title: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  description: {
    marginTop: 8,
    color: '#666',
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: '600',
  },
  emptyText: {
    color: '#999',
    fontStyle: 'italic',
  },
  topicRow: {
    marginBottom: 8,
  },
});

export default CommunityScreen;

