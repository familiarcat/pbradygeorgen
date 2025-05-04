/**
 * Script Consolidation Utility
 * 
 * This script helps organize and consolidate scripts in the project.
 * It identifies unused scripts and moves them to an 'archive' folder.
 * 
 * Following Hesse's philosophy of balance, this script maintains equilibrium
 * between preserving historical code and maintaining a clean project structure.
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
const ROOT_DIR = process.cwd();
const SCRIPTS_DIR = path.join(ROOT_DIR, 'scripts');
const ARCHIVE_DIR = path.join(SCRIPTS_DIR, 'archive');

// Essential scripts that should not be archived
const ESSENTIAL_SCRIPTS = [
  'manage-pdf-references.js',
  'extract-pdf-text-improved.js',
  'generate-improved-markdown.js',
  'monitor-amplify-logs.sh',
  'consolidate-scripts.js',
  'fix-standalone-directory.js'
];

/**
 * Creates the archive directory if it doesn't exist
 */
function createArchiveDirectory() {
  if (!fs.existsSync(ARCHIVE_DIR)) {
    log.info('Creating archive directory...');
    fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
    log.success('Archive directory created.');
  }
}

/**
 * Gets a list of all scripts in the scripts directory
 */
function getAllScripts() {
  log.info('Getting list of all scripts...');
  
  const scripts = fs.readdirSync(SCRIPTS_DIR)
    .filter(file => {
      const filePath = path.join(SCRIPTS_DIR, file);
      return fs.statSync(filePath).isFile() && 
             (file.endsWith('.js') || file.endsWith('.sh')) &&
             file !== '.DS_Store';
    });
  
  log.success(`Found ${scripts.length} scripts.`);
  return scripts;
}

/**
 * Checks if a script is used in the project
 */
function isScriptUsed(scriptName) {
  try {
    // Check if the script is in the essential list
    if (ESSENTIAL_SCRIPTS.includes(scriptName)) {
      return true;
    }
    
    // Check if the script is referenced in any file
    const result = execSync(`grep -r "${scriptName}" --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" --include="*.sh" --include="*.json" --exclude-dir="node_modules" --exclude-dir=".next" --exclude-dir="scripts/archive" ${ROOT_DIR}`, { encoding: 'utf8' });
    
    // If the script is only referenced in itself, it's not used elsewhere
    const lines = result.split('\n').filter(line => line.trim() !== '');
    if (lines.length === 1 && lines[0].includes(`scripts/${scriptName}`)) {
      return false;
    }
    
    return lines.length > 0;
  } catch (error) {
    // If grep returns no results, the script is not used
    return false;
  }
}

/**
 * Archives unused scripts
 */
function archiveUnusedScripts(scripts) {
  log.info('Checking for unused scripts...');
  
  let archivedCount = 0;
  
  for (const script of scripts) {
    if (!isScriptUsed(script)) {
      log.warning(`Script '${script}' appears to be unused.`);
      
      // Move the script to the archive directory
      const sourcePath = path.join(SCRIPTS_DIR, script);
      const destPath = path.join(ARCHIVE_DIR, script);
      
      try {
        fs.copyFileSync(sourcePath, destPath);
        fs.unlinkSync(sourcePath);
        log.success(`Archived '${script}'.`);
        archivedCount++;
      } catch (error) {
        log.error(`Failed to archive '${script}': ${error.message}`);
      }
    }
  }
  
  if (archivedCount === 0) {
    log.success('No unused scripts found.');
  } else {
    log.success(`Archived ${archivedCount} unused scripts.`);
  }
}

/**
 * Creates a README file in the archive directory
 */
function createArchiveReadme() {
  const readmePath = path.join(ARCHIVE_DIR, 'README.md');
  const content = `# Archived Scripts

This directory contains scripts that are no longer actively used in the project but are preserved for reference.

## Why Archive?

Following Hesse's philosophy of balance, we maintain equilibrium between preserving historical code and maintaining a clean project structure.

## Usage

If you need to use one of these scripts, consider moving it back to the main scripts directory or refactoring its functionality into a current script.

## Archive Date

Last archive operation: ${new Date().toISOString()}
`;

  fs.writeFileSync(readmePath, content);
  log.success('Created README file in archive directory.');
}

/**
 * Main function
 */
function main() {
  log.info('Starting script consolidation...');
  
  createArchiveDirectory();
  const scripts = getAllScripts();
  archiveUnusedScripts(scripts);
  createArchiveReadme();
  
  log.success('Script consolidation completed successfully.');
}

// Execute main function
main();
