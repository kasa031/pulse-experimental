import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Button, Avatar, TextInput, HelperText, Chip, ActivityIndicator, Switch, List, Snackbar } from 'react-native-paper';
import { auth } from '../services/firebase';
import { signOut, updateProfile } from 'firebase/auth';
import { theme, osloBranding } from '../constants/theme';
import { getUserProfile, updateUserProfile, createOrUpdateUserProfile, UserProfile, getUserVoteCount, getUserCommentCount, getUserDiscussionCount } from '../services/userService';
import { OSLO_DISTRICTS } from '../constants/osloDistricts';
import { isUserAdmin } from '../utils/adminCheck';
import { safeError, safeLog } from '../utils/performance';
import { analytics } from '../utils/analytics';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useResponsive, getResponsivePadding } from '../utils/useResponsive';
import { SPACING } from '../constants/spacing';
import { BUTTON_MIN_HEIGHT, CHIP_MIN_HEIGHT } from '../constants/touchTargets';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const { isMobile, isTablet, isDesktop, width } = useResponsive();
  const padding = getResponsivePadding(width);
  const user = auth?.currentUser;
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [district, setDistrict] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [voteCount, setVoteCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [discussionCount, setDiscussionCount] = useState(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    loadProfile();
    // Track page view
    analytics.trackPageView('profile_screen');
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

      // Hent statistikker
      const [votes, comments, discussions] = await Promise.all([
        getUserVoteCount(user.uid),
        getUserCommentCount(user.uid),
        getUserDiscussionCount(user.uid),
      ]);
      setVoteCount(votes);
      setCommentCount(comments);
      setDiscussionCount(discussions);

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
      if (!auth) {
        return;
      }
      
      // Fjern "Husk meg" data ved logout
      try {
        await AsyncStorage.removeItem('@pulse_oslo_remember_me');
        await AsyncStorage.removeItem('@pulse_oslo_remembered_email');
      } catch (storageError) {
        safeError('Feil ved fjerning av lagret data:', storageError);
        // Fortsett med logout selv om dette feiler
      }
      
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
    <View style={styles.container}>
    <ScrollView 
      contentContainerStyle={[
        styles.content,
        { padding },
        isTablet && styles.contentTablet,
        isMobile && styles.contentMobile,
        isDesktop && styles.contentDesktop
      ]}
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
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Icon name="vote" size={24} color={osloBranding.colors.primary} />
              <Text variant="headlineSmall" style={styles.statValue}>
                {voteCount}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Avstemninger
              </Text>
            </View>
            <View style={styles.statCard}>
              <Icon name="comment" size={24} color={osloBranding.colors.primary} />
              <Text variant="headlineSmall" style={styles.statValue}>
                {commentCount}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Kommentarer
              </Text>
            </View>
            <View style={styles.statCard}>
              <Icon name="forum" size={24} color={osloBranding.colors.primary} />
              <Text variant="headlineSmall" style={styles.statValue}>
                {discussionCount}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Diskusjoner
              </Text>
            </View>
          </View>
          {isAdmin && (
            <View style={styles.adminStatRow}>
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

      {/* Settings Card */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.settingsHeader}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Innstillinger
            </Text>
            <Button
              mode="text"
              icon={showSettings ? "chevron-up" : "chevron-down"}
              onPress={() => setShowSettings(!showSettings)}
              compact
            >
              {showSettings ? 'Skjul' : 'Vis'}
            </Button>
          </View>
          {showSettings && (
            <>
              <List.Item
                title="Push-varsler"
                description="Motta varsler om nye avstemninger og viktige nyheter"
                left={(props) => <List.Icon {...props} icon="bell" />}
                right={() => (
                  <Switch
                    value={notificationsEnabled}
                    onValueChange={setNotificationsEnabled}
                  />
                )}
              />
              <List.Item
                title="E-post-varsler"
                description="Motta viktige oppdateringer på e-post"
                left={(props) => <List.Icon {...props} icon="email" />}
                right={() => (
                  <Switch
                    value={emailNotifications}
                    onValueChange={setEmailNotifications}
                    disabled={!notificationsEnabled}
                  />
                )}
              />
              <List.Item
                title="Privatliv"
                description="Administrer dine privatinnstillinger"
                left={(props) => <List.Icon {...props} icon="shield" />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => {
                  // Privatlivsinnstillinger kan implementeres senere
                  // For nå viser vi en melding
                  setSnackbarMessage('Privatlivsinnstillinger kommer snart!');
                  setSnackbarVisible(true);
                }}
              />
            </>
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
    <Snackbar
      visible={snackbarVisible}
      onDismiss={() => setSnackbarVisible(false)}
      duration={3000}
    >
      {snackbarMessage}
    </Snackbar>
  </View>
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
  loadingText: {
    marginTop: 16,
    color: osloBranding.colors.textSecondary,
  },
  card: {
    marginBottom: SPACING.cardMargin.mobile,
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
    marginTop: SPACING.md,
    minHeight: BUTTON_MIN_HEIGHT,
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
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
    minHeight: CHIP_MIN_HEIGHT,
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    marginRight: SPACING.sm,
    minHeight: BUTTON_MIN_HEIGHT,
  },
  saveButton: {
    flex: 1,
    marginLeft: SPACING.sm,
    minHeight: BUTTON_MIN_HEIGHT,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: '600',
    color: osloBranding.colors.primary,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 16,
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 8,
  },
  adminStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: osloBranding.colors.border || '#E0E0E0',
  },
  statLabel: {
    flex: 1,
    marginLeft: 8,
    textAlign: 'center',
    color: osloBranding.colors.textSecondary,
    marginTop: 4,
  },
  statValue: {
    fontWeight: 'bold',
    color: osloBranding.colors.primary,
    marginTop: 8,
  },
  logoutButton: {
    marginTop: SPACING.md,
    marginBottom: SPACING.xl,
    minHeight: BUTTON_MIN_HEIGHT,
  },
  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
});

export default ProfileScreen;

