import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, RefreshControl } from 'react-native';
import { Card, Text, Button, Chip, ActivityIndicator } from 'react-native-paper';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { theme, osloBranding } from '../constants/theme';
import { OSLO_DISTRICTS, POLL_CATEGORIES, getCategoryColor } from '../constants/osloDistricts';
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
  const [refreshing, setRefreshing] = useState(false);
  
  const padding = getResponsivePadding(width);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
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
      setRefreshing(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    loadStats(true);
  }, []);

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme.colors.primary]}
          tintColor={theme.colors.primary}
        />
      }
    >
      <View style={[
        styles.content, 
        { padding },
        isTablet && styles.contentTablet,
        isMobile && styles.contentMobile,
        isDesktop && styles.contentDesktop
      ]}>
        {/* Welcome Card */}
        <Animated.View entering={FadeInDown.duration(500).delay(100)}>
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
        </Animated.View>

        {/* Cards Grid for Tablet/Desktop */}
        <View style={[
          styles.cardsGrid, 
          isTablet && styles.cardsGridTablet,
          isDesktop && styles.cardsGridDesktop
        ]}>
        {/* Quick Info Card */}
        <Animated.View entering={FadeInDown.duration(500).delay(200)}>
          <Card style={[
            styles.card, 
            isTablet && styles.cardTablet,
            isDesktop && styles.cardDesktop
          ]}>
            <Card.Content>
              <View style={styles.aboutHeader}>
                <Icon name="information" size={28} color={osloBranding.colors.primary} />
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Hva er OsloPuls?
                </Text>
              </View>
              <Text variant="bodyMedium" style={styles.infoText}>
                OsloPuls er en digital plattform for lokaldemokrati i Oslo. Vi gir innbyggerne mulighet til å:
              </Text>
              <View style={styles.featureList}>
                <View style={styles.featureItem}>
                  <Icon name="vote" size={18} color={osloBranding.colors.secondary} />
                  <Text variant="bodySmall" style={styles.featureText}>
                    Delta i lokale avstemninger og påvirke beslutninger
                  </Text>
                </View>
                <View style={styles.featureItem}>
                  <Icon name="forum" size={18} color={osloBranding.colors.secondary} />
                  <Text variant="bodySmall" style={styles.featureText}>
                    Diskutere lokale saker med andre innbyggere
                  </Text>
                </View>
                <View style={styles.featureItem}>
                  <Icon name="newspaper" size={18} color={osloBranding.colors.secondary} />
                  <Text variant="bodySmall" style={styles.featureText}>
                    Holde seg oppdatert på nyheter fra Oslo kommune
                  </Text>
                </View>
                <View style={styles.featureItem}>
                  <Icon name="chart-bar" size={18} color={osloBranding.colors.secondary} />
                  <Text variant="bodySmall" style={styles.featureText}>
                    Se resultater fra tidligere avstemninger
                  </Text>
                </View>
              </View>
              <Text variant="bodySmall" style={styles.aboutFooter}>
                Alle innbyggere i Oslo er velkommen til å delta. Din stemme betyr noe!
              </Text>
              <View style={styles.chipContainer}>
                {POLL_CATEGORIES.slice(0, 4).map((cat) => (
                  <Chip key={cat} style={styles.chip} textStyle={styles.chipText}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Chip>
                ))}
              </View>
            </Card.Content>
          </Card>
        </Animated.View>

          {/* Active Polls Card */}
          <Animated.View entering={FadeInDown.duration(500).delay(300)}>
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
          </Animated.View>
        </View>

        {/* News Card */}
        <Animated.View entering={FadeInDown.duration(500).delay(400)}>
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
                          style={[
                            styles.previewChip,
                            { backgroundColor: getCategoryColor(news.category as any) + '20' }
                          ]}
                          textStyle={[
                            styles.previewChipText,
                            { color: getCategoryColor(news.category as any) }
                          ]}
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
        </Animated.View>
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
    borderTopColor: osloBranding.colors.border || '#E0E0E0',
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
  aboutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  featureList: {
    marginTop: SPACING.sm,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  featureText: {
    flex: 1,
    marginLeft: SPACING.sm,
    color: osloBranding.colors.textSecondary,
  },
  aboutFooter: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: osloBranding.colors.border || '#E0E0E0',
  },
});

export default HomeScreen;

