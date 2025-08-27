/**
 * This file demonstrates how to use the DanteLogger across different environments
 * and platforms, showing its versatility as a global logging solution.
 */

import { DanteLogger } from './DanteLogger';

/**
 * Configure DanteLogger for a browser environment
 */
export function setupBrowserLogger() {
  // Configure for browser environment
  DanteLogger.config.forPlatform('browser');
  
  // Set up custom formatting for browser
  DanteLogger.config.set({
    formatting: {
      includeTimestamp: false,  // Browsers add timestamps automatically
      includeEmoji: true,       // Emojis work well in browser consoles
      colorize: true,           // Modern browsers support colors
      includeRealmName: true,
      includeLevelNumber: true,
      includeCategoryName: true
    }
  });
  
  // Add custom handlers for browser-specific behavior
  DanteLogger.config.set({
    handlers: {
      onError: (circle, message) => {
        // For critical errors, you might want to send to an error tracking service
        if (circle >= 8) {
          // Example: Sentry.captureException(new Error(message));
          console.log(`Would send to error tracking: ${message}`);
        }
      }
    }
  });
  
  return DanteLogger;
}

/**
 * Configure DanteLogger for a Node.js server environment
 */
export function setupServerLogger() {
  // Configure for Node.js environment
  DanteLogger.config.forPlatform('node');
  
  // Set up custom formatting for server logs
  DanteLogger.config.set({
    formatting: {
      includeTimestamp: true,   // Important for server logs
      includeEmoji: true,       // Works in most terminal emulators
      colorize: true,           // ANSI colors for terminal output
      includeRealmName: true,
      includeLevelNumber: true,
      includeCategoryName: true
    }
  });
  
  // Add custom handlers for server-specific behavior
  DanteLogger.config.set({
    handlers: {
      onError: (circle, message, data) => {
        // For critical errors, you might want to write to a log file
        if (circle >= 7) {
          // Example: fs.appendFileSync('error.log', `${new Date().toISOString()} - ${message}\n`);
          console.log(`Would write to error log: ${message}`);
        }
      }
    }
  });
  
  return DanteLogger;
}

/**
 * Configure DanteLogger for a CI/CD deployment environment
 */
export function setupDeploymentLogger() {
  // Configure for deployment environment
  DanteLogger.config.forPlatform('deployment');
  DanteLogger.config.forEnvironment('production');
  
  // Set up custom formatting for deployment logs
  DanteLogger.config.set({
    formatting: {
      includeTimestamp: true,   // Critical for deployment logs
      includeEmoji: false,      // Some CI systems don't handle emojis well
      colorize: false,          // Some CI systems don't handle colors well
      includeRealmName: true,
      includeLevelNumber: true,
      includeCategoryName: true
    },
    // Only show errors and important successes in deployment
    minimumLevels: {
      inferno: 1,      // All errors
      purgatorio: 5,   // Only severe warnings
      paradiso: 7      // Only significant successes
    }
  });
  
  return DanteLogger;
}

/**
 * Configure DanteLogger for a shell script
 */
export function setupShellScriptLogger() {
  // Configure for terminal environment
  DanteLogger.config.forPlatform('terminal');
  
  // Set up custom formatting for shell scripts
  DanteLogger.config.set({
    formatting: {
      includeTimestamp: true,
      includeEmoji: true,
      colorize: true,
      includeRealmName: false,  // Simpler output for shell scripts
      includeLevelNumber: false,
      includeCategoryName: true
    }
  });
  
  return DanteLogger;
}

/**
 * Example of using DanteLogger in a shell script
 */
export function exampleShellScript() {
  const logger = setupShellScriptLogger();
  
  logger.success.basic('Starting deployment script');
  
  // Check environment
  logger.success.core('Environment variables loaded');
  
  // Build step
  try {
    // Simulate build process
    logger.success.system('Build completed successfully');
  } catch (error) {
    logger.error.system('Build failed', error);
    process.exit(1);
  }
  
  // Deploy step
  try {
    // Simulate deployment
    logger.warn.performance('Deployment taking longer than expected');
    logger.success.release('Deployment completed successfully');
  } catch (error) {
    logger.error.system('Deployment failed', error);
    process.exit(1);
  }
  
  logger.success.perfection('All steps completed successfully');
}

/**
 * Example of using DanteLogger in a browser application
 */
export function exampleBrowserUsage() {
  const logger = setupBrowserLogger();
  
  // User interaction logging
  logger.success.ux('User logged in successfully');
  
  // API call logging
  try {
    // Simulate API call
    logger.success.core('API call successful');
  } catch (error) {
    logger.error.dataFlow('API call failed', error);
  }
  
  // Performance logging
  if (performance.now() > 1000) {
    logger.warn.performance('Page load taking longer than expected');
  } else {
    logger.success.performance('Page loaded quickly');
  }
}

/**
 * Example of using DanteLogger in a server application
 */
export function exampleServerUsage() {
  const logger = setupServerLogger();
  
  // Request logging
  logger.success.basic('Received request', { method: 'GET', path: '/api/users' });
  
  // Database operation logging
  try {
    // Simulate database query
    logger.success.core('Database query successful');
  } catch (error) {
    logger.error.storage('Database query failed', error);
  }
  
  // Authentication logging
  const isAuthenticated = true;
  if (isAuthenticated) {
    logger.success.security('User authenticated successfully');
  } else {
    logger.error.security('Authentication failed');
  }
  
  // Response logging
  logger.success.basic('Sent response', { statusCode: 200 });
}

/**
 * Example of using DanteLogger in a deployment pipeline
 */
export function exampleDeploymentUsage() {
  const logger = setupDeploymentLogger();
  
  // Build step
  logger.success.system('Build step started');
  logger.success.core('Dependencies installed');
  logger.success.system('Build completed');
  
  // Test step
  logger.success.system('Test step started');
  logger.success.core('Unit tests passed');
  logger.success.core('Integration tests passed');
  logger.success.system('Test step completed');
  
  // Deploy step
  logger.success.system('Deploy step started');
  logger.success.security('Security checks passed');
  logger.success.architecture('Infrastructure provisioned');
  logger.success.release('Application deployed');
  logger.success.system('Deploy step completed');
  
  // Final status
  logger.success.perfection('Deployment pipeline completed successfully');
}
