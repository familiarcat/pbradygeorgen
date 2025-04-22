/**
 * DanteLogger: A Divine Comedy-inspired logging system
 *
 * This system transforms mundane logging into a rich, philosophical experience
 * by categorizing messages according to Dante Alighieri's cosmology:
 *
 * - Inferno (Errors): The 9 circles of development hell
 * - Purgatorio (Warnings): The 7 terraces of purification
 * - Paradiso (Success): The 9 celestial spheres + Empyrean
 *
 * Each log is adorned with carefully chosen emoji combinations that visually
 * represent the nature of the message, creating a subtle infusion of graphic
 * design into the otherwise mundane task of reading logs.
 *
 * "In the middle of the journey of our codebase, I found myself in a dark forest,
 * for the straight path of development had been lost." - Dante (paraphrased)
 *
 * This logger can be used across different environments (development, production, test)
 * and platforms (browser, Node.js, terminal, deployment) with consistent formatting.
 */

import {
  DanteLoggerConfig,
  defaultConfig,
  currentEnvironment,
  currentPlatform
} from './DanteLoggerConfig';

// Type definitions for log levels
type InfernoLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type PurgatorioLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7;
type ParadisoLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

// Inferno (Error) categories with their corresponding circles
const InfernoCategories = {
  1: { name: 'Limbo', emoji: '👑🔥', description: 'Validation errors' },
  2: { name: 'Lust', emoji: '👑🌊', description: 'Data flow errors' },
  3: { name: 'Gluttony', emoji: '👑🍿', description: 'Resource consumption errors' },
  4: { name: 'Greed', emoji: '👑💰', description: 'Storage/caching errors' },
  5: { name: 'Wrath', emoji: '👑💢', description: 'Runtime exceptions' },
  6: { name: 'Heresy', emoji: '👑🔥', description: 'Configuration errors' },
  7: { name: 'Violence', emoji: '👑🌶️', description: 'Data corruption errors' },
  8: { name: 'Fraud', emoji: '👑🎭', description: 'Security violations' },
  9: { name: 'Treachery', emoji: '👑❄️', description: 'System-breaking errors' }
} as const;

// Purgatorio (Warning) categories with their corresponding terraces
const PurgatorioCategories = {
  1: { name: 'Pride', emoji: '⚠️🪨', description: 'Deprecated feature usage' },
  2: { name: 'Envy', emoji: '⚠️👁️', description: 'Performance concerns' },
  3: { name: 'Wrath', emoji: '⚠️⚡', description: 'Resource warnings' },
  4: { name: 'Sloth', emoji: '⚠️🐌', description: 'Slow operations' },
  5: { name: 'Avarice', emoji: '⚠️💎', description: 'Excessive resource allocation' },
  6: { name: 'Gluttony', emoji: '⚠️🍽️', description: 'Memory leaks' },
  7: { name: 'Lust', emoji: '⚠️🔥', description: 'Potential security issues' }
} as const;

// Paradiso (Success) categories with their corresponding celestial spheres
const ParadisoCategories = {
  1: { name: 'Moon', emoji: '😇🌙', description: 'Basic successful operations' },
  2: { name: 'Mercury', emoji: '😇☿️', description: 'Fast operations' },
  3: { name: 'Venus', emoji: '😇💖', description: 'User experience improvements' },
  4: { name: 'Sun', emoji: '😇☀️', description: 'Core functionality success' },
  5: { name: 'Mars', emoji: '😇⚔️', description: 'Security enhancements' },
  6: { name: 'Jupiter', emoji: '😇⚡', description: 'System-wide improvements' },
  7: { name: 'Saturn', emoji: '😇🪐', description: 'Architectural achievements' },
  8: { name: 'Fixed Stars', emoji: '😇✨', description: 'Major version releases' },
  9: { name: 'Primum Mobile', emoji: '😇🌌', description: 'Transformative innovations' },
  10: { name: 'Empyrean', emoji: '😇🌈', description: 'Perfect system harmony' }
} as const;

// Current active configuration
let activeConfig: DanteLoggerConfig = { ...defaultConfig };

/**
 * Format a log message according to Dante's cosmology
 */
function formatDanteLog(
  realm: 'Inferno' | 'Purgatorio' | 'Paradiso',
  level: number,
  message: string,
  data?: any,
  categories: any = {}
): string {
  const category = categories[level];
  if (!category) {
    throw new Error(`Invalid ${realm} level: ${level}`);
  }

  // Build the log prefix based on configuration
  let prefix = '';

  // Add timestamp if configured
  if (activeConfig.formatting.includeTimestamp) {
    const timestamp = new Date().toISOString();
    prefix += `[${timestamp}] `;
  }

  // Add emoji if configured
  if (activeConfig.formatting.includeEmoji) {
    prefix += `${category.emoji} `;
  }

  // Add realm, level, and category if configured
  if (activeConfig.formatting.includeRealmName ||
      activeConfig.formatting.includeLevelNumber ||
      activeConfig.formatting.includeCategoryName) {

    prefix += '[';

    if (activeConfig.formatting.includeRealmName) {
      prefix += `Dante:${realm}`;

      if (activeConfig.formatting.includeLevelNumber) {
        prefix += ':';
      }
    }

    if (activeConfig.formatting.includeLevelNumber) {
      prefix += `${level}`;

      if (activeConfig.formatting.includeCategoryName) {
        prefix += ':';
      }
    }

    if (activeConfig.formatting.includeCategoryName) {
      prefix += `${category.name}`;
    }

    prefix += '] ';
  }

  // Special case for Zod validation errors in Inferno Circle 1
  if (realm === 'Inferno' && level === 1) {
    return `${prefix}Kneel Before Zod! ${message}`;
  }

  return `${prefix}${message}`;
}

/**
 * Check if logging is enabled for the given realm and level
 */
function isLoggingEnabled(realm: 'Inferno' | 'Purgatorio' | 'Paradiso', level: number): boolean {
  // Check if the realm is enabled
  const realmKey = realm.toLowerCase() as keyof typeof activeConfig.enabledRealms;
  if (!activeConfig.enabledRealms[realmKey]) {
    return false;
  }

  // Check if the environment is enabled
  if (!activeConfig.environments[currentEnvironment].enabled) {
    return false;
  }

  // Check if the platform is enabled
  if (!activeConfig.platforms[currentPlatform].enabled) {
    return false;
  }

  // Check minimum level for the realm
  const envMinLevels = activeConfig.environments[currentEnvironment].minimumLevels;
  const minLevel = envMinLevels && envMinLevels[realmKey] !== undefined
    ? envMinLevels[realmKey]
    : activeConfig.minimumLevels[realmKey];

  return level >= minLevel;
}

/**
 * Apply color to a log message if enabled
 */
function applyColor(message: string, realm: 'Inferno' | 'Purgatorio' | 'Paradiso'): string {
  if (!activeConfig.formatting.colorize || !activeConfig.platforms[currentPlatform].colorize) {
    return message;
  }

  // ANSI color codes for terminal output
  // Only apply in Node.js or terminal environments
  if (currentPlatform === 'node' || currentPlatform === 'terminal') {
    switch (realm) {
      case 'Inferno':
        return `\x1b[31m${message}\x1b[0m`; // Red
      case 'Purgatorio':
        return `\x1b[33m${message}\x1b[0m`; // Yellow
      case 'Paradiso':
        return `\x1b[32m${message}\x1b[0m`; // Green
      default:
        return message;
    }
  }

  // For browser, we'll rely on the console's built-in coloring
  return message;
}

/**
 * Log an error (Inferno)
 */
function logInferno(level: InfernoLevel, message: string, data?: any): void {
  if (!isLoggingEnabled('Inferno', level)) {
    return;
  }

  const formattedMessage = formatDanteLog('Inferno', level, message, data, InfernoCategories);
  const coloredMessage = applyColor(formattedMessage, 'Inferno');

  // Call custom handler if provided
  if (activeConfig.handlers.onError) {
    activeConfig.handlers.onError(level, message, data);
  }

  console.error(coloredMessage);
  if (data) console.error(data);
}

/**
 * Log a warning (Purgatorio)
 */
function logPurgatorio(level: PurgatorioLevel, message: string, data?: any): void {
  if (!isLoggingEnabled('Purgatorio', level)) {
    return;
  }

  const formattedMessage = formatDanteLog('Purgatorio', level, message, data, PurgatorioCategories);
  const coloredMessage = applyColor(formattedMessage, 'Purgatorio');

  // Call custom handler if provided
  if (activeConfig.handlers.onWarning) {
    activeConfig.handlers.onWarning(level, message, data);
  }

  console.warn(coloredMessage);
  if (data) console.warn(data);
}

/**
 * Log a success (Paradiso)
 */
function logParadiso(level: ParadisoLevel, message: string, data?: any): void {
  if (!isLoggingEnabled('Paradiso', level)) {
    return;
  }

  const formattedMessage = formatDanteLog('Paradiso', level, message, data, ParadisoCategories);
  const coloredMessage = applyColor(formattedMessage, 'Paradiso');

  // Call custom handler if provided
  if (activeConfig.handlers.onSuccess) {
    activeConfig.handlers.onSuccess(level, message, data);
  }

  console.log(coloredMessage);
  if (data) console.log(data);
}

/**
 * The DanteLogger API
 */
export const DanteLogger = {
  // Inferno (Errors)
  error: {
    validation: (message: string, data?: any) => logInferno(1, message, data),
    dataFlow: (message: string, data?: any) => logInferno(2, message, data),
    resources: (message: string, data?: any) => logInferno(3, message, data),
    storage: (message: string, data?: any) => logInferno(4, message, data),
    runtime: (message: string, data?: any) => logInferno(5, message, data),
    config: (message: string, data?: any) => logInferno(6, message, data),
    corruption: (message: string, data?: any) => logInferno(7, message, data),
    security: (message: string, data?: any) => logInferno(8, message, data),
    system: (message: string, data?: any) => logInferno(9, message, data),

    // Direct circle access
    circle: (level: InfernoLevel, message: string, data?: any) => logInferno(level, message, data)
  },

  // Purgatorio (Warnings)
  warn: {
    deprecated: (message: string, data?: any) => logPurgatorio(1, message, data),
    performance: (message: string, data?: any) => logPurgatorio(2, message, data),
    resources: (message: string, data?: any) => logPurgatorio(3, message, data),
    slow: (message: string, data?: any) => logPurgatorio(4, message, data),
    allocation: (message: string, data?: any) => logPurgatorio(5, message, data),
    memory: (message: string, data?: any) => logPurgatorio(6, message, data),
    security: (message: string, data?: any) => logPurgatorio(7, message, data),

    // Direct terrace access
    terrace: (level: PurgatorioLevel, message: string, data?: any) => logPurgatorio(level, message, data)
  },

  // Paradiso (Success)
  success: {
    basic: (message: string, data?: any) => logParadiso(1, message, data),
    performance: (message: string, data?: any) => logParadiso(2, message, data),
    ux: (message: string, data?: any) => logParadiso(3, message, data),
    core: (message: string, data?: any) => logParadiso(4, message, data),
    security: (message: string, data?: any) => logParadiso(5, message, data),
    system: (message: string, data?: any) => logParadiso(6, message, data),
    architecture: (message: string, data?: any) => logParadiso(7, message, data),
    release: (message: string, data?: any) => logParadiso(8, message, data),
    innovation: (message: string, data?: any) => logParadiso(9, message, data),
    perfection: (message: string, data?: any) => logParadiso(10, message, data),

    // Direct sphere access
    sphere: (level: ParadisoLevel, message: string, data?: any) => logParadiso(level, message, data)
  },

  // Configuration methods
  config: {
    /**
     * Get the current configuration
     */
    get: () => ({ ...activeConfig }),

    /**
     * Update the configuration
     */
    set: (newConfig: Partial<DanteLoggerConfig>) => {
      activeConfig = {
        ...activeConfig,
        ...newConfig,
        enabledRealms: {
          ...activeConfig.enabledRealms,
          ...newConfig.enabledRealms
        },
        minimumLevels: {
          ...activeConfig.minimumLevels,
          ...newConfig.minimumLevels
        },
        formatting: {
          ...activeConfig.formatting,
          ...newConfig.formatting
        },
        environments: {
          ...activeConfig.environments,
          ...newConfig.environments
        },
        platforms: {
          ...activeConfig.platforms,
          ...newConfig.platforms
        },
        handlers: {
          ...activeConfig.handlers,
          ...newConfig.handlers
        }
      };
      return DanteLogger.config.get();
    },

    /**
     * Reset to default configuration
     */
    reset: () => {
      activeConfig = { ...defaultConfig };
      return DanteLogger.config.get();
    },

    /**
     * Configure for a specific environment
     */
    forEnvironment: (env: 'development' | 'production' | 'test') => {
      activeConfig.environments[env].enabled = true;
      // Disable other environments
      Object.keys(activeConfig.environments).forEach(key => {
        if (key !== env) {
          activeConfig.environments[key as keyof typeof activeConfig.environments].enabled = false;
        }
      });
      return DanteLogger.config.get();
    },

    /**
     * Configure for a specific platform
     */
    forPlatform: (platform: 'browser' | 'node' | 'terminal' | 'deployment') => {
      activeConfig.platforms[platform].enabled = true;
      // Disable other platforms
      Object.keys(activeConfig.platforms).forEach(key => {
        if (key !== platform) {
          activeConfig.platforms[key as keyof typeof activeConfig.platforms].enabled = false;
        }
      });
      return DanteLogger.config.get();
    },

    /**
     * Enable or disable a realm
     */
    enableRealm: (realm: 'inferno' | 'purgatorio' | 'paradiso', enabled: boolean) => {
      activeConfig.enabledRealms[realm] = enabled;
      return DanteLogger.config.get();
    },

    /**
     * Set minimum log level for a realm
     */
    setMinLevel: (realm: 'inferno' | 'purgatorio' | 'paradiso', level: number) => {
      activeConfig.minimumLevels[realm] = level;
      return DanteLogger.config.get();
    }
  },

  // Utility methods
  getInfernoCategory: (level: InfernoLevel) => InfernoCategories[level],
  getPurgatorioCategory: (level: PurgatorioLevel) => PurgatorioCategories[level],
  getParadisoCategory: (level: ParadisoLevel) => ParadisoCategories[level],

  // Categories for reference
  categories: {
    inferno: InfernoCategories,
    purgatorio: PurgatorioCategories,
    paradiso: ParadisoCategories
  },

  // Environment and platform information
  environment: currentEnvironment,
  platform: currentPlatform
};

export default DanteLogger;
