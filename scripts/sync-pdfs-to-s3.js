/**
 * PDF S3 Sync Manager
 *
 * This script syncs PDF files with AWS S3 storage.
 * It ensures that the PDF files are properly stored in S3 for the Amplify deployment.
 *
 * Following Derrida's philosophy of deconstruction, this script breaks down the S3 sync
 * process into discrete, analyzable components.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Dante-inspired logging
const log = {
  info: (message) => console.log(`👑🌊 [Dante:Purgatorio] ${message}`),
  success: (message) => console.log(`👑⭐ [Dante:Paradiso] ${message}`),
  warning: (message) => console.log(`👑🔥 [Dante:Inferno:Warning] ${message}`),
  error: (message) => console.log(`👑🔥 [Dante:Inferno:Error] ${message}`)
};

// Configuration
const PDF_NAMES = {
  PRIMARY: 'default_resume.pdf',
  LEGACY: 'pbradygeorgen_resume.pdf'
};

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const PRIMARY_PDF_PATH = path.join(PUBLIC_DIR, PDF_NAMES.PRIMARY);
const LEGACY_PDF_PATH = path.join(PUBLIC_DIR, PDF_NAMES.LEGACY);

// S3 bucket name - this will be overridden by environment variable if available
let S3_BUCKET = process.env.NEXT_PUBLIC_STORAGE_BUCKET || 'alexai-pdf-storage';

/**
 * Checks if AWS CLI is installed and configured
 */
function checkAwsCliConfig() {
  log.info('Checking AWS CLI configuration...');
  
  try {
    // Check if AWS CLI is installed
    execSync('aws --version', { stdio: 'pipe' });
    
    // Check if AWS credentials are configured
    execSync('aws sts get-caller-identity', { stdio: 'pipe' });
    
    log.success('AWS CLI is properly configured.');
    return true;
  } catch (error) {
    log.warning('AWS CLI is not installed or not properly configured.');
    log.info('You can still proceed with local development, but S3 sync will not work.');
    return false;
  }
}

/**
 * Gets the S3 bucket name from Amplify configuration
 */
function getS3BucketName() {
  log.info('Getting S3 bucket name from Amplify configuration...');
  
  try {
    // Check if we have an environment variable for the S3 bucket
    if (process.env.NEXT_PUBLIC_STORAGE_BUCKET) {
      S3_BUCKET = process.env.NEXT_PUBLIC_STORAGE_BUCKET;
      log.success(`Using S3 bucket from environment variable: ${S3_BUCKET}`);
      return S3_BUCKET;
    }
    
    // Try to get the S3 bucket name from Amplify outputs
    const amplifyOutputsPath = path.join(process.cwd(), 'amplify_outputs.json');
    
    if (fs.existsSync(amplifyOutputsPath)) {
      const amplifyOutputs = JSON.parse(fs.readFileSync(amplifyOutputsPath, 'utf8'));
      
      if (amplifyOutputs.storage && amplifyOutputs.storage.bucket) {
        S3_BUCKET = amplifyOutputs.storage.bucket;
        log.success(`Using S3 bucket from Amplify outputs: ${S3_BUCKET}`);
        return S3_BUCKET;
      }
    }
    
    // Try to get the S3 bucket name from AWS CLI
    const result = execSync('aws s3api list-buckets --query "Buckets[?starts_with(Name, \'alexai-\')].Name" --output text', { stdio: 'pipe' }).toString().trim();
    
    if (result) {
      // Get the first bucket that starts with 'alexai-'
      S3_BUCKET = result.split('\t')[0];
      log.success(`Using S3 bucket from AWS CLI: ${S3_BUCKET}`);
      return S3_BUCKET;
    }
    
    // Use the default bucket name
    log.warning(`Could not determine S3 bucket name, using default: ${S3_BUCKET}`);
    return S3_BUCKET;
  } catch (error) {
    log.warning(`Error getting S3 bucket name: ${error.message}`);
    log.info(`Using default S3 bucket name: ${S3_BUCKET}`);
    return S3_BUCKET;
  }
}

/**
 * Syncs PDF files with S3
 */
function syncPdfsToS3() {
  log.info('Syncing PDF files with S3...');
  
  // Check if AWS CLI is installed and configured
  if (!checkAwsCliConfig()) {
    return false;
  }
  
  // Get the S3 bucket name
  const bucketName = getS3BucketName();
  
  try {
    // Check if the PDFs exist
    if (!fs.existsSync(PRIMARY_PDF_PATH)) {
      log.error(`Primary PDF not found: ${PRIMARY_PDF_PATH}`);
      return false;
    }
    
    if (!fs.existsSync(LEGACY_PDF_PATH)) {
      log.error(`Legacy PDF not found: ${LEGACY_PDF_PATH}`);
      return false;
    }
    
    // Sync the primary PDF to S3
    log.info(`Syncing primary PDF to S3: s3://${bucketName}/public/${PDF_NAMES.PRIMARY}`);
    execSync(`aws s3 cp "${PRIMARY_PDF_PATH}" "s3://${bucketName}/public/${PDF_NAMES.PRIMARY}" --acl public-read`, { stdio: 'inherit' });
    
    // Sync the legacy PDF to S3
    log.info(`Syncing legacy PDF to S3: s3://${bucketName}/public/${PDF_NAMES.LEGACY}`);
    execSync(`aws s3 cp "${LEGACY_PDF_PATH}" "s3://${bucketName}/public/${PDF_NAMES.LEGACY}" --acl public-read`, { stdio: 'inherit' });
    
    // Sync the extracted directory to S3
    const extractedDir = path.join(PUBLIC_DIR, 'extracted');
    
    if (fs.existsSync(extractedDir)) {
      log.info(`Syncing extracted directory to S3: s3://${bucketName}/public/extracted/`);
      execSync(`aws s3 sync "${extractedDir}" "s3://${bucketName}/public/extracted/" --acl public-read`, { stdio: 'inherit' });
    }
    
    // Sync the download test report to S3
    const downloadTestReportPath = path.join(PUBLIC_DIR, 'download_test_report.json');
    
    if (fs.existsSync(downloadTestReportPath)) {
      log.info(`Syncing download test report to S3: s3://${bucketName}/public/download_test_report.json`);
      execSync(`aws s3 cp "${downloadTestReportPath}" "s3://${bucketName}/public/download_test_report.json" --acl public-read`, { stdio: 'inherit' });
    }
    
    log.success('PDF files synced with S3 successfully.');
    return true;
  } catch (error) {
    log.error(`Error syncing PDF files with S3: ${error.message}`);
    return false;
  }
}

/**
 * Main function
 */
function main() {
  log.info('Starting PDF S3 sync process...');
  
  // Sync PDFs to S3
  const success = syncPdfsToS3();
  
  if (success) {
    log.success('PDF S3 sync process completed successfully.');
  } else {
    log.warning('PDF S3 sync process completed with warnings or errors.');
  }
}

// Execute main function
main();
