import { useState, useEffect } from 'react';
import { Platform } from 'react-native';

const DARK_MODE_KEY = 'oslopuls-dark-mode';

export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      return; // Only for web
    }

    // Check localStorage first
    const saved = localStorage.getItem(DARK_MODE_KEY);
    if (saved !== null) {
      setIsDarkMode(saved === 'true');
      return;
    }

    // Fallback to system preference
    if (typeof window !== 'undefined' && window.matchMedia) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }
  }, []);

  const toggleDarkMode = () => {
    if (Platform.OS !== 'web') {
      return;
    }
    const newValue = !isDarkMode;
    setIsDarkMode(newValue);
    localStorage.setItem(DARK_MODE_KEY, String(newValue));
    
    // Update HTML class for CSS
    if (typeof document !== 'undefined') {
      if (newValue) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  useEffect(() => {
    if (Platform.OS !== 'web') {
      return;
    }
    // Apply dark mode class on mount and when it changes
    if (typeof document !== 'undefined') {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isDarkMode]);

  return { isDarkMode, toggleDarkMode };
};

