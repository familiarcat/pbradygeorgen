"use strict";
/**
 * Dante Logger Express.js Integration
 *
 * This module provides middleware for integrating Dante Logger with Express.js applications.
 *
 * NOTE: This implementation is disabled for Next.js build compatibility.
 * This is a stub file to prevent build errors.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DanteExpressLogger = DanteExpressLogger;
/**
 * Create Express middleware for Dante Logger (stub implementation)
 *
 * @param options Middleware options
 * @returns Express middleware function
 */
function DanteExpressLogger(options = {}) {
    // This is a stub implementation that does nothing
    // It's only here to prevent build errors
    return function danteLoggerMiddleware(req, res, next) {
        // Just pass through
        next();
    };
}
exports.default = DanteExpressLogger;
//# sourceMappingURL=express.js.map