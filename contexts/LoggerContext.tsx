'use client';

import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { PhilosophicalLogger } from '../utils/PhilosophicalLogger';
import { Result, getValueOrDefault } from '../utils/Result';
import { LogContext, LogResult } from '../utils/types';

// Create a context for the logger
const LoggerContext = createContext(PhilosophicalLogger);

// Props for the LoggerProvider component
interface LoggerProviderProps {
  children: ReactNode;
  component?: string;
}

/**
 * LoggerProvider component
 *
 * This component provides the PhilosophicalLogger to all child components
 * through React's context API.
 *
 * @param {LoggerProviderProps} props - The component props
 * @returns {JSX.Element} The provider component
 */
export function LoggerProvider({ children, component }: LoggerProviderProps): JSX.Element {
  // Create a memoized logger
  const logger = useMemo(() => {
    return PhilosophicalLogger;
  }, []);

  return (
    <LoggerContext.Provider value={logger}>
      {children}
    </LoggerContext.Provider>
  );
}

/**
 * useLogger hook
 *
 * This hook provides access to the PhilosophicalLogger in any component
 * that is a child of the LoggerProvider. It automatically adds component
 * context to all log messages.
 *
 * @param {string} componentName - Optional name of the component using the logger
 * @returns {typeof PhilosophicalLogger} The logger instance with component context
 */
export function useLogger(componentName?: string) {
  const logger = useContext(LoggerContext);

  if (!logger) {
    throw new Error('useLogger must be used within a LoggerProvider');
  }

  // Create a context object for this component
  const context: LogContext = useMemo(() => ({
    component: componentName,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV as 'development' | 'production' | 'test',
    platform: typeof window === 'undefined' ? 'node' : 'browser',
  }), [componentName]);

  // Create a wrapper for each logger method that adds the component context
  // and handles the Result pattern
  const wrappedLogger = useMemo(() => {
    // Helper function to wrap a logger section
    const wrapLoggerSection = <T extends Record<string, Function>>(
      section: T
    ): T => {
      const wrappedSection = {} as T;

      // For each method in the section, create a wrapped version that adds the component context
      for (const key in section) {
        if (typeof section[key] === 'function') {
          wrappedSection[key] = ((...args: any[]) => {
            // Add the context as the last argument if it's not already provided
            if (args.length > 0 && args[args.length - 1] && typeof args[args.length - 1] === 'object' && 'component' in args[args.length - 1]) {
              // Context is already provided, use it as is
              const result = section[key](...args);
              return getValueOrDefault(result, { message: 'Logging failed', timestamp: new Date().toISOString(), level: 'error' });
            } else {
              // Add the context as the last argument
              const result = section[key](...args, context);
              return getValueOrDefault(result, { message: 'Logging failed', timestamp: new Date().toISOString(), level: 'error' });
            }
          }) as any;
        }
      }

      return wrappedSection;
    };

    // Wrap each section of the logger
    return {
      error: wrapLoggerSection(logger.error),
      process: wrapLoggerSection(logger.process),
      ux: wrapLoggerSection(logger.ux),
      system: wrapLoggerSection(logger.system),
      config: wrapLoggerSection(logger.config),
      ai: wrapLoggerSection(logger.ai),
      openai: wrapLoggerSection(logger.openai),
    };
  }, [logger, context]);

  return wrappedLogger;
}

/**
 * useComponentLogger hook
 *
 * This hook provides a specialized logger for React components that
 * automatically logs component lifecycle events. It uses the Result pattern
 * for error handling.
 *
 * @param {string} componentName - The name of the component
 * @param {object} options - Options for the component logger
 * @returns {object} The component logger
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
  const logger = useLogger(componentName);
  const {
    logMount = true,
    logUnmount = true,
    logRender = false,
    logProps = false,
    logErrors = true,
  } = options;

  // Create a context object for this component
  const context: LogContext = useMemo(() => ({
    component: componentName,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV as 'development' | 'production' | 'test',
    platform: typeof window === 'undefined' ? 'node' : 'browser',
  }), [componentName]);

  // Log component mount
  React.useEffect(() => {
    if (logMount) {
      logger.ux.interaction(`Component mounted`);
    }

    return () => {
      if (logUnmount) {
        logger.ux.interaction(`Component unmounted`);
      }
    };
  }, [componentName, logMount, logUnmount, logger]);

  // Create a specialized logger for this component
  const componentLogger = React.useMemo(() => {
    return {
      info: (message: string, data?: any) => {
        return logger.system.info(message, data);
      },
      error: (message: string, data?: any) => {
        return logger.error.runtime(message, data);
      },
      warn: (message: string, data?: any) => {
        return logger.system.info(`WARNING: ${message}`, data);
      },
      debug: (message: string, data?: any) => {
        return logger.system.debug(message, data);
      },
      interaction: (message: string) => {
        return logger.ux.interaction(message);
      },
      // Add lifecycle methods
      lifecycle: {
        render: (props?: any) => {
          if (logRender) {
            return logger.system.debug(`Component rendered`, props);
          }
          return { message: 'Render not logged', timestamp: new Date().toISOString(), level: 'debug' };
        },
        propsChanged: (prevProps: any, nextProps: any) => {
          if (logProps) {
            return logger.system.debug(`Props changed`, { prev: prevProps, next: nextProps });
          }
          return { message: 'Props change not logged', timestamp: new Date().toISOString(), level: 'debug' };
        },
        error: (error: Error, errorInfo?: React.ErrorInfo) => {
          if (logErrors) {
            return logger.error.runtime(`Component error: ${error.message}`, { error, errorInfo });
          }
          return { message: 'Error not logged', timestamp: new Date().toISOString(), level: 'error' };
        }
      }
    };
  }, [componentName, logger, logRender, logProps, logErrors]);

  return componentLogger;
}

/**
 * withLogger higher-order component
 *
 * This HOC provides the PhilosophicalLogger to a component through props.
 * It automatically adds component context to all log messages.
 *
 * @param {React.ComponentType<any>} Component - The component to wrap
 * @returns {React.FC<any>} The wrapped component
 */
export function withLogger<P extends { logger?: typeof PhilosophicalLogger }>(
  Component: React.ComponentType<P>
): React.FC<Omit<P, 'logger'>> {
  const displayName = Component.displayName || Component.name || 'Component';

  const WrappedComponent: React.FC<Omit<P, 'logger'>> = (props) => {
    // Use the component name for context
    const logger = useLogger(displayName);

    return <Component {...(props as P)} logger={logger} />;
  };

  WrappedComponent.displayName = `withLogger(${displayName})`;

  return WrappedComponent;
}

/**
 * withComponentLogger higher-order component
 *
 * This HOC provides a specialized component logger to a component through props.
 * It automatically logs component lifecycle events.
 *
 * @param {React.ComponentType<any>} Component - The component to wrap
 * @param {object} options - Options for the component logger
 * @returns {React.FC<any>} The wrapped component
 */
export function withComponentLogger<P extends { logger?: ReturnType<typeof useComponentLogger> }>(
  Component: React.ComponentType<P>,
  options: Parameters<typeof useComponentLogger>[1] = {}
): React.FC<Omit<P, 'logger'>> {
  const displayName = Component.displayName || Component.name || 'Component';

  const WrappedComponent: React.FC<Omit<P, 'logger'>> = (props) => {
    // Use the component name for the logger
    const logger = useComponentLogger(displayName, options);

    // Log render if enabled
    if (options.logRender) {
      logger.lifecycle.render(props);
    }

    return <Component {...(props as P)} logger={logger} />;
  };

  WrappedComponent.displayName = `withComponentLogger(${displayName})`;

  return WrappedComponent;
}

export default LoggerContext;
