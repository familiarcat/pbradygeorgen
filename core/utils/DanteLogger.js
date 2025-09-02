"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DanteLogger = void 0;
const DanteLoggerConfig_1 = require("./DanteLoggerConfig");
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
};
// Purgatorio (Warning) categories with their corresponding terraces
const PurgatorioCategories = {
    1: { name: 'Pride', emoji: '⚠️🪨', description: 'Deprecated feature usage' },
    2: { name: 'Envy', emoji: '⚠️👁️', description: 'Performance concerns' },
    3: { name: 'Wrath', emoji: '⚠️⚡', description: 'Resource warnings' },
    4: { name: 'Sloth', emoji: '⚠️🐌', description: 'Slow operations' },
    5: { name: 'Avarice', emoji: '⚠️💎', description: 'Excessive resource allocation' },
    6: { name: 'Gluttony', emoji: '⚠️🍽️', description: 'Memory leaks' },
    7: { name: 'Lust', emoji: '⚠️🔥', description: 'Potential security issues' }
};
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
};
// Current active configuration
let activeConfig = { ...DanteLoggerConfig_1.defaultConfig };
/**
 * Format a log message according to Dante's cosmology
 */
function formatDanteLog(realm, level, message, data, categories = {}) {
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
function isLoggingEnabled(realm, level) {
    // Check if the realm is enabled
    const realmKey = realm.toLowerCase();
    if (!activeConfig.enabledRealms[realmKey]) {
        return false;
    }
    // Check if the environment is enabled
    if (!activeConfig.environments[DanteLoggerConfig_1.currentEnvironment].enabled) {
        return false;
    }
    // Check if the platform is enabled
    if (!activeConfig.platforms[DanteLoggerConfig_1.currentPlatform].enabled) {
        return false;
    }
    // Check minimum level for the realm
    const envMinLevels = activeConfig.environments[DanteLoggerConfig_1.currentEnvironment].minimumLevels;
    const minLevel = envMinLevels && envMinLevels[realmKey] !== undefined
        ? envMinLevels[realmKey]
        : activeConfig.minimumLevels[realmKey];
    return level >= minLevel;
}
/**
 * Apply color to a log message if enabled
 */
function applyColor(message, realm) {
    if (!activeConfig.formatting.colorize || !activeConfig.platforms[DanteLoggerConfig_1.currentPlatform].colorize) {
        return message;
    }
    // ANSI color codes for terminal output
    // Only apply in Node.js or terminal environments
    if (DanteLoggerConfig_1.currentPlatform === 'node' || DanteLoggerConfig_1.currentPlatform === 'terminal') {
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
function logInferno(level, message, data) {
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
    if (data)
        console.error(data);
}
/**
 * Log a warning (Purgatorio)
 */
function logPurgatorio(level, message, data) {
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
    if (data)
        console.warn(data);
}
/**
 * Log a success (Paradiso)
 */
function logParadiso(level, message, data) {
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
    if (data)
        console.log(data);
}
/**
 * The DanteLogger API
 */
exports.DanteLogger = {
    // Inferno (Errors)
    error: {
        validation: (message, data) => logInferno(1, message, data),
        dataFlow: (message, data) => logInferno(2, message, data),
        resources: (message, data) => logInferno(3, message, data),
        storage: (message, data) => logInferno(4, message, data),
        runtime: (message, data) => logInferno(5, message, data),
        config: (message, data) => logInferno(6, message, data),
        corruption: (message, data) => logInferno(7, message, data),
        security: (message, data) => logInferno(8, message, data),
        system: (message, data) => logInferno(9, message, data),
        // Direct circle access
        circle: (level, message, data) => logInferno(level, message, data)
    },
    // Purgatorio (Warnings)
    warn: {
        deprecated: (message, data) => logPurgatorio(1, message, data),
        performance: (message, data) => logPurgatorio(2, message, data),
        resources: (message, data) => logPurgatorio(3, message, data),
        slow: (message, data) => logPurgatorio(4, message, data),
        allocation: (message, data) => logPurgatorio(5, message, data),
        memory: (message, data) => logPurgatorio(6, message, data),
        security: (message, data) => logPurgatorio(7, message, data),
        // Direct terrace access
        terrace: (level, message, data) => logPurgatorio(level, message, data)
    },
    // Paradiso (Success)
    success: {
        basic: (message, data) => logParadiso(1, message, data),
        performance: (message, data) => logParadiso(2, message, data),
        ux: (message, data) => logParadiso(3, message, data),
        core: (message, data) => logParadiso(4, message, data),
        security: (message, data) => logParadiso(5, message, data),
        system: (message, data) => logParadiso(6, message, data),
        architecture: (message, data) => logParadiso(7, message, data),
        release: (message, data) => logParadiso(8, message, data),
        innovation: (message, data) => logParadiso(9, message, data),
        perfection: (message, data) => logParadiso(10, message, data),
        // Direct sphere access
        sphere: (level, message, data) => logParadiso(level, message, data)
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
        set: (newConfig) => {
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
            return exports.DanteLogger.config.get();
        },
        /**
         * Reset to default configuration
         */
        reset: () => {
            activeConfig = { ...DanteLoggerConfig_1.defaultConfig };
            return exports.DanteLogger.config.get();
        },
        /**
         * Configure for a specific environment
         */
        forEnvironment: (env) => {
            activeConfig.environments[env].enabled = true;
            // Disable other environments
            Object.keys(activeConfig.environments).forEach(key => {
                if (key !== env) {
                    activeConfig.environments[key].enabled = false;
                }
            });
            return exports.DanteLogger.config.get();
        },
        /**
         * Configure for a specific platform
         */
        forPlatform: (platform) => {
            activeConfig.platforms[platform].enabled = true;
            // Disable other platforms
            Object.keys(activeConfig.platforms).forEach(key => {
                if (key !== platform) {
                    activeConfig.platforms[key].enabled = false;
                }
            });
            return exports.DanteLogger.config.get();
        },
        /**
         * Enable or disable a realm
         */
        enableRealm: (realm, enabled) => {
            activeConfig.enabledRealms[realm] = enabled;
            return exports.DanteLogger.config.get();
        },
        /**
         * Set minimum log level for a realm
         */
        setMinLevel: (realm, level) => {
            activeConfig.minimumLevels[realm] = level;
            return exports.DanteLogger.config.get();
        }
    },
    // Utility methods
    getInfernoCategory: (level) => InfernoCategories[level],
    getPurgatorioCategory: (level) => PurgatorioCategories[level],
    getParadisoCategory: (level) => ParadisoCategories[level],
    // Categories for reference
    categories: {
        inferno: InfernoCategories,
        purgatorio: PurgatorioCategories,
        paradiso: ParadisoCategories
    },
    // Environment and platform information
    environment: DanteLoggerConfig_1.currentEnvironment,
    platform: DanteLoggerConfig_1.currentPlatform
};
exports.default = exports.DanteLogger;
//# sourceMappingURL=DanteLogger.js.map