/**
 * Philosophical Logger
 *
 * A unified logging system that combines four philosophical approaches:
 * - Dante Alighieri (Structure): Hierarchical organization of log types
 * - Hermann Hesse (Precision): Technical precision and intellectual clarity
 * - J.D. Salinger (Authenticity): Human-readable, authentic representation
 * - Jacques Derrida (Deconstruction): Breaking down traditional logging categories
 *
 * This is the single source of truth for all logging in the application.
 * It provides a consistent API that covers all use cases and integrates
 * with the existing logging systems.
 *
 * Enhanced with:
 * - Robust error handling to prevent crashes
 * - Context-rich logging for better debugging
 * - Result pattern integration for functional error handling
 * - Environment detection for platform-specific logging
 */

import { DanteLogger } from './DanteLogger';
import { HesseLogger } from './HesseLogger';
import { Result, ok, err } from './Result';
import { LogContext, LogResult } from './types';

// Environment detection
const isServer = typeof window === 'undefined';
const isBrowser = typeof window !== 'undefined';
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';

// Get current timestamp in ISO format with milliseconds
const getTimestamp = () => new Date().toISOString();

// Add context to log messages
const addContext = (message: string, context?: string) => {
  if (!context) return message;
  return `[${context}] ${message}`;
};

// Enhanced interfaces with Result pattern
interface ErrorLogger {
  validation: (message: string, data?: any, context?: LogContext) => Result<LogResult, Error>;
  dataFlow: (message: string, data?: any, context?: LogContext) => Result<LogResult, Error>;
  runtime: (message: string, data?: any, context?: LogContext) => Result<LogResult, Error>;
  system: (message: string, data?: any, context?: LogContext) => Result<LogResult, Error>;
}

interface ProcessLogger {
  start: (message: string, context?: LogContext) => Result<LogResult, Error>;
  progress: (message: string, context?: LogContext) => Result<LogResult, Error>;
  complete: (message: string, context?: LogContext) => Result<LogResult, Error>;
  fail: (message: string, error?: any, context?: LogContext) => Result<LogResult, Error>;
}

interface UXLogger {
  interaction: (message: string, context?: LogContext) => Result<LogResult, Error>;
  feedback: (message: string, context?: LogContext) => Result<LogResult, Error>;
}

interface SystemLogger {
  info: (message: string, data?: any, context?: LogContext) => Result<LogResult, Error>;
  debug: (message: string, data?: any, context?: LogContext) => Result<LogResult, Error>;
}

interface ConfigLogger {
  get: (context?: LogContext) => Result<any, Error>;
  set: (newConfig: any, context?: LogContext) => Result<any, Error>;
  reset: (context?: LogContext) => Result<any, Error>;
  forEnvironment: (env: 'development' | 'production' | 'test', context?: LogContext) => Result<any, Error>;
  forPlatform: (platform: 'browser' | 'node' | 'terminal' | 'deployment', context?: LogContext) => Result<any, Error>;
}

interface AILogger {
  start: (message: string, context?: LogContext) => Result<LogResult, Error>;
  info: (message: string, context?: LogContext) => Result<LogResult, Error>;
  success: (message: string, context?: LogContext) => Result<LogResult, Error>;
  warning: (message: string, context?: LogContext) => Result<LogResult, Error>;
  error: (message: string, context?: LogContext) => Result<LogResult, Error>;
}

interface OpenAILogger {
  request: (message: string, context?: LogContext) => Result<LogResult, Error>;
  response: (message: string, context?: LogContext) => Result<LogResult, Error>;
  error: (message: string, context?: LogContext) => Result<LogResult, Error>;
}

interface PhilosophicalLoggerInterface {
  error: ErrorLogger;
  process: ProcessLogger;
  ux: UXLogger;
  system: SystemLogger;
  config: ConfigLogger;
  ai: AILogger;
  openai: OpenAILogger;
}

// Helper function to create a standardized log result
const createLogResult = (message: string, level: 'debug' | 'info' | 'warn' | 'error', data?: any, context?: LogContext): LogResult => {
  return {
    message,
    data,
    context: context || {},
    timestamp: getTimestamp(),
    level
  };
};

// Define the unified logger interface
export const PhilosophicalLogger: PhilosophicalLoggerInterface = {
  // Dante-inspired error logging (Inferno)
  error: {
    // Reuse DanteLogger's error categories
    validation: (message: string, data?: any, context?: LogContext) => {
      try {
        if (DanteLogger && DanteLogger.error && DanteLogger.error.validation) {
          DanteLogger.error.validation(message, data);
        }
      } catch (error) {
        // Silent catch - we'll log to console anyway
      }

      // Add context information
      const contextStr = context ? ` [${context.component || ''}${context.file ? ':' + context.file : ''}]` : '';
      console.error(`[Validation Error]${contextStr} ${message}`, data || '');

      // Return a Result
      return ok(createLogResult(message, 'error', data, context));
    },
    dataFlow: (message: string, data?: any, context?: LogContext) => {
      try {
        if (DanteLogger && DanteLogger.error && DanteLogger.error.dataFlow) {
          DanteLogger.error.dataFlow(message, data);
        }
      } catch (error) {
        // Silent catch - we'll log to console anyway
      }

      // Add context information
      const contextStr = context ? ` [${context.component || ''}${context.file ? ':' + context.file : ''}]` : '';
      console.error(`[Data Flow Error]${contextStr} ${message}`, data || '');

      // Return a Result
      return ok(createLogResult(message, 'error', data, context));
    },
    runtime: (message: string, data?: any, context?: LogContext) => {
      try {
        if (DanteLogger && DanteLogger.error && DanteLogger.error.runtime) {
          DanteLogger.error.runtime(message, data);
        }
      } catch (error) {
        // Silent catch - we'll log to console anyway
      }

      // Add context information
      const contextStr = context ? ` [${context.component || ''}${context.file ? ':' + context.file : ''}]` : '';
      console.error(`[Runtime Error]${contextStr} ${message}`, data || '');

      // Return a Result
      return ok(createLogResult(message, 'error', data, context));
    },
    system: (message: string, data?: any, context?: LogContext) => {
      try {
        if (DanteLogger && DanteLogger.error && DanteLogger.error.runtime) {
          DanteLogger.error.runtime(message, data); // Map to closest equivalent
        }
      } catch (error) {
        // Silent catch - we'll log to console anyway
      }

      // Add context information
      const contextStr = context ? ` [${context.component || ''}${context.file ? ':' + context.file : ''}]` : '';
      console.error(`[System Error]${contextStr} ${message}`, data || '');

      // Return a Result
      return ok(createLogResult(message, 'error', data, context));
    },
    // Add other error types as needed
  },

  // Hesse-inspired process logging
  process: {
    start: (message: string, context?: LogContext) => {
      try {
        // @ts-ignore - HesseLogger structure might vary
        if (HesseLogger && typeof HesseLogger.summary?.start === 'function') {
          // @ts-ignore
          HesseLogger.summary.start(message);
        }
      } catch (error) {
        // Silent catch - we'll log to console anyway
      }

      // Add context information
      const contextStr = context ? ` [${context.component || ''}${context.file ? ':' + context.file : ''}]` : '';
      console.log(`[Process Started]${contextStr} ${message}`);

      // Return a Result
      return ok(createLogResult(message, 'info', undefined, context));
    },
    progress: (message: string, context?: LogContext) => {
      // Just use console.log since HesseLogger doesn't have a progress method

      // Add context information
      const contextStr = context ? ` [${context.component || ''}${context.file ? ':' + context.file : ''}]` : '';
      console.log(`[Process Progress]${contextStr} ${message}`);

      // Return a Result
      return ok(createLogResult(message, 'info', undefined, context));
    },
    complete: (message: string, context?: LogContext) => {
      try {
        // @ts-ignore - HesseLogger structure might vary
        if (HesseLogger && typeof HesseLogger.summary?.end === 'function') {
          // @ts-ignore
          HesseLogger.summary.end(message);
        }
      } catch (error) {
        // Silent catch - we'll log to console anyway
      }

      // Add context information
      const contextStr = context ? ` [${context.component || ''}${context.file ? ':' + context.file : ''}]` : '';
      console.log(`[Process Completed]${contextStr} ${message}`);

      // Return a Result
      return ok(createLogResult(message, 'info', undefined, context));
    },
    fail: (message: string, error?: any, context?: LogContext) => {
      try {
        // @ts-ignore - HesseLogger structure might vary
        if (HesseLogger && typeof HesseLogger.summary?.end === 'function') {
          // @ts-ignore
          HesseLogger.summary.end(`Error: ${message}: ${error}`);
        }
      } catch (logError) {
        // Silent catch - we'll log to console anyway
      }

      // Safely convert error to string
      const errorMessage = error instanceof Error ? error.message : String(error || 'Unknown error');

      // Add context information
      const contextStr = context ? ` [${context.component || ''}${context.file ? ':' + context.file : ''}]` : '';
      console.error(`[Process Failed]${contextStr} ${message}`, errorMessage);

      // Return a Result
      return ok(createLogResult(message, 'error', { error: errorMessage }, context));
    }
  },

  // Salinger-inspired user experience logging
  ux: {
    interaction: (message: string, context?: LogContext) => {
      try {
        // @ts-ignore - DanteLogger structure might vary
        if (DanteLogger && typeof DanteLogger.success?.ux === 'function') {
          // @ts-ignore
          DanteLogger.success.ux(message); // Map to closest equivalent
        }
      } catch (error) {
        // Silent catch - we'll log to console anyway
      }

      // Add context information
      const contextStr = context ? ` [${context.component || ''}${context.file ? ':' + context.file : ''}]` : '';
      console.log(`[UX Interaction]${contextStr} ${message}`);

      // Return a Result
      return ok(createLogResult(message, 'info', undefined, context));
    },
    feedback: (message: string, context?: LogContext) => {
      try {
        // @ts-ignore - DanteLogger structure might vary
        if (DanteLogger && typeof DanteLogger.info?.system === 'function') {
          // @ts-ignore
          DanteLogger.info.system(message); // Map to closest equivalent
        }
      } catch (error) {
        // Silent catch - we'll log to console anyway
      }

      // Add context information
      const contextStr = context ? ` [${context.component || ''}${context.file ? ':' + context.file : ''}]` : '';
      console.log(`[UX Feedback]${contextStr} ${message}`);

      // Return a Result
      return ok(createLogResult(message, 'info', undefined, context));
    }
  },

  // Derrida-inspired system analysis logging
  system: {
    info: (message: string, data?: any, context?: LogContext) => {
      try {
        // @ts-ignore - DanteLogger structure might vary
        if (DanteLogger && typeof DanteLogger.info?.system === 'function') {
          // @ts-ignore
          DanteLogger.info.system(message);
        }
      } catch (error) {
        // Silent catch - we'll log to console anyway
      }

      // Add context information
      const contextStr = context ? ` [${context.component || ''}${context.file ? ':' + context.file : ''}]` : '';
      console.log(`[System Info]${contextStr} ${message}`, data || '');

      // Return a Result
      return ok(createLogResult(message, 'info', data, context));
    },
    debug: (message: string, data?: any, context?: LogContext) => {
      // DanteLogger doesn't have info.debug, so we use console.debug

      // Add context information
      const contextStr = context ? ` [${context.component || ''}${context.file ? ':' + context.file : ''}]` : '';
      console.debug(`[System Debug]${contextStr} ${message}`, data || '');

      // Return a Result
      return ok(createLogResult(message, 'debug', data, context));
    }
  },

  // Configuration methods
  config: {
    // Simplified configuration methods since DanteLogger.config might not exist
    get: (context?: LogContext) => {
      try {
        // @ts-ignore - DanteLogger structure might vary
        if (DanteLogger && typeof DanteLogger.config?.get === 'function') {
          // @ts-ignore
          const config = DanteLogger.config.get();
          return ok(config);
        }
      } catch (error) {
        // Silent catch - we'll use fallback
      }

      // Add context information
      const contextStr = context ? ` [${context.component || ''}${context.file ? ':' + context.file : ''}]` : '';
      console.log(`[Config]${contextStr} Getting configuration`);

      // Return a Result with an empty config
      return ok({});
    },
    set: (newConfig: any, context?: LogContext) => {
      try {
        // @ts-ignore - DanteLogger structure might vary
        if (DanteLogger && typeof DanteLogger.config?.set === 'function') {
          // @ts-ignore
          const result = DanteLogger.config.set(newConfig);
          return ok(result);
        }
      } catch (error) {
        // Silent catch - we'll use fallback
      }

      // Add context information
      const contextStr = context ? ` [${context.component || ''}${context.file ? ':' + context.file : ''}]` : '';
      console.log(`[Config]${contextStr} Setting configuration`, newConfig);

      // Return a Result with the new config
      return ok(newConfig);
    },
    reset: (context?: LogContext) => {
      try {
        // @ts-ignore - DanteLogger structure might vary
        if (DanteLogger && typeof DanteLogger.config?.reset === 'function') {
          // @ts-ignore
          const result = DanteLogger.config.reset();
          return ok(result);
        }
      } catch (error) {
        // Silent catch - we'll use fallback
      }

      // Add context information
      const contextStr = context ? ` [${context.component || ''}${context.file ? ':' + context.file : ''}]` : '';
      console.log(`[Config]${contextStr} Resetting configuration`);

      // Return a Result with an empty config
      return ok({});
    },
    forEnvironment: (env: 'development' | 'production' | 'test', context?: LogContext) => {
      try {
        // @ts-ignore - DanteLogger structure might vary
        if (DanteLogger && typeof DanteLogger.config?.forEnvironment === 'function') {
          // @ts-ignore
          const result = DanteLogger.config.forEnvironment(env);
          return ok(result);
        }
      } catch (error) {
        // Silent catch - we'll use fallback
      }

      // Add context information
      const contextStr = context ? ` [${context.component || ''}${context.file ? ':' + context.file : ''}]` : '';
      console.log(`[Config]${contextStr} Setting environment to ${env}`);

      // Return a Result with an environment-specific config
      return ok({ environment: env });
    },
    forPlatform: (platform: 'browser' | 'node' | 'terminal' | 'deployment', context?: LogContext) => {
      try {
        // @ts-ignore - DanteLogger structure might vary
        if (DanteLogger && typeof DanteLogger.config?.forPlatform === 'function') {
          // @ts-ignore
          const result = DanteLogger.config.forPlatform(platform);
          return ok(result);
        }
      } catch (error) {
        // Silent catch - we'll use fallback
      }

      // Add context information
      const contextStr = context ? ` [${context.component || ''}${context.file ? ':' + context.file : ''}]` : '';
      console.log(`[Config]${contextStr} Setting platform to ${platform}`);

      // Return a Result with a platform-specific config
      return ok({ platform });
    }
  },

  // AI-specific logging
  ai: {
    start: (message: string, context?: LogContext) => {
      try {
        // @ts-ignore - HesseLogger structure might vary
        if (HesseLogger && typeof HesseLogger.ai?.start === 'function') {
          // @ts-ignore
          HesseLogger.ai.start(message);
        }
      } catch (error) {
        // Silent catch - we'll log to console anyway
      }

      // Add context information
      const contextStr = context ? ` [${context.component || ''}${context.file ? ':' + context.file : ''}]` : '';
      console.log(`[AI]${contextStr} 🧠 ${message}`);

      // Return a Result
      return ok(createLogResult(message, 'info', undefined, context));
    },
    info: (message: string, context?: LogContext) => {
      try {
        // @ts-ignore - HesseLogger structure might vary
        if (HesseLogger && typeof HesseLogger.ai?.info === 'function') {
          // @ts-ignore
          HesseLogger.ai.info(message);
        }
      } catch (error) {
        // Silent catch - we'll log to console anyway
      }

      // Add context information
      const contextStr = context ? ` [${context.component || ''}${context.file ? ':' + context.file : ''}]` : '';
      console.log(`[AI]${contextStr} ℹ️ ${message}`);

      // Return a Result
      return ok(createLogResult(message, 'info', undefined, context));
    },
    success: (message: string, context?: LogContext) => {
      try {
        // @ts-ignore - HesseLogger structure might vary
        if (HesseLogger && typeof HesseLogger.ai?.success === 'function') {
          // @ts-ignore
          HesseLogger.ai.success(message);
        }
      } catch (error) {
        // Silent catch - we'll log to console anyway
      }

      // Add context information
      const contextStr = context ? ` [${context.component || ''}${context.file ? ':' + context.file : ''}]` : '';
      console.log(`[AI]${contextStr} ✅ ${message}`);

      // Return a Result
      return ok(createLogResult(message, 'info', undefined, context));
    },
    warning: (message: string, context?: LogContext) => {
      try {
        // @ts-ignore - HesseLogger structure might vary
        if (HesseLogger && typeof HesseLogger.ai?.warning === 'function') {
          // @ts-ignore
          HesseLogger.ai.warning(message);
        }
      } catch (error) {
        // Silent catch - we'll log to console anyway
      }

      // Add context information
      const contextStr = context ? ` [${context.component || ''}${context.file ? ':' + context.file : ''}]` : '';
      console.warn(`[AI]${contextStr} ⚠️ ${message}`);

      // Return a Result
      return ok(createLogResult(message, 'warn', undefined, context));
    },
    error: (message: string, context?: LogContext) => {
      try {
        // @ts-ignore - HesseLogger structure might vary
        if (HesseLogger && typeof HesseLogger.ai?.error === 'function') {
          // @ts-ignore
          HesseLogger.ai.error(message);
        }
      } catch (error) {
        // Silent catch - we'll log to console anyway
      }

      // Add context information
      const contextStr = context ? ` [${context.component || ''}${context.file ? ':' + context.file : ''}]` : '';
      console.error(`[AI]${contextStr} ❌ ${message}`);

      // Return a Result
      return ok(createLogResult(message, 'error', undefined, context));
    }
  },

  // OpenAI-specific logging
  openai: {
    request: (message: string, context?: LogContext) => {
      try {
        // @ts-ignore - HesseLogger structure might vary
        if (HesseLogger && typeof HesseLogger.openai?.request === 'function') {
          // @ts-ignore
          HesseLogger.openai.request(message);
        }
      } catch (error) {
        // Silent catch - we'll log to console anyway
      }

      // Add context information
      const contextStr = context ? ` [${context.component || ''}${context.file ? ':' + context.file : ''}]` : '';
      console.log(`[OpenAI]${contextStr} 🔄 ${message}`);

      // Return a Result
      return ok(createLogResult(message, 'info', undefined, context));
    },
    response: (message: string, context?: LogContext) => {
      try {
        // @ts-ignore - HesseLogger structure might vary
        if (HesseLogger && typeof HesseLogger.openai?.response === 'function') {
          // @ts-ignore
          HesseLogger.openai.response(message);
        }
      } catch (error) {
        // Silent catch - we'll log to console anyway
      }

      // Add context information
      const contextStr = context ? ` [${context.component || ''}${context.file ? ':' + context.file : ''}]` : '';
      console.log(`[OpenAI]${contextStr} ✅ ${message}`);

      // Return a Result
      return ok(createLogResult(message, 'info', undefined, context));
    },
    error: (message: string, context?: LogContext) => {
      try {
        // @ts-ignore - HesseLogger structure might vary
        if (HesseLogger && typeof HesseLogger.openai?.error === 'function') {
          // @ts-ignore
          HesseLogger.openai.error(message);
        }
      } catch (error) {
        // Silent catch - we'll log to console anyway
      }

      // Add context information
      const contextStr = context ? ` [${context.component || ''}${context.file ? ':' + context.file : ''}]` : '';
      console.error(`[OpenAI]${contextStr} ❌ ${message}`);

      // Return a Result
      return ok(createLogResult(message, 'error', undefined, context));
    }
  }
};

// Export a default instance for convenience
export default PhilosophicalLogger;