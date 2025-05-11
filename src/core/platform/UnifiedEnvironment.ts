'use client';

import { DanteLogger } from './DanteLogger';

/**
 * UnifiedEnvironment.ts
 * 
 * A unified approach to environment detection and configuration
 * following the philosophical frameworks of Hesse, Salinger, Derrida, and Dante.
 * 
 * This utility ensures consistent behavior across local development and AWS Amplify deployment.
 */

// Environment types
export type Environment = 'development' | 'production' | 'test';
export type Platform = 'local' | 'amplify';
export type StorageType = 'local' | 's3';

// Environment interface
export interface EnvironmentConfig {
  environment: Environment;
  platform: Platform;
  storageType: StorageType;
  isAmplify: boolean;
  isLocal: boolean;
  useOpenAI: boolean;
  useS3: boolean;
  s3BucketName: string;
  s3Region: string;
  debugLogging: boolean;
}

/**
 * Detect the current environment
 * 
 * This function uses a Hesse-inspired mathematical approach to determine
 * the current environment based on multiple factors.
 */
export function detectEnvironment(): Environment {
  // Check if we're in a browser
  if (typeof window !== 'undefined') {
    // In the browser, we use the NEXT_PUBLIC environment variables
    if (process.env.NEXT_PUBLIC_DEPLOYMENT_ENV === 'production') {
      return 'production';
    }
    
    // Check for development mode in React
    if (
      process.env.NODE_ENV === 'development' ||
      (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__
    ) {
      return 'development';
    }
    
    // Default to production for browsers
    return 'production';
  }
  
  // Server-side environment detection
  if (typeof process !== 'undefined' && process.env) {
    // Check NODE_ENV
    const nodeEnv = process.env.NODE_ENV;
    
    if (nodeEnv === 'development') {
      return 'development';
    }
    
    if (nodeEnv === 'test') {
      return 'test';
    }
    
    if (nodeEnv === 'production') {
      return 'production';
    }
  }
  
  // Default to development if we can't determine
  return 'development';
}

/**
 * Detect the current platform
 * 
 * This function uses Derrida's approach to deconstruct the environment
 * and determine if we're running locally or in AWS Amplify.
 */
export function detectPlatform(): Platform {
  // Check if we're running in AWS Amplify
  if (typeof process !== 'undefined' && process.env) {
    if (
      process.env.AWS_EXECUTION_ENV ||
      process.env.NEXT_PUBLIC_AMPLIFY_DEPLOYED === 'true'
    ) {
      return 'amplify';
    }
  }
  
  // Default to local
  return 'local';
}

/**
 * Determine the storage type to use
 * 
 * This function follows Salinger's philosophy of authentic design
 * by ensuring consistent storage behavior across environments.
 */
export function determineStorageType(): StorageType {
  // Check environment variables
  if (typeof process !== 'undefined' && process.env) {
    // Explicit configuration takes precedence
    if (process.env.AMPLIFY_USE_STORAGE === 'true') {
      return 's3';
    }
    
    if (process.env.AMPLIFY_USE_LOCAL === 'true') {
      return 'local';
    }
    
    // In AWS Amplify, use S3 by default
    if (process.env.AWS_EXECUTION_ENV) {
      return 's3';
    }
  }
  
  // Default to local storage for local development
  return 'local';
}

/**
 * Get the unified environment configuration
 * 
 * This function combines all the environment detection methods
 * to create a unified configuration that can be used consistently
 * across the application.
 */
export function getUnifiedEnvironment(): EnvironmentConfig {
  const environment = detectEnvironment();
  const platform = detectPlatform();
  const storageType = determineStorageType();
  
  const isAmplify = platform === 'amplify';
  const isLocal = platform === 'local';
  
  // Determine if we should use OpenAI
  const useOpenAI = typeof process !== 'undefined' && process.env
    ? process.env.USE_OPENAI === 'true'
    : false;
  
  // Determine if we should use S3
  const useS3 = storageType === 's3';
  
  // Get S3 bucket name and region
  const s3BucketName = typeof process !== 'undefined' && process.env
    ? process.env.S3_BUCKET_NAME || 'alexai-pdf-storage'
    : 'alexai-pdf-storage';
  
  const s3Region = typeof process !== 'undefined' && process.env
    ? process.env.S3_REGION || 'us-east-1'
    : 'us-east-1';
  
  // Determine if debug logging is enabled
  const debugLogging = typeof process !== 'undefined' && process.env
    ? process.env.DEBUG_LOGGING === 'true'
    : false;
  
  // Log the environment configuration using Dante's methodical approach
  if (typeof process !== 'undefined' && !process.env.NEXT_PUBLIC_SUPPRESS_ENV_LOGS) {
    console.log('🌍 Unified Environment Configuration:');
    console.log(`   - Environment: ${environment}`);
    console.log(`   - Platform: ${platform}`);
    console.log(`   - Storage Type: ${storageType}`);
    console.log(`   - Use OpenAI: ${useOpenAI}`);
    console.log(`   - Use S3: ${useS3}`);
    console.log(`   - S3 Bucket: ${s3BucketName}`);
    console.log(`   - Debug Logging: ${debugLogging}`);
  }
  
  return {
    environment,
    platform,
    storageType,
    isAmplify,
    isLocal,
    useOpenAI,
    useS3,
    s3BucketName,
    s3Region,
    debugLogging
  };
}

// Export a singleton instance of the environment configuration
export const unifiedEnvironment = getUnifiedEnvironment();
