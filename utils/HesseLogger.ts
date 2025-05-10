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

  // AI-specific logging
  static ai = {
    start: (message: string) => console.log(`🧠 [Hesse:AI] ${message}`),
    info: (message: string) => console.log(`ℹ️ [Hesse:AI] ${message}`),
    success: (message: string) => console.log(`✅ [Hesse:AI] ${message}`),
    warning: (message: string) => console.warn(`⚠️ [Hesse:AI] ${message}`),
    error: (message: string) => console.error(`❌ [Hesse:AI] ${message}`),
  };

  // OpenAI-specific logging
  static openai = {
    request: (message: string) => console.log(`🔄 [Hesse:OpenAI] ${message}`),
    response: (message: string) => console.log(`✅ [Hesse:OpenAI] ${message}`),
    error: (message: string) => console.error(`❌ [Hesse:OpenAI] ${message}`),
  };

  // Summary logging
  static summary = {
    start: (message: string) => console.log(`📊 [Hesse:Summary] ${message}`),
    end: (message: string) => console.log(`✅ [Hesse:Summary] ${message}`),
  };
}
