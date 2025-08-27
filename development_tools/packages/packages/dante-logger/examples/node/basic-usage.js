/**
 * Basic Usage Example for Dante Logger
 * 
 * This example demonstrates the basic usage of Dante Logger in a Node.js environment.
 */

// In a real project, you would import from the package
// const { DanteLogger } = require('dante-logger');

// For this example, we'll use a relative import
const { DanteLogger } = require('../../dist');

// Configure for Node.js environment
DanteLogger.config.forPlatform('node');

console.log('Dante Logger Basic Usage Example\n');

// Inferno (Errors) examples
console.log('=== Inferno (Errors) ===');

DanteLogger.error.validation('Invalid input format');
DanteLogger.error.dataFlow('Failed to fetch data from API');
DanteLogger.error.resources('Memory limit exceeded');
DanteLogger.error.storage('Failed to write to database');
DanteLogger.error.runtime('Unexpected exception occurred');
DanteLogger.error.config('Invalid configuration');
DanteLogger.error.corruption('Data corruption detected');
DanteLogger.error.security('Unauthorized access attempt');
DanteLogger.error.system('Critical system failure');

// With additional data
DanteLogger.error.validation('Invalid email format', { 
  email: 'invalid-email',
  validationRules: ['must contain @', 'must have domain']
});

// Direct circle access
DanteLogger.error.circle(9, 'The most severe error possible');

console.log('\n=== Purgatorio (Warnings) ===');

// Purgatorio (Warnings) examples
DanteLogger.warn.deprecated('This method will be removed in v3.0');
DanteLogger.warn.performance('Operation taking longer than expected');
DanteLogger.warn.resources('High CPU usage detected');
DanteLogger.warn.slow('Database query is slow');
DanteLogger.warn.allocation('Large memory allocation');
DanteLogger.warn.memory('Potential memory leak detected');
DanteLogger.warn.security('Weak password used');

// With additional data
DanteLogger.warn.performance('Slow API response', {
  endpoint: '/api/users',
  responseTime: '2500ms',
  threshold: '1000ms'
});

// Direct terrace access
DanteLogger.warn.terrace(7, 'The most severe warning possible');

console.log('\n=== Paradiso (Success) ===');

// Paradiso (Success) examples
DanteLogger.success.basic('Operation completed successfully');
DanteLogger.success.performance('Operation completed quickly');
DanteLogger.success.ux('User interface updated');
DanteLogger.success.core('Core functionality working correctly');
DanteLogger.success.security('Security check passed');
DanteLogger.success.system('System update applied');
DanteLogger.success.architecture('Architecture optimization complete');
DanteLogger.success.release('Version 2.0 released');
DanteLogger.success.innovation('New feature implemented');
DanteLogger.success.perfection('All systems functioning optimally');

// With additional data
DanteLogger.success.performance('Query executed efficiently', {
  query: 'SELECT * FROM users',
  rows: 1000,
  duration: '50ms'
});

// Direct sphere access
DanteLogger.success.sphere(10, 'The most perfect success possible');

console.log('\n=== Configuration Examples ===');

// Configuration examples
console.log('\nChanging minimum levels:');
DanteLogger.config.setMinLevel('inferno', 5);
DanteLogger.error.dataFlow('This error should not be shown (level 2 < min level 5)');
DanteLogger.error.runtime('This error should be shown (level 5 >= min level 5)');

console.log('\nDisabling a realm:');
DanteLogger.config.enableRealm('purgatorio', false);
DanteLogger.warn.performance('This warning should not be shown (purgatorio disabled)');

console.log('\nResetting configuration:');
DanteLogger.config.reset();
DanteLogger.error.dataFlow('This error should now be shown again');
DanteLogger.warn.performance('This warning should now be shown again');

console.log('\nCustom formatting:');
DanteLogger.config.set({
  formatting: {
    includeEmoji: true,
    includeTimestamp: false,
    includeRealmName: true,
    includeLevelNumber: false,
    includeCategoryName: true
  }
});
DanteLogger.success.core('Custom formatted success message');

console.log('\n=== Creating a Custom Logger ===');

// Creating a custom logger
const productionLogger = DanteLogger.createLogger({
  environments: {
    development: { enabled: false },
    production: { enabled: true },
    test: { enabled: false }
  },
  minimumLevels: {
    inferno: 1,   // All errors
    purgatorio: 5, // Only severe warnings
    paradiso: 8    // Only significant successes
  },
  formatting: {
    includeTimestamp: true,
    includeEmoji: false,
    colorize: false
  }
});

productionLogger.error.system('Critical production error');
productionLogger.warn.allocation('This warning should not be shown (level 5 >= min level 5)');
productionLogger.warn.security('This warning should be shown (level 7 >= min level 5)');
productionLogger.success.basic('This success should not be shown (level 1 < min level 8)');
productionLogger.success.release('This success should be shown (level 8 >= min level 8)');
