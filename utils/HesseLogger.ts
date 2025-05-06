/**
 * Simplified HesseLogger for AWS Amplify build
 */

export class HesseLogger {
  static info = {
    system: (message: string) => console.log(`ℹ️ [Hesse:System] ${message}`),
    api: (message: string) => console.log(`ℹ️ [Hesse:API] ${message}`),
    db: (message: string) => console.log(`ℹ️ [Hesse:DB] ${message}`),
    auth: (message: string) => console.log(`ℹ️ [Hesse:Auth] ${message}`),
    ux: (message: string) => console.log(`ℹ️ [Hesse:UX] ${message}`),
  };

  static summary = {
    start: (message: string) => console.log(`🔄 [Hesse:Summary] ${message}`),
    complete: (message: string) => console.log(`✅ [Hesse:Summary] ${message}`),
    error: (message: string) => console.error(`❌ [Hesse:Summary] ${message}`),
    warning: (message: string) => console.warn(`⚠️ [Hesse:Summary] ${message}`),
    info: (message: string) => console.log(`ℹ️ [Hesse:Summary] ${message}`),
  };

  static success = {
    system: (message: string) => console.log(`✅ [Hesse:System] ${message}`),
    api: (message: string) => console.log(`✅ [Hesse:API] ${message}`),
    db: (message: string) => console.log(`✅ [Hesse:DB] ${message}`),
    auth: (message: string) => console.log(`✅ [Hesse:Auth] ${message}`),
    ux: (message: string) => console.log(`✅ [Hesse:UX] ${message}`),
  };

  static warning = {
    system: (message: string) => console.warn(`⚠️ [Hesse:System] ${message}`),
    api: (message: string) => console.warn(`⚠️ [Hesse:API] ${message}`),
    db: (message: string) => console.warn(`⚠️ [Hesse:DB] ${message}`),
    auth: (message: string) => console.warn(`⚠️ [Hesse:Auth] ${message}`),
    ux: (message: string) => console.warn(`⚠️ [Hesse:UX] ${message}`),
  };

  static error = {
    system: (message: string) => console.error(`❌ [Hesse:System] ${message}`),
    api: (message: string) => console.error(`❌ [Hesse:API] ${message}`),
    db: (message: string) => console.error(`❌ [Hesse:DB] ${message}`),
    auth: (message: string) => console.error(`❌ [Hesse:Auth] ${message}`),
    ux: (message: string) => console.error(`❌ [Hesse:UX] ${message}`),
  };

  static debug = {
    system: (message: string) => console.debug(`🔍 [Hesse:System] ${message}`),
    api: (message: string) => console.debug(`🔍 [Hesse:API] ${message}`),
    db: (message: string) => console.debug(`🔍 [Hesse:DB] ${message}`),
    auth: (message: string) => console.debug(`🔍 [Hesse:Auth] ${message}`),
    ux: (message: string) => console.debug(`🔍 [Hesse:UX] ${message}`),
  };
}
