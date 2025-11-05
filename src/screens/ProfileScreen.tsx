import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Button, Avatar } from 'react-native-paper';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';
import { theme } from '../constants/theme';

const ProfileScreen = () => {
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout feil:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content style={styles.profileContent}>
            <Avatar.Text 
              size={80} 
              label={user?.email?.charAt(0).toUpperCase() || 'U'} 
              style={styles.avatar}
            />
            <Text variant="headlineSmall" style={styles.name}>
              {user?.displayName || 'Bruker'}
            </Text>
            <Text variant="bodyMedium" style={styles.email}>
              {user?.email}
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Statistikker
            </Text>
            <View style={styles.statRow}>
              <Text variant="bodyMedium">Avstemninger deltatt:</Text>
              <Text variant="bodyMedium" style={styles.statValue}>0</Text>
            </View>
            <View style={styles.statRow}>
              <Text variant="bodyMedium">Kommentarer:</Text>
              <Text variant="bodyMedium" style={styles.statValue}>0</Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Innstillinger
            </Text>
            <Button
              mode="outlined"
              onPress={() => {}}
              style={styles.settingButton}
            >
              Notifikasjoner
            </Button>
            <Button
              mode="outlined"
              onPress={() => {}}
              style={styles.settingButton}
            >
              Personvern
            </Button>
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={handleLogout}
          style={styles.logoutButton}
          buttonColor="#d32f2f"
        >
          Logg ut
        </Button>
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
  profileContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatar: {
    marginBottom: 16,
  },
  name: {
    marginBottom: 4,
    fontWeight: 'bold',
  },
  email: {
    color: '#666',
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: '600',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statValue: {
    fontWeight: 'bold',
  },
  settingButton: {
    marginBottom: 8,
  },
  logoutButton: {
    marginTop: 16,
    marginBottom: 32,
  },
});

export default ProfileScreen;

