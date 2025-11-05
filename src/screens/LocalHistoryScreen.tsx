import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { theme } from '../constants/theme';

const LocalHistoryScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.title}>
              Lokalhistorie
            </Text>
            <Text variant="bodyMedium" style={styles.description}>
              Se tilbake på tidligere avstemninger og resultater i ditt område.
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Dine avstemninger
            </Text>
            <Text variant="bodyMedium" style={styles.emptyText}>
              Ingen avstemninger enda. Stem på en avstemning for å se den her.
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Nylige resultater
            </Text>
            <Text variant="bodyMedium" style={styles.emptyText}>
              Ingen resultater tilgjengelig for øyeblikket.
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
});

export default LocalHistoryScreen;

