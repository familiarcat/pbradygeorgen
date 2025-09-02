"use strict";
/**
 * Dante Logger
 *
 * A Divine Comedy-inspired logging system that transforms mundane logging
 * into a rich, philosophical experience.
 *
 * "In the middle of the journey of our codebase, I found myself in a dark forest,
 * for the straight path of development had been lost." - Dante (paraphrased)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DanteLogger = void 0;
const logger_1 = require("./core/logger");
const categories_1 = require("./core/categories");
const universal_1 = require("./environments/universal");
// Create the core logger instance
const loggerCore = new logger_1.DanteLoggerCore();
/**
 * The Dante Logger API
 */
exports.DanteLogger = {
    // Inferno (Errors)
    error: {
        validation: (message, data) => loggerCore.logInferno(1, message, data),
        dataFlow: (message, data) => loggerCore.logInferno(2, message, data),
        resources: (message, data) => loggerCore.logInferno(3, message, data),
        storage: (message, data) => loggerCore.logInferno(4, message, data),
        runtime: (message, data) => loggerCore.logInferno(5, message, data),
        config: (message, data) => loggerCore.logInferno(6, message, data),
        corruption: (message, data) => loggerCore.logInferno(7, message, data),
        security: (message, data) => loggerCore.logInferno(8, message, data),
        system: (message, data) => loggerCore.logInferno(9, message, data),
        // Direct circle access
        circle: (level, message, data) => loggerCore.logInferno(level, message, data)
    },
    // Purgatorio (Warnings)
    warn: {
        deprecated: (message, data) => loggerCore.logPurgatorio(1, message, data),
        performance: (message, data) => loggerCore.logPurgatorio(2, message, data),
        resources: (message, data) => loggerCore.logPurgatorio(3, message, data),
        slow: (message, data) => loggerCore.logPurgatorio(4, message, data),
        allocation: (message, data) => loggerCore.logPurgatorio(5, message, data),
        memory: (message, data) => loggerCore.logPurgatorio(6, message, data),
        security: (message, data) => loggerCore.logPurgatorio(7, message, data),
        // Direct terrace access
        terrace: (level, message, data) => loggerCore.logPurgatorio(level, message, data)
    },
    // Paradiso (Success)
    success: {
        basic: (message, data) => loggerCore.logParadiso(1, message, data),
        performance: (message, data) => loggerCore.logParadiso(2, message, data),
        ux: (message, data) => loggerCore.logParadiso(3, message, data),
        core: (message, data) => loggerCore.logParadiso(4, message, data),
        security: (message, data) => loggerCore.logParadiso(5, message, data),
        system: (message, data) => loggerCore.logParadiso(6, message, data),
        architecture: (message, data) => loggerCore.logParadiso(7, message, data),
        release: (message, data) => loggerCore.logParadiso(8, message, data),
        innovation: (message, data) => loggerCore.logParadiso(9, message, data),
        perfection: (message, data) => loggerCore.logParadiso(10, message, data),
        // Direct sphere access
        sphere: (level, message, data) => loggerCore.logParadiso(level, message, data)
    },
    // Configuration methods
    config: {
        /**
         * Get the current configuration
         */
        get: () => loggerCore.getConfig(),
        /**
         * Update the configuration
         */
        set: (newConfig) => loggerCore.setConfig(newConfig),
        /**
         * Reset to default configuration
         */
        reset: () => loggerCore.resetConfig(),
        /**
         * Configure for a specific environment
         */
        forEnvironment: (env) => loggerCore.forEnvironment(env),
        /**
         * Configure for a specific platform
         */
        forPlatform: (platform) => loggerCore.forPlatform(platform),
        /**
         * Enable or disable a realm
         */
        enableRealm: (realm, enabled) => loggerCore.enableRealm(realm, enabled),
        /**
         * Set minimum log level for a realm
         */
        setMinLevel: (realm, level) => loggerCore.setMinLevel(realm, level)
    },
    // Utility methods
    getInfernoCategory: (level) => categories_1.InfernoCategories[level],
    getPurgatorioCategory: (level) => categories_1.PurgatorioCategories[level],
    getParadisoCategory: (level) => categories_1.ParadisoCategories[level],
    // Categories for reference
    categories: categories_1.Categories,
    // Environment and platform information
    environment: universal_1.currentEnvironment,
    platform: universal_1.currentPlatform,
    // Create a new logger instance with custom configuration
    createLogger: (config) => {
        const customCore = new logger_1.DanteLoggerCore(config);
        return {
            error: {
                validation: (message, data) => customCore.logInferno(1, message, data),
                dataFlow: (message, data) => customCore.logInferno(2, message, data),
                resources: (message, data) => customCore.logInferno(3, message, data),
                storage: (message, data) => customCore.logInferno(4, message, data),
                runtime: (message, data) => customCore.logInferno(5, message, data),
                config: (message, data) => customCore.logInferno(6, message, data),
                corruption: (message, data) => customCore.logInferno(7, message, data),
                security: (message, data) => customCore.logInferno(8, message, data),
                system: (message, data) => customCore.logInferno(9, message, data),
                circle: (level, message, data) => customCore.logInferno(level, message, data)
            },
            warn: {
                deprecated: (message, data) => customCore.logPurgatorio(1, message, data),
                performance: (message, data) => customCore.logPurgatorio(2, message, data),
                resources: (message, data) => customCore.logPurgatorio(3, message, data),
                slow: (message, data) => customCore.logPurgatorio(4, message, data),
                allocation: (message, data) => customCore.logPurgatorio(5, message, data),
                memory: (message, data) => customCore.logPurgatorio(6, message, data),
                security: (message, data) => customCore.logPurgatorio(7, message, data),
                terrace: (level, message, data) => customCore.logPurgatorio(level, message, data)
            },
            success: {
                basic: (message, data) => customCore.logParadiso(1, message, data),
                performance: (message, data) => customCore.logParadiso(2, message, data),
                ux: (message, data) => customCore.logParadiso(3, message, data),
                core: (message, data) => customCore.logParadiso(4, message, data),
                security: (message, data) => customCore.logParadiso(5, message, data),
                system: (message, data) => customCore.logParadiso(6, message, data),
                architecture: (message, data) => customCore.logParadiso(7, message, data),
                release: (message, data) => customCore.logParadiso(8, message, data),
                innovation: (message, data) => customCore.logParadiso(9, message, data),
                perfection: (message, data) => customCore.logParadiso(10, message, data),
                sphere: (level, message, data) => customCore.logParadiso(level, message, data)
            },
            config: {
                get: () => customCore.getConfig(),
                set: (newConfig) => customCore.setConfig(newConfig),
                reset: () => customCore.resetConfig(),
                forEnvironment: (env) => customCore.forEnvironment(env),
                forPlatform: (platform) => customCore.forPlatform(platform),
                enableRealm: (realm, enabled) => customCore.enableRealm(realm, enabled),
                setMinLevel: (realm, level) => customCore.setMinLevel(realm, level)
            }
        };
    }
};
// Default export
exports.default = exports.DanteLogger;
//# sourceMappingURL=index.js.map