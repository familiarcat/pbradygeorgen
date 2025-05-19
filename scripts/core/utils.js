/**
 * Utilities for AlexAI
 * 
 * This module provides common utility functions used across the application.
 */

const fs = require('fs');
const path = require('path');
const { createLogger } = require('./logger');
const config = require('./config');

const logger = createLogger('utils');

/**
 * Ensure a directory exists, creating it if necessary
 * 
 * @param {string} dirPath - The directory path
 * @returns {boolean} - True if the directory exists or was created
 */
function ensureDir(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      logger.info(`Creating directory: ${dirPath}`);
      fs.mkdirSync(dirPath, { recursive: true });
    }
    return true;
  } catch (error) {
    logger.error(`Failed to create directory ${dirPath}: ${error.message}`);
    return false;
  }
}

/**
 * Create a timestamp string in the format YYYYMMDD_HHMMSS
 * 
 * @returns {string} - The timestamp string
 */
function createTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}_${hours}${minutes}${seconds}`;
}

/**
 * Create a backup of a file
 * 
 * @param {string} filePath - The path to the file to backup
 * @param {string} backupDir - The directory to store the backup
 * @returns {string|null} - The path to the backup file, or null if the backup failed
 */
function backupFile(filePath, backupDir = config.paths.backup) {
  try {
    if (!fs.existsSync(filePath)) {
      logger.warning(`Cannot backup non-existent file: ${filePath}`);
      return null;
    }
    
    // Ensure the backup directory exists
    ensureDir(backupDir);
    
    // Create the backup filename
    const fileName = path.basename(filePath);
    const fileExt = path.extname(fileName);
    const fileNameWithoutExt = path.basename(fileName, fileExt);
    const timestamp = createTimestamp();
    const backupFileName = `${fileNameWithoutExt}_${timestamp}${fileExt}`;
    const backupPath = path.join(backupDir, backupFileName);
    
    // Copy the file
    fs.copyFileSync(filePath, backupPath);
    logger.success(`Created backup: ${backupPath}`);
    
    return backupPath;
  } catch (error) {
    logger.error(`Failed to backup file ${filePath}: ${error.message}`);
    return null;
  }
}

/**
 * Save data to a JSON file
 * 
 * @param {string} filePath - The path to the file
 * @param {Object} data - The data to save
 * @param {Object} options - Options for saving
 * @returns {boolean} - True if the file was saved successfully
 */
function saveJson(filePath, data, options = {}) {
  try {
    const { pretty = true, backup = false } = options;
    
    // Create the directory if it doesn't exist
    const dirPath = path.dirname(filePath);
    ensureDir(dirPath);
    
    // Backup the file if requested
    if (backup && fs.existsSync(filePath)) {
      backupFile(filePath);
    }
    
    // Save the file
    const jsonString = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
    fs.writeFileSync(filePath, jsonString);
    logger.success(`Saved JSON file: ${filePath}`);
    
    return true;
  } catch (error) {
    logger.error(`Failed to save JSON file ${filePath}: ${error.message}`);
    return false;
  }
}

/**
 * Load data from a JSON file
 * 
 * @param {string} filePath - The path to the file
 * @param {*} defaultValue - The default value to return if the file doesn't exist
 * @returns {Object|*} - The loaded data or the default value
 */
function loadJson(filePath, defaultValue = null) {
  try {
    if (!fs.existsSync(filePath)) {
      logger.warning(`JSON file not found: ${filePath}`);
      return defaultValue;
    }
    
    const jsonString = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(jsonString);
  } catch (error) {
    logger.error(`Failed to load JSON file ${filePath}: ${error.message}`);
    return defaultValue;
  }
}

/**
 * Save text to a file
 * 
 * @param {string} filePath - The path to the file
 * @param {string} text - The text to save
 * @param {Object} options - Options for saving
 * @returns {boolean} - True if the file was saved successfully
 */
function saveText(filePath, text, options = {}) {
  try {
    const { backup = false } = options;
    
    // Create the directory if it doesn't exist
    const dirPath = path.dirname(filePath);
    ensureDir(dirPath);
    
    // Backup the file if requested
    if (backup && fs.existsSync(filePath)) {
      backupFile(filePath);
    }
    
    // Save the file
    fs.writeFileSync(filePath, text);
    logger.success(`Saved text file: ${filePath}`);
    
    return true;
  } catch (error) {
    logger.error(`Failed to save text file ${filePath}: ${error.message}`);
    return false;
  }
}

/**
 * Load text from a file
 * 
 * @param {string} filePath - The path to the file
 * @param {string} defaultValue - The default value to return if the file doesn't exist
 * @returns {string|*} - The loaded text or the default value
 */
function loadText(filePath, defaultValue = '') {
  try {
    if (!fs.existsSync(filePath)) {
      logger.warning(`Text file not found: ${filePath}`);
      return defaultValue;
    }
    
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    logger.error(`Failed to load text file ${filePath}: ${error.message}`);
    return defaultValue;
  }
}

module.exports = {
  ensureDir,
  createTimestamp,
  backupFile,
  saveJson,
  loadJson,
  saveText,
  loadText
};
