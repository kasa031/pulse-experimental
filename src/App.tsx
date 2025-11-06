import * as React from 'react';
import { useEffect, useState, useMemo } from 'react';
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
import { FirebaseUser, TabBarIconProps } from './types';
import LoginScreen from './screens/LoginScreen';
// Screens
import HomeScreen from './screens/HomeScreen';
import VoteScreen from './screens/VoteScreen';
import ProfileScreen from './screens/ProfileScreen';
import CommunityScreen from './screens/CommunityScreen';
import NewsScreen from './screens/NewsScreen';
import ContactScreen from './screens/ContactScreen';
import LocalHistoryScreen from './screens/LocalHistoryScreen';
import CreatePollScreen from './screens/CreatePollScreen';
// Firebase setup
import './services/firebase';
// Theme
import { theme, osloBranding } from './constants/theme';

const Tab = createBottomTabNavigator();

const App = () => {
  const [user, setUser] = useState<FirebaseUser>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        safeLog('Initialiserer autentisering...');
        
        // Sjekk om Firebase er initialisert
        const { firebaseInitialized, getFirebaseError } = await import('./services/firebase');
        if (!firebaseInitialized) {
          const error = getFirebaseError();
          const errorMessage = error?.message || 
            'Firebase er ikke initialisert. Sjekk at API-nøkler er satt riktig i GitHub Secrets.';
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
        const unsubscribe = auth!.onAuthStateChanged(
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

        return unsubscribe;
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
    return <LoginScreen />;
  }

  // Memoize screen options for better performance
  const screenOptions = useMemo(() => ({
    tabBarIcon: ({ focused, color, size, route }: { focused: boolean; color: string; size: number; route: { name: string } }) => {
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

  const renderNavigation = () => {
    const tabNavigator = (
      <Tab.Navigator screenOptions={screenOptions}>
              <Tab.Screen 
                name="Hjem" 
                component={HomeScreen}
                options={{ title: osloBranding.logo.text }}
              />
              <Tab.Screen 
                name="Stem" 
                component={VoteScreen}
                options={{ title: 'Stem på temaer' }}
              />
              <Tab.Screen 
                name="Fellesskap" 
                component={CommunityScreen}
                options={{ title: 'Fellesskap' }}
              />
              <Tab.Screen 
                name="Nyheter" 
                component={NewsScreen}
                options={{ title: 'Nyheter' }}
              />
              <Tab.Screen 
                name="Profil" 
                component={ProfileScreen}
                options={{ title: 'Min profil' }}
              />
              <Tab.Screen 
                name="Kontakt" 
                component={ContactScreen}
                options={{ title: 'Kontakt' }}
              />
              <Tab.Screen 
                name="Lokalhistorie" 
                component={LocalHistoryScreen}
                options={{ title: 'Lokalhistorie' }}
              />
              <Tab.Screen 
                name="Opprett" 
                component={CreatePollScreen}
                options={{ title: 'Opprett avstemning' }}
              />
            </Tab.Navigator>
    );

    // Use WebNavigation on web, regular Tab.Navigator on mobile
    if (Platform.OS === 'web') {
      return (
        <WebNavigation>
          <NavigationContainer
            onStateChange={(state) => safeLog('Navigation state changed:', state)}
          >
            {tabNavigator}
          </NavigationContainer>
        </WebNavigation>
      );
    }

    return (
      <NavigationContainer
        onStateChange={(state) => safeLog('Navigation state changed:', state)}
      >
        {tabNavigator}
      </NavigationContainer>
    );
  };

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          {renderNavigation()}
        </PaperProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
};

export default App; 