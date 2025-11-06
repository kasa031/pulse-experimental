import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card, Text, Button, RadioButton, ProgressBar, ActivityIndicator, Snackbar, Searchbar, Chip, Menu, Divider } from 'react-native-paper';
import { theme, osloBranding } from '../constants/theme';
import { getActivePolls, submitVote, subscribeToPolls, Poll } from '../services/pollsService';
import { auth } from '../services/firebase';
import { safeError, safeLog } from '../utils/performance';
import { searchAndFilterPolls } from '../utils/search';
import { OSLO_DISTRICTS } from '../constants/osloDistricts';
import { useResponsive, getResponsivePadding } from '../utils/useResponsive';
import { SPACING } from '../constants/spacing';
import { BUTTON_MIN_HEIGHT, CHIP_MIN_HEIGHT } from '../constants/touchTargets';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
  const { isMobile, isTablet, width } = useResponsive();
  const padding = getResponsivePadding(width);

  // Filtrerte og sorterte polls
  const filteredPolls = useMemo(() => {
    let filtered = searchAndFilterPolls(polls, searchQuery, selectedCategory, selectedDistrict);
    
    // Sortering
    const now = new Date().getTime();
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'newest') {
        // Sorter etter startDate (nyeste først)
        const aStart = a.startDate?.toMillis?.() || a.startDate?.getTime?.() || 0;
        const bStart = b.startDate?.toMillis?.() || b.startDate?.getTime?.() || 0;
        return bStart - aStart;
      } else if (sortBy === 'popular') {
        // Sorter etter totalt antall stemmer (mest populære først)
        const aVotes = a.options.reduce((sum, opt) => sum + opt.votes, 0);
        const bVotes = b.options.reduce((sum, opt) => sum + opt.votes, 0);
        return bVotes - aVotes;
      } else if (sortBy === 'endingSoon') {
        // Sorter etter endDate (slutter snart først)
        const aEnd = a.endDate?.toMillis?.() || a.endDate?.getTime?.() || Infinity;
        const bEnd = b.endDate?.toMillis?.() || b.endDate?.getTime?.() || Infinity;
        return aEnd - bEnd;
      }
      return 0;
    });
    
    return filtered;
  }, [polls, searchQuery, selectedCategory, selectedDistrict, sortBy]);

  // Unike kategorier fra polls
  const availableCategories = useMemo(() => {
    const categories = new Set<string>();
    polls.forEach(poll => {
      if (poll.category) {
        categories.add(poll.category);
      }
    });
    return Array.from(categories).sort();
  }, [polls]);

  // Hent avstemninger
  const loadPolls = useCallback(async () => {
    try {
      setLoading(true);
      const activePolls = await getActivePolls();
      setPolls(activePolls);
      setError(null);
    } catch (err: unknown) {
      safeError('Feil ved henting av avstemninger:', err);
      setError('Kunne ikke laste avstemninger. Prøv igjen.');
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
    const user = auth.currentUser;
    if (!user) {
      setError('Du må være innlogget for å stemme');
      setSnackbarVisible(true);
      return;
    }

    const pollId = poll.id;
    const optionKey = `${pollId}_${optionIndex}`;

    // Optimistisk oppdatering
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
      setSnackbarVisible(true);
      setSelectedOptions(prev => {
        const newState = { ...prev };
        delete newState[pollId];
        return newState;
      });
      
      // Oppdater lokal state
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
      safeError('Feil ved innsending av stemme:', err);
      const error = err as { message?: string };
      setError(error.message || 'Kunne ikke sende stemme. Prøv igjen.');
      setSnackbarVisible(true);
      
      // Revert optimistisk oppdatering
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
            <Text variant="bodySmall" style={styles.category}>
              {poll.category} • {poll.district}
            </Text>

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
                              {voteCount} stemmer ({percentage.toFixed(1)}%)
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
              {isSubmitting ? 'Sender...' : 'Stem'}
            </Button>
          </Card.Content>
        </Card>
      );
    });
      }, [filteredPolls, selectedOptions, submitting, optimisticVotes, isTablet, handleVote, submitVoteHandler]);

  if (loading && polls.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Laster avstemninger...</Text>
      </View>
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
          <Searchbar
            placeholder="Søk i avstemninger..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
          />
        </Card.Content>
      </Card>

      {/* Filter Chips */}
      {(availableCategories.length > 0 || OSLO_DISTRICTS.length > 0) && (
        <Card style={styles.filterCard}>
          <Card.Content>
            <Text variant="bodySmall" style={styles.filterLabel}>
              Filtrer etter:
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
              {availableCategories.map((cat) => (
                <Chip
                  key={`cat-${cat}`}
                  selected={selectedCategory === cat}
                  onPress={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                  style={styles.chip}
                  selectedColor={osloBranding.colors.primary}
                >
                  {cat}
                </Chip>
              ))}
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
                Nullstill filter
              </Button>
            )}
          </Card.Content>
        </Card>
      )}

      {error && (
        <Card style={styles.errorCard}>
          <Card.Content>
            <Text style={styles.errorText}>{error}</Text>
          </Card.Content>
        </Card>
      )}

      {filteredPolls.length === 0 && polls.length > 0 ? (
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="bodyMedium" style={styles.emptyText}>
              Ingen avstemninger funnet med de valgte filterne. Prøv å endre søket eller filterne.
            </Text>
          </Card.Content>
        </Card>
      ) : polls.length === 0 ? (
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="bodyLarge" style={styles.emptyText}>
              Ingen aktive avstemninger for øyeblikket.
            </Text>
            <Text variant="bodySmall" style={styles.emptySubtext}>
              Dra ned for å oppdatere
            </Text>
          </Card.Content>
        </Card>
      ) : (
        <>
          {filteredPolls.length > 0 && (
            <Text variant="bodySmall" style={styles.resultCount}>
              Viser {filteredPolls.length} av {polls.length} avstemninger
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
        {error || 'Stemme registrert!'}
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
  category: {
    marginBottom: 16,
    color: '#999',
    fontStyle: 'italic',
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
    color: '#666',
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
  filterLabel: {
    marginBottom: 8,
    color: theme.colors.textSecondary,
    fontWeight: '500',
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
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
});

export default VoteScreen;
