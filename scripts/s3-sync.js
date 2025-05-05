#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Dante Logger
const DanteLogger = {
  info: (message) => console.log(`👑🌊 [Dante:Purgatorio] ${message}`),
  success: (message) => console.log(`👑⭐ [Dante:Paradiso] ${message}`),
  error: (message) => console.error(`👑🔥 [Dante:Inferno:Error] ${message}`),
  warning: (message) => console.warn(`👑🔥 [Dante:Inferno:Warning] ${message}`)
};

// Check if AWS CLI is installed
function checkAwsCli() {
  try {
    execSync('aws --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Check if AWS credentials are configured
function checkAwsCredentials() {
  try {
    execSync('aws sts get-caller-identity', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Sync files with S3
async function syncWithS3() {
  DanteLogger.info('Starting S3 sync process...');

  // Check if AWS CLI is installed and configured
  if (!checkAwsCli()) {
    DanteLogger.warning('AWS CLI is not installed. Please install it first.');
    return false;
  }

  if (!checkAwsCredentials()) {
    DanteLogger.warning('AWS credentials are not configured. Please run "aws configure" first.');
    return false;
  }

  // Get bucket name from environment variable or use default
  const bucketName = process.env.S3_BUCKET_NAME || 'alexai-pdf-storage';
  
  try {
    // Sync PDF files
    DanteLogger.info(`Syncing PDF files with S3 bucket: ${bucketName}`);
    
    // Sync public directory
    execSync(`aws s3 sync ./public s3://${bucketName}/public --acl public-read`, { stdio: 'inherit' });
    
    // Sync source-pdfs directory
    execSync(`aws s3 sync ./source-pdfs s3://${bucketName}/source-pdfs --exclude "backups/*"`, { stdio: 'inherit' });
    
    DanteLogger.success('Files synced successfully with S3');
    return true;
  } catch (error) {
    DanteLogger.error(`Error syncing files with S3: ${error.message}`);
    return false;
  }
}

// Main function
async function main() {
  try {
    const success = await syncWithS3();
    if (success) {
      DanteLogger.success('S3 sync completed successfully');
      process.exit(0);
    } else {
      DanteLogger.warning('S3 sync completed with warnings or errors');
      process.exit(1);
    }
  } catch (error) {
    DanteLogger.error(`Unexpected error: ${error.message}`);
    process.exit(1);
  }
}

// Run the main function
main();
