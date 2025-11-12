import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Image } from 'react-native';
import { Card, Text, Button, Chip, ActivityIndicator, Dialog, Portal, TextInput, Menu, Divider } from 'react-native-paper';
import { SkeletonLoader, SkeletonCard } from '../components/SkeletonLoader';
import { theme, osloBranding } from '../constants/theme';
import { getDiscussions, createDiscussion, Discussion, getComments, addComment, likeComment, dislikeComment, Comment } from '../services/discussionService';
import { auth } from '../services/firebase';
import { POLL_CATEGORIES, getCategoryColor } from '../constants/osloDistricts';
import { safeError, safeLog } from '../utils/performance';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Timestamp } from 'firebase/firestore';
import { formatRelativeTime, toTimestamp } from '../utils/dateHelpers';
import { useResponsive, getResponsivePadding } from '../utils/useResponsive';
import { SPACING } from '../constants/spacing';
import { BUTTON_MIN_HEIGHT, CHIP_MIN_HEIGHT } from '../constants/touchTargets';

const CATEGORIES = POLL_CATEGORIES;

// Use formatRelativeTime from dateHelpers
const formatDate = formatRelativeTime;

const CommunityScreen = () => {
  const { isMobile, isTablet, isDesktop, width } = useResponsive();
  const padding = getResponsivePadding(width);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('generelt');
  const [creating, setCreating] = useState(false);
  const [selectedDiscussion, setSelectedDiscussion] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [likingComments, setLikingComments] = useState<Record<string, boolean>>({});
  const [loadingComments, setLoadingComments] = useState(false);
  const [showCommentsDialog, setShowCommentsDialog] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'mostComments' | 'oldest'>('newest');
  const [sortMenuVisible, setSortMenuVisible] = useState(false);

  useEffect(() => {
    loadDiscussions();
  }, [selectedCategory]);

  const loadDiscussions = useCallback(async () => {
    try {
      setLoading(true);
      const discussionsList = await getDiscussions();
      
      // Filter by category if selected
      const filtered = selectedCategory
        ? discussionsList.filter(d => d.category === selectedCategory)
        : discussionsList;
      
      setDiscussions(filtered);
    } catch (error) {
      safeError('Error fetching discussions:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedCategory]);

  // Sorted discussions
  const sortedDiscussions = useMemo(() => {
    const sorted = [...discussions].sort((a, b) => {
      if (sortBy === 'newest') {
        const aDate = toTimestamp(a.createdAt);
        const bDate = toTimestamp(b.createdAt);
        return bDate - aDate;
      } else if (sortBy === 'oldest') {
        const aDate = toTimestamp(a.createdAt);
        const bDate = toTimestamp(b.createdAt);
        return aDate - bDate;
      } else if (sortBy === 'mostComments') {
        return (b.commentCount || 0) - (a.commentCount || 0);
      }
      return 0;
    });
    return sorted;
  }, [discussions, sortBy]);

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
      safeLog('Discussion created');
    } catch (error) {
      safeError('Error creating discussion:', error);
    } finally {
      setCreating(false);
    }
  };

  const handleOpenComments = async (discussionId: string) => {
    setSelectedDiscussion(discussionId);
    setShowCommentsDialog(true);
    setLoadingComments(true);
    try {
      const commentsList = await getComments(discussionId);
      setComments(commentsList);
    } catch (error) {
      safeError('Error fetching comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedDiscussion) {
      return;
    }

    try {
      setSubmittingComment(true);
      await addComment(selectedDiscussion, newComment);
      setNewComment('');
      // Reload comments
      const commentsList = await getComments(selectedDiscussion);
      setComments(commentsList);
      // Update discussions to update commentCount
      await loadDiscussions();
    } catch (error) {
      safeError('Error adding comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const isAuthenticated = !!auth?.currentUser;

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
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View>
        {/* Header Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.title}>
              Community
            </Text>
            <Text variant="bodyMedium" style={styles.description}>
              Discuss with other residents of Oslo and share your opinions on local issues.
            </Text>
          </Card.Content>
        </Card>

        {/* Sort and Filter Section */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.sortFilterRow}>
              <Text variant="bodySmall" style={styles.filterLabel}>
                Sort:
              </Text>
              <Menu
                visible={sortMenuVisible}
                onDismiss={() => setSortMenuVisible(false)}
                anchor={
                  <Button
                    mode="outlined"
                    icon="sort"
                    onPress={() => setSortMenuVisible(true)}
                    style={styles.sortButton}
                    compact
                  >
                    {sortBy === 'newest' ? 'Newest' : sortBy === 'mostComments' ? 'Most comments' : 'Oldest'}
                  </Button>
                }
              >
                <Menu.Item
                  onPress={() => {
                    setSortBy('newest');
                    setSortMenuVisible(false);
                  }}
                  title="Newest"
                  leadingIcon={sortBy === 'newest' ? 'check' : undefined}
                />
                <Menu.Item
                  onPress={() => {
                    setSortBy('mostComments');
                    setSortMenuVisible(false);
                  }}
                  title="Most comments"
                  leadingIcon={sortBy === 'mostComments' ? 'check' : undefined}
                />
                <Menu.Item
                  onPress={() => {
                    setSortBy('oldest');
                    setSortMenuVisible(false);
                  }}
                  title="Oldest"
                  leadingIcon={sortBy === 'oldest' ? 'check' : undefined}
                />
              </Menu>
            </View>
            <Divider style={styles.divider} />
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Filter by category
            </Text>
            <View style={styles.chipContainer}>
              <Chip
                selected={selectedCategory === null}
                onPress={() => setSelectedCategory(null)}
                style={styles.chip}
                textStyle={styles.chipText}
              >
                All
              </Chip>
              {CATEGORIES.map((cat) => {
                const categoryColor = getCategoryColor(cat as any);
                return (
                  <Chip
                    key={cat}
                    selected={selectedCategory === cat}
                    onPress={() => setSelectedCategory(cat)}
                    style={[
                      styles.chip,
                      selectedCategory === cat && { backgroundColor: categoryColor + '20' }
                    ]}
                    textStyle={[
                      styles.chipText,
                      selectedCategory === cat && { color: categoryColor }
                    ]}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Chip>
                );
              })}
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
                Start new discussion
              </Button>
            </Card.Actions>
          </Card>
        )}

        {/* Discussions List */}
        {loading && !refreshing ? (
          <View style={styles.skeletonContainer}>
            {[1, 2, 3, 4].map((i) => (
              <SkeletonCard key={i} lines={3} showImage={false} />
            ))}
          </View>
        ) : sortedDiscussions.length === 0 ? (
          <Card style={styles.card}>
            <Card.Content style={styles.emptyCardContent}>
              <Image 
                source={require('../../assets/oslo-logo.png')} 
                  style={styles.emptyImage}
                  resizeMode="contain"
              />
              <Text variant="bodyMedium" style={styles.emptyText}>
                No discussions at the moment. 
                {isAuthenticated && ' Start the first discussion!'}
              </Text>
            </Card.Content>
          </Card>
        ) : (
          sortedDiscussions.map((discussion) => (
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
                  <Chip
                    style={[
                      styles.categoryChip,
                      { backgroundColor: getCategoryColor(discussion.category as any) + '20' }
                    ]}
                    textStyle={[
                      styles.categoryChipText,
                      { color: getCategoryColor(discussion.category as any) }
                    ]}
                    compact
                  >
                    {discussion.category}
                  </Chip>
                </View>
                <Text variant="bodyMedium" style={styles.discussionContent} numberOfLines={3}>
                  {discussion.content}
                </Text>
                <View style={styles.discussionFooter}>
                  <Button
                    mode="text"
                    icon="comment-outline"
                    onPress={() => handleOpenComments(discussion.id)}
                    style={styles.commentButton}
                    textColor={osloBranding.colors.primary}
                  >
                    {discussion.commentCount} {discussion.commentCount === 1 ? 'comment' : 'comments'}
                  </Button>
                </View>
              </Card.Content>
            </Card>
          ))
        )}
      </View>

      {/* Create Discussion Dialog */}
      <Portal>
        <Dialog visible={showCreateDialog} onDismiss={() => setShowCreateDialog(false)}>
          <Dialog.Title>Start new discussion</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Title"
              value={newTitle}
              onChangeText={setNewTitle}
              mode="outlined"
              style={styles.dialogInput}
              maxLength={200}
            />
            <TextInput
              label="Content"
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
            <Button onPress={() => setShowCreateDialog(false)}>Cancel</Button>
            <Button
              mode="contained"
              onPress={handleCreateDiscussion}
              loading={creating}
              disabled={!newTitle.trim() || !newContent.trim() || creating}
            >
              Create
            </Button>
          </Dialog.Actions>
        </Dialog>

        {/* Comments Dialog */}
        <Dialog 
          visible={showCommentsDialog} 
          onDismiss={() => {
            setShowCommentsDialog(false);
            setSelectedDiscussion(null);
            setComments([]);
            setNewComment('');
          }}
          style={styles.commentsDialog}
        >
          <Dialog.Title>Comments</Dialog.Title>
          <Dialog.ScrollArea style={styles.commentsScrollArea}>
            <ScrollView>
              {loadingComments ? (
                <ActivityIndicator style={styles.loader} />
              ) : comments.length === 0 ? (
                <Text variant="bodyMedium" style={styles.emptyText}>
                  No comments yet. Be the first!
                </Text>
              ) : (
                comments.map((comment) => {
                  const user = auth?.currentUser;
                  const isLiked = user && comment.likedBy?.includes(user.uid);
                  const isDisliked = user && comment.dislikedBy?.includes(user.uid);
                  const isLiking = likingComments[comment.id] || false;

                  return (
                    <Card key={comment.id} style={styles.commentCard}>
                      <Card.Content>
                        <View style={styles.commentHeader}>
                          <View style={styles.commentHeaderLeft}>
                            <Text variant="titleSmall" style={styles.commentAuthor}>
                              {comment.authorName || 'Anonym'}
                            </Text>
                            <Text variant="bodySmall" style={styles.commentDate}>
                              {formatDate(comment.createdAt)}
                            </Text>
                          </View>
                        </View>
                        <Text variant="bodyMedium" style={styles.commentContent}>
                          {comment.content}
                        </Text>
                        {isAuthenticated && (
                          <View style={styles.commentActions}>
                            <Button
                              mode="text"
                              icon={isLiked ? "thumb-up" : "thumb-up-outline"}
                              onPress={async () => {
                                if (!selectedDiscussion || isLiking) return;
                                setLikingComments(prev => ({ ...prev, [comment.id]: true }));
                                try {
                                  await likeComment(selectedDiscussion, comment.id);
                                  // Update comments
                                  const updatedComments = await getComments(selectedDiscussion);
                                  setComments(updatedComments);
                                } catch (error) {
                                  safeError('Error liking comment:', error);
                                } finally {
                                  setLikingComments(prev => ({ ...prev, [comment.id]: false }));
                                }
                              }}
                              textColor={isLiked ? osloBranding.colors.primary : osloBranding.colors.textSecondary}
                              compact
                              disabled={isLiking}
                            >
                              {comment.likes || 0}
                            </Button>
                            <Button
                              mode="text"
                              icon={isDisliked ? "thumb-down" : "thumb-down-outline"}
                              onPress={async () => {
                                if (!selectedDiscussion || isLiking) return;
                                setLikingComments(prev => ({ ...prev, [comment.id]: true }));
                                try {
                                  await dislikeComment(selectedDiscussion, comment.id);
                                  // Update comments
                                  const updatedComments = await getComments(selectedDiscussion);
                                  setComments(updatedComments);
                                } catch (error) {
                                  safeError('Error disliking comment:', error);
                                } finally {
                                  setLikingComments(prev => ({ ...prev, [comment.id]: false }));
                                }
                              }}
                              textColor={isDisliked ? osloBranding.colors.secondary : osloBranding.colors.textSecondary}
                              compact
                              disabled={isLiking}
                            >
                              {comment.dislikes || 0}
                            </Button>
                          </View>
                        )}
                      </Card.Content>
                    </Card>
                  );
                })
              )}
            </ScrollView>
          </Dialog.ScrollArea>
          {isAuthenticated && (
            <Dialog.Content>
              <TextInput
                label="Write a comment..."
                value={newComment}
                onChangeText={setNewComment}
                mode="outlined"
                multiline
                numberOfLines={3}
                style={styles.commentInput}
                maxLength={1000}
              />
            </Dialog.Content>
          )}
          <Dialog.Actions>
            <Button onPress={() => {
              setShowCommentsDialog(false);
              setSelectedDiscussion(null);
              setComments([]);
              setNewComment('');
            }}>
              Close
            </Button>
            {isAuthenticated && (
              <Button
                mode="contained"
                onPress={handleAddComment}
                loading={submittingComment}
                disabled={!newComment.trim() || submittingComment}
              >
                Add
              </Button>
            )}
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
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
    minHeight: CHIP_MIN_HEIGHT,
  },
  chipText: {
    fontSize: 12,
  },
  createButton: {
    marginTop: SPACING.sm,
    minHeight: BUTTON_MIN_HEIGHT,
  },
  loader: {
    marginVertical: 32,
  },
  skeletonContainer: {
    gap: 16,
  },
  emptyCardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xl,
  },
  emptyImage: {
    width: 120,
    height: 120,
    opacity: 0.3,
    marginBottom: SPACING.lg,
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
    borderTopColor: osloBranding.colors.border || '#E0E0E0',
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
  commentButton: {
    marginTop: 0,
    minHeight: BUTTON_MIN_HEIGHT,
  },
  commentsDialog: {
    maxHeight: '80%',
  },
  commentsScrollArea: {
    maxHeight: 400,
    paddingHorizontal: 0,
  },
  commentCard: {
    marginBottom: 8,
    elevation: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  commentHeaderLeft: {
    flex: 1,
  },
  commentActions: {
    flexDirection: 'row',
    marginTop: SPACING.sm,
    gap: SPACING.xs,
  },
  commentAuthor: {
    fontWeight: '600',
    color: osloBranding.colors.primary,
  },
  commentDate: {
    color: osloBranding.colors.textSecondary,
  },
  commentContent: {
    color: osloBranding.colors.text,
    lineHeight: 20,
  },
  commentInput: {
    marginTop: 8,
  },
  sortFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  filterLabel: {
    marginRight: SPACING.sm,
    color: osloBranding.colors.textSecondary,
  },
  sortButton: {
    minHeight: BUTTON_MIN_HEIGHT,
  },
  divider: {
    marginVertical: SPACING.md,
  },
});

export default CommunityScreen;

