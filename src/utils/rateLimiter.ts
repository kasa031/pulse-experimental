/**
 * Rate Limiting Utility
 * Client-side rate limiting to prevent spam and DoS attacks
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const RATE_LIMIT_PREFIX = '@rate_limit_';

/**
 * Rate limit config per action type
 */
const RATE_LIMITS = {
  vote: { maxRequests: 10, windowMs: 60 * 1000 }, // 10 votes per minute
  login: { maxRequests: 5, windowMs: 15 * 60 * 1000 }, // 5 logins per 15 min
  signup: { maxRequests: 3, windowMs: 60 * 60 * 1000 }, // 3 signups per hour
  pollCreate: { maxRequests: 5, windowMs: 60 * 60 * 1000 }, // 5 polls per hour
} as const;

type RateLimitType = keyof typeof RATE_LIMITS;

/**
 * Check if an action is allowed based on rate limiting
 */
export const checkRateLimit = async (
  type: RateLimitType,
  identifier?: string // User ID or IP
): Promise<{ allowed: boolean; remaining?: number; resetAt?: number }> => {
  try {
    const limit = RATE_LIMITS[type];
    const key = `${RATE_LIMIT_PREFIX}${type}_${identifier || 'global'}`;
    
    const stored = await AsyncStorage.getItem(key);
    const now = Date.now();

    if (!stored) {
      // First request
      await AsyncStorage.setItem(key, JSON.stringify({
        count: 1,
        resetAt: now + limit.windowMs,
      }));
      return { allowed: true, remaining: limit.maxRequests - 1 };
    }

    const entry: RateLimitEntry = JSON.parse(stored);

    // If window has expired, reset
    if (now > entry.resetAt) {
      await AsyncStorage.setItem(key, JSON.stringify({
        count: 1,
        resetAt: now + limit.windowMs,
      }));
      return { allowed: true, remaining: limit.maxRequests - 1 };
    }

    // Check if limit is reached
    if (entry.count >= limit.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: entry.resetAt,
      };
    }

    // Increment counter
    entry.count += 1;
    await AsyncStorage.setItem(key, JSON.stringify(entry));

    return {
      allowed: true,
      remaining: limit.maxRequests - entry.count,
      resetAt: entry.resetAt,
    };
  } catch (error) {
    // On error, allow action (fail-open)
    const { safeError } = require('./performance');
    safeError('Rate limit check failed:', error);
    return { allowed: true };
  }
};

/**
 * Reset rate limit for a type
 */
export const resetRateLimit = async (type: RateLimitType, identifier?: string): Promise<void> => {
  try {
    const key = `${RATE_LIMIT_PREFIX}${type}_${identifier || 'global'}`;
    await AsyncStorage.removeItem(key);
  } catch (error) {
    const { safeError } = require('./performance');
    safeError('Rate limit reset failed:', error);
  }
};

/**
 * Get remaining count for a type
 */
export const getRateLimitInfo = async (
  type: RateLimitType,
  identifier?: string
): Promise<{ remaining: number; resetAt: number } | null> => {
  try {
    const limit = RATE_LIMITS[type];
    const key = `${RATE_LIMIT_PREFIX}${type}_${identifier || 'global'}`;
    const stored = await AsyncStorage.getItem(key);

    if (!stored) {
      return { remaining: limit.maxRequests, resetAt: Date.now() + limit.windowMs };
    }

    const entry: RateLimitEntry = JSON.parse(stored);
    const now = Date.now();

    if (now > entry.resetAt) {
      return { remaining: limit.maxRequests, resetAt: now + limit.windowMs };
    }

    return {
      remaining: Math.max(0, limit.maxRequests - entry.count),
      resetAt: entry.resetAt,
    };
  } catch (error) {
    const { safeError } = require('./performance');
    safeError('Rate limit info failed:', error);
    return null;
  }
};

