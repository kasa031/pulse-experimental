import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, useWindowDimensions } from 'react-native';
import { Card, Text, Button, RadioButton, ProgressBar, ActivityIndicator, Snackbar } from 'react-native-paper';
import { theme } from '../constants/theme';
import { getActivePolls, submitVote, subscribeToPolls, Poll } from '../services/pollsService';
import { auth } from '../services/firebase';
import { safeError, safeLog } from '../utils/performance';

const VoteScreen = React.memo(() => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [optimisticVotes, setOptimisticVotes] = useState<Record<string, Record<number, number>>>({});
  const { width } = useWindowDimensions();
  const isTablet = width > 768;

  // Hent avstemninger
  const loadPolls = useCallback(async () => {
    try {
      setLoading(true);
      const activePolls = await getActivePolls();
      setPolls(activePolls);
      setError(null);
    } catch (err: any) {
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
    } catch (err: any) {
      safeError('Feil ved innsending av stemme:', err);
      setError(err.message || 'Kunne ikke sende stemme. Prøv igjen.');
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
    return polls.map((poll) => {
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
  }, [polls, selectedOptions, submitting, optimisticVotes, isTablet, handleVote, submitVoteHandler]);

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
      contentContainerStyle={[styles.content, isTablet && styles.contentTablet]}
    >
      {error && (
        <Card style={styles.errorCard}>
          <Card.Content>
            <Text style={styles.errorText}>{error}</Text>
          </Card.Content>
        </Card>
      )}

      {polls.length === 0 ? (
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
        pollCards
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
    padding: 16,
  },
  contentTablet: {
    padding: 24,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  card: {
    marginBottom: 16,
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
    marginTop: 16,
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
});

export default VoteScreen;
