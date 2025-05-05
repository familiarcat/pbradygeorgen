#!/usr/bin/env node

/**
 * Amplify Environment Manager
 * 
 * This script manages environment variables between local development and AWS Amplify.
 * It uses the configuration in amplify-env-config.json to determine app ID, branch, etc.
 * 
 * Features:
 * - Pull environment variables from AWS Amplify to local .env.local
 * - Push environment variables from local .env.local to AWS Amplify
 * - List environment variables in AWS Amplify
 * - Support for multiple environments (dev, staging, prod)
 * 
 * Usage:
 * - Pull: node scripts/amplify-env-manager.js pull [environment]
 * - Push: node scripts/amplify-env-manager.js push [environment]
 * - List: node scripts/amplify-env-manager.js list [environment]
 * 
 * Where [environment] is the environment name from amplify-env-config.json (e.g., dev, staging, prod)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const dotenv = require('dotenv');

// Load configuration
const configPath = path.join(process.cwd(), 'amplify-env-config.json');
let config;

try {
  if (fs.existsSync(configPath)) {
    config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } else {
    console.error('Configuration file not found: amplify-env-config.json');
    console.error('Please create this file with your Amplify app configuration.');
    process.exit(1);
  }
} catch (error) {
  console.error('Error loading configuration:', error.message);
  process.exit(1);
}

// Parse command line arguments
const [, , action = 'help', envName = 'dev'] = process.argv;

// Validate inputs
if (!['pull', 'push', 'list', 'help'].includes(action)) {
  console.error('Invalid action. Use "pull", "push", "list", or "help".');
  process.exit(1);
}

// Show help
if (action === 'help') {
  console.log(`
Amplify Environment Manager

Usage:
  node scripts/amplify-env-manager.js pull [environment]  - Pull environment variables from Amplify to local
  node scripts/amplify-env-manager.js push [environment]  - Push environment variables from local to Amplify
  node scripts/amplify-env-manager.js list [environment]  - List environment variables in Amplify

Available environments: ${Object.keys(config.environments).join(', ')}

Before using:
  1. Install the AWS CLI and configure it with appropriate credentials
  2. Update amplify-env-config.json with your Amplify app ID and branch information
  `);
  process.exit(0);
}

// Get environment configuration
const environment = config.environments[envName];
if (!environment) {
  console.error(`Environment "${envName}" not found in configuration.`);
  console.error(`Available environments: ${Object.keys(config.environments).join(', ')}`);
  process.exit(1);
}

const APP_ID = config.appId;
const BRANCH = environment.branch || config.branch;
const AWS_PROFILE = environment.profile || config.profile || 'default';
const AWS_REGION = environment.region || config.region || 'us-east-1';

// Validate configuration
if (!APP_ID) {
  console.error('Amplify App ID is not set in configuration.');
  process.exit(1);
}

// Helper function to run AWS CLI commands
function runAwsCommand(command) {
  try {
    return execSync(command, {
      encoding: 'utf8',
      env: {
        ...process.env,
        AWS_PROFILE,
        AWS_REGION
      }
    });
  } catch (error) {
    console.error('Error executing AWS command:', error.message);
    if (error.stdout) console.error('Command output:', error.stdout);
    if (error.stderr) console.error('Command error:', error.stderr);
    process.exit(1);
  }
}

// Helper function to parse .env file
function parseEnvFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      return dotenv.parse(fs.readFileSync(filePath));
    }
    return {};
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error.message);
    return {};
  }
}

// Helper function to write .env file
function writeEnvFile(filePath, envVars) {
  const content = Object.entries(envVars)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  fs.writeFileSync(filePath, content);
  console.log(`Updated ${filePath}`);
}

// Get branch information from Amplify
function getBranchInfo() {
  console.log(`Getting branch information for app ${APP_ID} branch ${BRANCH}...`);
  const result = runAwsCommand(`aws amplify get-branch --app-id ${APP_ID} --branch-name ${BRANCH}`);
  return JSON.parse(result);
}

// List environment variables in Amplify
function listEnvVars() {
  console.log(`Listing environment variables for app ${APP_ID} branch ${BRANCH}...`);

  const branchData = getBranchInfo();

  if (!branchData.branch || !branchData.branch.environmentVariables) {
    console.log('No environment variables found for this branch.');
    return;
  }

  const envVars = branchData.branch.environmentVariables;
  console.log('\nEnvironment Variables:');
  console.log('=====================');

  Object.entries(envVars).forEach(([key, value]) => {
    // Mask sensitive values
    const maskedValue = key.includes('KEY') || key.includes('SECRET') || key.includes('PASSWORD')
      ? '********'
      : value;
    console.log(`${key}=${maskedValue}`);
  });
}

// Pull environment variables from Amplify
function pullEnvVars() {
  console.log(`Pulling environment variables from app ${APP_ID} branch ${BRANCH}...`);

  const branchData = getBranchInfo();

  if (!branchData.branch || !branchData.branch.environmentVariables) {
    console.error('No environment variables found for this branch.');
    process.exit(1);
  }

  const amplifyEnvVars = branchData.branch.environmentVariables;

  // Read existing .env.local file
  const localEnvPath = path.join(process.cwd(), '.env.local');
  const localEnvVars = parseEnvFile(localEnvPath);

  // Merge environment variables, prioritizing Amplify values
  const mergedEnvVars = { ...localEnvVars, ...amplifyEnvVars };

  // Write updated .env.local file
  writeEnvFile(localEnvPath, mergedEnvVars);

  console.log('Environment variables pulled successfully!');
}

// Push environment variables to Amplify
function pushEnvVars() {
  console.log(`Pushing environment variables to app ${APP_ID} branch ${BRANCH}...`);

  // Read .env.local file
  const localEnvPath = path.join(process.cwd(), '.env.local');
  const localEnvVars = parseEnvFile(localEnvPath);

  if (Object.keys(localEnvVars).length === 0) {
    console.error('No environment variables found in .env.local');
    process.exit(1);
  }

  // Get current environment variables from Amplify
  const branchData = getBranchInfo();

  // Merge environment variables, prioritizing local values
  const amplifyEnvVars = branchData.branch?.environmentVariables || {};
  const mergedEnvVars = { ...amplifyEnvVars, ...localEnvVars };

  // Update environment variables in Amplify
  const envVarsJson = JSON.stringify(mergedEnvVars);
  runAwsCommand(`aws amplify update-branch --app-id ${APP_ID} --branch-name ${BRANCH} --environment-variables '${envVarsJson}'`);

  console.log('Environment variables pushed successfully!');
}

// Execute the requested action
if (action === 'pull') {
  pullEnvVars();
} else if (action === 'push') {
  pushEnvVars();
} else if (action === 'list') {
  listEnvVars();
}
