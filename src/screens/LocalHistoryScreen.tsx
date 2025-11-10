import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Platform, Share } from 'react-native';
import { Card, Text, ActivityIndicator, Chip, ProgressBar, Button, Snackbar } from 'react-native-paper';
import { theme, osloBranding } from '../constants/theme';
import { auth } from '../services/firebase';
import { getUserVotingHistory, getCompletedPollResults, PollResult, UserVote } from '../services/historyService';
import { safeError } from '../utils/performance';
import { Timestamp } from 'firebase/firestore';
import { useResponsive, getResponsivePadding } from '../utils/useResponsive';
import { SPACING } from '../constants/spacing';
import { CHIP_MIN_HEIGHT } from '../constants/touchTargets';
import { POLL_CATEGORIES } from '../constants/osloDistricts';
import { formatDateNorwegian } from '../utils/dateHelpers';

// Bruk formatDateNorwegian fra dateHelpers
const formatDate = formatDateNorwegian;

const LocalHistoryScreen = React.memo(() => {
  const { width } = useResponsive();
  const padding = getResponsivePadding(width);
  const [userVotes, setUserVotes] = useState<UserVote[]>([]);
  const [completedPolls, setCompletedPolls] = useState<PollResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'my-votes' | 'results'>('my-votes');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [participationStats, setParticipationStats] = useState({
    totalVotes: 0,
    totalPolls: 0,
    categories: {} as Record<string, number>,
    districts: {} as Record<string, number>,
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const user = auth?.currentUser;
      
      if (user) {
        const votes = await getUserVotingHistory(user.uid);
        setUserVotes(votes);
        
        // Beregn deltakelsesstatistikk
        const stats = {
          totalVotes: votes.length,
          totalPolls: 0,
          categories: {} as Record<string, number>,
          districts: {} as Record<string, number>,
        };
        
        votes.forEach(vote => {
          // Kategorier og bydeler kan hentes fra poll-data hvis tilgjengelig
          // For nå teller vi bare totalt antall
        });
        
        setParticipationStats(stats);
      }
      
      const results = await getCompletedPollResults(20);
      setCompletedPolls(results);
    } catch (error: unknown) {
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

  const exportHistory = useCallback(async () => {
    try {
      let exportData: string;
      let filename: string;

      if (activeTab === 'my-votes') {
        // Export as CSV
        const csvHeader = 'Avstemning,Dato,Valgt alternativ\n';
        const csvRows = userVotes.map(vote => 
          `"${vote.pollTitle}","${formatDate(vote.votedAt)}","${vote.selectedOption}"`
        ).join('\n');
        exportData = csvHeader + csvRows;
        filename = 'mine_stemmer.csv';
      } else {
        // Export results as JSON
        const jsonData = completedPolls.map(result => ({
          tittel: result.poll.title,
          avsluttet: formatDate(result.poll.endDate),
          totaltStemmer: result.totalVotes,
          resultater: result.poll.options.map((option, index) => ({
            alternativ: option,
            antallStemmer: result.optionCounts[index] || 0,
            prosent: getPercentage(result.optionCounts[index] || 0, result.totalVotes),
          })),
          minStemme: result.userVote ? result.userVote.selectedOption : null,
        }));
        exportData = JSON.stringify(jsonData, null, 2);
        filename = 'avstemningsresultater.json';
      }

      if (Platform.OS === 'web') {
        // For web: download file
        const blob = new Blob([exportData], { 
          type: activeTab === 'my-votes' ? 'text/csv' : 'application/json' 
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setSnackbarMessage('Historikk eksportert!');
      } else {
        // For mobile: share
        await Share.share({
          message: exportData,
          title: filename,
        });
        setSnackbarMessage('Historikk delt!');
      }
      setSnackbarVisible(true);
    } catch (error) {
      safeError('Feil ved eksport av historikk:', error);
      setSnackbarMessage('Kunne ikke eksportere historikk');
      setSnackbarVisible(true);
    }
  }, [activeTab, userVotes, completedPolls]);

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
      contentContainerStyle={[
        styles.content,
        { padding },
        isTablet && styles.contentTablet,
        isMobile && styles.contentMobile,
        isDesktop && styles.contentDesktop
      ]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View>
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
        <Card style={styles.card}>
          <Card.Content>
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
            {(userVotes.length > 0 || completedPolls.length > 0) && (
              <Button
                mode="outlined"
                icon="download"
                onPress={exportHistory}
                style={styles.exportButton}
                compact
              >
                Eksporter {activeTab === 'my-votes' ? 'stemmer' : 'resultater'}
              </Button>
            )}
          </Card.Content>
        </Card>

        {/* Participation Stats Card */}
        {activeTab === 'my-votes' && userVotes.length > 0 && (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Deltakelsesstatistikk
              </Text>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text variant="headlineSmall" style={styles.statValue}>
                    {participationStats.totalVotes}
                  </Text>
                  <Text variant="bodySmall" style={styles.statLabel}>
                    Totalt stemmer
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text variant="headlineSmall" style={styles.statValue}>
                    {completedPolls.length}
                  </Text>
                  <Text variant="bodySmall" style={styles.statLabel}>
                    Avsluttede avstemninger
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Filter Card */}
        {activeTab === 'results' && completedPolls.length > 0 && (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Filtrer resultater
              </Text>
              <View style={styles.filterRow}>
                <Text variant="bodySmall" style={styles.filterLabel}>
                  Kategori:
                </Text>
                <View style={styles.chipContainer}>
                  <Chip
                    selected={selectedCategory === null}
                    onPress={() => setSelectedCategory(null)}
                    style={styles.filterChip}
                    compact
                  >
                    Alle
                  </Chip>
                  {POLL_CATEGORIES.slice(0, 5).map((cat) => (
                    <Chip
                      key={cat}
                      selected={selectedCategory === cat}
                      onPress={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                      style={styles.filterChip}
                      compact
                    >
                      {cat}
                    </Chip>
                  ))}
                </View>
              </View>
            </Card.Content>
          </Card>
        )}

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
        {activeTab === 'results' && (() => {
          const filteredResults = selectedCategory
            ? completedPolls.filter(result => result.poll.category === selectedCategory)
            : completedPolls;

          return (
            <>
              {filteredResults.length === 0 ? (
                <Card style={styles.card}>
                  <Card.Content>
                    <Text variant="bodyMedium" style={styles.emptyText}>
                      {selectedCategory ? 'Ingen resultater for valgt kategori.' : 'Ingen avsluttede avstemninger enda.'}
                    </Text>
                  </Card.Content>
                </Card>
              ) : (
                filteredResults.map((result) => (
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
                                {isUserChoice && '✓ '}{option.text}
                              </Text>
                              <Text variant="bodySmall" style={styles.resultStats}>
                                {count} stemmer ({percentage}%)
                              </Text>
                            </View>
                            <ProgressBar 
                              progress={percentage / 100} 
                              color={isUserChoice ? theme.colors.primary : osloBranding.colors.secondary}
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
          );
        })()}
      </View>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'Lukk',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
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
    color: osloBranding.colors.textSecondary,
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
  },
  description: {
    marginTop: 8,
    color: osloBranding.colors.textSecondary,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  tab: {
    marginRight: SPACING.sm,
    minHeight: CHIP_MIN_HEIGHT,
  },
  exportButton: {
    marginTop: SPACING.md,
    alignSelf: 'flex-start',
  },
  pollTitle: {
    marginBottom: 8,
    fontWeight: '600',
  },
  dateText: {
    color: osloBranding.colors.textSecondary,
    marginBottom: 8,
  },
  totalVotes: {
    color: osloBranding.colors.textSecondary,
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
    color: osloBranding.colors.textSecondary,
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
    color: osloBranding.colors.textSecondary,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginTop: 4,
  },
  sectionTitle: {
    marginBottom: SPACING.md,
    color: osloBranding.colors.text,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.md,
  },
  statItem: {
    flex: 1,
    minWidth: 120,
    marginRight: SPACING.md,
    marginBottom: SPACING.sm,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '600',
    color: osloBranding.colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: osloBranding.colors.textSecondary,
    marginTop: 4,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  filterLabel: {
    marginRight: SPACING.sm,
    color: osloBranding.colors.textSecondary,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  filterChip: {
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
  },
});

LocalHistoryScreen.displayName = 'LocalHistoryScreen';

export default LocalHistoryScreen;

