import { DanteLogger } from './DanteLogger';

/**
 * This file demonstrates how to use the DanteLogger in various scenarios
 * throughout your application.
 */

// Example function that uses DanteLogger for validation errors
export function validateUserInput(input: any): boolean {
  if (!input) {
    DanteLogger.error.validation('Input is required');
    return false;
  }
  
  if (!input.email) {
    DanteLogger.error.validation('Email is required', { input });
    return false;
  }
  
  if (!input.email.includes('@')) {
    DanteLogger.error.validation('Invalid email format', { email: input.email });
    return false;
  }
  
  DanteLogger.success.basic('Input validation successful');
  return true;
}

// Example function that uses DanteLogger for performance warnings
export function processLargeDataset(data: any[]): any[] {
  if (data.length > 10000) {
    DanteLogger.warn.performance('Processing large dataset may impact performance', { 
      size: data.length 
    });
  }
  
  // Simulate processing
  const result = data.map(item => ({ ...item, processed: true }));
  
  if (result.length === data.length) {
    DanteLogger.success.performance('Dataset processed efficiently', { 
      itemsProcessed: result.length,
      timePerItem: '0.5ms'
    });
  }
  
  return result;
}

// Example function that uses DanteLogger for system improvements
export function upgradeSystem(version: string): boolean {
  DanteLogger.success.system(`System upgrade to version ${version} initiated`);
  
  // Simulate upgrade steps
  try {
    // Database migration
    DanteLogger.success.core('Database migration completed');
    
    // API updates
    DanteLogger.success.architecture('API structure optimized');
    
    // Security patches
    DanteLogger.success.security('Security vulnerabilities patched');
    
    // Final verification
    DanteLogger.success.perfection('System upgrade completed successfully');
    
    return true;
  } catch (error) {
    DanteLogger.error.system('Critical failure during system upgrade', error);
    return false;
  }
}

// Example of handling deprecated features
export function legacyFunction(): void {
  DanteLogger.warn.deprecated(
    'legacyFunction() is deprecated and will be removed in v3.0. Use newFunction() instead.'
  );
  
  // Function implementation...
}

// Example of logging security concerns
export function authenticateUser(credentials: any): boolean {
  if (credentials.password === 'password123') {
    DanteLogger.warn.security('User using weak password', { 
      userId: credentials.userId,
      passwordStrength: 'very weak'
    });
  }
  
  // Authentication logic...
  const authenticated = true;
  
  if (authenticated) {
    DanteLogger.success.security('User authenticated successfully');
  }
  
  return authenticated;
}

// Example of direct circle/terrace/sphere access
export function demonstrateDanteLogger(): void {
  // Direct access to specific circles of Inferno
  DanteLogger.error.circle(9, 'Critical system failure detected');
  
  // Direct access to specific terraces of Purgatorio
  DanteLogger.warn.terrace(4, 'Operation taking longer than expected');
  
  // Direct access to specific spheres of Paradiso
  DanteLogger.success.sphere(8, 'Version 2.0 released successfully');
}

// Example of using the logger with Zod validation
export function zodValidationExample(error: any): void {
  if (error.name === 'ZodError') {
    DanteLogger.error.validation('Data validation failed', error.errors);
  }
}
