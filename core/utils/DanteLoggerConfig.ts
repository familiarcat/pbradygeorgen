/**
 * Global configuration for the Dante Logger system
 * 
 * This file allows customization of the logging behavior across
 * different environments and platforms.
 */

export type LogEnvironment = 'development' | 'production' | 'test';
export type LogPlatform = 'browser' | 'node' | 'terminal' | 'deployment';

export interface DanteLoggerConfig {
  // Enable/disable specific realms
  enabledRealms: {
    inferno: boolean;
    purgatorio: boolean;
    paradiso: boolean;
  };
  
  // Minimum log levels (1-9 for Inferno/Paradiso, 1-7 for Purgatorio)
  minimumLevels: {
    inferno: number;
    purgatorio: number;
    paradiso: number;
  };
  
  // Output formatting
  formatting: {
    includeTimestamp: boolean;
    includeEmoji: boolean;
    colorize: boolean;
    includeRealmName: boolean;
    includeLevelNumber: boolean;
    includeCategoryName: boolean;
  };
  
  // Environment-specific settings
  environments: {
    [key in LogEnvironment]: {
      enabled: boolean;
      minimumLevels?: {
        inferno?: number;
        purgatorio?: number;
        paradiso?: number;
      };
    };
  };
  
  // Platform-specific settings
  platforms: {
    [key in LogPlatform]: {
      enabled: boolean;
      colorize?: boolean;
      formatters?: {
        [key: string]: (message: string, data?: any) => string;
      };
    };
  };
  
  // Custom handlers for specific log types
  handlers: {
    onError?: (circle: number, message: string, data?: any) => void;
    onWarning?: (terrace: number, message: string, data?: any) => void;
    onSuccess?: (sphere: number, message: string, data?: any) => void;
  };
}

/**
 * Default configuration for the Dante Logger
 */
export const defaultConfig: DanteLoggerConfig = {
  enabledRealms: {
    inferno: true,
    purgatorio: true,
    paradiso: true
  },
  
  minimumLevels: {
    inferno: 1,   // Log all errors
    purgatorio: 1, // Log all warnings
    paradiso: 1    // Log all successes
  },
  
  formatting: {
    includeTimestamp: true,
    includeEmoji: true,
    colorize: true,
    includeRealmName: true,
    includeLevelNumber: true,
    includeCategoryName: true
  },
  
  environments: {
    development: {
      enabled: true
    },
    production: {
      enabled: true,
      minimumLevels: {
        inferno: 1,    // Log all errors in production
        purgatorio: 3, // Only log more severe warnings in production
        paradiso: 4    // Only log significant successes in production
      }
    },
    test: {
      enabled: false   // Disable logging in test environment by default
    }
  },
  
  platforms: {
    browser: {
      enabled: true,
      colorize: true
    },
    node: {
      enabled: true,
      colorize: true
    },
    terminal: {
      enabled: true,
      colorize: true
    },
    deployment: {
      enabled: true,
      colorize: false  // Some deployment environments don't support colors
    }
  },
  
  handlers: {}
};

// Detect current environment
export function detectEnvironment(): LogEnvironment {
  if (typeof process !== 'undefined' && process.env) {
    return (process.env.NODE_ENV as LogEnvironment) || 'development';
  }
  return 'development';
}

// Detect current platform
export function detectPlatform(): LogPlatform {
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    return 'browser';
  }
  if (typeof process !== 'undefined' && process.versions && process.versions.node) {
    return 'node';
  }
  return 'terminal';
}

// Current environment and platform
export const currentEnvironment = detectEnvironment();
export const currentPlatform = detectPlatform();

// Export a function to create a custom configuration
export function createConfig(customConfig: Partial<DanteLoggerConfig>): DanteLoggerConfig {
  return {
    ...defaultConfig,
    ...customConfig,
    enabledRealms: {
      ...defaultConfig.enabledRealms,
      ...customConfig.enabledRealms
    },
    minimumLevels: {
      ...defaultConfig.minimumLevels,
      ...customConfig.minimumLevels
    },
    formatting: {
      ...defaultConfig.formatting,
      ...customConfig.formatting
    },
    environments: {
      ...defaultConfig.environments,
      ...customConfig.environments
    },
    platforms: {
      ...defaultConfig.platforms,
      ...customConfig.platforms
    },
    handlers: {
      ...defaultConfig.handlers,
      ...customConfig.handlers
    }
  };
}

export default defaultConfig;
