"use strict";
/**
 * Dante Logger React Integration
 *
 * This module provides hooks and components for integrating Dante Logger with React applications.
 *
 * NOTE: This implementation is disabled for Next.js build compatibility.
 * This is a stub file to prevent build errors.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DanteLoggerProvider = DanteLoggerProvider;
exports.useDanteLogger = useDanteLogger;
exports.useComponentLogger = useComponentLogger;
exports.usePerformanceLogger = usePerformanceLogger;
const index_1 = require("../index");
/**
 * Provider component for Dante Logger (stub implementation)
 */
function DanteLoggerProvider({ children }) {
    // Just return the children directly (no JSX)
    return children;
}
/**
 * Hook for using Dante Logger in React components (stub implementation)
 */
function useDanteLogger() {
    return index_1.DanteLogger;
}
/**
 * Hook for logging component lifecycle events (stub implementation)
 */
function useComponentLogger(componentName, options = {}) {
    return index_1.DanteLogger;
}
/**
 * Hook for performance logging in React components (stub implementation)
 */
function usePerformanceLogger(componentName, dependencies = []) {
    return index_1.DanteLogger;
}
exports.default = {
    DanteLoggerProvider,
    useDanteLogger,
    useComponentLogger,
    usePerformanceLogger
};
//# sourceMappingURL=react.js.map