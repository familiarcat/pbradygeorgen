"use strict";
/**
 * Dante Logger Configuration
 *
 * This module provides configuration options for the Dante Logger,
 * allowing customization of logging behavior across different
 * environments and platforms.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = void 0;
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
/**
 * Create a custom configuration by merging with the default
 */
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
//# sourceMappingURL=config.js.map