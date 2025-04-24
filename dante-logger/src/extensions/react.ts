/**
 * Dante Logger React Integration
 *
 * This module provides hooks and components for integrating Dante Logger with React applications.
 *
 * NOTE: This implementation is disabled for Next.js build compatibility.
 * This is a stub file to prevent build errors.
 */

import { ReactNode } from 'react';
import { DanteLogger } from '../index';
import { DanteLoggerConfig } from '../core/config';

/**
 * Props for the DanteLoggerProvider component (stub interface)
 */
export interface DanteLoggerProviderProps {
  config?: Partial<DanteLoggerConfig>;
  children: ReactNode;
}

/**
 * Provider component for Dante Logger (stub implementation)
 */
export function DanteLoggerProvider({ children }: DanteLoggerProviderProps) {
  // Just return the children
  return <>{children}</>;
}

/**
 * Hook for using Dante Logger in React components (stub implementation)
 */
export function useDanteLogger() {
  return DanteLogger;
}

/**
 * Hook for logging component lifecycle events (stub implementation)
 */
export function useComponentLogger(
  componentName: string,
  options: {
    logMount?: boolean;
    logUnmount?: boolean;
    logRender?: boolean;
    logProps?: boolean;
    logErrors?: boolean;
  } = {}
) {
  return DanteLogger;
}

/**
 * Hook for performance logging in React components (stub implementation)
 */
export function usePerformanceLogger(componentName: string, dependencies: any[] = []) {
  return DanteLogger;
}

export default {
  DanteLoggerProvider,
  useDanteLogger,
  useComponentLogger,
  usePerformanceLogger
};
