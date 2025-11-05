import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { Card, Text, Button, Avatar, TextInput, HelperText, Chip, ActivityIndicator } from 'react-native-paper';
import { auth } from '../services/firebase';
import { signOut, updateProfile } from 'firebase/auth';
import { theme, osloBranding } from '../constants/theme';
import { getUserProfile, updateUserProfile, createOrUpdateUserProfile, UserProfile } from '../services/userService';
import { getUserVoteCount } from '../services/userService';
import { OSLO_DISTRICTS } from '../constants/osloDistricts';
import { isUserAdmin } from '../utils/adminCheck';
import { safeError, safeLog } from '../utils/performance';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ProfileScreen = () => {
  const user = auth.currentUser;
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [district, setDistrict] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [voteCount, setVoteCount] = useState(0);
  const { width } = useWindowDimensions();
  const isTablet = width > 768;

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Hent profil fra Firestore
      const userProfile = await getUserProfile(user.uid);
      
      if (userProfile) {
        setProfile(userProfile);
        setDisplayName(userProfile.displayName || '');
        setDistrict(userProfile.district || '');
      } else {
        // Opprett profil hvis den ikke eksisterer
        await createOrUpdateUserProfile({
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || null,
          photoURL: user.photoURL || null,
        });
        setDisplayName(user.displayName || '');
        setDistrict('');
      }

      // Hent stemmetall
      const votes = await getUserVoteCount(user.uid);
      setVoteCount(votes);

      // Sjekk admin-status
      const admin = await isUserAdmin();
      setIsAdmin(admin);
    } catch (error) {
      safeError('Feil ved lasting av profil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);

      // Oppdater Firebase Auth displayName
      if (displayName !== user.displayName) {
        await updateProfile(user, { displayName: displayName.trim() || null });
      }

      // Oppdater Firestore profil
      await updateUserProfile(user.uid, {
        displayName: displayName.trim() || undefined,
        district: district || undefined,
      });

      // Oppdater lokal state
      setProfile({
        ...profile!,
        displayName: displayName.trim() || undefined,
        district: district || undefined,
      });

      setIsEditing(false);
      safeLog('Profil oppdatert');
    } catch (error) {
      safeError('Feil ved oppdatering av profil:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      safeError('Logout feil:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Laster profil...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={[styles.content, isTablet && styles.contentTablet]}
    >
      <Card style={styles.card}>
        <Card.Content style={styles.profileContent}>
          <Avatar.Text 
            size={80} 
            label={(profile?.displayName || user?.email || 'U').charAt(0).toUpperCase()} 
            style={styles.avatar}
          />
          {isEditing ? (
            <View style={styles.editForm}>
              <TextInput
                label="Visningsnavn"
                value={displayName}
                onChangeText={setDisplayName}
                mode="outlined"
                style={styles.editInput}
              />
              <View style={styles.districtSection}>
                <Text variant="bodySmall" style={styles.districtLabel}>
                  Bydel
                </Text>
                <View style={styles.chipContainer}>
                  {OSLO_DISTRICTS.slice(0, 8).map((dist) => (
                    <Chip
                      key={dist}
                      selected={district === dist}
                      onPress={() => setDistrict(dist)}
                      style={styles.chip}
                    >
                      {dist}
                    </Chip>
                  ))}
                </View>
              </View>
              <View style={styles.editButtons}>
                <Button
                  mode="outlined"
                  onPress={() => {
                    setIsEditing(false);
                    setDisplayName(profile?.displayName || '');
                    setDistrict(profile?.district || '');
                  }}
                  style={styles.cancelButton}
                >
                  Avbryt
                </Button>
                <Button
                  mode="contained"
                  onPress={handleSave}
                  loading={saving}
                  disabled={saving}
                  style={styles.saveButton}
                >
                  Lagre
                </Button>
              </View>
            </View>
          ) : (
            <>
              <Text variant="headlineSmall" style={styles.name}>
                {profile?.displayName || user?.displayName || 'Bruker'}
              </Text>
              <Text variant="bodyMedium" style={styles.email}>
                {user?.email}
              </Text>
              {profile?.district && (
                <View style={styles.districtBadge}>
                  <Icon name="map-marker" size={16} color={osloBranding.colors.primary} />
                  <Text variant="bodySmall" style={styles.districtText}>
                    {profile.district}
                  </Text>
                </View>
              )}
              {isAdmin && (
                <View style={styles.adminBadge}>
                  <Icon name="shield" size={16} color={osloBranding.colors.secondary} />
                  <Text variant="bodySmall" style={styles.adminText}>
                    Administrator
                  </Text>
                </View>
              )}
              <Button
                mode="outlined"
                onPress={() => setIsEditing(true)}
                style={styles.editButton}
                icon="pencil"
              >
                Rediger profil
              </Button>
            </>
          )}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Statistikker
          </Text>
          <View style={styles.statRow}>
            <Icon name="vote" size={20} color={osloBranding.colors.primary} />
            <Text variant="bodyMedium" style={styles.statLabel}>
              Avstemninger deltatt:
            </Text>
            <Text variant="bodyMedium" style={styles.statValue}>
              {voteCount}
            </Text>
          </View>
          {isAdmin && (
            <View style={styles.statRow}>
              <Icon name="file-document" size={20} color={osloBranding.colors.secondary} />
              <Text variant="bodyMedium" style={styles.statLabel}>
                Avstemninger opprettet:
              </Text>
              <Text variant="bodyMedium" style={styles.statValue}>
                {profile?.stats?.pollsCreated || 0}
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={handleLogout}
        style={styles.logoutButton}
        buttonColor="#d32f2f"
        icon="logout"
      >
        Logg ut
      </Button>
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: osloBranding.colors.textSecondary,
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
    color: osloBranding.colors.primary,
  },
  email: {
    color: osloBranding.colors.textSecondary,
    marginBottom: 8,
  },
  districtBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: osloBranding.colors.primary + '15',
    borderRadius: 16,
  },
  districtText: {
    marginLeft: 4,
    color: osloBranding.colors.primary,
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: osloBranding.colors.secondary + '15',
    borderRadius: 16,
  },
  adminText: {
    marginLeft: 4,
    color: osloBranding.colors.secondary,
    fontWeight: '600',
  },
  editButton: {
    marginTop: 16,
  },
  editForm: {
    width: '100%',
    marginTop: 16,
  },
  editInput: {
    marginBottom: 16,
  },
  districtSection: {
    marginBottom: 16,
  },
  districtLabel: {
    marginBottom: 8,
    color: osloBranding.colors.textSecondary,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  saveButton: {
    flex: 1,
    marginLeft: 8,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: '600',
    color: osloBranding.colors.primary,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 8,
  },
  statLabel: {
    flex: 1,
    marginLeft: 8,
  },
  statValue: {
    fontWeight: 'bold',
    color: osloBranding.colors.primary,
  },
  logoutButton: {
    marginTop: 16,
    marginBottom: 32,
  },
});

export default ProfileScreen;

