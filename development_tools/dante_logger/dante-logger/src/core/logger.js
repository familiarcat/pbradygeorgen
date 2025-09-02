"use strict";
/**
 * Dante Logger Core
 *
 * This module provides the core logging functionality for the Dante Logger,
 * implementing the Divine Comedy-inspired logging system.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DanteLoggerCore = void 0;
const categories_1 = require("./categories");
const config_1 = require("./config");
const formatters_1 = require("./formatters");
const universal_1 = require("../environments/universal");
/**
 * The core Dante Logger class
 */
class DanteLoggerCore {
    /**
     * Create a new Dante Logger instance
     *
     * @param customConfig Optional custom configuration
     */
    constructor(customConfig) {
        this.config = customConfig ? (0, config_1.createConfig)(customConfig) : { ...config_1.defaultConfig };
    }
    /**
     * Check if logging is enabled for the given realm and level
     *
     * @param realm The realm (Inferno, Purgatorio, Paradiso)
     * @param level The level within the realm
     * @returns Whether logging is enabled
     */
    isLoggingEnabled(realm, level) {
        // Check if the realm is enabled
        const realmKey = realm.toLowerCase();
        if (!this.config.enabledRealms[realmKey]) {
            return false;
        }
        // Check if the environment is enabled
        if (!this.config.environments[universal_1.currentEnvironment].enabled) {
            return false;
        }
        // Check if the platform is enabled
        if (!this.config.platforms[universal_1.currentPlatform].enabled) {
            return false;
        }
        // Check minimum level for the realm
        const envMinLevels = this.config.environments[universal_1.currentEnvironment].minimumLevels;
        const minLevel = envMinLevels && envMinLevels[realmKey] !== undefined
            ? envMinLevels[realmKey]
            : this.config.minimumLevels[realmKey];
        return level >= minLevel;
    }
    /**
     * Log an error (Inferno)
     *
     * @param level The circle of Inferno
     * @param message The error message
     * @param data Optional additional data
     */
    logInferno(level, message, data) {
        if (!this.isLoggingEnabled('Inferno', level)) {
            return;
        }
        const category = categories_1.InfernoCategories[level];
        const formattedMessage = (0, formatters_1.formatDanteLog)(this.config, 'Inferno', level, message, category);
        const coloredMessage = (0, formatters_1.applyColor)(this.config, universal_1.currentPlatform, formattedMessage, 'Inferno');
        // Call custom handler if provided
        if (this.config.handlers.onError) {
            this.config.handlers.onError(level, message, data);
        }
        console.error(coloredMessage);
        if (data !== undefined) {
            console.error((0, formatters_1.formatData)(data));
        }
    }
    /**
     * Log a warning (Purgatorio)
     *
     * @param level The terrace of Purgatorio
     * @param message The warning message
     * @param data Optional additional data
     */
    logPurgatorio(level, message, data) {
        if (!this.isLoggingEnabled('Purgatorio', level)) {
            return;
        }
        const category = categories_1.PurgatorioCategories[level];
        const formattedMessage = (0, formatters_1.formatDanteLog)(this.config, 'Purgatorio', level, message, category);
        const coloredMessage = (0, formatters_1.applyColor)(this.config, universal_1.currentPlatform, formattedMessage, 'Purgatorio');
        // Call custom handler if provided
        if (this.config.handlers.onWarning) {
            this.config.handlers.onWarning(level, message, data);
        }
        console.warn(coloredMessage);
        if (data !== undefined) {
            console.warn((0, formatters_1.formatData)(data));
        }
    }
    /**
     * Log a success (Paradiso)
     *
     * @param level The sphere of Paradiso
     * @param message The success message
     * @param data Optional additional data
     */
    logParadiso(level, message, data) {
        if (!this.isLoggingEnabled('Paradiso', level)) {
            return;
        }
        const category = categories_1.ParadisoCategories[level];
        const formattedMessage = (0, formatters_1.formatDanteLog)(this.config, 'Paradiso', level, message, category);
        const coloredMessage = (0, formatters_1.applyColor)(this.config, universal_1.currentPlatform, formattedMessage, 'Paradiso');
        // Call custom handler if provided
        if (this.config.handlers.onSuccess) {
            this.config.handlers.onSuccess(level, message, data);
        }
        console.log(coloredMessage);
        if (data !== undefined) {
            console.log((0, formatters_1.formatData)(data));
        }
    }
    /**
     * Get the current configuration
     *
     * @returns A copy of the current configuration
     */
    getConfig() {
        return { ...this.config };
    }
    /**
     * Update the configuration
     *
     * @param newConfig The new configuration (partial)
     * @returns The updated configuration
     */
    setConfig(newConfig) {
        this.config = {
            ...this.config,
            ...newConfig,
            enabledRealms: {
                ...this.config.enabledRealms,
                ...newConfig.enabledRealms
            },
            minimumLevels: {
                ...this.config.minimumLevels,
                ...newConfig.minimumLevels
            },
            formatting: {
                ...this.config.formatting,
                ...newConfig.formatting
            },
            environments: {
                ...this.config.environments,
                ...newConfig.environments
            },
            platforms: {
                ...this.config.platforms,
                ...newConfig.platforms
            },
            handlers: {
                ...this.config.handlers,
                ...newConfig.handlers
            }
        };
        return this.getConfig();
    }
    /**
     * Reset to default configuration
     *
     * @returns The default configuration
     */
    resetConfig() {
        this.config = { ...config_1.defaultConfig };
        return this.getConfig();
    }
    /**
     * Configure for a specific environment
     *
     * @param env The environment to enable
     * @returns The updated configuration
     */
    forEnvironment(env) {
        this.config.environments[env].enabled = true;
        // Disable other environments
        Object.keys(this.config.environments).forEach(key => {
            if (key !== env) {
                this.config.environments[key].enabled = false;
            }
        });
        return this.getConfig();
    }
    /**
     * Configure for a specific platform
     *
     * @param platform The platform to enable
     * @returns The updated configuration
     */
    forPlatform(platform) {
        this.config.platforms[platform].enabled = true;
        // Disable other platforms
        Object.keys(this.config.platforms).forEach(key => {
            if (key !== platform) {
                this.config.platforms[key].enabled = false;
            }
        });
        return this.getConfig();
    }
    /**
     * Enable or disable a realm
     *
     * @param realm The realm to configure
     * @param enabled Whether to enable the realm
     * @returns The updated configuration
     */
    enableRealm(realm, enabled) {
        this.config.enabledRealms[realm] = enabled;
        return this.getConfig();
    }
    /**
     * Set minimum log level for a realm
     *
     * @param realm The realm to configure
     * @param level The minimum level to log
     * @returns The updated configuration
     */
    setMinLevel(realm, level) {
        this.config.minimumLevels[realm] = level;
        return this.getConfig();
    }
}
exports.DanteLoggerCore = DanteLoggerCore;
//# sourceMappingURL=logger.js.map