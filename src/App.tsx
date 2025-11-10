import * as React from 'react';
import { useEffect, useState, useMemo, lazy, Suspense } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider, ActivityIndicator, Text, Button } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { auth, firebaseInitialized, getFirebaseError } from './services/firebase';
import WebNavigation from './components/WebNavigation';
import { saveUserToStorage, clearAuthStorage } from './services/authPersistence';
import { createOrUpdateUserProfile } from './services/userService';
import { ErrorBoundary } from './utils/errorBoundary';
import { safeLog, safeError } from './utils/performance';
import { FirebaseUser, LazyComponent } from './types';
import { analytics } from './utils/analytics';
import { createSkipLink } from './utils/accessibility';
import { useAppKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
// Firebase setup
import './services/firebase';
// Theme
import { theme, lightTheme, darkTheme, osloBranding } from './constants/theme';
import { useDarkMode } from './hooks/useDarkMode';

// Lazy load screens for better performance (only on web)
// Note: React.lazy only works on web, so we conditionally use it
// getLazyScreen removed - not used

// For web: use lazy loading
// For mobile: import normally
let LoginScreen: any;
let HomeScreen: any;
let VoteScreen: any;
let ProfileScreen: any;
let CommunityScreen: any;
let NewsScreen: any;
let ContactScreen: any;
let LocalHistoryScreen: any;
let CreatePollScreen: any;
let FeedbackScreen: any;
let OsloScreen: any;

if (Platform.OS === 'web') {
  LoginScreen = lazy(() => import('./screens/LoginScreen'));
  HomeScreen = lazy(() => import('./screens/HomeScreen'));
  VoteScreen = lazy(() => import('./screens/VoteScreen'));
  ProfileScreen = lazy(() => import('./screens/ProfileScreen'));
  CommunityScreen = lazy(() => import('./screens/CommunityScreen'));
  NewsScreen = lazy(() => import('./screens/NewsScreen'));
  ContactScreen = lazy(() => import('./screens/ContactScreen'));
  LocalHistoryScreen = lazy(() => import('./screens/LocalHistoryScreen'));
  CreatePollScreen = lazy(() => import('./screens/CreatePollScreen'));
  FeedbackScreen = lazy(() => import('./screens/FeedbackScreen'));
  OsloScreen = lazy(() => import('./screens/OsloScreen'));
} else {
  // Synchronous imports for mobile
  LoginScreen = require('./screens/LoginScreen').default;
  HomeScreen = require('./screens/HomeScreen').default;
  VoteScreen = require('./screens/VoteScreen').default;
  ProfileScreen = require('./screens/ProfileScreen').default;
  CommunityScreen = require('./screens/CommunityScreen').default;
  NewsScreen = require('./screens/NewsScreen').default;
  ContactScreen = require('./screens/ContactScreen').default;
  LocalHistoryScreen = require('./screens/LocalHistoryScreen').default;
  CreatePollScreen = require('./screens/CreatePollScreen').default;
  FeedbackScreen = require('./screens/FeedbackScreen').default;
  OsloScreen = require('./screens/OsloScreen').default;
}

// Loading component for lazy loaded screens
const ScreenLoader = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" />
  </View>
);

const Tab = createBottomTabNavigator();

const App = () => {
  const [user, setUser] = useState<FirebaseUser>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  const { isDarkMode } = useDarkMode();
  
  // Select theme based on dark mode
  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  // Setup keyboard shortcuts for web
  useAppKeyboardShortcuts();

  // Setup accessibility features for web
  useEffect(() => {
    if (Platform.OS === 'web') {
      createSkipLink();
      analytics.trackPageView('app_start');
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        safeLog(`Initialiserer autentisering... (Platform: ${Platform.OS})`);
        
        // Timeout removed - let app load without artificial timeout
        // App will show loading state until Firebase initializes
        
        // Sjekk om Firebase er initialisert
        const { firebaseInitialized, getFirebaseError } = await import('./services/firebase');
        if (!firebaseInitialized) {
          const error = getFirebaseError();
          const errorMessage = error?.message || 
            'Firebase er ikke initialisert. Sjekk at API-nøkler er satt riktig i app.local.json.';
          safeError('Firebase ikke initialisert:', errorMessage);
          setError(errorMessage);
          setAuthInitialized(true);
          setLoading(false);
          return; // Exit early, don't crash
        }
        
        if (!auth) {
          const errorMessage = 'Firebase Auth er ikke tilgjengelig. Sjekk konfigurasjon.';
          safeError('Firebase Auth mangler:', errorMessage);
          setError(errorMessage);
          setAuthInitialized(true);
          setLoading(false);
          return; // Exit early, don't crash
        }
        
        // Lytt til Firebase auth state changes
        const unsubscribe = auth.onAuthStateChanged(
          async (firebaseUser) => {
            safeLog('Firebase auth state endret:', firebaseUser?.email);
            
            if (firebaseUser) {
              // Lagre bruker lokalt
              await saveUserToStorage(firebaseUser);
              
              // Opprett/oppdater brukerprofil i Firestore
              try {
                await createOrUpdateUserProfile({
                  uid: firebaseUser.uid,
                  email: firebaseUser.email,
                  displayName: firebaseUser.displayName,
                  photoURL: firebaseUser.photoURL,
                });
              } catch (error) {
                safeError('Feil ved opprettelse av brukerprofil:', error);
                // Fortsett selv om profil-opprettelse feiler
              }
              
              setUser(firebaseUser);
            } else {
              // Fjern lagret bruker
              await clearAuthStorage();
              setUser(null);
            }
            
            setAuthInitialized(true);
            setLoading(false);
          },
          (err) => {
            safeError('Firebase auth feil:', err);
            setError('Feil med autentisering: ' + err.message);
            setAuthInitialized(true);
            setLoading(false);
          }
        );

        return () => {
          unsubscribe();
        };
      } catch (error) {
        safeError('Feil ved initialisering av auth:', error);
        setError('Feil ved oppstart av appen: ' + (error as Error).message);
        setAuthInitialized(true);
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setAuthInitialized(false);
    // Restart auth initialization
    setTimeout(() => {
      setLoading(false);
      setAuthInitialized(true);
    }, 100);
  };

  // Sjekk Firebase initialisering først
  if (!firebaseInitialized) {
    const firebaseError = getFirebaseError();
    // On web, show error immediately
    if (Platform.OS === 'web') {
      return (
        <SafeAreaProvider>
          <PaperProvider theme={theme}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
              <Icon name="alert-circle" size={48} color="#d32f2f" style={{ marginBottom: 16 }} />
              <Text variant="headlineSmall" style={{ marginBottom: 16, textAlign: 'center', color: '#c62828' }}>
                Konfigurasjonsfeil
              </Text>
              <Text variant="bodyMedium" style={{ marginBottom: 24, textAlign: 'center', color: '#666', maxWidth: 600 }}>
                {firebaseError?.message || 'Firebase er ikke konfigurert riktig. Sjekk at API-nøkler er satt i GitHub Secrets.'}
              </Text>
              <Text variant="bodySmall" style={{ marginBottom: 16, textAlign: 'center', color: '#999' }}>
                For å fikse dette:
              </Text>
              <Text variant="bodySmall" style={{ marginBottom: 8, textAlign: 'center', color: '#999' }}>
                1. Gå til GitHub repository Settings → Secrets
              </Text>
              <Text variant="bodySmall" style={{ marginBottom: 8, textAlign: 'center', color: '#999' }}>
                2. Sjekk at alle Firebase Secrets er satt
              </Text>
              <Text variant="bodySmall" style={{ marginBottom: 24, textAlign: 'center', color: '#999' }}>
                3. Trigger en ny deployment
              </Text>
              <Button 
                mode="contained" 
                onPress={() => {
                  if (typeof window !== 'undefined') {
                    window.location.reload();
                  }
                }}
              >
                Last på nytt
              </Button>
            </View>
          </PaperProvider>
        </SafeAreaProvider>
      );
    }
    // On mobile, show error
    return (
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <Icon name="alert-circle" size={48} color="#d32f2f" style={{ marginBottom: 16 }} />
            <Text variant="headlineSmall" style={{ marginBottom: 16, textAlign: 'center', color: '#c62828' }}>
              Konfigurasjonsfeil
            </Text>
            <Text variant="bodyMedium" style={{ marginBottom: 24, textAlign: 'center', color: '#666' }}>
              {firebaseError?.message || 'Firebase er ikke konfigurert riktig. Sjekk at API-nøkler er satt i GitHub Secrets.'}
            </Text>
            <Text variant="bodySmall" style={{ marginBottom: 16, textAlign: 'center', color: '#999' }}>
              For å fikse dette:
            </Text>
            <Text variant="bodySmall" style={{ marginBottom: 8, textAlign: 'center', color: '#999' }}>
              1. Gå til GitHub repository Settings → Secrets
            </Text>
            <Text variant="bodySmall" style={{ marginBottom: 8, textAlign: 'center', color: '#999' }}>
              2. Sjekk at alle Firebase Secrets er satt
            </Text>
            <Text variant="bodySmall" style={{ marginBottom: 24, textAlign: 'center', color: '#999' }}>
              3. Trigger en ny deployment
            </Text>
            <Button 
              mode="contained" 
              onPress={() => {
                if (typeof window !== 'undefined') {
                  window.location.reload();
                }
              }}
            >
              Last på nytt
            </Button>
          </View>
        </PaperProvider>
      </SafeAreaProvider>
    );
  }

  if (loading) {
    return (
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <ActivityIndicator 
            animating={true} 
            size="large" 
            style={{ flex: 1, marginTop: 100 }} 
          />
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            Starter OsloPuls...
          </Text>
        </PaperProvider>
      </SafeAreaProvider>
    );
  }

  if (error) {
    return (
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <Text style={{ color: 'red', margin: 40, textAlign: 'center' }}>
            {error}
          </Text>
          <Button 
            mode="contained" 
            onPress={handleRetry}
            style={{ margin: 40 }}
          >
            Prøv igjen
          </Button>
        </PaperProvider>
      </SafeAreaProvider>
    );
  }

  if (!authInitialized) {
    return (
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <ActivityIndicator 
            animating={true} 
            size="large" 
            style={{ flex: 1, marginTop: 100 }} 
          />
        </PaperProvider>
      </SafeAreaProvider>
    );
  }

  if (!user) {
    if (Platform.OS === 'web') {
      return (
        <Suspense fallback={<ScreenLoader />}>
          <LoginScreen />
        </Suspense>
      );
    }
    return <LoginScreen />;
  }

  // Memoize screen options for better performance
  const screenOptions = useMemo(() => ({
    tabBarIcon: ({ focused, color, size, route }: any) => {
      let iconName: string;
      if (route.name === 'Hjem') {
        iconName = focused ? 'home' : 'home-outline';
      } else if (route.name === 'Stem') {
        iconName = focused ? 'vote' : 'vote-outline';
      } else if (route.name === 'Fellesskap') {
        iconName = focused ? 'account-group' : 'account-group-outline';
      } else if (route.name === 'Nyheter') {
        iconName = focused ? 'newspaper' : 'newspaper-outline';
      } else if (route.name === 'Profil') {
        iconName = focused ? 'account' : 'account-outline';
      } else if (route.name === 'Kontakt') {
        iconName = focused ? 'email' : 'email-outline';
      } else if (route.name === 'Lokalhistorie') {
        iconName = 'history';
      } else if (route.name === 'Opprett') {
        iconName = focused ? 'plus-circle' : 'plus-circle-outline';
      } else if (route.name === 'Rapporter') {
        iconName = focused ? 'bug' : 'bug-outline';
      } else {
        iconName = 'help';
      }
      return <Icon name={iconName} size={size} color={color} />;
    },
    tabBarActiveTintColor: osloBranding.colors.primary,
    tabBarInactiveTintColor: osloBranding.colors.textSecondary,
    tabBarStyle: {
      height: 60,
      paddingBottom: 8,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: '#E0E0E0',
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    tabBarLabelStyle: {
      fontSize: 12,
      fontWeight: '500' as const,
    },
    tabBarIconStyle: {
      marginTop: 4,
    },
    headerStyle: {
      backgroundColor: theme.colors.primary,
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold' as const,
    },
  }), []);

  // Wrapper component for lazy loaded screens (only on web)
  const LazyScreen = ({ Component, ...props }: { Component: LazyComponent; [key: string]: unknown }) => {
    if (Platform.OS === 'web' && Component && typeof (Component as any).then === 'function') {
      // Lazy loaded component
      return (
        <Suspense fallback={<ScreenLoader />}>
          <Component {...props} />
        </Suspense>
      );
    }
    // Regular component (mobile or already loaded)
    return <Component {...props} />;
  };

  const renderNavigation = () => {
    const tabNavigator = (
      <Tab.Navigator screenOptions={screenOptions}>
              <Tab.Screen 
                name="Hjem" 
                options={{ title: osloBranding.logo.text }}
              >
                {() => <LazyScreen Component={HomeScreen} />}
              </Tab.Screen>
              <Tab.Screen 
                name="Stem" 
                options={{ title: 'Stem på temaer' }}
              >
                {() => <LazyScreen Component={VoteScreen} />}
              </Tab.Screen>
              <Tab.Screen 
                name="Fellesskap" 
                options={{ title: 'Fellesskap' }}
              >
                {() => <LazyScreen Component={CommunityScreen} />}
              </Tab.Screen>
              <Tab.Screen 
                name="Nyheter" 
                options={{ title: 'Nyheter' }}
              >
                {() => <LazyScreen Component={NewsScreen} />}
              </Tab.Screen>
              <Tab.Screen 
                name="Profil" 
                options={{ title: 'Min profil' }}
              >
                {() => <LazyScreen Component={ProfileScreen} />}
              </Tab.Screen>
              <Tab.Screen 
                name="Kontakt" 
                options={{ title: 'Kontakt' }}
              >
                {() => <LazyScreen Component={ContactScreen} />}
              </Tab.Screen>
              <Tab.Screen 
                name="Lokalhistorie" 
                options={{ title: 'Lokalhistorie' }}
              >
                {() => <LazyScreen Component={LocalHistoryScreen} />}
              </Tab.Screen>
              <Tab.Screen 
                name="Opprett" 
                options={{ title: 'Opprett avstemning' }}
              >
                {() => <LazyScreen Component={CreatePollScreen} />}
              </Tab.Screen>
              <Tab.Screen 
                name="Rapporter" 
                options={{ title: 'Rapporter feil' }}
              >
                {() => <LazyScreen Component={FeedbackScreen} />}
              </Tab.Screen>
              <Tab.Screen 
                name="Oslo" 
                options={{ title: 'Oslo' }}
              >
                {() => <LazyScreen Component={OsloScreen} />}
              </Tab.Screen>
            </Tab.Navigator>
    );

    // Use WebNavigation on web, regular Tab.Navigator on mobile
    if (Platform.OS === 'web') {
      return (
        <WebNavigation>
          <NavigationContainer
            onStateChange={(state) => {
              safeLog('Navigation state changed:', state);
              // Track navigation in analytics
              const currentRoute = state?.routes[state.index];
              if (currentRoute) {
                analytics.trackNavigation('previous', currentRoute.name);
              }
            }}
          >
            {tabNavigator}
          </NavigationContainer>
        </WebNavigation>
      );
    }

    return (
      <NavigationContainer
        onStateChange={(state) => {
          safeLog('Navigation state changed:', state);
          // Track navigation in analytics
          const currentRoute = state?.routes[state.index];
          if (currentRoute) {
            analytics.trackNavigation('previous', currentRoute.name);
          }
        }}
      >
        {tabNavigator}
      </NavigationContainer>
    );
  };

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <PaperProvider theme={currentTheme}>
          {renderNavigation()}
        </PaperProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
};

export default App; 