#!/usr/bin/env node

/**
 * AlexAI Command Line Utility
 * 
 * This utility provides a command-line interface for AlexAI functionality.
 * It follows the format: npx alex <command> [params]
 * 
 * Philosophical Framework:
 * - Salinger: Intuitive user interaction
 * - Dante: Methodical logging of the process
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

/**
 * Log a message with a prefix and color
 * 
 * @param {string} prefix Message prefix
 * @param {string} message Message content
 * @param {string} color ANSI color code
 */
function log(prefix, message, color = colors.reset) {
  console.log(`${color}${colors.bright}[${prefix}]${colors.reset} ${message}`);
}

/**
 * Run a command and log the output
 * 
 * @param {string} command Command to run
 * @param {string} description Description of the command
 * @returns {boolean} Success status
 */
function runCommand(command, description) {
  log('RUN', description, colors.blue);
  console.log(`$ ${command}`);
  
  try {
    execSync(command, { stdio: 'inherit' });
    log('SUCCESS', 'Command completed successfully', colors.green);
    return true;
  } catch (error) {
    log('ERROR', `Command failed with exit code ${error.status}`, colors.red);
    return false;
  }
}

/**
 * Display the help message
 */
function displayHelp() {
  console.log(`
${colors.bright}${colors.cyan}AlexAI Command Line Utility${colors.reset}

Usage: npx alex <command> [params]

Commands:
  ${colors.bright}pdf${colors.reset}                  Open the PDF Manager
  ${colors.bright}pdf:select${colors.reset}           Select a PDF file
  ${colors.bright}pdf:extract${colors.reset} [path]   Extract content from a PDF
  ${colors.bright}build${colors.reset}                Build the application
  ${colors.bright}start${colors.reset}                Start the application
  ${colors.bright}deploy${colors.reset}               Deploy to AWS
  ${colors.bright}test${colors.reset}                 Run tests
  ${colors.bright}help${colors.reset}                 Display this help message

Examples:
  npx alex pdf
  npx alex pdf:select
  npx alex pdf:extract public/my-resume.pdf
  npx alex build
  npx alex start
  npx alex deploy
  npx alex test
  `);
}

/**
 * Main function
 */
function main() {
  // Get the command and parameters
  const args = process.argv.slice(2);
  const command = args[0];
  const params = args.slice(1);
  
  // Check if a command was provided
  if (!command) {
    log('ERROR', 'No command provided', colors.red);
    displayHelp();
    process.exit(1);
  }
  
  // Execute the command
  switch (command) {
    case 'pdf':
      runCommand('npm run pdf', 'Opening the PDF Manager');
      break;
    case 'pdf:select':
      runCommand('npm run pdf:select', 'Selecting a PDF file');
      break;
    case 'pdf:extract':
      if (params.length > 0) {
        runCommand(`npm run pdf:extract:custom -- "${params[0]}"`, `Extracting content from ${params[0]}`);
      } else {
        runCommand('npm run pdf:extract:default', 'Extracting content from the default PDF');
      }
      break;
    case 'build':
      runCommand('npm run build', 'Building the application');
      break;
    case 'start':
      runCommand('npm run start', 'Starting the application');
      break;
    case 'deploy':
      runCommand('npm run deploy:aws', 'Deploying to AWS');
      break;
    case 'test':
      runCommand('npm run test:pdf-extraction', 'Running tests');
      break;
    case 'help':
      displayHelp();
      break;
    default:
      log('ERROR', `Unknown command: ${command}`, colors.red);
      displayHelp();
      process.exit(1);
  }
}

// Run the main function
main();
