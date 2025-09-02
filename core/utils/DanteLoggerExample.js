"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserInput = validateUserInput;
exports.processLargeDataset = processLargeDataset;
exports.upgradeSystem = upgradeSystem;
exports.legacyFunction = legacyFunction;
exports.authenticateUser = authenticateUser;
exports.demonstrateDanteLogger = demonstrateDanteLogger;
exports.zodValidationExample = zodValidationExample;
const DanteLogger_1 = require("./DanteLogger");
/**
 * This file demonstrates how to use the DanteLogger in various scenarios
 * throughout your application.
 */
// Example function that uses DanteLogger for validation errors
function validateUserInput(input) {
    if (!input) {
        DanteLogger_1.DanteLogger.error.validation('Input is required');
        return false;
    }
    if (!input.email) {
        DanteLogger_1.DanteLogger.error.validation('Email is required', { input });
        return false;
    }
    if (!input.email.includes('@')) {
        DanteLogger_1.DanteLogger.error.validation('Invalid email format', { email: input.email });
        return false;
    }
    DanteLogger_1.DanteLogger.success.basic('Input validation successful');
    return true;
}
// Example function that uses DanteLogger for performance warnings
function processLargeDataset(data) {
    if (data.length > 10000) {
        DanteLogger_1.DanteLogger.warn.performance('Processing large dataset may impact performance', {
            size: data.length
        });
    }
    // Simulate processing
    const result = data.map(item => ({ ...item, processed: true }));
    if (result.length === data.length) {
        DanteLogger_1.DanteLogger.success.performance('Dataset processed efficiently', {
            itemsProcessed: result.length,
            timePerItem: '0.5ms'
        });
    }
    return result;
}
// Example function that uses DanteLogger for system improvements
function upgradeSystem(version) {
    DanteLogger_1.DanteLogger.success.system(`System upgrade to version ${version} initiated`);
    // Simulate upgrade steps
    try {
        // Database migration
        DanteLogger_1.DanteLogger.success.core('Database migration completed');
        // API updates
        DanteLogger_1.DanteLogger.success.architecture('API structure optimized');
        // Security patches
        DanteLogger_1.DanteLogger.success.security('Security vulnerabilities patched');
        // Final verification
        DanteLogger_1.DanteLogger.success.perfection('System upgrade completed successfully');
        return true;
    }
    catch (error) {
        DanteLogger_1.DanteLogger.error.system('Critical failure during system upgrade', error);
        return false;
    }
}
// Example of handling deprecated features
function legacyFunction() {
    DanteLogger_1.DanteLogger.warn.deprecated('legacyFunction() is deprecated and will be removed in v3.0. Use newFunction() instead.');
    // Function implementation...
}
// Example of logging security concerns
function authenticateUser(credentials) {
    if (credentials.password === 'password123') {
        DanteLogger_1.DanteLogger.warn.security('User using weak password', {
            userId: credentials.userId,
            passwordStrength: 'very weak'
        });
    }
    // Authentication logic...
    const authenticated = true;
    if (authenticated) {
        DanteLogger_1.DanteLogger.success.security('User authenticated successfully');
    }
    return authenticated;
}
// Example of direct circle/terrace/sphere access
function demonstrateDanteLogger() {
    // Direct access to specific circles of Inferno
    DanteLogger_1.DanteLogger.error.circle(9, 'Critical system failure detected');
    // Direct access to specific terraces of Purgatorio
    DanteLogger_1.DanteLogger.warn.terrace(4, 'Operation taking longer than expected');
    // Direct access to specific spheres of Paradiso
    DanteLogger_1.DanteLogger.success.sphere(8, 'Version 2.0 released successfully');
}
// Example of using the logger with Zod validation
function zodValidationExample(error) {
    if (error.name === 'ZodError') {
        DanteLogger_1.DanteLogger.error.validation('Data validation failed', error.errors);
    }
}
//# sourceMappingURL=DanteLoggerExample.js.map