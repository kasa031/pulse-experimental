/**
 * NewsScreen - Nyhetsfeed for Oslo
 * Viser siste nyheter fra Oslo kommune og lokale saker
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Linking, Share, Image, Platform } from 'react-native';
import { Card, Text, Button, Chip, ActivityIndicator, Dialog, Portal } from 'react-native-paper';
import { theme, osloBranding } from '../constants/theme';
import { getLatestNews, getNewsByCategory, getNewsByDistrict, NewsItem } from '../services/newsService';
import { OSLO_DISTRICTS, POLL_CATEGORIES } from '../constants/osloDistricts';
import { safeError, safeLog } from '../utils/performance';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Timestamp } from 'firebase/firestore';
import { auth } from '../services/firebase';
import { getUserProfile } from '../services/userService';
import { useResponsive, getResponsivePadding } from '../utils/useResponsive';
import { SPACING } from '../constants/spacing';
import { BUTTON_MIN_HEIGHT, CHIP_MIN_HEIGHT } from '../constants/touchTargets';

const CATEGORIES = POLL_CATEGORIES || ['politikk', 'transport', 'miljø', 'byutvikling', 'nyheter'];

const formatDate = (date: Date | Timestamp | unknown): string => {
  try {
    let dateObj: Date;
    if (date instanceof Date) {
      dateObj = date;
    } else if (date && typeof date === 'object' && 'toDate' in date) {
      dateObj = (date as Timestamp).toDate();
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
    
    return dateObj.toLocaleDateString('nb-NO', { 
      day: 'numeric', 
      month: 'short',
      year: dateObj.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  } catch {
    return 'Ukjent dato';
  }
};

const getPriorityColor = (priority: NewsItem['priority']): string => {
  switch (priority) {
    case 'urgent':
      return '#d32f2f';
    case 'high':
      return '#f57c00';
    default:
      return osloBranding.colors.primary;
  }
};

const NewsScreen = () => {
  const { isMobile, isTablet, width } = useResponsive();
  const padding = getResponsivePadding(width);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [userDistrict, setUserDistrict] = useState<string | null>(null);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [showFullNews, setShowFullNews] = useState(false);

  useEffect(() => {
    loadUserDistrict();
  }, []);

  useEffect(() => {
    loadNews();
  }, [selectedCategory, selectedDistrict]);

  const loadUserDistrict = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const profile = await getUserProfile(user.uid);
        if (profile?.district) {
          setUserDistrict(profile.district);
        }
      }
    } catch (error) {
      safeError('Feil ved henting av brukerens bydel:', error);
    }
  };

  const loadNews = useCallback(async () => {
    try {
      setLoading(true);
      let newsItems: NewsItem[] = [];

      if (selectedDistrict) {
        newsItems = await getNewsByDistrict(selectedDistrict, 20);
      } else if (selectedCategory) {
        newsItems = await getNewsByCategory(selectedCategory as NewsItem['category'], 20);
      } else {
        newsItems = await getLatestNews(20);
      }

      setNews(newsItems);
    } catch (error) {
      safeError('Feil ved henting av nyheter:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedCategory, selectedDistrict]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadNews();
  }, [loadNews]);

  const handleOpenLink = async (url?: string) => {
    if (url) {
      try {
        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) {
          await Linking.openURL(url);
        } else {
          safeLog('Kan ikke åpne URL:', url);
        }
      } catch (error) {
        safeError('Feil ved åpning av lenke:', error);
      }
    }
  };

  const handleShare = async (item: NewsItem) => {
    try {
      const shareContent = {
        message: `${item.title}\n\n${item.summary || item.content.substring(0, 200)}...\n\n${item.linkUrl || ''}`,
        title: item.title,
        url: item.linkUrl,
      };

      if (Platform.OS === 'web') {
        if (navigator.share) {
          await navigator.share(shareContent);
        } else {
          // Fallback: kopier til utklippstavle
          await navigator.clipboard.writeText(shareContent.message);
          safeLog('Nyhet kopiert til utklippstavle');
        }
      } else {
        await Share.share(shareContent);
      }
    } catch (error) {
      safeError('Feil ved deling av nyhet:', error);
    }
  };

  const handleReadMore = (item: NewsItem) => {
    setSelectedNews(item);
    setShowFullNews(true);
  };

  const filteredNews = news.filter(item => {
    if (selectedCategory && item.category !== selectedCategory) return false;
    if (selectedDistrict && item.district !== selectedDistrict) return false;
    return true;
  });

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
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
            <View style={styles.headerRow}>
              <Icon name="newspaper" size={32} color={osloBranding.colors.primary} />
              <View style={styles.headerText}>
                <Text variant="headlineSmall" style={styles.title}>
                  Nyheter fra Oslo
                </Text>
                <Text variant="bodySmall" style={styles.subtitle}>
                  Hold deg oppdatert på lokale saker og viktige beslutninger
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Category Filter */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Filtrer etter kategori
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
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
            </ScrollView>
          </Card.Content>
        </Card>

        {/* District Filter */}
        {userDistrict && (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Filtrer etter bydel
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                <View style={styles.chipContainer}>
                  <Chip
                    selected={selectedDistrict === null}
                    onPress={() => setSelectedDistrict(null)}
                    style={styles.chip}
                    textStyle={styles.chipText}
                  >
                    Alle
                  </Chip>
                  <Chip
                    selected={selectedDistrict === userDistrict}
                    onPress={() => setSelectedDistrict(userDistrict)}
                    style={styles.chip}
                    textStyle={styles.chipText}
                  >
                    {userDistrict}
                  </Chip>
                  {OSLO_DISTRICTS.slice(0, 5).map((district) => (
                    <Chip
                      key={district}
                      selected={selectedDistrict === district}
                      onPress={() => setSelectedDistrict(district)}
                      style={styles.chip}
                      textStyle={styles.chipText}
                    >
                      {district}
                    </Chip>
                  ))}
                </View>
              </ScrollView>
            </Card.Content>
          </Card>
        )}

        {/* News List */}
        {loading && !refreshing ? (
          <ActivityIndicator style={styles.loader} size="large" />
        ) : filteredNews.length === 0 ? (
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.emptyState}>
                <Icon name="newspaper-variant-outline" size={64} color={osloBranding.colors.textSecondary} />
                <Text variant="titleMedium" style={styles.emptyTitle}>
                  Ingen nyheter funnet
                </Text>
                <Text variant="bodyMedium" style={styles.emptyText}>
                  Det er ingen nyheter for øyeblikket. Sjekk tilbake senere!
                </Text>
              </View>
            </Card.Content>
          </Card>
        ) : (
          filteredNews.map((item) => (
            <Card key={item.id} style={styles.newsCard}>
              <Card.Content>
                <View style={styles.newsHeader}>
                  <View style={styles.newsHeaderLeft}>
                    <View style={styles.newsMeta}>
                      <Chip 
                        style={[styles.categoryChip, { backgroundColor: getPriorityColor(item.priority) }]}
                        textStyle={styles.categoryChipText}
                      >
                        {item.category}
                      </Chip>
                      {item.priority === 'urgent' && (
                        <Icon name="alert" size={16} color="#d32f2f" style={styles.urgentIcon} />
                      )}
                    </View>
                    <Text variant="titleMedium" style={styles.newsTitle}>
                      {item.title}
                    </Text>
                    <View style={styles.newsMetaRow}>
                      <Text variant="bodySmall" style={styles.metaText}>
                        {item.author}
                      </Text>
                      <Text variant="bodySmall" style={styles.metaText}>
                        • {formatDate(item.publishedAt)}
                      </Text>
                      {item.district && (
                        <Text variant="bodySmall" style={styles.metaText}>
                          • {item.district}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
                
                {item.imageUrl && (
                  <Image 
                    source={{ uri: item.imageUrl }} 
                    style={styles.newsImage}
                    resizeMode="cover"
                  />
                )}

                {item.summary && (
                  <Text variant="bodyMedium" style={styles.summary}>
                    {item.summary}
                  </Text>
                )}
                
                <Text variant="bodyMedium" style={styles.newsContent} numberOfLines={3}>
                  {item.content}
                </Text>

                <View style={styles.newsActions}>
                  <Button
                    mode="text"
                    icon="book-open-variant"
                    onPress={() => handleReadMore(item)}
                    style={styles.actionButton}
                    textColor={osloBranding.colors.primary}
                  >
                    Les mer
                  </Button>
                  <Button
                    mode="text"
                    icon="share-variant"
                    onPress={() => handleShare(item)}
                    style={styles.actionButton}
                    textColor={osloBranding.colors.primary}
                  >
                    Del
                  </Button>
                  {item.linkUrl && (
                    <Button
                      mode="text"
                      icon="open-in-new"
                      onPress={() => handleOpenLink(item.linkUrl)}
                      style={styles.actionButton}
                      textColor={osloBranding.colors.primary}
                    >
                      Ekstern lenke
                    </Button>
                  )}
                </View>
              </Card.Content>
            </Card>
          ))
        )}
      </View>

      {/* Full News Dialog */}
      <Portal>
        <Dialog 
          visible={showFullNews} 
          onDismiss={() => {
            setShowFullNews(false);
            setSelectedNews(null);
          }}
          style={styles.fullNewsDialog}
        >
          {selectedNews && (
            <>
              <Dialog.Title style={styles.fullNewsTitle}>
                {selectedNews.title}
              </Dialog.Title>
              <Dialog.ScrollArea style={styles.fullNewsScrollArea}>
                <Dialog.Content>
                  <View style={styles.fullNewsMeta}>
                    <Text variant="bodySmall" style={styles.fullNewsMetaText}>
                      {selectedNews.author}
                    </Text>
                    <Text variant="bodySmall" style={styles.fullNewsMetaText}>
                      • {formatDate(selectedNews.publishedAt)}
                    </Text>
                    {selectedNews.district && (
                      <Text variant="bodySmall" style={styles.fullNewsMetaText}>
                        • {selectedNews.district}
                      </Text>
                    )}
                  </View>
                  
                  {selectedNews.imageUrl && (
                    <Image 
                      source={{ uri: selectedNews.imageUrl }} 
                      style={styles.fullNewsImage}
                      resizeMode="cover"
                    />
                  )}

                  {selectedNews.summary && (
                    <Text variant="bodyLarge" style={styles.fullNewsSummary}>
                      {selectedNews.summary}
                    </Text>
                  )}
                  
                  <Text variant="bodyMedium" style={styles.fullNewsContent}>
                    {selectedNews.content}
                  </Text>
                </Dialog.Content>
              </Dialog.ScrollArea>
              <Dialog.Actions>
                <Button
                  onPress={() => handleShare(selectedNews)}
                  icon="share-variant"
                  textColor={osloBranding.colors.primary}
                >
                  Del
                </Button>
                {selectedNews.linkUrl && (
                  <Button
                    onPress={() => handleOpenLink(selectedNews.linkUrl)}
                    icon="open-in-new"
                    textColor={osloBranding.colors.primary}
                  >
                    Ekstern lenke
                  </Button>
                )}
                <Button
                  onPress={() => {
                    setShowFullNews(false);
                    setSelectedNews(null);
                  }}
                  textColor={osloBranding.colors.primary}
                >
                  Lukk
                </Button>
              </Dialog.Actions>
            </>
          )}
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
  contentContainer: {
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    color: osloBranding.colors.primary,
  },
  subtitle: {
    color: osloBranding.colors.textSecondary,
    marginTop: 4,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 12,
    color: osloBranding.colors.text,
  },
  chipScroll: {
    marginHorizontal: -4,
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
  chipText: {
    fontSize: 12,
  },
  loader: {
    marginVertical: 32,
  },
  newsCard: {
    marginBottom: SPACING.cardMargin.mobile,
    elevation: 2,
  },
  newsHeader: {
    marginBottom: 12,
  },
  newsHeaderLeft: {
    flex: 1,
  },
  newsMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryChip: {
    marginRight: 8,
  },
  categoryChipText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  urgentIcon: {
    marginLeft: 4,
  },
  newsTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: osloBranding.colors.text,
  },
  newsMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  metaText: {
    color: osloBranding.colors.textSecondary,
    marginRight: 8,
  },
  summary: {
    fontWeight: '600',
    marginBottom: 8,
    color: osloBranding.colors.text,
    fontStyle: 'italic',
  },
  newsContent: {
    color: osloBranding.colors.text,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  newsImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: SPACING.md,
    backgroundColor: osloBranding.colors.backgroundSecondary,
  },
  newsActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.sm,
    gap: SPACING.xs,
  },
  actionButton: {
    minHeight: BUTTON_MIN_HEIGHT,
  },
  fullNewsDialog: {
    maxWidth: isTablet ? 600 : '90%',
    maxHeight: '90%',
  },
  fullNewsTitle: {
    fontWeight: 'bold',
    color: osloBranding.colors.primary,
  },
  fullNewsScrollArea: {
    maxHeight: 400,
  },
  fullNewsMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: osloBranding.colors.border || '#E0E0E0',
  },
  fullNewsMetaText: {
    color: osloBranding.colors.textSecondary,
    marginRight: SPACING.sm,
  },
  fullNewsImage: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    marginBottom: SPACING.md,
    backgroundColor: osloBranding.colors.backgroundSecondary,
  },
  fullNewsSummary: {
    fontWeight: '600',
    marginBottom: SPACING.md,
    color: osloBranding.colors.text,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  fullNewsContent: {
    color: osloBranding.colors.text,
    lineHeight: 22,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
    color: osloBranding.colors.text,
  },
  emptyText: {
    textAlign: 'center',
    color: osloBranding.colors.textSecondary,
    paddingHorizontal: 32,
  },
});

export default NewsScreen;

