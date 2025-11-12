import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Image } from 'react-native';
import { Card, Text, Button, RadioButton, ProgressBar, ActivityIndicator, Snackbar, Searchbar, Chip, Menu, Divider } from 'react-native-paper';
import { SkeletonLoader, SkeletonCard } from '../components/SkeletonLoader';
import { theme, osloBranding } from '../constants/theme';
import { getActivePolls, submitVote, subscribeToPolls, Poll } from '../services/pollsService';
import { auth } from '../services/firebase';
import { safeError } from '../utils/performance';
import { searchAndFilterPolls } from '../utils/search';
import { OSLO_DISTRICTS, getCategoryColor } from '../constants/osloDistricts';
import { useResponsive, getResponsivePadding } from '../utils/useResponsive';
import { SPACING } from '../constants/spacing';
import { BUTTON_MIN_HEIGHT, CHIP_MIN_HEIGHT } from '../constants/touchTargets';
import { analytics } from '../utils/analytics';
import { toTimestamp } from '../utils/dateHelpers';

const VoteScreen = React.memo(() => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [optimisticVotes, setOptimisticVotes] = useState<Record<string, Record<number, number>>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'endingSoon'>('newest');
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const { isMobile, isTablet, isDesktop, width } = useResponsive();
  const padding = getResponsivePadding(width);

  // Filtered and sorted polls
  const filteredPolls = useMemo(() => {
    let filtered = searchAndFilterPolls(polls, searchQuery, selectedCategory, selectedDistrict);
    
    // Sorting
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'newest') {
        // Sort by startDate (newest first)
        const aStart = toTimestamp(a.startDate);
        const bStart = toTimestamp(b.startDate);
        return bStart - aStart;
      } else if (sortBy === 'popular') {
        // Sort by total number of votes (most popular first)
        const aVotes = a.options.reduce((sum, opt) => sum + opt.votes, 0);
        const bVotes = b.options.reduce((sum, opt) => sum + opt.votes, 0);
        return bVotes - aVotes;
      } else if (sortBy === 'endingSoon') {
        // Sort by endDate (ending soon first)
        const aEnd = toTimestamp(a.endDate) || Infinity;
        const bEnd = toTimestamp(b.endDate) || Infinity;
        return aEnd - bEnd;
      }
      return 0;
    });
    
    return filtered;
  }, [polls, searchQuery, selectedCategory, selectedDistrict, sortBy]);

  // Unique categories from polls
  const availableCategories = useMemo(() => {
    const categories = new Set<string>();
    polls.forEach(poll => {
      if (poll.category) {
        categories.add(poll.category);
      }
    });
    return Array.from(categories).sort();
  }, [polls]);

  // Fetch polls
  const loadPolls = useCallback(async () => {
    try {
      setLoading(true);
      const activePolls = await getActivePolls();
      setPolls(activePolls);
      setError(null);
    } catch (err: unknown) {
      safeError('Error fetching polls:', err);
      setError('Could not load polls. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Real-time subscription
  useEffect(() => {
    const unsubscribe = subscribeToPolls((updatedPolls) => {
      setPolls(updatedPolls);
    });

    // Initial load
    loadPolls();
    
    // Track page view
    analytics.trackPageView('vote_screen');

    return () => unsubscribe();
  }, [loadPolls]);

  // Pull to refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadPolls();
  }, [loadPolls]);

  const handleVote = useCallback((pollId: string, optionIndex: number) => {
    setSelectedOptions(prev => ({
      ...prev,
      [pollId]: `${pollId}_${optionIndex}`,
    }));
  }, []);

  const submitVoteHandler = useCallback(async (poll: Poll, optionIndex: number) => {
    const user = auth?.currentUser;
    if (!user) {
      setError('You must be logged in to vote');
      setSnackbarVisible(true);
      return;
    }

    const pollId = poll.id;

    // Optimistic update
    setOptimisticVotes(prev => ({
      ...prev,
      [pollId]: {
        ...prev[pollId],
        [optionIndex]: (prev[pollId]?.[optionIndex] || poll.options[optionIndex].votes) + 1,
      },
    }));

    setSubmitting(prev => ({ ...prev, [pollId]: true }));

    try {
      await submitVote(pollId, optionIndex, user.uid);
      
      // Track vote in analytics
      analytics.trackPollInteraction('vote', pollId, poll.title);
      analytics.track('vote_submitted', {
        pollId,
        pollTitle: poll.title,
        optionIndex,
      });
      
      setSnackbarVisible(true);
      setSelectedOptions(prev => {
        const newState = { ...prev };
        delete newState[pollId];
        return newState;
      });
      
      // Update local state
      setPolls(prevPolls => prevPolls.map(p => {
        if (p.id === pollId) {
          const newOptions = [...p.options];
          newOptions[optionIndex] = {
            ...newOptions[optionIndex],
            votes: newOptions[optionIndex].votes + 1,
          };
          return { ...p, options: newOptions };
        }
        return p;
      }));
    } catch (err: unknown) {
      safeError('Error submitting vote:', err);
      const error = err as { message?: string };
      setError(error.message || 'Could not submit vote. Please try again.');
      setSnackbarVisible(true);
      
      // Revert optimistic update
      setOptimisticVotes(prev => {
        const newState = { ...prev };
        delete newState[pollId];
        return newState;
      });
    } finally {
      setSubmitting(prev => ({ ...prev, [pollId]: false }));
    }
  }, []);

  // Memoize poll cards for performance
  const pollCards = useMemo(() => {
    return filteredPolls.map((poll) => {
      const pollId = poll.id;
      const isSubmitting = submitting[pollId] || false;
      const optimistic = optimisticVotes[pollId];
      const totalVotes = poll.options.reduce((sum, opt) => {
        const optIndex = poll.options.indexOf(opt);
        return sum + (optimistic?.[optIndex] ?? opt.votes);
      }, 0);

      return (
        <Card key={poll.id} style={[styles.card, isTablet && styles.cardTablet]}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.pollTitle}>
              {poll.title}
            </Text>
            <Text variant="bodyMedium" style={styles.pollDescription}>
              {poll.description}
            </Text>
            <View style={styles.categoryContainer}>
              {poll.category && (
                <Chip
                  style={[styles.categoryChip, { backgroundColor: getCategoryColor(poll.category as any) + '20' }]}
                  textStyle={{ color: getCategoryColor(poll.category as any), fontSize: 11 }}
                  compact
                >
                  {poll.category}
                </Chip>
              )}
              <Text variant="bodySmall" style={styles.district}>
                {poll.district}
              </Text>
            </View>

            <RadioButton.Group
              onValueChange={(value) => {
                const [, optionIndex] = value.split('_');
                handleVote(pollId, parseInt(optionIndex));
              }}
              value={selectedOptions[pollId] || ''}
            >
              {poll.options.map((option, index) => {
                const voteCount = optimistic?.[index] ?? option.votes;
                const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;

                return (
                  <View key={index} style={styles.optionContainer}>
                    <View style={styles.optionRow}>
                      <RadioButton value={`${pollId}_${index}`} disabled={isSubmitting} />
                      <View style={styles.optionContent}>
                        <Text style={styles.optionText}>{option.text}</Text>
                        {selectedOptions[pollId] === `${pollId}_${index}` && (
                          <View style={styles.progressContainer}>
                            <ProgressBar 
                              progress={percentage / 100} 
                              color={theme.colors.primary}
                              style={styles.progressBar}
                            />
                            <Text variant="bodySmall" style={styles.voteCount}>
                              {voteCount} votes ({percentage.toFixed(1)}%)
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                );
              })}
            </RadioButton.Group>

            <Button
              mode="contained"
              onPress={() => {
                const selected = selectedOptions[pollId];
                if (selected) {
                  const [, optionIndex] = selected.split('_');
                  submitVoteHandler(poll, parseInt(optionIndex));
                }
              }}
              disabled={!selectedOptions[pollId] || isSubmitting}
              loading={isSubmitting}
              style={styles.voteButton}
            >
              {isSubmitting ? 'Submitting...' : 'Vote'}
            </Button>
          </Card.Content>
        </Card>
      );
    });
      }, [filteredPolls, selectedOptions, submitting, optimisticVotes, isTablet, handleVote, submitVoteHandler]);

  if (loading && polls.length === 0) {
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
      >
        <View style={styles.skeletonContainer}>
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} lines={4} showImage={false} />
          ))}
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={[
        styles.content, 
        { padding },
        isTablet && styles.contentTablet,
        isMobile && styles.contentMobile,
        isDesktop && styles.contentDesktop
      ]}
    >
      {/* Search Bar */}
      <Card style={styles.searchCard}>
        <Card.Content>
          <View style={styles.searchContainer}>
            <Searchbar
              placeholder="Search polls..."
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={styles.searchbar}
              icon="magnify"
            />
            {searchQuery.length > 0 && (
              <Button
                mode="text"
                icon="close"
                onPress={() => setSearchQuery('')}
                style={styles.clearSearchButton}
                compact
              >
                Reset
              </Button>
            )}
          </View>
          {searchQuery.length > 0 && (
            <Text variant="bodySmall" style={styles.searchHint}>
              Searching for: "{searchQuery}"
            </Text>
          )}
        </Card.Content>
      </Card>

      {/* Sort and Filter Section */}
      <Card style={styles.filterCard}>
        <Card.Content>
          <View style={styles.sortFilterRow}>
            <Text variant="bodySmall" style={styles.filterLabel}>
              Sorter:
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
                  {sortBy === 'newest' ? 'Newest' : sortBy === 'popular' ? 'Most popular' : 'Ending soon'}
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
                  setSortBy('popular');
                  setSortMenuVisible(false);
                }}
                title="Most popular"
                leadingIcon={sortBy === 'popular' ? 'check' : undefined}
              />
              <Menu.Item
                onPress={() => {
                  setSortBy('endingSoon');
                  setSortMenuVisible(false);
                }}
                title="Ending soon"
                leadingIcon={sortBy === 'endingSoon' ? 'check' : undefined}
              />
            </Menu>
          </View>
          {(availableCategories.length > 0 || OSLO_DISTRICTS.length > 0) && (
            <>
              <Divider style={styles.divider} />
              <Text variant="bodySmall" style={styles.filterLabel}>
                Filter by:
              </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
              {availableCategories.map((cat) => {
                const categoryColor = getCategoryColor(cat as any);
                return (
                  <Chip
                    key={`cat-${cat}`}
                    selected={selectedCategory === cat}
                    onPress={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                    style={[
                      styles.chip,
                      selectedCategory === cat && { backgroundColor: categoryColor + '20' }
                    ]}
                    selectedColor={categoryColor}
                    textStyle={selectedCategory === cat ? { color: categoryColor } : undefined}
                  >
                    {cat}
                  </Chip>
                );
              })}
              {OSLO_DISTRICTS.slice(0, 10).map((district) => (
                <Chip
                  key={`dist-${district}`}
                  selected={selectedDistrict === district}
                  onPress={() => setSelectedDistrict(selectedDistrict === district ? null : district)}
                  style={styles.chip}
                  selectedColor={osloBranding.colors.primary}
                >
                  {district}
                </Chip>
              ))}
            </ScrollView>
              {(selectedCategory || selectedDistrict) && (
                <Button
                  mode="text"
                  onPress={() => {
                    setSelectedCategory(null);
                    setSelectedDistrict(null);
                  }}
                  style={styles.clearFilterButton}
                >
                  Reset filter
                </Button>
              )}
            </>
          )}
        </Card.Content>
      </Card>

      {error && (
        <Card style={styles.errorCard}>
          <Card.Content>
            <Text style={styles.errorText}>{error}</Text>
          </Card.Content>
        </Card>
      )}

      {filteredPolls.length === 0 && polls.length > 0 ? (
        <Card style={styles.card}>
          <Card.Content style={styles.emptyCardContent}>
            <Image 
              source={require('../../assets/oslo-logo.png')} 
              style={styles.emptyImage}
              resizeMode="contain"
            />
            <Text variant="bodyMedium" style={styles.emptyText}>
              No polls found with the selected filters. Try changing the search or filters.
            </Text>
          </Card.Content>
        </Card>
      ) : polls.length === 0 ? (
        <Card style={styles.card}>
          <Card.Content style={styles.emptyCardContent}>
            <Image 
              source={require('../../assets/oslo-logo.png')} 
              style={styles.emptyImage}
              resizeMode="contain"
            />
            <Text variant="bodyLarge" style={styles.emptyText}>
              No active polls at the moment.
            </Text>
            <Text variant="bodySmall" style={styles.emptySubtext}>
              Pull down to refresh
            </Text>
          </Card.Content>
        </Card>
      ) : (
        <>
          {filteredPolls.length > 0 && (
            <Text variant="bodySmall" style={styles.resultCount}>
              Showing {filteredPolls.length} of {polls.length} polls
            </Text>
          )}
          {pollCards}
        </>
      )}

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'OK',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {error || 'Vote registered!'}
      </Snackbar>
    </ScrollView>
  );
});

VoteScreen.displayName = 'VoteScreen';

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
  cardTablet: {
    marginBottom: 24,
  },
  pollTitle: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  pollDescription: {
    marginBottom: 8,
    color: '#666',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
    gap: 8,
  },
  categoryChip: {
    height: 24,
    paddingHorizontal: 8,
  },
  district: {
    color: osloBranding.colors.textSecondary,
    fontSize: 12,
  },
  optionContainer: {
    marginBottom: 12,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  optionContent: {
    flex: 1,
    marginLeft: 8,
  },
  optionText: {
    marginBottom: 4,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: 4,
  },
  voteCount: {
    color: '#666',
  },
  voteButton: {
    marginTop: SPACING.md,
    minHeight: BUTTON_MIN_HEIGHT,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: osloBranding.colors.textSecondary,
    fontWeight: '500',
  },
  loadingSubtext: {
    marginTop: 8,
    color: osloBranding.colors.textSecondary,
    opacity: 0.7,
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
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
  },
  emptySubtext: {
    textAlign: 'center',
    color: '#ccc',
    marginTop: 8,
  },
  errorCard: {
    marginBottom: 16,
    backgroundColor: '#ffebee',
  },
  errorText: {
    color: '#c62828',
  },
  searchCard: {
    marginBottom: 8,
    elevation: 1,
  },
  searchbar: {
    elevation: 0,
    backgroundColor: theme.colors.surface,
  },
  filterCard: {
    marginBottom: 16,
    elevation: 1,
  },
  sortFilterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  filterLabel: {
    marginBottom: 8,
    color: osloBranding.colors.textSecondary,
    fontWeight: '500',
  },
  sortButton: {
    minHeight: CHIP_MIN_HEIGHT,
  },
  divider: {
    marginVertical: SPACING.sm,
  },
  chipScroll: {
    marginBottom: 8,
  },
  chip: {
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
    minHeight: CHIP_MIN_HEIGHT,
  },
  clearFilterButton: {
    marginTop: SPACING.sm,
    minHeight: BUTTON_MIN_HEIGHT,
  },
  resultCount: {
    marginBottom: 8,
    paddingHorizontal: 16,
    color: osloBranding.colors.textSecondary,
    fontWeight: '500',
  },
  searchContainer: {
    marginBottom: SPACING.md,
  },
  clearSearchButton: {
    marginLeft: SPACING.sm,
    minHeight: BUTTON_MIN_HEIGHT,
  },
  searchHint: {
    marginTop: SPACING.xs,
    color: osloBranding.colors.textSecondary,
    fontSize: 12,
  },
  skeletonContainer: {
    gap: 16,
  },
});

export default VoteScreen;
