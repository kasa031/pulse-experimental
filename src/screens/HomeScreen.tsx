import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import { theme } from '../constants/theme';

const HomeScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.title}>
              Velkommen til Pulse Oslo
            </Text>
            <Text variant="bodyMedium" style={styles.description}>
              Din stemme betyr noe! Delta i lokale avstemninger og påvirk utviklingen av Oslo.
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button mode="contained" onPress={() => {}}>
              Se aktive avstemninger
            </Button>
          </Card.Actions>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Aktive avstemninger
            </Text>
            <Text variant="bodyMedium" style={styles.emptyText}>
              Ingen aktive avstemninger for øyeblikket.
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Nyheter fra Oslo
            </Text>
            <Text variant="bodyMedium" style={styles.emptyText}>
              Nyhetsfeed kommer snart.
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
    marginBottom: 8,
    fontWeight: '600',
  },
  emptyText: {
    color: '#999',
    fontStyle: 'italic',
  },
});

export default HomeScreen;

