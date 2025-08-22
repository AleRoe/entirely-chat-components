// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * Development-aware logging utility
 * Prevents console logs in production builds
 */

const isDev = typeof window !== 'undefined' && 
  (window as any).__VITE_DEV_MODE__ || 
  (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') ||
  (import.meta as any).env?.DEV;

export const logger = {
  log: (...args: any[]) => isDev && console.log(...args),
  warn: (...args: any[]) => isDev && console.warn(...args),
  error: (...args: any[]) => console.error(...args), // Always log errors
  info: (...args: any[]) => isDev && console.info(...args),
  debug: (...args: any[]) => isDev && console.debug(...args),
};

export default logger;
