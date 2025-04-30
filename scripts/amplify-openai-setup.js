#!/usr/bin/env node

/**
 * Amplify OpenAI Setup Script
 * 
 * This script ensures the OpenAI API key is properly configured for AWS Amplify deployments.
 * It checks if the key exists in the local environment and in Amplify, and provides guidance
 * on how to set it up if it's missing.
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
    process.exit(1);
  }
} catch (error) {
  console.error('Error loading configuration:', error.message);
  process.exit(1);
}

// Parse command line arguments
const [,, envName = 'dev'] = process.argv;

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
    return null;
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

// Get branch information from Amplify
function getBranchInfo() {
  console.log(`Getting branch information for app ${APP_ID} branch ${BRANCH}...`);
  const result = runAwsCommand(`aws amplify get-branch --app-id ${APP_ID} --branch-name ${BRANCH}`);
  return result ? JSON.parse(result) : null;
}

// Check if OpenAI API key is configured in Amplify
function checkAmplifyOpenAIKey() {
  console.log('Checking if OpenAI API key is configured in Amplify...');
  
  const branchData = getBranchInfo();
  
  if (!branchData || !branchData.branch || !branchData.branch.environmentVariables) {
    console.error('Could not retrieve branch information from Amplify.');
    return false;
  }
  
  const envVars = branchData.branch.environmentVariables;
  return 'OPENAI_API_KEY' in envVars;
}

// Check if OpenAI API key is configured locally
function checkLocalOpenAIKey() {
  console.log('Checking if OpenAI API key is configured locally...');
  
  // Check .env.local file
  const localEnvPath = path.join(process.cwd(), '.env.local');
  const localEnvVars = parseEnvFile(localEnvPath);
  
  if ('OPENAI_API_KEY' in localEnvVars) {
    return true;
  }
  
  // Check environment variables
  return !!process.env.OPENAI_API_KEY;
}

// Get OpenAI API key from environment
function getOpenAIKeyFromEnv() {
  // First check process.env
  if (process.env.OPENAI_API_KEY) {
    return process.env.OPENAI_API_KEY;
  }
  
  // Then check .env.local
  const localEnvPath = path.join(process.cwd(), '.env.local');
  const localEnvVars = parseEnvFile(localEnvPath);
  
  return localEnvVars.OPENAI_API_KEY || null;
}

// Push OpenAI API key to Amplify
function pushOpenAIKeyToAmplify() {
  console.log('Pushing OpenAI API key to Amplify...');
  
  const openAIKey = getOpenAIKeyFromEnv();
  
  if (!openAIKey) {
    console.error('OpenAI API key not found in environment variables or .env.local');
    return false;
  }
  
  // Get current environment variables from Amplify
  const branchData = getBranchInfo();
  
  if (!branchData || !branchData.branch) {
    console.error('Could not retrieve branch information from Amplify.');
    return false;
  }
  
  // Merge environment variables, adding the OpenAI API key
  const amplifyEnvVars = branchData.branch.environmentVariables || {};
  const mergedEnvVars = { ...amplifyEnvVars, OPENAI_API_KEY: openAIKey };
  
  // Update environment variables in Amplify
  const envVarsJson = JSON.stringify(mergedEnvVars);
  const result = runAwsCommand(`aws amplify update-branch --app-id ${APP_ID} --branch-name ${BRANCH} --environment-variables '${envVarsJson}'`);
  
  return !!result;
}

// Main function
async function main() {
  console.log('OpenAI API Key Setup for AWS Amplify');
  console.log('====================================');
  
  const isLocalKeyConfigured = checkLocalOpenAIKey();
  const isAmplifyKeyConfigured = checkAmplifyOpenAIKey();
  
  console.log(`Local OpenAI API key: ${isLocalKeyConfigured ? 'Configured ✅' : 'Not configured ❌'}`);
  console.log(`Amplify OpenAI API key: ${isAmplifyKeyConfigured ? 'Configured ✅' : 'Not configured ❌'}`);
  
  if (!isLocalKeyConfigured) {
    console.log('\n⚠️ OpenAI API key is not configured locally.');
    console.log('Please set the OPENAI_API_KEY environment variable or add it to .env.local');
    return;
  }
  
  if (!isAmplifyKeyConfigured) {
    console.log('\n⚠️ OpenAI API key is not configured in Amplify.');
    console.log('Attempting to push the key from local environment to Amplify...');
    
    const success = pushOpenAIKeyToAmplify();
    
    if (success) {
      console.log('✅ Successfully pushed OpenAI API key to Amplify!');
    } else {
      console.log('❌ Failed to push OpenAI API key to Amplify.');
      console.log('Please run "npm run env:push" to manually push environment variables to Amplify.');
    }
  } else {
    console.log('\n✅ OpenAI API key is properly configured in both local environment and Amplify.');
  }
}

// Run the main function
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
