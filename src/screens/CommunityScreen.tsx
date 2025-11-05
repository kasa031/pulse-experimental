import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card, Text, Button, Chip, ActivityIndicator, Dialog, Portal, TextInput } from 'react-native-paper';
import { theme, osloBranding } from '../constants/theme';
import { getDiscussions, createDiscussion, Discussion } from '../services/discussionService';
import { auth } from '../services/firebase';
import { OSLO_DISTRICTS } from '../constants/osloDistricts';
import { POLL_CATEGORIES } from '../constants/osloDistricts';
import { safeError, safeLog } from '../utils/performance';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Timestamp } from 'firebase/firestore';

const CATEGORIES = POLL_CATEGORIES || ['generelt', 'transport', 'miljø', 'byutvikling', 'politikk'];

const formatDate = (date: Date | Timestamp | any): string => {
  try {
    let dateObj: Date;
    if (date instanceof Date) {
      dateObj = date;
    } else if (date?.toDate) {
      dateObj = date.toDate();
    } else {
      return 'Ukjent dato';
    }
    
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Nettopp';
    if (diffMins < 60) return `${diffMins} min siden`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'time' : 'timer'} siden`;
    if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'dag' : 'dager'} siden`;
    
    return dateObj.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' });
  } catch {
    return 'Ukjent dato';
  }
};

const CommunityScreen = () => {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('generelt');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadDiscussions();
  }, [selectedCategory]);

  const loadDiscussions = useCallback(async () => {
    try {
      setLoading(true);
      const discussionsList = selectedCategory
        ? await getDiscussions()
        : await getDiscussions();
      
      // Filtrer etter kategori hvis valgt
      const filtered = selectedCategory
        ? discussionsList.filter(d => d.category === selectedCategory)
        : discussionsList;
      
      setDiscussions(filtered);
    } catch (error) {
      safeError('Feil ved henting av diskusjoner:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedCategory]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadDiscussions();
  }, [loadDiscussions]);

  const handleCreateDiscussion = async () => {
    if (!newTitle.trim() || !newContent.trim()) {
      return;
    }

    try {
      setCreating(true);
      await createDiscussion(newTitle, newContent, newCategory);
      setShowCreateDialog(false);
      setNewTitle('');
      setNewContent('');
      setNewCategory('generelt');
      await loadDiscussions();
      safeLog('Diskusjon opprettet');
    } catch (error) {
      safeError('Feil ved opprettelse av diskusjon:', error);
    } finally {
      setCreating(false);
    }
  };

  const isAuthenticated = !!auth.currentUser;

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={styles.content}>
        {/* Header Card */}
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

        {/* Category Filter */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Filtrer etter kategori
            </Text>
            <View style={styles.chipContainer}>
              <Chip
                selected={selectedCategory === null}
                onPress={() => setSelectedCategory(null)}
                style={styles.chip}
                textStyle={styles.chipText}
              >
                Alle
              </Chip>
              {CATEGORIES.map((cat) => (
                <Chip
                  key={cat}
                  selected={selectedCategory === cat}
                  onPress={() => setSelectedCategory(cat)}
                  style={styles.chip}
                  textStyle={styles.chipText}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Create Discussion Button */}
        {isAuthenticated && (
          <Card style={styles.card}>
            <Card.Actions>
              <Button
                mode="contained"
                icon="plus"
                onPress={() => setShowCreateDialog(true)}
                style={styles.createButton}
              >
                Start ny diskusjon
              </Button>
            </Card.Actions>
          </Card>
        )}

        {/* Discussions List */}
        {loading && !refreshing ? (
          <ActivityIndicator style={styles.loader} />
        ) : discussions.length === 0 ? (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="bodyMedium" style={styles.emptyText}>
                Ingen diskusjoner for øyeblikket. 
                {isAuthenticated && ' Start den første diskusjonen!'}
              </Text>
            </Card.Content>
          </Card>
        ) : (
          discussions.map((discussion) => (
            <Card key={discussion.id} style={styles.discussionCard}>
              <Card.Content>
                <View style={styles.discussionHeader}>
                  <View style={styles.discussionHeaderLeft}>
                    <Text variant="titleMedium" style={styles.discussionTitle}>
                      {discussion.title}
                    </Text>
                    <View style={styles.discussionMeta}>
                      <Text variant="bodySmall" style={styles.metaText}>
                        {discussion.authorName}
                      </Text>
                      <Text variant="bodySmall" style={styles.metaText}>
                        • {formatDate(discussion.createdAt)}
                      </Text>
                      {discussion.district && (
                        <Text variant="bodySmall" style={styles.metaText}>
                          • {discussion.district}
                        </Text>
                      )}
                    </View>
                  </View>
                  <Chip style={styles.categoryChip} textStyle={styles.categoryChipText}>
                    {discussion.category}
                  </Chip>
                </View>
                <Text variant="bodyMedium" style={styles.discussionContent} numberOfLines={3}>
                  {discussion.content}
                </Text>
                <View style={styles.discussionFooter}>
                  <View style={styles.footerItem}>
                    <Icon name="comment-outline" size={16} color={osloBranding.colors.textSecondary} />
                    <Text variant="bodySmall" style={styles.footerText}>
                      {discussion.commentCount}
                    </Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          ))
        )}
      </View>

      {/* Create Discussion Dialog */}
      <Portal>
        <Dialog visible={showCreateDialog} onDismiss={() => setShowCreateDialog(false)}>
          <Dialog.Title>Start ny diskusjon</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Tittel"
              value={newTitle}
              onChangeText={setNewTitle}
              mode="outlined"
              style={styles.dialogInput}
              maxLength={200}
            />
            <TextInput
              label="Innhold"
              value={newContent}
              onChangeText={setNewContent}
              mode="outlined"
              multiline
              numberOfLines={4}
              style={styles.dialogInput}
              maxLength={2000}
            />
            <View style={styles.chipContainer}>
              {CATEGORIES.map((cat) => (
                <Chip
                  key={cat}
                  selected={newCategory === cat}
                  onPress={() => setNewCategory(cat)}
                  style={styles.chip}
                  textStyle={styles.chipText}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </Chip>
              ))}
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowCreateDialog(false)}>Avbryt</Button>
            <Button
              mode="contained"
              onPress={handleCreateDiscussion}
              loading={creating}
              disabled={!newTitle.trim() || !newContent.trim() || creating}
            >
              Opprett
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
    color: osloBranding.colors.primary,
  },
  description: {
    marginTop: 8,
    color: osloBranding.colors.textSecondary,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: '600',
    color: osloBranding.colors.primary,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    fontSize: 12,
  },
  createButton: {
    marginTop: 8,
  },
  loader: {
    marginVertical: 32,
  },
  emptyText: {
    color: osloBranding.colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 16,
  },
  discussionCard: {
    marginBottom: 12,
    elevation: 2,
  },
  discussionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  discussionHeaderLeft: {
    flex: 1,
    marginRight: 8,
  },
  discussionTitle: {
    fontWeight: '600',
    color: osloBranding.colors.primary,
    marginBottom: 4,
  },
  discussionMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  metaText: {
    color: osloBranding.colors.textSecondary,
    marginRight: 8,
  },
  categoryChip: {
    backgroundColor: osloBranding.colors.primary + '15',
  },
  categoryChipText: {
    color: osloBranding.colors.primary,
    fontSize: 10,
  },
  discussionContent: {
    color: osloBranding.colors.text,
    marginBottom: 12,
    lineHeight: 20,
  },
  discussionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border || '#E0E0E0',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  footerText: {
    marginLeft: 4,
    color: osloBranding.colors.textSecondary,
  },
  dialogInput: {
    marginBottom: 12,
  },
});

export default CommunityScreen;

