import React, { useState, useEffect } from 'react';
import { View, Platform } from 'react-native';
import { Card, Text, Button, IconButton, Dialog, Portal, Divider } from 'react-native-paper';
import { useDarkMode } from '../hooks/useDarkMode';
import { osloBranding } from '../constants/theme';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface BrowserInfo {
  name: string;
  isChrome: boolean;
  isBrave: boolean;
  isEdge: boolean;
  isFirefox: boolean;
  isSafari: boolean;
}

/**
 * Detect operating system and browser based on user agent
 * 
 * @returns Object with detected OS and browser information
 * @example
 * const { os, browser } = detectPlatform();
 * // os: 'windows' | 'ios' | 'android' | 'mac' | 'linux' | 'unknown'
 * // browser: { name: 'Chrome', isChrome: true, ... }
 */
const detectPlatform = (): { os: 'windows' | 'ios' | 'android' | 'mac' | 'linux' | 'unknown', browser: BrowserInfo } => {
  if (Platform.OS !== 'web' || typeof window === 'undefined' || typeof navigator === 'undefined') {
    return { os: 'unknown', browser: { name: 'Unknown', isChrome: false, isBrave: false, isEdge: false, isFirefox: false, isSafari: false } };
  }

  const ua = navigator.userAgent.toLowerCase();
  
  // Detect OS
  let os: 'windows' | 'ios' | 'android' | 'mac' | 'linux' | 'unknown' = 'unknown';
  if (/windows/.test(ua)) os = 'windows';
  else if (/iphone|ipad|ipod/.test(ua) && !(window as any).MSStream) os = 'ios';
  else if (/android/.test(ua)) os = 'android';
  else if (/macintosh|mac os x/.test(ua)) os = 'mac';
  else if (/linux/.test(ua)) os = 'linux';

  // Detect browser
  const isBrave = (navigator as any).brave !== undefined;
  const isChrome = /chrome/.test(ua) && !isBrave && !/edg/.test(ua);
  const isEdge = /edg/.test(ua);
  const isFirefox = /firefox/.test(ua);
  const isSafari = /safari/.test(ua) && !/chrome/.test(ua) && !isBrave;

  let browserName = 'Unknown';
  if (isBrave) browserName = 'Brave';
  else if (isChrome) browserName = 'Chrome';
  else if (isEdge) browserName = 'Edge';
  else if (isFirefox) browserName = 'Firefox';
  else if (isSafari) browserName = 'Safari';

  return {
    os,
    browser: {
      name: browserName,
      isChrome,
      isBrave,
      isEdge,
      isFirefox,
      isSafari,
    }
  };
};

/**
 * InstallPrompt - Component for adding the app to desktop/home screen
 * 
 * Works on Windows (desktop + taskbar) and iOS (home screen).
 * Supports all browsers: Chrome, Brave, Edge, Firefox, Safari.
 * 
 * The component:
 * - Automatically detects OS and browser
 * - Shows native install prompt for Windows/Chrome/Edge (if supported)
 * - Shows detailed instructions for iOS and other browsers
 * - Automatically hides if the app is already installed
 * - Can be dismissed, and won't show again for 7 days
 * 
 * @example
 * ```tsx
 * <InstallPrompt />
 * ```
 * 
 * @returns React component that shows install prompt or null if already installed
 */
export const InstallPrompt: React.FC = () => {
  const { isDarkMode: isDark } = useDarkMode();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [platform, setPlatform] = useState<{ os: string, browser: BrowserInfo }>({ os: 'unknown', browser: { name: 'Unknown', isChrome: false, isBrave: false, isEdge: false, isFirefox: false, isSafari: false } });

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      return;
    }

    const detected = detectPlatform();
    setPlatform(detected);

    // Check if app is already installed
    const isStandalone = 
      (window.matchMedia('(display-mode: standalone)').matches) ||
      ((window.navigator as any).standalone === true);
    
    setIsInstalled(isStandalone);

    // For Windows/Chrome/Edge: Listen to beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Show prompt automatically after 3 seconds if not installed
    if (!isStandalone) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        clearTimeout(timer);
      };
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // If already installed, don't show anything
  if (isInstalled) {
    return null;
  }

  // If not supposed to show, don't show
  if (!showPrompt) {
    return null;
  }

  const handleInstall = async () => {
    // For Windows/Chrome/Edge: Use native prompt
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setShowPrompt(false);
          setDeferredPrompt(null);
        }
      } catch (error) {
        console.error('Install prompt error:', error);
      }
      return;
    }

    // For iOS/Windows without native prompt: Show instructions
    setShowInstructions(true);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Save to localStorage that user has dismissed
    if (Platform.OS === 'web' && typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem('installPromptDismissed', Date.now().toString());
    }
  };

  // Check if user has dismissed before (don't show again until after 7 days)
  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const dismissed = localStorage.getItem('installPromptDismissed');
      if (dismissed) {
        const dismissedTime = parseInt(dismissed, 10);
        const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
        if (daysSinceDismissed < 7) {
          setShowPrompt(false);
        }
      }
    }
  }, []);

  // Generate instructions based on OS and browser
  const getInstructions = (): string[] => {
    const { os, browser } = platform;
    
    if (os === 'windows') {
      const instructions: string[] = [];
      
      // Instructions for adding to desktop
      if (browser.isChrome || browser.isBrave) {
        instructions.push('📋 Add to desktop:');
        instructions.push('');
        instructions.push('1. Click the share button (⋮) in the top right of the browser');
        instructions.push('2. Select "Install app" or "Add to desktop"');
        instructions.push('3. Click "Install" in the popup window');
        instructions.push('');
      } else if (browser.isEdge) {
        instructions.push('📋 Add to desktop:');
        instructions.push('');
        instructions.push('1. Click the share button (⋯) in the top right');
        instructions.push('2. Select "Apps" → "Install this site as an app"');
        instructions.push('3. Click "Install"');
        instructions.push('');
      } else if (browser.isFirefox) {
        instructions.push('📋 Add to desktop:');
        instructions.push('');
        instructions.push('1. Click the menu button (☰) in the top right');
        instructions.push('2. Select "More tools" → "Add to desktop"');
        instructions.push('3. Confirm the installation');
        instructions.push('');
      }
      
      // Instructions for taskbar pinning
      instructions.push('📌 Add to taskbar:');
      instructions.push('');
      instructions.push('1. After the app is installed, find the OsloPuls icon on the desktop');
      instructions.push('2. Right-click on the icon');
      instructions.push('3. Select "Add to taskbar" or "Pin to taskbar"');
      instructions.push('');
      
      return instructions;
    } else if (os === 'ios') {
      const instructions: string[] = [];
      
      if (browser.isBrave) {
        instructions.push('📱 Add to home screen in Brave:');
        instructions.push('');
        instructions.push('1. Tap the share button (⬆️) at the bottom of the screen');
        instructions.push('2. Scroll down in the share menu');
        instructions.push('3. Find and tap "Add to Home Screen"');
        instructions.push('4. Tap "Add" in the top right');
      } else if (browser.isSafari) {
        instructions.push('📱 Add to home screen in Safari:');
        instructions.push('');
        instructions.push('1. Tap the share button (⬆️) at the bottom of the screen');
        instructions.push('2. Select "Add to Home Screen"');
        instructions.push('3. Tap "Add" in the top right');
      } else if (browser.isChrome) {
        instructions.push('📱 Add to home screen in Chrome:');
        instructions.push('');
        instructions.push('1. Tap the menu button (⋮) in the top right');
        instructions.push('2. Select "Add to Home Screen"');
        instructions.push('3. Tap "Add"');
      } else {
        instructions.push('📱 Add to home screen:');
        instructions.push('');
        instructions.push('1. Tap the share button in the browser');
        instructions.push('2. Find "Add to Home Screen"');
        instructions.push('3. Follow the instructions to add');
      }
      
      return instructions;
    } else {
      // Android or other
      return [
        '📱 Add the app:',
        '',
        '1. Tap the share button in the browser',
        '2. Select "Add to Home Screen" or "Install app"',
        '3. Follow the instructions',
      ];
    }
  };

  const instructions = getInstructions();
  const isWindows = platform.os === 'windows';
  const isIOS = platform.os === 'ios';
  const title = isWindows ? 'Add to desktop' : isIOS ? 'Add to home screen' : 'Install app';
  const buttonText = deferredPrompt 
    ? (isWindows ? 'Install to desktop' : 'Add to home screen')
    : 'Show instructions';

  return (
    <>
      <Card 
        style={{ 
          margin: 16, 
          backgroundColor: isDark ? '#1E1E1E' : '#ffffff',
          elevation: 4
        }}
      >
        <Card.Content>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <IconButton 
              icon={isWindows ? "desktop-windows" : "cellphone"} 
              iconColor={osloBranding.colors.primary}
              size={24}
            />
            <Text 
              variant="titleMedium" 
              style={{ 
                flex: 1, 
                color: isDark ? '#E0E0E0' : '#000000',
                fontWeight: 'bold'
              }}
            >
              {title}
            </Text>
            <IconButton 
              icon="close" 
              size={20}
              onPress={handleDismiss}
              iconColor={isDark ? '#E0E0E0' : '#666666'}
            />
          </View>
          <Text 
            variant="bodyMedium" 
            style={{ 
              marginBottom: 16,
              color: isDark ? '#CCCCCC' : '#666666'
            }}
          >
            {isWindows 
              ? 'Get faster access to OsloPuls by adding it to your desktop and taskbar. You can also pin it to the taskbar for even faster access.'
              : 'Get faster access to OsloPuls by adding it to your home screen. The app will work like a regular app.'
            }
            {!deferredPrompt && ' Click the button below for detailed instructions.'}
          </Text>
          <Button
            mode="contained"
            onPress={handleInstall}
            style={{
              backgroundColor: osloBranding.colors.primary,
              marginTop: 8
            }}
            icon={isWindows ? "desktop-windows" : "cellphone"}
          >
            {buttonText}
          </Button>
        </Card.Content>
      </Card>

      <Portal>
        <Dialog 
          visible={showInstructions} 
          onDismiss={() => setShowInstructions(false)}
          style={{ maxWidth: 500, alignSelf: 'center' }}
        >
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Content>
            <View style={{ marginBottom: 8 }}>
              <Text variant="bodySmall" style={{ 
                color: isDark ? '#999999' : '#666666',
                marginBottom: 12,
                fontStyle: 'italic'
              }}>
                Browser: {platform.browser.name} • OS: {platform.os === 'windows' ? 'Windows' : platform.os === 'ios' ? 'iOS' : platform.os}
              </Text>
            </View>
            <Divider style={{ marginBottom: 12 }} />
            {instructions.map((line, i) => (
              <Text 
                key={i} 
                variant={line.startsWith('📋') || line.startsWith('📱') || line.startsWith('📌') ? "titleSmall" : "bodyMedium"} 
                style={{ 
                  color: isDark ? '#E0E0E0' : '#000000',
                  marginBottom: line.trim() === '' ? 8 : 4,
                  fontWeight: line.startsWith('📋') || line.startsWith('📱') || line.startsWith('📌') ? 'bold' : 'normal'
                }}
              >
                {line || ' '}
              </Text>
            ))}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowInstructions(false)}>
              Close
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};
