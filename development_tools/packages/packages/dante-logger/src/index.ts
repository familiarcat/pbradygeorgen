/**
 * Dante Logger
 * 
 * A Divine Comedy-inspired logging system that transforms mundane logging
 * into a rich, philosophical experience.
 * 
 * "In the middle of the journey of our codebase, I found myself in a dark forest,
 * for the straight path of development had been lost." - Dante (paraphrased)
 */

import { DanteLoggerCore } from './core/logger';
import { 
  InfernoLevel, PurgatorioLevel, ParadisoLevel,
  InfernoCategories, PurgatorioCategories, ParadisoCategories,
  Categories
} from './core/categories';
import { DanteLoggerConfig } from './core/config';
import { currentEnvironment, currentPlatform } from './environments/universal';

// Create the core logger instance
const loggerCore = new DanteLoggerCore();

/**
 * The Dante Logger API
 */
export const DanteLogger = {
  // Inferno (Errors)
  error: {
    validation: (message: string, data?: any) => loggerCore.logInferno(1, message, data),
    dataFlow: (message: string, data?: any) => loggerCore.logInferno(2, message, data),
    resources: (message: string, data?: any) => loggerCore.logInferno(3, message, data),
    storage: (message: string, data?: any) => loggerCore.logInferno(4, message, data),
    runtime: (message: string, data?: any) => loggerCore.logInferno(5, message, data),
    config: (message: string, data?: any) => loggerCore.logInferno(6, message, data),
    corruption: (message: string, data?: any) => loggerCore.logInferno(7, message, data),
    security: (message: string, data?: any) => loggerCore.logInferno(8, message, data),
    system: (message: string, data?: any) => loggerCore.logInferno(9, message, data),
    
    // Direct circle access
    circle: (level: InfernoLevel, message: string, data?: any) => loggerCore.logInferno(level, message, data)
  },
  
  // Purgatorio (Warnings)
  warn: {
    deprecated: (message: string, data?: any) => loggerCore.logPurgatorio(1, message, data),
    performance: (message: string, data?: any) => loggerCore.logPurgatorio(2, message, data),
    resources: (message: string, data?: any) => loggerCore.logPurgatorio(3, message, data),
    slow: (message: string, data?: any) => loggerCore.logPurgatorio(4, message, data),
    allocation: (message: string, data?: any) => loggerCore.logPurgatorio(5, message, data),
    memory: (message: string, data?: any) => loggerCore.logPurgatorio(6, message, data),
    security: (message: string, data?: any) => loggerCore.logPurgatorio(7, message, data),
    
    // Direct terrace access
    terrace: (level: PurgatorioLevel, message: string, data?: any) => loggerCore.logPurgatorio(level, message, data)
  },
  
  // Paradiso (Success)
  success: {
    basic: (message: string, data?: any) => loggerCore.logParadiso(1, message, data),
    performance: (message: string, data?: any) => loggerCore.logParadiso(2, message, data),
    ux: (message: string, data?: any) => loggerCore.logParadiso(3, message, data),
    core: (message: string, data?: any) => loggerCore.logParadiso(4, message, data),
    security: (message: string, data?: any) => loggerCore.logParadiso(5, message, data),
    system: (message: string, data?: any) => loggerCore.logParadiso(6, message, data),
    architecture: (message: string, data?: any) => loggerCore.logParadiso(7, message, data),
    release: (message: string, data?: any) => loggerCore.logParadiso(8, message, data),
    innovation: (message: string, data?: any) => loggerCore.logParadiso(9, message, data),
    perfection: (message: string, data?: any) => loggerCore.logParadiso(10, message, data),
    
    // Direct sphere access
    sphere: (level: ParadisoLevel, message: string, data?: any) => loggerCore.logParadiso(level, message, data)
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
    set: (newConfig: Partial<DanteLoggerConfig>) => loggerCore.setConfig(newConfig),
    
    /**
     * Reset to default configuration
     */
    reset: () => loggerCore.resetConfig(),
    
    /**
     * Configure for a specific environment
     */
    forEnvironment: (env: 'development' | 'production' | 'test') => loggerCore.forEnvironment(env),
    
    /**
     * Configure for a specific platform
     */
    forPlatform: (platform: 'browser' | 'node' | 'terminal' | 'deployment') => loggerCore.forPlatform(platform),
    
    /**
     * Enable or disable a realm
     */
    enableRealm: (realm: 'inferno' | 'purgatorio' | 'paradiso', enabled: boolean) => loggerCore.enableRealm(realm, enabled),
    
    /**
     * Set minimum log level for a realm
     */
    setMinLevel: (realm: 'inferno' | 'purgatorio' | 'paradiso', level: number) => loggerCore.setMinLevel(realm, level)
  },
  
  // Utility methods
  getInfernoCategory: (level: InfernoLevel) => InfernoCategories[level],
  getPurgatorioCategory: (level: PurgatorioLevel) => PurgatorioCategories[level],
  getParadisoCategory: (level: ParadisoLevel) => ParadisoCategories[level],
  
  // Categories for reference
  categories: Categories,
  
  // Environment and platform information
  environment: currentEnvironment,
  platform: currentPlatform,
  
  // Create a new logger instance with custom configuration
  createLogger: (config?: Partial<DanteLoggerConfig>) => {
    const customCore = new DanteLoggerCore(config);
    
    return {
      error: {
        validation: (message: string, data?: any) => customCore.logInferno(1, message, data),
        dataFlow: (message: string, data?: any) => customCore.logInferno(2, message, data),
        resources: (message: string, data?: any) => customCore.logInferno(3, message, data),
        storage: (message: string, data?: any) => customCore.logInferno(4, message, data),
        runtime: (message: string, data?: any) => customCore.logInferno(5, message, data),
        config: (message: string, data?: any) => customCore.logInferno(6, message, data),
        corruption: (message: string, data?: any) => customCore.logInferno(7, message, data),
        security: (message: string, data?: any) => customCore.logInferno(8, message, data),
        system: (message: string, data?: any) => customCore.logInferno(9, message, data),
        circle: (level: InfernoLevel, message: string, data?: any) => customCore.logInferno(level, message, data)
      },
      warn: {
        deprecated: (message: string, data?: any) => customCore.logPurgatorio(1, message, data),
        performance: (message: string, data?: any) => customCore.logPurgatorio(2, message, data),
        resources: (message: string, data?: any) => customCore.logPurgatorio(3, message, data),
        slow: (message: string, data?: any) => customCore.logPurgatorio(4, message, data),
        allocation: (message: string, data?: any) => customCore.logPurgatorio(5, message, data),
        memory: (message: string, data?: any) => customCore.logPurgatorio(6, message, data),
        security: (message: string, data?: any) => customCore.logPurgatorio(7, message, data),
        terrace: (level: PurgatorioLevel, message: string, data?: any) => customCore.logPurgatorio(level, message, data)
      },
      success: {
        basic: (message: string, data?: any) => customCore.logParadiso(1, message, data),
        performance: (message: string, data?: any) => customCore.logParadiso(2, message, data),
        ux: (message: string, data?: any) => customCore.logParadiso(3, message, data),
        core: (message: string, data?: any) => customCore.logParadiso(4, message, data),
        security: (message: string, data?: any) => customCore.logParadiso(5, message, data),
        system: (message: string, data?: any) => customCore.logParadiso(6, message, data),
        architecture: (message: string, data?: any) => customCore.logParadiso(7, message, data),
        release: (message: string, data?: any) => customCore.logParadiso(8, message, data),
        innovation: (message: string, data?: any) => customCore.logParadiso(9, message, data),
        perfection: (message: string, data?: any) => customCore.logParadiso(10, message, data),
        sphere: (level: ParadisoLevel, message: string, data?: any) => customCore.logParadiso(level, message, data)
      },
      config: {
        get: () => customCore.getConfig(),
        set: (newConfig: Partial<DanteLoggerConfig>) => customCore.setConfig(newConfig),
        reset: () => customCore.resetConfig(),
        forEnvironment: (env: 'development' | 'production' | 'test') => customCore.forEnvironment(env),
        forPlatform: (platform: 'browser' | 'node' | 'terminal' | 'deployment') => customCore.forPlatform(platform),
        enableRealm: (realm: 'inferno' | 'purgatorio' | 'paradiso', enabled: boolean) => customCore.enableRealm(realm, enabled),
        setMinLevel: (realm: 'inferno' | 'purgatorio' | 'paradiso', level: number) => customCore.setMinLevel(realm, level)
      }
    };
  }
};

// Export types for TypeScript users
export type { DanteLoggerConfig } from './core/config';
export type { InfernoLevel, PurgatorioLevel, ParadisoLevel, Category } from './core/categories';

// Default export
export default DanteLogger;
