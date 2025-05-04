/**
 * Amplify Environment Setup Script
 * 
 * This script helps set up and configure Amplify environments for deployment.
 * It follows Hesse's philosophy of balance by maintaining equilibrium between
 * development and production environments.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { promisify } = require('util');
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

// Dante-inspired logging
const log = {
  info: (message) => console.log(`👑🌊 [Dante:Purgatorio] ${message}`),
  success: (message) => console.log(`👑⭐ [Dante:Paradiso] ${message}`),
  warning: (message) => console.log(`👑🔥 [Dante:Inferno:Warning] ${message}`),
  error: (message) => console.log(`👑🔥 [Dante:Inferno:Error] ${message}`)
};

// Get the current branch name
function getCurrentBranch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
  } catch (error) {
    log.warning(`Could not determine current branch: ${error.message}`);
    return 'dev';
  }
}

// Create Amplify environment configuration
async function setupAmplifyEnvironment() {
  const branch = getCurrentBranch();
  log.info(`Setting up Amplify environment for branch: ${branch}`);
  
  // Create the .config directory if it doesn't exist
  const configDir = path.join(process.cwd(), 'amplify', '.config');
  if (!fs.existsSync(configDir)) {
    await mkdir(configDir, { recursive: true });
  }
  
  // Create local-env-info.json
  const localEnvInfo = {
    projectPath: process.cwd(),
    defaultEditor: 'code',
    envName: branch === 'main' || branch === 'master' ? 'prod' : 'dev'
  };
  
  await writeFile(
    path.join(configDir, 'local-env-info.json'),
    JSON.stringify(localEnvInfo, null, 2)
  );
  log.success('Created local-env-info.json');
  
  // Create project-config.json
  const projectConfig = {
    projectName: 'alexai',
    version: '3.1',
    frontend: 'javascript',
    javascript: {
      framework: 'react',
      config: {
        SourceDir: 'src',
        DistributionDir: '.next',
        BuildCommand: 'npm run build',
        StartCommand: 'npm run start'
      }
    },
    providers: [
      'awscloudformation'
    ]
  };
  
  await writeFile(
    path.join(configDir, 'project-config.json'),
    JSON.stringify(projectConfig, null, 2)
  );
  log.success('Created project-config.json');
  
  // Create team-provider-info.json
  const teamProviderInfo = {
    dev: {
      awscloudformation: {
        AuthRoleName: 'amplify-alexai-dev-authRole',
        UnauthRoleName: 'amplify-alexai-dev-unauthRole',
        AuthRoleArn: 'arn:aws:iam::*:role/amplify-alexai-dev-authRole',
        UnauthRoleArn: 'arn:aws:iam::*:role/amplify-alexai-dev-unauthRole',
        Region: 'us-east-1'
      }
    },
    prod: {
      awscloudformation: {
        AuthRoleName: 'amplify-alexai-prod-authRole',
        UnauthRoleName: 'amplify-alexai-prod-unauthRole',
        AuthRoleArn: 'arn:aws:iam::*:role/amplify-alexai-prod-authRole',
        UnauthRoleArn: 'arn:aws:iam::*:role/amplify-alexai-prod-unauthRole',
        Region: 'us-east-1'
      }
    }
  };
  
  await writeFile(
    path.join(configDir, 'team-provider-info.json'),
    JSON.stringify(teamProviderInfo, null, 2)
  );
  log.success('Created team-provider-info.json');
  
  log.success(`Amplify environment setup complete for branch: ${branch}`);
}

// Main function
async function main() {
  try {
    await setupAmplifyEnvironment();
  } catch (error) {
    log.error(`Failed to set up Amplify environment: ${error.message}`);
    process.exit(1);
  }
}

// Run the main function
main();
