/**
 * Dante Logger Express.js Integration
 *
 * This module provides middleware for integrating Dante Logger with Express.js applications.
 *
 * NOTE: This implementation is disabled for Next.js build compatibility.
 * This is a stub file to prevent build errors.
 */

// Import types but don't use them to avoid errors
import { DanteLoggerConfig } from '../core/config';

/**
 * Options for the Express middleware (stub interface)
 */
export interface DanteExpressOptions {
  logRequests?: boolean;
  logResponses?: boolean;
  logErrors?: boolean;
  loggerConfig?: Partial<DanteLoggerConfig>;
  skip?: (req: any, res: any) => boolean;
}

/**
 * Create Express middleware for Dante Logger (stub implementation)
 *
 * @param options Middleware options
 * @returns Express middleware function
 */
export function DanteExpressLogger(options: DanteExpressOptions = {}) {
  // This is a stub implementation that does nothing
  // It's only here to prevent build errors
  return function danteLoggerMiddleware(req: any, res: any, next: any) {
    // Just pass through
    next();
  };
}

export default DanteExpressLogger;
