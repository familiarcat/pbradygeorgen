/**
 * Simplified DanteLogger for AWS Amplify build
 * This is a stub implementation that doesn't rely on any external dependencies
 */

export class DanteLogger {
  static info = {
    system: (message: string) => console.log(`ℹ️ [System] ${message}`),
    api: (message: string) => console.log(`ℹ️ [API] ${message}`),
    db: (message: string) => console.log(`ℹ️ [DB] ${message}`),
    auth: (message: string) => console.log(`ℹ️ [Auth] ${message}`),
    ux: (message: string) => console.log(`ℹ️ [UX] ${message}`),
  };

  static success = {
    system: (message: string) => console.log(`✅ [System] ${message}`),
    api: (message: string) => console.log(`✅ [API] ${message}`),
    db: (message: string) => console.log(`✅ [DB] ${message}`),
    auth: (message: string) => console.log(`✅ [Auth] ${message}`),
    ux: (message: string) => console.log(`✅ [UX] ${message}`),
  };

  static warning = {
    system: (message: string) => console.warn(`⚠️ [System] ${message}`),
    api: (message: string) => console.warn(`⚠️ [API] ${message}`),
    db: (message: string) => console.warn(`⚠️ [DB] ${message}`),
    auth: (message: string) => console.warn(`⚠️ [Auth] ${message}`),
    ux: (message: string) => console.warn(`⚠️ [UX] ${message}`),
  };

  static error = {
    system: (message: string) => console.error(`❌ [System] ${message}`),
    api: (message: string) => console.error(`❌ [API] ${message}`),
    db: (message: string) => console.error(`❌ [DB] ${message}`),
    auth: (message: string) => console.error(`❌ [Auth] ${message}`),
    ux: (message: string) => console.error(`❌ [UX] ${message}`),
  };

  static debug = {
    system: (message: string) => console.debug(`🔍 [System] ${message}`),
    api: (message: string) => console.debug(`🔍 [API] ${message}`),
    db: (message: string) => console.debug(`🔍 [DB] ${message}`),
    auth: (message: string) => console.debug(`🔍 [Auth] ${message}`),
    ux: (message: string) => console.debug(`🔍 [UX] ${message}`),
  };
}
