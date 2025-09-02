"use strict";
/**
 * Global configuration for the Dante Logger system
 *
 * This file allows customization of the logging behavior across
 * different environments and platforms.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentPlatform = exports.currentEnvironment = exports.defaultConfig = void 0;
exports.detectEnvironment = detectEnvironment;
exports.detectPlatform = detectPlatform;
exports.createConfig = createConfig;
/**
 * Default configuration for the Dante Logger
 */
exports.defaultConfig = {
    enabledRealms: {
        inferno: true,
        purgatorio: true,
        paradiso: true
    },
    minimumLevels: {
        inferno: 1, // Log all errors
        purgatorio: 1, // Log all warnings
        paradiso: 1 // Log all successes
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
                inferno: 1, // Log all errors in production
                purgatorio: 3, // Only log more severe warnings in production
                paradiso: 4 // Only log significant successes in production
            }
        },
        test: {
            enabled: false // Disable logging in test environment by default
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
            colorize: false // Some deployment environments don't support colors
        }
    },
    handlers: {}
};
// Detect current environment
function detectEnvironment() {
    if (typeof process !== 'undefined' && process.env) {
        return process.env.NODE_ENV || 'development';
    }
    return 'development';
}
// Detect current platform
function detectPlatform() {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        return 'browser';
    }
    if (typeof process !== 'undefined' && process.versions && process.versions.node) {
        return 'node';
    }
    return 'terminal';
}
// Current environment and platform
exports.currentEnvironment = detectEnvironment();
exports.currentPlatform = detectPlatform();
// Export a function to create a custom configuration
function createConfig(customConfig) {
    return {
        ...exports.defaultConfig,
        ...customConfig,
        enabledRealms: {
            ...exports.defaultConfig.enabledRealms,
            ...customConfig.enabledRealms
        },
        minimumLevels: {
            ...exports.defaultConfig.minimumLevels,
            ...customConfig.minimumLevels
        },
        formatting: {
            ...exports.defaultConfig.formatting,
            ...customConfig.formatting
        },
        environments: {
            ...exports.defaultConfig.environments,
            ...customConfig.environments
        },
        platforms: {
            ...exports.defaultConfig.platforms,
            ...customConfig.platforms
        },
        handlers: {
            ...exports.defaultConfig.handlers,
            ...customConfig.handlers
        }
    };
}
exports.default = exports.defaultConfig;
//# sourceMappingURL=DanteLoggerConfig.js.map