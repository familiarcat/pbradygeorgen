#!/usr/bin/env node

/**
 * This script syncs environment variables between local development and AWS Amplify.
 * It can be used to:
 * 1. Pull environment variables from AWS Amplify to local .env.local
 * 2. Push environment variables from local .env.local to AWS Amplify
 * 
 * Usage:
 * - Pull: node scripts/sync-env-vars.js pull [environment]
 * - Push: node scripts/sync-env-vars.js push [environment]
 * 
 * Where [environment] is the Amplify environment (e.g., dev, prod, etc.)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const dotenv = require('dotenv');

// Configuration
const AWS_PROFILE = process.env.AWS_PROFILE || 'default';
const APP_ID = process.env.AMPLIFY_APP_ID; // You'll need to set this
const BRANCH = process.env.AMPLIFY_BRANCH || 'main';

// Parse command line arguments
const [,, action = 'help', environment = BRANCH] = process.argv;

// Validate inputs
if (!['pull', 'push', 'help'].includes(action)) {
  console.error('Invalid action. Use "pull", "push", or "help".');
  process.exit(1);
}

if (action !== 'help' && !APP_ID) {
  console.error('AMPLIFY_APP_ID is not set. Please set it in your environment or update this script.');
  process.exit(1);
}

// Show help
if (action === 'help') {
  console.log(`
Sync Environment Variables between local and AWS Amplify

Usage:
  node scripts/sync-env-vars.js pull [environment]  - Pull environment variables from Amplify to local
  node scripts/sync-env-vars.js push [environment]  - Push environment variables from local to Amplify

Before using:
  1. Install the AWS CLI and configure it with appropriate credentials
  2. Set the AMPLIFY_APP_ID environment variable or update this script
  3. Optionally set AMPLIFY_BRANCH (defaults to 'main')
  `);
  process.exit(0);
}

// Helper function to run AWS CLI commands
function runAwsCommand(command) {
  try {
    return execSync(command, { 
      encoding: 'utf8',
      env: { ...process.env, AWS_PROFILE }
    });
  } catch (error) {
    console.error('Error executing AWS command:', error.message);
    console.error('Command output:', error.stdout, error.stderr);
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

// Pull environment variables from Amplify
function pullEnvVars() {
  console.log(`Pulling environment variables from Amplify app ${APP_ID} branch ${environment}...`);
  
  // Get environment variables from Amplify
  const result = runAwsCommand(`aws amplify get-branch --app-id ${APP_ID} --branch-name ${environment}`);
  const branchData = JSON.parse(result);
  
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
  console.log(`Pushing environment variables to Amplify app ${APP_ID} branch ${environment}...`);
  
  // Read .env.local file
  const localEnvPath = path.join(process.cwd(), '.env.local');
  const localEnvVars = parseEnvFile(localEnvPath);
  
  if (Object.keys(localEnvVars).length === 0) {
    console.error('No environment variables found in .env.local');
    process.exit(1);
  }
  
  // Get current environment variables from Amplify
  const result = runAwsCommand(`aws amplify get-branch --app-id ${APP_ID} --branch-name ${environment}`);
  const branchData = JSON.parse(result);
  
  // Merge environment variables, prioritizing local values
  const amplifyEnvVars = branchData.branch?.environmentVariables || {};
  const mergedEnvVars = { ...amplifyEnvVars, ...localEnvVars };
  
  // Update environment variables in Amplify
  const envVarsJson = JSON.stringify(mergedEnvVars);
  runAwsCommand(`aws amplify update-branch --app-id ${APP_ID} --branch-name ${environment} --environment-variables '${envVarsJson}'`);
  
  console.log('Environment variables pushed successfully!');
}

// Execute the requested action
if (action === 'pull') {
  pullEnvVars();
} else if (action === 'push') {
  pushEnvVars();
}
