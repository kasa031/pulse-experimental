/**
 * WebNavigation - Responsiv navigasjon for web med hover-meny
 * Viser sidebar på desktop og hamburger-meny på mobil
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform, useWindowDimensions, TouchableOpacity } from 'react-native';
import { Drawer, Portal, Text, Surface } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute, NavigationContainer } from '@react-navigation/native';
import { osloBranding } from '../constants/theme';

interface NavItem {
  name: string;
  title: string;
  icon: string;
  iconFocused: string;
}

const navItems: NavItem[] = [
  { name: 'Hjem', title: 'Hjem', icon: 'home-outline', iconFocused: 'home' },
  { name: 'Stem', title: 'Stem', icon: 'vote-outline', iconFocused: 'vote' },
  { name: 'Fellesskap', title: 'Fellesskap', icon: 'account-group-outline', iconFocused: 'account-group' },
  { name: 'Nyheter', title: 'Nyheter', icon: 'newspaper-outline', iconFocused: 'newspaper' },
  { name: 'Profil', title: 'Profil', icon: 'account-outline', iconFocused: 'account' },
  { name: 'Kontakt', title: 'Kontakt', icon: 'email-outline', iconFocused: 'email' },
  { name: 'Lokalhistorie', title: 'Lokalhistorie', icon: 'history', iconFocused: 'history' },
  { name: 'Opprett', title: 'Opprett', icon: 'plus-circle-outline', iconFocused: 'plus-circle' },
];

interface WebNavigationProps {
  children: React.ReactNode;
}

const WebNavigation = ({ children }: WebNavigationProps) => {
  // Safely get navigation and route - wrap in try-catch for safety
  let navigation: any = null;
  let route: any = null;
  
  try {
    navigation = useNavigation<any>();
    route = useRoute();
  } catch (error) {
    // Navigation context not available yet - return children
    console.warn('Navigation not ready in WebNavigation:', error);
    return <>{children}</>;
  }

  const { width } = useWindowDimensions();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const isWeb = Platform.OS === 'web';
  const isDesktop = isWeb && width > 1024;
  const isTablet = width > 768 && width <= 1024;

  // Auto-close drawer on mobile when navigating
  useEffect(() => {
    if (!isDesktop && drawerOpen && navigation && navigation.addListener) {
      try {
        const unsubscribe = navigation.addListener('state', () => {
          setDrawerOpen(false);
        });
        return unsubscribe;
      } catch (error) {
        console.warn('Error setting up navigation listener:', error);
      }
    }
  }, [navigation, drawerOpen, isDesktop]);

  if (!isWeb) {
    // Return children directly on mobile - use default tab navigator
    return <>{children}</>;
  }

  const handleNavigate = (screenName: string) => {
    if (navigation && navigation.navigate) {
      try {
        navigation.navigate(screenName);
        if (!isDesktop) {
          setDrawerOpen(false);
        }
      } catch (error) {
        console.error('Navigation error:', error);
      }
    }
  };

  const renderNavItem = (item: NavItem, isActive: boolean) => {
    const isHovered = hoveredItem === item.name;
    const iconName = (isActive || isHovered) ? item.iconFocused : item.icon;

    return (
      <TouchableOpacity
        key={item.name}
        style={[
          styles.navItem,
          isActive && styles.navItemActive,
          isHovered && styles.navItemHovered,
        ]}
        onPress={() => handleNavigate(item.name)}
        onMouseEnter={() => setHoveredItem(item.name)}
        onMouseLeave={() => setHoveredItem(null)}
        activeOpacity={0.7}
      >
        <Icon 
          name={iconName} 
          size={isDesktop ? 24 : 20} 
          color={isActive ? osloBranding.colors.primary : osloBranding.colors.text} 
        />
        <Text 
          style={[
            styles.navText,
            isActive && styles.navTextActive,
            isDesktop && styles.navTextDesktop,
          ]}
        >
          {item.title}
        </Text>
        {isDesktop && isHovered && (
          <View style={styles.hoverIndicator} />
        )}
      </TouchableOpacity>
    );
  };

  if (isDesktop) {
    // Desktop: Sidebar navigation
    const currentRouteName = route?.name || '';
    return (
      <View style={styles.desktopContainer}>
        <Surface style={styles.sidebar} elevation={2}>
          <View style={styles.sidebarHeader}>
            <Icon name="city-variant" size={32} color={osloBranding.colors.primary} />
            <Text variant="titleMedium" style={styles.sidebarTitle}>
              Pulse Oslo
            </Text>
          </View>
          <View style={styles.navList}>
            {navItems.map((item) => {
              const isActive = currentRouteName === item.name;
              return renderNavItem(item, isActive);
            })}
          </View>
        </Surface>
        <View style={styles.contentArea}>
          {children}
        </View>
      </View>
    );
  }

  // Tablet/Mobile: Hamburger menu
  return (
    <View style={styles.mobileContainer}>
      <Portal>
        <Drawer.Section
          visible={drawerOpen}
          onDismiss={() => setDrawerOpen(false)}
          style={styles.drawer}
        >
          <View style={styles.drawerHeader}>
            <Icon name="city-variant" size={32} color={osloBranding.colors.primary} />
            <Text variant="titleLarge" style={styles.drawerTitle}>
              Pulse Oslo
            </Text>
          </View>
          {navItems.map((item) => {
            const isActive = (route?.name || '') === item.name;
            return (
              <Drawer.Item
                key={item.name}
                label={item.title}
                icon={isActive ? item.iconFocused : item.icon}
                active={isActive}
                onPress={() => handleNavigate(item.name)}
                style={styles.drawerItem}
              />
            );
          })}
        </Drawer.Section>
      </Portal>
      
      <Surface style={styles.mobileHeader} elevation={2}>
        <TouchableOpacity
          onPress={() => setDrawerOpen(true)}
          style={styles.menuButton}
        >
          <Icon name="menu" size={24} color={osloBranding.colors.text} />
        </TouchableOpacity>
        <Text variant="titleMedium" style={styles.mobileTitle}>
          Pulse Oslo
        </Text>
      </Surface>
      
      <View style={styles.mobileContent}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  desktopContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  sidebar: {
    width: 240,
    backgroundColor: '#fff',
    paddingTop: 16,
    paddingBottom: 16,
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 16,
  },
  sidebarTitle: {
    marginLeft: 12,
    fontWeight: 'bold',
    color: osloBranding.colors.primary,
  },
  navList: {
    paddingHorizontal: 8,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 4,
    minHeight: 48,
  },
  navItemActive: {
    backgroundColor: osloBranding.colors.primary + '15',
  },
  navItemHovered: {
    backgroundColor: osloBranding.colors.primary + '10',
  },
  navText: {
    marginLeft: 12,
    fontSize: 14,
    color: osloBranding.colors.text,
  },
  navTextActive: {
    color: osloBranding.colors.primary,
    fontWeight: '600',
  },
  navTextDesktop: {
    fontSize: 16,
  },
  hoverIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: osloBranding.colors.primary,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  contentArea: {
    flex: 1,
    backgroundColor: osloBranding.colors.background,
  },
  mobileContainer: {
    flex: 1,
  },
  mobileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  menuButton: {
    padding: 8,
    marginRight: 8,
  },
  mobileTitle: {
    fontWeight: 'bold',
    color: osloBranding.colors.primary,
  },
  mobileContent: {
    flex: 1,
  },
  drawer: {
    backgroundColor: '#fff',
    width: 280,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  drawerTitle: {
    marginLeft: 12,
    fontWeight: 'bold',
    color: osloBranding.colors.primary,
  },
  drawerItem: {
    marginHorizontal: 8,
  },
});

export default WebNavigation;

