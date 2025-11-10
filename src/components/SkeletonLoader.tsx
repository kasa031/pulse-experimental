/**
 * Skeleton Loader Component
 * Viser skeleton loading states for bedre UX
 */

import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useDarkMode } from '../hooks/useDarkMode';
import { theme } from '../constants/theme';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
}) => {
  const { isDarkMode } = useDarkMode();
  const backgroundColor = isDarkMode ? '#2a2a2a' : '#e0e0e0';

  return (
    <View
      style={[
        {
          width,
          height,
          backgroundColor,
          borderRadius,
        },
        style,
        Platform.OS === 'web' && {
          animation: 'pulse 1.5s ease-in-out infinite',
        },
      ]}
    />
  );
};

interface SkeletonCardProps {
  lines?: number;
  showImage?: boolean;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  lines = 3,
  showImage = false,
}) => {
  return (
    <View style={styles.card}>
      {showImage && (
        <SkeletonLoader
          width="100%"
          height={200}
          borderRadius={8}
          style={styles.image}
        />
      )}
      <SkeletonLoader width="80%" height={24} style={styles.title} />
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLoader
          key={i}
          width={i === lines - 1 ? '60%' : '100%'}
          height={16}
          style={styles.line}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    ...(Platform.OS === 'web' ? { boxShadow: '0 2px 4px rgba(0,0,0,0.1)' } : { elevation: 2 }),
  },
  image: {
    marginBottom: 12,
  },
  title: {
    marginBottom: 12,
  },
  line: {
    marginBottom: 8,
  },
});

