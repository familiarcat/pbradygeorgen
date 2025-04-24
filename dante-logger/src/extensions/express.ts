/**
 * Dante Logger Express.js Integration
 *
 * This module provides middleware for integrating Dante Logger with Express.js applications.
 *
 * NOTE: This is a temporary fix for Next.js build compatibility.
 * The actual implementation is disabled for this build.
 */

// Define types to avoid importing express
interface Request {
  method: string;
  url: string;
  query: any;
  params: any;
  headers: any;
  ip: string;
}

interface Response {
  statusCode: number;
  end: any;
  getHeaders: () => any;
}

type NextFunction = (err?: any) => void;

import { DanteLogger } from '../index';
import { DanteLoggerConfig } from '../core/config';

/**
 * Options for the Express middleware
 */
export interface DanteExpressOptions {
  /**
   * Whether to log requests
   */
  logRequests?: boolean;

  /**
   * Whether to log responses
   */
  logResponses?: boolean;

  /**
   * Whether to log errors
   */
  logErrors?: boolean;

  /**
   * Custom logger configuration
   */
  loggerConfig?: Partial<DanteLoggerConfig>;

  /**
   * Skip logging for certain requests
   */
  skip?: (req: Request, res: Response) => boolean;
}

/**
 * Create Express middleware for Dante Logger
 *
 * @param options Middleware options
 * @returns Express middleware function
 */
export function DanteExpressLogger(options: DanteExpressOptions = {}) {
  const {
    logRequests = true,
    logResponses = true,
    logErrors = true,
    loggerConfig,
    skip = () => false
  } = options;

  // Create a custom logger if configuration is provided
  const logger = loggerConfig ? DanteLogger.createLogger(loggerConfig) : DanteLogger;

  return function danteLoggerMiddleware(req: Request, res: Response, next: NextFunction) {
    // Skip logging if the skip function returns true
    if (skip(req, res)) {
      return next();
    }

    // Store the start time for calculating response time
    const startTime = Date.now();

    // Log the request
    if (logRequests) {
      logger.success.basic(`Request: ${req.method} ${req.url}`, {
        method: req.method,
        url: req.url,
        query: req.query,
        params: req.params,
        headers: req.headers,
        ip: req.ip
      });
    }

    // Capture the original end method
    const originalEnd = res.end;

    // Override the end method to log the response
    res.end = function(chunk?: any, encoding?: string, callback?: () => void): Response {
      // Restore the original end method
      res.end = originalEnd;

      // Call the original end method
      res.end(chunk, encoding, callback);

      // Calculate response time
      const responseTime = Date.now() - startTime;

      // Log the response
      if (logResponses) {
        const statusCode = res.statusCode;

        if (statusCode >= 500) {
          logger.error.system(`Response: ${statusCode} ${req.method} ${req.url} (${responseTime}ms)`, {
            method: req.method,
            url: req.url,
            statusCode,
            responseTime,
            headers: res.getHeaders()
          });
        } else if (statusCode >= 400) {
          logger.error.validation(`Response: ${statusCode} ${req.method} ${req.url} (${responseTime}ms)`, {
            method: req.method,
            url: req.url,
            statusCode,
            responseTime,
            headers: res.getHeaders()
          });
        } else if (statusCode >= 300) {
          logger.warn.dataFlow(`Response: ${statusCode} ${req.method} ${req.url} (${responseTime}ms)`, {
            method: req.method,
            url: req.url,
            statusCode,
            responseTime,
            headers: res.getHeaders()
          });
        } else {
          // Performance categorization based on response time
          if (responseTime < 100) {
            logger.success.performance(`Response: ${statusCode} ${req.method} ${req.url} (${responseTime}ms)`, {
              method: req.method,
              url: req.url,
              statusCode,
              responseTime,
              headers: res.getHeaders()
            });
          } else if (responseTime < 500) {
            logger.success.basic(`Response: ${statusCode} ${req.method} ${req.url} (${responseTime}ms)`, {
              method: req.method,
              url: req.url,
              statusCode,
              responseTime,
              headers: res.getHeaders()
            });
          } else {
            logger.warn.slow(`Response: ${statusCode} ${req.method} ${req.url} (${responseTime}ms)`, {
              method: req.method,
              url: req.url,
              statusCode,
              responseTime,
              headers: res.getHeaders()
            });
          }
        }
      }

      return res;
    };

    // Error handling
    if (logErrors) {
      // Capture errors
      const originalNext = next;

      next = function(err?: any) {
        if (err) {
          logger.error.runtime(`Error: ${err.message || 'Unknown error'}`, {
            error: err,
            method: req.method,
            url: req.url
          });
        }

        originalNext(err);
      };
    }

    next();
  };
}

export default DanteExpressLogger;
