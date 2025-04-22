/**
 * Dante Logger React Integration
 * 
 * This module provides hooks and components for integrating Dante Logger with React applications.
 */

import { useRef, useEffect, useState, createContext, useContext, ReactNode } from 'react';
import { DanteLogger } from '../index';
import { DanteLoggerConfig } from '../core/config';

// Create a context for the logger
const DanteLoggerContext = createContext(DanteLogger);

/**
 * Props for the DanteLoggerProvider component
 */
export interface DanteLoggerProviderProps {
  /**
   * Custom logger configuration
   */
  config?: Partial<DanteLoggerConfig>;
  
  /**
   * Children components
   */
  children: ReactNode;
}

/**
 * Provider component for Dante Logger
 * 
 * @param props Component props
 * @returns Provider component
 */
export function DanteLoggerProvider({ config, children }: DanteLoggerProviderProps) {
  // Create a custom logger if configuration is provided
  const logger = useRef(config ? DanteLogger.createLogger(config) : DanteLogger);
  
  return (
    <DanteLoggerContext.Provider value={logger.current}>
      {children}
    </DanteLoggerContext.Provider>
  );
}

/**
 * Hook for using Dante Logger in React components
 * 
 * @returns Dante Logger instance
 */
export function useDanteLogger() {
  return useContext(DanteLoggerContext);
}

/**
 * Hook for logging component lifecycle events
 * 
 * @param componentName Name of the component
 * @param options Logging options
 * @returns Dante Logger instance
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
  const {
    logMount = true,
    logUnmount = true,
    logRender = false,
    logProps = false,
    logErrors = true
  } = options;
  
  const logger = useDanteLogger();
  const renderCount = useRef(0);
  
  // Log component mount
  useEffect(() => {
    if (logMount) {
      logger.success.ux(`Component mounted: ${componentName}`);
    }
    
    // Log component unmount
    return () => {
      if (logUnmount) {
        logger.success.basic(`Component unmounted: ${componentName}`);
      }
    };
  }, []);
  
  // Log component render
  useEffect(() => {
    renderCount.current += 1;
    
    if (logRender && renderCount.current > 1) {
      logger.success.basic(`Component re-rendered: ${componentName} (${renderCount.current})`);
    }
  });
  
  // Error boundary effect
  useEffect(() => {
    if (logErrors) {
      const errorHandler = (event: ErrorEvent) => {
        logger.error.runtime(`Error in component: ${componentName}`, {
          error: event.error,
          message: event.message
        });
      };
      
      window.addEventListener('error', errorHandler);
      
      return () => {
        window.removeEventListener('error', errorHandler);
      };
    }
  }, []);
  
  // Return the logger for component use
  return logger;
}

/**
 * Hook for performance logging in React components
 * 
 * @param componentName Name of the component
 * @param dependencies Dependencies to watch for changes
 * @returns Dante Logger instance
 */
export function usePerformanceLogger(componentName: string, dependencies: any[] = []) {
  const logger = useDanteLogger();
  const renderTime = useRef(Date.now());
  
  // Log render time on each dependency change
  useEffect(() => {
    const currentTime = Date.now();
    const renderDuration = currentTime - renderTime.current;
    
    if (renderDuration < 50) {
      logger.success.performance(`Fast render: ${componentName} (${renderDuration}ms)`);
    } else if (renderDuration < 200) {
      logger.success.basic(`Normal render: ${componentName} (${renderDuration}ms)`);
    } else {
      logger.warn.slow(`Slow render: ${componentName} (${renderDuration}ms)`);
    }
    
    renderTime.current = currentTime;
  }, dependencies);
  
  return logger;
}

export default {
  DanteLoggerProvider,
  useDanteLogger,
  useComponentLogger,
  usePerformanceLogger
};
