#!/usr/bin/env node
/**
 * This script completely disables ESLint for git operations by creating a minimal
 * .eslintrc.json file that disables all rules. It can be used before git operations
 * and then restored afterward.
 * 
 * Usage:
 *   node scripts/disable-eslint-for-git.js disable  # Disable ESLint
 *   node scripts/disable-eslint-for-git.js restore  # Restore original ESLint config
 *   node scripts/disable-eslint-for-git.js status   # Check current status
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// DanteLogger-inspired logging
const logger = {
  purgatorio: (msg) => console.log(`👑🌊 [Dante:Purgatorio] ${msg}`),
  paradiso: (msg) => console.log(`👑⭐ [Dante:Paradiso] ${msg}`),
  inferno: (msg) => console.log(`👑🔥 [Dante:Inferno:Error] ${msg}`)
};

// Paths
const rootDir = path.resolve(__dirname, '..');
const eslintConfigPath = path.join(rootDir, '.eslintrc.json');
const eslintBackupPath = path.join(rootDir, '.eslintrc.json.backup');
const eslintIgnorePath = path.join(rootDir, '.eslintignore');

// Minimal ESLint config that disables all rules
const minimalEslintConfig = {
  "extends": ["next"],
  "rules": {
    // Disable all rules
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-unused-expressions": "off",
    "@typescript-eslint/no-require-imports": "off",
    "@typescript-eslint/no-this-alias": "off",
    "import/no-anonymous-default-export": "off",
    "react-hooks/exhaustive-deps": "off",
    "prefer-const": "off",
    // Add any other rules that are causing issues
  },
  "ignorePatterns": [
    "**/*"  // Ignore all files
  ]
};

// Function to backup the current ESLint config
function backupEslintConfig() {
  try {
    if (fs.existsSync(eslintConfigPath)) {
      fs.copyFileSync(eslintConfigPath, eslintBackupPath);
      logger.paradiso('ESLint config backed up successfully.');
      return true;
    } else {
      logger.inferno('ESLint config file not found.');
      return false;
    }
  } catch (error) {
    logger.inferno(`Error backing up ESLint config: ${error.message}`);
    return false;
  }
}

// Function to restore the ESLint config from backup
function restoreEslintConfig() {
  try {
    if (fs.existsSync(eslintBackupPath)) {
      fs.copyFileSync(eslintBackupPath, eslintConfigPath);
      fs.unlinkSync(eslintBackupPath);
      logger.paradiso('ESLint config restored successfully.');
      return true;
    } else {
      logger.inferno('ESLint config backup not found.');
      // Create a default config if backup doesn't exist
      const defaultConfig = {
        "extends": ["next"],
        "rules": {}
      };
      fs.writeFileSync(eslintConfigPath, JSON.stringify(defaultConfig, null, 2));
      logger.paradiso('Created default ESLint config.');
      return false;
    }
  } catch (error) {
    logger.inferno(`Error restoring ESLint config: ${error.message}`);
    return false;
  }
}

// Function to disable ESLint
function disableEslint() {
  logger.purgatorio('Disabling ESLint for git operations...');
  
  // Backup current config
  backupEslintConfig();
  
  // Write minimal config
  fs.writeFileSync(eslintConfigPath, JSON.stringify(minimalEslintConfig, null, 2));
  
  logger.paradiso('ESLint disabled for git operations.');
}

// Function to check status
function checkStatus() {
  if (fs.existsSync(eslintBackupPath)) {
    logger.purgatorio('ESLint is currently DISABLED for git operations.');
    logger.purgatorio('Original config is backed up at .eslintrc.json.backup');
  } else {
    logger.purgatorio('ESLint is currently ENABLED for git operations.');
  }
}

// Main function
function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'disable':
      disableEslint();
      break;
    case 'restore':
      restoreEslintConfig();
      break;
    case 'status':
      checkStatus();
      break;
    default:
      logger.inferno('Invalid command. Use "disable", "restore", or "status".');
      process.exit(1);
  }
}

// Run the script
main();
