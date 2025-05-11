#!/usr/bin/env node

/**
 * Unified Environment Setup
 * 
 * This script sets up the environment consistently for both local development and AWS Amplify deployment.
 * It follows the philosophical frameworks of Hesse, Salinger, Derrida, and Dante.
 * 
 * Usage:
 * node scripts/unified-environment-setup.js [local|amplify]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const dotenv = require('dotenv');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m'
};

// Dante-inspired logging
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  let prefix = '';
  
  switch (type) {
    case 'success':
      prefix = `${colors.green}✅ [Dante:Success]${colors.reset}`;
      break;
    case 'error':
      prefix = `${colors.red}❌ [Dante:Error]${colors.reset}`;
      break;
    case 'warning':
      prefix = `${colors.yellow}⚠️ [Dante:Warning]${colors.reset}`;
      break;
    case 'info':
    default:
      prefix = `${colors.blue}ℹ️ [Dante:Info]${colors.reset}`;
      break;
  }
  
  console.log(`${prefix} ${message}`);
}

// Get the target environment from command line arguments
const targetEnv = process.argv[2] || 'local';

if (!['local', 'amplify'].includes(targetEnv)) {
  log(`Invalid target environment: ${targetEnv}. Must be 'local' or 'amplify'.`, 'error');
  process.exit(1);
}

log(`Setting up environment for ${targetEnv}...`);

// Load environment variables from .env.local if it exists
const envLocalPath = path.join(process.cwd(), '.env.local');
let envVars = {};

if (fs.existsSync(envLocalPath)) {
  log('Loading environment variables from .env.local...');
  envVars = dotenv.parse(fs.readFileSync(envLocalPath));
} else {
  log('.env.local not found. Creating from .env.example...', 'warning');
  
  // Copy .env.example to .env.local
  const envExamplePath = path.join(process.cwd(), '.env.example');
  
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envLocalPath);
    envVars = dotenv.parse(fs.readFileSync(envLocalPath));
    log('.env.local created from .env.example.');
  } else {
    log('.env.example not found. Creating empty .env.local...', 'warning');
    fs.writeFileSync(envLocalPath, '# Environment variables\n');
  }
}

// Set environment-specific variables
if (targetEnv === 'local') {
  // Local development environment
  envVars.AMPLIFY_USE_LOCAL = 'true';
  envVars.AMPLIFY_USE_STORAGE = 'false';
  envVars.NODE_ENV = 'development';
  envVars.DEBUG_LOGGING = 'true';
  
  // Check if OpenAI API key is set
  if (!envVars.OPENAI_API_KEY || envVars.OPENAI_API_KEY === 'your_openai_api_key_here') {
    log('OpenAI API key not set in .env.local.', 'warning');
    log('You can set it by running: npm run env:openai');
    
    // Default to not using OpenAI if key is not set
    envVars.USE_OPENAI = 'false';
  }
} else {
  // AWS Amplify environment
  envVars.AMPLIFY_USE_LOCAL = 'false';
  envVars.AMPLIFY_USE_STORAGE = 'true';
  envVars.NODE_ENV = 'production';
  envVars.NEXT_PUBLIC_AMPLIFY_DEPLOYED = 'true';
  envVars.S3_BUCKET_NAME = envVars.S3_BUCKET_NAME || 'alexai-pdf-storage-prod';
  envVars.DEBUG_LOGGING = 'true';
  
  // Always use OpenAI in Amplify environment
  envVars.USE_OPENAI = 'true';
  
  // Check if we need to set up S3 bucket
  if (!envVars.S3_BUCKET_NAME) {
    log('S3 bucket name not set. Using default: alexai-pdf-storage-prod', 'warning');
    envVars.S3_BUCKET_NAME = 'alexai-pdf-storage-prod';
  }
}

// Write updated environment variables to .env.local
let envFileContent = '# Environment variables\n';
for (const [key, value] of Object.entries(envVars)) {
  envFileContent += `${key}=${value}\n`;
}

fs.writeFileSync(envLocalPath, envFileContent);
log('Updated .env.local with environment-specific variables.', 'success');

// Create necessary directories
const directories = [
  path.join(process.cwd(), 'public/extracted'),
  path.join(process.cwd(), 'public/analyzed'),
  path.join(process.cwd(), 'public/cover-letters'),
  path.join(process.cwd(), 'public/downloads')
];

for (const dir of directories) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    log(`Created directory: ${dir}`, 'success');
  }
}

// Check if default PDF exists
const defaultPdfPath = path.join(process.cwd(), 'public/default_resume.pdf');
if (!fs.existsSync(defaultPdfPath)) {
  log('Default PDF not found at public/default_resume.pdf', 'warning');
  log('Please add a default PDF to ensure the application works correctly.');
}

// Set up S3 bucket if needed
if (targetEnv === 'amplify' && envVars.AMPLIFY_USE_STORAGE === 'true') {
  try {
    log('Setting up S3 bucket...');
    execSync(`node scripts/setup-s3-bucket.js ${envVars.S3_BUCKET_NAME}`, { stdio: 'inherit' });
    log('S3 bucket setup complete.', 'success');
  } catch (error) {
    log(`Failed to set up S3 bucket: ${error.message}`, 'error');
    log('You can set it up manually by running: npm run env:s3');
  }
}

// Final success message
log(`Environment setup complete for ${targetEnv}.`, 'success');
log('You can now run the application with:');

if (targetEnv === 'local') {
  log('  npm run dev         # For development with hot reloading');
  log('  npm run dev:smart   # For development with build step');
} else {
  log('  npm run build       # Build the application');
  log('  npm run start       # Start the application');
}

// Philosophical quote based on the environment
if (targetEnv === 'local') {
  log('\n"In the realm of development, we find the freedom to experiment." - Hesse', 'info');
} else {
  log('\n"In deployment, we find the truth of our creation." - Dante', 'info');
}
