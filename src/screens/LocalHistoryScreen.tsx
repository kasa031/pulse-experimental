import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card, Text, ActivityIndicator, Chip, ProgressBar } from 'react-native-paper';
import { theme } from '../constants/theme';
import { auth } from '../services/firebase';
import { getUserVotingHistory, getCompletedPollResults, PollResult, UserVote } from '../services/historyService';
import { safeError } from '../utils/performance';
import { Timestamp } from 'firebase/firestore';

// Simple date formatter
const formatDate = (date: Date | Timestamp | any): string => {
  try {
    let dateObj: Date;
    if (date instanceof Date) {
      dateObj = date;
    } else if (date?.toDate) {
      dateObj = date.toDate();
    } else if (typeof date === 'string') {
      dateObj = new Date(date);
    } else {
      return 'Ukjent dato';
    }
    
    const day = dateObj.getDate();
    const month = dateObj.toLocaleDateString('nb-NO', { month: 'short' });
    const year = dateObj.getFullYear();
    return `${day}. ${month} ${year}`;
  } catch {
    return 'Ukjent dato';
  }
};

const LocalHistoryScreen = React.memo(() => {
  const [userVotes, setUserVotes] = useState<UserVote[]>([]);
  const [completedPolls, setCompletedPolls] = useState<PollResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'my-votes' | 'results'>('my-votes');

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      
      if (user) {
        const votes = await getUserVotingHistory(user.uid);
        setUserVotes(votes);
      }
      
      const results = await getCompletedPollResults(20);
      setCompletedPolls(results);
    } catch (error: any) {
      safeError('Feil ved henting av historikk:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);


  const getPercentage = (count: number, total: number): number => {
    if (total === 0) return 0;
    return Math.round((count / total) * 100);
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Laster historikk...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.title}>
              Lokalhistorie
            </Text>
            <Text variant="bodyMedium" style={styles.description}>
              Se tilbake på tidligere avstemninger og resultater.
            </Text>
          </Card.Content>
        </Card>

        {/* Tab selector */}
        <View style={styles.tabContainer}>
          <Chip
            selected={activeTab === 'my-votes'}
            onPress={() => setActiveTab('my-votes')}
            style={styles.tab}
            selectedColor={theme.colors.primary}
          >
            Mine stemmer ({userVotes.length})
          </Chip>
          <Chip
            selected={activeTab === 'results'}
            onPress={() => setActiveTab('results')}
            style={styles.tab}
            selectedColor={theme.colors.primary}
          >
            Resultater ({completedPolls.length})
          </Chip>
        </View>

        {/* My Votes Tab */}
        {activeTab === 'my-votes' && (
          <>
            {userVotes.length === 0 ? (
              <Card style={styles.card}>
                <Card.Content>
                  <Text variant="bodyMedium" style={styles.emptyText}>
                    Du har ikke stemt på noen avstemninger enda. 
                    Gå til "Stem"-fanen for å delta!
                  </Text>
                </Card.Content>
              </Card>
            ) : (
              userVotes.map((vote) => (
                <Card key={vote.pollId} style={styles.card}>
                  <Card.Content>
                    <Text variant="titleMedium" style={styles.pollTitle}>
                      {vote.pollTitle}
                    </Text>
                    <Text variant="bodySmall" style={styles.dateText}>
                      Stemt: {formatDate(vote.votedAt)}
                    </Text>
                    <View style={styles.voteOption}>
                      <Text variant="bodyMedium" style={styles.selectedOption}>
                        ✓ {vote.selectedOption}
                      </Text>
                    </View>
                  </Card.Content>
                </Card>
              ))
            )}
          </>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <>
            {completedPolls.length === 0 ? (
              <Card style={styles.card}>
                <Card.Content>
                  <Text variant="bodyMedium" style={styles.emptyText}>
                    Ingen avsluttede avstemninger enda.
                  </Text>
                </Card.Content>
              </Card>
            ) : (
              completedPolls.map((result) => (
                <Card key={result.poll.id} style={styles.card}>
                  <Card.Content>
                    <Text variant="titleMedium" style={styles.pollTitle}>
                      {result.poll.title}
                    </Text>
                    <Text variant="bodySmall" style={styles.dateText}>
                      Avsluttet: {formatDate(result.poll.endDate)}
                    </Text>
                    <Text variant="bodySmall" style={styles.totalVotes}>
                      Totalt antall stemmer: {result.totalVotes}
                    </Text>
                    
                    {result.userVote && (
                      <Chip 
                        icon="check-circle" 
                        style={styles.userVoteChip}
                        textStyle={styles.userVoteText}
                      >
                        Du stemte: {result.userVote.selectedOption}
                      </Chip>
                    )}

                    <View style={styles.resultsContainer}>
                      {result.poll.options.map((option, index) => {
                        const count = result.optionCounts[index] || 0;
                        const percentage = getPercentage(count, result.totalVotes);
                        const isUserChoice = result.userVote?.optionIndex === index;
                        
                        return (
                          <View key={index} style={styles.resultRow}>
                            <View style={styles.resultHeader}>
                              <Text 
                                variant="bodyMedium" 
                                style={[
                                  styles.resultOption,
                                  isUserChoice && styles.userChoice
                                ]}
                              >
                                {isUserChoice && '✓ '}{option}
                              </Text>
                              <Text variant="bodySmall" style={styles.resultStats}>
                                {count} stemmer ({percentage}%)
                              </Text>
                            </View>
                            <ProgressBar 
                              progress={percentage / 100} 
                              color={isUserChoice ? theme.colors.primary : theme.colors.accent}
                              style={styles.progressBar}
                            />
                          </View>
                        );
                      })}
                    </View>
                  </Card.Content>
                </Card>
              ))
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: 16,
    color: theme.colors.textSecondary,
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
    color: theme.colors.textSecondary,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  tab: {
    marginRight: 8,
  },
  pollTitle: {
    marginBottom: 8,
    fontWeight: '600',
  },
  dateText: {
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  totalVotes: {
    color: theme.colors.textSecondary,
    marginBottom: 12,
    fontWeight: '500',
  },
  voteOption: {
    marginTop: 8,
    padding: 12,
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
  },
  selectedOption: {
    color: theme.colors.primary,
    fontWeight: '500',
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 16,
  },
  userVoteChip: {
    marginBottom: 16,
    backgroundColor: theme.colors.primary + '20',
  },
  userVoteText: {
    color: theme.colors.primary,
  },
  resultsContainer: {
    marginTop: 8,
  },
  resultRow: {
    marginBottom: 16,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  resultOption: {
    flex: 1,
    fontWeight: '500',
  },
  userChoice: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  resultStats: {
    color: theme.colors.textSecondary,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginTop: 4,
  },
});

LocalHistoryScreen.displayName = 'LocalHistoryScreen';

export default LocalHistoryScreen;

