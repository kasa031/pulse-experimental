import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Card, Text, Button, Chip, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { theme, osloBranding } from '../constants/theme';
import { OSLO_DISTRICTS } from '../constants/osloDistricts';
import { getActivePolls, Poll } from '../services/pollsService';
import { getLatestNews, NewsItem } from '../services/newsService';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useResponsive, getResponsivePadding } from '../utils/useResponsive';
import { SPACING } from '../constants/spacing';
import { BUTTON_MIN_HEIGHT } from '../constants/touchTargets';
import { safeError } from '../utils/performance';

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const { isMobile, isTablet, isDesktop, width } = useResponsive();
  const [activePollsCount, setActivePollsCount] = useState<number>(0);
  const [recentPolls, setRecentPolls] = useState<Poll[]>([]);
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const padding = getResponsivePadding(width);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const polls = await getActivePolls();
      setActivePollsCount(polls.length);
      // Hent de 3 nyeste avstemningene for preview
      setRecentPolls(polls.slice(0, 3));
      
      // Hent de 3 nyeste nyhetene for preview
      const news = await getLatestNews(3);
      setLatestNews(news);
    } catch (error) {
      safeError('Feil ved henting av statistikk:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={[
        styles.content, 
        { padding },
        isTablet && styles.contentTablet,
        isMobile && styles.contentMobile,
        isDesktop && styles.contentDesktop
      ]}>
        {/* Welcome Card */}
        <Card style={[styles.card, styles.welcomeCard]}>
          <Card.Content>
            <View style={styles.headerRow}>
              <Image 
                source={require('../../assets/oslo-logo.png')} 
                style={styles.logoImage}
                resizeMode="contain"
              />
              <View style={styles.headerText}>
                <Text variant="headlineSmall" style={styles.title}>
                  {osloBranding.logo.text}
                </Text>
                <Text variant="bodySmall" style={styles.tagline}>
                  {osloBranding.logo.tagline}
                </Text>
              </View>
            </View>
            <Text variant="bodyMedium" style={styles.description}>
              Din stemme betyr noe! Delta i lokale avstemninger og påvirk utviklingen av Oslo. 
              Hver stemme hjelper byrådet og kommunen ta bedre beslutninger for byen vår.
            </Text>
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Icon name="vote" size={20} color={osloBranding.colors.secondary} />
                {loading ? (
                  <ActivityIndicator size="small" color={osloBranding.colors.secondary} style={styles.statLoader} />
                ) : (
                  <Text variant="bodySmall" style={styles.statText}>
                    {activePollsCount} aktive avstemninger
                  </Text>
                )}
              </View>
              <View style={styles.stat}>
                <Icon name="map" size={20} color={osloBranding.colors.primary} />
                <Text variant="bodySmall" style={styles.statText}>
                  {OSLO_DISTRICTS.length} bydeler
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Cards Grid for Tablet/Desktop */}
        <View style={[
          styles.cardsGrid, 
          isTablet && styles.cardsGridTablet,
          isDesktop && styles.cardsGridDesktop
        ]}>
          {/* Quick Info Card */}
          <Card style={[
            styles.card, 
            isTablet && styles.cardTablet,
            isDesktop && styles.cardDesktop
          ]}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Hva er OsloPuls?
              </Text>
              <Text variant="bodyMedium" style={styles.infoText}>
                OsloPuls er en plattform hvor innbyggerne i Oslo kan delta i lokale avstemninger 
                om temaer som påvirker byen. Fra transport og miljø til byutvikling og politikk - 
                din mening betyr noe.
              </Text>
              <View style={styles.chipContainer}>
                {['Miljø', 'Transport', 'Byutvikling', 'Politikk'].map((cat) => (
                  <Chip key={cat} style={styles.chip} textStyle={styles.chipText}>
                    {cat}
                  </Chip>
                ))}
              </View>
            </Card.Content>
          </Card>

          {/* Active Polls Card */}
          <Card style={[
            styles.card, 
            isTablet && styles.cardTablet,
            isDesktop && styles.cardDesktop
          ]}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Aktive avstemninger
              </Text>
              {loading ? (
                <ActivityIndicator style={styles.loader} />
              ) : activePollsCount > 0 ? (
                <>
                  <Text variant="bodyMedium" style={styles.infoText}>
                    Det er for øyeblikket {activePollsCount} {activePollsCount === 1 ? 'aktiv avstemning' : 'aktive avstemninger'} som du kan delta på.
                  </Text>
                  {recentPolls.length > 0 && (
                    <View style={styles.previewList}>
                      {recentPolls.map((poll) => (
                        <TouchableOpacity
                          key={poll.id}
                          style={styles.previewItem}
                          onPress={() => navigation.navigate('Stem')}
                        >
                          <Icon name="vote" size={16} color={osloBranding.colors.primary} />
                          <Text variant="bodySmall" style={styles.previewText} numberOfLines={1}>
                            {poll.title}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                  <Button 
                    mode="contained" 
                    icon="vote" 
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('Stem')}
                  >
                    Se alle avstemninger
                  </Button>
                </>
              ) : (
                <>
                  <Text variant="bodyMedium" style={styles.emptyText}>
                    Det er ingen aktive avstemninger for øyeblikket. 
                    Sjekk tilbake senere for nye avstemninger!
                  </Text>
                  <Button 
                    mode="outlined" 
                    icon="vote" 
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('Stem')}
                  >
                    Se alle avstemninger
                  </Button>
                </>
              )}
            </Card.Content>
          </Card>
        </View>

        {/* News Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Nyheter fra Oslo
            </Text>
            <Text variant="bodyMedium" style={styles.infoText}>
              Få siste nyheter om lokale saker, byutvikling og viktige beslutninger i Oslo.
            </Text>
            {latestNews.length > 0 && (
              <View style={styles.previewList}>
                {latestNews.map((news) => (
                  <TouchableOpacity
                    key={news.id}
                    style={styles.previewItem}
                    onPress={() => navigation.navigate('Nyheter')}
                  >
                    <Icon name="newspaper" size={16} color={osloBranding.colors.secondary} />
                    <View style={styles.previewTextContainer}>
                      <Text variant="bodySmall" style={styles.previewText} numberOfLines={1}>
                        {news.title}
                      </Text>
                      {news.category && (
                        <Chip 
                          style={styles.previewChip}
                          textStyle={styles.previewChipText}
                          compact
                        >
                          {news.category}
                        </Chip>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <Button 
              mode="outlined" 
              icon="newspaper" 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Nyheter')}
            >
              Se alle nyheter
            </Button>
          </Card.Content>
        </Card>
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
    flex: 1,
    marginBottom: 0,
  },
  cardsGrid: {
    flexDirection: 'column',
  },
  cardsGridTablet: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.cardMargin.tablet,
  },
  cardsGridDesktop: {
    flexDirection: 'row',
    gap: SPACING.lg,
    marginBottom: SPACING.cardMargin.desktop,
  },
  cardDesktop: {
    flex: 1,
    marginBottom: 0,
  },
  welcomeCard: {
    backgroundColor: theme.colors.surface,
    borderLeftWidth: 4,
    borderLeftColor: osloBranding.colors.primary,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  logoImage: {
    width: 48,
    height: 48,
  },
  title: {
    fontWeight: 'bold',
    color: osloBranding.colors.primary,
  },
  tagline: {
    color: osloBranding.colors.textSecondary,
    marginTop: 4,
  },
  description: {
    marginTop: 12,
    marginBottom: 16,
    color: osloBranding.colors.textSecondary,
    lineHeight: 22,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border || '#E0E0E0',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.lg,
    marginBottom: SPACING.xs,
  },
  statText: {
    marginLeft: 8,
    color: osloBranding.colors.textSecondary,
  },
  statLoader: {
    marginLeft: 8,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: '600',
    color: osloBranding.colors.primary,
  },
  infoText: {
    marginBottom: 16,
    color: osloBranding.colors.textSecondary,
    lineHeight: 22,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: osloBranding.colors.primary + '15',
  },
  chipText: {
    color: osloBranding.colors.primary,
  },
  emptyText: {
    color: osloBranding.colors.textSecondary,
    marginBottom: 16,
    lineHeight: 22,
  },
  actionButton: {
    marginTop: SPACING.sm,
    minHeight: BUTTON_MIN_HEIGHT,
  },
  loader: {
    marginVertical: 16,
  },
  previewList: {
    marginTop: SPACING.md,
    marginBottom: SPACING.md,
  },
  previewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    borderRadius: 8,
    marginBottom: SPACING.xs,
    backgroundColor: theme.colors.surface,
  },
  previewTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: SPACING.sm,
  },
  previewText: {
    flex: 1,
    color: osloBranding.colors.text,
    marginRight: SPACING.sm,
  },
  previewChip: {
    height: 20,
    backgroundColor: osloBranding.colors.primary + '20',
  },
  previewChipText: {
    fontSize: 10,
    color: osloBranding.colors.primary,
  },
});

export default HomeScreen;

