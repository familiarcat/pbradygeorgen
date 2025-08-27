/**
 * Dante Logger Core
 * 
 * This module provides the core logging functionality for the Dante Logger,
 * implementing the Divine Comedy-inspired logging system.
 */

import { 
  InfernoCategories, InfernoLevel,
  PurgatorioCategories, PurgatorioLevel,
  ParadisoCategories, ParadisoLevel,
  Categories
} from './categories';
import { DanteLoggerConfig, defaultConfig, createConfig } from './config';
import { formatDanteLog, applyColor, formatData } from './formatters';
import { currentEnvironment, currentPlatform } from '../environments/universal';

/**
 * The core Dante Logger class
 */
export class DanteLoggerCore {
  private config: DanteLoggerConfig;
  
  /**
   * Create a new Dante Logger instance
   * 
   * @param customConfig Optional custom configuration
   */
  constructor(customConfig?: Partial<DanteLoggerConfig>) {
    this.config = customConfig ? createConfig(customConfig) : { ...defaultConfig };
  }
  
  /**
   * Check if logging is enabled for the given realm and level
   * 
   * @param realm The realm (Inferno, Purgatorio, Paradiso)
   * @param level The level within the realm
   * @returns Whether logging is enabled
   */
  private isLoggingEnabled(realm: 'Inferno' | 'Purgatorio' | 'Paradiso', level: number): boolean {
    // Check if the realm is enabled
    const realmKey = realm.toLowerCase() as keyof typeof this.config.enabledRealms;
    if (!this.config.enabledRealms[realmKey]) {
      return false;
    }
    
    // Check if the environment is enabled
    if (!this.config.environments[currentEnvironment].enabled) {
      return false;
    }
    
    // Check if the platform is enabled
    if (!this.config.platforms[currentPlatform].enabled) {
      return false;
    }
    
    // Check minimum level for the realm
    const envMinLevels = this.config.environments[currentEnvironment].minimumLevels;
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
  logInferno(level: InfernoLevel, message: string, data?: any): void {
    if (!this.isLoggingEnabled('Inferno', level)) {
      return;
    }
    
    const category = InfernoCategories[level];
    const formattedMessage = formatDanteLog(this.config, 'Inferno', level, message, category);
    const coloredMessage = applyColor(this.config, currentPlatform, formattedMessage, 'Inferno');
    
    // Call custom handler if provided
    if (this.config.handlers.onError) {
      this.config.handlers.onError(level, message, data);
    }
    
    console.error(coloredMessage);
    if (data !== undefined) {
      console.error(formatData(data));
    }
  }
  
  /**
   * Log a warning (Purgatorio)
   * 
   * @param level The terrace of Purgatorio
   * @param message The warning message
   * @param data Optional additional data
   */
  logPurgatorio(level: PurgatorioLevel, message: string, data?: any): void {
    if (!this.isLoggingEnabled('Purgatorio', level)) {
      return;
    }
    
    const category = PurgatorioCategories[level];
    const formattedMessage = formatDanteLog(this.config, 'Purgatorio', level, message, category);
    const coloredMessage = applyColor(this.config, currentPlatform, formattedMessage, 'Purgatorio');
    
    // Call custom handler if provided
    if (this.config.handlers.onWarning) {
      this.config.handlers.onWarning(level, message, data);
    }
    
    console.warn(coloredMessage);
    if (data !== undefined) {
      console.warn(formatData(data));
    }
  }
  
  /**
   * Log a success (Paradiso)
   * 
   * @param level The sphere of Paradiso
   * @param message The success message
   * @param data Optional additional data
   */
  logParadiso(level: ParadisoLevel, message: string, data?: any): void {
    if (!this.isLoggingEnabled('Paradiso', level)) {
      return;
    }
    
    const category = ParadisoCategories[level];
    const formattedMessage = formatDanteLog(this.config, 'Paradiso', level, message, category);
    const coloredMessage = applyColor(this.config, currentPlatform, formattedMessage, 'Paradiso');
    
    // Call custom handler if provided
    if (this.config.handlers.onSuccess) {
      this.config.handlers.onSuccess(level, message, data);
    }
    
    console.log(coloredMessage);
    if (data !== undefined) {
      console.log(formatData(data));
    }
  }
  
  /**
   * Get the current configuration
   * 
   * @returns A copy of the current configuration
   */
  getConfig(): DanteLoggerConfig {
    return { ...this.config };
  }
  
  /**
   * Update the configuration
   * 
   * @param newConfig The new configuration (partial)
   * @returns The updated configuration
   */
  setConfig(newConfig: Partial<DanteLoggerConfig>): DanteLoggerConfig {
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
  resetConfig(): DanteLoggerConfig {
    this.config = { ...defaultConfig };
    return this.getConfig();
  }
  
  /**
   * Configure for a specific environment
   * 
   * @param env The environment to enable
   * @returns The updated configuration
   */
  forEnvironment(env: 'development' | 'production' | 'test'): DanteLoggerConfig {
    this.config.environments[env].enabled = true;
    
    // Disable other environments
    Object.keys(this.config.environments).forEach(key => {
      if (key !== env) {
        this.config.environments[key as keyof typeof this.config.environments].enabled = false;
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
  forPlatform(platform: 'browser' | 'node' | 'terminal' | 'deployment'): DanteLoggerConfig {
    this.config.platforms[platform].enabled = true;
    
    // Disable other platforms
    Object.keys(this.config.platforms).forEach(key => {
      if (key !== platform) {
        this.config.platforms[key as keyof typeof this.config.platforms].enabled = false;
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
  enableRealm(realm: 'inferno' | 'purgatorio' | 'paradiso', enabled: boolean): DanteLoggerConfig {
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
  setMinLevel(realm: 'inferno' | 'purgatorio' | 'paradiso', level: number): DanteLoggerConfig {
    this.config.minimumLevels[realm] = level;
    return this.getConfig();
  }
}
