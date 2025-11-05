import * as React from 'react';
import { useEffect, useState, useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider, ActivityIndicator, Text, Button } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { auth } from './services/firebase';
import { saveUserToStorage, clearAuthStorage } from './services/authPersistence';
import { ErrorBoundary } from './utils/errorBoundary';
import { safeLog, safeError } from './utils/performance';
import LoginScreen from './screens/LoginScreen';
// Screens
import HomeScreen from './screens/HomeScreen';
import VoteScreen from './screens/VoteScreen';
import ProfileScreen from './screens/ProfileScreen';
import CommunityScreen from './screens/CommunityScreen';
import LocalHistoryScreen from './screens/LocalHistoryScreen';
// Firebase setup
import './services/firebase';
// Theme
import { theme, osloBranding } from './constants/theme';

const Tab = createBottomTabNavigator();

const App = () => {
  const [user, setUser] = useState<any>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        safeLog('Initialiserer autentisering...');
        
        // Lytt til Firebase auth state changes
        const unsubscribe = auth.onAuthStateChanged(
          async (firebaseUser) => {
            safeLog('Firebase auth state endret:', firebaseUser?.email);
            
            if (firebaseUser) {
              // Lagre bruker lokalt
              await saveUserToStorage(firebaseUser);
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
            Starter Pulse Oslo...
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
    tabBarIcon: ({ focused, color, size, route }: any) => {
      let iconName: string;
      if (route.name === 'Hjem') {
        iconName = focused ? 'home' : 'home-outline';
      } else if (route.name === 'Stem') {
        iconName = focused ? 'vote' : 'vote-outline';
      } else if (route.name === 'Fellesskap') {
        iconName = focused ? 'account-group' : 'account-group-outline';
      } else if (route.name === 'Profil') {
        iconName = focused ? 'account' : 'account-outline';
      } else if (route.name === 'Lokalhistorie') {
        iconName = 'history';
      } else {
        iconName = 'help';
      }
      return <Icon name={iconName} size={size} color={color} />;
    },
    tabBarActiveTintColor: osloBranding.colors.primary,
    tabBarInactiveTintColor: osloBranding.colors.textSecondary,
    headerStyle: {
      backgroundColor: theme.colors.primary,
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold' as const,
    },
  }), []);

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <NavigationContainer
            onStateChange={(state) => safeLog('Navigation state changed:', state)}
          >
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
                name="Profil" 
                component={ProfileScreen}
                options={{ title: 'Min profil' }}
              />
              <Tab.Screen 
                name="Lokalhistorie" 
                component={LocalHistoryScreen}
                options={{ title: 'Lokalhistorie' }}
              />
            </Tab.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
};

export default App; 