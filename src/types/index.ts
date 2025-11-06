/**
 * Type definitions for Pulse Oslo
 */

import { User } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';

// Firebase User type
export type FirebaseUser = User | null;

// Error types
export interface AppError {
  message: string;
  code?: string;
  details?: unknown;
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NetworkError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class FirebaseError extends Error {
  constructor(message: string, public code?: string, public originalError?: unknown) {
    super(message);
    this.name = 'FirebaseError';
  }
}

// Firebase Config type
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Navigation types
export interface TabBarIconProps {
  focused: boolean;
  color: string;
  size: number;
  route: {
    name: string;
    key?: string;
    params?: Record<string, unknown>;
  };
}

// Common utility types
export type AsyncResult<T> = Promise<T>;
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;

