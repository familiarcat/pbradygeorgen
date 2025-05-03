/**
 * Amplify Configuration Utility
 * 
 * This utility configures AWS Amplify for the application, ensuring consistent
 * storage configuration across environments.
 * 
 * Philosophical Framework:
 * - Hesse: Balancing structure (configuration) with flexibility (environment-specific settings)
 * - Salinger: Ensuring authentic representation through consistent storage
 * - Derrida: Deconstructing configuration into environment-specific settings
 * - Dante: Guiding the configuration through different environments
 */

import { DanteLogger } from './DanteLogger';
import { HesseLogger } from './HesseLogger';

// Import Amplify
let Amplify: any;
let Storage: any;
try {
  // Dynamic import to avoid issues during build time
  const AmplifyModule = require('aws-amplify');
  Amplify = AmplifyModule.Amplify;
  Storage = AmplifyModule.Storage;
} catch (error) {
  console.error('Failed to import Amplify:', error);
}

// Import configuration
import config from '../amplifyconfiguration.json';

/**
 * Configure Amplify for the application
 */
export function configureAmplify() {
  try {
    if (!Amplify) {
      console.warn('Amplify not available, skipping configuration');
      DanteLogger.warn.deprecated('Amplify not available, skipping configuration');
      return false;
    }

    // Determine the environment
    const environment = process.env.NODE_ENV || 'development';
    const isProduction = environment === 'production';
    const isAmplify = !!process.env.AWS_EXECUTION_ENV;
    
    console.log(`Configuring Amplify for ${environment} environment (isAmplify: ${isAmplify})`);
    DanteLogger.success.basic(`Configuring Amplify for ${environment} environment`);

    // Create a copy of the configuration
    const envConfig = JSON.parse(JSON.stringify(config));

    // Replace ${env} placeholders with the actual environment
    const envSuffix = isProduction ? 'prod' : 'dev';
    
    // Update the S3 bucket name
    if (envConfig.aws_user_files_s3_bucket) {
      envConfig.aws_user_files_s3_bucket = envConfig.aws_user_files_s3_bucket.replace('${env}', envSuffix);
    }
    
    if (envConfig.Storage?.AWSS3?.bucket) {
      envConfig.Storage.AWSS3.bucket = envConfig.Storage.AWSS3.bucket.replace('${env}', envSuffix);
    }

    // Override with environment variables if available
    if (process.env.S3_BUCKET_NAME) {
      envConfig.aws_user_files_s3_bucket = process.env.S3_BUCKET_NAME;
      if (envConfig.Storage?.AWSS3) {
        envConfig.Storage.AWSS3.bucket = process.env.S3_BUCKET_NAME;
      }
    }
    
    if (process.env.S3_REGION) {
      envConfig.aws_user_files_s3_bucket_region = process.env.S3_REGION;
      if (envConfig.Storage?.AWSS3) {
        envConfig.Storage.AWSS3.region = process.env.S3_REGION;
      }
    }

    // Log the configuration
    console.log('Amplify configuration:', {
      region: envConfig.aws_project_region,
      bucket: envConfig.aws_user_files_s3_bucket,
      bucketRegion: envConfig.aws_user_files_s3_bucket_region
    });

    // Configure Amplify
    Amplify.configure(envConfig);
    
    console.log('Amplify configured successfully');
    DanteLogger.success.core('Amplify configured successfully');
    
    return true;
  } catch (error) {
    console.error('Error configuring Amplify:', error);
    DanteLogger.error.system('Error configuring Amplify', error);
    return false;
  }
}

/**
 * Get the S3 bucket name from the configuration
 */
export function getS3BucketName(): string {
  // Get from environment variable first
  if (process.env.S3_BUCKET_NAME) {
    return process.env.S3_BUCKET_NAME;
  }
  
  // Determine the environment
  const environment = process.env.NODE_ENV || 'development';
  const isProduction = environment === 'production';
  
  // Get from configuration
  const envSuffix = isProduction ? 'prod' : 'dev';
  const bucketName = config.aws_user_files_s3_bucket.replace('${env}', envSuffix);
  
  return bucketName;
}

/**
 * Get the S3 region from the configuration
 */
export function getS3Region(): string {
  // Get from environment variable first
  if (process.env.S3_REGION) {
    return process.env.S3_REGION;
  }
  
  // Get from configuration
  return config.aws_user_files_s3_bucket_region;
}

export default {
  configureAmplify,
  getS3BucketName,
  getS3Region
};
