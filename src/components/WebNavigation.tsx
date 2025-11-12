/**
 * WebNavigation - Responsiv navigasjon for web med hover-meny
 * Viser sidebar på desktop og hamburger-meny på mobil
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform, useWindowDimensions, TouchableOpacity, Image } from 'react-native';
import { Drawer, Portal, Text, Surface, Modal, Switch } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { osloBranding } from '../constants/theme';
import { useDarkMode } from '../hooks/useDarkMode';
import { getAriaProps, getKeyboardProps } from '../utils/accessibility';
import { analytics } from '../utils/analytics';
import { NavigationProps, RouteProps, RootStackParamList } from '../types';
import { safeError, safeWarn } from '../utils/performance';

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
  { name: 'Oslo', title: 'Oslo', icon: 'city-variant-outline', iconFocused: 'city-variant' },
  { name: 'Profil', title: 'Profil', icon: 'account-outline', iconFocused: 'account' },
  { name: 'Kontakt', title: 'Kontakt', icon: 'email-outline', iconFocused: 'email' },
  { name: 'Lokalhistorie', title: 'Lokalhistorie', icon: 'history', iconFocused: 'history' },
  { name: 'Opprett', title: 'Opprett', icon: 'plus-circle-outline', iconFocused: 'plus-circle' },
  { name: 'Rapporter', title: 'Rapporter', icon: 'bug-outline', iconFocused: 'bug' },
];

interface WebNavigationProps {
  children: React.ReactNode;
}

const WebNavigation = ({ children }: WebNavigationProps) => {
  // Safely get navigation and route - wrap in try-catch for safety
  let navigation: NavigationProps | null = null;
  let route: RouteProps | null = null;
  
  try {
    const nav = useNavigation();
    const rt = useRoute();
    navigation = {
      navigate: (screen: string) => {
        if (nav && 'navigate' in nav && typeof (nav as any).navigate === 'function') {
          (nav as any).navigate(screen);
        }
      },
      addListener: nav && 'addListener' in nav ? (nav as any).addListener : undefined,
    };
    route = {
      name: rt?.name || '',
      key: rt?.key,
      params: rt?.params as Record<string, unknown> | undefined,
    };
  } catch (error) {
    // Navigation context not available yet - return children
    safeWarn('Navigation not ready in WebNavigation:', error);
    return <>{children}</>;
  }

  const { width } = useWindowDimensions();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const { isDarkMode, toggleDarkMode } = useDarkMode();
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
        safeWarn('Error setting up navigation listener:', error);
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
        navigation.navigate(screenName as keyof RootStackParamList);
        analytics.trackNavigation('current', screenName);
        if (!isDesktop) {
          setDrawerOpen(false);
        }
      } catch (error) {
        safeError('Navigation error:', error);
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
        {...(Platform.OS === 'web' ? {
          onMouseEnter: () => setHoveredItem(item.name),
          onMouseLeave: () => setHoveredItem(null),
          ...getAriaProps(`Naviger til ${item.title}`, 'button'),
          ...getKeyboardProps(() => handleNavigate(item.name)),
        } : {})}
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
        <Surface style={styles.sidebar} elevation={2} {...(Platform.OS === 'web' ? { role: 'navigation', 'aria-label': 'Hovednavigasjon' } : {})}>
          <View style={styles.sidebarHeader}>
            <Image 
              source={require('../../assets/oslo-logo.png')} 
              style={styles.sidebarLogo}
              resizeMode="contain"
              {...(Platform.OS === 'web' ? { 'aria-label': 'OsloPuls logo' } : {})}
            />
            <Text variant="titleMedium" style={styles.sidebarTitle}>
              OsloPuls
            </Text>
          </View>
          <View style={styles.navList}>
            {navItems.map((item) => {
              const isActive = currentRouteName === item.name;
              return renderNavItem(item, isActive);
            })}
          </View>
          <View style={styles.darkModeToggle}>
            <Icon 
              name={isDarkMode ? 'weather-night' : 'weather-sunny'} 
              size={20} 
              color={osloBranding.colors.text} 
            />
            <Text style={styles.darkModeLabel}>Mørk modus</Text>
            <Switch 
              value={isDarkMode} 
              onValueChange={toggleDarkMode}
              color={osloBranding.colors.primary}
            />
          </View>
        </Surface>
        <View style={styles.contentArea} {...(Platform.OS === 'web' ? { id: 'main-content', role: 'main' } : {})}>
          {children}
        </View>
      </View>
    );
  }

  // Tablet/Mobile: Hamburger menu
  return (
    <View style={styles.mobileContainer}>
      <Portal>
        <Modal
          visible={drawerOpen}
          onDismiss={() => setDrawerOpen(false)}
          contentContainerStyle={styles.drawer}
        >
          <View style={styles.drawerHeader}>
            <Icon name="city-variant" size={32} color={osloBranding.colors.primary} />
            <Text variant="titleLarge" style={styles.drawerTitle}>
              OsloPuls
            </Text>
          </View>
          <Drawer.Section>
            {navItems.map((item) => {
              const isActive = (route?.name || '') === item.name;
              return (
                <Drawer.Item
                  key={item.name}
                  label={item.title}
                  icon={isActive ? item.iconFocused : item.icon}
                  active={isActive}
                  onPress={() => {
                    handleNavigate(item.name);
                    setDrawerOpen(false);
                  }}
                  style={styles.drawerItem}
                />
              );
            })}
          </Drawer.Section>
        </Modal>
      </Portal>
      
      <Surface style={styles.mobileHeader} elevation={2}>
        <TouchableOpacity
          onPress={() => setDrawerOpen(true)}
          style={styles.menuButton}
          {...(Platform.OS === 'web' ? {
            ...getAriaProps('Åpne meny', 'button'),
            ...getKeyboardProps(() => setDrawerOpen(true)),
          } : {})}
        >
          <Icon name="menu" size={24} color={osloBranding.colors.text} />
        </TouchableOpacity>
        <Text variant="titleMedium" style={styles.mobileTitle}>
          OsloPuls
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
  sidebarLogo: {
    width: 40,
    height: 40,
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
  } as any,
  navItemActive: {
    backgroundColor: osloBranding.colors.primary + '15',
  },
  navItemHovered: {
    backgroundColor: osloBranding.colors.primary + '10',
    transform: [{ translateX: 2 }],
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
    padding: 12,
    marginRight: 8,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
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
    maxWidth: '85%',
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
  darkModeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 'auto',
    marginBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  darkModeLabel: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: osloBranding.colors.text,
  },
});

export default WebNavigation;

